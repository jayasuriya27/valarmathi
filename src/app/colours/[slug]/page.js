import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import SmartImage from '@/components/SmartImage'
import { FINISH_DETAILS } from '@/lib/finishes'
import { getProductsByFinish } from '@/lib/queries'
import { site, waLink } from '@/lib/site'

const customBg = 'linear-gradient(135deg,#5a1b16 0%,#a4521f 35%,#d8c3a6 70%,#e6eeeb 100%)'

// Order of the colours (same as the Colours page); "custom" is the last one
const ORDER = [...Object.keys(FINISH_DETAILS), 'custom']
const nameOf = (slug) => (slug === 'custom' ? 'Your own colour' : FINISH_DETAILS[slug].name)

export async function generateMetadata({ params }) {
  const { slug } = await params
  if (slug === 'custom') return { title: 'Your own colour', description: 'Need a colour that is not in our list? Tell us and we will check what we can do.' }
  const f = FINISH_DETAILS[slug]
  return f ? { title: `${f.name} colour`, description: f.summary } : { title: 'Colour' }
}

export default async function ColourPage({ params }) {
  const { slug } = await params
  const custom = slug === 'custom'
  const f = custom ? null : FINISH_DETAILS[slug]
  if (!custom && !f) notFound()

  const productsByFinish = await getProductsByFinish()
  const products = custom ? [] : productsByFinish[slug] ?? []

  const i = ORDER.indexOf(slug)
  const prev = ORDER[(i - 1 + ORDER.length) % ORDER.length]
  const next = ORDER[(i + 1) % ORDER.length]
  const title = custom ? 'Your own colour' : f.name
  const message = custom
    ? 'Hi, I want furniture in a customised colour. Please tell me what is possible.'
    : `Hi, I like the "${f.name}" colour. Is a product available in this colour?`

  return (
    <section className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <Link href="/colours" className="hover:text-cerulean">Colours</Link> / <span className="text-ink">{title}</span>
      </nav>

      <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <div className="overflow-hidden rounded-2xl border border-lightgray/60 bg-white">
          {custom ? (
            <div className="aspect-[4/3] w-full" style={{ backgroundImage: customBg }} />
          ) : (
            <SmartImage src={f.image} alt={f.name} fit="cover" priority className="aspect-[4/3] w-full" />
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl text-ink sm:text-4xl">{custom ? 'Customised colour' : f.name}</h1>
            {f?.badge && <span className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-black">{f.badge}</span>}
          </div>

          {custom ? (
            <p className="mt-4 text-lg">Need a colour that is not in our list? Tell us what you have in mind and we will check what we can do.</p>
          ) : (
            <>
              <p className="mt-4 text-lg">{f.summary}</p>
              <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-cerulean">Appearance &amp; Features</h2>
                  <ul className="mt-2 space-y-1">
                    {f.features.map(([k, v]) => <li key={k}><span className="font-medium text-ink">{k}:</span> {v}</li>)}
                  </ul>
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-cerulean">Care &amp; Maintenance</h2>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {f.care.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </div>
              </div>
            </>
          )}

          <p className="mt-6 text-sm">
            {custom
              ? 'Send us a photo or the colour code and we will let you know.'
              : 'Want furniture in this colour? Tell us which product you have in mind and we will confirm if it is available in this colour.'}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={waLink(message)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95">
              <MessageCircle size={18} /> Ask on WhatsApp
            </a>
            <a href={`tel:+91${site.phones[0]}`} className="inline-flex items-center gap-2 rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">
              <Phone size={18} /> Call us
            </a>
          </div>
          <p className="mt-4 text-xs">Colours on screen can look slightly different from the real laminate. Please see it at our shop before you decide.</p>
        </div>
      </div>

      {products.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 font-display text-2xl text-ink sm:text-3xl">Products in this finish</h2>
          <div className="flex flex-wrap gap-4">
            {products.map((p) => (
              <Link key={p.slug} href={`/products/${p.category_slug}/${p.slug}`} className="group w-[calc(50%-8px)] sm:w-44">
                <SmartImage src={p.image} alt={p.name} fit="cover" className="aspect-square w-full rounded-xl border border-lightgray/60 transition group-hover:opacity-85" />
                <p className="mt-2 line-clamp-2 text-sm font-medium text-ink">{p.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-14 flex items-center justify-between gap-3 border-t border-lightgray/60 pt-6 text-sm">
        <Link href={`/colours/${prev}`} className="inline-flex min-w-0 items-center gap-1 font-medium text-cerulean hover:underline"><ChevronLeft size={18} className="shrink-0" /> <span className="truncate">{nameOf(prev)}</span></Link>
        <Link href="/colours" className="shrink-0 rounded-full border border-lightgray bg-white px-4 py-2 hover:border-cerulean hover:text-cerulean">All colours</Link>
        <Link href={`/colours/${next}`} className="inline-flex min-w-0 items-center gap-1 font-medium text-cerulean hover:underline"><span className="truncate">{nameOf(next)}</span> <ChevronRight size={18} className="shrink-0" /></Link>
      </div>
    </section>
  )
}
