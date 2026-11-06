'use client'
import { useEffect, useState } from 'react'
import SmartImage from './SmartImage'
import Link from 'next/link'
import { FINISH_DETAILS } from '@/lib/finishes'

// Laminate colours come from src/lib/finishes.js (add a new colour there).
const FINISHES = Object.entries(FINISH_DETAILS).map(([slug, d]) => ({ slug, ...d }))
export { FINISHES }
// Each colour has its own page: /colours/mahogany, /colours/taj-marble ...
export const colourSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const ALL = FINISHES // 10 real colours; "your own colour" is a link below the tiles

const customBg = 'linear-gradient(135deg,#5a1b16 0%,#a4521f 35%,#d8c3a6 70%,#e6eeeb 100%)'

const TIP_W = 352 // tooltip width in px (w-[22rem])

// productsByFinish: { [finishSlug]: [{ name, slug, category_slug, image }] } from getProductsByFinish()
export default function FinishPicker({ productsByFinish = {} }) {
  const [tip, setTip] = useState(null) // { i, left, top, above } for the hover tooltip

  // Show the tooltip next to the hovered card, kept inside the screen
  const showTip = (i, el) => {
    if (!window.matchMedia('(hover: hover)').matches || ALL[i].custom) return
    const r = el.getBoundingClientRect()
    const left = Math.min(Math.max(8, r.left + r.width / 2 - TIP_W / 2), window.innerWidth - TIP_W - 8)
    const above = r.top > window.innerHeight / 2
    setTip({ i, left, top: above ? r.top - 8 : r.bottom + 8, above })
  }
  const hideTip = () => setTip(null)
  useEffect(() => {
    if (!tip) return
    window.addEventListener('scroll', hideTip, { passive: true })
    return () => window.removeEventListener('scroll', hideTip)
  }, [tip])

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {ALL.map((c, i) => (
          <Link
            key={c.name}
            href={`/colours/${c.custom ? 'custom' : c.slug}`}
            onClick={hideTip}
            onMouseEnter={(e) => showTip(i, e.currentTarget)}
            onMouseLeave={hideTip}
            onFocus={(e) => showTip(i, e.currentTarget)}
            onBlur={hideTip}
            aria-label={`${c.name} colour`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-lightgray/60 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            {c.custom ? (
              <div className="h-full w-full transition duration-500 group-hover:scale-110" style={{ backgroundImage: customBg }} />
            ) : (
              <SmartImage src={c.image} alt={c.name} fit="cover" className="h-full w-full transition duration-500 group-hover:scale-110" />
            )}
            {/* light sweep on hover */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition duration-700 group-hover:translate-x-full" />
            <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 text-sm font-semibold text-white">
              {c.custom ? 'Your own colour' : c.name}
              <span className="block text-[11px] font-normal text-lime opacity-0 transition group-hover:opacity-100">
                {c.custom ? 'Customised colour available' : 'Tap to see this colour'}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-5 text-center text-sm">
        Need a colour that is not here?{' '}
        <Link href="/colours/custom" className="font-semibold text-cerulean hover:underline">Ask for your own colour →</Link>
      </p>

      {/* Hover tooltip: finish details, plus photos of the products made in this finish (only if there are any) */}
      {tip && (() => {
        const t = ALL[tip.i]
        const products = productsByFinish[t.slug] ?? []
        return (
          <div
            role="tooltip"
            style={{ left: tip.left, top: tip.top, width: TIP_W, transform: tip.above ? 'translateY(-100%)' : undefined }}
            className="pointer-events-none fixed z-50 max-h-[85vh] overflow-hidden rounded-xl border border-lightgray/70 bg-white p-4 text-left shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <h4 className="font-display text-lg text-ink">{t.name} Finish</h4>
              {t.badge && <span className="rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold text-black">{t.badge}</span>}
            </div>
            <p className="mt-1 text-[13px] leading-snug">{t.summary}</p>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-cerulean">Appearance &amp; Features</p>
            <ul className="mt-1 space-y-0.5 text-[13px]">
              {t.features.map(([k, v]) => (
                <li key={k}><span className="font-medium text-ink">{k}:</span> {v}</li>
              ))}
            </ul>

            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-cerulean">Care &amp; Maintenance</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-[13px]">
              {t.care.map((c) => <li key={c}>{c}</li>)}
            </ul>

            {products.length > 0 && (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-cerulean">Products in this finish</p>
                <div className="mt-1.5 flex gap-2">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.slug} className="w-[72px]">
                      <SmartImage src={p.image} alt={p.name} fit="cover" className="h-[72px] w-[72px] rounded-lg" />
                      <p className="mt-0.5 line-clamp-2 text-[10px] leading-tight">{p.name}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )
      })()}

    </>
  )
}
