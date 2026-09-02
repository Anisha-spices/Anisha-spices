import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In | Anisha Spices',
  description: 'Sign in or create an account with Anisha Spices.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#F8ECE7] py-12 px-4 sm:px-6">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#6B1118]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D49B4B]/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#6B1118] hover:text-[#520C12] transition-colors"
        >
          ← Back to Store
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
