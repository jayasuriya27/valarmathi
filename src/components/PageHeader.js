export default function PageHeader({ title, text }) {
  return (
    <section className="bg-linear-to-br from-cerulean to-[#0a5f93] px-5 py-16 text-center text-white">
      <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
      {text && <p className="mx-auto mt-4 max-w-2xl text-white/90">{text}</p>}
    </section>
  )
}
