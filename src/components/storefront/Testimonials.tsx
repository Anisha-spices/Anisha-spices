'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const REVIEWS = [
  {
    id: 1,
    name: 'Anjali Sharma',
    role: 'Home Chef',
    text: 'The quality of the turmeric and red chili powder is exceptional. It brings a completely different level of richness and color to my daily cooking. Highly recommended!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Food Enthusiast',
    text: 'Anisha Masale has completely changed my biryani game. The whole spices are incredibly aromatic. You can immediately tell these are sourced fresh directly from farms.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Iyer',
    role: 'Regular Customer',
    text: 'I have tried many premium spice brands, but nothing comes close to the pure, unadulterated flavor of Anisha Masale. Their garam masala is my absolute favorite.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Restaurant Owner',
    text: 'We started using their bulk spices for our restaurant. Our customers have literally noticed the difference in taste. The heat and aroma are perfectly balanced.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Neha Gupta',
    role: 'Nutritionist',
    text: 'Finding pure, pesticide-free spices is tough. I love that Anisha Masale focuses on ethical sourcing and purity. The natural oils in their spices are intact.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Karan Desai',
    role: 'Culinary Blogger',
    text: 'Authentic Indian flavors at their best. If you want to experience the true heritage of our cuisine, these spices are an absolute must-have in your pantry.',
    rating: 5,
  },
]

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  useEffect(() => {
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">Loved by Kitchens Everywhere</h2>
            <p className="text-stone-600 text-lg">Don&apos;t just take our word for it. Hear what our customers have to say.</p>
          </div>
          
          {/* Navigation Arrows (Desktop) */}
          <div className="hidden md:flex gap-3">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border border-stone-200 transition-all ${
                canScrollLeft 
                  ? 'bg-white text-stone-900 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 shadow-sm' 
                  : 'bg-stone-50 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border border-stone-200 transition-all ${
                canScrollRight 
                  ? 'bg-white text-stone-900 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 shadow-sm' 
                  : 'bg-stone-50 text-stone-300 cursor-not-allowed'
              }`}
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        {/* We use a mask-image to create the faded edges effect showing neighbors */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div 
            className="absolute inset-y-0 left-0 w-8 sm:w-12 lg:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" 
          />
          <div 
            className="absolute inset-y-0 right-0 w-8 sm:w-12 lg:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" 
          />
          
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {REVIEWS.map((review) => (
              <div 
                key={review.id} 
                className="w-[85vw] sm:w-[340px] shrink-0 snap-center sm:snap-start bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <p className="text-stone-700 text-lg leading-relaxed mb-8">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center border border-orange-200 shrink-0">
                    <span className="font-bold text-orange-700 text-lg">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{review.name}</h4>
                    <p className="text-sm text-stone-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Navigation Arrows (Visible only on small screens) */}
        <div className="flex md:hidden justify-center gap-4 mt-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-3 rounded-full border border-stone-200 transition-all ${
              canScrollLeft 
                ? 'bg-white text-stone-900 active:bg-orange-50 active:border-orange-200 active:text-orange-600 shadow-sm' 
                : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-3 rounded-full border border-stone-200 transition-all ${
              canScrollRight 
                ? 'bg-white text-stone-900 active:bg-orange-50 active:border-orange-200 active:text-orange-600 shadow-sm' 
                : 'bg-stone-50 text-stone-300 cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Hide scrollbar globally for webkit in this component using a style tag */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  )
}
