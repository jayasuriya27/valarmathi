'use server'

import { createHash, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminSession } from '@/lib/admin-auth'

// Wrong-password limit: 5 wrong tries per 10 minutes per IP
const fails = new Map()
const WINDOW = 10 * 60 * 1000
const MAX_FAILS = 5

const recentFails = (ip) => (fails.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW)

// Compare without leaking timing information (both sides hashed to the same length first)
function samePassword(a, b) {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export async function loginAction(formData) {
  const h = await headers()
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'local'

  if (recentFails(ip).length >= MAX_FAILS) {
    redirect('/admin/login?error=locked')
  }

  const password = formData.get('password')
  const adminKey = process.env.ADMIN_KEY

  if (typeof password !== 'string' || !password || password.length > 200 || !adminKey || !samePassword(password, adminKey)) {
    fails.set(ip, [...recentFails(ip), Date.now()])
    redirect('/admin/login?error=1')
  }

  fails.delete(ip)

  const cookieStore = await cookies()
  const session = createAdminSession()

  cookieStore.set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 60 * 60 * 8,
  })

  redirect('/admin/enquiries')
}
