// ONE place for the enquiry form rules.
// The browser form (EnquiryForm.js) uses it for instant messages,
// the API (api/enquiries/route.js) uses it again as the real security check.

export const ENQUIRY_TYPES = ['General', 'Product', 'Custom Design', 'Modular Kitchen / House Interior']

export const BUDGETS = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000', 'Not decided']
export const MAX_FINISHES = 3

const NAME_RE = /^[\p{L}\p{M} .'-]{2,100}$/u // letters (English + Tamil etc.), space, dot, apostrophe, hyphen
const PHONE_RE = /^[6-9]\d{9}$/ // Indian mobile numbers start with 6, 7, 8 or 9
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "+91 98765-43210", "098765 43210", "9876543210"  ->  "9876543210"
export function cleanPhone(v) {
  let d = String(v ?? '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d.slice(0, 10)
}

const num = (v) => {
  const n = parseFloat(String(v ?? '').trim())
  return Number.isFinite(n) ? Math.round(n * 10) / 10 : null
}
const tidy = (v, max) => String(v ?? '').replace(/\s+/g, ' ').trim().slice(0, max)

// Cleans the values and checks them.
// Returns { values, errors }. errors = { name: '...', phone: '...' } (empty object when everything is fine)
export const isTicked = (v) => v === true || v === 'true' || v === 'on' || v === '1'
export const CONSENT_MESSAGE = 'Please tick this box to allow us to contact you.'

export function validateEnquiry(data = {}, { requireConsent = true } = {}) {
  const values = {
    name: tidy(data.name, 100),
    phone: cleanPhone(data.phone),
    email: tidy(data.email, 100).toLowerCase(),
    enquiry_type: tidy(data.enquiry_type, 50) || 'General',
    message: String(data.message ?? '').trim().slice(0, 1500),
    product_name: tidy(data.product_name, 150),
    // Space size in feet (optional)
    room_length: num(data.room_length),
    room_width: num(data.room_width),
    // customer agreed that we may save the details and contact them
    consent: isTicked(data.consent),
  }

  const errors = {}
  if (requireConsent && !values.consent) errors.consent = CONSENT_MESSAGE
  if (!values.name) errors.name = 'Please enter your name. Example: Ramesh Kumar'
  else if (!NAME_RE.test(values.name)) errors.name = 'Name can have only letters (at least 2). Example: Ramesh Kumar'

  if (!values.phone) errors.phone = 'Please enter your mobile number. Example: 9876543210'
  else if (!PHONE_RE.test(values.phone) || /^(\d)\1{9}$/.test(values.phone)) errors.phone = 'Enter a valid 10-digit mobile number (starts with 6, 7, 8 or 9). Example: 9876543210'

  if (values.email && !EMAIL_RE.test(values.email)) errors.email = 'Enter a valid email address. Example: name@gmail.com'

  if (!ENQUIRY_TYPES.includes(values.enquiry_type)) errors.enquiry_type = 'Please choose a valid enquiry type.'

  // Size is optional, but if one side is given the other is needed too
  const { room_length: L, room_width: W } = values
  if (L !== null || W !== null) {
    const bad = (n) => n === null || n < 1 || n > 100
    if (bad(L)) errors.room_length = 'Enter the length in feet (1 – 100). Example: 12'
    if (bad(W)) errors.room_width = 'Enter the width in feet (1 – 100). Example: 10'
  }

  return { values, errors }
}
