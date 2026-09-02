'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

type GuestCartItem = {
  id: string
  variant_id: string
  quantity: number
  created_at: number
}

async function getGuestCart(): Promise<GuestCartItem[]> {
  const cookieStore = await cookies()
  const guestCartCookie = cookieStore.get('guest_cart')
  if (guestCartCookie) {
    try {
      return JSON.parse(guestCartCookie.value) as GuestCartItem[]
    } catch {
      return []
    }
  }
  return []
}

async function saveGuestCart(cart: GuestCartItem[]) {
  const cookieStore = await cookies()
  cookieStore.set('guest_cart', JSON.stringify(cart), {
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function addToCart(variantId: string, quantity: number = 1) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Guest cart flow
    const cart = await getGuestCart()
    const existing = cart.find(i => i.variant_id === variantId)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({
        id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        variant_id: variantId,
        quantity,
        created_at: Date.now()
      })
    }
    await saveGuestCart(cart)
    revalidatePath('/cart')
    return { success: true }
  }

  // Check if this variant already exists in the user's cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('variant_id', variantId)
    .single()

  if (existing) {
    // Update quantity
    const newQty = existing.quantity + quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id)

    if (error) return { success: false, error: error.message }
  } else {
    // Insert new
    const { error } = await supabase
      .from('cart_items')
      .insert([{ user_id: user.id, variant_id: variantId, quantity }])

    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/cart')
  return { success: true }
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Guest cart flow
    let cart = await getGuestCart()
    cart = cart.filter(i => i.id !== cartItemId)
    await saveGuestCart(cart)
    revalidatePath('/cart')
    return { success: true }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  return { success: true }
}

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    if (quantity <= 0) {
      return removeFromCart(cartItemId)
    }
    const cart = await getGuestCart()
    const item = cart.find(i => i.id === cartItemId)
    if (item) {
      item.quantity = quantity
      await saveGuestCart(cart)
      revalidatePath('/cart')
      return { success: true }
    }
    return { success: false, error: 'Item not found in guest cart' }
  }

  if (quantity <= 0) {
    return removeFromCart(cartItemId)
  }

  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  return { success: true }
}

export async function getCart() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const cart = await getGuestCart()
      if (cart.length === 0) return { success: true, items: [] }

      const variantIds = cart.map(i => i.variant_id)

      // Fetch variant details for guest cart
      const { data, error } = await supabase
        .from('product_variants')
        .select(`
          id,
          variant_name,
          price,
          original_price,
          stock_quantity,
          is_active,
          product_id,
          products (
            id,
            name,
            slug,
            featured_image_url
          )
        `)
        .in('id', variantIds)

      if (error) return { success: true, items: [] }

      // Map cookies array back to cart items shape
      const items = cart.map(item => {
        const variant = data?.find(v => v.id === item.variant_id)
        return {
          id: item.id,
          quantity: item.quantity,
          variant_id: item.variant_id,
          product_variants: variant || null
        }
      }).filter(i => i.product_variants !== null)

      items.sort((a, b) => {
        const aCartItem = cart.find(i => i.id === a.id);
        const bCartItem = cart.find(i => i.id === b.id);
        return (bCartItem?.created_at || 0) - (aCartItem?.created_at || 0);
      })

      return { success: true, items }
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        variant_id,
        product_variants (
          id,
          variant_name,
          price,
          original_price,
          stock_quantity,
          is_active,
          product_id,
          products (
            id,
            name,
            slug,
            featured_image_url
          )
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) return { success: true, items: [] }

    return { success: true, items: data || [] }
  } catch {
    const cart = await getGuestCart()
    return { success: true, items: [] }
  }
}

export async function getCartCount() {
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const hasAuthCookie = allCookies.some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

    if (!hasAuthCookie) {
      const cart = await getGuestCart()
      return cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const cart = await getGuestCart()
      return cart.reduce((sum, item) => sum + item.quantity, 0)
    }

    const { data } = await supabase
      .from('cart_items')
      .select('quantity')
      .eq('user_id', user.id)

    if (!data) return 0

    return data.reduce((sum, item) => sum + item.quantity, 0)
  } catch {
    const cart = await getGuestCart()
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }
}
