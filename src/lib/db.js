import { Pool } from 'pg'

const g = globalThis

export const pool =
  g.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  })

// Keep one pool during development hot reloads
if (process.env.NODE_ENV !== 'production') g.__pgPool = pool
