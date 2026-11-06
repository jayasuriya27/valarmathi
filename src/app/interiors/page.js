import Link from 'next/link'
import { MessageCircle, Check } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import SectionHeading from '@/components/SectionHeading'
import SmartImage from '@/components/SmartImage'
import Reveal from '@/components/Reveal'
import InteriorGallery from '@/components/InteriorGallery'
import { getCategory, getProductsByCategory } from '@/lib/queries'
import { waLink } from '@/lib/site'

export const metadata = {
  title: 'Interiors',
  description: 'Modular kitchens and complete home interiors, planned around your space, made to measure and fitted at your home by Valarmathi Industries.',
}

const steps = [
  ['Site visit', 'We visit your home and take exact measurements.'],
  ['Design', 'We plan the layout, storage and finishes together with you.'],
  ['Making', 'Your interior is made to the design you approved.'],
  ['Fitting', 'Our team fits everything at your home and finishes the work.'],
]

const kitchenPoints = [
  'Exact measurements taken at your home',
  'Layout planned around how you cook',
  'Storage planned for your needs',
  'Choice of laminate and wood finishes',
  'Made to measure and fitted at your home',
]

export default async function Interiors() {
  const [kitchen, interiors] = await Promise.all([getCategory('modular-kitchen'), getProductsByCategory('house-interior')])

  return (
    <>
      <PageHeader
        title="Interiors"
        text="Modular kitchens and complete home interiors, planned around your space, made to measure and fitted at your home."
      />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <Reveal>
          <SectionHeading title="We come to you" text="Interior work is different from buying a ready-made piece. We plan it for your home and do the work there." />
        </Reveal>
        <ol className="grid gap-6 md:grid-cols-4">
          {steps.map(([title, text], i) => (
            <Reveal key={title} delay={i * 0.1}>
              <li className="h-full rounded-2xl border border-lightgray/60 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-cerulean/40 hover:shadow-lg active:scale-[0.98]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime font-bold text-black">{i + 1}</span>
                <h3 className="mt-3 font-semibold text-ink">{title}</h3>
                <p className="mt-1 text-sm">{text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Modular kitchen */}
      <section id="kitchen" className="scroll-mt-32 bg-white py-16">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-lightgray/60">
              <SmartImage src={kitchen?.image} alt="Modular kitchen" fit="cover" className="h-80 w-full sm:h-[26rem]" />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">Sample design</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">Modular Kitchen</h2>
            <p className="mt-4">{kitchen?.description ?? 'Modular kitchens planned around your space, storage needs and cooking style.'}</p>
            <ul className="mt-5 space-y-2">
              {kitchenPoints.map((t) => (
                <li key={t} className="flex gap-2 text-sm">
                  <Check size={18} className="mt-0.5 shrink-0 text-cerulean" /> {t}
                </li>
              ))}
            </ul>
            <a
              href={waLink('Hi, I would like a modular kitchen for my home. Please arrange a site visit.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95"
            >
              <MessageCircle size={18} /> Ask about a modular kitchen
            </a>
          </Reveal>
        </div>
      </section>

      {/* House interiors */}
      <section id="home-interiors" className="mx-auto max-w-6xl scroll-mt-32 px-5 py-16">
        <Reveal>
          <SectionHeading title="Home Interiors" text="Interior designs we build for you. Tell us your room size and we plan it with you." />
        </Reveal>

        <InteriorGallery items={interiors} />
      </section>

      {/* Call to action */}
      <section className="bg-cerulean px-5 py-16 text-center text-white">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Planning a kitchen or a full home interior?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Tell us about your home and we will arrange a visit to take measurements and discuss ideas.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={waLink('Hi, I want to plan an interior for my home. Please arrange a site visit.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3 font-semibold text-black transition hover:bg-white"
            >
              <MessageCircle size={18} /> Arrange a site visit
            </a>
            <Link href="/custom-design" className="rounded-full border border-white px-7 py-3 font-semibold transition hover:bg-white hover:text-cerulean">
              Send room details
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
