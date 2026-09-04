import { SPICE_ASSETS } from '@/constants/assets'
import { HeritageSeal } from '@/components/storefront/HeritageSeal'


export function PromiseSection() {
  const promises = [
    {
      title: '100% Natural',
      desc: 'Nothing artificial, Just pure spices.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#7B111A] stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9A9 9 0 0 1 3 11a9 9 0 0 1 9-9z" />
          <path d="M12 7v10" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      title: 'No Preservatives',
      desc: 'No chemicals, no compromise.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#7B111A] stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="m4.93 4.93 14.14 14.14" />
        </svg>
      ),
    },
    {
      title: 'Finest Quality',
      desc: 'Carefully selected & ground.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#7B111A] stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 14.66V17c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
    {
      title: 'Trusted by Thousands',
      desc: 'Customer trust is our biggest reward.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-[#7B111A] stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
  ]

  return (
    <section id="our-promise" className="py-12 sm:py-20 lg:py-24 bg-[#F8ECE7] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 items-center">

          {/* Left Column: Heading & Text */}
          <div className="lg:col-span-4 space-y-3 sm:space-y-4 text-center lg:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#2A1612] leading-[1.2]">
              Our Promise<br />
              Pure. Natural. <span className="text-[#7B111A]">Trusted.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed max-w-md mx-auto lg:mx-0">
              At Anisha Spices, we promise to deliver spices that are 100% pure, natural &amp; free from harmful additives.
            </p>
          </div>

          {/* Center Column: Rotating Royal Heritage Quality Seal Stamp */}
          <div className="lg:col-span-4 flex justify-center items-center my-4 lg:my-0">
            <HeritageSeal size="lg" showTagline />
          </div>

          {/* Right Column: 2x2 Grid of Trust Guarantees */}
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:divide-x divide-[#E8DFD5]/60">
              {promises.map((p, idx) => (
                <div
                  key={p.title}
                  className={`space-y-1 sm:space-y-2 ${idx % 2 === 1 ? 'sm:pl-6' : ''}`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[#7B111A]">
                    <div className="scale-90 sm:scale-100 shrink-0">{p.icon}</div>
                    <h3 className="font-serif text-xs sm:text-sm lg:text-base font-bold text-[#2A1612] leading-tight">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-[#6E5951] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
