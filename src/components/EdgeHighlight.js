'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ShieldCheck, Hand, Sparkles, MapPin } from 'lucide-react'
import Reveal from './Reveal'
import { site, mapsLink } from '@/lib/site'
import { useCenterLit } from '@/lib/useCenterLit'

const edgeBenefits = [
  {
    icon: ShieldCheck,
    title: 'Safe for kids',
    text: 'No sharp corners. If a child bumps into it while playing, the soft, rounded edge reduces the risk of cuts and bruises.',
  },
  {
    icon: Hand,
    title: 'Smooth to touch',
    text: 'The edge is shaped and sanded smooth, so there are no rough spots or splinters when you hold or lean on it.',
  },
  {
    icon: Sparkles,
    title: 'Neat, lasting finish',
    text: 'The edge carries the same finish as the rest of the piece, so it looks clean and holds up well to everyday use.',
  },
]

// Same look as "How a custom order works": lime icon circle, white card, lime line joining them.
// Computer: hover. Phone: lights up in the middle of the screen or when tapped.
function Benefit({ Icon, title, text, i }) {
  const [ref, lit, bind] = useCenterLit()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: i * 0.15, duration: 0.6 }}
      className="group relative flex items-start gap-4"
    >
      <div
        className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime text-black ring-8 transition duration-300 group-hover:rotate-6 group-hover:scale-110 ${
          lit ? 'scale-110 rotate-6 ring-lime/50' : 'ring-lime/25'
        }`}
      >
        <Icon size={28} />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
      </div>
      <div
        ref={ref}
        {...bind}
        className={`flex-1 rounded-2xl border bg-white p-5 transition duration-300 active:scale-[0.98] ${
          lit ? '-translate-y-1 border-lime shadow-xl' : 'border-lightgray/60 shadow-sm group-hover:-translate-y-1 group-hover:border-lime group-hover:shadow-xl'
        }`}
      >
        <h3 className={`font-semibold transition ${lit ? 'text-cerulean' : 'text-ink group-hover:text-cerulean'}`}>{title}</h3>
        <p className="mt-1 text-sm leading-relaxed">{text}</p>
      </div>
    </motion.div>
  )
}

export default function EdgeHighlight() {
  return (
    <section className="relative overflow-hidden border-t border-lightgray/50 bg-white py-20">
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-lime/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cerulean/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          {/* Left: the story */}
          <Reveal>
            <div className="space-y-4 lg:sticky lg:top-32">
              <p className="text-sm font-semibold uppercase tracking-widest text-cerulean">Moulded Edge Technology</p>
              <h2 className="font-display text-3xl text-ink sm:text-4xl">Smooth, rounded edges on every piece</h2>
              <p className="leading-relaxed">
                A square-cut edge can be sharp and rough to touch. In our workshop, each edge goes through our edge moulding machine, which shapes it into a smooth, rounded finish. The furniture feels better in your hands, looks neat and complete, and is gentler on the whole family.
              </p>
              <p className="text-sm text-charcoal/80">
                It matters most in homes with children, where tables, TV units and cots are right at bumping height.
              </p>

              <div className="pt-2">
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2 text-sm font-medium text-cerulean transition hover:underline"
                >
                  <MapPin className="mt-0.5 shrink-0" size={18} />
                  <span>See the machine at work when you visit our workshop, {site.address}</span>
                </a>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <Link href="/products" className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3 font-semibold text-black shadow-sm transition hover:bg-ink hover:text-white">
                  See our products <ArrowRight size={16} />
                </Link>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-7 py-3 font-semibold text-ink transition hover:border-lime hover:bg-lime/20"
                >
                  Visit our workshop
                </a>
              </div>
            </div>
          </Reveal>

          {/* Right: sharp vs rounded, then the three benefits as steps */}
          <div>
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-lightgray/60 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="relative rounded-xl border border-lightgray/60 bg-smoke p-3">
                    <span className="absolute right-2 top-2 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-600">sharp corner</span>
                    <div className="mx-auto mt-6 h-16 w-28 rounded-bl-md rounded-br-md rounded-tr-none bg-amber-700/80 shadow-inner sm:w-32" />
                    <p className="mt-3 text-xs font-medium text-charcoal">Square-cut edge</p>
                  </div>
                  <div className="relative rounded-xl border border-lime bg-lime/10 p-3">
                    <span className="absolute right-2 top-2 rounded-full bg-lime px-2 py-0.5 text-[10px] font-semibold text-black">smooth &amp; rounded</span>
                    <div className="mx-auto mt-6 h-16 w-28 rounded-bl-md rounded-br-md rounded-tr-2xl bg-amber-700/80 shadow-inner ring-2 ring-lime sm:w-32" />
                    <p className="mt-3 text-xs font-semibold text-ink">Moulded edge</p>
                  </div>
                </div>
                <p className="mt-3 text-center text-[11px] text-charcoal/70">Drawing of an edge cross-section, for illustration.</p>
              </div>
            </Reveal>

            <div className="relative mt-8 space-y-5">
              {/* lime line that draws itself down through the three steps */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 1.6, ease: 'easeOut' }}
                className="absolute bottom-8 left-8 top-8 w-0.5 origin-top bg-linear-to-b from-lime via-lime/70 to-lime/30"
              />
              {edgeBenefits.map(({ icon, title, text }, i) => (
                <Benefit key={title} Icon={icon} title={title} text={text} i={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
