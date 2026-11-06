'use client'
import { useRef } from 'react'
import { Paperclip, X } from 'lucide-react'
import { FILE_ACCEPT, MAX_FILES, MAX_TOTAL_MB, checkFile, checkTotal } from '@/lib/upload-rules'

const sizeText = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB')

// Attach button + list of chosen files. The parent form keeps `files` (array of File) and the `error` text.
export default function FileAttach({ files, setFiles, error, setError, label = 'Attach photos, screenshots, PDF or ZIP (optional)' }) {
  const input = useRef(null)

  const add = (e) => {
    const picked = [...e.target.files]
    e.target.value = '' // so the same file can be chosen again later
    const list = [...files]
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
    setError(problem)
  }
  const remove = (i) => { setFiles(files.filter((_, n) => n !== i)); setError('') }

  return (
    <div>
      <button type="button" id="cd-files" onClick={() => input.current?.click()}
        className={`flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-sm transition hover:border-cerulean ${error ? 'border-red-500' : 'border-lightgray'}`}>
        <Paperclip size={18} /> {label}
      </button>
      <input ref={input} type="file" multiple accept={FILE_ACCEPT} onChange={add} className="hidden" />
      <p className="mt-1 text-xs text-charcoal">Up to {MAX_FILES} files, {MAX_TOTAL_MB} MB in total. Photo, PDF, Word, ZIP, DWG, SKP.</p>
      {error && <p role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={f.name + f.size} className="flex items-center justify-between gap-3 rounded-lg bg-smoke px-3 py-2 text-sm">
              <span className="min-w-0 truncate">{f.name} <span className="text-charcoal">({sizeText(f.size)})</span></span>
              <button type="button" onClick={() => remove(i)} aria-label={`Remove ${f.name}`} className="shrink-0 text-charcoal hover:text-red-600"><X size={16} /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}