// Run with: node --env-file=.env.local db/setup.mjs
import pg from 'pg'
import fs from 'node:fs'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL missing. Create .env.local first.')
  process.exit(1)
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

await client.connect()
for (const file of ['schema.sql', 'seed.sql', 'seed-products.sql']) {
  const url = new URL(file, import.meta.url)
  if (!fs.existsSync(url)) continue
  await client.query(fs.readFileSync(url, 'utf8'))
  console.log('Done:', file)
}
const { rows } = await client.query(
  'SELECT (SELECT count(*) FROM categories) AS categories, (SELECT count(*) FROM products) AS products'
)
console.log('Categories:', rows[0].categories, '| Products:', rows[0].products)
await client.end()