'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, Minus, Phone, MapPin, MessageCircle, Plus, Search, X } from 'lucide-react'
import SmartImage from './SmartImage'
import SearchBox from './SearchBox'
import { FINISHES, colourSlug } from './FinishPicker'
import { site, waLink, mapsLink } from '@/lib/site'
import { roomLinks as rooms } from '@/lib/rooms'
import { categoryHref } from '@/lib/links'

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Products', '/products'],
  ['Interiors', '/interiors'],
  ['Colours', '/colours'],
  ['Custom Design', '/custom-design'],
  ['Sustainability', '/sustainability'],
  ['Contact', '/contact'],
]

const linkBase =
  'relative whitespace-nowrap rounded-full px-2.5 py-1.5 text-[13.5px] font-medium transition hover:text-cerulean after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:bg-lime after:transition-transform after:duration-300 hover:after:scale-x-100'

export default function Navbar({ categories = [] }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menu, setMenu] = useState(null)
  const [preview, setPreview] = useState(null)
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(null)
  const [mobileCat, setMobileCat] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenu((m) => (m === 'search' ? null : m))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const openMenu = (key) => {
    if (key !== menu) setPreview(null)
    setMenu(key)
  }

  const closeAll = () => {
    setMobileOpen(false)
    setMenu(null)
    setPreview(null)
    setMobileMenuOpen(null)
    setMobileCat(null)
  }

  const toggleMobileMenu = (key) => {
    setMobileMenuOpen(mobileMenuOpen === key ? null : key)
  }

  const first = categories[0]
  const current = preview ?? (first ? { title: first.name, sub: 'Category', image: first.image, href: categoryHref(first) } : null)
  const colourCurrent = preview ?? { title: FINISHES[0].name, sub: 'Colour', image: FINISHES[0].image, href: `/colours/${colourSlug(FINISHES[0].name)}` }
  const isActive = (path) => (path === '/' ? pathname === '/' : pathname.startsWith(path))
  const hasMenu = (name) => name === 'Products' || name === 'Interiors' || name === 'Colours'

  const panel = {
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.15 },
    className: 'absolute left-0 right-0 top-full hidden border-t border-b border-lightgray/50 bg-white shadow-lg xl:block z-50',
  }

  return (
    <header className="sticky top-0 z-50" onMouseLeave={() => { if (menu !== 'search') { setMenu(null); setPreview(null); } }}>
      {/* Top info bar */}
      <div className="hidden bg-ink text-xs text-white/90 xl:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-1.5">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-lime"
          >
            <MapPin size={13} className="text-lime shrink-0" /> {site.address}
          </a>
          <span className="flex items-center gap-5">
            <a href={`tel:+91${site.phones[0]}`} className="flex items-center gap-1 transition hover:text-lime"><Phone size={13} /> {site.phones[0]}</a>
            <a href={`tel:+91${site.phones[1]}`} className="transition hover:text-lime">{site.phones[1]}</a>
          </span>
        </div>
      </div>

      <div className={`bg-white relative transition-shadow ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-5">
          
          <Link href="/" onClick={closeAll} aria-label="Valarmathi Industries home" className="flex items-center gap-2 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/images/logo.jpeg" 
              alt="Valarmathi Industries" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0" 
            />
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[15px] sm:text-[18px] font-bold text-cerulean">
                Valarmathi
              </span>
              <span className="text-[8.5px] sm:text-[9.5px] font-semibold uppercase tracking-[0.2em] text-ink">
                Industries
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {links.map(([name, path]) => {
              const key = name === 'Products' ? 'products' : name === 'Interiors' ? 'interiors' : name === 'Colours' ? 'colours' : null
              return (
                <Link
                  key={path}
                  href={path}
                  onClick={closeAll}
                  onMouseEnter={() => openMenu(key)}
                  onFocus={() => openMenu(key)}
                  className={`${linkBase} ${hasMenu(name) ? 'flex items-center gap-1' : ''} ${menu === key && key ? 'text-cerulean after:scale-x-100' : isActive(path) ? 'text-cerulean after:scale-x-100' : 'text-charcoal'}`}
                >
                  {name} {hasMenu(name) && <ChevronDown size={14} className={`transition duration-200 ${menu === key ? 'rotate-180' : ''}`} />}
                </Link>
              )
            })}
            <button
              onClick={() => setMenu(menu === 'search' ? null : 'search')}
              aria-label="Search the website"
              aria-expanded={menu === 'search'}
              className={`ml-1 shrink-0 rounded-full p-1.5 transition hover:bg-smoke hover:text-cerulean ${menu === 'search' ? 'bg-smoke text-cerulean' : 'text-charcoal'}`}
            >
              {menu === 'search' ? <X size={17} /> : <Search size={17} />}
            </button>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="ml-1.5 inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-cerulean px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-black">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-2 xl:hidden">
            <button className="rounded-lg p-1.5 text-charcoal hover:bg-smoke" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu" aria-expanded={mobileOpen}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menu === 'products' && categories.length > 0 && (
            <motion.div key="products" {...panel}>
              <div className="mx-auto max-w-7xl px-8 py-3">
                <div className="grid grid-cols-[1fr_180px] gap-5 items-start">
                  <div className="grid grid-cols-3 gap-x-5 gap-y-2 content-start">
                    {categories.map((c) => {
                      const totalItems = (c.items ?? []).length;
                      return (
                        <div key={c.id}>
                          <Link
                            href={categoryHref(c)}
                            onClick={closeAll}
                            onMouseEnter={() => setPreview({ title: c.name, sub: 'Category', image: c.image, href: categoryHref(c) })}
                            className="inline-block border-b border-lime pb-0.5 text-[13px] font-bold text-ink transition hover:text-cerulean"
                          >
                            {c.name}
                          </Link>
                          <ul className="mt-1 space-y-0.5">
                            {/* Top 3 items mattum, baki "More" */}
                            {(c.items ?? []).slice(0, 3).map((it) => (
                              <li key={it.slug}>
                                <Link
                                  href={`/products/${c.slug}/${it.slug}`}
                                  onClick={closeAll}
                                  onMouseEnter={() => setPreview({ title: it.name, sub: c.name, image: it.image, href: `/products/${c.slug}/${it.slug}` })}
                                  className="inline-block text-[12px] text-charcoal/85 transition hover:translate-x-0.5 hover:text-cerulean"
                                >
                                  {it.name}
                                </Link>
                              </li>
                            ))}
                            {totalItems > 3 && (
                              <li>
                                <Link href={categoryHref(c)} onClick={closeAll} className="text-[11px] font-semibold text-cerulean hover:underline">
                                  More...
                                </Link>
                              </li>
                            )}
                          </ul>
                        </div>
                      )
                    })}
                  </div>

                  {current && (
                    <Link href={current.href} onClick={closeAll} className="group block overflow-hidden rounded-lg border border-lightgray/60 bg-smoke shadow-xs self-start">
                      <SmartImage src={current.image} alt={current.title} className="h-24 w-full transition duration-500 group-hover:scale-105" />
                      <div className="bg-white p-2">
                        <p className="text-[9.5px] font-medium text-charcoal/70">{current.sub}</p>
                        <p className="text-[11.5px] font-bold leading-tight text-ink mt-0.5">{current.title}</p>
                      </div>
                    </Link>
                  )}
                </div>

                <div className="mt-2 border-t border-lightgray/40 pt-1.5 text-right">
                  <Link href="/products" onClick={closeAll} className="inline-flex items-center gap-1 text-[12px] font-semibold text-cerulean hover:underline">
                    View all products <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Colours Menu */}
          {menu === 'colours' && (
            <motion.div key="colours" {...panel}>
              <div className="mx-auto max-w-7xl px-8 py-3">
                <div className="grid grid-cols-[1fr_180px] gap-5 items-start">
                  <div>
                    <Link href="/colours" onClick={closeAll} className="inline-block border-b border-lime pb-0.5 text-[13px] font-bold text-ink transition hover:text-cerulean">
                      Laminate &amp; Wood Colours
                    </Link>
                    <ul className="mt-2 grid grid-cols-3 gap-x-5 gap-y-1.5">
                      {FINISHES.map((f) => {
                        const href = `/colours/${colourSlug(f.name)}`
                        return (
                          <li key={f.name}>
                            <a
                              href={href}
                              onClick={closeAll}
                              onMouseEnter={() => setPreview({ title: f.name, sub: 'Colour', image: f.image, href })}
                              className="flex items-center gap-1.5 text-[12px] text-charcoal/85 transition hover:translate-x-0.5 hover:text-cerulean"
                            >
                              <SmartImage src={f.image} alt={f.name} fit="cover" className="h-3.5 w-3.5 shrink-0 rounded-full border border-lightgray/60" />
                              {f.name}
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <a href={colourCurrent.href} onClick={closeAll} className="group block overflow-hidden rounded-lg border border-lightgray/60 bg-smoke shadow-xs self-start">
                    <SmartImage src={colourCurrent.image} alt={colourCurrent.title} className="h-24 w-full transition duration-500 group-hover:scale-105" />
                    <div className="bg-white p-2">
                      <p className="text-[9.5px] font-medium text-charcoal/70">{colourCurrent.sub}</p>
                      <p className="text-[11.5px] font-bold leading-tight text-ink mt-0.5">{colourCurrent.title}</p>
                    </div>
                  </a>
                </div>

                <div className="mt-2 border-t border-lightgray/40 pt-1.5 text-right">
                  <Link href="/colours" onClick={closeAll} className="inline-flex items-center gap-1 text-[12px] font-semibold text-cerulean hover:underline">
                    View all colours <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Interiors Menu */}
          {menu === 'interiors' && (
            <motion.div key="interiors" {...panel}>
              <div className="mx-auto grid max-w-7xl grid-cols-3 gap-5 px-8 py-3">
                <div className="bg-smoke/60 p-2.5 rounded-lg border border-lightgray/50">
                  <Link href="/interiors#kitchen" onClick={closeAll} className="inline-block border-b border-lime pb-0.5 text-[13px] font-bold text-ink transition hover:text-cerulean">
                    Modular Kitchen
                  </Link>
                  <p className="mt-1 text-[11.5px] text-charcoal/80 leading-relaxed">Planned around your space, storage and cooking style.</p>
                </div>
                <div className="bg-smoke/60 p-2.5 rounded-lg border border-lightgray/50">
                  <Link href="/interiors#home-interiors" onClick={closeAll} className="inline-block border-b border-lime pb-0.5 text-[13px] font-bold text-ink transition hover:text-cerulean">
                    Home Interiors
                  </Link>
                  <ul className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                    {rooms.map(([label, id]) => (
                      <li key={id}>
                        <a href={`/interiors#${id}`} onClick={closeAll} className="inline-block text-[11.5px] text-charcoal/85 transition hover:translate-x-0.5 hover:text-cerulean">
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg bg-cerulean/5 p-2.5 border border-cerulean/20 self-start">
                  <p className="text-[13px] font-bold text-ink">Planning an interior?</p>
                  <p className="mt-0.5 text-[11px] text-charcoal/80 leading-snug">We visit your home, take measurements and plan it with you.</p>
                  <a href={waLink('Hi, I want to plan an interior for my home. Please arrange a site visit.')} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1 text-[11px] font-semibold text-white transition hover:brightness-95">
                    <MessageCircle size={13} /> Arrange site visit
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {menu === 'search' && (
            <motion.div key="search" {...panel}>
              <div className="mx-auto max-w-2xl px-5 py-3">
                <SearchBox autoFocus inline onNavigate={closeAll} placeholder="Search products, interiors, colours…" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE NAVIGATION */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-lightgray/50 bg-white xl:hidden"
            >
              <div className="flex max-h-[75vh] flex-col overflow-y-auto px-5 py-3">
                <div className="pb-2"><SearchBox inline onNavigate={closeAll} placeholder="Search furniture…" /></div>
                
                <div className="divide-y divide-lightgray/40">
                  {links.map(([name, path]) => {
                    const key = name.toLowerCase()
                    const isExpandable = name === 'Products' || name === 'Interiors' || name === 'Colours'

                    return (
                      <div key={path} className="py-0.5">
                        {!isExpandable ? (
                          <Link 
                            href={path} 
                            onClick={closeAll} 
                            className={`block py-2.5 text-[14px] font-semibold ${isActive(path) ? 'text-cerulean' : 'text-ink'}`}
                          >
                            {name}
                          </Link>
                        ) : (
                          <div>
                            <button
                              onClick={() => toggleMobileMenu(key)}
                              className="flex w-full items-center justify-between py-2.5 text-left text-[14px] font-semibold text-ink"
                            >
                              <span className={isActive(path) ? 'text-cerulean' : 'text-ink'}>{name}</span>
                              <ChevronDown 
                                size={16} 
                                className={`text-charcoal/70 transition-transform duration-200 ${mobileMenuOpen === key ? 'rotate-180 text-cerulean' : ''}`} 
                              />
                            </button>

                            <AnimatePresence>
                              {mobileMenuOpen === key && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden pl-3 pb-2"
                                >
                                  {name === 'Products' && (
                                    <div className="space-y-1.5 border-l-2 border-lime pl-3 mt-1">
                                      <Link href="/products" onClick={closeAll} className="block py-0.5 text-xs font-bold text-cerulean uppercase tracking-wider">
                                        All Products
                                      </Link>
                                      {categories.map((c) => (
                                        <div key={c.id} className="py-0.5">
                                          <button
                                            onClick={() => setMobileCat(mobileCat === c.id ? null : c.id)}
                                            className="flex w-full items-center justify-between text-left text-xs font-medium text-charcoal"
                                          >
                                            <span>{c.name}</span>
                                            {mobileCat === c.id ? <Minus size={13} className="text-cerulean" /> : <Plus size={13} className="text-cerulean" />}
                                          </button>
                                          
                                          {mobileCat === c.id && (
                                            <ul className="mt-1 ml-2 space-y-1 bg-smoke/70 p-2 rounded-lg text-xs">
                                              <li>
                                                <Link href={categoryHref(c)} onClick={closeAll} className="font-semibold text-cerulean block py-0.5">
                                                  View all {c.name}
                                                </Link>
                                              </li>
                                              {(c.items ?? []).map((it) => (
                                                <li key={it.slug}>
                                                  <Link href={`/products/${c.slug}/${it.slug}`} onClick={closeAll} className="text-charcoal/90 block py-0.5">
                                                    {it.name}
                                                  </Link>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {name === 'Interiors' && (
                                    <div className="space-y-1.5 border-l-2 border-lime pl-3 mt-1 text-xs">
                                      <Link href="/interiors#kitchen" onClick={closeAll} className="block py-0.5 font-semibold text-ink">
                                        Modular Kitchen
                                      </Link>
                                      <div className="pt-0.5">
                                        <p className="text-[11px] font-bold text-cerulean uppercase tracking-wider">Home Interiors</p>
                                        <ul className="mt-1 space-y-1 ml-1">
                                          {rooms.map(([label, id]) => (
                                            <li key={id}>
                                              <a href={`/interiors#${id}`} onClick={closeAll} className="text-xs text-charcoal/90 block py-0.5">
                                                {label}
                                              </a>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}

                                  {name === 'Colours' && (
                                    <div className="space-y-1.5 border-l-2 border-lime pl-3 mt-1">
                                      <Link href="/colours" onClick={closeAll} className="block py-0.5 text-xs font-bold text-cerulean uppercase tracking-wider">
                                        All Laminate &amp; Wood Colours
                                      </Link>
                                      <ul className="grid grid-cols-2 gap-1.5 pt-0.5 text-xs">
                                        {FINISHES.map((f) => (
                                          <li key={f.name}>
                                            <a 
                                              href={`/colours/${colourSlug(f.name)}`} 
                                              onClick={closeAll} 
                                              className="flex items-center gap-1.5 text-charcoal/90 py-0.5"
                                            >
                                              <SmartImage src={f.image} alt={f.name} fit="cover" className="h-3.5 w-3.5 shrink-0 rounded-full border border-lightgray/60" />
                                              <span className="truncate">{f.name}</span>
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}