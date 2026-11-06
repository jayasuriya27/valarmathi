// File rules shared by every form that accepts attachments (browser + server). No Node-only code here.

export const MAX_FILES = 5
// Netlify accepts only about 6 MB per request, so all files of one form together must stay under 4 MB.
export const MAX_FILE_MB = 4
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024
export const MAX_TOTAL_MB = 4
export const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024

// Allowed file types (extension -> label). Anything else is rejected.
export const FILE_TYPES = {
  jpg: 'Photo', jpeg: 'Photo', png: 'Photo', webp: 'Photo', heic: 'Photo',
  pdf: 'PDF', doc: 'Document', docx: 'Document', zip: 'Zip', dwg: 'Drawing', skp: 'SketchUp',
}
export const FILE_ACCEPT = Object.keys(FILE_TYPES).map((e) => '.' + e).join(',')
export const fileExt = (name = '') => (String(name).split('.').pop() || '').toLowerCase()

// Checks one file by its name and size (the server also checks the real content)
export function checkFile({ name, size }) {
  if (!FILE_TYPES[fileExt(name)]) return `"${name}" is not allowed. Allowed: photos, PDF, Word, ZIP, DWG, SKP.`
  if (!size) return `"${name}" is empty.`
  if (size > MAX_FILE_BYTES) return `"${name}" is bigger than ${MAX_FILE_MB} MB.`
  return ''
}

// Checks the combined size of all attached files (array of objects with a size property)
export function checkTotal(files = []) {
  const total = files.reduce((sum, f) => sum + (f.size || 0), 0)
  if (total > MAX_TOTAL_BYTES) return `All files together must be under ${MAX_TOTAL_MB} MB. Please attach smaller files.`
  return ''
}