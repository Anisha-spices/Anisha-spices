import Link from 'next/link'
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CreditCard,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Anisha Spices',
  description: 'Understand how Anisha Spices protects your personal data, address privacy, and payment security.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#FAF6F2] min-h-screen text-[#2A1612] pb-20">
      
      {/* ─── 1. Luxury Header Hero ────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-b from-[#520C12] via-[#6B1118] to-[#7B111A] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#E5AD58_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E5AD58] text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Purity &amp; Trust Assurance</span>
          </div>
          
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Privacy Policy
          </h1>
          
          <p className="text-stone-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Your trust is as essential to us as the authentic purity of our spices. Here is our transparent commitment to safeguarding your privacy and data.
          </p>

          <p className="text-xs text-[#E5AD58] font-semibold pt-1">
            Last Updated: September 2026 • Anisha Spices (FSSAI Certified)
          </p>
        </div>
      </div>

      {/* ─── 2. Key Pillars Strip (Negative Margin Overlay) ────────────────── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">0% Data Selling</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              We never sell, rent, or trade your contact details with any third-party advertisers.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-3">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">Bank-Grade Security</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              256-bit SSL encryption &amp; PCI-DSS compliant payment gateways for cards &amp; UPI.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E8DFD5] shadow-lg shadow-stone-200/50 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-bold text-sm text-[#2A1612]">Verified Delivery</h2>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Your address is used solely for accurate India Post &amp; courier delivery to your doorstep.
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
                Our Privacy Guarantee
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed pl-11">
              At <strong>Anisha Spices</strong>, we treat your privacy with the same uncompromising integrity we apply to our authentic cold-ground spices. When you visit our website, place an order, or create an account, you trust us with your personal information. This document outlines exactly what information is collected, how it is handled, and how your rights are protected.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4 border-t border-[#F2ECE6] pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                2
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Information We Collect &amp; Why
              </h2>
            </div>
            <div className="pl-11 space-y-3 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <p>We only collect the information necessary to fulfill your purchases and ensure smooth doorstep delivery:</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5]/80 space-y-1.5">
                  <h3 className="font-bold text-sm text-[#2A1612] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Delivery &amp; Contact Info
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Your full name, 10-digit mobile number, delivery address, and official 6-digit postal PIN code verified via India Post database.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5]/80 space-y-1.5">
                  <h3 className="font-bold text-sm text-[#2A1612] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Account &amp; Order History
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Your past purchases, order tracking status, spice preferences, and optional saved addresses for fast 1-click checkout.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-[#F2ECE6] pt-8">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#7B111A] font-serif font-bold text-sm flex items-center justify-center border border-[#C89B65]/40">
                3
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Payment Security &amp; Encryption
              </h2>
            </div>
            <div className="pl-11 space-y-3 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <p>
                We do <strong>not</strong> store, handle, or log any credit card numbers, debit card PINs, CVV codes, or net banking credentials on our servers. All digital transactions are processed through India&apos;s leading RBI-authorized, PCI-DSS Level 1 compliant gateway (Razorpay) using end-to-end 256-bit SSL encryption.
              </p>
              <p>
                For Cash on Delivery (COD) orders, our system strictly logs order contact details for delivery confirmation and courier dispatch.
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
                Cookies &amp; Local Sessions
              </h2>
            </div>
            <div className="pl-11 space-y-2 text-sm sm:text-base text-[#5A433B] leading-relaxed">
              <p>
                We use secure, HTTP-only session cookies strictly to keep your shopping cart intact while browsing and to allow authenticated members to manage orders securely. We do not use invasive tracking or sell behavioral browsing profiles to third-party ad networks.
              </p>
            </div>
          </section>

          {/* Section 5: Grievance & Support */}
          <section className="border-t border-[#F2ECE6] pt-8">
            <div className="p-6 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-[#2A1612]">
                  Questions or Data Request?
                </h3>
                <p className="text-xs text-[#6E5951]">
                  Contact our dedicated customer support &amp; data grievance officer:
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
