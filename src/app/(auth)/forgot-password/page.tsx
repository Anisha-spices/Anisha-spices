'use client'

import { useState, useTransition } from 'react'
import { requestPasswordReset } from '@/actions/auth'
import { Mail, ArrowLeft, Send, CheckCircle2, ShieldAlert } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      const res = await requestPasswordReset({}, formData)
      if (res.error) {
        setError(res.error)
      } else {
        setIsSuccess(true)
      }
    })
  }

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#E8DFD5] p-6 sm:p-10">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex flex-col items-center gap-1.5 group mb-3">
          <div className="w-12 h-12 rounded-full bg-[#7B111A]/10 border border-[#7B111A]/25 flex items-center justify-center text-[#7B111A] group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
              <path d="M12 2C6.5 2 2 6.5 2 12c0 3.8 2.2 7.1 5.4 8.7-.2-.8-.4-1.8-.4-2.7 0-4.2 3.4-7.6 7.6-7.6 1.1 0 2.2.2 3.1.7.9-1.3 1.3-2.9 1.3-4.5 0-2.5-1.1-4.6-2.9-5.9C15 2.2 13.5 2 12 2zm6.6 8.4c-.9-.4-1.9-.6-3-.6-3.1 0-5.6 2.5-5.6 5.6 0 1.2.4 2.3 1 3.2 3.7-.8 6.6-3.8 7.6-8.2z" />
            </svg>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#7B111A]">
            Anisha Spices
          </span>
        </Link>

        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
          Reset Your Password
        </h1>
        <p className="text-[#6E5951] mt-1 text-xs sm:text-sm">
          Enter your registered email address and we will send you a secure password reset link via Brevo.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-lg font-bold text-[#2A1612]">
            Password Reset Link Sent!
          </h2>

          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#C89B65]/40 text-xs sm:text-sm text-[#6E5951] text-left space-y-2">
            <p>
              We have sent a secure password reset link to <strong className="text-[#2A1612]">{email}</strong>.
            </p>
            <p className="text-[11px] text-[#8C7567]">
              ⏳ The link is valid for <strong>15 minutes</strong>. If you don't see it within 1–2 minutes, please check your Spam or Promotions folder.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#FAF6F2] hover:bg-[#F2EAE1] text-[#2A1612] font-semibold text-xs rounded-full border border-[#D4C7BA] transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Account Email Address
            </label>
            <div className="relative">
              <input
                id="reset-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B111A] hover:text-[#520C12] hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}
