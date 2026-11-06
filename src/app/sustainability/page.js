import { Leaf, ShieldCheck, Hammer, ArrowRight, MessageCircle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import Reveal from '@/components/Reveal'
import { waLink } from '@/lib/site'

export const metadata = {
  title: 'Sustainability',
  description: 'How Valarmathi Industries approaches eco-friendly materials and ethical processes.',
}

const points = [
  [Leaf, 'Eco-friendly materials', 'We craft beautiful furniture using eco-friendly materials.', 'Hi, I would like to know more about the materials you use.'],
  [ShieldCheck, 'Ethical processes', 'We follow ethical processes designed to minimize impact.', 'Hi, I would like to know more about your making process.'],
  [Hammer, 'Built to last', 'Furniture made to last for years means less waste for the planet.', 'Hi, I would like to know how your furniture is built to last.'],
]

export default function Sustainability() {
  return (
    <>
      <PageHeader title="Sustainability practices" text="We craft beautiful furniture using eco-friendly materials and ethical processes, designed to minimize impact and honor our commitment to the planet." />
      <section className="mx-auto grid max-w-5xl gap-6 px-5 py-16 md:grid-cols-3">
        {points.map(([Icon, title, text, msg], i) => (
          <Reveal key={title} delay={i * 0.1}>
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full rounded-2xl border border-lightgray/60 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-cerulean/40 hover:shadow-xl active:scale-[0.98]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime/30 text-ink transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:bg-lime">
                <Icon size={24} />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink transition group-hover:text-cerulean">{title}</h3>
              <p className="mt-2 text-sm">{text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-cerulean opacity-70 transition group-hover:opacity-100">
                Ask us about this <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        ))}
      </section>

      <section className="bg-cerulean px-5 py-14 text-center text-white">
        <Reveal>
          <h2 className="font-display text-3xl">Want to know how your furniture is made?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Visit our workshop in Salem or message us. We are happy to answer your questions.</p>
          <a href={waLink('Hi, I have a question about how your furniture is made.')} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3 font-semibold text-black transition hover:bg-white">
            <MessageCircle size={18} /> Ask on WhatsApp
          </a>
        </Reveal>
      </section>
      {/* TODO: add certifications, wood sourcing details or measurable claims only after the client provides them. */}
    </>
  )
}