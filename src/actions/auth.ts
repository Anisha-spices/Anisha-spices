'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendSignupOtpEmail, sendPasswordResetEmail } from '@/lib/brevo'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export type AuthResult = {
  error?: string
  success?: boolean
}

// -------------------------------------------------------------
// Security Helpers: AES-256 Encryption for Temporary Signup Storage
// -------------------------------------------------------------
const ENCRYPTION_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || 'anisha-spices-secure-secret-key-32').slice(0, 32).padEnd(32, '0')
const IV_LENGTH = 16

function encryptPassword(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decryptPassword(text: string): string {
  const textParts = text.split(':')
  const iv = Buffer.from(textParts.shift()!, 'hex')
  const encryptedText = Buffer.from(textParts.join(':'), 'hex')
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  return decrypted.toString()
}

// -------------------------------------------------------------
// Cart Helper: Merge Guest Cart upon Login / Signup
// -------------------------------------------------------------
async function mergeGuestCart(userId: string) {
  const cookieStore = await cookies()
  const guestCartCookie = cookieStore.get('guest_cart')
  if (!guestCartCookie) return

  try {
    const guestCart = JSON.parse(guestCartCookie.value) as { variant_id: string; quantity: number }[]
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

    // Clear the guest cart cookie
    cookieStore.delete('guest_cart')
  } catch (err) {
    console.error('Failed to merge guest cart:', err)
  }
}

// =============================================================
// 1. SIGN UP FLOW (Step A: Request Verification OTP via Brevo)
// =============================================================
export async function requestSignupOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const fullName = (formData.get('full_name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!fullName || !email || !password) {
    return { error: 'Full name, email and password are all required.' }
  }

  if (fullName.length < 2) {
    return { error: 'Please enter a valid full name (at least 2 characters).' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Please provide a valid email address.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const adminClient = createAdminClient()

  // Check if an active account already exists with this email
  const { data: existingProfile } = await adminClient
    .from('profiles')
    .select('id')
    .ilike('email', email)
    .maybeSingle()

  if (existingProfile) {
    return { error: 'An account with this email already exists. Please sign in.' }
  }

  // Generate 6-digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const encrypted = encryptPassword(password)
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes

  // Clean up any stale unverified requests for this email
  await adminClient.from('auth_signup_otps').delete().ilike('email', email)

  // Insert temporary record
  const { error: insertError } = await adminClient.from('auth_signup_otps').insert([
    {
      email,
      full_name: fullName,
      encrypted_password: encrypted,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false,
    },
  ])

  if (insertError) {
    console.error('Failed to save signup OTP record:', insertError)
    return { error: 'Could not initiate registration. Please try again.' }
  }

  // Dispatch OTP email via Brevo
  const emailRes = await sendSignupOtpEmail({
    email,
    name: fullName,
    otp: otpCode,
  })

  if (!emailRes.success && !emailRes.simulated) {
    return { error: emailRes.error || 'Failed to send verification email. Please check your address.' }
  }

  return { success: true }
}

// =============================================================
// 1. SIGN UP FLOW (Step B: Verify OTP & Create Account)
// =============================================================
export async function verifySignupOtp(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const token = (formData.get('token') as string)?.trim()
  const redirectTo = (formData.get('redirectTo') as string) || '/'

  if (!email || !token) {
    return { error: 'Email and 6-digit verification code are required.' }
  }

  const adminClient = createAdminClient()

  // Fetch pending OTP record
  const { data: record, error: fetchError } = await adminClient
    .from('auth_signup_otps')
    .select('*')
    .ilike('email', email)
    .eq('verified', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchError || !record) {
    return { error: 'No pending registration found. Please request a new verification code.' }
  }

  // Check expiry
  if (new Date(record.expires_at) < new Date()) {
    return { error: 'Verification code has expired. Please request a new code.' }
  }

  // Check code match
  if (record.otp_code !== token) {
    // Increment attempts
    await adminClient
      .from('auth_signup_otps')
      .update({ attempts: (record.attempts || 0) + 1 })
      .eq('id', record.id)

    return { error: 'Invalid verification code. Please enter the 6-digit code sent to your email.' }
  }

  // Decrypt password
  let plainPassword = ''
  try {
    plainPassword = decryptPassword(record.encrypted_password)
  } catch (err) {
    console.error('Password decryption error:', err)
    return { error: 'An error occurred during account verification. Please try again.' }
  }

  // Create or update user in Supabase Auth (Pre-confirmed email, bypasses all Supabase email rate limits)
  let targetUserId = ''
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email: record.email,
    password: plainPassword,
    email_confirm: true,
    user_metadata: {
      full_name: record.full_name,
      role: 'customer',
    },
  })

  if (createError) {
    if (createError.message?.toLowerCase().includes('already been registered')) {
      const { data: existingUsers } = await adminClient.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        (u) => u.email?.toLowerCase() === record.email.toLowerCase()
      )
      if (existingUser) {
        targetUserId = existingUser.id
        await adminClient.auth.admin.updateUserById(targetUserId, {
          password: plainPassword,
          email_confirm: true,
          user_metadata: {
            full_name: record.full_name,
            role: 'customer',
          },
        })
      } else {
        return { error: createError.message }
      }
    } else {
      console.error('User creation failed:', createError)
      return { error: createError?.message || 'Failed to create user account.' }
    }
  } else {
    targetUserId = newUser.user.id
  }

  // Ensure customer profile is recorded in public.profiles
  await adminClient.from('profiles').upsert([
    {
      id: targetUserId,
      email: record.email,
      full_name: record.full_name,
      role: 'customer',
      phone: '',
      is_active: true,
    },
  ])

  // Remove used OTP record
  await adminClient.from('auth_signup_otps').delete().eq('id', record.id)

  // Sign in customer immediately
  const supabase = await createClient()
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: record.email,
    password: plainPassword,
  })

  if (signInError) {
    console.error('Sign-in after signup failed:', signInError)
    return { error: 'Account created, but could not log in automatically. Please sign in.' }
  }

  if (signInData.user) {
    await mergeGuestCart(signInData.user.id)
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

// =============================================================
// 2. REGULAR LOGIN FLOW (Instant Email + Password, 0 Emails Sent)
// =============================================================
export async function customerPasswordLogin(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const supabase = await createClient()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const redirectTo = (formData.get('redirectTo') as string) || '/'

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message || 'Invalid email or password.' }
  }

  if (data.user) {
    await mergeGuestCart(data.user.id)
  }

  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

