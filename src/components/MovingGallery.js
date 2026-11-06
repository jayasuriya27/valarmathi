'use client'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SmartImage from './SmartImage'

// Photos that slowly zoom and fade into each other. Change the list to use your own workshop photos.
const DEFAULT_IMAGES = [
  '/images/products/house-interior-showcase/01.webp',
  '/images/products/living-room-tv-feature-wall/01.webp',
  '/images/products/bedroom-interior/01.webp',
  '/images/products/home-office-interior/01.webp',
]

export default function MovingGallery({ images = DEFAULT_IMAGES, badgeTop = '', badgeText = '', className = '' }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [i, setI] = useState(0)

  // the photo drifts a little as the page scrolls
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  useEffect(() => {
    if (images.length < 2) return
    const t = setInterval(() => setI((n) => (n + 1) % images.length), 4500)
    return () => clearInterval(t)
  }, [images.length])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="relative h-80 overflow-hidden rounded-2xl border border-lightgray/60 bg-smoke shadow-lg sm:h-[26rem]">
        <motion.div style={reduce ? undefined : { y }} className="absolute -inset-[8%]">
          <AnimatePresence initial={false}>
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: reduce ? 1 : 1.12 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 1.2 }, scale: { duration: 6, ease: 'linear' } }}
            >
              <SmartImage src={images[i]} alt="Furniture and interiors made by Valarmathi Industries" fit="cover" className="h-full w-full" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-4 flex gap-1.5">
            {images.map((_, n) => (
              <button
                key={n}
                onClick={() => setI(n)}
                aria-label={`Photo ${n + 1}`}
                className={`h-1.5 rounded-full transition-all ${n === i ? 'w-6 bg-lime' : 'w-1.5 bg-white/70'}`}
              />
            ))}
          </div>
        )}
      </div>

      {badgeTop && (
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-5 left-5 rounded-2xl bg-lime px-5 py-3 text-black shadow-lg"
        >
          <p className="font-display text-3xl leading-none">{badgeTop}</p>
          <p className="text-xs font-semibold">{badgeText}</p>
        </motion.div>
      )}
    </div>
  )
}
