import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import CardGrid from '@/components/CardGrid'
import { categoryHref } from '@/lib/links'
import SmartImage from '@/components/SmartImage'
import SearchBox from '@/components/SearchBox'
import { getCategories, getProducts } from '@/lib/queries'
import { FINISH_DETAILS } from '@/lib/finishes'

export const metadata = {
  title: 'Products',
  description: 'TV wall units, tables, dressing tables, cots, mattresses, pooja racks and wardrobes by Valarmathi Industries.',
}

export default async function Products({ searchParams }) {
  const { q = '' } = await searchParams
  // searching now covers the whole website, so old ?q= links go to the search page
  if (q.trim()) redirect(`/search?q=${encodeURIComponent(q.trim())}`)

  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  return (
    <>
      <PageHeader title="Our products" text="Browse by category or search for a design. Looking for a kitchen or a full home interior? See our Interiors page." />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mx-auto mb-10 max-w-xl">
          <SearchBox placeholder="Search wardrobe, TV unit, pooja rack…" />
        </div>

        {/* Types, same grouping as the Products menu in the header */}
        <CardGrid className="mb-14">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06}>
              <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Link href={categoryHref(c)} className="block overflow-hidden">
                  <SmartImage src={c.image} alt={c.name} fit="cover" className="h-48 w-full transition duration-500 group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <Link href={categoryHref(c)} className="inline-block border-b-2 border-lime pb-0.5 font-semibold text-ink transition hover:text-cerulean">
                    {c.name}
                  </Link>
                  <ul className="mt-3 space-y-1.5">
                    {(c.items ?? []).slice(0, 3).map((it) => (
                      <li key={it.slug}>
                        <Link href={`/products/${c.slug}/${it.slug}`} className="inline-block text-sm text-charcoal transition hover:translate-x-1 hover:text-cerulean">
                          {it.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={categoryHref(c)} className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-cerulean">
                    View all{(c.items ?? []).length > 3 ? ` (${c.items.length})` : ''} <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </CardGrid>

        <Reveal>
          <div className="mb-14 flex flex-col gap-5 rounded-2xl border border-lightgray/60 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cerulean">Colours</p>
              <h2 className="mt-1 font-display text-2xl text-ink sm:text-3xl">Pick your finish</h2>
              <p className="mt-1 text-sm">Laminate and wood colours to choose from. Every piece is made in the colour you like.</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(FINISH_DETAILS).slice(0, 8).map(([slug, f]) => (
                <Link key={slug} href={`/colours/${slug}`} title={f.name} aria-label={f.name}
                  className="block h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-lightgray transition duration-300 hover:-translate-y-1 hover:ring-cerulean sm:h-14 sm:w-14">
                  <SmartImage src={f.image} alt={f.name} fit="cover" className="h-full w-full" />
                </Link>
              ))}
            </div>
            <Link href="/colours" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-cerulean px-6 py-3 text-sm font-semibold text-white transition hover:bg-black">
              See all colours <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <h2 className="mb-6 font-display text-3xl text-ink">All designs</h2>
        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p>Products are being updated. <Link href="/contact" className="text-cerulean underline">Contact us</Link> and tell us what you need.</p>
          </div>
        ) : (
          <CardGrid>
            {products.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 0.08}><ProductCard product={p} /></Reveal>
            ))}
          </CardGrid>
        )}
      </section>
    </>
  )
}
