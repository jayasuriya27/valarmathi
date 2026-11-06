import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-24 text-center">
      <h1 className="font-display text-5xl text-ink">Page not found</h1>
      <p className="mt-4">The page you are looking for does not exist or has moved.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-full bg-cerulean px-6 py-3 font-semibold text-white">Go to home</Link>
        <Link href="/products" className="rounded-full border border-cerulean px-6 py-3 font-semibold text-cerulean">See products</Link>
      </div>
    </section>
  )
}
