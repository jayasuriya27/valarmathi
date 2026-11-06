'use client'
import { Check } from 'lucide-react'

// "I agree" tick box used by the enquiry form and the custom design form.
// The tick box starts UNTICKED and the form cannot be sent until it is ticked.
export const CONSENT_ERROR = 'Please tick this box to allow us to contact you.'

export default function ConsentCheck({ id = 'consent', checked, onChange, error, withFiles = false, what = 'enquiry' }) {
  return (
    <div>
      <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-snug ${error ? 'border-red-500 bg-red-50/40' : 'border-lightgray/70 bg-smoke/60'}`}>
        {/* Custom tick box: white box, turns lime green (box and border) when ticked */}
        <span className="relative mt-0.5 h-5 w-5 shrink-0">
          <input
            id={id}
            name="consent"
            type="checkbox"
            checked={!!checked}
            onChange={onChange}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `err-${id}` : undefined}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          />
          <span
            className={`flex h-5 w-5 items-center justify-center rounded border-2 bg-white transition peer-checked:border-lime peer-checked:bg-lime peer-focus-visible:ring-2 peer-focus-visible:ring-lime/60 peer-checked:[&>svg]:opacity-100 ${error ? 'border-red-500' : 'border-lightgray'}`}
          >
            <Check size={14} strokeWidth={3.5} className="text-black opacity-0 transition" />
          </span>
        </span>
        <span>
          I agree that Valarmathi Industries can save the details I give here{withFiles ? ' (and any files I attach)' : ''} and contact me
          by phone, WhatsApp or email about my {what}. <span className="text-charcoal">My details are used only to reply to my {what}.</span>
        </span>
      </label>
      {error && <p id={`err-${id}`} role="alert" className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}