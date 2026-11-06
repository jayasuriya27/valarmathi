import { getCategories, getCategory, getProductsByCategory } from './queries'
import { rooms } from './rooms'

// The rooms with their photo, taken from the database (the same photos the Interiors page uses)
export async function getRoomTiles() {
  const [cats, interiors, kitchen] = await Promise.all([
    getCategories(),
    getProductsByCategory('house-interior'),
    getCategory('modular-kitchen'),
  ])
  const product = Object.fromEntries(interiors.map((p) => [p.slug, p]))
  const category = Object.fromEntries(cats.map((c) => [c.slug, c]))

  return rooms.map((r) => {
    let image = null
    if (r.product) image = product[r.product]?.images?.[0]
    else if (r.category === 'modular-kitchen') image = kitchen?.image
    else if (r.category) image = category[r.category]?.image
    return { ...r, image: image ?? null, href: `/interiors#${r.id}` }
  })
}
