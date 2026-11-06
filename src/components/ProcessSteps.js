'use client'
import { motion } from 'framer-motion'
import { Hammer, Lightbulb, PencilRuler, Truck } from 'lucide-react'
import { useCenterLit } from '@/lib/useCenterLit'

const steps = [
  [Lightbulb, 'Share your idea', 'Tell us about your space, size and the material you prefer.'],
  [PencilRuler, 'We design', 'We prepare a design that fits your style and dimensions.'],
  [Hammer, 'We craft', 'Skilled artisans build your furniture with careful finishing.'],
  [Truck, 'We deliver', 'Your furniture is delivered and set up in your space.'],
]

function Step({ Icon, title, text, i }) {
  const [ref, lit, bind] = useCenterLit() // phone: lit in the middle of the screen, or when tapped

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: i * 0.15, duration: 0.6 }}
      className="group relative flex items-start gap-4 md:block md:text-center"
    >
      <div
        className={`relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime text-black ring-8 transition duration-300 md:mx-auto md:group-hover:rotate-6 md:group-hover:scale-110 ${
          lit ? 'scale-110 rotate-6 ring-lime/50' : 'ring-lime/25'
        }`}
      >
        <Icon size={28} />
        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">{i + 1}</span>
      </div>
      <div
        ref={ref}
        {...bind}
        className={`flex-1 rounded-2xl border bg-white p-5 text-left transition duration-300 active:scale-[0.98] md:mt-6 md:p-6 md:text-center ${
          lit ? '-translate-y-1 border-lime shadow-xl' : 'border-lightgray/60 shadow-sm md:group-hover:-translate-y-1.5 md:group-hover:border-lime md:group-hover:shadow-xl'
        }`}
      >
        <h3 className="text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm">{text}</p>
      </div>
    </motion.div>
  )
}

export default function ProcessSteps({ tone = 'bg-white' }) {
  return (
    <section className={`relative overflow-hidden ${tone} py-20`}>
      <div className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-lime/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-cerulean/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl text-ink sm:text-4xl">How a custom order works</h2>
          <p className="mt-3">From your first message to delivery, in four simple steps.</p>
        </motion.div>

        <div className="relative mt-12 grid gap-6 md:mt-14 md:grid-cols-4">
          {/* line that draws itself: across on a computer, down on a phone */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-0.5 origin-left bg-linear-to-r from-lime via-lime/70 to-lime/30 md:block"
          />
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute bottom-8 left-8 top-8 w-0.5 origin-top bg-linear-to-b from-lime via-lime/70 to-lime/30 md:hidden"
          />

          {steps.map(([Icon, title, text], i) => (
            <Step key={title} Icon={Icon} title={title} text={text} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
