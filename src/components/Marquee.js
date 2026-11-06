import Link from 'next/link'
import SmartImage from './SmartImage'

// Cards that keep moving left automatically. Pauses when the mouse is over it (CSS in globals.css).
export default function Marquee({ products = [] }) {
  if (products.length === 0) return null
  const loop = [...products, ...products]
  return (
    <div className="marquee overflow-hidden py-2">
      <div className="marquee-track">
        {loop.map((p, i) => (
          <Link
            key={`${p.id}-${i}`}
            href={`/products/${p.category_slug}/${p.slug}`}
            aria-hidden={i >= products.length}
            tabIndex={i >= products.length ? -1 : 0}
            className="group mr-5 block w-64 shrink-0 overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition hover:shadow-xl"
          >
            <SmartImage src={p.images?.[0]} alt={p.name} className="h-56 w-full transition duration-500 group-hover:scale-105" />
            <div className="p-3">
              <p className="text-xs text-cerulean">{p.category_name}</p>
              <p className="truncate font-semibold text-ink">{p.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
