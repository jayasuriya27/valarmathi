import { Poppins, DM_Serif_Display } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FloatingButtons from '@/components/FloatingButtons'
import { getCategories } from '@/lib/queries'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' })
const display = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-display' })

// Pages read from the database on every request, so new products show up immediately.
export const dynamic = 'force-dynamic'

export const viewport = { width: 'device-width', initialScale: 1 }

export const metadata = {
  title: {
    default: 'Valarmathi Industries | Wood & Steel Furniture, Salem',
    template: '%s | Valarmathi Industries',
  },
  description:
    'Wooden and steel furniture, modular kitchens and custom house interiors in Salem. Handcrafted since 1985 by Valarmathi Industries.',
  icons: { icon: '/images/logo.jpeg' },
}

export default async function RootLayout({ children }) {
  const categories = await getCategories()
  return (
    <html lang="en" className={`${poppins.variable} ${display.variable}`}>
      <body className="bg-smoke font-sans text-charcoal antialiased">
        <Navbar categories={categories} />
        <main>{children}</main>
        <Footer categories={categories} />
        <FloatingButtons />
      </body>
    </html>
  )
}
