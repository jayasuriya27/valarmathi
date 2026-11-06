// Usage (from the project folder):
//   node scripts/import-products.mjs "C:\Users\Admin\Downloads\VALARMATHY_WEBSITE_IMAGES"
//
// What it does:
//  1. Reads each product folder (POOJA RACK 1, KING SIZE 2 ...) from the images folder
//  2. Compresses every photo to WebP into public/images/products/<slug>/01.webp, 02.webp ...
//     (01 = front view, it is the cover photo on the website)
//  3. Writes db/seed-products.sql (adds the products, or fills photos into products that already exist)
// Then run:  node --env-file=.env.local db/setup.mjs
//
// To add a new product later: copy the images into a folder, add ONE line in the `products` list below, run again.
import fs from 'node:fs'
import path from 'node:path'

const RAW = process.argv[2]
if (!RAW || !fs.existsSync(RAW)) {
  console.error('Give the path of the images folder, for example:')
  console.error('  node scripts/import-products.mjs "C:\\Users\\Admin\\Downloads\\VALARMATHY_WEBSITE_IMAGES"')
  process.exit(1)
}

let sharp = null
try {
  sharp = (await import('sharp')).default
} catch {
  console.warn('WARNING: "sharp" is not installed, photos will be copied without compressing. Run: npm install sharp\n')
}

const OUT = path.resolve('public/images')
const MAX_PER_PRODUCT = 16
const IMG = /\.(png|jpe?g|webp)$/i
const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })

// ---------- Products ----------
// folder   = folder name inside the images folder
// cat      = category slug (pooja-rack, table, cot, wardrobe, dressing-table ...)
// slug     = product web address. If the slug ALREADY exists in the database (like computer-desk),
//            the photos are filled into that product. If it is new, a new product is added.
const products = [
  // ----- Pooja Rack -----
  { folder: 'POOJA RACK 1', cat: 'pooja-rack', name: 'Pooja Rack with Ganesh Carving', slug: 'pooja-rack-ganesh-carving', material: 'Wood',
    desc: 'Pooja rack with a Ganesh carving on the doors, hanging bells on top, a drawer and cabinet storage below. Photos show the front, angled and open views with the light, bell, drawer and handle details.' },
  { folder: 'POOJA RACK 2', cat: 'pooja-rack', name: 'Pooja Rack with Arch Design', slug: 'pooja-rack-arch-design', material: 'Wood',
    desc: 'Pooja rack with a carved arch top, a Ganesh panel inside and a cabinet below for pooja items. Photos show the front, angled and open views with the design and handle details.' },

  // ----- Table -----
  { folder: 'COM DESK 1', cat: 'table', name: 'Computer Desk', slug: 'computer-desk', material: 'Wood',
    desc: 'Computer desk with a pull-out keyboard tray, open shelves and caster wheels, so it is easy to move. Photos show the front, angled and back views with the keyboard slide, wheels and shelf details.' },
  { folder: 'COM DESK 2', cat: 'table', name: 'Computer Desk with Drawer', slug: 'computer-desk-with-drawer', material: 'Wood',
    desc: 'Computer desk with a keyboard tray, a lockable drawer and caster wheels. Photos show the front, angled and back views with the drawer, tray and wheel details.' },
  { folder: 'COFFEE TABLE 2', cat: 'table', name: 'Tea Table', slug: 'tea-table', material: 'Wood',
    desc: 'Coffee / tea table with an open shelf below for books and baskets. Shown in walnut-beige, teak and grey-white colours, with a few model variations. Photos show the edge, wood texture and anti-slip legs.' },
  { folder: 'OFFICE TABLE 1', cat: 'table', name: 'Office Table with Side Cabinet', slug: 'office-table-side-cabinet', material: 'Wood',
    desc: 'Office table with a side cabinet, drawer and lock. Photos show the front, angled and open storage views with the table top, drawer slide, hinge and lock details.' },
  { folder: 'OFFICE TABLE 2', cat: 'table', name: 'Office Table with Drawers', slug: 'office-table-drawers', material: 'Wood',
    desc: 'Office table with drawers on both sides, a cabinet and handles with lock. Photos show the front and angled views with the drawer and handle details.' },

  // ----- Dressing Table -----
  { folder: 'DRESSING TABLE 1', cat: 'dressing-table', name: 'Dressing Table with Mirror', slug: 'dressing-table-with-mirror', material: 'Wood',
    desc: 'Dressing table with a tall mirror, a glass-design door, an LED light on top and storage below. Photos show the front, angled and open views with the light, glass design, drawer and lock details.' },
  { folder: 'DRESSING TABLE 2', cat: 'dressing-table', name: 'Dressing Table with Shelves and Drawers', slug: 'dressing-table-shelves-drawers', material: 'Wood',
    desc: 'Dressing table with a mirror, open shelves at the side and drawers with cabinet storage below. Photos show the front and angled views with the shelf and drawer details.' },

  // ----- Cot & Mattress -----
  { folder: 'KING SIZE', cat: 'cot', name: 'King Size Cot with Headboard Storage', slug: 'king-size-cot-headboard-storage', material: 'Wood',
    desc: 'King size cot with shelf space and drawers in the headboard and a strong side panel. Photos show the front, angled, side and open drawer views with the corner, handle and finish details.' },
  { folder: 'KING SIZE 2', cat: 'cot', name: 'Hydraulic Storage Cot', slug: 'hydraulic-storage-cot', material: 'Wood',
    desc: 'King size cot in grey and white with hydraulic lift storage under the bed, plus a headboard shelf and drawers. Photos show the open hydraulic view, storage partition, drawers and edge finish.' },
  { folder: 'MATTRESS 1', cat: 'cot', name: 'Charcoal Pillow-Top Mattress', slug: 'charcoal-pillow-top-mattress', material: 'Quilted fabric',
    desc: 'Pillow-top mattress in charcoal. Photos show the front, top, side, back and bottom views with the fabric, stitching and corner details.' },
  { folder: 'MATTRESS 2', cat: 'cot', name: 'Cream & Brown Quilted Mattress', slug: 'cream-brown-quilted-mattress', material: 'Quilted fabric',
    desc: 'Quilted mattress in cream and brown with side handles. Photos show the front, top, side, back and bottom views with the quilting, piping and internal layers.' },

  // ----- Wardrobe -----
  { folder: 'TWO DOOR WARD', cat: 'wardrobe', name: '2 Door Wardrobe with Mirror', slug: '2-door-wardrobe-mirror', material: 'Wood',
    desc: 'Two-door wardrobe with a mirror, a drawer and a top cabinet. Photos show the front, angled and open views with the handle, lock, mirror and shelf details.' },
  { folder: 'TWO DOOR WARDROBE 2', cat: 'wardrobe', name: '2 Door Wardrobe in Cream & Brown', slug: '2-door-wardrobe-cream-brown', material: 'Wood',
    desc: 'Two-door wardrobe in a cream and brown finish with a textured door design. Photos show the front, angled and open inside views.' },
  { folder: 'THREE DOOR 1', cat: 'wardrobe', name: '3 Door Wardrobe', slug: '3-door-wardrobe', material: 'Wood',
    desc: 'Three-door wardrobe with a lock and plenty of hanging and shelf space. Photos show the front, angled and open views with the handle, lock, hinge, shelf and top moulding details.' },
  { folder: 'THREE DOOR 2', cat: 'wardrobe', name: '3 Door Wardrobe with Mirror and Carved Panels', slug: '3-door-wardrobe-carved-mirror', material: 'Wood',
    desc: 'Three-door wardrobe with a central mirror, carved side panels and drawers. Photos show the front, angled and open views with the mirror, handle and lock details.' },
]

