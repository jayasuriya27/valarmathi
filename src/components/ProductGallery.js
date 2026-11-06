'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Maximize2,
} from 'lucide-react'
import SmartImage from './SmartImage'

const LENS_SIZE = 100 // lens diameter (px)
const LENS_ZOOM = 2.5 // lens magnification

/**
 * Props:
 *  - images:     array of image URLs
 *  - name:       product name
 *  - edgeImage:  (optional) close-up photo of the moulded edge.
 *                It is added as the last thumbnail with an "Edge" badge.
 */
export default function ProductGallery({ images = [], name, edgeImage }) {
  const [active, setActive] = useState(0)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [lens, setLens] = useState(null) // { x, y, w, h } or null

  const dragRef = useRef(null)

  // Thumbnail strip refs (used to keep the active thumbnail centred in the scroll row)
  const stripRef = useRef(null)
  const thumbRefs = useRef([])

  // Normal images + optional edge close-up at the end
  const baseList = edgeImage ? [...images, edgeImage] : images
  const list = baseList.length ? baseList : [null]
  const edgeIndex = edgeImage ? list.length - 1 : -1
  const isEdgeActive = active === edgeIndex

  const resetView = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
    dragRef.current = null
  }

  const openViewer = () => {
    resetView()
    setLens(null)
    setViewerOpen(true)
  }

  const closeViewer = () => {
    setViewerOpen(false)
    resetView()
  }

  const go = (index) => {
    setActive((index + list.length) % list.length)
    resetView()
    setLens(null)
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(4, prev + 0.5))
  }

  const zoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(1, prev - 0.5)

      if (next === 1) {
        setPosition({ x: 0, y: 0 })
      }

      return next
    })
  }

  // Thumbnail strip: keep the active thumbnail visible (and centred) whenever the photo changes
  useEffect(() => {
    const strip = stripRef.current
    const thumb = thumbRefs.current[active]
    if (!strip || !thumb) return
    const left = thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2
    strip.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  // Keyboard support (fullscreen viewer)
  useEffect(() => {
    if (!viewerOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeViewer()
      if (e.key === 'ArrowLeft') go(active - 1)
      if (e.key === 'ArrowRight') go(active + 1)
      if (e.key === '+' || e.key === '=') zoomIn()
      if (e.key === '-') zoomOut()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [viewerOpen, active])

  // ---------- Magnifier lens (main image, mouse only) ----------
  const handleLensMove = (e) => {
    if (e.pointerType !== 'mouse') return // touch devices: no lens

    const rect = e.currentTarget.getBoundingClientRect()

    setLens({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
    })
  }

  const handleLensLeave = () => setLens(null)

  // ---------- Fullscreen viewer: wheel zoom ----------
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      zoomIn()
    } else {
      zoomOut()
    }
  }

  // ---------- Fullscreen viewer: drag ----------
  const handlePointerDown = (e) => {
    if (zoom <= 1) return

    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    }
  }

  const handlePointerMove = (e) => {
    if (!dragRef.current) return

    const drag = dragRef.current

    if (drag.pointerId !== e.pointerId) return

    setPosition({
      x: Math.max(
        -1000,
        Math.min(1000, drag.initialX + e.clientX - drag.startX)
      ),
      y: Math.max(
        -1000,
        Math.min(1000, drag.initialY + e.clientY - drag.startY)
      ),
    })
  }

  const handlePointerUp = () => {
    dragRef.current = null
  }

  return (
    <div className="min-w-0">
      {/* Main Product Image */}
      <div
        className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-lightgray/60 bg-white"
        onClick={openViewer}
        onPointerMove={handleLensMove}
        onPointerLeave={handleLensLeave}
      >
        <SmartImage
          src={list[active]}
          alt={name}
          fit="contain"
          priority
          className="h-[22rem] w-full sm:h-[28rem] lg:h-[calc(100dvh_-_21rem)] lg:max-h-[40rem] lg:min-h-[18rem]"
        />

        {/* Magnifier lens */}
        {lens && list[active] && (
          <div
            className="pointer-events-none absolute z-20 overflow-hidden rounded-full border-2 border-white bg-white shadow-2xl ring-1 ring-black/10"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              left: lens.x - LENS_SIZE / 2,
              top: lens.y - LENS_SIZE / 2,
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: lens.w,
                height: lens.h,
                left: LENS_SIZE / 2 - lens.x * LENS_ZOOM,
                top: LENS_SIZE / 2 - lens.y * LENS_ZOOM,
                transform: `scale(${LENS_ZOOM})`,
                transformOrigin: '0 0',
              }}
            >
              <SmartImage
                src={list[active]}
                alt=""
                fit="contain"
                className="h-full w-full"
              />
            </div>
          </div>
        )}

        {/* Hint (replaces the old popup) */}
        <p className="pointer-events-none absolute bottom-3 left-3 z-10 hidden rounded-full bg-black/55 px-3 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100 sm:block">
          Hover to inspect edges &amp; finish
        </p>

        {/* Edge detail label on the edge close-up */}
        {isEdgeActive && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white shadow">
            Moulded edge detail
          </span>
        )}

        {/* Fullscreen indicator */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-2 text-white opacity-0 transition group-hover:opacity-100">
          <Maximize2 size={18} />
        </div>

        {/* Previous / Next */}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(active - 1)
              }}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
            >
              <ChevronLeft size={21} />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                go(active + 1)
              }}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 z-30 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/80"
            >
              <ChevronRight size={21} />
            </button>

            <span className="absolute bottom-3 right-3 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {/* Thumbnail Images - single horizontal row with smooth center scroll */}
      {list.length > 1 && (
        <div
          ref={stripRef}
          className="relative mt-3 flex gap-2 overflow-x-auto scroll-smooth pb-1"
        >
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              ref={(el) => {
                thumbRefs.current[i] = el
              }}
              onClick={() => {
                setActive(i)
                resetView()
                setLens(null)
              }}
              aria-label={
                i === edgeIndex ? 'Show edge close-up' : `Show photo ${i + 1}`
              }
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition sm:h-[4.5rem] sm:w-[4.5rem] ${
                i === active
                  ? 'border-cerulean'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <SmartImage
                src={img}
                alt={i === edgeIndex ? `${name} edge close-up` : `${name} ${i + 1}`}
                fit="contain"
                className="h-full w-full"
              />

              {i === edgeIndex && (
                <span className="absolute inset-x-0 bottom-0 bg-emerald-600/90 py-0.5 text-center text-[10px] font-medium text-white">
                  Edge
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Image Viewer */}
      {viewerOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black"
          onClick={closeViewer}
        >
          {/* Top Header */}
          <div className="relative z-30 flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 text-white sm:px-6">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold sm:text-base">
                {name}
              </h3>
              <p className="text-xs text-white/60">
                {active + 1} of {list.length} images
                {isEdgeActive && ' · Moulded edge detail'}
              </p>
            </div>

            <button
              type="button"
              onClick={closeViewer}
              aria-label="Close image viewer"
              className="ml-4 rounded-full bg-white/10 p-2.5 transition hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>

          {/* Image Viewing Area */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              cursor: zoom > 1 ? 'grab' : 'default',
              touchAction: 'none',
            }}
          >
            {/* Image */}
            <div
              className="flex h-full w-full items-center justify-center transition-transform duration-150 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              }}
            >
              <SmartImage
                src={list[active]}
                alt={name}
                fit="contain"
                priority
                className="h-full w-full select-none"
              />
            </div>

            {/* Previous Image */}
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => go(active - 1)}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-700 sm:left-8"
              >
                <ChevronLeft size={30} strokeWidth={3} />
              </button>
            )}

            {/* Next Image */}
            {list.length > 1 && (
              <button
                type="button"
                onClick={() => go(active + 1)}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-700 sm:right-8"
              >
                <ChevronRight size={30} strokeWidth={3} />
              </button>
            )}
          </div>

          {/* Bottom Controls */}
          <div
            className="relative z-30 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 bg-black/90 px-3 py-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              aria-label="Zoom out"
              className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 disabled:opacity-40"
            >
              <ZoomOut size={20} />
            </button>

            <span className="min-w-14 text-center text-sm font-medium">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 4}
              aria-label="Zoom in"
              className="rounded-full bg-white/10 p-3 transition hover:bg-white/20 disabled:opacity-40"
            >
              <ZoomIn size={20} />
            </button>

            <button
              type="button"
              onClick={resetView}
              aria-label="Reset zoom"
              className="ml-2 flex items-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm transition hover:bg-white/20"
            >
              <RotateCcw size={17} />
              <span>Reset</span>
            </button>

            <p className="hidden text-xs text-white/50 sm:block">
              Scroll to zoom · Drag to move · ESC to close
            </p>
          </div>
        </div>
      )}
    </div>
  )
}