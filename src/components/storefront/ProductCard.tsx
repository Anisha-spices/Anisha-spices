import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

type ProductCardProps = {
  id: string
  slug: string
  name: string
  shortDescription: string | null
  featuredImage: string | null
  minPrice: number | null
}

export function ProductCard({
  id,
  slug,
  name,
  shortDescription,
  featuredImage,
  minPrice,
}: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-[#E8DFD5] hover:border-[#C89B65]/70 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* 100% Pure Ribbon Badge */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#520C12]/90 backdrop-blur-md px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold tracking-wider text-[#E5AD58] uppercase shadow-sm">
        <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span>100% Pure</span>
      </div>

      {/* Image Container with Warm Glow */}
      <div className="relative aspect-square bg-[#FAF6F2] overflow-hidden">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#FAF6F2]">
            <span className="text-stone-400 text-xs font-medium">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-5">
        <h3 className="font-serif text-sm sm:text-base lg:text-lg font-bold text-[#2A1612] group-hover:text-[#7B111A] transition-colors line-clamp-1">
          {name}
        </h3>

        {shortDescription && (
          <p className="mt-1 text-xs sm:text-sm text-[#6E5951] line-clamp-2 leading-relaxed">
            {shortDescription}
          </p>
        )}

        <div className="mt-auto pt-3 sm:pt-4 flex items-center justify-between border-t border-[#F2ECE6]">
          <div className="flex flex-col">
            <span className="text-[9px] sm:text-[11px] text-[#8C766E] uppercase tracking-wider font-semibold">
              Starting from
            </span>
            <span className="text-base sm:text-lg lg:text-xl font-extrabold text-[#7B111A]">
              {minPrice !== null ? `₹${minPrice}` : 'Check options'}
            </span>
          </div>

          {/* Action Button */}
          <div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#FAF3EB] text-[#7B111A] border border-[#C89B65]/30 group-hover:bg-[#7B111A] group-hover:text-white group-hover:scale-105 transition-all shadow-sm">
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
