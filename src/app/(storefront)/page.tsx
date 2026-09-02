import { createClient } from '@/lib/supabase/server'
import { HeroSection } from '@/components/storefront/HeroSection'
import { PillarsBar } from '@/components/storefront/PillarsBar'
import { SpiceRangeSection, LiveSpiceItem } from '@/components/storefront/SpiceRangeSection'
import { HealthBenefitsSection } from '@/components/storefront/HealthBenefitsSection'
import { PromiseSection } from '@/components/storefront/PromiseSection'
import { BottomBanner } from '@/components/storefront/BottomBanner'
import { SPICE_ASSETS } from '@/constants/assets'

export const metadata = {
  title: 'Anisha Spices — Pure Spice. Real Taste. Trusted Every Time.',
  description:
    'Anisha Spices brings the richness of India\'s finest spices to your kitchen. Pure, natural & full of flavor.',
}

export default async function HomePage() {
  let liveProducts: LiveSpiceItem[] = []

  try {
    const supabase = await createClient()
    const coreFiveSlugs = [
      'turmeric-powder',
      'red-chilly-powder',
      'coriander-powder',
      'cumin-powder',
      'garam-masala',
    ]

    const { data: dbProducts } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        featured_image_url,
        is_featured,
        product_variants (price, is_active)
      `)
      .in('slug', coreFiveSlugs)
      .eq('is_active', true)
      .limit(5)

    if (dbProducts && dbProducts.length > 0) {
      liveProducts = dbProducts.map((p: any) => {
        const activeVariants = p.product_variants?.filter((v: any) => v.is_active) || []
        const prices = activeVariants.map((v: any) => v.price)
        const minPrice = prices.length > 0 ? Math.min(...prices) : null

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: p.featured_image_url || SPICE_ASSETS.redChilly,
          tag: p.is_featured ? 'Best Seller' : null,
          href: `/product/${p.slug}`,
          priceText: minPrice ? `From ₹${minPrice}` : undefined,
        }
      })
    }
  } catch {
    // Graceful fallback to default curated items
  }

  return (
    <div className="bg-spice-dust min-h-screen flex flex-col">
      {/* 1. Hero Section (Wired to Hero Slides / DB) */}
      <HeroSection />

      {/* 2. 4-Pillars Feature Bar (Floating) */}
      <PillarsBar />

      {/* 3. Our Spice Range Section (Wired to Supabase Products) */}
      <SpiceRangeSection products={liveProducts} />

      {/* 4. Spices That Do More Than Just Add Taste (Health Benefits & Recipes) */}
      <HealthBenefitsSection />

      {/* 5. Our Promise - Pure. Natural. Trusted. (Quality Seal Stamp & Guarantees) */}
      <PromiseSection />

      {/* 6. Bring Home The Taste of Purity (Full-Width Bottom Banner) */}
      <BottomBanner />
    </div>
  )
}
