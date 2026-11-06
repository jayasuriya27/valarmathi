import { Phone, MessageCircle } from 'lucide-react'
import { site, waLink } from '@/lib/site'

// Round Call and WhatsApp buttons on every page, on computer and on phone.
export default function FloatingButtons() {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3 md:bottom-6 md:right-6">
      <a
        href={`tel:+91${site.phones[0]}`}
        aria-label="Call us"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-cerulean text-white shadow-lg transition hover:scale-110 active:scale-95 md:h-12 md:w-12"
      >
        <Phone size={20} />
      </a>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pulse-ring flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-110 active:scale-95 md:h-14 md:w-14"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}
