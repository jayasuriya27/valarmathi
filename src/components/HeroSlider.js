'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import SmartImage from './SmartImage'
import { heroSlides, waLink } from '@/lib/site'

export default function HeroSlider() {
  const [index, setIndex] = useState(0)
  const touchX = useRef(null)
  const count = heroSlides.length

  // Moves to the next photo 5 seconds after the current one appears.
  // It depends on `index`, so clicking an arrow or a dot simply starts a fresh 5 seconds
  // and the slider keeps moving on its own afterwards.
  useEffect(() => {
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), heroSlides[index].duration ?? 5000)
    return () => clearTimeout(timer)
  }, [index, count])

  const go = (n) => setIndex((n + count) % count)

  // Swipe on phones
  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchX.current == null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    touchX.current = null
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
  }

  return (
    <section
      className="relative h-[54svh] min-h-[380px] w-full overflow-hidden bg-ink sm:h-[78svh] sm:min-h-[500px]"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured furniture"
    >
      {heroSlides.map((s, i) => (
        <div
          key={s.title}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden={i !== index}
        >
          {s.video ? (
            // A slide with a video: plays silently in a loop (only the visible slide loads it).
            // The photo is shown first and if the video cannot play.
            <>
              <SmartImage src={s.image} alt={s.title} fit="cover" priority className="absolute inset-0 h-full w-full" />
              {i === index && (
                <video
                  src={s.video}
                  poster={s.image}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </>
          ) : (
            <SmartImage
              src={s.image}
              alt={s.title}
              fit="cover"
              priority
              className={`absolute inset-0 h-full w-full ${i === index ? 'kenburns' : ''}`}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/40 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-6xl items-center px-5 pb-8 sm:pb-0">
            <div
              className={`max-w-xl text-white transition-all duration-700 delay-300 ${i === index ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
            >
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90 sm:mb-2 sm:text-sm sm:tracking-[0.3em]">Valarmathi Industries</p>
              {s.badge && (
                <p className="mb-2 text-xs text-lime sm:mb-3 sm:text-sm">{s.badge}</p>
              )}
              <h1 className="font-display text-[1.65rem] leading-tight sm:text-5xl lg:text-6xl">{s.title}</h1>
              <p className="mt-2 max-w-md text-sm text-white/85 sm:mt-4 sm:text-lg">{s.text}</p>
              <div className="mt-4 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                <Link href={s.href} className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white sm:px-6 sm:py-3 sm:text-base">
                  {s.cta}
                </Link>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-black sm:px-6 sm:py-3 sm:text-base"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => go(index - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/30 sm:block">
        <ChevronLeft />
      </button>
      <button onClick={() => go(index + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/15 p-3 text-white backdrop-blur transition hover:bg-white/30 sm:block">
        <ChevronRight />
      </button>

      <div className="absolute bottom-3 left-1/2 flex sm:bottom-6 -translate-x-1/2 gap-2">
        {heroSlides.map((s, i) => (
          <button
            key={s.title}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-lime' : 'w-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  )
}