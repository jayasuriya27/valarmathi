'use client'
import { useEffect, useRef, useState } from 'react'

// Phones have no hover, so on a touch screen (or a narrow window) a card lights up
//   - while it is in the middle of the screen, and
//   - when it is tapped (stays lit until you tap somewhere else).
// On a computer the normal hover effect is used and `lit` stays false.
// Use:  const [ref, lit, bind] = useCenterLit()   then   <div ref={ref} {...bind}>
export function useCenterLit() {
  const ref = useRef(null)
  const [touchLike, setTouchLike] = useState(false)
  const [centered, setCentered] = useState(false)
  const [tapped, setTapped] = useState(false)

  // phone, tablet or a narrow browser window (also when switching to phone view in the browser tools)
  useEffect(() => {
    const queries = [window.matchMedia('(hover: none)'), window.matchMedia('(max-width: 1023px)')]
    const sync = () => setTouchLike(queries.some((q) => q.matches))
    sync()
    queries.forEach((q) => q.addEventListener('change', sync))
    return () => queries.forEach((q) => q.removeEventListener('change', sync))
  }, [])

  // lit while in the middle of the screen
  useEffect(() => {
    const el = ref.current
    if (!touchLike || !el) {
      setCentered(false)
      return
    }
    const io = new IntersectionObserver(([entry]) => setCentered(entry.isIntersecting), { rootMargin: '-38% 0px -38% 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [touchLike])

  // tapping elsewhere clears the tap
  useEffect(() => {
    if (!tapped) return
    const off = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setTapped(false)
    }
    document.addEventListener('pointerdown', off)
    return () => document.removeEventListener('pointerdown', off)
  }, [tapped])

  const bind = { onPointerDown: () => touchLike && setTapped(true) }
  return [ref, touchLike && (centered || tapped), bind]
}
