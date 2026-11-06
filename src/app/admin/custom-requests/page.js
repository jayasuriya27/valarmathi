import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/admin-auth'
import { FINISH_DETAILS } from '@/lib/finishes'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Custom design requests', robots: { index: false, follow: false } }

const sizeText = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB')

const requestNo = (r) => `CD-${new Date(r.created_at).getFullYear()}-${String(r.id).padStart(5, '0')}`

export default async function CustomRequests() {
  const session = (await cookies()).get('admin_session')?.value
  if (!verifyAdminSession(session)) redirect('/admin/login')

  const { rows } = await pool.query(`
    SELECT r.*,
      COALESCE(json_agg(json_build_object('stored_name', f.stored_name, 'original_name', f.original_name, 'size_bytes', f.size_bytes) ORDER BY f.id)
        FILTER (WHERE f.id IS NOT NULL), '[]'::json) AS files
    FROM custom_requests r LEFT JOIN custom_request_files f ON f.request_id = r.id
    GROUP BY r.id ORDER BY r.created_at DESC LIMIT 300`)

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ink">Custom design requests ({rows.length})</h1>
        <Link href="/admin/enquiries" className="rounded-lg border border-lightgray px-5 py-2.5 text-sm font-semibold text-ink hover:border-cerulean">Enquiries</Link>
      </div>

      <div className="space-y-4">
        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl border border-lightgray/60 bg-white p-5 text-sm shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-ink">{r.name} <span className="font-normal text-charcoal">· {r.furniture_type}{r.room_type ? ` · ${r.room_type}` : ''}</span></p>
                <p className="text-xs font-semibold text-ink">{requestNo(r)}</p>
                <p className="text-xs text-charcoal">{new Date(r.created_at).toLocaleString('en-IN')}{r.email ? ` · ${r.email}` : ''}</p>
              </div>
              <div className="text-right">
                <a href={`tel:+91${r.phone}`} className="block font-medium text-cerulean">{r.phone}</a>
                <a href={`https://wa.me/91${r.phone}?text=${encodeURIComponent(`Hi ${r.name}, thank you for your custom design request to Valarmathi Industries. How can we help you?`)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-emerald-600 hover:underline">💬 Reply on WhatsApp</a>
              </div>
            </div>

            <dl className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2">
              <div><dt className="inline font-medium text-ink">Size: </dt><dd className="inline">
                {r.room_length ? `${Number(r.room_length)} × ${Number(r.room_width)}${r.room_height ? ` × ${Number(r.room_height)}` : ''} ft` : (r.site_visit ? '' : '-')}
                {r.room_length && r.room_height ? ' (L × W × H)' : r.room_length ? ' (L × W)' : ''}
                {r.site_visit && <span className="ml-2 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">Site visit needed</span>}
              </dd></div>
              <div><dt className="inline font-medium text-ink">Finish: </dt><dd className="inline">{r.finish_help ? 'Please suggest' : r.finishes?.length ? r.finishes.map((s) => FINISH_DETAILS[s]?.name ?? s).join(', ') : '-'}</dd></div>
              <div><dt className="inline font-medium text-ink">Budget: </dt><dd className="inline">{r.budget ?? '-'}</dd></div>
              <div><dt className="inline font-medium text-ink">Needed by: </dt><dd className="inline">{r.needed_by ?? '-'}</dd></div>
              <div><dt className="inline font-medium text-ink">Location: </dt><dd className="inline">{r.location ?? '-'}</dd></div>
            </dl>
            {r.message && <p className="mt-3 whitespace-pre-wrap">{r.message}</p>}

            {r.files.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2">
                {r.files.map((f) => (
                  <li key={f.stored_name}>
                    <a target="_blank" rel="noopener noreferrer" href={`/admin/files/custom-designs/${r.id}/${f.stored_name}`} className="inline-block rounded-full bg-smoke px-3 py-1 text-xs text-cerulean hover:underline">
                      📎 {f.original_name} ({sizeText(f.size_bytes)})
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
        {rows.length === 0 && <p className="rounded-2xl border border-lightgray/60 bg-white px-4 py-8 text-center">No custom design requests yet.</p>}
      </div>
    </section>
  )
}