// =============================================================
// 3. FORGOT PASSWORD FLOW (Step A: Send Reset Link via Brevo)
// =============================================================
export async function requestPasswordReset(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!email) {
    return { error: 'Please provide your account email address.' }
  }

  const adminClient = createAdminClient()

  // Verify account exists
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id, full_name, email')
    .ilike('email', email)
    .maybeSingle()

  if (!profile) {
    return { error: 'No account registered with this email address.' }
  }

  // Generate 64-char crypto token
  const resetToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes validity

  // Remove existing pending tokens for this email
  await adminClient.from('password_reset_tokens').delete().ilike('email', email)

  // Insert new token
  const { error: insertError } = await adminClient.from('password_reset_tokens').insert([
    {
      email,
      token: resetToken,
      used: false,
      expires_at: expiresAt,
    },
  ])

  if (insertError) {
    console.error('Failed to store password reset token:', insertError)
    return { error: 'Could not process password reset. Please try again.' }
  }

  // Construct URL
  const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const resetUrl = `${origin}/reset-password?token=${resetToken}`

  // Send branded email via Brevo
  const emailRes = await sendPasswordResetEmail({
    email,
    name: profile.full_name,
    resetUrl,
  })

  if (!emailRes.success && !emailRes.simulated) {
    return { error: emailRes.error || 'Failed to send password reset email.' }
  }

  return { success: true }
}

// =============================================================
// 3. FORGOT PASSWORD FLOW (Step B: Reset Password with Token)
// =============================================================
export async function resetPasswordWithToken(
  _prevState: AuthResult,
  formData: FormData
): Promise<AuthResult> {
  const token = (formData.get('token') as string)?.trim()
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!token) {
    return { error: 'Invalid or missing password reset token.' }
  }

  if (!password || !confirmPassword) {
    return { error: 'Please enter and confirm your new password.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match. Please verify and try again.' }
  }

  const adminClient = createAdminClient()

  // Validate token in database
  const { data: tokenRecord, error: tokenError } = await adminClient
    .from('password_reset_tokens')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .maybeSingle()

  if (tokenError || !tokenRecord) {
    return { error: 'This password reset link is invalid or has already been used.' }
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    return { error: 'This password reset link has expired. Please request a new one.' }
  }

  // Find user by email
  const { data: profile } = await adminClient
    .from('profiles')
    .select('id')
    .ilike('email', tokenRecord.email)
    .maybeSingle()

  if (!profile) {
    return { error: 'User account not found.' }
  }

  // Update password in Supabase Auth
  const { error: updateError } = await adminClient.auth.admin.updateUserById(profile.id, {
    password,
  })

  if (updateError) {
    console.error('Password update failed:', updateError)
    return { error: updateError.message || 'Failed to update password.' }
  }

  // Mark token as used
  await adminClient.from('password_reset_tokens').update({ used: true }).eq('id', tokenRecord.id)

  // Auto-login user with new password
  const supabase = await createClient()
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: tokenRecord.email,
    password,
  })

  if (signInError) {
    console.error('Auto-login after password reset failed:', signInError)
    return { error: 'Password updated successfully. Please sign in with your new password.' }
  }

  if (signInData.user) {
    await mergeGuestCart(signInData.user.id)
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

// =============================================================
// Admin Login & Logout (Preserved unchanged)
// =============================================================
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

  // 2. Supabase DB Authentication fallback
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

// Backward compatibility aliases
export const sendOtp = requestSignupOtp
export const verifyOtp = verifySignupOtp
