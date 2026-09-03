import Link from 'next/link'
import {
  FileCheck,
  Truck,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Anisha Spices',
  description: 'Understand the terms, shipping conditions, and return guarantees for purchasing pure spices from Anisha Spices.',
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#FAF6F2] min-h-screen text-[#2A1612] pb-20">
      
      {/* ─── 1. Luxury Header Hero ────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-[#520C12] via-[#6B1118] to-[#7B111A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E5AD58_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E5AD58] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair Commerce &amp; Quality Pact</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Terms of Service
          </h1>
          
          <p className="text-stone-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Clear, transparent policies for all orders, doorstep delivery timelines, and our 100% authentic quality replacement promise.
          </p>

          <p className="text-xs text-[#E5AD58] font-semibold pt-1">
            Last Updated: September 2026 • Anisha Spices
          </p>
        </div>
      </div>

      {/* ─── 2. Key Pillars Strip (Negative Margin Overlay) ────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">Free Shipping ₹500+</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Standard 2–4 business days delivery across India. Free shipping on ₹500+ orders.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">48-Hour Replacement</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Damaged, broken seal, or incorrect parcel? We replace it free or issue 100% refund.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">FSSAI Authenticity</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Zero artificial food colorings, zero starches, and 100% cold-ground pure spices.
            </p>
          </div>

        </div>
      </div>

      {/* ─── 3. Detailed Legal Sections ───────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-[#E8DFD5] shadow-sm space-y-10">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                1
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Customer Agreement
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed pl-11">
              By accessing our website or placing an order with <strong>Anisha Spices</strong>, you agree to be bound by these Terms of Service. These terms apply to all visitors, registered customers, and merchant buyers. If you disagree with any part of these terms, please contact our team before placing an order.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-t border-[#F2ECE6] pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                2
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Shipping Timelines &amp; Doorstep Delivery
              </h2>
            </div>
            <div className="pl-11 space-y-3 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5]/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#2A1612]">
                    <Clock className="w-4 h-4 text-[#7B111A]" />
                    <span>Metro Cities (2–3 Days)</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, and major tier-1 hubs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5]/80 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#2A1612]">
                    <Clock className="w-4 h-4 text-[#7B111A]" />
                    <span>Rest of India (3–5 Days)</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Tier-2/3 cities and regional districts fulfilled via registered India Post and Express couriers.
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-500 pt-1">
                * Note: Please ensure your 6-digit postal PIN code and full mobile number are entered accurately to prevent courier returns (RTO).
              </p>
            </div>
          </section>

          {/* Section 3: Return & Refund Policy */}
          <section className="space-y-3 border-t border-[#F2ECE6] pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                3
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Replacement &amp; Refund Policy
              </h2>
            </div>
            <div className="pl-11 space-y-3 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <p>
                Because spices are edible food products governed by strict hygiene standards, opened food pouches cannot be returned for change of mind. However, <strong>we guarantee 100% free replacement or full refund</strong> under the following conditions:
              </p>
              
              <ul className="space-y-2 pt-1">
                <li className="flex items-start gap-2 text-sm text-[#4A3831]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Damaged in Transit:</strong> Outer parcel or spice pouch arrived torn, leaking, or damaged.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A3831]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Broken Security Seal:</strong> Pack seal was compromised before delivery.</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#4A3831]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Incorrect Product:</strong> Wrong spice variant or size delivered by mistake.</span>
                </li>
              </ul>

              <p className="text-xs text-stone-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 mt-3">
                <strong>How to Claim:</strong> WhatsApp or email us photo evidence within <strong>48 hours of delivery</strong>. Upon verification, your free replacement will dispatch within 24 hours or refund will credit to your original payment mode within 3–5 business days.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-[#F2ECE6] pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                4
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Pricing &amp; FSSAI Standards
              </h2>
            </div>
            <div className="pl-11 space-y-2 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <p>
                All prices are stated in Indian Rupees (INR) and are inclusive of applicable GST. We reserve the right to revise spice pricing based on seasonal harvest yields and agricultural commodity costs. All Anisha Spices products meet rigorous FSSAI quality benchmarks.
              </p>
            </div>
          </section>

          {/* Section 5: Support Desk */}
          <section className="border-t border-[#F2ECE6] pt-8">
            <div className="p-6 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#2A1612]">
                  Need Help with an Order?
                </h3>
                <p className="text-xs text-[#6E5951]">
                  Our customer care team is available Monday to Saturday, 9 AM to 7 PM:
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#7B111A] pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> +91 9540048786
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> support@anishaspices.com
                  </span>
                </div>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#5E0D14] shadow-sm transition-all shrink-0"
              >
                <span>Contact Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

        </div>
      </div>

    </div>
  )
}
