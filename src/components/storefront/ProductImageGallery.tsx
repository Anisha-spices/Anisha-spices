'use client'

import { useState } from 'react'
import Image from 'next/image'

type ProductImageGalleryProps = {
  images: { id: string; image_url: string; sort_order: number }[]
  featuredImage: string | null
}

export function ProductImageGallery({ images, featuredImage }: ProductImageGalleryProps) {
  // If there are no uploaded images, but there is a featured image (e.g. from the old basic URL), 
  // we just use that as a single item array.
  const allImages = images.length > 0 
    ? [...images].sort((a, b) => a.sort_order - b.sort_order).map(i => i.image_url)
    : featuredImage ? [featuredImage] : []

  const [activeImage, setActiveImage] = useState<string | null>(allImages.length > 0 ? allImages[0] : null)

  if (allImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-2xl flex items-center justify-center border border-border">
        <span className="text-gray-400 font-medium">No Image Available</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:w-20 flex-shrink-0 hide-scrollbar pb-1 sm:pb-0">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`relative aspect-square w-16 sm:w-full flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                activeImage === img
                  ? 'border-[#7B111A] ring-2 ring-[#C89B65]/40 shadow-md scale-95'
                  : 'border-[#E8DFD5] hover:border-[#C89B65] opacity-75 hover:opacity-100 bg-white'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-gradient-to-b from-[#FAF6F2] to-[#F2E8DC] border border-[#E8DFD5] shadow-lg group">
        {activeImage && (
          <Image
            src={activeImage}
            alt="Product Image"
            fill
            priority
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        )}
        
        {/* Subtle Luxury Corner Badges */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md text-[11px] font-bold text-[#7B111A] border border-[#E8DFD5] shadow-xs uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C89B65]" />
            100% Pure
          </span>
        </div>
      </div>
    </div>
  )
}
