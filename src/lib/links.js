// If a category has only ONE product, the category card / menu link goes straight to that product page
// (Dressing Table, TV Wall Unit). With 2 or more products it opens the category list.
export const categoryHref = (c) =>
  (c.items?.length ?? 0) === 1 ? `/products/${c.slug}/${c.items[0].slug}` : `/products/${c.slug}`

export const colourHref = (slugOrName) => `/colours/${slugOrName}`
