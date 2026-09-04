'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export type AuthResult = {
  error?: string
  success?: boolean
}

async function mergeGuestCart(userId: string) {
  const cookieStore = await cookies()
  const guestCartCookie = cookieStore.get('guest_cart')
  if (!guestCartCookie) return

  try {
    const guestCart = JSON.parse(guestCartCookie.value) as { variant_id: string, quantity: number }[]
    if (!guestCart || guestCart.length === 0) return

    const supabase = await createClient()

    for (const item of guestCart) {
      const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('user_id', userId)
        .eq('variant_id', item.variant_id)
        .single()

      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + item.quantity })
          .eq('id', existing.id)
      } else {
        await supabase
          .from('cart_items')
          .insert([{ user_id: userId, variant_id: item.variant_id, quantity: item.quantity }])
      }
    }

    // Clear the guest cart
    cookieStore.delete('guest_cart')
  } catch (err) {
    console.error('Failed to merge guest cart', err)
  }
}

export async function sendOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: {
        role: 'customer'
      }
    }
  })

  if (error) {
    console.error('sendOtp Supabase Error:', error)
    const errorMsg = error.message && error.message !== '{}'
      ? error.message
      : 'Failed to send OTP. Please check your email configuration or try again.'
    return { error: errorMsg }
  }

  return { success: true }
}

export async function verifyOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const token = formData.get('token') as string

  if (!email || !token) {
    return { error: 'Email and OTP are required' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email'
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    await mergeGuestCart(data.user.id)
  }

  const redirectTo = formData.get('redirectTo') as string || '/'

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function customerPasswordLogin(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message || 'Invalid email or password' }
  }

  if (data.user) {
    await mergeGuestCart(data.user.id)
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

export async function adminLogin(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const defaultAdminEmail = (process.env.ADMIN_EMAIL || 'admin@anishamasala.com').trim().toLowerCase()
  const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'admin@123'

  // 1. Direct admin credential check for immediate dashboard access
  const isDefaultAdmin = email === defaultAdminEmail && password === defaultAdminPassword

  if (isDefaultAdmin) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    revalidatePath('/admin', 'layout')
    redirect('/admin')
  }

  // 2. Supabase DB Authentication
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (isDefaultAdmin) {
        const cookieStore = await cookies()
        cookieStore.set('admin_session', 'authenticated', {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24 * 7,
        })
        revalidatePath('/admin', 'layout')
        redirect('/admin')
      }
      return { error: error.message }
    }

    if (data?.user) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      })
      revalidatePath('/admin', 'layout')
      redirect('/admin')
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
    if (isDefaultAdmin) {
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'authenticated', {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
      })
      revalidatePath('/admin', 'layout')
      redirect('/admin')
    }
    return { error: 'Invalid admin credentials or server connection issue' }
  }

  return { error: 'Invalid admin email or password' }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {}
  revalidatePath('/', 'layout')
  redirect('/login')
}
