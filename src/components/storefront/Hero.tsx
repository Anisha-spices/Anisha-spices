import Image from 'next/image'
import Link from 'next/link'
import { getHeroSlides } from '@/actions/admin/hero'
import { HeroSlider } from './HeroSlider'

export async function Hero() {
  const allSlides = await getHeroSlides()
  const activeSlides = allSlides.filter((s: any) => s.is_active)

  // If no slides are configured, we show a fallback/default hero
  if (!activeSlides || activeSlides.length === 0) {
    return (
      <div className="relative h-[500px] sm:h-[600px] lg:h-[700px] bg-stone-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <Image
            src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2070&auto=format&fit=crop"
            alt="Spices Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-md">
            Welcome to Anisha Masale
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-stone-200 mb-10 max-w-2xl mx-auto drop-shadow">
            Experience the authentic taste of premium Indian spices.
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition-colors text-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    )
  }

  // The global text is taken from the first slide (as per Option B)
  const globalText = {
    title: activeSlides[0].title,
    subtitle: activeSlides[0].subtitle,
    button_text: activeSlides[0].button_text,
    button_link: activeSlides[0].button_link
  }

  // Pass active slides to client component for the sliding logic
  return (
    <HeroSlider 
      slides={activeSlides} 
      globalText={globalText} 
      textMode={activeSlides[0].text_mode || 'global'} 
    />
  )
}
