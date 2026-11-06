'use client'
import { useState } from 'react'
import { CheckCircle2, Send } from 'lucide-react'
import { cleanPhone, validateEnquiry, ENQUIRY_TYPES } from '@/lib/validation'
import FileAttach from '@/components/FileAttach'
import ConsentCheck from '@/components/ConsentCheck'

export default function EnquiryForm({ productName = '', defaultType = 'General', id }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', enquiry_type: defaultType,
    product_name: productName, message: '', website: '',
    consent: false, // "I agree" tick box
    room_length: '', room_width: '', // space size in feet (optional) // "website" is a hidden spam trap
  })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('') // message for problems that are not about one field (server / network)
  const [files, setFiles] = useState([]) // attached files (File objects)
  const [errors, setErrors] = useState({}) // { phone: 'message' } shown under each field

  // Check one field when the person leaves it (so the message comes early, not only at submit)
  const checkField = (name, values = form) => {
    const { errors: all } = validateEnquiry(values)
    setErrors((prev) => ({ ...prev, [name]: all[name] }))
  }

  const onChange = (e) => {
    const { name, type, checked } = e.target
    let value = type === 'checkbox' ? checked : e.target.value
    if (name === 'phone') value = cleanPhone(value) // digits only, +91 / 0 at the start removed
    const next = { ...form, [name]: value }
    setForm(next)
    if (errors[name]) checkField(name, next) // clear the red message as soon as it is fixed
  }
  const onBlur = (e) => checkField(e.target.name)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const { values, errors: found } = validateEnquiry(form)
    if (Object.keys(found).length) {
      setErrors(found)
      setStatus('idle')
      e.currentTarget.elements[Object.keys(found)[0]]?.focus() // jump to the first wrong field
      return
    }
    setErrors({})
    setStatus('loading')
    try {
      // FormData (not JSON) because files are sent too
      const body = new FormData()
      for (const [k, v] of Object.entries(values)) if (v) body.append(k, v)
      body.append('website', form.website)
      files.forEach((f) => body.append('files', f))
      const res = await fetch('/api/enquiries', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (data.errors) { setErrors(data.errors); setStatus('idle'); return }
        if (data.field === 'files') { setErrors({ files: data.error }); setStatus('idle'); return }
        throw new Error(data.error || 'Could not send your enquiry.')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message + ' You can also call us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div id={id} className="rounded-2xl border border-lime bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-cerulean" size={44} />
        <h3 className="mt-3 font-display text-2xl">Enquiry sent</h3>
        <p className="mt-2 text-charcoal">Thank you, {form.name}. We will call you on {form.phone} soon.{files.length > 0 && ` We received your ${files.length} attached file${files.length > 1 ? 's' : ''}.`}</p>
      </div>
    )
  }

  const base = 'w-full rounded-lg border bg-white px-4 py-3 outline-cerulean transition focus:border-cerulean'
  // red border when this field has an error
  const field = (n) => `${base} ${errors[n] ? 'border-red-500' : 'border-lightgray'}`
  const aria = (n) => ({ 'aria-invalid': errors[n] ? true : undefined, 'aria-describedby': errors[n] ? `err-${n}` : undefined })
  const err = (n) => (errors[n] ? <p id={`err-${n}`} role="alert" className="mt-1 text-sm text-red-600">{errors[n]}</p> : null)
  const hint = (n, t) => (errors[n] ? null : <p className="mt-1 text-xs text-charcoal">Example: {t}</p>)

  return (
    <form id={id} onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-lightgray/60 bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input name="name" placeholder="Your name" required maxLength={100} autoComplete="name" value={form.name} onChange={onChange} onBlur={onBlur} className={field('name')} {...aria('name')} />
          {err('name')}
          {hint('name', 'Ramesh Kumar')}
        </div>
        <div>
          <input name="phone" type="tel" placeholder="Mobile number (10 digits)" required inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={onChange} onBlur={onBlur} className={field('phone')} {...aria('phone')} />
          {err('phone')}
          {hint('phone', '9876543210')}
        </div>
      </div>
      <div>
        <input name="email" type="email" placeholder="Email (optional)" maxLength={100} autoComplete="email" value={form.email} onChange={onChange} onBlur={onBlur} className={field('email')} {...aria('email')} />
        {err('email')}
        {hint('email', 'name@gmail.com')}
      </div>
      <div>
        <select name="enquiry_type" value={form.enquiry_type} onChange={onChange} className={field('enquiry_type')} {...aria('enquiry_type')}>
          {ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        {err('enquiry_type')}
      </div>
      {productName && <input name="product_name" value={form.product_name} readOnly className={`${base} border-lightgray bg-smoke`} />}
      {/* Space size (optional) */}
      <div>
        <p className="text-sm font-medium text-ink">Space size <span className="font-normal text-charcoal">(in feet, optional)</span></p>
        <p className="mb-2 text-xs text-charcoal">Example: Length 12, Width 10</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input name="room_length" type="number" inputMode="decimal" step="0.1" min="1" max="100" placeholder="Length" value={form.room_length} onChange={onChange} onBlur={onBlur} className={field('room_length')} {...aria('room_length')} />
            {err('room_length')}
          </div>
          <div>
            <input name="room_width" type="number" inputMode="decimal" step="0.1" min="1" max="100" placeholder="Width" value={form.room_width} onChange={onChange} onBlur={onBlur} className={field('room_width')} {...aria('room_width')} />
            {err('room_width')}
          </div>
        </div>
      </div>

      <div>
        <textarea name="message" rows={4} maxLength={1500} placeholder="Tell us what you need: room, size, material, finish…" value={form.message} onChange={onChange} className={field('message')} />
        {hint('message', 'I need a 3-door wardrobe for my bedroom, 7 feet high, in walnut finish.')}
      </div>

      <FileAttach files={files} setFiles={setFiles} error={errors.files} setError={(m) => setErrors((p) => ({ ...p, files: m || undefined }))} />

      {/* Spam trap: real people never see or fill this */}
      <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} className="hidden" aria-hidden="true" />

      <ConsentCheck id="consent" checked={form.consent} onChange={onChange} error={errors.consent} withFiles={files.length > 0} what="enquiry" />

      <button disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60">
        <Send size={18} /> {status === 'loading' ? 'Sending…' : 'Send enquiry'}
      </button>
      {status === 'error' && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </form>
  )
}
