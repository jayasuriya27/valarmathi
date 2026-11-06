import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { validateCustomDesign } from '@/lib/custom-design'
import { MAX_FILES, MAX_TOTAL_MB, MAX_TOTAL_BYTES } from '@/lib/upload-rules'
import { prepareFiles, saveFiles } from '@/lib/custom-design-files'

export const runtime = 'nodejs'

// Simple spam limit: 5 requests per 10 minutes per IP
const hits = new Map()
const WINDOW = 10 * 60 * 1000
const MAX = 5
function tooMany(ip) {
  const now = Date.now()
  if (hits.size > 1000) for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW)) hits.delete(k)
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX
}
const fail = (error, status = 400, extra = {}) => NextResponse.json({ error, ...extra }, { status })

// Shown to the customer and in the admin: CD-2026-00012
const requestNo = (id, date = new Date()) => `CD-${date.getFullYear()}-${String(id).padStart(5, '0')}`

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'
  if (tooMany(ip)) return fail('Too many requests. Please try again after some time.', 429)

  // Refuse a huge upload before reading it (1 MB extra room for the text fields)
  const length = Number(request.headers.get('content-length') || 0)
  if (length > MAX_TOTAL_BYTES + 1024 * 1024) {
    return fail(`All files together must be under ${MAX_TOTAL_MB} MB. Please attach smaller files.`, 413, { field: 'files' })
  }

  let body = {}
  let uploads = []
  try {
    const form = await request.formData()
    body = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === 'string'))
    body.finishes = form.getAll('finishes').filter((v) => typeof v === 'string')
    uploads = form.getAll('files').filter((f) => typeof f !== 'string' && f.size > 0)
  } catch {
    return fail('Invalid request.')
  }

  if (body.website) return NextResponse.json({ success: true }) // hidden bot field

  const { values, errors } = validateCustomDesign(body)
  const firstField = Object.keys(errors)[0]
  if (firstField) return fail(errors[firstField], 400, { field: firstField, errors })

  if (uploads.length > MAX_FILES) return fail(`You can attach up to ${MAX_FILES} files.`, 400, { field: 'files' })
  const prepared = await prepareFiles(uploads)
  if (!prepared.ok) return fail(prepared.error, 400, { field: 'files' })

  const v = values
  const client = await pool.connect()
  try {
    // double-click protection: same phone + same message in the last 10 minutes is saved only once
    const same = await client.query(
      `SELECT id, created_at FROM custom_requests WHERE phone = $1 AND furniture_type = $2 AND COALESCE(message, '') = $3
         AND created_at > NOW() - INTERVAL '10 minutes' LIMIT 1`,
      [v.phone, v.furniture_type, v.message]
    )
    if (same.rows.length > 0) return NextResponse.json({ success: true, requestNo: requestNo(same.rows[0].id, same.rows[0].created_at) })

    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO custom_requests
        (name, phone, email, furniture_type, room_type, room_length, room_width, room_height,
         site_visit, finishes, finish_help, budget, needed_by, location, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id, created_at`,
      [v.name, v.phone, v.email || null, v.furniture_type, v.room_type || null, v.room_length, v.room_width, v.room_height,
       v.site_visit, v.finishes, v.finish_help, v.budget || null, v.needed_by || null, v.location || null, v.message || null]
    )
    const id = rows[0].id

    // Files are saved in the database inside the same transaction as the request
    if (prepared.files.length) await saveFiles(client, id, prepared.files, 'custom-designs')

    await client.query('COMMIT')
    return NextResponse.json({ success: true, requestNo: requestNo(id, rows[0].created_at) })
  } catch (err) {
    // ROLLBACK also removes the files, so nothing is left behind
    await client.query('ROLLBACK').catch(() => {})
    console.error('Custom request save failed:', err.message)
    return fail('Server problem while saving your request. Please call us directly.', 500)
  } finally {
    client.release()
  }
}