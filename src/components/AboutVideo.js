'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import SmartImage from './SmartImage'

// Workshop video that sits beside the About text. It plays while it is on screen and pauses when you scroll away.
// Files: public/videos/hero.mp4 and public/images/hero/hero-video-poster.jpg
export default function AboutVideo({
  src = '/videos/hero.mp4',
  poster = '/images/hero/hero-video-poster.jpg',
  title = 'Made in our Salem workshop',
  badgeTop = '',
  badgeText = '',
  sound = false, // true = the video has audio: starts muted, visitor taps the speaker to hear it. Uses full 16:9 frame (no cropping).
  className = '',
}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    // Play once 25% is visible, pause only when fully out of view.
    // (A single 0.35 threshold made the video start/stop again and again near the edge, which looked like shaking.)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.25) v.play().catch(() => {})
        else if (e.intersectionRatio === 0) v.pause()
      },
      { threshold: [0, 0.25] }
    )
    io.observe(v)
    // Never keep playing (or talking) in a background tab
    const onHide = () => { if (document.hidden) v.pause() }
    document.addEventListener('visibilitychange', onHide)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onHide) }
  }, [])

  const toggleSound = () => {
    const v = ref.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    if (!v.muted && v.paused) v.play().catch(() => {})
  }

  const toggle = () => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`relative ${sound ? 'aspect-video' : 'h-72 sm:h-[26rem]'} overflow-hidden isolate transform-gpu rounded-2xl border border-lightgray/60 bg-ink shadow-lg`} style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
        {failed ? (
          <SmartImage src={poster} alt={title} fit="cover" className="absolute inset-0 h-full w-full" />
        ) : (
          <video
            ref={ref}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden', willChange: 'auto' }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-transparent" />
        {title && !sound && <p className="absolute left-5 right-5 top-4 font-display text-lg text-white sm:text-2xl">{title}</p>}
        {!failed && sound && (
          <button onClick={toggleSound} aria-label={muted ? 'Turn sound on' : 'Turn sound off'} className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-black/70 active:scale-95">
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            {muted && <span>Tap for sound</span>}
          </button>
        )}
        {!failed && (
          <button onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} className={`absolute right-3 ${sound ? 'top-3' : 'bottom-3'} rounded-full bg-black/40 p-2.5 text-white transition hover:bg-black/60 active:scale-95`}>
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>
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
