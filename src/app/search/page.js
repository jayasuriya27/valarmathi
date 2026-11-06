import Link from 'next/link'
import { MessageCircle, ArrowRight } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import SearchBox from '@/components/SearchBox'
import ProductCard from '@/components/ProductCard'
import SmartImage from '@/components/SmartImage'
import Reveal from '@/components/Reveal'
import { searchAll } from '@/lib/search'
import { waLink } from '@/lib/site'

export const metadata = {
  title: 'Search',
  description: 'Search Valarmathi Industries products, interiors and colours.',
}

const popular = ['Wardrobe', 'TV unit', 'Dressing table', 'Cot', 'Pooja rack', 'Kitchen', 'Bedroom', 'Mahogany']

function Group({ title, children }) {
  return (
    <div className="mb-12">
      <h2 className="mb-5 font-display text-2xl text-ink sm:text-3xl">{title}</h2>
      {children}
    </div>
  )
}

export default async function SearchPage({ searchParams }) {
  const { q = '' } = await searchParams
  const r = await searchAll(q, { limit: 40 })
  const searched = q.trim().length > 0

  return (
    <>
      <PageHeader title="Search" text="Find products, interiors, colours and pages across the whole website." />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mx-auto mb-10 max-w-2xl">
          <SearchBox defaultValue={q} placeholder="Search wardrobe, kitchen, mahogany, dressing table…" />
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-charcoal">
            Popular:
            {popular.map((w) => (
              <Link key={w} href={`/search?q=${encodeURIComponent(w)}`} className="rounded-full border border-lightgray bg-white px-3 py-1 transition hover:border-cerulean hover:text-cerulean">
                {w}
              </Link>
            ))}
          </p>
        </div>

        {searched && r.total === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p>
              Nothing found for “{q}”. Try another word, or tell us what you need and we will help.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">Contact us</Link>
              <a href={waLink(`Hi, I was looking for "${q}" on your website.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95">
                <MessageCircle size={18} /> WhatsApp us
              </a>
            </div>
          </div>
        )}

        {r.products.length > 0 && (
          <Group title="Products and designs">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {r.products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.06}>
                  {p.isInterior ? (
                    <a href={p.href} className="group block overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
                      <SmartImage src={p.images?.[0]} alt={p.name} fit="cover" className="h-56 w-full transition duration-500 group-hover:scale-105" />
                      <div className="p-4">
                        <p className="text-xs text-charcoal">Interiors</p>
                        <h3 className="font-semibold text-ink">{p.name}</h3>
                      </div>
                    </a>
                  ) : (
                    <ProductCard product={p} />
                  )}
                </Reveal>
              ))}
            </div>
          </Group>
        )}

        {r.interiors.length > 0 && (
          <Group title="Interiors">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {r.interiors.map((t) => (
                <a key={t.id} href={t.href} className="group relative block h-44 overflow-hidden rounded-2xl border border-lightgray/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]">
                  <SmartImage src={t.image} alt={t.label} fit="cover" className="h-full w-full transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="font-display text-xl">{t.label}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-lime">See designs <ArrowRight size={14} /></span>
                  </div>
                </a>
              ))}
            </div>
          </Group>
        )}

        {r.colours.length > 0 && (
          <Group title="Colours">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {r.colours.map((c) => (
                <a key={c.name} href={c.href} className="group overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]">
                  <SmartImage src={c.image} alt={c.name} fit="cover" className="h-28 w-full transition duration-500 group-hover:scale-105" />
                  <p className="px-3 py-2 text-sm font-medium text-ink">{c.name}</p>
                </a>
              ))}
            </div>
          </Group>
        )}

        {r.categories.length > 0 && (
          <Group title="Categories">
            <div className="flex flex-wrap gap-3">
              {r.categories.map((c) => (
                <Link key={c.slug} href={c.href} className="inline-flex items-center gap-1 rounded-full border border-lightgray bg-white px-5 py-2 font-medium text-ink transition hover:border-cerulean hover:text-cerulean">
                  {c.name} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </Group>
        )}

        {r.pages.length > 0 && (
          <Group title="Pages">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {r.pages.map((p) => (
                <Link key={p.href} href={p.href} className="rounded-2xl border border-lightgray/60 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-cerulean/50 hover:shadow-lg active:scale-[0.98]">
                  <h3 className="font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm">{p.sub}</p>
                </Link>
              ))}
            </div>
          </Group>
        )}
      </section>
    </>
  )
}
