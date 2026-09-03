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

// Global Text
export async function updateGlobalHeroText(data: {
  title: string
  subtitle: string
  button_text: string
  button_link: string
}) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('hero_slides')
    .update({
      title: data.title,
      subtitle: data.subtitle,
      button_text: data.button_text,
      button_link: data.button_link,
      updated_at: new Date().toISOString()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}

export async function updateHeroTextMode(mode: 'global' | 'per_slide') {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('hero_slides')
    .update({
      text_mode: mode,
      updated_at: new Date().toISOString()
    })
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}

export async function updateHeroSlideText(id: string, data: {
  title: string
  subtitle: string
  button_text: string
  button_link: string
}) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('hero_slides')
    .update({
      title: data.title,
      subtitle: data.subtitle,
      button_text: data.button_text,
      button_link: data.button_link,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}

export async function getHeroSlides() {
  const adminClient = createAdminClient()
  
  const { data } = await adminClient
    .from('hero_slides')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })

  return data || []
}

export async function createHeroSlide(imageUrl: string, globalText?: any) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { count } = await adminClient
    .from('hero_slides')
    .select('*', { count: 'exact', head: true })

  if (count && count >= 5) {
    return { success: false, error: 'Maximum 5 slides allowed.' }
  }

  const { error } = await adminClient
    .from('hero_slides')
    .insert([{
      image_url: imageUrl,
      title: globalText?.title || '',
      subtitle: globalText?.subtitle || '',
      button_text: globalText?.button_text || '',
      button_link: globalText?.button_link || '',
      text_mode: globalText?.text_mode || 'global',
      is_active: true,
      display_order: count || 0
    }])

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}

export async function deleteHeroSlide(id: string) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('hero_slides')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}

export async function toggleHeroSlideStatus(id: string, isActive: boolean) {
  const supabase = await createClient()
  const isAdmin = await checkAdminAuth(supabase)
  if (!isAdmin) return { success: false, error: 'Unauthorized' }

  const adminClient = createAdminClient()
  const { error } = await adminClient
    .from('hero_slides')
    .update({ is_active: isActive })
    .eq('id', id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/hero-slides')
  return { success: true }
}
