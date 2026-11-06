import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import FinishPicker from '@/components/FinishPicker'
import Reveal from '@/components/Reveal'
import { waLink } from '@/lib/site'
import { getProductsByFinish } from '@/lib/queries'

export const metadata = {
  title: 'Finishes & Colours',
  description: 'Laminate and wood finishes available for Valarmathi Industries furniture and interiors.',
}

export default async function Colours() {
  const productsByFinish = await getProductsByFinish()
  return (
    <>
      <PageHeader title="Finishes & Colours" text="Choose from our laminate and wood finishes. Tap a colour to see its details and ask if a product is available in it." />
      <section className="mx-auto max-w-6xl px-5 py-12">
        <Reveal>
          <FinishPicker productsByFinish={productsByFinish} />
        </Reveal>

        <Reveal>
          <div className="mt-14 rounded-2xl bg-cerulean px-6 py-10 text-center text-white">
            <h2 className="font-display text-2xl sm:text-3xl">Not sure which colour suits your room?</h2>
            <p className="mx-auto mt-2 max-w-xl text-white/90">Tell us the furniture and the room. We will help you choose.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={waLink('Hi, please help me choose a colour for my furniture.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 font-semibold text-black transition hover:bg-white">
                <MessageCircle size={18} /> Ask on WhatsApp
              </a>
              <Link href="/products" className="rounded-full border border-white px-6 py-3 font-semibold transition hover:bg-white hover:text-cerulean">See products</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
