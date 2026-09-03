'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  MessageCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Package,
  ArrowRight,
  Search,
  Loader2,
  Phone,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import {
  ChatbotConfig,
  ChatbotOption,
  OrderTrackingResult,
  getChatbotConfig,
  trackOrderForChatbot,
} from '@/actions/chatbot'

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ChatbotConfig | null>(null)
  const [activeView, setActiveView] = useState<'menu' | 'track_order' | 'faq'>('menu')
  const [selectedFaq, setSelectedFaq] = useState<ChatbotOption | null>(null)

  // Tracking state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchingOrder, setIsSearchingOrder] = useState(false)
  const [trackingResult, setTrackingResult] = useState<OrderTrackingResult | null>(null)

  // Load config on mount
  useEffect(() => {
    getChatbotConfig().then((cfg) => setConfig(cfg))
  }, [])

  // When opening track order view, auto-fetch latest order
  const handleOpenTrackOrder = async () => {
    setActiveView('track_order')
    setIsSearchingOrder(true)
    try {
      const res = await trackOrderForChatbot()
      setTrackingResult(res)
    } catch {
      setTrackingResult({
        found: false,
        message: 'Enter your 6-digit Order ID (e.g. AS-XXXX) or 10-digit phone number to track.',
      })
    } finally {
      setIsSearchingOrder(false)
    }
  }

  const handleSearchOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearchingOrder(true)
    try {
      const res = await trackOrderForChatbot(searchQuery)
      setTrackingResult(res)
    } catch {
      setTrackingResult({
        found: false,
        message: 'Could not fetch order. Please check the Order ID and try again.',
      })
    } finally {
      setIsSearchingOrder(false)
    }
  }

  const handleOptionClick = (opt: ChatbotOption) => {
    if (opt.type === 'track_order') {
      handleOpenTrackOrder()
    } else if (opt.type === 'whatsapp') {
      const waUrl = `https://wa.me/${config?.whatsapp_number || '919540048786'}?text=${encodeURIComponent(
        config?.whatsapp_message || 'Hi Anisha Spices, I need some help.'
      )}`
      window.open(waUrl, '_blank')
    } else {
      setSelectedFaq(opt)
      setActiveView('faq')
    }
  }

  const handleBackToMenu = () => {
    setActiveView('menu')
    setSelectedFaq(null)
  }

  if (!config) return null

  const activeOptions = config.options.filter((opt) => opt.is_active)

  return (
    <>
      {/* ─── Floating Trigger Pill ────────────────────────────────────────── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-20 lg:right-24 z-40 group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#6B1118] text-white shadow-xl shadow-[#6B1118]/30 hover:bg-[#520C12] hover:scale-105 active:scale-95 transition-all duration-300 border border-[#E5AD58]/40 cursor-pointer"
          aria-label="Need Help? Open Assistant"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-[#E5AD58]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#6B1118] animate-pulse" />
          </div>
          <span className="text-xs sm:text-sm font-semibold tracking-wide">
            Need Help?
          </span>
        </button>
      )}

      {/* ─── Chatbot Modal Window ─────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[380px] max-h-[580px] h-[520px] flex flex-col bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          
          {/* Header */}
          <div className="bg-[#6B1118] text-white p-4 flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-[#E5AD58]/60 bg-black shrink-0">
                <Image
                  src="/images/logo.jpeg"
                  alt="Anisha Spices"
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif font-bold text-sm tracking-wide text-white">
                    {config.bot_name}
                  </h3>
                  <Sparkles className="w-3.5 h-3.5 text-[#E5AD58]" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-200/90">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Online • Instant Help</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
            
            {/* VIEW 1: Main Menu */}
            {activeView === 'menu' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* Greeting Bubble */}
                <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-xs border border-stone-200/80 space-y-1">
                  <p className="font-semibold text-stone-900 text-sm">
                    {config.welcome_title}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {config.welcome_subtitle}
                  </p>
                </div>

                {/* Option Cards */}
                <div className="space-y-2">
                  {activeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionClick(opt)}
                      className="w-full text-left p-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200/80 hover:border-[#6B1118]/30 shadow-xs hover:shadow-sm transition-all duration-200 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold text-stone-800 group-hover:text-[#6B1118] transition-colors">
                          {opt.label}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#6B1118] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 2: Dynamic Live Order Tracking */}
            {activeView === 'track_order' && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B1118] hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Menu
                </button>

                {/* Search Box */}
                <form onSubmit={handleSearchOrder} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Order ID or Mobile Number"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118]"
                  />
                  <button
                    type="submit"
                    disabled={isSearchingOrder}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-[#6B1118] text-white flex items-center justify-center hover:bg-[#520C12] disabled:opacity-50 cursor-pointer"
                    title="Search Order"
                  >
                    {isSearchingOrder ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                  </button>
                </form>

                {/* Tracking Result Card */}
                {isSearchingOrder ? (
                  <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                    <Loader2 className="w-6 h-6 animate-spin text-[#6B1118] mx-auto mb-2" />
                    <p className="text-xs text-stone-500 font-medium">
                      Checking live order status from database...
                    </p>
                  </div>
                ) : trackingResult?.found ? (
                  <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          Order Number
                        </p>
                        <p className="text-sm font-bold text-stone-900 font-mono">
                          {trackingResult.order_number}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          trackingResult.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : trackingResult.order_status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {trackingResult.order_status === 'shipped'
                          ? '🚚 Dispatched'
                          : trackingResult.order_status === 'delivered'
                          ? '✅ Delivered'
                          : '⏳ In Process'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-stone-600">
                      <p>
                        <strong>Items:</strong> {trackingResult.items_summary}
                      </p>
                      <p>
                        <strong>Total:</strong> ₹{trackingResult.total_amount}{' '}
                        <span className="text-[11px] text-stone-500">
                          ({trackingResult.payment_method})
                        </span>
                      </p>
                      {trackingResult.created_at && (
                        <p className="text-[11px] text-stone-400">
                          Placed on:{' '}
                          {new Date(trackingResult.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>

                    <Link
                      href="/account/orders"
                      onClick={() => setIsOpen(false)}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#6B1118] py-2 rounded-xl hover:bg-[#520C12] transition-colors"
                    >
                      View Full Order Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center space-y-2">
                    <Package className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-600 font-medium">
                      {trackingResult?.message ||
                        'No order found. Please enter your 6-digit Order ID above.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: FAQ Answer View */}
            {activeView === 'faq' && selectedFaq && (
              <div className="space-y-3.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={handleBackToMenu}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B1118] hover:underline cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Menu
                </button>

                <div className="bg-white rounded-2xl rounded-tl-xs p-4 shadow-xs border border-stone-200 space-y-2">
                  <h4 className="font-bold text-stone-900 text-sm border-b border-stone-100 pb-2">
                    {selectedFaq.label}
                  </h4>
                  <div className="text-xs text-stone-700 leading-relaxed whitespace-pre-line space-y-1">
                    {selectedFaq.answer || 'Details not available.'}
                  </div>
                </div>

                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200/60 flex items-center justify-between text-xs">
                  <span className="text-stone-700 font-medium">Still have questions?</span>
                  <button
                    type="button"
                    onClick={() => {
                      const waUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(
                        `Hi Anisha Spices, I have a query about: ${selectedFaq.label}`
                      )}`
                      window.open(waUrl, '_blank')
                    }}
                    className="font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    Ask on WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 shrink-0">
            <button
              type="button"
              onClick={() => {
                const waUrl = `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(
                  config.whatsapp_message
                )}`
                window.open(waUrl, '_blank')
              }}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              Chat on WhatsApp
            </button>
            <span className="text-[10px] text-stone-400">Pure Spices • Instant Help</span>
          </div>
        </div>
      )}
    </>
  )
}
