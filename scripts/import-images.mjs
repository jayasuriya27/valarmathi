// Usage (from the valarmathi-next folder):
//   node scripts/import-images.mjs "C:\Users\Admin\Downloads\mockup images"
//
// What it does:
//  1. Reads the marketing team folders (tv unit, office desk, wardrobe ...)
//  2. Compresses every photo to WebP (max 1600px) into public/images/products/<product>/
//  3. Makes the 4 hero slider photos in public/images/hero/
//  4. Writes db/seed.sql (categories + products) using those photos
// Then run:  node --env-file=.env.local db/setup.mjs
import fs from 'node:fs'
import path from 'node:path'

const RAW = process.argv[2]
if (!RAW || !fs.existsSync(RAW)) {
  console.error('Give the path of the marketing images folder, for example:')
  console.error('  node scripts/import-images.mjs "C:\\Users\\Admin\\Downloads\\mockup images"')
  process.exit(1)
}

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('WARNING: "sharp" is not installed, so photos will be copied without compressing (site will be slow).')
  console.warn('Run:  npm install sharp   and run this script again.\n')
}

const OUT = path.resolve('public/images')
const MAX_PER_PRODUCT = 14
const IMG = /\.(png|jpe?g|webp)$/i
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
const base = (f) => path.basename(f, path.extname(f)).toLowerCase()

// find a sub folder by name (ignores capital letters)
function dirOf(parent, name) {
  if (!fs.existsSync(parent)) return null
  const hit = fs.readdirSync(parent, { withFileTypes: true }).find((d) => d.isDirectory() && d.name.toLowerCase() === name.toLowerCase())
  return hit ? path.join(parent, hit.name) : null
}
const list = (dir) =>
  dir && fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => IMG.test(f)).sort(natural).map((f) => path.join(dir, f)) : []

const coverDir = dirOf(RAW, 'valaramthy furniture images')
const lifestyleDir = dirOf(RAW, 'mockup images') // loose banner / room photos
const searchPool = [...list(coverDir), ...list(lifestyleDir)]
const missing = []

// find one photo by words in its file name (exact name first, then "contains")
function find(keyword) {
  const k = keyword.toLowerCase()
  const hit = searchPool.find((f) => base(f) === k) || searchPool.find((f) => base(f).includes(k))
  if (!hit) missing.push(keyword)
  return hit
}

async function convert(src, rel, width = 1600) {
  const ext = sharp ? '.webp' : path.extname(src).toLowerCase()
  const dest = path.join(OUT, rel + ext)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  if (sharp) await sharp(src).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest)
  else fs.copyFileSync(src, dest)
  return '/images/' + rel.split(path.sep).join('/') + ext
}

// ---------- Categories ----------
const categories = [
  ['TV Wall Unit', 'tv-wall-unit', 'Wall-mounted TV units and stands with storage, designed to suit your living room.'],
  ['Table', 'table', 'Office desks, dressing tables, computer, study and console tables, made to your size.'],
  ['Modular Kitchen', 'modular-kitchen', 'Modular kitchens planned around your space, storage needs and cooking style.'],
  ['House Interior', 'house-interior', 'Complete wooden interior solutions for homes and offices, from design to finishing.'],
  ['Cot & Mattress', 'cot', 'King and queen size cots and mattresses, built strong and comfortable.'],
  ['Pooja Rack', 'pooja-rack', 'Pooja units in classic and contemporary designs for your home.'],
  ['Wardrobe', 'wardrobe', 'Two-door and three-door wardrobes in a range of finishes.'],
  ['Others', 'others', 'Finish options and other furniture made on request.'],
]
// categories that have no marketing photo yet
const fixedCategoryImage = {
  'modular-kitchen': 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
  others: '/images/product-07.jpeg',
}

