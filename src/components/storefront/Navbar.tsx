'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, User, Menu, X, ChevronDown, Search, ArrowRight, Loader2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

type NavLink = {
  name: string
  href: string
  hasDropdown?: boolean
  subItems?: { name: string; href: string }[]
}

const defaultCategoryItems = [
  { name: 'All Spices', href: '/shop' },
  { name: 'Ground Spices', href: '/shop?category=ground-spices' },
  { name: 'Blended Spices', href: '/shop?category=blended-spices' },
  { name: 'Whole Spices (Khade Masale)', href: '/shop?category=whole-spices' },
]

export function Navbar({
  isLoggedIn = false,
  categories = [],
}: {
  isLoggedIn?: boolean
  categories?: { name: string; slug: string }[]
}) {
  const dynamicSubItems = categories.length > 0
    ? [
        { name: 'All Spices', href: '/shop' },
        ...categories.map((c) => ({ name: c.name, href: `/shop?category=${c.slug}` })),
      ]
    : defaultCategoryItems

  const navLinks: NavLink[] = [
    { name: 'Home', href: '/' },
    {
      name: 'Categories',
      href: '/shop',
      hasDropdown: true,
      subItems: dynamicSubItems,
    },
    { name: 'All Spices', href: '/shop' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]
  const { itemCount } = useCart()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false)
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Live Search Suggestion State
  const [desktopSearchQuery, setDesktopSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Live search debounce effect
  useEffect(() => {
    const trimmed = desktopSearchQuery.trim()
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
  }, [desktopSearchQuery])

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Scroll to top when clicking Home / Brand Logo
  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setCategoriesDropdownOpen(false)
  }, [pathname])

  // Body scroll lock & ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false)
    }
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mobileMenuOpen])

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#6B1118] text-white shadow-lg border-b border-[#520C12] transition-all">
        <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">

            {/* Brand Logo (Full Left on Mobile, Left on Desktop) */}
            <div className="flex items-center">
              <Link href="/" onClick={handleHomeClick} className="group flex items-center" aria-label="Anisha Spices">
                {/* Official Brand Logo */}
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-[68px] lg:h-[68px] rounded-full overflow-hidden border border-[#E5AD58]/60 group-hover:scale-105 transition-transform shadow-md shrink-0 bg-black">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Anisha Spices Logo"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 48px, (max-width: 1024px) 64px, 68px"
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex lg:items-center lg:gap-7">
              {navLinks.map((link) => {
                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.name}
                      className="relative py-2"
                      ref={dropdownRef}
                      onMouseEnter={() => setCategoriesDropdownOpen(true)}
                      onMouseLeave={() => setCategoriesDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                        className="flex items-center gap-1.5 text-[15px] font-medium text-stone-100 hover:text-[#E5AD58] transition-colors py-1 cursor-pointer"
                      >
                        <span>{link.name}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            categoriesDropdownOpen ? 'rotate-180 text-[#E5AD58]' : 'text-stone-300'
                          }`}
                        />
                      </button>
                      {categoriesDropdownOpen && (
                        <div className="absolute top-full left-0 mt-0.5 w-60 rounded-2xl bg-white text-[#2A1612] shadow-2xl border border-[#E8DFD5] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                          <div className="px-4 py-2 border-b border-[#F4ECE4] bg-[#FAF6F2]/80">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C766E]">
                              Spice Categories
                            </span>
                          </div>
                          {link.subItems?.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setCategoriesDropdownOpen(false)}
                              className="flex items-center justify-between px-4 py-2.5 text-sm text-[#2A1612] hover:bg-[#FAF6F2] hover:text-[#6B1118] font-medium transition-colors group/item"
                            >
                              <span>{subItem.name}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover/item:text-[#6B1118] group-hover/item:translate-x-0.5 transition-all" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '/') {
                        handleHomeClick(e)
                      } else if (link.href.startsWith('/#')) {
                        const targetId = link.href.replace('/#', '')
                        const el = document.getElementById(targetId)
                        if (el) {
                          e.preventDefault()
                          el.scrollIntoView({ behavior: 'smooth' })
                          window.history.replaceState(null, '', `/#${targetId}`)
                        }
                      }
                    }}
                    className="text-[15px] font-medium text-stone-100 hover:text-[#E5AD58] transition-colors"
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Right Side: Desktop Search & Actions + Mobile Hamburger */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Desktop Search Bar with Live Auto-complete Suggestions (Hidden on Mobile) */}
              <div className="hidden lg:block relative" ref={searchContainerRef}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (desktopSearchQuery.trim()) {
                      setShowSuggestions(false)
                      router.push(`/shop?q=${encodeURIComponent(desktopSearchQuery.trim())}`)
                    }
                  }}
                  className="flex items-center relative group"
                >
                  <input
                    name="q"
                    type="text"
                    autoComplete="off"
                    value={desktopSearchQuery}
                    onChange={(e) => {
                      setDesktopSearchQuery(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search pure spices, blends..."
                    className="w-56 xl:w-72 pl-10 pr-9 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/25 text-sm text-white placeholder-stone-300/80 focus:outline-none focus:ring-2 focus:ring-[#E5AD58] focus:border-[#E5AD58] focus:bg-white/20 focus:w-80 transition-all shadow-inner"
                  />
                  <Search className="w-4 h-4 text-[#E5AD58] group-focus-within:text-white absolute left-3.5 pointer-events-none transition-colors" />
                  {isSearching ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#E5AD58] animate-spin absolute right-3.5" />
                  ) : desktopSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setDesktopSearchQuery('')
                        setSearchResults([])
                      }}
                      className="absolute right-3 text-stone-300 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Floating Live Suggestions Dropdown */}
                {showSuggestions && desktopSearchQuery.trim().length >= 2 && (
                  <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white text-[#2A1612] shadow-2xl border border-[#E8DFD5] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 bg-[#FAF6F2] border-b border-[#E8DFD5] flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#8C7567]">
                        Products ({searchResults.length})
                      </span>
                      <span className="text-[11px] text-[#A0887A]">Press enter to view all</span>
                    </div>

                    {searchResults.length === 0 && !isSearching ? (
                      <div className="p-6 text-center text-sm text-[#8C7567]">
                        No spices found for &ldquo;<span className="font-bold text-[#2A1612]">{desktopSearchQuery}</span>&rdquo;
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F2E8DC] max-h-80 overflow-y-auto">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product/${item.slug}`}
                            onClick={() => setShowSuggestions(false)}
                            className="flex items-center gap-3 p-3 hover:bg-[#FAF6F2] transition-colors group"
                          >
                            <div className="w-11 h-11 relative rounded-xl overflow-hidden bg-[#FAF3EB] shrink-0 border border-[#E8DFD5]">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="44px"
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-semibold text-[#2A1612] truncate group-hover:text-[#6B1118] transition-colors">
                                {item.name}
                              </h4>
                              {item.price && (
                                <p className="text-[11px] font-bold text-[#6B1118]">
                                  From ₹{item.price}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#6B1118] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <Link
                        href={`/shop?q=${encodeURIComponent(desktopSearchQuery.trim())}`}
                        onClick={() => setShowSuggestions(false)}
                        className="block text-center py-2.5 bg-[#FAF6F2] hover:bg-[#F2E8DC] text-xs font-bold text-[#6B1118] border-t border-[#E8DFD5] transition-colors"
                      >
                        View all results for &ldquo;{desktopSearchQuery}&rdquo; →
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop "Shop Now" Pill Button (Left of Cart) */}
              <Link
                href="/shop"
                className="hidden lg:inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#6B1118] shadow-md hover:bg-[#FAF6F0] hover:text-[#520C12] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Shop Now
              </Link>

              {/* Cart Icon (Middle - Left of Profile) */}
              <Link
                href="/cart"
                className="relative p-2 text-stone-100 hover:text-[#E5AD58] transition-colors hidden lg:block"
                aria-label="Shopping Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E5AD58] px-1 text-[10px] font-bold text-[#2A1612] shadow-sm">
                  {itemCount}
                </span>
              </Link>

              {/* Account Link (Far Right) */}
              <Link
                href={isLoggedIn ? '/account' : '/login'}
                className="p-2 text-stone-100 hover:text-[#E5AD58] transition-colors rounded-full hover:bg-white/10 hidden lg:block"
                title={isLoggedIn ? 'Account' : 'Sign In'}
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Mobile Right: Quick Search Button & Hamburger Menu */}
              <div className="flex items-center gap-1 lg:hidden">
                <button
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(true)
                    setShowSuggestions(true)
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:text-[#E5AD58] hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
                  aria-label="Search Spices"
                >
                  <Search className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white hover:text-[#E5AD58] hover:bg-white/10 active:scale-90 transition-all focus:outline-none cursor-pointer"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Live Search Modal (Full Desktop-Grade Search Experience) */}
      {mounted && mobileSearchOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileSearchOpen(false)}
          />

          <div className="fixed top-0 inset-x-0 bg-[#520C12] text-white p-4 shadow-2xl z-[100000] border-b border-white/15">
            <div className="flex items-center gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (desktopSearchQuery.trim()) {
                    setMobileSearchOpen(false)
                    router.push(`/shop?q=${encodeURIComponent(desktopSearchQuery.trim())}`)
                  }
                }}
                className="flex-1 relative flex items-center"
              >
                <Search className="w-4 h-4 text-[#E5AD58] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  autoComplete="off"
                  value={desktopSearchQuery}
                  onChange={(e) => {
                    setDesktopSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  placeholder="Search pure spices, blends..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-full bg-white/10 border border-white/25 text-sm text-white placeholder-stone-300/80 focus:outline-none focus:ring-2 focus:ring-[#E5AD58] focus:bg-white/20"
                />
                {isSearching ? (
                  <Loader2 className="w-4 h-4 text-[#E5AD58] animate-spin absolute right-3" />
                ) : desktopSearchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setDesktopSearchQuery('')
                      setSearchResults([])
                    }}
                    className="absolute right-3 text-stone-300 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => setMobileSearchOpen(false)}
                className="p-2 text-white/80 hover:text-white text-xs font-semibold uppercase tracking-wider"
              >
                Cancel
              </button>
            </div>

            {/* Live Search Suggestions Dropdown */}
            {desktopSearchQuery.trim().length >= 2 && (
              <div className="mt-3 bg-white rounded-2xl text-[#2A1612] overflow-hidden shadow-xl max-h-72 overflow-y-auto">
                {searchResults.length === 0 && !isSearching ? (
                  <div className="p-4 text-center text-xs text-[#8C7567]">
                    No spices found for &ldquo;<strong>{desktopSearchQuery}</strong>&rdquo;
                  </div>
                ) : (
                  <div className="divide-y divide-[#F2E8DC]">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/product/${item.slug}`}
                        onClick={() => {
                          setMobileSearchOpen(false)
                          setDesktopSearchQuery('')
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-[#FAF6F2] transition-colors"
                      >
                        <div className="w-10 h-10 relative rounded-xl overflow-hidden bg-[#FAF3EB] shrink-0 border border-[#E8DFD5]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#2A1612] truncate">
                            {item.name}
                          </h4>
                          {item.price && (
                            <p className="text-[11px] font-bold text-[#7B111A]">
                              From ₹{item.price}
                            </p>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-300 shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Render Mobile Drawer via Portal if mounted and open */}
      {mounted && mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[99999] lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content (Slides in from the Right) */}
          <div className="fixed inset-y-0 right-0 z-[100000] w-[85%] max-w-xs bg-[#520C12] text-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-250 ease-out">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#E5AD58]/50 shrink-0 bg-black">
                    <Image
                      src="/images/logo.jpeg"
                      alt="Anisha Spices Logo"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="font-serif text-lg font-bold text-white">Anisha Spices</span>
                </div>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:text-[#E5AD58] hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-6 flex flex-col space-y-2">
                {/* Home */}
                <Link
                  href="/"
                  onClick={(e) => {
                    setMobileMenuOpen(false)
                    handleHomeClick(e)
                  }}
                  className="block text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2"
                >
                  Home
                </Link>

                {/* Categories Collapsible Accordion */}
                <div className="border-y border-white/10 py-1">
                  <button
                    type="button"
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2 cursor-pointer"
                  >
                    <span>Categories</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-300 transition-transform duration-200 ${
                        mobileCategoriesOpen ? 'rotate-180 text-[#E5AD58]' : ''
                      }`}
                    />
                  </button>
                  {mobileCategoriesOpen && (
                    <div className="pl-3 pr-1 pb-2 space-y-1.5 animate-in fade-in duration-150">
                      {dynamicSubItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm text-stone-300 hover:text-[#E5AD58] hover:bg-white/5 transition-colors"
                        >
                          <span>{subItem.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Spices */}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2"
                >
                  All Spices
                </Link>

                {/* Your Orders */}
                <Link
                  href="/account/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2"
                >
                  Your Orders
                </Link>

                {/* About Us */}
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2"
                >
                  About Us
                </Link>

                {/* Contact */}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-base font-semibold text-stone-100 hover:text-[#E5AD58] transition-colors py-2"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Bottom CTA Buttons */}
            <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
              <Link
                href="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center rounded-full bg-[#E5AD58] py-3 text-sm font-bold text-[#2A1612] shadow-md hover:bg-[#d99f47] transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href={isLoggedIn ? '/account' : '/login'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full block text-center rounded-full border border-white/40 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {isLoggedIn ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
