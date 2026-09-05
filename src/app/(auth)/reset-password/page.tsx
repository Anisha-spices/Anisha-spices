'use client'

import { Suspense, useState, useTransition } from 'react'
import { resetPasswordWithToken } from '@/actions/auth'
import { Lock, ArrowLeft, ShieldCheck, AlertCircle, Key } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  if (!token) {
    return (
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#E8DFD5] p-6 sm:p-10 text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-xl font-bold text-[#2A1612]">
          Invalid Password Reset Link
        </h1>
        <p className="text-xs sm:text-sm text-[#6E5951]">
          No security token was detected in your link. The link might be malformed or incomplete.
        </p>
        <div className="pt-2">
          <Link
            href="/forgot-password"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#7B111A] hover:bg-[#520C12] text-white font-bold text-xs rounded-full shadow-lg shadow-[#7B111A]/20 transition-all cursor-pointer"
          >
            <span>Request a New Reset Link</span>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append('token', token)
      formData.append('password', password)
      formData.append('confirm_password', confirmPassword)

      const res = await resetPasswordWithToken({}, formData)
      if (res?.error) {
        setError(res.error)
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
          Set a New Password
        </h1>
        <p className="text-[#6E5951] mt-1 text-xs sm:text-sm">
          Please enter your new password below to regain access to your account.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
            New Password <span className="text-[#8C7567] font-normal lowercase">(min 6 chars)</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
            />
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer mt-2"
        >
          {isPending ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Update Password & Enter</span>
            </>
          )}
        </button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7B111A] hover:text-[#520C12] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Back to Sign In</span>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#6E5951]">Loading password reset screen...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
