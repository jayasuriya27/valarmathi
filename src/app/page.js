import Link from 'next/link'
import { Phone, MapPin, MessageCircle, ArrowRight, Check } from 'lucide-react'
import HeroSlider from '@/components/HeroSlider'
import SmartImage from '@/components/SmartImage'
import FinishPicker from '@/components/FinishPicker'
import CategoryCard from '@/components/CategoryCard'
import Marquee from '@/components/Marquee'
import Reveal from '@/components/Reveal'
import Counter from '@/components/Counter'
import SectionHeading from '@/components/SectionHeading'
import AboutVideo from '@/components/AboutVideo'
import StatsBand from '@/components/StatsBand'
import EdgeHighlight from '@/components/EdgeHighlight'
import ProcessSteps from '@/components/ProcessSteps'
import WhyChooseUs from '@/components/WhyChooseUs'
import { getCategories, getFeaturedProducts, getServiceCategories, getProductsByFinish } from '@/lib/queries'
import { site, features, waLink, mapsLink, mapsEmbed } from '@/lib/site'

const aboutPoints = [
  'Steel and wooden furniture made in our own Salem workshop',
  'Custom wooden interiors designed around each client',
  'Made to your size, finish and colour',
]

export default async function Home() {
  const [categories, featured, services, productsByFinish] = await Promise.all([
    getCategories(),
    getFeaturedProducts(10),
    getServiceCategories(),
    getProductsByFinish(),
  ])
  const year = new Date().getFullYear()
  const totalProducts = categories.reduce((n, c) => n + c.product_count, 0)

  return (
    <>
      <HeroSlider />

      {/* About: right after the hero so visitors meet the company first */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2 lg:gap-14 lg:py-20">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-cerulean">About us</p>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Making furniture in Salem since {site.since}</h2>
            <p className="mt-4">
              At Valarmathi Industries we don’t just make furniture. We craft pieces that turn your space into a statement of style,
              comfort and individuality. What started as a passion for fine steel furniture has grown into a full-service brand offering
              both wooden and steel furniture built to last.
            </p>
            <ul className="mt-5 space-y-2">
              {aboutPoints.map((t) => (
                <li key={t} className="flex gap-2 text-sm">
                  <Check size={18} className="mt-0.5 shrink-0 text-cerulean" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/about" className="rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">Read our story</Link>
              <Link href="/products" className="rounded-full border border-cerulean px-6 py-3 font-semibold text-cerulean transition hover:bg-cerulean hover:text-white">See our products</Link>
            </div>
          </Reveal>

          {/* workshop video: shown on mobile and desktop, no Reveal wrapper so it stays steady */}
          <div className="w-full"><AboutVideo sound src="/videos/home-about.mp4" poster="/images/about/home-about-poster.jpg" title="" /></div>
        </div>
      </section>

      <StatsBand />

      {/* Moulded edge: the machine and work the shop is known for */}
      <EdgeHighlight />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <SectionHeading title="Find what you need" text="Choose a category to see every design we make. Open a product to see details and send an enquiry." />
        </Reveal>
        {categories.length === 0 ? (
          <p className="text-center">Products are being updated. Please call us on {site.phones[0]}.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {categories.map((c, i) => (
              <div key={c.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
                <Reveal delay={(i % 3) * 0.08}>
                  <CategoryCard category={c} />
                </Reveal>
              </div>
            ))}

          </div>
        )}
      </section>

      {/* Colours available */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <SectionHeading title="Colours available" text="Choose from our laminate and wood finishes. Tap a colour to see its details and ask if a product is available in it." />
          </Reveal>
          <Reveal delay={0.1}>
            <FinishPicker productsByFinish={productsByFinish} />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-center">
              <Link href="/colours" className="inline-flex items-center gap-1 font-medium text-cerulean hover:underline">
                See all finishes <ArrowRight size={14} />
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Interiors (a service we do at the customer's home, so it is shown apart from products) */}
      {services.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <SectionHeading title="Interiors for your home" text="Beyond furniture, we plan, make and fit modular kitchens and complete home interiors at your place." />
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {services.map((s, i) => (
                <Reveal key={s.id} delay={i * 0.1}>
                  <Link
                    href={`/interiors#${s.slug === 'modular-kitchen' ? 'kitchen' : 'home-interiors'}`}
                    className="group relative block h-80 overflow-hidden rounded-2xl border border-lightgray/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
                  >
                    <SmartImage src={s.image} alt={s.name} fit="cover" className="h-full w-full transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="font-display text-2xl sm:text-3xl">{s.name}</h3>
                      <p className="mt-1 max-w-md text-sm text-white/85">{s.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm text-lime">
                        See how we work <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Auto-moving strip */}
      {featured.length > 0 && (
        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHeading title="Popular designs" text="Hover to pause, click to see details." />
          </div>
          <Marquee products={featured} />
        </section>
      )}

      <WhyChooseUs tone="bg-smoke" />

      <ProcessSteps />

      {/* Call to action */}
      <section className="bg-cerulean px-5 py-16 text-center text-white">
        <Reveal>
          <h2 className="font-display text-3xl sm:text-4xl">Have a room in mind? Tell us the size.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Send us your space details and we will call you back with ideas.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/custom-design" className="rounded-full bg-lime px-7 py-3 font-semibold text-black transition hover:bg-white">Start a custom design</Link>
            <a href={waLink('Hi, I want a custom design for my space.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-3 font-semibold transition hover:bg-white hover:text-cerulean">
              <MessageCircle size={18} /> WhatsApp us
            </a>
          </div>
        </Reveal>
      </section>

      {/* Visit us */}
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-20 lg:grid-cols-2">
        <Reveal>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Visit our workshop</h2>
          <p className="mt-4 flex gap-2"><MapPin className="mt-1 shrink-0 text-cerulean" size={20} /> {site.address}</p>
          <p className="mt-3 flex gap-2"><Phone className="mt-1 shrink-0 text-cerulean" size={20} />
            <span><a className="hover:text-cerulean" href={`tel:+91${site.phones[0]}`}>{site.phones[0]}</a>, <a className="hover:text-cerulean" href={`tel:+91${site.phones[1]}`}>{site.phones[1]}</a></span>
          </p>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">
            <MapPin size={18} /> Get directions
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <iframe title="Valarmathi Industries on Google Maps" src={mapsEmbed} loading="lazy" className="h-72 w-full rounded-2xl border-0 shadow-sm" referrerPolicy="no-referrer-when-downgrade" />
        </Reveal>
      </section>
    </>
  )
}