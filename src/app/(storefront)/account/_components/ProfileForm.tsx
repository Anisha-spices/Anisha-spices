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
            className="block w-full rounded-xl border border-[#D4C7BA] bg-[#FAF6F2] py-2.5 px-3.5 text-[#5A433B] text-xs sm:text-sm font-medium cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-[#8C7567]">Registered email address (verified)</p>
        </div>
      </div>

      <div>
        <label htmlFor="full_name" className="block text-xs font-bold text-[#2A1612] uppercase tracking-wider">
          Full Name <span className="text-[#7B111A]">*</span>
        </label>
        <div className="mt-1.5">
          <input
            type="text"
            id="full_name"
            name="full_name"
            defaultValue={initialFullName}
            required
            className="block w-full rounded-xl border border-[#D4C7BA] bg-white py-2.5 px-3.5 text-[#2A1612] focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-xs sm:text-sm shadow-xs transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-bold text-[#2A1612] uppercase tracking-wider">
          Phone Number <span className="text-[#7B111A]">*</span>
        </label>
        <div className="mt-1.5">
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={initialPhone}
            required
            placeholder="10-digit mobile number"
            className="block w-full rounded-xl border border-[#D4C7BA] bg-white py-2.5 px-3.5 text-[#2A1612] focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-xs sm:text-sm shadow-xs transition-all"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#E8DFD5] flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center items-center gap-2 rounded-full bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] px-8 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-[#7B111A]/20 disabled:opacity-60 transition-all cursor-pointer"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  )
}
