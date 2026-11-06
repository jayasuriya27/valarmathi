import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SmartImage from './SmartImage'

// Photo on top (whole product visible), name and text below.
export default function CategoryCard({ category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-white">
        <SmartImage src={category.image} alt={category.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col border-t border-lightgray/60 p-5">
        <h3 className="font-display text-2xl text-ink">{category.name}</h3>
        <p className="mt-1 max-w-md text-sm line-clamp-2">{category.description}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium text-cerulean">
          View all <ArrowRight size={14} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
