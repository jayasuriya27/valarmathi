'use client'
import { useState } from 'react'

// Lifestyle photos of rooms (house interiors) fill their box. Every other product photo is shown in full.
const ROOM_PHOTO = /\/images\/products\/(house-interior-showcase|living-room-tv-feature-wall|bedroom-interior|home-office-interior)\//

// Shows an image. If there is no photo yet (or the link is broken) it shows the product name
// on a coloured box with "Photo coming soon" instead of a broken icon.
// Product photos (and old catalogue pages) always use "contain", so the WHOLE furniture is visible and never cut at the top or bottom.
export default function SmartImage({ src, alt, className = '', fit = 'auto', priority = false }) {
  const [failed, setFailed] = useState(false)
  const isProduct = !!src && (src.includes('/images/product-') || (src.includes('/images/products/') && !ROOM_PHOTO.test(src)))
  const mode = isProduct ? 'contain' : fit === 'auto' ? 'cover' : fit

  if (!src || failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 overflow-hidden bg-linear-to-br from-cerulean to-charcoal p-4 text-center text-white ${className}`}>
        <span className="text-sm font-medium">{alt}</span>
        <span className="text-xs text-white/70">Photo coming soon</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${mode === 'contain' ? 'bg-white object-contain p-1.5' : 'object-cover'} ${className}`}
    />
  )
}
