'use client'

import { useState, useEffect } from 'react'
import {
  Sparkles,
  Leaf,
  ShieldCheck,
  Award,
  ChevronDown,
  Star,
  MessageSquare,
  Package,
  Clock,
  Phone,
  CheckCircle2,
  Lock,
} from 'lucide-react'
import { submitReview } from '@/actions/reviews'

type ProductTabsSectionProps = {
  productId: string
  productName: string
  description?: string | null
  shortDescription?: string | null
  specs: { id?: string; label: string; value: string }[]
  faqs: { id: string; question: string; answer: string }[]
  reviews: {
    id: string
    rating: number
    review_text: string | null
    created_at: string
    user: { full_name: string } | null
  }[]
  isAuthenticated: boolean
  averageRating?: number
}

export function ProductTabsSection({
  productId,
  productName,
  description,
  shortDescription,
  specs = [],
  faqs = [],
  reviews = [],
  isAuthenticated,
  averageRating = 0,
}: ProductTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'specs' | 'faqs' | 'reviews'>('about')

  const calculatedRating = reviews.length > 0
    ? (averageRating > 0 ? averageRating : reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length)
    : 0
  const roundedStars = Math.min(5, Math.max(1, Math.round(calculatedRating)))

  // Review Form state
  const [writeReviewOpen, setWriteReviewOpen] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)

  // FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs.length > 0 ? faqs[0].id : null)

  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash === '#reviews') {
        setActiveTab('reviews')
        setWriteReviewOpen(true)
        const el = document.getElementById('reviews')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleReviewSubmit = async (formData: FormData) => {
    setIsSubmittingReview(true)
    setReviewError(null)
    setReviewSuccess(false)

    formData.append('product_id', productId)
    formData.append('rating', reviewRating.toString())

    const result = await submitReview({}, formData)
    if (result.error) {
      setReviewError(result.error)
    } else {
      setReviewSuccess(true)
    }
    setIsSubmittingReview(false)
  }

  // Standard verified spice specifications
  const defaultSpecs = [
    { label: 'Dietary Preference', value: '100% Vegetarian & Vegan Pure' },
    { label: 'Form & Texture', value: 'Freshly Cold-Ground / Natural Whole' },
    { label: 'Preservatives & Additives', value: 'Zero Artificial Color, Zero Starch, No Fillers' },
    { label: 'Shelf Life', value: '12 Months from Packaging Date' },
    { label: 'Storage Instructions', value: 'Store in an airtight container in a cool, dry place' },
    { label: 'Quality Certification', value: 'FSSAI Certified & Quality Batch Tested' },
  ]

  const displaySpecs = specs.length > 0 ? specs : defaultSpecs

  return (
    <div id="reviews" className="mt-8 sm:mt-12 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden scroll-mt-24">
      
      {/* ─── Tab Navigation Bar (Swipeable on mobile, Centered on desktop) ─── */}
      <div className="border-b border-[#E8DFD5] bg-[#FAF6F2]/70 px-3 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 sm:py-3">
          
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-[#7B111A] text-white shadow-sm'
                : 'text-[#6E5951] hover:text-[#2A1612] hover:bg-white/80'
            }`}
          >
            <span>🌿</span>
            <span>About &amp; Origin</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'specs'
                ? 'bg-[#7B111A] text-white shadow-sm'
                : 'text-[#6E5951] hover:text-[#2A1612] hover:bg-white/80'
            }`}
          >
            <span>📋</span>
            <span>Specifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'bg-[#7B111A] text-white shadow-sm'
                : 'text-[#6E5951] hover:text-[#2A1612] hover:bg-white/80'
            }`}
          >
            <span>💬</span>
            <span>FAQs &amp; Care</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#7B111A] text-white shadow-sm'
                : 'text-[#6E5951] hover:text-[#2A1612] hover:bg-white/80'
            }`}
          >
            <span>⭐</span>
            <span>Customer Reviews ({reviews.length})</span>
          </button>

        </div>
      </div>

      {/* ─── Tab 1: About This Spice ───────────────────────────────────────── */}
      {activeTab === 'about' && (
        <div className="p-5 sm:p-8 lg:p-10 space-y-8 animate-in fade-in duration-200">
          
          {/* Quality Seals Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7B111A]/10 text-[#7B111A] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#2A1612]">Cold-Ground</span>
                <span className="block text-[11px] text-[#8C7567]">Essential Oils Retained</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#2A1612]">100% Pure</span>
                <span className="block text-[11px] text-[#8C7567]">Zero Artificial Colors</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#2A1612]">Farm Origin</span>
                <span className="block text-[11px] text-[#8C7567]">Hand-Sorted Batches</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#2A1612]">FSSAI Tested</span>
                <span className="block text-[11px] text-[#8C7567]">Safety Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Description Story */}
          <div className="space-y-4 text-sm sm:text-base text-[#4A3831] leading-relaxed">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
              The Story of {productName}
            </h3>
            
            <div className="prose prose-stone max-w-none text-[#5A433B] whitespace-pre-wrap leading-relaxed">
              {description ||
                shortDescription ||
                `${productName} is carefully sourced from verified Indian farm origins, sun-dried naturally, and processed with cold-grinding technology to preserve rich natural aromas, volatile oils, and vibrant authentic taste.`}
            </div>

            {/* Quote Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF3EB] border border-[#C89B65]/40 text-[#7B111A] text-xs sm:text-sm font-medium flex items-center gap-3">
              <span className="text-2xl">🌿</span>
              <p>
                <strong>Pure Tradition:</strong> Unlike commercial mass-grinding which burns volatile oils at high heat, Anisha Spices are processed at low friction temperatures for intense natural flavor and long-lasting freshness.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ─── Tab 2: Specifications ─────────────────────────────────────────── */}
      {activeTab === 'specs' && (
        <div className="p-5 sm:p-8 lg:p-10 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
              Product Specifications &amp; Quality
            </h3>
            <span className="text-xs text-[#7B111A] font-semibold bg-[#FAF3EB] px-3 py-1 rounded-full border border-[#C89B65]/30">
              Verified Batch Standards
            </span>
          </div>

          <div className="overflow-hidden bg-white border border-[#E8DFD5] rounded-2xl shadow-xs">
            <table className="min-w-full divide-y divide-[#E8DFD5]">
              <tbody className="divide-y divide-[#E8DFD5]">
                {displaySpecs.map((spec, index) => (
                  <tr
                    key={spec.label || index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F2]'}
                  >
                    <td className="py-3.5 pl-4 sm:pl-6 pr-3 text-xs sm:text-sm font-bold text-[#2A1612] w-2/5 sm:w-1/3 border-r border-[#E8DFD5]">
                      {spec.label}
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-xs sm:text-sm text-[#5A433B] font-medium whitespace-pre-wrap">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab 3: FAQs & Care ────────────────────────────────────────────── */}
      {activeTab === 'faqs' && (
        <div className="p-5 sm:p-8 lg:p-10 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
                Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-[#6E5951] mt-0.5">
                Everything you need to know about this spice, shipping, and storage.
              </p>
            </div>
          </div>

          {faqs.length > 0 ? (
            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id
                return (
                  <div
                    key={faq.id}
                    className="border border-[#E8DFD5] rounded-2xl overflow-hidden bg-white shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 sm:p-5 text-left group cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#2A1612] group-hover:text-[#7B111A] transition-colors pr-4">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#8C766E] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#7B111A]' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#5A433B] leading-relaxed border-t border-[#F2ECE6] pt-3 whitespace-pre-line bg-[#FAF6F2]/40">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] text-center space-y-3">
              <Package className="w-8 h-8 text-[#8C766E] mx-auto" />
              <p className="text-sm font-semibold text-[#2A1612]">
                Have questions about {productName}?
              </p>
              <p className="text-xs text-[#6E5951] max-w-md mx-auto">
                Speak directly with our spice master team on WhatsApp for cooking tips, bulk supply, or doorstep delivery queries.
              </p>
              <a
                href={`https://wa.me/919540048786?text=${encodeURIComponent(
                  `Hi Anisha Spices, I have a query about ${productName}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab 4: Customer Reviews ───────────────────────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="p-5 sm:p-8 lg:p-10 space-y-8 animate-in fade-in duration-200">
          
          {/* Rating Summary Header */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] flex flex-col items-center justify-center shadow-xs">
                <span className="text-2xl font-black text-[#7B111A]">
                  {reviews.length > 0 ? calculatedRating.toFixed(1) : '—'}
                </span>
                <span className="text-[10px] font-bold text-amber-600 flex items-center tracking-widest">
                  {reviews.length > 0
                    ? '★'.repeat(roundedStars) + '☆'.repeat(5 - roundedStars)
                    : '☆☆☆☆☆'}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2A1612]">
                  Customer Reviews
                </h3>
                <p className="text-xs text-[#6E5951]">
                  {reviews.length > 0
                    ? `Based on ${reviews.length} authentic customer rating${reviews.length > 1 ? 's' : ''} • 100% Verified Pure Spice`
                    : 'No customer reviews yet. Be the first to share your experience!'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setWriteReviewOpen(!writeReviewOpen)}
              className="px-5 py-2.5 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#5E0D14] shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              {writeReviewOpen ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Write a Review Collapsible Box */}
          {writeReviewOpen && (
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E8DFD5] shadow-sm space-y-4 animate-in fade-in duration-200">
              <h4 className="font-serif text-base font-bold text-[#2A1612]">
                Share Your Experience with {productName}
              </h4>

              {reviewSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Thank you! Your review has been submitted for verification.</span>
                </div>
              ) : isAuthenticated ? (
                <form action={handleReviewSubmit} className="space-y-4">
                  {reviewError && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs">
                      {reviewError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-[#2A1612] mb-1">
                      Your Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 cursor-pointer focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= (hoveredRating || reviewRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#2A1612] mb-1">
                      Review Comments
                    </label>
                    <textarea
                      name="review_text"
                      rows={3}
                      required
                      placeholder="Share what you liked about the aroma, purity, and taste..."
                      className="w-full rounded-xl border border-stone-300 p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#7B111A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="px-6 py-2.5 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#5E0D14] transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-2">
                  <p className="text-xs text-stone-600">Please sign in to your account to write a review.</p>
                  <a
                    href="/login"
                    className="inline-block px-5 py-2 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#5E0D14]"
                  >
                    Sign In
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F2]/50 border border-[#E8DFD5]/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-[#2A1612] ml-1">
                        {rev.user?.full_name || 'Verified Customer'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8C766E]">
                      {new Date(rev.created_at).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  {rev.review_text && (
                    <p className="text-xs sm:text-sm text-[#4A3831] leading-relaxed">
                      {rev.review_text}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-sm font-bold text-[#2A1612]">No reviews yet for this spice.</p>
                <p className="text-xs text-[#6E5951]">
                  Be the first to share your experience with {productName}!
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  )
}
