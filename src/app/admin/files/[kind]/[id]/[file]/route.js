// Admin-only download of an uploaded file. Checks the admin login and the database row before sending anything.
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Photos and PDFs open in the browser tab; every other type (zip, doc, dwg ...) downloads.
// Content-Type comes from the file extension (not from what the visitor's browser claimed).
const INLINE = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' }

const TABLES = {
  enquiries: { table: 'enquiry_files', owner: 'enquiry_id' },
  'custom-designs': { table: 'custom_request_files', owner: 'request_id' },
}

export async function GET(_req, { params }) {
  const session = (await cookies()).get('admin_session')?.value
  if (!verifyAdminSession(session)) return new NextResponse('Not allowed', { status: 401 })

  const { kind, id, file } = await params
  const t = TABLES[kind]
  if (!t || !/^\d+$/.test(id)) return new NextResponse('Not found', { status: 404 })

  const { rows } = await pool.query(
    `SELECT original_name, data FROM ${t.table} WHERE ${t.owner} = $1 AND stored_name = $2`,
    [Number(id), file]
  )
  if (!rows[0] || !rows[0].data) return new NextResponse('File missing on the server', { status: 404 })

  const safeName = encodeURIComponent(rows[0].original_name)
  const inlineType = INLINE[file.split('.').pop().toLowerCase()]
  return new NextResponse(new Uint8Array(rows[0].data), {
    headers: {
      'Content-Type': inlineType || 'application/octet-stream',
      'Content-Disposition': `${inlineType ? 'inline' : 'attachment'}; filename*=UTF-8''${safeName}`,
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  })
}