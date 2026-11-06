import { createHmac, timingSafeEqual } from 'node:crypto'

const SESSION_DURATION = 8 * 60 * 60 * 1000

function sign(value, secret) {
  return createHmac('sha256', secret)
    .update(value)
    .digest('hex')
}

export function createAdminSession() {
  const secret = process.env.ADMIN_KEY

  if (!secret) {
    throw new Error('ADMIN_KEY is not configured')
  }

  const expiresAt = Date.now() + SESSION_DURATION
  const payload = String(expiresAt)
  const signature = sign(payload, secret)

  return `${payload}.${signature}`
}

export function verifyAdminSession(token) {
  const secret = process.env.ADMIN_KEY

  if (!secret || typeof token !== 'string') {
    return false
  }

  const parts = token.split('.')

  if (parts.length !== 2) {
    return false
  }

  const [payload, signature] = parts
  const expiresAt = Number(payload)

  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= Date.now() ||
    !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return false
  }

  const expected = sign(payload, secret)

  return timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  )
}