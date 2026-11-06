import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { logoutAction } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Enquiries',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function Enquiries() {

  // Check admin session
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value

  if (!verifyAdminSession(session)) {
    redirect('/admin/login')
  }

  // Fetch enquiries
  const { rows } = await pool.query(
    'SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 300'
  )

  // Attachments (files customers added to the enquiry form)
  const filesByEnquiry = {}
  if (rows.length) {
    const { rows: fileRows } = await pool.query(
      'SELECT enquiry_id, stored_name, original_name, size_bytes FROM enquiry_files WHERE enquiry_id = ANY($1) ORDER BY id',
      [rows.map((r) => r.id)]
    )
    for (const f of fileRows) (filesByEnquiry[f.enquiry_id] ??= []).push(f)
  }
  const sizeText = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB')

  return (

    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">
          Enquiries ({rows.length})
        </h1>

        <div className="flex items-center gap-3">
        <Link href="/admin/custom-requests" className="rounded-lg border border-lightgray px-5 py-2.5 text-sm font-semibold text-ink hover:border-cerulean">
          Custom design requests
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Logout
          </button>
        </form>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-lightgray/60 bg-white">

        <table className="w-full text-left text-sm">

          <thead className="bg-smoke text-ink">

            <tr>
              {[
                'Date',
                'Name',
                'Phone',
                'Type',
                'Product',
                'Message'
              ].map((heading) => (
                <th key={heading} className="px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>

          </thead>

          <tbody>

            {rows.map((r) => (

              <tr
                key={r.id}
                className="border-t border-lightgray/50 align-top"
              >

                <td className="whitespace-nowrap px-4 py-3">
                  {new Date(r.created_at).toLocaleString('en-IN')}
                </td>

                <td className="px-4 py-3 font-medium text-ink">

                  {r.name}

                  {r.email && (
                    <div className="text-xs font-normal">
                      {r.email}
                    </div>
                  )}

                </td>

                <td className="px-4 py-3">

                  <a
                    href={`tel:+91${r.phone}`}
                    className="block font-medium text-cerulean"
                  >
                    {r.phone}
                  </a>

                  <a
                    href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(
                      `Hi ${r.name}, thank you for contacting Valarmathi Industries regarding ${r.product_name || 'our furniture'}. How can we help you?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    💬 Reply on WhatsApp
                  </a>

                </td>

                <td className="px-4 py-3">
                  {r.enquiry_type}
                </td>

                <td className="px-4 py-3">
                  {r.product_name ?? '-'}
                </td>

                <td className="max-w-xs px-4 py-3">
                  {r.message ?? '-'}

                  {(filesByEnquiry[r.id] ?? []).length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {filesByEnquiry[r.id].map((f) => (
                        <li key={f.stored_name}>
                          <a target="_blank" rel="noopener noreferrer" href={`/admin/files/enquiries/${r.id}/${f.stored_name}`} className="inline-block rounded-full bg-smoke px-3 py-1 text-xs text-cerulean hover:underline">
                            📎 {f.original_name} ({sizeText(f.size_bytes)})
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}

                  {r.room_length && (
                    <div className="mt-2 rounded-lg bg-smoke px-3 py-2 text-xs">
                      <span className="font-semibold">Size:</span> {Number(r.room_length)} × {Number(r.room_width)} ft
                    </div>
                  )}
                </td>

              </tr>

            ))}

            {rows.length === 0 && (

              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  No enquiries yet.
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </section>

  )
}