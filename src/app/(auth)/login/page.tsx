'use client'

import { Suspense, useState, useTransition } from 'react'
import { sendOtp, verifyOtp, customerPasswordLogin } from '@/actions/auth'
import { LogIn, Mail, KeyRound, ArrowRight, ShieldCheck, Lock, Sparkles, UserCheck } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next') || searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<'password' | 'otp'>('password')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('redirectTo', nextParam)
      const res = await customerPasswordLogin({}, formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  const fillDemoAccount = () => {
    setEmail('demo@anishamasala.com')
    setPassword('DemoUser@123')
    setMode('password')
    setError('')
  }

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      const res = await sendOtp({}, formData)
      if (res.error) {
        setError(res.error)
      } else {
        setStep('otp')
      }
    })
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('token', otp)
      formData.append('redirectTo', nextParam)
      const res = await verifyOtp({}, formData)
      if (res.error) {
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
          Sign In to Your Account
        </h1>
        <p className="text-[#6E5951] mt-1 text-xs sm:text-sm">
          Access your orders, saved addresses and exclusive spice offers.
        </p>
      </div>

      {/* ⚡ 1-Click Demo Account Quick Fill Card */}
      <div className="mb-6 p-4 rounded-2xl bg-[#FAF6F2] border border-[#C89B65]/40 flex items-center justify-between gap-3 shadow-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B111A]">
            <Sparkles className="w-3.5 h-3.5 text-[#C89B65]" />
            <span>Demo Customer Access</span>
          </div>
          <p className="text-[11px] text-[#8C7567] mt-0.5 truncate">
            Demo Customer · demo@anishamasala.com
          </p>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="shrink-0 px-3 py-1.5 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#520C12] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Auto Fill</span>
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex rounded-xl bg-[#FAF6F2] p-1 border border-[#E8DFD5] mb-6">
        <button
          type="button"
          onClick={() => {
            setMode('password')
            setError('')
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'password'
              ? 'bg-[#7B111A] text-white shadow-xs'
              : 'text-[#8C7567] hover:text-[#2A1612]'
          }`}
        >
          Password Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('otp')
            setError('')
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            mode === 'otp'
              ? 'bg-[#7B111A] text-white shadow-xs'
              : 'text-[#8C7567] hover:text-[#2A1612]'
          }`}
        >
          Email OTP
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <span className="font-bold">Error:</span> {error}
        </div>
      )}

      {mode === 'password' ? (
        /* Email + Password Form (Instant & No Rate Limits) */
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@anishamasala.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider">
                Password
              </label>
              <span className="text-[11px] text-[#8C7567] font-medium">Demo: DemoUser@123</span>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
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
                <LogIn className="w-4 h-4" />
                <span>Sign In Instantly</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C7567] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7B111A]" />
            <span>Instant Secure Login · Zero Email Wait</span>
          </div>
        </form>
      ) : (
        /* OTP Mode */
        step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6B1118]/30 focus:border-[#6B1118] text-sm transition-all shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-[#6B1118] hover:bg-[#520C12] text-white font-semibold rounded-full shadow-lg shadow-[#6B1118]/25 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Send Login OTP
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8B6B58] pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6B1118]" />
            <span>Secure 100% Encrypted Login</span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label htmlFor="login-otp" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              6-Digit OTP Code
            </label>
            <div className="relative">
              <input
                id="login-otp"
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#6B1118]/30 focus:border-[#6B1118] tracking-widest text-lg font-bold text-center transition-all shadow-inner"
              />
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || otp.length < 6}
            className="w-full py-3.5 px-4 bg-[#6B1118] hover:bg-[#520C12] text-white font-semibold rounded-full shadow-lg shadow-[#6B1118]/25 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify OTP & Enter'
            )}
          </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-center text-xs font-semibold text-[#8B1A24] hover:text-[#520C12] transition-colors mt-2 cursor-pointer"
            >
              ← Use a different email
            </button>
          </form>
        )
      )}
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#6E5951]">Loading login screen...</div>}>
      <LoginForm />
    </Suspense>
  )
}
