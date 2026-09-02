'use client'

import Link from 'next/link'
import { Search, ChevronDown, Sparkles, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { useState } from 'react'

type Category = {
  id: string
  name: string
  slug: string
}

export function ShopSidebar({
  categories,
  categoryFilter,
  searchQuery,
}: {
  categories: Category[]
  categoryFilter: string | null
  searchQuery: string | null
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24 space-y-6">
      {/* 1. Categories Widget */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8DFD5] shadow-sm overflow-hidden">
        
        {/* Mobile Toggle Bar */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="w-full lg:hidden flex items-center justify-between p-4 bg-[#6B1118] text-white font-bold cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5AD58]" />
            <span className="text-xs sm:text-sm tracking-wider uppercase">Filter by Category</span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-white/80 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center gap-2 bg-[#6B1118] text-white px-5 py-4 border-b border-[#520C12]">
          <Sparkles className="w-4 h-4 text-[#E5AD58]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">Spice Categories</h3>
        </div>

        {/* Categories List */}
        <div
          className={`grid transition-all duration-300 ease-in-out lg:grid-rows-[1fr] ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="space-y-1 p-3 sm:p-4">
              <li>
                <Link
                  href={`/shop${searchQuery ? `?q=${searchQuery}` : ''}`}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    !categoryFilter
                      ? 'bg-[#6B1118] text-white shadow-sm'
                      : 'text-[#5A433B] hover:bg-[#FAF3EB] hover:text-[#6B1118]'
                  }`}
                >
                  <span>All Spices</span>
                  {!categoryFilter && <span className="text-[10px] text-[#E5AD58]">●</span>}
                </Link>
              </li>

              {categories.map((cat) => {
                const isActive = categoryFilter === cat.slug
                return (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}${searchQuery ? `&q=${searchQuery}` : ''}`}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#6B1118] text-white font-semibold shadow-sm'
                          : 'text-[#5A433B] hover:bg-[#FAF3EB] hover:text-[#6B1118]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isActive && <span className="text-[10px] text-[#E5AD58]">●</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Trust Assurance Widget (Desktop) */}
      <div className="hidden lg:block bg-white rounded-3xl border border-[#E8DFD5] p-5 shadow-sm space-y-4">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#7B111A]">
          Our Promise
        </h4>

        <div className="space-y-3 text-xs text-[#5A433B]">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#7B111A] shrink-0 mt-0.5" />
            <span>100% Unadulterated Purity</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-[#7B111A] shrink-0 mt-0.5" />
            <span>Express All-India Delivery</span>
          </div>
          <div className="flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 text-[#7B111A] shrink-0 mt-0.5" />
            <span>Aroma-Lock Fresh Packaging</span>
          </div>
        </div>
      </div>

    </div>
  )
}
