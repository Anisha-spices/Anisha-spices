'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export type AdminActionResult = {
  error?: string
  success?: boolean
}

export async function getCustomers() {
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

  if (!isAuthorized) return []

  // 1. Fetch registered customer profiles
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('*')
    .eq('role', 'customer')
    .order('created_at', { ascending: false })

  // 2. Fetch all orders to include ordering customers
  const { data: orders } = await adminClient
    .from('orders')
    .select('id, user_id, shipping_address, created_at')
    .order('created_at', { ascending: false })

  const customerMap = new Map<string, any>()

  // Add registered customer profiles
  profiles?.forEach((p) => {
    const emailKey = p.email?.trim().toLowerCase()
    if (emailKey) {
      customerMap.set(emailKey, {
        id: p.id,
        full_name: p.full_name || 'Customer',
        email: p.email,
        phone: p.phone || '',
        role: 'customer',
        is_active: p.is_active ?? true,
        created_at: p.created_at,
        orders_count: 0,
      })
    }
  })

  const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@anishamasala.com').trim().toLowerCase()

  // Add or augment with order history
  orders?.forEach((o) => {
    const emailKey = o.shipping_address?.email?.trim().toLowerCase()
    if (emailKey && emailKey !== defaultAdminEmail) {
      if (customerMap.has(emailKey)) {
        const existing = customerMap.get(emailKey)
        existing.orders_count = (existing.orders_count || 0) + 1
        if (!existing.phone && o.shipping_address?.phone) {
          existing.phone = o.shipping_address.phone
        }
      } else {
        // Customer who ordered with shipping details
        customerMap.set(emailKey, {
          id: o.user_id || o.id,
          full_name: o.shipping_address?.full_name || 'Customer',
          email: o.shipping_address?.email || emailKey,
          phone: o.shipping_address?.phone || '',
          role: 'customer',
          is_active: true,
          created_at: o.created_at,
          orders_count: 1,
        })
      }
    }
  })

  return Array.from(customerMap.values())
}

export async function toggleCustomerStatus(
  id: string,
  isActive: boolean
): Promise<AdminActionResult> {
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

  if (!isAuthorized) return { error: 'Unauthorized' }

  const { error } = await adminClient
    .from('profiles')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('role', 'customer')

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/customers')
  return { success: true }
}
