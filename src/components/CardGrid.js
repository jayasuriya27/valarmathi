// Cards in rows of 1 / 2 / 3. A row that is not full (for example only 2 products) is centred,
// so it does not sit on the left with an empty gap on the right.
export default function CardGrid({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap justify-center gap-6 ${className}`}>
      {(Array.isArray(children) ? children : [children]).map((child, i) => (
        <div key={child?.key ?? i} className="w-full min-w-0 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] [&>div]:h-full">
          {child}
        </div>
      ))}
    </div>
  )
}
