import { Gem, Ruler, Leaf, Hammer, Award, ShieldCheck } from 'lucide-react'

export const site = {
  name: 'Valarmathi Industries',
  tagline: 'Crafting Comfort. Creating Style.',
  since: 1985,
  expandedYear: 2015,
  address: '158, Cuddalore Main Road, Ammapet, Salem – 636003',
  phones: ['7397576288', '8072697398'],
  // TODO: confirm with the client that this number is on WhatsApp
  whatsapp: '7397576288',
}

export const waLink = (text = 'Hi, I would like to enquire about your furniture.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`

export const mapsLink =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent('Valarmathi Industries, 158 Cuddalore Main Road, Ammapet, Salem 636003')

export const mapsEmbed =
  'https://www.google.com/maps?q=' +
  encodeURIComponent('158 Cuddalore Main Road, Ammapet, Salem 636003') +
  '&output=embed'

export const features = [
  { icon: Gem, title: 'Premium Materials', text: 'We use only the finest woods, metals, and fabrics, carefully selected to ensure timeless elegance, exceptional durability, and lasting quality in every piece.' },
  { icon: Ruler, title: 'Custom Design Service', text: 'Every space is unique. Our bespoke design service ensures your furniture is too, thoughtfully tailored to fit your style, needs, and dimensions.' },
  { icon: Leaf, title: 'Sustainability Practices', text: 'We craft beautiful furniture using eco-friendly materials and ethical processes, designed to minimize impact and honor our commitment to the planet.' },
  { icon: Hammer, title: 'Handmade Craftsmanship', text: 'Each piece is meticulously handcrafted by skilled artisans, blending time-honored techniques with contemporary design for unmatched character and quality.' },
  { icon: Award, title: 'Award-Winning Designs', text: 'Our innovative creations have earned industry acclaim and are celebrated by homeowners and interior designers for their style and functionality.' },
  { icon: ShieldCheck, title: 'Child-Safe Rounded Edges', text: 'Our advanced edge moulding technology transforms sharp furniture edges into smooth, rounded finishes, reducing the risk of accidental bumps and injuries while creating a safer environment for children and families.' },
]

// Hero slider content configured with badges for the workshop, moulded edges, and Salem.
export const heroSlides = [
  {
    image: '/images/hero/hero-video-poster.jpg',
    video: '/videos/hero.mp4',
    duration: 15000,
    badge: 'Since 1985',
    title: 'Crafted with care in our own workshop',
    text: 'From cutting and edge banding to drilling, every piece is made by our own team.',
    href: '/about', cta: 'Our story',
  },
  {
    image: '/images/hero/hero-video-poster.jpg',
    video: '/videos/hero2.mp4',
    duration: 15000,
    title: 'Every edge finished to perfection',
    text: 'Clean cuts, smooth edge banding and a finish that lasts for years.',
    href: '/products', cta: 'Explore products',
  },
  {
    image: '/images/hero/hero-1.webp',
    title: 'Furniture that makes a room feel like home',
    text: 'Wooden and steel furniture, handcrafted in Salem.',
    href: '/products', cta: 'Explore products',
  },
  {
    image: '/images/hero/hero-2.webp',
    title: 'TV units made to fit your wall',
    text: 'Tell us the size and finish. We build it to fit.',
    href: '/products/tv-wall-unit/modern-walnut-cream-tv-unit', cta: 'See TV wall unit',
  },
  {
    image: '/images/hero/hero-3.webp',
    title: 'Wardrobes with space for everything',
    text: 'Two-door and three-door wardrobes in walnut, oak and grey finishes.',
    href: '/products/wardrobe', cta: 'See wardrobes',
  },
  {
    image: '/images/hero/hero-4.webp',
    title: 'Office desks and home workspaces',
    text: 'Desks with lockable drawers, cable management and smooth slides.',
    href: '/products/table', cta: 'See tables',
  },
]