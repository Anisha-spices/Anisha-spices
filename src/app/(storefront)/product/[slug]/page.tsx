import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { ProductVariantSelector } from '@/components/storefront/ProductVariantSelector'
import { ProductAccordion } from '@/components/storefront/ProductAccordion'
import { ProductReviews } from '@/components/storefront/ProductReviews'
import { ProductCard } from '@/components/storefront/ProductCard'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  try {
    const supabase = await createClient()
    const { data: product } = await supabase
      .from('products')
      .select('seo_title, seo_description, name, short_description')
      .eq('slug', slug)
      .single()

    if (product) {
      return {
        title: product.seo_title || `${product.name} | Anisha Spices`,
        description: product.seo_description || product.short_description || `Buy authentic ${product.name} from Anisha Spices.`,
      }
    }
  } catch {
    // Fallback
  }

  const formattedName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return {
    title: `${formattedName} | Anisha Spices`,
    description: `Buy authentic, 100% pure ${formattedName} from Anisha Spices.`,
  }
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch product and all related data
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (id, name, slug),
      product_images (*),
      product_variants (*),
      product_information (*),
      product_faqs (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    notFound()
  }

  // Check authentication status
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user

  // Fetch approved reviews
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('id, rating, review_text, created_at, user:profiles(full_name)')
    .eq('product_id', product.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  const reviews = reviewsData || []

  // Sort relations
  const sortedInfo = (product.product_information || []).sort((a: any, b: any) => a.display_order - b.display_order)
  let sortedFaqs = (product.product_faqs || []).sort((a: any, b: any) => a.display_order - b.display_order)

  if (product.use_global_faqs) {
    const { data: globalFaqs } = await supabase.from('global_faqs').select('*').order('display_order')
    if (globalFaqs) {
      sortedFaqs = globalFaqs
    }
  }

  // Fetch related products (random up to 6)
  const { data: relatedProductsData } = await supabase
    .from('products')
    .select(`
      id,
      slug,
      name,
      short_description,
      featured_image_url,
      product_variants ( price, is_active )
    `)
    .neq('id', product.id)
    .eq('is_active', true)
    .limit(20)

  // Shuffle and pick 6
  const shuffled = (relatedProductsData || []).sort(() => 0.5 - Math.random())
  const relatedProducts = shuffled.slice(0, 6).map((rp: any) => {
    const activeVariants = rp.product_variants?.filter((v: any) => v.is_active) || []
    const prices = activeVariants.map((v: any) => v.price)
    const minPrice = prices.length > 0 ? Math.min(...prices) : null

    return {
      id: rp.id,
      slug: rp.slug,
      name: rp.name,
      shortDescription: rp.short_description,
      featuredImage: rp.featured_image_url,
      minPrice,
    }
  })

  return (
    <div className="bg-[#F8ECE7] min-h-screen py-8 sm:py-12 text-[#2A1612]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Product Hero Grid (Card Container) */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-[#E8DFD5] shadow-sm">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">

            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 mb-8 lg:mb-0">
              <ProductImageGallery
                images={product.product_images || []}
                featuredImage={product.featured_image_url}
              />
            </div>

            {/* Right Column: Product Info & Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category Badge & Rating */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {product.categories && (
                    <span className="px-3 py-1 rounded-full bg-[#FAF6F2] border border-[#E8DFD5] text-[11px] font-bold uppercase tracking-wider text-[#7B111A]">
                      {product.categories.name}
                    </span>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    <span>★</span>
                    <span>{product.average_rating || '4.9'}</span>
                    <span className="text-stone-400 font-normal">({product.review_count || '120+'} verified)</span>
                  </div>
                </div>

                <h1 className="font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-[#2A1612] mb-3 leading-[1.18]">
                  {product.name}
                </h1>

                {product.short_description && (
                  <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed mb-6 font-normal">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Variants Selector (Handles Price & Add to Cart) */}
              <ProductVariantSelector variants={product.product_variants || []} />
            </div>
          </div>
        </div>

        {/* Description & Additional Info Section */}
        {(product.description || sortedInfo.length > 0) && (
          <div className="mt-10 sm:mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD5] shadow-sm">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 gap-y-10">

              {/* Description */}
              <div className="mb-8 lg:mb-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">🌿</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">About This Spice</h3>
                </div>
                {product.description ? (
                  <div className="prose prose-stone text-[#5A433B] max-w-none whitespace-pre-wrap leading-relaxed text-sm sm:text-base font-normal">
                    {product.description}
                  </div>
                ) : (
                  <p className="text-stone-400 italic text-sm">No description available.</p>
                )}
              </div>

              {/* Additional Information Table */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">📋</span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">Spice Specifications</h3>
                </div>
                {sortedInfo.length > 0 ? (
                  <div className="overflow-hidden bg-[#FAF6F2] border border-[#E8DFD5] rounded-2xl">
                    <table className="min-w-full divide-y divide-[#E8DFD5]">
                      <tbody className="divide-y divide-[#E8DFD5]">
                        {sortedInfo.map((info: any, idx: number) => (
                          <tr key={info.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F2]'}>
                            <td className="py-3.5 pl-4 sm:pl-6 pr-3 text-xs sm:text-sm font-bold text-[#2A1612] w-1/3 border-r border-[#E8DFD5]">
                              {info.label}
                            </td>
                            <td className="px-4 py-3.5 text-xs sm:text-sm text-[#5A433B] sm:pr-6 whitespace-pre-wrap font-medium">
                              {info.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-stone-400 bg-[#FAF6F2] rounded-2xl border border-[#E8DFD5] text-xs">
                    100% Pure, Naturally Sourced Indian Spice.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* FAQs & Reviews Section */}
        <div className="mt-10 sm:mt-14 bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DFD5] shadow-sm">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 gap-y-10">

            {/* FAQs */}
            <div className="mb-8 lg:mb-0">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">💬</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">Questions & Answers</h3>
              </div>
              {sortedFaqs.length > 0 ? (
                <ProductAccordion faqs={sortedFaqs} />
              ) : (
                <div className="p-6 bg-[#FAF6F2] rounded-2xl border border-[#E8DFD5] text-center text-xs text-[#8C7567]">
                  Have questions about this spice? Reach out to our spice masters via WhatsApp or Contact page.
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg">⭐️</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2A1612]">Customer Reviews</h3>
              </div>
              <ProductReviews
                productId={product.id}
                isAuthenticated={isAuthenticated}
                reviews={reviews as any}
              />
            </div>

          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <h3 className="text-2xl font-bold text-text mb-8">You May Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} {...rp} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
