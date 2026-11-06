// Admin-only download of an uploaded file. Checks the admin login and the database row before sending anything.
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyAdminSession } from '@/lib/admin-auth'
import { readStoredFile } from '@/lib/custom-design-files'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Photos and PDFs open in the browser tab; every other type (zip, doc, dwg ...) downloads.
// Content-Type comes from the file extension (not from what the visitor's browser claimed).
const INLINE = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' }

export async function GET(_req, { params }) {
  const session = (await cookies()).get('admin_session')?.value
  if (!verifyAdminSession(session)) return new NextResponse('Not allowed', { status: 401 })

  const { kind, id, file } = await params

  let row = null
  try {
    row = await readStoredFile(pool, kind, id, file)
  } catch (err) {
    console.error('File read failed:', err.message)
    return new NextResponse('Could not read the file', { status: 500 })
  }
  if (!row || !row.data) return new NextResponse('File not found', { status: 404 })

  const safeName = encodeURIComponent(row.original_name)
  const inlineType = INLINE[file.split('.').pop().toLowerCase()]
  return new NextResponse(row.data, {
    headers: {
      'Content-Type': inlineType || 'application/octet-stream',
      'Content-Disposition': `${inlineType ? 'inline' : 'attachment'}; filename*=UTF-8''${safeName}`,
      'Content-Security-Policy': "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'private, no-store',
    },
  })
}