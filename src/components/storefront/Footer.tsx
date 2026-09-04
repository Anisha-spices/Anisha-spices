'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Check, Loader2 } from 'lucide-react'
import { subscribeNewsletter } from '@/actions/newsletter'

export function Footer() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setErrorMsg('')
    const res = await subscribeNewsletter(email)
    setLoading(false)
    if (res.success) {
      setSubscribed(true)
      setEmail('')
    } else {
      setErrorMsg(res.error || 'Subscription failed')
    }
  }
  return (
    <footer className="bg-[#240609] text-white pt-16 pb-12 border-t border-[#4A0D13]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          
          {/* Brand & Mission */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4 text-center sm:text-left">
            <Link href="/" className="flex items-center justify-center sm:justify-start gap-3">
              <div className="relative w-11 h-11 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border border-[#D49B4B]/50 flex items-center justify-center shrink-0 shadow-md bg-black">
                <Image
                  src="/images/logo.jpeg"
                  alt="Anisha Spices Logo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 44px, 64px"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Anisha <span className="text-[#D49B4B] text-lg font-sans uppercase tracking-widest">Spices</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Bringing the authentic, rich aroma and uncompromised purity of traditional Indian spices straight to your kitchen.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-[#E5AD58] font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-[#D49B4B]" />
              <span>100% Lab Tested &amp; FSSAI Certified</span>
            </div>
          </div>

          {/* Quick Links & Spice Categories Container */}
          <div className="grid grid-cols-2 gap-6 sm:col-span-2 lg:col-span-5">
            {/* Quick Links */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#E5AD58] tracking-wider uppercase">
                Explore
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-stone-300 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/shop" className="text-stone-300 hover:text-white transition-colors">Shop All Spices</Link>
                </li>
                <li>
                  <Link href="/shop?category=ground-spices" className="text-stone-300 hover:text-white transition-colors">Ground Spices</Link>
                </li>
                <li>
                  <Link href="/shop?category=blended-spices" className="text-stone-300 hover:text-white transition-colors">Blended Spices</Link>
                </li>
                <li>
                  <Link href="/about" className="text-stone-300 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-stone-300 hover:text-white transition-colors">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Spice Direct Products */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#E5AD58] tracking-wider uppercase">
                Signature Spices
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/product/turmeric-powder" className="text-stone-300 hover:text-white transition-colors">Salem Turmeric</Link>
                </li>
                <li>
                  <Link href="/product/red-chilly-powder" className="text-stone-300 hover:text-white transition-colors">Guntur Red Chilly</Link>
                </li>
                <li>
                  <Link href="/product/coriander-powder" className="text-stone-300 hover:text-white transition-colors">Coriander Powder</Link>
                </li>
                <li>
                  <Link href="/product/cumin-powder" className="text-stone-300 hover:text-white transition-colors">Gujarat Cumin</Link>
                </li>
                <li>
                  <Link href="/product/garam-masala" className="text-stone-300 hover:text-white transition-colors">Royal Garam Masala</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Discount */}
          <div className="sm:col-span-2 lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#E5AD58] tracking-wider uppercase">
              Stay Connected
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Subscribe to get exclusive festival recipe cards &amp; special discounts.
            </p>
            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Welcome to Purity Club! Check your inbox soon. 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-full bg-white/10 border border-white/20 px-4 py-2.5 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D49B4B]"
                />
                {errorMsg && <p className="text-[11px] text-rose-400 px-1">{errorMsg}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#8B1A24] py-2.5 text-xs font-bold text-white hover:bg-[#6B1118] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loading ? 'Subscribing...' : 'Join Purity Club'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright & legal strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-300 text-center sm:text-left">
          <p className="tracking-wide">
            &copy; {new Date().getFullYear()} <strong className="text-white font-semibold">Anisha Spices</strong>. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-medium">
            <Link 
              href="/privacy" 
              className="text-stone-300 hover:text-[#E5AD58] transition-colors py-1 hover:underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            <span className="text-white/20">•</span>
            <Link 
              href="/terms" 
              className="text-stone-300 hover:text-[#E5AD58] transition-colors py-1 hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <span className="text-white/20">•</span>
            <Link 
              href="/contact" 
              className="text-stone-300 hover:text-[#E5AD58] transition-colors py-1 hover:underline underline-offset-4"
            >
              Customer Support
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