// ---------- Products (edit names / descriptions here, then run the script again) ----------
const products = [
  { cat: 'tv-wall-unit', name: 'Modern Walnut & Cream TV Unit', slug: 'modern-walnut-cream-tv-unit', folder: 'tv unit', cover: 'modern walnut and cream tv unit', extras: ['cozy modern tv feature wall'], featured: true, material: 'Wood',
    desc: 'TV unit in a walnut and cream finish. Photos show the front, angled, side and back views. Size and finish can be matched to your wall.' },
  { cat: 'table', name: 'Walnut Office Desk with Lockable Drawers', slug: 'walnut-office-desk', folder: 'office desk', cover: 'modern walnut office desk', extras: ['modern walnut office workspace', 'cozy walnut home office', 'cozy modern home office'], featured: true, material: 'Wood',
    desc: 'Office desk with lockable drawers, smooth drawer slides, a cable management grommet and adjustable feet. Shown in walnut, oak and black colours.' },
  { cat: 'table', name: 'Dressing Table with LED Mirror', slug: 'dressing-table-led-mirror', folder: 'dressing table', featured: true, material: 'Wood',
    desc: 'Dressing table with an LED mirror, shelf, drawer and a matching stool. Detail photos show the top surface and leg design.' },
  { cat: 'cot', name: 'King Size Wooden Cot', slug: 'king-size-wooden-cot', folder: 'king size cot', cover: 'modern wooden king bed', featured: true, material: 'Wood',
    desc: 'King size wooden cot with a strong headboard and sturdy corners. Photos show front, angled, side and back views.' },
  { cat: 'cot', name: 'Queen Size Wooden Cot', slug: 'queen-size-wooden-cot', folder: 'queen size cot', cover: 'modern wooden queen bed', extras: ['queen size cot mockup'], featured: true, material: 'Wood',
    desc: 'Queen size wooden cot with headboard, bed slats and sturdy legs. Detail photos show the corner and top edge.' },
  { cat: 'cot', name: 'Quilted Mattress', slug: 'quilted-mattress', folder: 'mattress', cover: 'quilted charcoal mattress', extras: ['peaceful mattress bedroom retreat'], featured: false, material: 'Quilted fabric',
    desc: 'Quilted mattress with side handles. Photos show the fabric texture, corners, side panel and thickness.' },
  { cat: 'wardrobe', name: '2 Door Wardrobe', slug: '2-door-wardrobe', folder: '2door wardrobe', cover: 'modern two-tone wooden wardrobe', featured: true, material: 'Wood',
    desc: 'Two-door wardrobe in two models, each shown in walnut-white, grey-white and oak-white. Handle and lock details are included.' },
  { cat: 'wardrobe', name: '3 Door Wardrobe with Mirror', slug: '3-door-wardrobe-mirror', folder: '3door wardrobe', cover: 'modern walnut wardrobe with central mirror', extras: ['walnut three-door wardrobe bedroom showcase'], featured: true, material: 'Wood',
    desc: 'Three-door wardrobe with a central mirror. Photos show the open view, mirror, handle and lock, top edge and base.' },
  { cat: 'pooja-rack', name: 'Wall-Mounted Pooja Mandir', slug: 'wall-mounted-pooja-mandir', cover: 'wooden wall-mounted pooja mandir', extras: ['pooja rack 1'], featured: true, material: 'Wood',
    desc: 'Wooden wall-mounted pooja mandir with bells. Size and finish can be made to your wall.' },
  { cat: 'pooja-rack', name: 'Pooja Rack Design 2', slug: 'pooja-rack-design-2', cover: 'pooja rack 2', featured: false, material: 'Wood',
    desc: 'Wooden pooja rack for your home. Ask us for sizes and finishes.' },
  { cat: 'house-interior', name: 'House Interior Showcase', slug: 'house-interior-showcase', cover: 'warm modern home interior collage', featured: true, material: 'Wood',
    desc: 'Warm, modern interiors for living rooms, bedrooms, kitchens and offices, designed and built to measure.' },
    { cat: 'house-interior', name: 'Living Room TV Feature Wall', slug: 'living-room-tv-feature-wall', cover: 'cozy modern tv feature wall', featured: true, material: 'Wood',    desc: 'TV feature wall with wooden panelling and storage, designed and built by our own team to suit your living room.' },
  { cat: 'house-interior', name: 'Bedroom Interior', slug: 'bedroom-interior', cover: 'walnut three-door wardrobe bedroom showcase', extras: ['peaceful mattress bedroom retreat'], featured: true, material: 'Wood',    desc: 'Bedroom interiors with built-to-measure wardrobes, cots and finishes, planned around your room.' },
  { cat: 'house-interior', name: 'Home Office Interior', slug: 'home-office-interior', cover: 'cozy modern home office', extras: ['cozy walnut home office', 'modern walnut office workspace'], featured: true, material: 'Wood',    desc: 'Home and office workspaces with desks, storage and finishes made to fit your space.' },
]