// ---------- helpers ----------
function dirOf(name) {
  const hit = fs.readdirSync(RAW, { withFileTypes: true }).find((d) => d.isDirectory() && d.name.toLowerCase() === name.toLowerCase())
  return hit ? path.join(RAW, hit.name) : null
}
async function convert(src, slug, n) {
  const ext = sharp ? '.webp' : path.extname(src).toLowerCase()
  const rel = path.join('products', slug, String(n).padStart(2, '0'))
  const dest = path.join(OUT, rel + ext)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  if (sharp) await sharp(src).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest)
  else fs.copyFileSync(src, dest)
  return '/images/' + rel.split(path.sep).join('/') + ext
}

// ---------- convert photos ----------
const rows = []
const missing = []
for (const p of products) {
  const dir = dirOf(p.folder)
  if (!dir) { missing.push(p.folder); continue }
  const files = fs.readdirSync(dir).filter((f) => IMG.test(f)).sort(natural).slice(0, MAX_PER_PRODUCT)
  const urls = []
  for (let i = 0; i < files.length; i++) urls.push(await convert(path.join(dir, files[i]), p.slug, i + 1))
  console.log(`${p.name}: ${urls.length} photos`)
  if (urls.length) rows.push({ ...p, urls })
}

// ---------- write db/seed-products.sql ----------
const q = (s) => "'" + String(s).replaceAll("'", "''") + "'"
let sql = '-- GENERATED by scripts/import-products.mjs. Edit the script, not this file.\n'
sql += '-- Adds new products, or fills photos into products that already exist (same slug).\n'
sql += 'INSERT INTO products (category_id, name, slug, description, material, images, featured)\n'
sql += 'SELECT c.id, p.name, p.slug, p.description, p.material, p.images, false\nFROM (VALUES\n'
sql += rows
  .map((p) => ` (${q(p.cat)}, ${q(p.name)}, ${q(p.slug)}, ${q(p.desc)}, ${q(p.material)}, ARRAY[${p.urls.map(q).join(', ')}])`)
  .join(',\n')
sql += '\n) AS p(cat, name, slug, description, material, images)\nJOIN categories c ON c.slug = p.cat\n'
sql += 'ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description,\n'
sql += '  material = EXCLUDED.material, images = EXCLUDED.images, category_id = EXCLUDED.category_id;\n'
fs.writeFileSync(path.resolve('db/seed-products.sql'), sql)

console.log('\nWrote db/seed-products.sql with', rows.length, 'products.')
if (missing.length) {
  console.log('\nFOLDER NOT FOUND (check the folder name):')
  missing.forEach((m) => console.log(' -', m))
}
console.log('\nNext: node --env-file=.env.local db/setup.mjs')
