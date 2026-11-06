import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  Phone,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Baby,
  Hand,
  Sparkles,
} from 'lucide-react'
import ProductGallery from '@/components/ProductGallery'
import ProductCard from '@/components/ProductCard'
import EnquiryForm from '@/components/EnquiryForm'
import Reveal from '@/components/Reveal'
import CardGrid from '@/components/CardGrid'
import { getProduct, getRelated, SERVICE_SLUGS } from '@/lib/queries'
import { site, waLink, mapsLink } from '@/lib/site'

export async function generateMetadata({ params }) {
  const { category, slug } = await params
  const p = await getProduct(category, slug)
  return p ? { title: p.name, description: p.description } : { title: 'Product' }
}

// Moulded edge benefits (edit the wording to match your actual workmanship)
const edgeBenefits = [
  {
    icon: Baby,
    title: 'Safe for kids',
    text: 'No sharp corners. If a child bumps into it while playing, the soft, rounded edge reduces the risk of cuts and bruises.',
  },
  {
    icon: Hand,
    title: 'Smooth to touch',
    text: 'The edge is shaped and sanded smooth, so there are no rough spots or splinters when you hold or lean on it.',
  },
  {
    icon: Sparkles,
    title: 'Neat, lasting finish',
    text: 'The edge carries the same finish as the rest of the piece, so it looks clean and holds up well to everyday use.',
  },
]

export default async function ProductDetail({ params }) {
  const { category, slug } = await params
  // Kitchens and house interiors live on their own page
  if (SERVICE_SLUGS.includes(category)) redirect('/interiors')

  const product = await getProduct(category, slug)
  if (!product) notFound()
  const related = await getRelated(product.category_id, product.id)

  // "highlight: true" rows are shown in green with a badge
  const specs = [
    { label: 'Category', value: product.category_name },
    { label: 'Material', value: product.material },
    { label: 'Size', value: 'Made to your measurements' },
    { label: 'Finish', value: 'Choose from our laminate and wood finishes' },
    {
      label: 'Edges',
      value: 'Moulded, rounded edges on every corner',
      highlight: true,
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <nav className="mx-auto max-w-6xl px-5 py-6 lg:py-8">
        <ol className="flex items-center gap-2 text-sm text-charcoal">
          <li>
            <Link href="/" className="hover:text-cerulean">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/products" className="hover:text-cerulean">Products</Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/products/${product.category_slug}`} className="hover:text-cerulean">{product.category_name}</Link>
          </li>
          <li>/</li>
          <li className="font-medium text-ink truncate max-w-[200px] sm:max-w-xs">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images}
          name={product.name}
          edgeImage={product.edge_image}
        />

        <div>
          <p className="text-sm text-cerulean">{product.category_name}</p>
          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg">{product.description}</p>

          {/* Quick badge right under the description */}
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
            <ShieldCheck size={16} />
            Moulded rounded edges, child-friendly
          </p>

          <dl className="mt-6 divide-y divide-lightgray/60 overflow-hidden rounded-2xl border border-lightgray/60 bg-white">
            {specs.map(({ label, value, highlight }) => (
              <div
                key={label}
                className={`flex justify-between gap-4 px-5 py-3 text-sm ${
                  highlight ? 'bg-emerald-50/70' : ''
                }`}
              >
                <dt
                  className={`flex items-center gap-1.5 ${
                    highlight ? 'font-semibold text-emerald-700' : 'text-charcoal'
                  }`}
                >
                  {highlight && <ShieldCheck size={15} />}
                  {label}
                </dt>
                <dd
                  className={`text-right font-medium ${
                    highlight ? 'text-emerald-800' : 'text-ink'
                  }`}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* Moulded Edge feature card */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <div className="flex items-center gap-3 border-b border-emerald-100 px-5 py-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <ShieldCheck size={22} />
              </span>
              <div>
                <h2 className="font-display text-xl text-ink">Moulded Edge Technology</h2>
                <p className="text-sm text-charcoal">
                  Every corner and edge is rounded, not left sharp.
                </p>
              </div>
            </div>

            <ul className="divide-y divide-emerald-100">
              {edgeBenefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-3 px-5 py-4">
                  <Icon size={20} className="mt-0.5 shrink-0 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-charcoal">{text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="bg-emerald-600/5 px-5 py-3 text-xs text-emerald-800">
              Tip: hover over the photo (or tap to open fullscreen) and look closely at the edges and corners.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href={waLink(`Hi, I am interested in "${product.name}". Please share details.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95">
              <MessageCircle size={18} /> WhatsApp about this
            </a>
            <a href={`tel:+91${site.phones[0]}`} className="inline-flex items-center gap-2 rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">
              <Phone size={18} /> Call now
            </a>
            <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-charcoal px-6 py-3 font-semibold transition hover:bg-charcoal hover:text-white">
              <MapPin size={18} /> Visit us
            </a>
          </div>

          <h2 className="mb-3 mt-10 font-display text-2xl text-ink">Enquire about this product</h2>
          <EnquiryForm id="enquire" productName={product.name} defaultType="Product" />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-3xl text-ink">More in {product.category_name}</h2>
          <CardGrid>
            {related.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}><ProductCard product={p} /></Reveal>
            ))}
          </CardGrid>
        </div>
      )}
    </section>
  )
}