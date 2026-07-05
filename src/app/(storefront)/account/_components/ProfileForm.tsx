'use client'

import { useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import { updateProfile } from '@/actions/profile'

export function ProfileForm({
  initialFullName,
  initialPhone,
  email,
}: {
  initialFullName: string
  initialPhone: string
  email: string
}) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const result = await updateProfile(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Profile updated successfully.' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg text-sm font-medium ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium leading-6 text-text">
          Email Address
        </label>
        <div className="mt-2">
          <input
            type="email"
            id="email"
            value={email}
            readOnly
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
          <p className="mt-1 text-xs text-text-muted">Your email address cannot be changed here.</p>
        </div>
      </div>

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-text">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-2">
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={initialFullName}
            required
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium leading-6 text-text">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="mt-2">
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={initialPhone}
            required
            pattern="[0-9]{10}"
            maxLength={10}
            title="Please enter a valid 10-digit phone number"
            className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border placeholder:text-text-muted focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-all"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  )
}
