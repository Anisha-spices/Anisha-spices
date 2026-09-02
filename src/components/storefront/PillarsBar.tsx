export function PillarsBar() {
  const pillars = [
    {
      title: 'Sourced with Care',
      desc: 'Handpicked from the best farms across India.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 4 13C4 8.5 8 5 12 3c4 2 8 5.5 8 10a7 7 0 0 1-7 7z" />
          <path d="M12 20v-8" />
          <path d="M9 15l3-3 3 3" />
        </svg>
      ),
    },
    {
      title: 'Rich in Aroma & Flavor',
      desc: 'Finely ground to lock in natural oils and taste.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 12h12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3z" />
          <path d="M8 8c0-2 1-3 2-4" />
          <path d="M12 8c0-2 1-3 2-4" />
          <path d="M16 8c0-2 1-3 2-4" />
        </svg>
      ),
    },
    {
      title: 'Hygienically Packed',
      desc: 'Advanced packaging to ensure purity & freshness.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
    {
      title: 'Lab Tested',
      desc: 'Every batch is tested for purity & safety.',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.5a2.5 2.5 0 0 1-.5 1.5L4.5 18a2 2 0 0 0 1.5 3h12a2 2 0 0 0 1.5-3L14.5 11a2.5 2.5 0 0 1-.5-1.5V2" />
          <path d="M8 2h8" />
          <path d="M6 17h12" />
        </svg>
      ),
    },
  ]

  return (
    <section className="relative -mt-8 sm:-mt-14 mb-10 sm:mb-16 z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-md border border-[#E8DFD5] shadow-2xl shadow-[#7B111A]/5 p-4 sm:p-8 lg:p-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x divide-[#E8DFD5]">
          {pillars.map((item, index) => (
            <div
              key={item.title}
              className={`flex flex-col items-center text-center space-y-2 sm:space-y-3 ${
                index !== 0 ? 'lg:pl-6' : ''
              } p-2 sm:p-0`}
            >
              {/* Circular Emblem Icon with Maroon Accent */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#FAF3EB] border border-[#C89B65]/40 flex items-center justify-center text-[#7B111A] shadow-sm transform hover:scale-110 transition-transform duration-200">
                <div className="scale-80 sm:scale-100">{item.icon}</div>
              </div>

              {/* Title & Description */}
              <h3 className="font-serif text-xs sm:text-base lg:text-lg font-bold text-[#2A1612] tracking-tight leading-tight">
                {item.title}
              </h3>
              <p className="text-[10px] sm:text-xs lg:text-sm text-[#6E5951] leading-relaxed max-w-xs line-clamp-2 sm:line-clamp-none">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
