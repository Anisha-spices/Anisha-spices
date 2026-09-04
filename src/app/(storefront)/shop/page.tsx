import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/storefront/ProductCard'
import Link from 'next/link'
import { ShopSidebar } from './_components/ShopSidebar'
import { Sparkles, X, ChevronRight } from 'lucide-react'

export const metadata = {
  title: 'Shop All Spices — Pure Indian Spices | Anisha Spices',
  description: 'Explore our full range of 100% pure, cold-ground Turmeric, Kashmiri Red Chilly, Coriander, Cumin, and Garam Masala.',
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const categoryFilter = typeof params.category === 'string' ? params.category : null
  const searchQuery = typeof params.q === 'string' ? params.q : null
  const pageStr = typeof params.page === 'string' ? params.page : '1'
  const page = parseInt(pageStr, 10) || 1
  const limit = 18
  const from = (page - 1) * limit
  const to = from + limit - 1

  const supabase = await createClient()

  const fetchWithTimeout = async <T,>(promise: PromiseLike<T>, timeoutMs = 5000): Promise<T | null> => {
    try {
      const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs))
      return (await Promise.race([Promise.resolve(promise), timeout])) as T | null
    } catch {
      return null
    }
  }

  // Fetch all active categories for the sidebar
  const categoriesRes = await fetchWithTimeout(
    supabase.from('categories').select('*').eq('is_active', true).order('name')
  )
  const categories = (categoriesRes as any)?.data || null

  // Resolve category id if filtered
  const selectedCategory = categoryFilter && categories
    ? categories.find((c: any) => c.slug === categoryFilter)
    : null

  // Build the products query
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      product_variants (
        id,
        variant_name,
        price,
        stock_quantity,
        is_active
      )
    `, { count: 'exact' })
    .eq('is_active', true)

  if (selectedCategory) {
    query = query.eq('category_id', selectedCategory.id)
  }

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%,slug.ilike.%${searchQuery}%`)
  }

  query = query.order('name', { ascending: true }).range(from, to)

  const productsRes = await fetchWithTimeout(query)
  const products = (productsRes as any)?.data || null
  const count = (productsRes as any)?.count || (products ? products.length : 0)
  const totalPages = Math.ceil(count / limit) || 1

  // Process products to find minimum variant price & discounts
  const formattedProducts = (products || []).map((product: any) => {
    const activeVariants = product.product_variants?.filter((v: any) => v.is_active) || []
    const prices = activeVariants.map((v: any) => v.price)
    const minPrice = prices.length > 0 ? Math.min(...prices) : null
    const minVariant = activeVariants.find((v: any) => v.price === minPrice)
    const originalPrice = minVariant?.original_price || null
    const rating = Number(product.average_rating) || 0
    const reviewCount = Number(product.review_count) || 0

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      shortDescription: product.short_description,
      featuredImage: product.featured_image_url,
      minPrice,
      originalPrice,
      rating,
      reviewCount,
    }
  })

  const currentCategoryName = categoryFilter
    ? categories?.find((c: any) => c.slug === categoryFilter)?.name
    : null

  return (
    <div className="bg-[#F8ECE7] min-h-screen text-[#2A1612] pb-16 pt-6 sm:pt-8">
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#2A1612]">
            {currentCategoryName ? currentCategoryName : 'All Spices'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E5951]">
            100% Pure, Stone-Ground Indian Spices
          </p>
        </div>

        {/* Active Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#E8DFD5]">
          <div className="text-xs sm:text-sm text-[#5A433B]">
            Showing <strong className="text-[#2A1612] font-bold">{formattedProducts.length}</strong> {formattedProducts.length === 1 ? 'spice product' : 'spice products'}
            {searchQuery && <span> for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>}
          </div>

          {/* Active Filter Chips */}
          {(categoryFilter || searchQuery) && (
            <div className="flex items-center gap-2">
              {categoryFilter && (
                <Link
                  href={`/shop${searchQuery ? `?q=${searchQuery}` : ''}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#C89B65]/60 px-3 py-1 text-xs font-semibold text-[#7B111A] hover:bg-[#FAF3EB] transition-colors shadow-sm"
                >
                  <span>Category: {currentCategoryName || categoryFilter}</span>
                  <X className="w-3.5 h-3.5 text-[#7B111A]" />
                </Link>
              )}
              {searchQuery && (
                <Link
                  href={`/shop${categoryFilter ? `?category=${categoryFilter}` : ''}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#C89B65]/60 px-3 py-1 text-xs font-semibold text-[#7B111A] hover:bg-[#FAF3EB] transition-colors shadow-sm"
                >
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <X className="w-3.5 h-3.5 text-[#7B111A]" />
                </Link>
              )}
              <Link
                href="/shop"
                className="text-xs font-bold text-[#8C766E] hover:text-[#7B111A] underline transition-colors"
              >
                Clear all
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

          {/* Sidebar / Filters */}
          <ShopSidebar
            categories={categories || []}
            categoryFilter={categoryFilter}
            searchQuery={searchQuery}
          />

          {/* Product Grid Container */}
          <div className="flex-1 w-full">
            {formattedProducts.length === 0 ? (
              <div className="text-center py-16 px-6 bg-white rounded-3xl border border-[#E8DFD5] shadow-sm space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF3EB] border border-[#C89B65]/40 flex items-center justify-center text-[#7B111A] mx-auto shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2A1612]">No spices found</h3>
                <p className="text-xs sm:text-sm text-[#6E5951] max-w-sm mx-auto">
                  We couldn&apos;t find any products matching your criteria. Try adjusting your search or category filter.
                </p>
                {(searchQuery || categoryFilter) && (
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-[#7B111A] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#520C12] transition-colors"
                  >
                    View All Spices
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* 2 columns on mobile, 3 columns on tablet/desktop */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
                  {formattedProducts.map((product: any) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-2">
                    {page > 1 && (
                      <Link
                        href={`/shop?page=${page - 1}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="px-4 py-2 bg-white border border-[#E8DFD5] rounded-full text-xs font-bold text-[#5A433B] hover:bg-[#FAF3EB] hover:text-[#7B111A] transition-colors shadow-sm"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/shop?page=${p}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all ${p === page
                            ? 'bg-[#7B111A] text-white shadow-md'
                            : 'bg-white border border-[#E8DFD5] text-[#5A433B] hover:bg-[#FAF3EB]'
                          }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={`/shop?page=${page + 1}${categoryFilter ? `&category=${categoryFilter}` : ''}${searchQuery ? `&q=${searchQuery}` : ''}`}
                        className="px-4 py-2 bg-white border border-[#E8DFD5] rounded-full text-xs font-bold text-[#5A433B] hover:bg-[#FAF3EB] hover:text-[#7B111A] transition-colors shadow-sm"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
