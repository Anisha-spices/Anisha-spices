'use client'

import { Suspense, useState, useTransition } from 'react'
import { customerPasswordLogin, requestSignupOtp, verifySignupOtp } from '@/actions/auth'
import { LogIn, UserPlus, Mail, Lock, User, KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const searchParams = useSearchParams()
  const nextParam = searchParams.get('next') || searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [signupStep, setSignupStep] = useState<'details' | 'otp'>('details')

  // Sign in states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Sign up states
  const [fullName, setFullName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')

  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  // 1. Regular Password Login
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', loginEmail)
      formData.append('password', loginPassword)
      formData.append('redirectTo', nextParam)
      const res = await customerPasswordLogin({}, formData)
      if (res?.error) {
        setError(res.error)
      }
    })
  }

  // 2. Request Signup OTP via Brevo
  const handleRequestSignupOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('full_name', fullName)
      formData.append('email', signupEmail)
      formData.append('password', signupPassword)

      const res = await requestSignupOtp({}, formData)
      if (res.error) {
        setError(res.error)
      } else {
        setSignupStep('otp')
        setSuccessMessage(`A 6-digit verification code has been sent to ${signupEmail}`)
      }
    })
  }

  // 3. Verify Signup OTP & Create Account
  const handleVerifySignupOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    startTransition(async () => {
      const formData = new FormData()
      formData.append('email', signupEmail)
      formData.append('token', otpCode)
      formData.append('redirectTo', nextParam)

      const res = await verifySignupOtp({}, formData)
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
          {mode === 'signin'
            ? 'Sign In to Your Account'
            : signupStep === 'otp'
              ? 'Verify Your Email'
              : 'Create Your Account'}
        </h1>
        <p className="text-[#6E5951] mt-1 text-xs sm:text-sm">
          {mode === 'signin'
            ? 'Access your orders, saved addresses and exclusive spice offers.'
            : signupStep === 'otp'
              ? `Enter the 6-digit code sent to ${signupEmail}`
              : 'Join the Anisha Spices family for royal heritage recipes & offers.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      {signupStep !== 'otp' && (
        <div className="flex rounded-xl bg-[#FAF6F2] p-1 border border-[#E8DFD5] mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin')
              setError('')
              setSuccessMessage('')
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${mode === 'signin'
                ? 'bg-[#7B111A] text-white shadow-xs'
                : 'text-[#8C7567] hover:text-[#2A1612]'
              }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup')
              setError('')
              setSuccessMessage('')
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${mode === 'signup'
                ? 'bg-[#7B111A] text-white shadow-xs'
                : 'text-[#8C7567] hover:text-[#2A1612]'
              }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>
      )}

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
          <span className="font-bold shrink-0">Error:</span>
          <span>{error}</span>
        </div>
      )}

      {successMessage && !error && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
          <span className="font-bold shrink-0">Success:</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: REGULAR SIGN IN */}
      {mode === 'signin' && (
        <>

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
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
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
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#7B111A] hover:text-[#520C12] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer mt-3"
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
              <span>Instant Login · 100% Encrypted & Secure</span>
            </div>
          </form>
        </>
      )}

      {/* TAB 2: CREATE ACCOUNT (Step A: Details) */}
      {mode === 'signup' && signupStep === 'details' && (
        <form onSubmit={handleRequestSignupOtp} className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="signup-email"
                type="email"
                required
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="ramesh@example.com"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5">
              Create Password <span className="text-[#8C7567] font-normal lowercase">(min 6 chars)</span>
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type="password"
                required
                minLength={6}
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] text-sm transition-all shadow-inner"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer mt-3"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Send Verification OTP</span>
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#8C7567] mt-3">
            We will send a 6-digit verification code to verify your email.
          </p>
        </form>
      )}

      {/* TAB 2: CREATE ACCOUNT (Step B: 6-Digit OTP Verification) */}
      {mode === 'signup' && signupStep === 'otp' && (
        <form onSubmit={handleVerifySignupOtp} className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#C89B65]/40 text-center">
            <span className="text-xs text-[#8C7567]">Verification Code Sent To</span>
            <div className="font-bold text-[#2A1612] text-sm truncate">{signupEmail}</div>
          </div>

          <div>
            <label htmlFor="signup-otp" className="block text-xs font-semibold text-[#2A1612] uppercase tracking-wider mb-1.5 text-center">
              Enter 6-Digit OTP Code
            </label>
            <div className="relative">
              <input
                id="signup-otp"
                type="text"
                required
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                autoFocus
                className="w-full px-4 py-3 pl-11 rounded-xl border border-[#D4C7BA] bg-white text-[#2A1612] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]/30 focus:border-[#7B111A] tracking-widest text-xl font-bold text-center transition-all shadow-inner"
              />
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || otpCode.length < 6}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] hover:from-[#520C12] hover:to-[#7B111A] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/20 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
          >
            {isPending ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Verify & Activate Account</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              type="button"
              onClick={() => {
                setSignupStep('details')
                setError('')
                setSuccessMessage('')
              }}
              className="text-[#8C7567] hover:text-[#2A1612] flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={handleRequestSignupOtp}
              className="text-[#7B111A] hover:text-[#520C12] font-semibold cursor-pointer disabled:opacity-50"
            >
              Resend Code
            </button>
          </div>
        </form>
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
