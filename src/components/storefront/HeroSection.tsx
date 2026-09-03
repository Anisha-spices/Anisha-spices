import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { SPICE_ASSETS } from '@/constants/assets'
import { getHeroSlides } from '@/actions/admin/hero'

export async function HeroSection() {
  let heroData = null
  try {
    const slides = await getHeroSlides()
    const activeSlide = slides.find((s: any) => s.is_active) || slides[0]
    if (activeSlide) {
      heroData = activeSlide
    }
  } catch {
    // Graceful fallback
  }

  const title = heroData?.title || 'Pure Spice. Real Taste. Trusted Every Time.'
  const subtitle = heroData?.subtitle || "Anisha Spices brings the richness of India's finest spices to your kitchen. Pure, natural & full of flavor."
  const buttonText = heroData?.button_text || 'Shop Now'
  const buttonLink = heroData?.button_link || '/shop'
  const backgroundImage = heroData?.image_url || SPICE_ASSETS.heroPouch

  return (
    <section className="relative overflow-hidden bg-[#F8ECE7] min-h-[520px] sm:min-h-[640px] lg:min-h-[720px] flex items-center">
      
      {/* Full Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Anisha Spices Artisanal Heritage"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[80%_center] sm:object-[72%_center] lg:object-center pointer-events-none select-none"
        />
        {/* Soft gradient scrim on mobile for perfect typography readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8ECE7]/95 via-[#F8ECE7]/85 to-transparent sm:via-[#F8ECE7]/50 lg:hidden pointer-events-none" />
      </div>

      {/* Content Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 w-full pt-8 pb-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Column: Headlines, Subtitle, Action Buttons, Trust Badges */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-5 sm:space-y-7">
            
            {/* Main Headline */}
            <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] xl:text-[58px] font-bold tracking-tight text-[#2A1612] leading-[1.15]">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#5A433B] max-w-lg leading-relaxed font-normal">
              {subtitle}
            </p>

            {/* CTA Buttons - Side by Side on all screen sizes */}
            <div className="flex flex-row items-center gap-2.5 sm:gap-4 pt-1">
              <Link
                href={buttonLink}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#7B111A] px-4 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-base font-semibold text-white shadow-md shadow-[#7B111A]/25 hover:bg-[#520C12] hover:shadow-lg transition-all transform hover:-translate-y-0.5 text-center whitespace-nowrap"
              >
                <span>{buttonText}</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Link>
              <Link
                href="/about"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center rounded-full border border-[#B3927D] bg-white/70 backdrop-blur-sm px-4 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-base font-semibold text-[#2A1612] hover:bg-[#F2E8DC] hover:border-[#7B111A] transition-all text-center whitespace-nowrap"
              >
                Our Story
              </Link>
            </div>

            {/* 3 Trust Badges with delicate line-art */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 sm:pt-4 max-w-lg">
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-1.5 group">
                <div className="p-1.5 sm:p-2 rounded-full bg-[#7B111A]/10 text-[#7B111A] group-hover:scale-110 transition-transform">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-sm font-semibold text-[#2A1612] leading-tight">100% Natural</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-1.5 group">
                <div className="p-1.5 sm:p-2 rounded-full bg-[#7B111A]/10 text-[#7B111A] group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-sm font-semibold text-[#2A1612] leading-tight">No Preservatives</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1 sm:gap-1.5 group">
                <div className="p-1.5 sm:p-2 rounded-full bg-[#7B111A]/10 text-[#7B111A] group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-[11px] sm:text-sm font-semibold text-[#2A1612] leading-tight">Premium Quality</span>
              </div>
            </div>

          </div>

          {/* Right Column spacer to let background pouch and splash shine through */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6 min-h-[300px]" />

        </div>
      </div>
    </section>
  )
}
