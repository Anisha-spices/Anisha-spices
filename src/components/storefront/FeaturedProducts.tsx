'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ShoppingCart, Star, Check } from 'lucide-react'
import type { Product, ProductVariant } from '@/types/database'
import { useCart } from '@/contexts/CartContext'
import { addToCart } from '@/actions/cart'
import { useRouter } from 'next/navigation'

type FeaturedProduct = Product & {
  product_variants?: ProductVariant[]
}

interface FeaturedProductsProps {
  products: FeaturedProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const { refreshCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addedSuccess, setAddedSuccess] = useState<string | null>(null)
  const router = useRouter()

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  const handleAddToCart = async (product: FeaturedProduct, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Find a valid variant to add (usually the cheapest or first active one)
    const activeVariants = product.product_variants?.filter(v => v.is_active) || []
    const targetVariant = activeVariants[0]
    
    if (!targetVariant) return
    
    setAddingToCart(product.id)
    
    const result = await addToCart(targetVariant.id, 1)
    
    if (result.success) {
      setAddedSuccess(product.id)
      refreshCart()
      setTimeout(() => setAddedSuccess(null), 2000)
    } else {
      alert(result.error || 'Failed to add to cart')
    }
    
    setAddingToCart(null)
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-[#E8B96A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 tracking-tight">Our Signature Spices</h2>
            <p className="text-stone-600 text-lg">Hand-selected favorites for your kitchen.</p>
          </div>
          
          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border border-stone-200 transition-all ${
                canScrollLeft 
                  ? 'bg-white text-stone-900 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 shadow-sm' 
                  : 'bg-stone-100 text-stone-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Previous products"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border border-stone-200 transition-all ${
                canScrollRight 
                  ? 'bg-white text-stone-900 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 shadow-sm' 
                  : 'bg-stone-100 text-stone-300 cursor-not-allowed opacity-50'
              }`}
              aria-label="Next products"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="grid grid-cols-2 gap-4 sm:gap-6 md:flex md:overflow-x-auto md:snap-x md:snap-mandatory pb-8 pt-4 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => {
              const activeVariants = product.product_variants?.filter(v => v.is_active) || []
              const price = activeVariants.length > 0 ? Math.min(...activeVariants.map(v => v.price)) : 0
              const originalPrice = activeVariants[0]?.original_price
              const hasDiscount = originalPrice && originalPrice > price

              return (
                <Link 
                  key={product.id} 
                  href={`/product/${product.slug}`}
                  className="group w-full md:w-[280px] lg:w-[300px] shrink-0 md:snap-center lg:snap-start bg-white border border-[#E8B96A] rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    {product.featured_image_url ? (
                      <Image 
                        src={product.featured_image_url} 
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                        No Image
                      </div>
                    )}
                    
                    {hasDiscount && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                        SALE
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-lg mb-1 line-clamp-1 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                    
                    <div className="flex items-center gap-1 mb-2 sm:mb-3 min-h-[20px]">
                      {product.review_count > 0 && product.average_rating > 0 ? (
                        <>
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-orange-500 text-orange-500" />
                          <span className="text-xs sm:text-sm font-medium text-stone-700">{product.average_rating.toFixed(1)}</span>
                          <span className="text-[10px] sm:text-sm text-stone-400 hidden sm:inline">({product.review_count})</span>
                        </>
                      ) : (
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Star className="w-3 h-3 text-stone-400" />
                          <span>New</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base sm:text-lg font-bold text-stone-900">₹{price}</span>
                        {hasDiscount && (
                          <span className="text-xs text-stone-400 line-through">₹{originalPrice}</span>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={addingToCart === product.id || addedSuccess === product.id || activeVariants.length === 0}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                          addedSuccess === product.id
                            ? 'bg-green-500 text-white shadow-md'
                            : 'bg-stone-900 text-white hover:bg-orange-600 hover:shadow-md hover:shadow-orange-600/30 active:scale-95'
                        }`}
                        aria-label="Add to cart"
                      >
                        {addingToCart === product.id ? (
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : addedSuccess === product.id ? (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                        ) : (
                          <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
        
        {/* Mobile Navigation Arrows Removed */}
      </div>
      
      {/* Hide scrollbar globally for webkit in this component using a style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
