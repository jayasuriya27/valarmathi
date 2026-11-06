import Link from 'next/link'
import { Check } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Reveal from '@/components/Reveal'
import StatsBand from '@/components/StatsBand'
import ProcessSteps from '@/components/ProcessSteps'
import WhyChooseUs from '@/components/WhyChooseUs'
import { site, waLink } from '@/lib/site'

export const metadata = {
  title: 'About Us',
  description: 'Valarmathi Industries has made steel and wooden furniture in Salem since 1985.',
}

const points = [
  'Steel and wooden furniture made in our own Salem workshop',
  'Custom wooden interiors designed around each client',
  'Made to your size, finish and colour',
]

export default function About() {
  return (
    <>
      <PageHeader title="About us" text="Crafting Comfort. Creating Style." />

      {/* Story */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-cerulean">Our story</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Making furniture in Salem since {site.since}</h2>
            <div className="mt-4 space-y-4">
              <p>
                At Valarmathi Industries, we don’t just make furniture. We craft experiences that turn your space into a statement of style,
                comfort, and individuality.
              </p>
              <p>
                Since {site.since}, we’ve been a trusted name in the world of furniture, combining time-honored craftsmanship with modern design
                to create pieces that truly feel like home. What started as a passion for fine steel furniture has evolved into a full-service
                brand, now proudly offering both wooden and steel furniture that’s built to last and designed to impress.
              </p>
              <p>
                In {site.expandedYear}, we expanded into the wooden interior solutions space, delivering custom-made designs that reflect the
                unique personality of every client.
              </p>
              {/* TODO: Client message was cut at "Whether it's sleek steel furnishings for a modern edge or classic…".
                  Ask the client for the full paragraph and add it here. */}
            </div>
            <ul className="mt-5 space-y-2">
              {points.map((t) => (
                <li key={t} className="flex gap-2 text-sm">
                  <Check size={18} className="mt-0.5 shrink-0 text-cerulean" /> {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <StatsBand />

      {/* Two dates, one after the other */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal>
            <h2 className="mb-10 text-center font-display text-3xl text-ink sm:text-4xl">Our journey</h2>
          </Reveal>
          <div className="relative grid gap-6 sm:grid-cols-2">
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-0.5 w-24 -translate-x-1/2 -translate-y-1/2 bg-lime sm:block" />
            {[
              [site.since, 'Founded', 'We started with fine steel furniture.'],
              [site.expandedYear, 'Wooden interiors', 'We added custom wooden interior solutions.'],
            ].map(([y, title, text], i) => (
              <Reveal key={y} delay={i * 0.15}>
                <div className="group h-full rounded-2xl border-l-4 border-lime bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <p className="font-display text-5xl text-cerulean transition group-hover:scale-105">{y}</p>
                  <h3 className="mt-2 text-lg font-semibold text-ink">{title}</h3>
                  <p className="mt-1 text-sm">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs title="What sets us apart" />

      <ProcessSteps tone="bg-smoke" />

      {/* Call to action */}
      <section className="bg-cerulean px-5 py-16 text-center text-white">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Let’s make something for your home</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Tell us what you need and we will call you back with ideas.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="rounded-full bg-lime px-7 py-3 font-semibold text-black transition hover:bg-white">See our products</Link>
            <a href={waLink('Hi, I would like to know more about Valarmathi Industries.')} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white px-7 py-3 font-semibold transition hover:bg-white hover:text-cerulean">
              WhatsApp us
            </a>
          </div>
        </Reveal>
      </section>
    </>
  )
}
