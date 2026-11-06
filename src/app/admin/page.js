import { redirect } from 'next/navigation'

// /admin -> login page (it sends you on to the enquiries if you are already logged in)
export default function AdminIndex() {
  redirect('/admin/login')
}
