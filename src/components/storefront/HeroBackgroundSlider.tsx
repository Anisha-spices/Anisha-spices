'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export type HeroSlideItem = {
  id: string
  image_url: string
  title?: string
  subtitle?: string
  button_text?: string
  button_link?: string
}

export function HeroBackgroundSlider({ slides }: { slides: HeroSlideItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  if (slides.length === 0) return null

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image_url}
            alt="Anisha Spices Artisanal Heritage"
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-[80%_center] sm:object-[72%_center] lg:object-center pointer-events-none select-none"
          />
        </div>
      ))}

      {/* Soft gradient scrim on mobile for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F8ECE7]/95 via-[#F8ECE7]/85 to-transparent sm:via-[#F8ECE7]/50 lg:hidden pointer-events-none z-20" />

      {/* Slide indicators if > 1 slide */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-2.5 py-1.5 rounded-full">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentIndex ? 'w-5 bg-[#E5AD58]' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
