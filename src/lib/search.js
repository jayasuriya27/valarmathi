import { pool } from './db'
import { FINISHES, colourSlug } from './colours'
import { rooms } from './rooms'
import { getRoomTiles } from './interiors'

// Search across the whole site: products, interiors, colours, categories and pages.

const NOT_SHOWN = ['others', 'colours'] // old categories that are not shown anywhere
const SERVICE_HREF = { 'modular-kitchen': '/interiors#kitchen', 'house-interior': '/interiors#home-interiors' }

// Other words people use. "bed" also finds cots, "almirah" finds wardrobes, and so on.
const SYNONYMS = {
  bed: ['cot'],
  cot: ['bed'],
  cupboard: ['wardrobe'],
  almirah: ['wardrobe'],
  almira: ['wardrobe'],
  mandir: ['pooja'],
  puja: ['pooja'],
  temple: ['pooja'],
  television: ['tv'],
  desk: ['table'],
  colour: ['color', 'finish', 'laminate'],
  color: ['colour', 'finish', 'laminate'],
  finish: ['colour', 'laminate'],
  laminate: ['colour', 'finish'],
  interior: ['interiors'],
  cabinet: ['kitchen', 'wardrobe'],
}

const PAGES = [
  { title: 'About us', sub: 'Our story', href: '/about', keywords: 'about us story history salem company who we are workshop' },
  { title: 'Products', sub: 'All furniture designs', href: '/products', keywords: 'products furniture catalogue designs all' },
  { title: 'Interiors', sub: 'Kitchen and home interiors', href: '/interiors', keywords: 'interiors interior kitchen home house site visit' },
  { title: 'Colours', sub: 'Laminate and wood colours', href: '/colours', keywords: 'colours colors colour finish laminate wood shade' },
  { title: 'Custom Design', sub: 'Send your own size and idea', href: '/custom-design', keywords: 'custom design made to measure own size idea order' },
  { title: 'Sustainability', sub: 'How we care for wood and the planet', href: '/sustainability', keywords: 'sustainability environment eco wood planet green' },
  { title: 'Contact', sub: 'Phone, WhatsApp and address', href: '/contact', keywords: 'contact phone call whatsapp address location map visit enquiry' },
]

const stem = (t) => (t.length > 3 && t.endsWith('s') ? t.slice(0, -1) : t)
const tokenize = (q) => q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).slice(0, 6)

// every word typed must match; each word can also match its singular form or a synonym
function termGroups(q) {
  return tokenize(q).map((tok) => {
    const set = new Set([tok, stem(tok)])
    for (const t of [...set]) (SYNONYMS[t] ?? []).forEach((s) => set.add(s))
    return [...set]
  })
}

const matches = (text, groups) => {
  const hay = text.toLowerCase()
  return groups.every((terms) => terms.some((t) => hay.includes(t)))
}

const like = (t) => `%${t.replace(/[\\%_]/g, '\\$&')}%`

// "col ILIKE ANY($n)" for every word, joined with AND
function where(groups, columns, params) {
  return groups
    .map((terms) => {
      params.push(terms.map(like))
      const n = params.length // position of the value just added
      return `(${columns.map((c) => `${c} ILIKE ANY($${n}::text[])`).join(' OR ')})`
    })
    .join(' AND ')
}

async function run(sql, params) {
  try {
    const { rows } = await pool.query(sql, params)
    return rows
  } catch (err) {
    console.error('Search error:', err.message)
    return []
  }
}

export async function searchAll(q, { limit = 30 } = {}) {
  const query = (q ?? '').trim()
  const result = { query, products: [], interiors: [], colours: [], categories: [], pages: [], total: 0 }
  const groups = termGroups(query)
  if (groups.length === 0) return result

  // products (Image illatha products-ai thavirka p.images IS NOT NULL matrum array check add seyyappattuladhu)
  const pParams = [NOT_SHOWN]
  const pWhere = where(groups, ['p.name', 'p.description', 'p.material', 'c.name'], pParams)
  pParams.push(groups[0].map(like))
  const products = await run(
    `SELECT p.*, c.slug AS category_slug, c.name AS category_name
     FROM products p JOIN categories c ON c.id = p.category_id
     WHERE c.slug <> ALL($1) 
       AND p.images IS NOT NULL 
       AND array_length(p.images, 1) > 0 
       AND ${pWhere}
     ORDER BY (p.name ILIKE ANY($${pParams.length}::text[])) DESC, c.sort_order, p.id
     LIMIT ${Number(limit) || 30}`,
    pParams
  )
  result.products = products.map((p) => ({
    ...p,
    href: SERVICE_HREF[p.category_slug] ?? `/products/${p.category_slug}/${p.slug}`,
    isInterior: Boolean(SERVICE_HREF[p.category_slug]),
  }))

  // categories
  const cParams = [[...NOT_SHOWN, 'modular-kitchen', 'house-interior']]
  const cWhere = where(groups, ['c.name', 'c.description'], cParams)
  const cats = await run(`SELECT c.slug, c.name, c.image FROM categories c WHERE c.slug <> ALL($1) AND ${cWhere} ORDER BY c.sort_order`, cParams)
  result.categories = cats.map((c) => ({ ...c, href: `/products/${c.slug}` }))

  // interiors (rooms and the kitchen)
  const roomHits = rooms.filter((r) => matches(`${r.label} ${r.keywords}`, groups))
  if (roomHits.length) {
    const tiles = await getRoomTiles()
    const ids = new Set(roomHits.map((r) => r.id))
    result.interiors = tiles.filter((t) => ids.has(t.id))
  }

  // colours
  result.colours = FINISHES.filter((f) => matches(`${f.name} colour color laminate finish wood`, groups)).map((f) => ({
    name: f.name,
    image: f.image,
    href: `/colours/${colourSlug(f.name)}`,
  }))

  // pages
  result.pages = PAGES.filter((p) => matches(`${p.title} ${p.keywords}`, groups))

  result.total =
    result.products.length + result.interiors.length + result.colours.length + result.categories.length + result.pages.length
  return result
}