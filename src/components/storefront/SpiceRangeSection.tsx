import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SPICE_ASSETS } from '@/constants/assets'

const defaultSpiceRange = [
  {
    id: 'turmeric',
    name: 'Turmeric Powder',
    image: SPICE_ASSETS.turmeric,
    tag: null,
    href: '/shop?category=turmeric',
    priceText: 'From ₹120',
  },
  {
    id: 'red-chilly',
    name: 'Red Chilly Powder',
    image: SPICE_ASSETS.redChilly,
    tag: 'Best Seller',
    href: '/shop?category=chilli',
    priceText: 'From ₹145',
  },
  {
    id: 'coriander',
    name: 'Coriander Powder',
    image: SPICE_ASSETS.coriander,
    tag: null,
    href: '/shop?category=coriander',
    priceText: 'From ₹110',
  },
  {
    id: 'cumin',
    name: 'Cumin Powder',
    image: SPICE_ASSETS.cumin,
    tag: null,
    href: '/shop?category=cumin',
    priceText: 'From ₹160',
  },
  {
    id: 'garam-masala',
    name: 'Garam Masala',
    image: SPICE_ASSETS.garamMasala,
    tag: null,
    href: '/shop?category=garam-masala',
    priceText: 'From ₹180',
  },
]

export type LiveSpiceItem = {
  id: string
  name: string
  slug: string
  image: string
  tag?: string | null
  href: string
  priceText?: string
}

export function SpiceRangeSection({
  products = [],
}: {
  products?: LiveSpiceItem[]
}) {
  const spiceRange = products.length > 0 ? products : defaultSpiceRange

  return (
    <section className="py-12 sm:py-16 bg-[#F8ECE7] relative overflow-hidden">

      {/* Decorative Corner Asset: Top Right Bay Leaves & Spice Dust (100% Transparent Blend) */}
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 pointer-events-none hidden md:block select-none mix-blend-multiply opacity-90">
        <Image
          src={SPICE_ASSETS.accents.leavesSpices}
          alt="Natural Spice Leaves Accent"
          fill
          className="object-contain object-right-top"
          sizes="224px"
        />
      </div>

      {/* Decorative Corner Asset: Bottom Left 2-3 Dried Chillies Peeking In (100% Transparent Blend) */}
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-56 sm:h-56 pointer-events-none hidden md:block select-none mix-blend-multiply opacity-90">
        <Image
          src={SPICE_ASSETS.accents.chilliesCorner}
          alt="2-3 Dried Kashmiri Chillies Peeking In"
          fill
          className="object-contain object-left-bottom"
          sizes="224px"
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12 sm:mb-14">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-4xl font-bold tracking-tight text-[#2A1612]">
            Our <span className="text-[#7B111A]">Spice</span> Range
          </h2>

          {/* Ornamental Divider with Floral Motif */}
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#C89B65]" />
            <div className="flex items-center gap-1 text-[#C89B65]">
              <span className="text-xs">✦</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7B111A]" />
              <span className="text-xs">✦</span>
            </div>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#C89B65]" />
          </div>

          <p className="text-sm sm:text-base text-[#5A433B]">
            From everyday cooking to specialty recipes, we have the perfect spice for every dish.
          </p>
        </div>

        {/* 5 Product Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {spiceRange.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-xl sm:rounded-2xl bg-white border border-[#E8DFD5] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-3 sm:p-5 transform hover:-translate-y-1.5"
            >
              {/* Best Seller Pill Badge (Red Chilly Card) */}
              {product.tag && (
                <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10">
                  <span className="inline-flex items-center rounded-full bg-[#7B111A] px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    {product.tag}
                  </span>
                </div>
              )}

              {/* Product Bowl Image */}
              <div className="relative aspect-square w-full rounded-lg sm:rounded-xl overflow-hidden bg-[#FAF6F0] mb-3 sm:mb-4 flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-108 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
              </div>

              {/* Product Title & Link */}
              <div className="text-center space-y-1.5 sm:space-y-2 mt-auto">
                <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#2A1612] group-hover:text-[#7B111A] transition-colors leading-snug line-clamp-2">
                  {product.name}
                </h3>

                <Link
                  href={product.href}
                  className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-semibold text-[#7B111A] hover:text-[#520C12] hover:gap-2 transition-all pt-0.5"
                >
                  Shop Now
                  <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Centered Button */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-[#7B111A] px-7 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#520C12] hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  )
}
