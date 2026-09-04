'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Sparkles, Search, ShoppingBag, X, ArrowRight, Loader2, Package, User, LayoutGrid } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const POPULAR_SEARCHES = [
  'Red Chilly Powder',
  'Turmeric Powder',
  'Garam Masala',
  'Coriander Powder',
  'Cumin Powder',
]

type CategoryItem = {
  name: string
  slug: string
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { name: 'Ground Spices', slug: 'ground-spices' },
  { name: 'Blended Spices', slug: 'blended-spices' },
  { name: 'Whole Spices (Khade Masale)', slug: 'whole-spices' },
]

export function MobileBottomBar({
  categories = [],
}: {
  categories?: CategoryItem[]
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount } = useCart()
  const [searchOpen, setSearchOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const resolvedCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES

  // Live auto-complete search effect for mobile modal
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (trimmed.length < 2) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        const json = await res.json()
        setSearchResults(json.results || [])
      } catch {
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Hide on admin routes
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const handleQuickTagClick = (tag: string) => {
    router.push(`/shop?q=${encodeURIComponent(tag)}`)
    setSearchOpen(false)
  }

  const handleScrollToSection = (sectionId: string) => {
    if (pathname === '/') {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', `/#${sectionId}`)
        return
      }
    }
    router.push(`/#${sectionId}`)
  }

  const isHome = pathname === '/'
  const isShop = pathname === '/shop' || pathname?.startsWith('/product')
  const isCart = pathname === '/cart'

  return (
    <>
      {/* Search Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative bg-[#FAF6F2] rounded-t-3xl p-5 shadow-2xl border-t border-[#E8DCCB] max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE5D5]">
              <div className="flex items-center gap-2">
                <span className="text-lg">🌶️</span>
                <h3 className="font-serif text-lg font-bold text-[#2A1612]">
                  Find Your Spice
                </h3>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6B5A52] flex items-center justify-center border border-[#E5D5C5] shadow-xs active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="my-4">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-[#8C7567]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search haldi, mirch, garam masala..."
                  className="w-full pl-11 pr-20 py-3.5 rounded-full bg-white border border-[#E5D5C5] text-sm text-[#2A1612] placeholder-[#A0887A] focus:outline-none focus:ring-2 focus:ring-[#80121A]/30 shadow-inner"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 rounded-full bg-[#80121A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span>Go</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </form>

            {/* Live Search Suggestions or Popular Searches */}
            {searchQuery.trim().length >= 2 ? (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C7567]">
                    Matching Spices ({searchResults.length})
                  </span>
                  {isSearching && <Loader2 className="w-3.5 h-3.5 text-[#80121A] animate-spin" />}
                </div>

                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-5 text-center text-xs text-[#8C7567] bg-white rounded-2xl border border-[#E8DACB]">
                    No spices found matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => {
                          setSearchOpen(false)
                          setSearchQuery('')
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-[#E8DACB] hover:border-[#80121A]/40 transition-colors active:scale-[0.99]"
                      >
                        <div className="w-11 h-11 relative rounded-xl overflow-hidden bg-[#FAF3EB] shrink-0 border border-[#E8DFD5]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#2A1612] truncate">
                            {item.name}
                          </h4>
                          {item.price && (
                            <p className="text-[11px] font-bold text-[#80121A]">
                              From ₹{item.price}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Popular Searches */
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C7567] block mb-2.5">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleQuickTagClick(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#FFE8E8] text-[#4A382D] hover:text-[#80121A] border border-[#E8DACB] hover:border-[#80121A]/40 text-xs font-medium transition-colors active:scale-95 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Categories Overlay Modal */}
      {categoriesOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end lg:hidden animate-fade-in">
          <div
            className="absolute inset-0"
            onClick={() => setCategoriesOpen(false)}
          />
          <div className="relative bg-[#FAF6F2] rounded-t-3xl p-5 shadow-2xl border-t border-[#E8DCCB] max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE5D5]">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌿</span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#2A1612]">
                    Spice Categories
                  </h3>
                  <p className="text-[11px] text-[#8C766E]">
                    Explore authentic Indian spices by type
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCategoriesOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-[#6B5A52] flex items-center justify-center border border-[#E5D5C5] shadow-xs active:scale-95 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Categories List */}
            <div className="py-4 space-y-2.5">
              <Link
                href="/shop"
                onClick={() => setCategoriesOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#6B1118]/40 shadow-xs active:scale-[0.99] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5] flex items-center justify-center text-lg">
                    ✨
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#2A1612] block">All Spices</span>
                    <span className="text-xs text-[#8C766E]">View our complete spice catalogue</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-stone-400" />
              </Link>

              {resolvedCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#E8DFD5] hover:border-[#6B1118]/40 shadow-xs active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-lg">
                      {cat.slug.includes('ground') ? '🟡' : cat.slug.includes('blend') ? '🥘' : '🌿'}
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#2A1612] block">{cat.name}</span>
                      <span className="text-xs text-[#8C766E]">
                        {cat.slug.includes('ground')
                          ? 'Pure cold-ground turmeric, mirch & cumin'
                          : cat.slug.includes('blend')
                          ? 'Garam masala & signature royal blends'
                          : 'Aromatic whole cardamom, cloves & pepper'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Glassmorphic Bottom Dock */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-3 inset-x-3 z-40 lg:hidden"
      >
        <div className="bg-[#240A0D]/90 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2.5 py-2 flex items-center justify-around">
          
          {/* 1. Home */}
          <Link
            href="/"
            onClick={() => {
              if (isHome) {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              isHome && !searchOpen && !categoriesOpen
                ? 'text-[#F5D0A9] bg-white/10'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Home</span>
          </Link>

          {/* 2. Categories */}
          <button
            type="button"
            onClick={() => {
              setCategoriesOpen(!categoriesOpen)
              setSearchOpen(false)
            }}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer ${
              categoriesOpen
                ? 'text-[#F5D0A9] bg-white/10'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Categories</span>
          </button>

          {/* 3. Products */}
          <Link
            href="/shop"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              isShop && !searchOpen && !categoriesOpen
                ? 'text-[#F5D0A9] bg-white/10'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Products</span>
          </Link>

          {/* 4. Cart */}
          <Link
            href="/cart"
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              isCart
                ? 'text-[#F5D0A9] bg-white/10'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#E53E3E] text-white text-[9px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium tracking-tight">Cart</span>
          </Link>

          {/* 5. Profile Tab */}
          <Link
            href="/account"
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 active:scale-90 ${
              pathname?.startsWith('/account') || pathname === '/login'
                ? 'text-[#F5D0A9] bg-white/10'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium tracking-tight">Profile</span>
          </Link>

        </div>
      </nav>
    </>
  )
}
