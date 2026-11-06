import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SmartImage from './SmartImage'

// Hover: image zooms slightly and a panel slides up with a short summary.
export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product.category_slug}/${product.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:border-cerulean/40 hover:shadow-xl active:scale-[0.98]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
        <SmartImage
          src={product.images?.[0]}
          alt={product.name}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/85 to-black/55 p-4 text-white transition duration-300 group-hover:translate-y-0">
          <p className="line-clamp-2 text-sm text-white/90">{product.description}</p>
          <p className="mt-2 text-xs text-lime">Material: {product.material} · Custom sizes available</p>
        </div>
      </div>

      <div className="mt-auto flex flex-1 items-center justify-between gap-3 p-4">
        <h3 className="font-semibold text-ink">{product.name}</h3>
        <ArrowRight size={18} className="shrink-0 text-cerulean transition group-hover:translate-x-1" />
      </div>
    </Link>
  )
}
