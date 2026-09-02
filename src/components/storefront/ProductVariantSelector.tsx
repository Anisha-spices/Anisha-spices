'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Truck, Package, MapPin, Check } from 'lucide-react'
import { addToCart } from '@/actions/cart'
import { useCart } from '@/contexts/CartContext'

type Variant = {
  id: string
  variant_name: string
  price: number
  original_price: number | null
  stock_quantity: number
  is_active: boolean
}

export function ProductVariantSelector({ variants }: { variants: Variant[] }) {
  // Deduplicate by variant_name to ensure clean UI
  const uniqueMap = new Map<string, Variant>()
  variants
    .filter(v => v.is_active && v.stock_quantity > 0)
    .forEach(v => {
      if (!uniqueMap.has(v.variant_name)) {
        uniqueMap.set(v.variant_name, v)
      }
    })

  const activeVariants = Array.from(uniqueMap.values())
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(activeVariants.length > 0 ? activeVariants[0] : null)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isBuying, setIsBuying] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const [pincode, setPincode] = useState('')
  const [pincodeResult, setPincodeResult] = useState<{
    status: 'idle' | 'success' | 'invalid'
    city?: string
    time?: string
    cod?: boolean
  }>({ status: 'idle' })
  const router = useRouter()
  const { refreshCart } = useCart()

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = pincode.trim()
    if (!/^\d{6}$/.test(clean)) {
      setPincodeResult({ status: 'invalid' })
      return
    }

    // Metro check (Delhi 11xxxx, Mumbai 40xxxx, Kolkata 70xxxx, Chennai 60xxxx, Bengaluru 56xxxx, Hyderabad 50xxxx)
    const isMetro = /^(11|40|70|60|56|50)/.test(clean)
    
    setPincodeResult({
      status: 'success',
      city: isMetro ? 'Metro Area' : 'Standard Delivery',
      time: isMetro ? '2–3 Business Days' : '3–5 Business Days',
      cod: true,
    })
  }

  if (activeVariants.length === 0) {
    return (
      <div className="py-4">
        <span className="text-xl font-bold text-gray-500">Out of Stock</span>
        <button disabled className="mt-6 w-full rounded-full bg-gray-300 py-3.5 px-8 text-white font-bold cursor-not-allowed">
          Sold Out
        </button>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    setIsAdding(true)
    
    const result = await addToCart(selectedVariant.id, quantity)
    
    if (result.success) {
      setAddedSuccess(true)
      refreshCart()
      setTimeout(() => setAddedSuccess(false), 2000)
    } else {
      alert(result.error || 'Failed to add to cart')
    }
    
    setIsAdding(false)
  }

  const handleBuyNow = async () => {
    if (!selectedVariant) return
    setIsBuying(true)
    
    const result = await addToCart(selectedVariant.id, quantity)
    
    if (result.success) {
      refreshCart()
      router.push('/checkout')
    } else {
      alert(result.error || 'Failed to add to cart')
      setIsBuying(false)
    }
  }

  return (
    <div className="mt-6 sm:mt-8">
      {/* Price & Savings Display */}
      <div className="flex flex-wrap items-baseline gap-3 mb-6 p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5]">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-extrabold text-[#7B111A]">₹{selectedVariant?.price}</span>
          {selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price && (
            <span className="text-lg text-stone-400 line-through">₹{selectedVariant.original_price}</span>
          )}
        </div>

        {selectedVariant?.original_price && selectedVariant.original_price > selectedVariant.price && (
          <span className="px-2.5 py-0.5 rounded-full bg-[#E5AD58]/20 border border-[#E5AD58]/40 text-xs font-bold text-[#8A5A12] uppercase tracking-wide">
            Save ₹{selectedVariant.original_price - selectedVariant.price} ({Math.round(((selectedVariant.original_price - selectedVariant.price) / selectedVariant.original_price) * 100)}% OFF)
          </span>
        )}
        <span className="text-xs text-stone-500 ml-auto self-center font-medium">Inclusive of all taxes</span>
      </div>

      {/* Variant Selection (Packet Sizes) */}
      {activeVariants.length > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C7567]">Select Pack Size</span>
            <span className="text-xs font-semibold text-[#7B111A]">Selected: {selectedVariant?.variant_name}</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {activeVariants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  type="button"
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-[#7B111A] bg-[#7B111A]/5 ring-2 ring-[#7B111A]/20 shadow-xs'
                      : 'border-[#E8DFD5] bg-white hover:border-[#C89B65] text-[#2A1612]'
                  }`}
                >
                  <p className={`text-xs sm:text-sm font-bold ${isSelected ? 'text-[#7B111A]' : 'text-[#2A1612]'}`}>
                    {variant.variant_name}
                  </p>
                  <p className="text-xs font-semibold text-[#8C7567] mt-0.5">
                    ₹{variant.price}
                  </p>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#7B111A] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & High-Conversion Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#E8DFD5] rounded-full bg-white h-12 shrink-0 shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 text-[#5A433B] hover:text-[#7B111A] transition-colors h-full rounded-l-full cursor-pointer font-bold text-base active:scale-95"
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#2A1612]">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(selectedVariant?.stock_quantity || 1, quantity + 1))}
              className="px-4 text-[#5A433B] hover:text-[#7B111A] transition-colors h-full rounded-r-full cursor-pointer font-bold text-base active:scale-95"
            >
              +
            </button>
          </div>
          
          {/* Add To Cart */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || isBuying || addedSuccess}
            className={`flex-1 font-bold rounded-full h-12 transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              addedSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-white border-2 border-[#7B111A] text-[#7B111A] hover:bg-[#7B111A]/5 active:scale-[0.98]'
            }`}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-[#7B111A]/30 border-t-[#7B111A] rounded-full animate-spin" />
            ) : addedSuccess ? (
              <>
                <Check className="w-5 h-5" />
                Added to Cart!
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>

        {/* Instant Buy Now Button */}
        <button 
          onClick={handleBuyNow}
          disabled={isAdding || isBuying || addedSuccess}
          className="w-full font-bold rounded-full h-13 bg-gradient-to-r from-[#7B111A] to-[#9E1B24] text-white hover:from-[#5E0D14] hover:to-[#7B111A] shadow-md shadow-[#7B111A]/20 active:scale-[0.99] transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-base"
        >
          {isBuying ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Buy Now — Express Checkout'
          )}
        </button>
      </div>

      {/* 📍 Pincode Delivery & COD Availability Checker */}
      <div className="mt-6 p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5]">
        <div className="flex items-center gap-2 mb-2.5">
          <MapPin className="w-4 h-4 text-[#7B111A]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2A1612]">
            Check Delivery & COD Availability
          </span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              setPincode(e.target.value.replace(/\D/g, ''))
              if (pincodeResult.status !== 'idle') setPincodeResult({ status: 'idle' })
            }}
            placeholder="Enter 6-digit pincode (e.g. 110001)"
            className="flex-1 px-4 py-2 text-xs rounded-xl bg-white border border-[#E8DFD5] text-[#2A1612] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7B111A]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#7B111A] hover:bg-[#520C12] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Check
          </button>
        </form>

        {pincodeResult.status === 'success' && (
          <div className="mt-3 pt-2.5 border-t border-[#E8DFD5] text-xs space-y-1 animate-in fade-in duration-200">
            <p className="font-bold text-emerald-800 flex items-center gap-1.5">
              <span>✅</span>
              <span>Delivery available in {pincodeResult.time}</span>
            </p>
            <p className="text-[#5A433B] flex items-center gap-1.5">
              <span>💵</span>
              <span>Cash on Delivery (COD) Available</span>
            </p>
          </div>
        )}

        {pincodeResult.status === 'invalid' && (
          <p className="mt-2.5 text-xs font-medium text-rose-600 animate-in fade-in duration-200">
            ⚠️ Please enter a valid 6-digit Indian delivery pincode.
          </p>
        )}
      </div>
      
      {/* Stock Low Indicator */}
      {selectedVariant?.stock_quantity && selectedVariant.stock_quantity < 15 && (
        <p className="mt-3 text-xs font-semibold text-amber-700 text-center flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Only {selectedVariant.stock_quantity} packs left in current batch!
        </p>
      )}

      {/* Luxury Trust Assurances */}
      <div className="mt-8 pt-6 border-t border-[#E8DFD5] grid grid-cols-2 gap-3 sm:gap-4">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E8DFD5]/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7B111A]/10 text-[#7B111A]">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#2A1612]">100% Authentic</span>
            <span className="block text-[11px] text-[#8C7567]">Pure & Unadulterated</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E8DFD5]/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7B111A]/10 text-[#7B111A]">
            <Truck className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#2A1612]">Fast Dispatch</span>
            <span className="block text-[11px] text-[#8C7567]">All-India Doorstep Delivery</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E8DFD5]/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7B111A]/10 text-[#7B111A]">
            <Package className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#2A1612]">Free Shipping</span>
            <span className="block text-[11px] text-[#8C7567]">On orders above ₹500</span>
          </div>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E8DFD5]/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7B111A]/10 text-[#7B111A]">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-bold text-[#2A1612]">Farm Fresh</span>
            <span className="block text-[11px] text-[#8C7567]">Origin Verified Source</span>
          </div>
        </div>
      </div>
    </div>
  )
}
