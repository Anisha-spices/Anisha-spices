import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST() {
  try {
    const supabase = createAdminClient()

    // 1. Black Pepper -> /images/black-pepper.jpg
    await supabase
      .from('products')
      .update({ featured_image_url: '/images/black-pepper.jpg' })
      .eq('slug', 'whole-black-pepper')

    // 2. Cloves, Cardamom, Cinnamon -> Distinct images
    await supabase
      .from('products')
      .update({ featured_image_url: '/images/garam-masala.jpeg' })
      .eq('slug', 'aromatic-cloves')

    await supabase
      .from('products')
      .update({ featured_image_url: '/images/whole-spices.jpg' })
      .eq('slug', 'green-cardamom-pods')

    await supabase
      .from('products')
      .update({ featured_image_url: '/images/cumin-powder.jpeg' })
      .eq('slug', 'ceylon-cinnamon')

    await supabase
      .from('products')
      .update({ featured_image_url: '/images/coriander-powder.jpeg' })
      .eq('slug', 'indian-bay-leaves')

    await supabase
      .from('products')
      .update({ featured_image_url: '/images/coriander-powder.jpeg' })
      .eq('slug', 'nagauri-kasuri-methi')

    await supabase
      .from('products')
      .update({ featured_image_url: '/images/turmeric-powder.jpeg' })
      .eq('slug', 'dry-mango-amchur-powder')

    // Remove duplicate variants (keeps the first created one per product_id & variant_name)
    const { data: allVariants } = await supabase
      .from('product_variants')
      .select('id, product_id, variant_name, created_at')
      .order('created_at', { ascending: true })

    if (allVariants && allVariants.length > 0) {
      const seen = new Set<string>()
      const duplicateIds: string[] = []

      for (const v of allVariants) {
        const key = `${v.product_id}_${v.variant_name}`
        if (seen.has(key)) {
          duplicateIds.push(v.id)
        } else {
          seen.add(key)
        }
      }

      if (duplicateIds.length > 0) {
        await supabase
          .from('product_variants')
          .delete()
          .in('id', duplicateIds)
      }
    }

    // 3. Ensure profiles exist for admin
    await supabase.from('profiles').upsert([
      {
        id: '068a9402-1afc-4f64-a5a2-a9e549e3c00b',
        full_name: 'Store Administrator',
        email: 'admin@auramasale.com',
        phone: '+919999999999',
        role: 'admin',
        is_active: true,
      }
    ], { onConflict: 'id' })

    revalidatePath('/shop')
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
