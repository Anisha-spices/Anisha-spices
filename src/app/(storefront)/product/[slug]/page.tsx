import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ProductImageGallery } from '@/components/storefront/ProductImageGallery'
import { ProductVariantSelector } from '@/components/storefront/ProductVariantSelector'
import { ProductTabsSection } from '@/components/storefront/ProductTabsSection'
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

export const dynamic = 'force-dynamic'

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
      average_rating,
      review_count,
      product_variants ( price, original_price, is_active )
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
    const minVariant = activeVariants.find((v: any) => v.price === minPrice)
    const originalPrice = minVariant?.original_price || null
    const rating = Number(rp.average_rating) || 0
    const reviewCount = Number(rp.review_count) || 0

    return {
      id: rp.id,
      slug: rp.slug,
      name: rp.name,
      shortDescription: rp.short_description,
      featuredImage: rp.featured_image_url,
      minPrice,
      originalPrice,
      rating,
      reviewCount,
    }
  })

  return (
    <div className="bg-[#F8ECE7] min-h-screen py-3 sm:py-8 lg:py-12 text-[#2A1612]">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">

        {/* Product Hero Grid (Card Container) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-8 lg:p-10 border border-[#E8DFD5] shadow-xs">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">

            {/* Left Column: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 mb-3 lg:mb-0">
              <ProductImageGallery
                images={product.product_images || []}
                featuredImage={product.featured_image_url}
              />
            </div>

            {/* Right Column: Product Info & Actions (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category Badge & Rating */}
                <div className="flex flex-wrap items-center gap-2 mb-1.5 sm:mb-3">
                  {product.categories && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6F2] border border-[#E8DFD5] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#7B111A]">
                      {product.categories.name}
                    </span>
                  )}
                  {product.review_count > 0 && product.average_rating > 0 ? (
                    <a
                      href="#reviews"
                      className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-700 font-bold bg-amber-50 hover:bg-amber-100/70 px-2.5 py-0.5 rounded-full border border-amber-200/60 transition-colors cursor-pointer"
                    >
                      <span>★</span>
                      <span>{Number(product.average_rating).toFixed(1)}</span>
                      <span className="text-stone-400 font-normal">
                        ({product.review_count} {product.review_count === 1 ? 'review' : 'reviews'})
                      </span>
                    </a>
                  ) : (
                    <a
                      href="#reviews"
                      className="flex items-center gap-1.5 text-[11px] sm:text-xs text-stone-600 font-medium bg-stone-50 hover:bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 transition-colors cursor-pointer"
                    >
                      <span className="text-amber-500 font-bold">★</span>
                      <span>New</span>
                      <span className="text-[#7B111A] font-semibold hover:underline">(Write a review)</span>
                    </a>
                  )}
                </div>

                <h1 className="font-serif text-xl xs:text-2xl sm:text-3xl lg:text-[2.6rem] font-bold text-[#2A1612] mb-1 sm:mb-3 leading-tight">
                  {product.name}
                </h1>

                {product.short_description && (
                  <p className="text-xs sm:text-base text-[#5A433B] leading-snug sm:leading-relaxed mb-2.5 sm:mb-6 font-normal line-clamp-2 sm:line-clamp-none">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Variants Selector (Handles Price & Add to Cart) */}
              <ProductVariantSelector variants={product.product_variants || []} />
            </div>
          </div>
        </div>

        {/* Unified Luxury Tabs Section: About & Highlights, Specifications, FAQs & Care, Customer Reviews */}
        <ProductTabsSection
          productId={product.id}
          productName={product.name}
          description={product.description}
          shortDescription={product.short_description}
          specs={sortedInfo}
          faqs={sortedFaqs}
          reviews={reviews as any}
          isAuthenticated={isAuthenticated}
          averageRating={Number(product.average_rating) || 0}
        />

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20 border-t border-[#E8DFD5] pt-12 sm:pt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">
                You May Also Like
              </h3>
              <Link
                href="/shop"
                className="text-xs sm:text-sm font-bold text-[#7B111A] hover:underline"
              >
                View All Spices →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
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
