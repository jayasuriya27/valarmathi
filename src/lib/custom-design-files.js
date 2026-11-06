// Prepares and stores uploaded files (server only). Used by the enquiry form and the custom design form.
// Files are saved inside the Postgres database (BYTEA column "data"), because serverless hosting like Netlify
// has no permanent disk. Only the admin download route can read them back.
import { randomUUID } from 'node:crypto'
import { MAX_FILE_BYTES, checkFile, checkTotal, fileExt } from './upload-rules'

export const FOLDERS = ['enquiries', 'custom-designs']

// Which table and owner column belong to which form
const TABLES = {
  enquiries: { table: 'enquiry_files', owner: 'enquiry_id' },
  'custom-designs': { table: 'custom_request_files', owner: 'request_id' },
}

const startsWith = (buf, bytes, offset = 0) => bytes.every((b, i) => buf[offset + i] === b)

// Real content check: the first bytes of the file must match its extension (a .exe renamed to .jpg is refused)
function contentMatches(ext, buf) {
  switch (ext) {
    case 'jpg': case 'jpeg': return startsWith(buf, [0xff, 0xd8, 0xff])
    case 'png': return startsWith(buf, [0x89, 0x50, 0x4e, 0x47])
    case 'webp': return startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8)
    case 'heic': return startsWith(buf, [0x66, 0x74, 0x79, 0x70], 4)
    case 'pdf': return startsWith(buf, [0x25, 0x50, 0x44, 0x46])
    case 'zip': case 'docx': return startsWith(buf, [0x50, 0x4b])
    case 'doc': return startsWith(buf, [0xd0, 0xcf, 0x11, 0xe0])
    default: return true // dwg / skp: no simple check, extension and size only
  }
}

// uploads = File objects from request.formData()
// returns { ok: true, files: [{ original_name, stored_name, mime_type, size_bytes, buffer }] } or { ok: false, error }
export async function prepareFiles(uploads = []) {
  const tooBig = checkTotal(uploads)
  if (tooBig) return { ok: false, error: tooBig }

  const files = []
  for (const f of uploads) {
    const bad = checkFile({ name: f.name, size: f.size })
    if (bad) return { ok: false, error: bad }
    const buffer = Buffer.from(await f.arrayBuffer())
    if (buffer.length > MAX_FILE_BYTES) return { ok: false, error: checkFile({ name: f.name, size: buffer.length }) }
    const ext = fileExt(f.name)
    if (!contentMatches(ext, buffer)) return { ok: false, error: `"${f.name}" does not look like a real .${ext} file.` }
    files.push({
      original_name: String(f.name).replace(/[\\/\0]/g, '_').slice(0, 255),
      stored_name: `${randomUUID()}.${ext}`,
      mime_type: String(f.type || '').slice(0, 100) || null,
      size_bytes: buffer.length,
      buffer,
    })
  }
  return { ok: true, files }
}

// Saves the files of one request/enquiry into the database.
// "client" is the database client that is already inside BEGIN ... COMMIT, so if anything fails
// the ROLLBACK removes the files together with the request (no orphan data).
export async function saveFiles(client, id, files, folder) {
  const t = TABLES[folder]
  if (!t) throw new Error('Bad upload folder')
  if (!Number.isInteger(Number(id))) throw new Error('Bad id')
  for (const f of files) {
    await client.query(
      `INSERT INTO ${t.table} (${t.owner}, original_name, stored_name, mime_type, size_bytes, data)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [Number(id), f.original_name, f.stored_name, f.mime_type, f.size_bytes, f.buffer]
    )
  }
}

// Reads one stored file for the admin download. Returns { original_name, mime_type, data } or null.
// "db" can be the pool or a client.
export async function readStoredFile(db, folder, id, stored_name) {
  const t = TABLES[folder]
  if (!t || !/^\d+$/.test(String(id))) return null
  if (!/^[a-f0-9-]{36}\.[a-z0-9]{2,5}$/.test(String(stored_name))) return null
  const { rows } = await db.query(
    `SELECT original_name, mime_type, data FROM ${t.table} WHERE ${t.owner} = $1 AND stored_name = $2`,
    [Number(id), stored_name]
  )
  return rows[0] ?? null
}