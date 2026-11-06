import Link from 'next/link'
import { categoryHref } from '@/lib/links'
import { Phone, MapPin, MessageCircle } from 'lucide-react'
import { site, waLink, mapsLink } from '@/lib/site'

export default function Footer({ categories = [] }) {
  return (
    <>
      <footer className="mt-20 bg-ink text-white pb-4 md:pb-14">
        <div className="mx-auto max-w-7xl px-8 py-14">
          
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
            
            {/* Left Side: Logo + Shop Name Text */}
            <div className="lg:col-span-3 pl-2 sm:pl-4">
              <Link href="/" className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/images/logo.jpeg" 
                  alt="Valarmathi Industries" 
                  className="h-14 w-14 object-contain shrink-0 rounded-xl bg-white p-1" 
                />
                <span className="flex flex-col leading-tight">
                  <span className="font-display text-[20px] font-bold text-white">
                    Valarmathi
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A3E635]">
                    Industries
                  </span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-white/75">
                {site.tagline} Wooden and steel furniture and custom interiors from Salem, since {site.since}.
              </p>
            </div>

            {/* Right Side: 4 Columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-9">
              
              {/* 1. Products - Heading changed to white */}
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Products</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={categoryHref(c)} className="transition hover:text-lime">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2. Interiors - Heading changed to white */}
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Interiors</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li>
                    <Link href="/interiors#kitchen" className="transition hover:text-lime">
                      Modular Kitchen
                    </Link>
                  </li>
                  <li>
                    <Link href="/interiors#home-interiors" className="transition hover:text-lime">
                      Home Interiors
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 3. Company - Heading changed to white */}
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Company</h3>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li><Link href="/about" className="hover:text-lime">About us</Link></li>
                  <li><Link href="/custom-design" className="hover:text-lime">Custom design</Link></li>
                  <li><Link href="/sustainability" className="hover:text-lime">Sustainability</Link></li>
                  <li><Link href="/contact" className="hover:text-lime">Contact</Link></li>
                  
                </ul>
              </div>

              {/* 4. Visit or call - Heading changed to white */}
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Visit or call</h3>
                <ul className="mt-3 space-y-3 text-sm text-white/75">
                  <li className="flex gap-2">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-lime" /> 
                    <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="hover:text-lime">
                      {site.address}
                    </a>
                  </li>
                  <li className="flex gap-2">
                    <Phone size={18} className="mt-0.5 shrink-0 text-lime" /> 
                    <span>
                      <a href={`tel:+91${site.phones[0]}`} className="hover:text-lime">{site.phones[0]}</a>, {' '}
                      <a href={`tel:+91${site.phones[1]}`} className="hover:text-lime">{site.phones[1]}</a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <MessageCircle size={18} className="mt-0.5 shrink-0 text-lime" /> 
                    <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-lime">
                      Chat on WhatsApp
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </footer>
    </>
  )
}