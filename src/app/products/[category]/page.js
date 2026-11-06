import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import PageHeader from '@/components/PageHeader'
import ProductCard from '@/components/ProductCard'
import Reveal from '@/components/Reveal'
import CardGrid from '@/components/CardGrid'
import { getCategories, getCategory, getProductsByCategory, SERVICE_SLUGS } from '@/lib/queries'

export async function generateMetadata({ params }) {
  const { category } = await params
  const c = await getCategory(category)
  return c ? { title: c.name, description: c.description } : { title: 'Category' }
}

export default async function CategoryPage({ params }) {
  const { category } = await params
  // Kitchens and house interiors live on their own page
  if (SERVICE_SLUGS.includes(category)) redirect('/interiors')
  // The old "Others" page is now "Colours"
  if (category === 'others' || category === 'colours') redirect('/colours')

  const [cat, products, categories] = await Promise.all([getCategory(category), getProductsByCategory(category), getCategories()])
  if (!cat) notFound()

  return (
    <>
      <PageHeader title={cat.name} text={cat.description} />
      <section className="mx-auto max-w-6xl px-5 py-12">
        
        {/* Fixed: Center-la irunthathu, ippo left-aligned & horizontal scrollable row-a mariduchu */}
        <div className="mb-8 w-full overflow-x-auto pb-2 scrollbar-none" style={{ textAlign: 'left' }}>
          <div className="inline-flex items-center gap-2 min-w-max">
            <Link href="/products" className="rounded-full border border-lightgray bg-white px-4 py-2 text-sm hover:border-cerulean hover:text-cerulean">All</Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products/${c.slug}`}
                className={`rounded-full border px-4 py-2 text-sm transition ${c.slug === category ? 'border-cerulean bg-cerulean text-white' : 'border-lightgray bg-white hover:border-cerulean hover:text-cerulean'}`}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            <p>New {cat.name.toLowerCase()} designs are coming soon. <Link href="/contact" className="text-cerulean underline">Contact us</Link> to see what we can make for you.</p>
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