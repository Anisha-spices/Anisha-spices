import Image from 'next/image'
import { SPICE_ASSETS } from '@/constants/assets'

export function HealthBenefitsSection() {
  const benefits = [
    {
      title: 'Boosts Immunity',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      title: 'Aids Digestion',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v12a6 6 0 0 0 12 0V3" />
          <path d="M6 8h12" />
        </svg>
      ),
    },
    {
      title: 'Rich in Antioxidants',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ),
    },
    {
      title: 'Anti-inflammatory Properties',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
    },
  ]

  const recipeCards = [
    {
      id: 'energy',
      title: 'Energy Booster',
      image: SPICE_ASSETS.recipes.energyBooster,
    },
    {
      id: 'digestion',
      title: 'Better Digestion',
      image: SPICE_ASSETS.recipes.betterDigestion,
    },
    {
      id: 'heart',
      title: 'Healthy Heart',
      image: SPICE_ASSETS.recipes.healthyHeart,
    },
    {
      id: 'healing',
      title: 'Natural Healing',
      image: SPICE_ASSETS.recipes.naturalHealing,
    },
  ]

  return (
    <section id="uses" className="relative py-12 sm:py-20 lg:py-24 bg-[#520C12] text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,155,101,0.2),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,0,0,0.5),transparent_65%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Description & 4 Ayurvedic Badges */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-8 text-center lg:text-left">
            <h2 className="font-serif text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.18]">
              Spices That Do More<br />
              Than Just Add <span className="text-[#C89B65]">Taste</span>
            </h2>

            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
              Spices are the heart of healthy living. They enhance flavor and bring natural goodness to your everyday meals.
            </p>

            {/* 4 Health Benefit Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 pt-2 sm:pt-4">
              {benefits.map((b) => (
                <div key={b.title} className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 group">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#C89B65] group-hover:bg-[#C89B65] group-hover:text-[#520C12] transition-all duration-300">
                    <div className="scale-90 sm:scale-100">{b.icon}</div>
                  </div>
                  <span className="text-[11px] sm:text-xs font-semibold text-stone-200 leading-tight">
                    {b.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: 4 Vertical Recipe Cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
              {recipeCards.map((recipe) => (
                <div
                  key={recipe.id}
                  className="group relative h-48 xs:h-56 sm:h-80 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-end p-2.5 sm:p-3.5 transform hover:-translate-y-1.5 transition-all duration-300"
                >
                  {/* Background Dish Image */}
                  <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Card Title Bottom */}
                  <div className="relative z-10 text-center">
                    <h3 className="font-serif text-xs sm:text-base font-bold text-white leading-tight">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
