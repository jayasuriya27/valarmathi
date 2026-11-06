// Rules for the Custom Design form. Used by the browser form AND by the API (same rules in one place).
// No Node-only code here, so it is safe to import in the browser.
import { validateEnquiry, isTicked, CONSENT_MESSAGE, BUDGETS, MAX_FINISHES } from '@/lib/validation'
export { BUDGETS, MAX_FINISHES }
import { FINISH_SLUGS } from '@/lib/finishes'
export { MAX_FILES, MAX_FILE_MB, MAX_FILE_BYTES, FILE_TYPES, FILE_ACCEPT, fileExt, checkFile } from '@/lib/upload-rules'

export const FURNITURE_TYPES = ['Wardrobe', 'Cot / Bed', 'TV Unit', 'Pooja Unit', 'Dressing Table', 'Study / Office Table', 'Kitchen / House Interior', 'Other']
export const ROOM_TYPES = ['Bedroom', 'Living Room', 'Kitchen', 'Pooja Room', 'Office', 'Kids Room', 'Other']
export const NEEDED_BY = ['Within 1 month', '1 – 3 months', 'Flexible']

const pick = (v, list) => (list.includes(v) ? v : '')
const num = (v) => {
  const n = parseFloat(String(v ?? '').trim())
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
}

// data = plain object (finishes = array, site_visit / finish_help = true/false)
// Returns { values, errors } like validateEnquiry
export function validateCustomDesign(data = {}) {
  const base = validateEnquiry({ name: data.name, phone: data.phone, email: data.email, enquiry_type: 'General' }, { requireConsent: false })
  const errors = {}
  for (const k of ['name', 'phone', 'email']) if (base.errors[k]) errors[k] = base.errors[k]

  const values = {
    name: base.values.name,
    phone: base.values.phone,
    email: base.values.email,
    furniture_type: pick(String(data.furniture_type ?? ''), FURNITURE_TYPES),
    room_type: pick(String(data.room_type ?? ''), ROOM_TYPES),
    room_length: num(data.room_length),
    room_width: num(data.room_width),
    room_height: num(data.room_height),
    site_visit: data.site_visit === true || data.site_visit === 'true',
    finishes: [...new Set((Array.isArray(data.finishes) ? data.finishes : []).filter((f) => FINISH_SLUGS.includes(f)))].slice(0, MAX_FINISHES),
    finish_help: data.finish_help === true || data.finish_help === 'true',
    budget: pick(String(data.budget ?? ''), BUDGETS),
    needed_by: pick(String(data.needed_by ?? ''), NEEDED_BY),
    location: String(data.location ?? '').replace(/\s+/g, ' ').trim().slice(0, 150),
    message: String(data.message ?? '').trim().slice(0, 2000),
    consent: isTicked(data.consent),
  }

  if (!values.consent) errors.consent = CONSENT_MESSAGE

  if (!values.furniture_type) errors.furniture_type = 'Please choose what you need.'

  // Room size: needed, unless the customer asks for a site visit
  if (!values.site_visit) {
    const bad = (n, min, max) => n === null || n < min || n > max
    if (bad(values.room_length, 1, 100)) errors.room_length = 'Enter the length in feet (1 – 100). Example: 12'
    if (bad(values.room_width, 1, 100)) errors.room_width = 'Enter the width in feet (1 – 100). Example: 10'
  }
  if (values.room_height !== null && (values.room_height < 5 || values.room_height > 30)) errors.room_height = 'Height should be 5 – 30 feet. Example: 9'

  return { values, errors }
}
