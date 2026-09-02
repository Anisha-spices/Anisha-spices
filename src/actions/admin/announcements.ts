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

export async function getAnnouncement() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return null
    }

    return data || null
  } catch {
    return null
  }
}

export async function saveAnnouncement(message: string, isActive: boolean) {
  const supabase = await createClient()

  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  try {
    const adminSupabase = createAdminClient()
    const existing = await getAnnouncement()

    if (existing) {
      const { error } = await adminSupabase
        .from('announcements')
        .update({
          message,
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (error) return { success: false, error: error.message }
    } else {
      const { error } = await adminSupabase
        .from('announcements')
        .insert([{ message, is_active: isActive }])

      if (error) return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/admin/announcements')

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to save announcement' }
  }
}
