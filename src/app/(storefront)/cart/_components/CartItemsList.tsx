'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { removeFromCart, updateCartQuantity } from '@/actions/cart'
import { useCart } from '@/contexts/CartContext'
import type { ShippingConfig } from '@/actions/shipping'

type CartItem = {
  id: string
  quantity: number
  variant_id: string
  product_variants: {
    id: string
    variant_name: string
    price: number
    original_price: number | null
    stock_quantity: number
    is_active: boolean
    product_id: string
    products: {
      id: string
      name: string
      slug: string
      featured_image_url: string | null
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CartItemsList({
  initialItems,
  shippingConfig = { free_shipping_threshold: 500, standard_shipping_cost: 90 },
}: {
  initialItems: any[]
  shippingConfig?: ShippingConfig
}) {
  const [items, setItems] = useState<CartItem[]>(initialItems as CartItem[])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const { refreshCart } = useCart()

  const FREE_SHIPPING_THRESHOLD = shippingConfig.free_shipping_threshold
  const SHIPPING_COST = shippingConfig.standard_shipping_cost

  const handleRemove = async (id: string) => {
    setLoadingId(id)
    const result = await removeFromCart(id)
    if (result.success) {
      setItems(items.filter(i => i.id !== id))
      refreshCart()
    }
    setLoadingId(null)
  }

  const handleQuantityChange = async (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemove(id)
      return
    }
    setLoadingId(id)
    const result = await updateCartQuantity(id, newQty)
    if (result.success) {
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item))
      refreshCart()
    }
    setLoadingId(null)
  }

  const subtotal = items.reduce((sum, item) => {
    return sum + (item.product_variants.price * item.quantity)
  }, 0)

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      
      {/* Left Column: Cart Items (7 cols) */}
      <section className="lg:col-span-7">
        
        {/* Free Shipping Progress Indicator */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFD5] shadow-xs mb-6">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs sm:text-sm font-bold text-[#2A1612]">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span>🎉</span>
                  <span>Congratulations! You qualify for <strong>FREE Delivery!</strong></span>
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#7B111A]">₹{(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(0)}</strong> more to get <strong>FREE Delivery!</strong>
                </span>
              )}
            </span>
            <span className="text-xs font-bold text-[#8C7567]">
              {Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%
            </span>
          </div>

          <div className="w-full bg-[#FAF6F2] rounded-full h-2.5 overflow-hidden border border-[#E8DFD5]/60">
            <div 
              className="bg-gradient-to-r from-[#C89B65] via-[#E5AD58] to-[#7B111A] h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            />
          </div>
        </div>

        {/* Cart Item Cards */}
        <div className="space-y-4">
          {items.map((item) => {
            const variant = item.product_variants
            const product = variant.products
            const isLoading = loadingId === item.id

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-3xl border border-[#E8DFD5] p-4 sm:p-6 shadow-xs hover:shadow-md transition-all flex gap-4 sm:gap-6 items-center ${isLoading ? 'opacity-60 pointer-events-none' : ''}`}
              >
                {/* Product Photo */}
                <Link href={`/product/${product.slug}`} className="shrink-0 group">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#FAF6F2] relative border border-[#E8DFD5] group-hover:scale-105 transition-transform duration-300">
                    {product.featured_image_url ? (
                      <Image
                        src={product.featured_image_url}
                        alt={product.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#8C7567]">
                        <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 opacity-40" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info & Quantity */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="text-sm sm:text-base font-bold text-[#2A1612] truncate hover:text-[#7B111A] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6F2] border border-[#E8DFD5] text-[11px] font-bold text-[#8C7567]">
                          {variant.variant_name}
                        </span>
                        <span className="text-xs text-emerald-700 font-medium">In Stock</span>
                      </div>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Remove spice"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  {/* Pricing and Stepper Row */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F2E8DC]">
                    
                    {/* Quantity Pill Stepper */}
                    <div className="inline-flex items-center rounded-full bg-[#FAF6F2] border border-[#E8DFD5] p-1 shadow-inner">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white text-[#2A1612] hover:bg-[#7B111A] hover:text-white transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      
                      <span className="w-8 sm:w-10 text-center font-extrabold text-[#2A1612] text-xs sm:text-sm">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={isLoading || item.quantity >= variant.stock_quantity}
                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white text-[#2A1612] hover:bg-[#7B111A] hover:text-white transition-colors disabled:opacity-40 shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price Calculation */}
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-extrabold text-[#7B111A]">
                        ₹{(variant.price * item.quantity).toFixed(0)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#8C7567]">₹{variant.price} each</p>
                      )}
                    </div>

                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Back Link */}
        <div className="mt-6">
          <Link 
            href="/shop" 
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#7B111A] hover:text-[#520C12] transition-colors"
          >
            ← Add more freshly ground spices
          </Link>
        </div>
      </section>

      {/* Right Column: Order Summary (5 cols) */}
      <section className="mt-8 lg:mt-0 lg:col-span-5">
        <div className="bg-white rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs sticky top-28 space-y-6">
          
          <div className="border-b border-[#E8DFD5] pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">
              Order Summary
            </h2>
            <p className="text-xs text-[#8C7567] mt-0.5">
              Review your cart before secure checkout
            </p>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8C7567]">Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} packs)</span>
              <span className="font-bold text-[#2A1612]">₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-[#8C7567]">Delivery Charges</span>
              {shipping === 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-extrabold text-emerald-700 uppercase tracking-wide">
                  FREE
                </span>
              ) : (
                <span className="font-bold text-[#2A1612]">₹{shipping.toFixed(2)}</span>
              )}
            </div>

            <div className="border-t border-[#E8DFD5] pt-4 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-lg font-bold text-[#2A1612] block">
                  Grand Total
                </span>
                <span className="text-[10px] text-[#8C7567]">Inclusive of all GST & taxes</span>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#7B111A]">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout CTA Button */}
          <Link 
            href="/checkout"
            className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#7B111A] to-[#8A131E] text-white font-bold rounded-full shadow-lg shadow-[#7B111A]/25 hover:shadow-xl hover:from-[#650E15] hover:to-[#7B111A] transition-all transform hover:-translate-y-0.5 text-center text-sm sm:text-base active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Luxury Brand Trust Badges in Cart */}
          <div className="pt-4 border-t border-[#E8DFD5] grid grid-cols-2 gap-3 text-[11px] text-[#8C7567]">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF6F2]">
              <span className="text-base">🛡️</span>
              <span className="font-medium leading-tight">100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#FAF6F2]">
              <span className="text-base">🌿</span>
              <span className="font-medium leading-tight">Aroma-Lock Fresh Pack</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
