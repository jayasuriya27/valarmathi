'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, X } from 'lucide-react'
import SmartImage from './SmartImage'

// One row in the suggestions list. Links with a #hash use a plain <a> so the page reacts to the hash.
function Row({ href, onPick, image, title, sub }) {
  const cls = 'flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-smoke'
  const inner = (
    <>
      {image ? (
        <SmartImage src={image} alt="" fit="cover" className="h-10 w-10 shrink-0 rounded-lg border border-lightgray/60" />
      ) : (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-smoke text-cerulean">
          <ArrowRight size={16} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-ink">{title}</span>
        {sub && <span className="block truncate text-xs text-charcoal">{sub}</span>}
      </span>
    </>
  )
  return href.includes('#') ? (
    <a href={href} onClick={onPick} className={cls}>{inner}</a>
  ) : (
    <Link href={href} onClick={onPick} className={cls}>{inner}</Link>
  )
}

export default function SearchBox({
  autoFocus = false,
  inline = false, // show the suggestions in the page flow (used inside the header and the mobile menu)
  onNavigate,
  defaultValue = '',
  placeholder = 'Search products, interiors, colours…',
}) {
  const router = useRouter()
  const box = useRef(null)
  const [q, setQ] = useState(defaultValue)
  const [data, setData] = useState(null)
  const [open, setOpen] = useState(false)

  // look up suggestions shortly after the person stops typing
  useEffect(() => {
    const term = q.trim()
    if (!term) {
      setData(null)
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        setData(await res.json())
      } catch {
        /* a newer search replaced this one */
      }
    }, 200)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [q])

  // close the suggestions when clicking elsewhere
  useEffect(() => {
    const onDown = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const pick = () => {
    setOpen(false)
    onNavigate?.()
  }

  const submit = (e) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    pick()
    router.push(`/search?q=${encodeURIComponent(term)}`)
  }

  const groups = data
    ? [
        ['Products', data.products.slice(0, 4).map((p) => ({ key: `p${p.id}`, href: p.href, image: p.images?.[0], title: p.name, sub: p.category_name }))],
        ['Interiors', data.interiors.slice(0, 3).map((i) => ({ key: `i${i.id}`, href: i.href, image: i.image, title: i.label, sub: 'Interiors' }))],
        ['Colours', data.colours.slice(0, 3).map((c) => ({ key: `c${c.name}`, href: c.href, image: c.image, title: c.name, sub: 'Colour' }))],
        ['Categories', data.categories.slice(0, 2).map((c) => ({ key: `k${c.slug}`, href: c.href, image: c.image, title: c.name, sub: 'Category' }))],
        ['Pages', data.pages.slice(0, 2).map((p) => ({ key: `g${p.href}`, href: p.href, title: p.title, sub: p.sub }))],
      ].filter(([, rows]) => rows.length > 0)
    : []

  const showList = open && q.trim() && data
  const listClass = inline
    ? 'mt-3 max-h-[55vh] overflow-y-auto rounded-2xl border border-lightgray/60 bg-white p-2'
    : 'absolute left-0 right-0 top-full z-30 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-lightgray/60 bg-white p-2 shadow-xl'

  return (
    <div ref={box} className="relative">
      <form onSubmit={submit} role="search" className="flex gap-2">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-charcoal" />
          <input
            type="search"
            name="q"
            value={q}
            autoFocus={autoFocus}
            autoComplete="off"
            onChange={(e) => {
              setQ(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            placeholder={placeholder}
            aria-label="Search the website"
            className="w-full rounded-full border border-lightgray bg-white py-3 pl-11 pr-10 text-[15px] outline-cerulean [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button type="button" onClick={() => { setQ(''); setData(null) }} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-charcoal hover:bg-smoke">
              <X size={16} />
            </button>
          )}
        </div>
        <button className="flex shrink-0 items-center gap-2 rounded-full bg-cerulean px-5 font-semibold text-white transition hover:bg-black">
          <Search size={18} className="sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {showList && (
        <div className={listClass}>
          {groups.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm">
              Nothing found for “{q.trim()}”. Try another word, or{' '}
              <Link href="/contact" onClick={pick} className="text-cerulean underline">contact us</Link> and tell us what you need.
            </p>
          ) : (
            <>
              {groups.map(([title, rows]) => (
                <div key={title} className="mb-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-charcoal/70">{title}</p>
                  {rows.map((r) => (
                    <Row key={r.key} href={r.href} onPick={pick} image={r.image} title={r.title} sub={r.sub} />
                  ))}
                </div>
              ))}
              <Link
                href={`/search?q=${encodeURIComponent(q.trim())}`}
                onClick={pick}
                className="mt-1 flex items-center justify-center gap-1 rounded-lg bg-smoke px-3 py-2 text-sm font-medium text-cerulean transition hover:bg-lightgray/40"
              >
                See all results for “{q.trim()}” <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}
