'use client'
import { useRef, useState } from 'react'
import { CheckCircle2, Paperclip, Send, X, Check } from 'lucide-react'
import SmartImage from '@/components/SmartImage'
import ConsentCheck from '@/components/ConsentCheck'
import { cleanPhone } from '@/lib/validation'
import { FINISH_DETAILS } from '@/lib/finishes'
import { waLink } from '@/lib/site'
import {
  FURNITURE_TYPES, ROOM_TYPES, BUDGETS, NEEDED_BY, FILE_ACCEPT,
  MAX_FILES, MAX_FINISHES, validateCustomDesign, checkFile,
} from '@/lib/custom-design'
import { MAX_TOTAL_MB, checkTotal } from '@/lib/upload-rules'

const EMPTY = {
  name: '', phone: '', email: '', furniture_type: '', room_type: '',
  room_length: '', room_width: '', room_height: '', site_visit: false,
  finishes: [], finish_help: false, budget: '', needed_by: '', location: '', message: '', consent: false, website: '',
}
const sizeText = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB')

export default function CustomDesignForm() {
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [error, setError] = useState('')
  const [requestNo, setRequestNo] = useState('')
  const fileInput = useRef(null)

  const setErr = (k, msg) => setErrors((p) => ({ ...p, [k]: msg }))
  const recheck = (k, next) => setErr(k, validateCustomDesign(next).errors[k])

  const onChange = (e) => {
    const { name, type, checked } = e.target
    let value = type === 'checkbox' ? checked : e.target.value
    if (name === 'phone') value = cleanPhone(value)
    const next = { ...form, [name]: value }
    setForm(next)
    if (errors[name]) recheck(name, next)
    if (name === 'site_visit') setErrors((p) => ({ ...p, room_length: undefined, room_width: undefined }))
  }
  const onBlur = (e) => recheck(e.target.name, form)

  const toggleFinish = (slug) => {
    const has = form.finishes.includes(slug)
    if (!has && form.finishes.length >= MAX_FINISHES) return setErr('finishes', `You can choose up to ${MAX_FINISHES} finishes.`)
    setErr('finishes', undefined)
    setForm({ ...form, finishes: has ? form.finishes.filter((f) => f !== slug) : [...form.finishes, slug] })
  }

  const addFiles = (e) => {
    const picked = [...e.target.files]
    e.target.value = '' // so the same file can be chosen again later
    let list = [...files]
    let problem = ''
    for (const f of picked) {
      if (list.some((x) => x.name === f.name && x.size === f.size)) continue
      if (list.length >= MAX_FILES) { problem = `You can attach up to ${MAX_FILES} files.`; break }
      const bad = checkFile(f)
      if (bad) { problem = bad; continue }
      // All files together must stay under the total limit (hosting accepts only small requests)
      const tooBig = checkTotal([...list, f])
      if (tooBig) { problem = tooBig; continue }
      list.push(f)
    }
    setFiles(list)
    setErr('files', problem || undefined)
  }
  const removeFile = (i) => { setFiles(files.filter((_, n) => n !== i)); setErr('files', undefined) }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const { values, errors: found } = validateCustomDesign(form)
    if (Object.keys(found).length) {
      setErrors(found)
      document.getElementById('cd-' + Object.keys(found)[0])?.focus()
      return
    }
    setErrors({})
    setStatus('loading')

    const body = new FormData()
    for (const [k, v] of Object.entries(values)) {
      if (k === 'finishes') v.forEach((f) => body.append('finishes', f))
      else if (v !== null && v !== '') body.append(k, String(v))
    }
    body.append('website', form.website)
    files.forEach((f) => body.append('files', f))

    try {
      const res = await fetch('/api/custom-designs', { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (data.errors) setErrors(data.errors)
        else if (data.field) setErrors({ [data.field]: data.error })
        else throw new Error(data.error || 'Could not send your request.')
        setStatus('idle')
        return
      }
      setRequestNo(data.requestNo || '')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err.message + ' You can also call us directly.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-lime bg-white p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto text-cerulean" size={44} />
        <h3 className="mt-3 font-display text-2xl">Request received</h3>
        {requestNo && <p className="mt-2 text-lg font-semibold text-ink">Request No: {requestNo}</p>}
        <p className="mt-2 text-charcoal">Thank you, {form.name}. Our team will call you on {form.phone} soon.</p>
        <a href={waLink(`Hi, I sent a custom design request${requestNo ? ' ' + requestNo : ''}.`)} target="_blank" rel="noopener noreferrer"
           className="mt-5 inline-block rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black">
          Message us on WhatsApp
        </a>
      </div>
    )
  }

  const base = 'w-full rounded-lg border bg-white px-4 py-3 outline-cerulean transition focus:border-cerulean'
  const field = (n) => `${base} ${errors[n] ? 'border-red-500' : 'border-lightgray'}`
  const aria = (n) => ({ id: 'cd-' + n, name: n, 'aria-invalid': errors[n] ? true : undefined, 'aria-describedby': errors[n] ? `err-${n}` : undefined })
  const err = (n) => (errors[n] ? <p id={`err-${n}`} role="alert" className="mt-1 text-sm text-red-600">{errors[n]}</p> : null)
  const hint = (n, t) => (errors[n] ? null : <p className="mt-1 text-xs text-charcoal">Example: {t}</p>)
  const label = 'mb-1 block text-sm font-semibold text-ink'
  const h = 'font-display text-xl text-ink'

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8 rounded-2xl border border-lightgray/60 bg-white p-6 shadow-sm">
      {/* 1. Contact */}
      <div className="space-y-4">
        <h3 className={h}>1. Your details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input {...aria('name')} placeholder="Your name" maxLength={100} autoComplete="name" value={form.name} onChange={onChange} onBlur={onBlur} className={field('name')} />
            {err('name')}
            {hint('name', 'Ramesh Kumar')}
          </div>
          <div>
            <input {...aria('phone')} type="tel" placeholder="Mobile number (10 digits)" inputMode="numeric" autoComplete="tel-national" value={form.phone} onChange={onChange} onBlur={onBlur} className={field('phone')} />
            {err('phone')}
            {hint('phone', '9876543210')}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <input {...aria('email')} type="email" placeholder="Email (optional)" maxLength={100} autoComplete="email" value={form.email} onChange={onChange} onBlur={onBlur} className={field('email')} />
            {err('email')}
            {hint('email', 'name@gmail.com')}
          </div>
          <div>
            <input {...aria('location')} placeholder="Your area / pincode (optional)" maxLength={150} value={form.location} onChange={onChange} className={field('location')} />
            <p className="mt-1 text-xs text-charcoal">Example: Ammapet, Salem – 636003</p>
          </div>
        </div>
      </div>

      {/* 2. What */}
      <div className="space-y-4">
        <h3 className={h}>2. What do you need?</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cd-furniture_type" className={label}>Furniture</label>
            <select {...aria('furniture_type')} value={form.furniture_type} onChange={onChange} className={field('furniture_type')}>
              <option value="">Choose…</option>
              {FURNITURE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
            {err('furniture_type')}
          </div>
          <div>
            <label htmlFor="cd-room_type" className={label}>Room (optional)</label>
            <select {...aria('room_type')} value={form.room_type} onChange={onChange} className={field('room_type')}>
              <option value="">Choose…</option>
              {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Room size */}
      <div className="space-y-3">
        <h3 className={h}>3. Room / space size <span className="text-sm font-normal text-charcoal">(in feet)</span></h3>
        <p className="-mt-1 text-xs text-charcoal">Example: Length 12, Width 10, Height 9</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <input {...aria('room_length')} type="number" inputMode="decimal" step="0.1" min="1" max="100" placeholder="Length" value={form.room_length} onChange={onChange} onBlur={onBlur} className={field('room_length')} />
            {err('room_length')}
          </div>
          <div>
            <input {...aria('room_width')} type="number" inputMode="decimal" step="0.1" min="1" max="100" placeholder="Width" value={form.room_width} onChange={onChange} onBlur={onBlur} className={field('room_width')} />
            {err('room_width')}
          </div>
          <div>
            <input {...aria('room_height')} type="number" inputMode="decimal" step="0.1" min="5" max="30" placeholder="Height (optional)" value={form.room_height} onChange={onChange} onBlur={onBlur} className={field('room_height')} />
            {err('room_height')}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="site_visit" checked={form.site_visit} onChange={onChange} className="h-4 w-4 accent-cerulean" />
          I don’t know the size. Please arrange a site visit.
        </label>
      </div>

      {/* 4. Finish */}
      <div className="space-y-3">
        <h3 className={h}>4. Finish / colour <span className="text-sm font-normal text-charcoal">(choose up to {MAX_FINISHES})</span></h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {Object.entries(FINISH_DETAILS).map(([slug, f]) => {
            const on = form.finishes.includes(slug)
            return (
              <button type="button" key={slug} onClick={() => toggleFinish(slug)} aria-pressed={on}
                className={`relative overflow-hidden rounded-lg border-2 text-left transition ${on ? 'border-cerulean' : 'border-lightgray/70 hover:border-cerulean/50'}`}>
                <SmartImage src={f.image} alt={f.name} fit="cover" className="h-16 w-full sm:h-20" />
                <span className="block truncate px-1.5 py-1 text-[11px] font-medium text-ink">{f.name}</span>
                {on && <span className="absolute right-1 top-1 rounded-full bg-cerulean p-0.5 text-white"><Check size={12} /></span>}
              </button>
            )
          })}
        </div>
        {err('finishes')}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="finish_help" checked={form.finish_help} onChange={onChange} className="h-4 w-4 accent-cerulean" />
          Not sure. Please suggest a finish.
        </label>
      </div>

      {/* 5. Budget & time */}
      <div className="space-y-4">
        <h3 className={h}>5. Budget and time <span className="text-sm font-normal text-charcoal">(optional)</span></h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <select {...aria('budget')} value={form.budget} onChange={onChange} className={field('budget')}>
            <option value="">Budget…</option>
            {BUDGETS.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select {...aria('needed_by')} value={form.needed_by} onChange={onChange} className={field('needed_by')}>
            <option value="">When do you need it?</option>
            {NEEDED_BY.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* 6. Attachments + message */}
      <div className="space-y-4">
        <h3 className={h}>6. Reference photos and details</h3>
        <div>
          <button type="button" onClick={() => fileInput.current?.click()} id="cd-files"
            className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-sm transition hover:border-cerulean ${errors.files ? 'border-red-500' : 'border-lightgray'}`}>
            <Paperclip size={18} /> Attach photos, screenshots, PDF or ZIP
          </button>
          <input ref={fileInput} type="file" multiple accept={FILE_ACCEPT} onChange={addFiles} className="hidden" />
          <p className="mt-1 text-xs text-charcoal">Up to {MAX_FILES} files, {MAX_TOTAL_MB} MB in total. Photo, PDF, Word, ZIP, DWG, SKP.</p>
          {err('files')}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f, i) => (
                <li key={f.name + f.size} className="flex items-center justify-between gap-3 rounded-lg bg-smoke px-3 py-2 text-sm">
                  <span className="min-w-0 truncate">{f.name} <span className="text-charcoal">({sizeText(f.size)})</span></span>
                  <button type="button" onClick={() => removeFile(i)} aria-label={`Remove ${f.name}`} className="shrink-0 text-charcoal hover:text-red-600"><X size={16} /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <textarea {...aria('message')} rows={4} maxLength={2000} placeholder="Anything else? Style, colours, storage you need, who will use it…" value={form.message} onChange={onChange} className={field('message')} />
          {hint('message', 'Wardrobe with a dressing mirror, light oak finish, and space for a TV.')}
        </div>
      </div>

      {/* Spam trap: real people never see or fill this */}
      <input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={onChange} className="hidden" aria-hidden="true" />

      <ConsentCheck id="cd-consent" checked={form.consent} onChange={onChange} error={errors.consent} withFiles={files.length > 0} what="custom design request" />

      <button disabled={status === 'loading'} className="flex w-full items-center justify-center gap-2 rounded-full bg-cerulean px-6 py-3 font-semibold text-white transition hover:bg-black disabled:opacity-60">
        <Send size={18} /> {status === 'loading' ? 'Sending…' : 'Send custom design request'}
      </button>
      {status === 'error' && <p role="alert" className="text-sm text-red-600">{error}</p>}
    </form>
  )
}