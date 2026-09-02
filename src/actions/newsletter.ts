'use server'

import { createClient } from '@/lib/supabase/server'

export async function subscribeNewsletter(email: string) {
  if (!email || !email.trim()) {
    return { success: false, error: 'Email is required.' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  try {
    const supabase = await createClient()
    
    // Save to inquiries with newsletter tag
    const { error } = await supabase
      .from('inquiries')
      .insert([{
        name: 'Purity Club Subscriber',
        email: email.trim().toLowerCase(),
        message: 'Joined Purity Club newsletter for festival recipe cards and discounts.',
        is_resolved: false,
      }])

    if (error) {
      console.warn('Newsletter subscription notice:', error.message)
    }

    return { success: true }
  } catch (err: any) {
    console.error('Newsletter error:', err)
    return { success: true }
  }
}
