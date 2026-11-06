import { pool } from './db'

// Modular kitchens and house interiors are services (made and fitted at the customer's home),
// so they are shown on the /interiors page and kept out of the normal product lists.
export const SERVICE_SLUGS = ['modular-kitchen', 'house-interior']

// Not shown as product categories: services, and the old "Others" (finishes now have their own /colours page)
const HIDDEN_SLUGS = [...SERVICE_SLUGS, 'others', 'colours']

// Products that have no photo yet are NOT shown in lists (no empty "Photo coming soon" cards).
// As soon as photos are added to a product in the database, it appears everywhere by itself.
const HAS_PHOTO = 'cardinality(p.images) > 0'

const PRODUCT_SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name
  FROM products p JOIN categories c ON c.id = p.category_id
`

async function safe(fn, fallback) {
  try {
    return await fn()
  } catch (err) {
    console.error('DB error:', err.message)
    return fallback
  }
}

// Product categories only (no interiors). Counts and menu items include only products with photos.
export const getCategories = () =>
  safe(async () => {
    const { rows } = await pool.query(
      `
      SELECT c.*, COUNT(p.id)::int AS product_count,
        COALESCE(
          json_agg(json_build_object('name', p.name, 'slug', p.slug, 'image', p.images[1]) ORDER BY p.id)
            FILTER (WHERE p.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM categories c LEFT JOIN products p ON p.category_id = c.id AND ${HAS_PHOTO}
      WHERE c.slug <> ALL($1)
      GROUP BY c.id ORDER BY c.sort_order, c.id`,
      [HIDDEN_SLUGS]
    )
    return rows
  }, [])

// Modular Kitchen + House Interior (for the home page band)
export const getServiceCategories = () =>
  safe(async () => {
    const { rows } = await pool.query(
      'SELECT * FROM categories WHERE slug = ANY($1) ORDER BY sort_order, id',
      [SERVICE_SLUGS]
    )
    return rows
  }, [])

export const getCategory = (slug) =>
  safe(async () => {
    const { rows } = await pool.query('SELECT * FROM categories WHERE slug = $1', [slug])
    return rows[0] ?? null
  }, null)

export const getProducts = (q = '') =>
  safe(async () => {
    const term = `%${q.trim()}%`
    const { rows } = await pool.query(
      `${PRODUCT_SELECT}
       WHERE c.slug <> ALL($2) AND ${HAS_PHOTO}
         AND ($1 = '%%' OR p.name ILIKE $1 OR p.description ILIKE $1 OR c.name ILIKE $1)
       ORDER BY c.sort_order, p.id`,
      [term, HIDDEN_SLUGS]
    )
    return rows
  }, [])

export const getProductsByCategory = (slug) =>
  safe(async () => {
    const { rows } = await pool.query(`${PRODUCT_SELECT} WHERE c.slug = $1 AND ${HAS_PHOTO} ORDER BY p.id`, [slug])
    return rows
  }, [])

// Puthusa add pannina ellaa products-um (latest first) marquee-la kaatta update seyyappattuladhu
export const getFeaturedProducts = (limit = 15) =>
  safe(async () => {
    const { rows } = await pool.query(
      `${PRODUCT_SELECT} WHERE ${HAS_PHOTO} AND c.slug <> ALL($2) ORDER BY p.id DESC LIMIT $1`,
      [limit, HIDDEN_SLUGS]
    )
    return rows
  }, [])

export const getProduct = (categorySlug, slug) =>
  safe(async () => {
    const { rows } = await pool.query(`${PRODUCT_SELECT} WHERE c.slug = $1 AND p.slug = $2`, [categorySlug, slug])
    return rows[0] ?? null
  }, null)

// First product (with photos) whose name starts with the given text. Used for the home page "Dressing Table" card.
export const getProductByName = (namePrefix) =>
  safe(async () => {
    const { rows } = await pool.query(
      `${PRODUCT_SELECT} WHERE p.name ILIKE $1 AND ${HAS_PHOTO} ORDER BY p.id LIMIT 1`,
      [`${namePrefix}%`]
    )
    return rows[0] ?? null
  }, null)

export const getRelated = (categoryId, excludeId, limit = 3) =>
  safe(async () => {
    const { rows } = await pool.query(
      `${PRODUCT_SELECT} WHERE p.category_id = $1 AND p.id <> $2 AND ${HAS_PHOTO} ORDER BY p.id LIMIT $3`,
      [categoryId, excludeId, limit]
    )
    return rows
  }, [])

// Products made in each finish, for the finish picker. Returns { 'mahogany': [{name, slug, category_slug, image}], ... }
// A finish with no products is simply missing from the result, so the picker shows only the description tooltip for it.
export const getProductsByFinish = () =>
  safe(async () => {
    const { rows } = await pool.query(
      `SELECT f AS finish, p.name, p.slug, c.slug AS category_slug, p.images[1] AS image
       FROM products p
       JOIN categories c ON c.id = p.category_id
       CROSS JOIN LATERAL unnest(p.finishes) AS f
       WHERE c.slug <> ALL($1) AND ${HAS_PHOTO}
       ORDER BY p.id`,
      [HIDDEN_SLUGS]
    )
    const map = {}
    for (const r of rows) (map[r.finish] ??= []).push({ name: r.name, slug: r.slug, category_slug: r.category_slug, image: r.image })
    return map
  }, {})