// ---------- Convert photos ----------
const rows = []
const firstImage = {}
for (const p of products) {
  const sources = []
  const add = (f) => f && !sources.includes(f) && sources.push(f)
  if (p.cover) add(find(p.cover))
  for (const e of p.extras ?? []) add(find(e))
  const folder = p.folder && dirOf(RAW, p.folder)
  if (p.folder && !folder) missing.push('folder: ' + p.folder)
  list(folder).forEach(add)

  const chosen = sources.slice(0, MAX_PER_PRODUCT)
  const urls = []
  for (let i = 0; i < chosen.length; i++) {
    urls.push(await convert(chosen[i], path.join('products', p.slug, String(i + 1).padStart(2, '0'))))
  }
  console.log(`${p.name}: ${urls.length} photos`)
  if (urls.length === 0) continue
  firstImage[p.cat] ??= urls[0]
  rows.push({ ...p, urls })
}

// ---------- Hero slider ----------
const heroKeys = ['website banner 2', 'cozy modern tv feature wall', 'walnut three-door wardrobe bedroom showcase', 'cozy modern home office']
for (let i = 0; i < heroKeys.length; i++) {
  const f = find(heroKeys[i])
  if (f) console.log('Hero', i + 1, await convert(f, path.join('hero', `hero-${i + 1}`), 2000))
}

// ---------- Write db/seed.sql ----------
const q = (s) => "'" + String(s).replaceAll("'", "''") + "'"
let sql = '-- GENERATED by scripts/import-images.mjs. Edit the script, not this file.\n'
sql += 'INSERT INTO categories (name, slug, description, image, sort_order) VALUES\n'
sql += categories
  .map(([name, slug, desc], i) => `(${q(name)}, ${q(slug)}, ${q(desc)}, ${q(fixedCategoryImage[slug] ?? firstImage[slug] ?? '')}, ${i + 1})`)
  .join(',\n') + ';\n\n'
sql += 'INSERT INTO products (category_id, name, slug, description, material, images, featured)\nSELECT c.id, p.name, p.slug, p.description, p.material, p.images, p.featured\nFROM (VALUES\n'
sql += rows
  .map((p) => ` (${q(p.cat)}, ${q(p.name)}, ${q(p.slug)}, ${q(p.desc)}, ${q(p.material)}, ARRAY[${p.urls.map(q).join(', ')}], ${p.featured ? 'true' : 'false'})`)
  .join(',\n')
sql += '\n) AS p(cat, name, slug, description, material, images, featured)\nJOIN categories c ON c.slug = p.cat;\n'
fs.writeFileSync(path.resolve('db/seed.sql'), sql)

console.log('\nWrote db/seed.sql with', rows.length, 'products.')
if (missing.length) {
  console.log('\nNOT FOUND (check the file / folder name):')
  missing.forEach((m) => console.log(' -', m))
}
console.log('\nNext: node --env-file=.env.local db/setup.mjs')
