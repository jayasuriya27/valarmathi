'use client'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import SmartImage from './SmartImage'
import { waLink } from '@/lib/site'

// Which filter each interior design belongs to (by product slug).
// A design that is not listed here still shows under "All".
const TAGS = {
  'living-room-tv-feature-wall': ['Living room', 'TV wall'],
  'bedroom-interior': ['Bedroom', 'Wardrobes'],
  'home-office-interior': ['Home office'],
  'house-interior-showcase': ['Living room', 'Bedroom', 'Home office'],
}
// Links from the Interiors menu: /interiors#bedroom opens the Bedroom filter
const HASH = { 'living-room': 'Living room', 'tv-wall': 'TV wall', bedroom: 'Bedroom', wardrobes: 'Wardrobes', 'home-office': 'Home office' }
const FILTERS = ['All', 'Living room', 'TV wall', 'Bedroom', 'Wardrobes', 'Home office']

export default function InteriorGallery({ items = [] }) {
  const [active, setActive] = useState('All')
  useEffect(() => {
    const apply = () => {
      const room = HASH[window.location.hash.replace('#', '')]
      if (!room) return
      setActive(room)
      document.getElementById('home-interiors')?.scrollIntoView({ behavior: 'smooth' })
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const shown = active === 'All' ? items : items.filter((p) => (TAGS[p.slug] ?? []).includes(active))

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            aria-pressed={active === f}
            className={`rounded-full border px-4 py-1.5 text-sm transition active:scale-95 ${active === f ? 'border-cerulean bg-cerulean text-white' : 'border-lightgray bg-white hover:border-cerulean hover:text-cerulean'}`}
          >
            {f}
          </button>
        ))}
        <a href="#kitchen" className="rounded-full border border-lightgray bg-white px-4 py-1.5 text-sm transition hover:border-cerulean hover:text-cerulean active:scale-95">
          Kitchen ↑
        </a>
      </div>

      {shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center">No designs under this filter yet. Tell us what you need and we will plan it for you.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {shown.map((p) => (
            // The whole card is the link, so touching any part of it opens WhatsApp
            <a
              key={p.id}
              href={waLink(`Hi, I like the "${p.name}" interior design. Please share details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full overflow-hidden rounded-2xl border border-lightgray/60 bg-white transition duration-300 hover:-translate-y-1 hover:border-cerulean/40 hover:shadow-xl active:scale-[0.98]"
            >
              <div className="h-64 overflow-hidden sm:h-72">
                <SmartImage src={p.images?.[0]} alt={p.name} fit="cover" className="h-full w-full transition duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                <p className="mt-1 text-sm">{p.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-cerulean">
                  Ask about this design <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}
