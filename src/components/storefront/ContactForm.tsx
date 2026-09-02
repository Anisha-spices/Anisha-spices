'use client'

import { useState, useRef } from 'react'
import { submitInquiry } from '@/actions/contact'
import { Loader2, CheckCircle2, Send } from 'lucide-react'

export function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const result = await submitInquiry(formData)

    if (result.success) {
      setSuccess(true)
      formRef.current?.reset()
    } else {
      setError(result.error || 'Failed to submit inquiry. Please try again.')
    }

    setIsPending(false)
  }

  if (success) {
    return (
      <div className="bg-white rounded-3xl shadow-xl border border-[#E8DFD5] p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[420px] animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#FAF3EB] border border-[#C89B65]/40 flex items-center justify-center text-[#7B111A] mb-5 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-[#7B111A]" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#2A1612] mb-2">Message Sent Successfully!</h3>
        <p className="text-sm text-[#5A433B] max-w-md leading-relaxed">
          Thank you for reaching out to Anisha Spices. Our spice care team has received your message and will respond within 24 hours.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#7B111A] px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-[#520C12] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-[#E8DFD5] p-6 sm:p-10">
      <div className="mb-6 space-y-1">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">Send Us a Message</h3>
        <p className="text-xs sm:text-sm text-[#6E5951]">Fill out the form below and we will get right back to you.</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm font-medium rounded-xl">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="first-name" className="block text-xs sm:text-sm font-semibold text-[#2A1612] mb-1.5">
              First Name <span className="text-[#7B111A]">*</span>
            </label>
            <input
              required
              type="text"
              name="first-name"
              id="first-name"
              placeholder="e.g. Ramesh"
              className="block w-full rounded-xl border border-[#E8DFD5] bg-[#FAF6F2] py-2.5 px-3.5 text-xs sm:text-sm text-[#2A1612] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B111A]/20 focus:border-[#7B111A] transition-all"
            />
          </div>
          <div>
            <label htmlFor="last-name" className="block text-xs sm:text-sm font-semibold text-[#2A1612] mb-1.5">
              Last Name <span className="text-[#7B111A]">*</span>
            </label>
            <input
              required
              type="text"
              name="last-name"
              id="last-name"
              placeholder="e.g. Sharma"
              className="block w-full rounded-xl border border-[#E8DFD5] bg-[#FAF6F2] py-2.5 px-3.5 text-xs sm:text-sm text-[#2A1612] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B111A]/20 focus:border-[#7B111A] transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#2A1612] mb-1.5">
            Email Address <span className="text-[#7B111A]">*</span>
          </label>
          <input
            required
            type="email"
            name="email"
            id="email"
            placeholder="you@example.com"
            className="block w-full rounded-xl border border-[#E8DFD5] bg-[#FAF6F2] py-2.5 px-3.5 text-xs sm:text-sm text-[#2A1612] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B111A]/20 focus:border-[#7B111A] transition-all"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-[#2A1612] mb-1.5">
            Your Message or Inquiry <span className="text-[#7B111A]">*</span>
          </label>
          <textarea
            required
            name="message"
            id="message"
            rows={4}
            placeholder="Tell us what you are looking for (e.g. product questions, bulk spice orders, recipe recommendations)..."
            className="block w-full rounded-xl border border-[#E8DFD5] bg-[#FAF6F2] py-2.5 px-3.5 text-xs sm:text-sm text-[#2A1612] placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7B111A]/20 focus:border-[#7B111A] transition-all resize-none"
          ></textarea>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-[#7B111A] px-6 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-[#7B111A]/25 hover:bg-[#520C12] hover:shadow-xl hover:gap-3 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
