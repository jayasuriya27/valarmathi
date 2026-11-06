'use client'
import { CalendarDays, Hammer, LayoutGrid } from 'lucide-react'
import Reveal from './Reveal'
import Counter from './Counter'
import { site } from '@/lib/site'
import { useCenterLit } from '@/lib/useCenterLit'

function Stat({ Icon, n, suffix, label }) {
  const [ref, lit, bind] = useCenterLit() // phone: lit in the middle of the screen, or when tapped

  return (
    <div
      ref={ref}
      {...bind}
      className={`group relative flex h-full flex-col items-center gap-2 overflow-hidden rounded-xl border bg-smoke px-2 py-4 text-center transition duration-300 active:scale-[0.98] sm:flex-row sm:gap-4 sm:px-6 sm:py-5 sm:text-left ${
        lit ? '-translate-y-0.5 border-cerulean/40 bg-white shadow-lg' : 'border-lightgray/60 hover:-translate-y-1 hover:border-cerulean/40 hover:bg-white hover:shadow-lg'
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition duration-300 sm:h-12 sm:w-12 sm:rounded-xl ${
          lit ? 'bg-cerulean text-white' : 'bg-cerulean/10 text-cerulean group-hover:bg-cerulean group-hover:text-white'
        }`}
      >
        <Icon className="h-[18px] w-[18px] sm:h-6 sm:w-6" />
      </span>
      <div>
        <p className="font-display text-3xl leading-none text-cerulean sm:text-4xl">
          <Counter to={n} suffix={suffix} />
        </p>
        <p className="mt-1 text-[11px] leading-tight sm:text-sm">{label}</p>
      </div>
      <span className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-lime transition duration-500 ${lit ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
    </div>
  )
}

// Big numbers under the About text. Edit the numbers or labels below.
export default function StatsBand() {
  const year = new Date().getFullYear()
  const stats = [
    [CalendarDays, year - site.since, '+', 'years of furniture making'],
    [Hammer, year - site.expandedYear, '+', 'years of wooden interiors'],
    [LayoutGrid, 100, '+', 'designs in our catalogue'],
  ]

  return (
    <section className="bg-white pb-14 lg:pb-16">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-3 px-5 sm:gap-5">
        {stats.map(([Icon, n, suffix, label], i) => (
          <Reveal key={label} delay={i * 0.12}>
            <Stat Icon={Icon} n={n} suffix={suffix} label={label} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
