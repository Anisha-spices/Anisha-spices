import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.trim()

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] })
    }

    const supabase = await createClient()

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        featured_image_url,
        short_description,
        product_variants (
          price,
          is_active
        )
      `)
      .or(`name.ilike.%${query}%,short_description.ilike.%${query}%,slug.ilike.%${query}%`)
      .eq('is_active', true)
      .limit(6)

    if (error) {
      return NextResponse.json({ results: [] })
    }

    const formatted = (products || []).map((p: any) => {
      const activeVariants = p.product_variants?.filter((v: any) => v.is_active) || []
      const prices = activeVariants.map((v: any) => v.price)
      const minPrice = prices.length > 0 ? Math.min(...prices) : null

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        image: p.featured_image_url || '/images/red-chilly-powder.jpeg',
        price: minPrice,
      }
    })

    return NextResponse.json({ results: formatted })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
