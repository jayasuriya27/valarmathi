'use client'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { features } from '@/lib/site'
import { useCenterLit } from '@/lib/useCenterLit'

function Card({ f, i, cardBg }) {
  const [ref, lit, bind] = useCenterLit() // lit = in the middle of a phone screen, or tapped

  return (
    <div
      ref={ref}
      {...bind}
      className={`group relative h-full overflow-hidden rounded-2xl border p-7 transition duration-300 active:scale-[0.98] ${cardBg} ${
        lit ? '-translate-y-1 border-cerulean/40 shadow-xl' : 'border-lightgray/60 hover:-translate-y-1.5 hover:border-cerulean/40 hover:shadow-xl'
      }`}
    >
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 ${
          lit ? 'scale-105 bg-cerulean text-white' : 'bg-cerulean/10 text-cerulean group-hover:scale-105 group-hover:bg-cerulean group-hover:text-white'
        }`}
      >
        <f.icon size={26} />
      </span>
      <h3 className={`relative mt-5 text-lg font-semibold transition ${lit ? 'text-cerulean' : 'text-ink group-hover:text-cerulean'}`}>{f.title}</h3>
      <p className="relative mt-2 text-sm">{f.text}</p>
      <span className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-lime transition duration-500 ${lit ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
    </div>
  )
}

// The reasons to choose us (from `features` in src/lib/site.js).
// The section is white with grey cards, or grey with white cards (tone), so it stands out from its neighbours.
export default function WhyChooseUs({ title = 'Why customers choose us', text, tone = 'bg-white' }) {
  const cardBg = tone === 'bg-white' ? 'bg-smoke' : 'bg-white'
  return (
    <section className={`${tone} py-20`}>
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title={title} text={text} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <Card f={f} i={i} cardBg={cardBg} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}