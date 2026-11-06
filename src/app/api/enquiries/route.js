import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { validateEnquiry } from '@/lib/validation'
import { MAX_FILES, MAX_TOTAL_MB, MAX_TOTAL_BYTES } from '@/lib/upload-rules'
import { prepareFiles, saveFiles } from '@/lib/custom-design-files'

export const runtime = 'nodejs'

// Simple spam limit: 5 enquiries per 10 minutes per IP
const hits = new Map()
const WINDOW = 10 * 60 * 1000
const MAX = 5

function tooMany(ip) {
  const now = Date.now()
  if (hits.size > 1000) {
    // clean old entries so the Map does not grow for ever
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW)) hits.delete(k)
  }
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX
}

const fail = (error, status = 400, extra = {}) => NextResponse.json({ error, ...extra }, { status })

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (tooMany(ip)) return fail('Too many enquiries. Please try again after some time.', 429)

  // Refuse a huge upload before reading it (1 MB extra room for the text fields)
  const length = Number(request.headers.get('content-length') || 0)
  if (length > MAX_TOTAL_BYTES + 1024 * 1024) {
    return fail(`All files together must be under ${MAX_TOTAL_MB} MB. Please attach smaller files.`, 413, { field: 'files' })
  }

  // The form sends FormData (text fields + files). Plain JSON is still accepted (no files).
  let body = {}
  let uploads = []
  try {
    if ((request.headers.get('content-type') || '').includes('multipart/form-data')) {
      const form = await request.formData()
      body = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'))
      uploads = form.getAll('files').filter((f) => typeof f !== 'string' && f.size > 0)
    } else {
      body = await request.json()
    }
  } catch {
    return fail('Invalid request.')
  }

  // Hidden bot field: real people never fill it
  if (body.website) return NextResponse.json({ success: true })

  // Same rules as the browser form
  const { values, errors } = validateEnquiry(body)
  const firstField = Object.keys(errors)[0]
  if (firstField) return fail(errors[firstField], 400, { field: firstField, errors })
  const { name, phone, email, enquiry_type, message, product_name, room_length, room_width } = values

  if (uploads.length > MAX_FILES) return fail(`You can attach up to ${MAX_FILES} files.`, 400, { field: 'files' })
  const prepared = await prepareFiles(uploads)
  if (!prepared.ok) return fail(prepared.error, 400, { field: 'files' })

  const client = await pool.connect()
  try {
    // Double-click / refresh protection: skip ONLY the exact same enquiry sent in the last 10 minutes.
    // (A new message from the same customer is always saved.)
    const same = await client.query(
      `SELECT id FROM enquiries
       WHERE phone = $1
         AND COALESCE(product_name, '') = $2
         AND COALESCE(message, '') = $3
         AND created_at > NOW() - INTERVAL '10 minutes'
       LIMIT 1`,
      [phone, product_name, message]
    )
    if (same.rows.length > 0) return NextResponse.json({ success: true })

    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO enquiries (name, phone, email, enquiry_type, message, product_name, room_length, room_width)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [name, phone, email || null, enquiry_type, message || null, product_name || null, room_length, room_width]
    )
    const enquiryId = rows[0].id

    // Files are saved in the database inside the same transaction as the enquiry
    if (prepared.files.length) await saveFiles(client, enquiryId, prepared.files, 'enquiries')

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    // ROLLBACK also removes the files, so nothing is left behind
    await client.query('ROLLBACK').catch(() => {})
    console.error('Enquiry save failed:', err.message)
    return fail('Server problem while saving your enquiry. Please call us directly.', 500)
  } finally {
    client.release()
  }
}