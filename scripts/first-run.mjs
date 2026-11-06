// One-time setup for a new computer. Run by start-windows.bat
//  1. asks for the PostgreSQL password
//  2. creates the "valarmathi" database
//  3. creates tables + products
import fs from 'node:fs'
import crypto from 'node:crypto'
import readline from 'node:readline/promises'
import { execFileSync } from 'node:child_process'
import pg from 'pg'

const envPath = '.env.local'
let url = null
let askedPassword = false

if (fs.existsSync(envPath)) {
  const m = fs.readFileSync(envPath, 'utf8').match(/^DATABASE_URL=(.+)$/m)
  if (m) url = m[1].trim()
}

if (!url) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  const password = (await rl.question('\nEnter your PostgreSQL password (the one you set while installing PostgreSQL): ')).trim()
  rl.close()
  url = `postgresql://postgres:${encodeURIComponent(password)}@localhost:5432/valarmathi`
  askedPassword = true
}

const target = new URL(url)
const dbName = decodeURIComponent(target.pathname.slice(1))
const adminUrl = new URL(url)
adminUrl.pathname = '/postgres'

const admin = new pg.Client({ connectionString: adminUrl.toString() })
try {
  await admin.connect()
} catch (err) {
  console.error('\nCould not connect to PostgreSQL: ' + err.message)
  console.error('Check: 1) PostgreSQL is installed and running  2) the password is correct')
  if (!askedPassword) console.error('3) Delete the file .env.local and run this again to type the password again')
  process.exit(1)
}

const exists = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName])
if (exists.rowCount === 0) {
  await admin.query(`CREATE DATABASE "${dbName.replace(/"/g, '')}"`)
  console.log(`Database "${dbName}" created.`)
} else {
  console.log(`Database "${dbName}" already exists.`)
}
await admin.end()

if (askedPassword) {
  fs.writeFileSync(envPath, `DATABASE_URL=${url}\nDATABASE_SSL=false\nADMIN_KEY=${crypto.randomBytes(6).toString('hex')}\n`)
  console.log('.env.local created.')
}

execFileSync(process.execPath, ['--env-file=.env.local', 'db/setup.mjs'], { stdio: 'inherit' })
console.log('\nSetup finished.\n')
