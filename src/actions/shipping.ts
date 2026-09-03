'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export type ShippingConfig = {
  free_shipping_threshold: number
  standard_shipping_cost: number
}

const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  free_shipping_threshold: 500,
  standard_shipping_cost: 90,
}

const CONFIG_SLUG = '__system_shipping_config__'

/**
 * Get current shipping configuration from database
 * Always returns valid numbers with graceful fallbacks
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
  try {
    const adminClient = createAdminClient()
    const { data } = await adminClient
      .from('categories')
      .select('description')
      .eq('slug', CONFIG_SLUG)
      .maybeSingle()

    if (data?.description) {
      const parsed = JSON.parse(data.description)
      return {
        free_shipping_threshold: Number(parsed.free_shipping_threshold) || DEFAULT_SHIPPING_CONFIG.free_shipping_threshold,
        standard_shipping_cost: Number(parsed.standard_shipping_cost) || DEFAULT_SHIPPING_CONFIG.standard_shipping_cost,
      }
    }
  } catch (err) {
    console.warn('Error reading shipping config, using default:', err)
  }

  return DEFAULT_SHIPPING_CONFIG
}

/**
 * Update shipping configuration (Admin Only)
 */
export async function updateShippingConfig(
  freeShippingThreshold: number,
  standardShippingCost: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const isAdminCookie = cookieStore.get('admin_session')?.value === 'authenticated'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const adminClient = createAdminClient()

    let isAuthorized = isAdminCookie
    if (!isAuthorized && user) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (profile?.role === 'admin') {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized: Admin access required.' }
    }

    const payload: ShippingConfig = {
      free_shipping_threshold: Math.max(0, Math.round(Number(freeShippingThreshold) || 0)),
      standard_shipping_cost: Math.max(0, Math.round(Number(standardShippingCost) || 0)),
    }

    const { error } = await adminClient
      .from('categories')
      .upsert(
        {
          slug: CONFIG_SLUG,
          name: 'System Shipping Config',
          description: JSON.stringify(payload),
          is_active: false,
        },
        { onConflict: 'slug' }
      )

    if (error) {
      return { success: false, error: error.message }
    }

    // Revalidate paths that use shipping calculations
    revalidatePath('/cart')
    revalidatePath('/checkout')
    revalidatePath('/admin/delivery-settings')
    revalidatePath('/admin/settings/shipping')
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update shipping settings.' }
  }
}
