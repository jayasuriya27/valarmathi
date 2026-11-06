import { Phone, MessageCircle, MapPin } from 'lucide-react'
import PageHeader from '@/components/PageHeader'
import EnquiryForm from '@/components/EnquiryForm'
import { site, waLink, mapsLink, mapsEmbed } from '@/lib/site'

export const metadata = {
  title: 'Contact',
  description: 'Call, WhatsApp or visit Valarmathi Industries at Cuddalore Main Road, Ammapet, Salem.',
}

export default function Contact() {
  const card = 'flex items-start gap-4 rounded-2xl border border-lightgray/60 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md'
  return (
    <>
      <PageHeader title="Contact us" text="Call, message or visit. We reply to every enquiry." />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 lg:grid-cols-2">
        <div className="space-y-4">
          <a href={`tel:+91${site.phones[0]}`} className={card}>
            <Phone className="mt-1 text-cerulean" />
            <span><b className="block text-ink">Call us</b>{site.phones[0]}, {site.phones[1]}</span>
          </a>
          <a href={waLink()} target="_blank" rel="noopener noreferrer" className={card}>
            <MessageCircle className="mt-1 text-[#128C7E]" />
            <span><b className="block text-ink">WhatsApp</b>Send us your room photos and size</span>
          </a>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" className={card}>
            <MapPin className="mt-1 text-cerulean" />
            <span><b className="block text-ink">Visit us</b>{site.address}</span>
          </a>
          {/* TODO: add business hours once the client confirms them */}
          <iframe title="Map" src={mapsEmbed} loading="lazy" className="h-64 w-full rounded-2xl border-0" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <EnquiryForm />
      </section>
    </>
  )
}
