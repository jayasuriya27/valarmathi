
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { loginAction } from './actions'
import { verifyAdminSession } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Login',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLogin({ searchParams }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value

  // Already logged in? Go directly to enquiries.
  if (verifyAdminSession(session)) {
    redirect('/admin/enquiries')
  }

  const params = await searchParams
  const hasError = params?.error === '1'
  const isLocked = params?.error === 'locked'

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-lightgray/60 bg-white p-8 shadow-sm">

        <div className="mb-6 text-center">
          <p className="mb-4 inline-block rounded-full bg-amber-50 px-4 py-2 text-xs font-bold tracking-wider text-amber-800">
            FOR ADMIN USE ONLY
          </p>

          <h1 className="font-display text-3xl text-ink">
            Admin Enquiry
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Enter your admin password to continue.
          </p>
        </div>

        <form action={loginAction} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Admin Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={200}
              placeholder="Enter admin password"
              className="w-full rounded-lg border border-lightgray px-4 py-3 outline-none focus:border-ink"
            />
          </div>

          {isLocked && (
            <p role="alert" className="text-sm font-medium text-red-600">
              Too many wrong attempts. Please try again after 10 minutes.
            </p>
          )}

          {hasError && (
            <p role="alert" className="text-sm font-medium text-red-600">
              This page is for admin use only.
              Please enter the correct password.
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-ink px-4 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-gray-400">
          Authorized administrators only.
        </p>
      </div>
    </main>
  )
}
