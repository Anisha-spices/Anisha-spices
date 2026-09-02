import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SPICE_ASSETS } from '@/constants/assets'

export function BottomBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#5B0910] text-white min-h-[320px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
      
      {/* Background Flatlay Image with seamless left gradient blend */}
      <div className="absolute inset-0 z-0">
        <Image
          src={SPICE_ASSETS.bottomBanner}
          alt="Bring Home The Taste of Purity — Indian Spices Flatlay"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[85%_center] sm:object-[80%_center] lg:object-center pointer-events-none select-none"
        />
        {/* Seamless gradient overlay on left for typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#5B0910] via-[#5B0910]/90 to-transparent sm:via-[#5B0910]/50 lg:via-[#5B0910]/25 lg:to-transparent pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Column: Heading, Subtitle & White Pill CTA Button */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-4 sm:space-y-5 text-left">
            <h2 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-[1.15] drop-shadow-sm">
              Bring Home The<br />
              Taste of <span className="text-[#D4A373]">Purity</span>
            </h2>

            <p className="text-xs sm:text-base text-stone-200/95 leading-relaxed font-normal max-w-md drop-shadow-sm">
              Cook healthier, live better with Anisha Spices.
            </p>

            <div className="pt-1 sm:pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-base font-bold text-[#5B0910] shadow-xl hover:bg-[#FAF6F0] hover:text-[#3D050A] hover:gap-3 transition-all transform hover:-translate-y-0.5"
              >
                Shop Now
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#5B0910]" />
              </Link>
            </div>
          </div>

          {/* Right Column spacer letting background spices show through seamlessly */}
          <div className="hidden lg:block lg:col-span-6 xl:col-span-7" />

        </div>
      </div>
    </section>
  )
}
