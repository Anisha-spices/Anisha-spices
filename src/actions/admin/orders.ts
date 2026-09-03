'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function checkAdminAuth(supabase: any) {
  try {
    const cookieStore = await cookies()
    if (cookieStore.get('admin_session')?.value === 'authenticated') {
      return true
    }
  } catch {
    // Ignore
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return profile?.role === 'admin'
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = await createClient()
  
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized: Admin access required' }

  const updateData: any = { 
    order_status: status,
    updated_at: new Date().toISOString()
  }
  
  // Set timestamps based on new status
  if (status === 'shipped') updateData.shipped_at = new Date().toISOString()
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString()
  if (status === 'cancelled') updateData.cancelled_at = new Date().toISOString()

  // Use Admin client to reliably update orders bypassing RLS
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update order status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/account/orders')
  revalidatePath('/account')
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updatePaymentStatus(orderId: string, status: string) {
  const supabase = await createClient()
  
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized: Admin access required' }

  const updateData: any = { 
    payment_status: status,
    updated_at: new Date().toISOString()
  }
  
  // Set timestamps based on new status
  if (status === 'paid') updateData.paid_at = new Date().toISOString()

  // Use Admin client to reliably update orders bypassing RLS
  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Failed to update payment status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/orders')
  revalidatePath(`/admin/orders/${orderId}`)
  revalidatePath('/account/orders')
  revalidatePath('/account')
  revalidatePath('/', 'layout')
  return { success: true }
}
