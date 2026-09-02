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

export async function getInquiries() {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return []

  // Use admin client to reliably bypass any Supabase RLS rules on the inquiries table
  const adminClient = createAdminClient()
  const { data } = await adminClient
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
}

export async function markInquiryAsRead(id: string) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('inquiries')
    .update({ is_resolved: true })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/inquiries')
  return { success: true }
}

export async function deleteInquiry(id: string) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('inquiries')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/admin/inquiries')
  return { success: true }
}
