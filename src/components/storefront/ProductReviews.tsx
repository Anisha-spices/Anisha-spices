'use client'

import { useState } from 'react'
import { submitReview } from '@/actions/reviews'
import { Star, MessageSquare } from 'lucide-react'

type ReviewProps = {
  productId: string
  isAuthenticated: boolean
  reviews: {
    id: string
    rating: number
    review_text: string | null
    created_at: string
    user: { full_name: string } | null
  }[]
}

export function ProductReviews({ productId, isAuthenticated, reviews }: ReviewProps) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    formData.append('product_id', productId)
    formData.append('rating', rating.toString())
    
    const result = await submitReview({}, formData)
    
    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(true)
    }
    
    setIsSubmitting(false)
  }

  return (
    <div>
      <h3 className="text-xl sm:text-2xl font-bold text-text mb-4 sm:mb-6">Customer Reviews</h3>
      
      {/* Review Form */}
      <div className="bg-surface p-4 sm:p-6 rounded-2xl border border-border mb-8 shadow-sm">
        {success ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <h4 className="text-lg font-bold text-text mb-2">Thank you!</h4>
            <p className="text-text-muted text-sm">Your review has been submitted and is pending approval.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm font-semibold text-primary hover:text-primary-light"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form action={handleSubmit}>
            <h4 className="text-base sm:text-lg font-semibold text-text mb-4">Write a Review</h4>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {isAuthenticated ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-2">Rating</label>
                  <div className="flex gap-1.5 items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-1.5 -ml-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star 
                          className={`w-7 h-7 sm:w-8 sm:h-8 ${
                            star <= (hoveredRating || rating) 
                              ? 'fill-orange-400 text-orange-400' 
                              : 'text-stone-300'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="review_text" className="block text-sm font-medium text-text mb-2">Your Review (Optional)</label>
                  <textarea
                    id="review_text"
                    name="review_text"
                    rows={4}
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm sm:text-base text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="What did you think about this product?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-primary text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-primary-light transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </>
            ) : (
              <div className="text-center py-6 bg-stone-50 rounded-xl border border-stone-200">
                <p className="text-stone-600 text-sm mb-4">Please log in to leave a review.</p>
                <a href="/login" className="inline-flex items-center justify-center px-6 py-2 bg-stone-900 text-white text-sm font-semibold rounded-lg hover:bg-stone-800 transition-colors">
                  Log In
                </a>
              </div>
            )}
          </form>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-stone-200'}`} 
                  />
                ))}
              </div>
              {review.review_text && (
                <p className="text-text text-sm sm:text-base mb-3 leading-relaxed">{review.review_text}</p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-text-muted">
                <span className="font-medium text-stone-700">{review.user?.full_name || 'Anonymous Customer'}</span>
                <span>{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 sm:py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200 text-stone-500 flex flex-col items-center">
            <MessageSquare className="w-8 h-8 mb-3 text-stone-300" />
            <p className="text-sm">No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>
    </div>
  )
}
