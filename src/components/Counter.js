'use client'
import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'

// Number that counts up when it scrolls into view.
export default function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, { duration: 1.6, onUpdate: (v) => setValue(Math.round(v)) })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
