export default function SectionHeading({ title, text, align = 'center' }) {
  return (
    <div className={`mb-10 ${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}>
      <h2 className="font-display text-3xl text-ink sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-charcoal">{text}</p>}
    </div>
  )
}
