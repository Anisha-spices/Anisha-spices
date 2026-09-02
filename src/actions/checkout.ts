'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCart } from '@/actions/cart'
import { getShippingConfig } from '@/actions/shipping'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import Razorpay from 'razorpay'
import crypto from 'crypto'

// Initialize Razorpay
let razorpayInstance: any = null
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
} catch (e) {
  console.warn('Razorpay credentials missing or invalid')
}

export type ShippingAddressInput = {
  full_name: string
  phone: string
  email?: string
  address_line_1: string
  address_line_2?: string | null
  city: string
  state: string
  postal_code: string
  country?: string
}

export async function createOrder(
  addressInput: string | ShippingAddressInput,
  paymentMethod: 'COD' | 'RAZORPAY'
) {
  try {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Check user authentication
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Fetch cart items (works for both authenticated and guest users)
    const cartRes = await getCart()
    const items = cartRes.items || []

    if (items.length === 0) {
      return { success: false, error: 'Your cart is empty. Please add items to proceed.' }
    }

    // 3. Resolve shipping address snapshot
    let shippingAddressSnapshot: any = null
    let addressId: string | null = null

    if (typeof addressInput === 'string') {
      // Saved address selected by ID
      addressId = addressInput
      if (!user) {
        return { success: false, error: 'Session expired. Please re-enter your address.' }
      }

      const { data: address } = await supabase
        .from('addresses')
        .select('*')
        .eq('id', addressInput)
        .single()

      if (!address) {
        return { success: false, error: 'Invalid shipping address selected.' }
      }

      shippingAddressSnapshot = {
        full_name: address.full_name,
        phone: address.phone,
        email: user.email || '',
        address_line_1: address.address_line_1,
        address_line_2: address.address_line_2 || null,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country || 'India',
      }
    } else {
      // Direct Address Form Input
      if (!addressInput.full_name || !addressInput.phone || !addressInput.address_line_1 || !addressInput.city || !addressInput.postal_code) {
        return { success: false, error: 'Please fill in all required shipping fields.' }
      }

      shippingAddressSnapshot = {
        full_name: addressInput.full_name.trim(),
        phone: addressInput.phone.trim(),
        email: addressInput.email?.trim() || user?.email || '',
        address_line_1: addressInput.address_line_1.trim(),
        address_line_2: addressInput.address_line_2?.trim() || null,
        city: addressInput.city.trim(),
        state: addressInput.state.trim(),
        postal_code: addressInput.postal_code.trim(),
        country: addressInput.country || 'India',
      }

      // If user is logged in, optionally save this address for future 1-click checkout
      if (user) {
        try {
          const { data: savedAddr } = await supabase
            .from('addresses')
            .insert([{
              user_id: user.id,
              full_name: shippingAddressSnapshot.full_name,
              phone: shippingAddressSnapshot.phone,
              address_line_1: shippingAddressSnapshot.address_line_1,
              address_line_2: shippingAddressSnapshot.address_line_2,
              city: shippingAddressSnapshot.city,
              state: shippingAddressSnapshot.state,
              postal_code: shippingAddressSnapshot.postal_code,
              country: 'India',
              is_default: false,
            }])
            .select('id')
            .single()

          if (savedAddr) {
            addressId = savedAddr.id
          }
        } catch (e) {
          console.warn('Could not auto-save address for user:', e)
        }
      }
    }

    // 4. Determine user_id to assign to order
    let targetUserId: string | null = null
    const checkoutEmail = shippingAddressSnapshot.email?.trim().toLowerCase()

    // A) If current logged-in user matches the checkout email, attach to current user
    if (user && user.email?.trim().toLowerCase() === checkoutEmail) {
      targetUserId = user.id
    } else if (checkoutEmail) {
      // B) If customer entered an email, check if an existing profile exists for that email
      const { data: matchedProfile } = await adminClient
        .from('profiles')
        .select('id')
        .ilike('email', checkoutEmail)
        .maybeSingle()

      if (matchedProfile) {
        targetUserId = matchedProfile.id
      }
    }

    // C) If still not assigned and an authenticated user session is active
    if (!targetUserId && user?.id) {
      targetUserId = user.id
    }

    // D) Fallback: dynamically fetch a customer profile from DB so foreign key constraint is satisfied
    if (!targetUserId) {
      const { data: fallbackProfile } = await adminClient
        .from('profiles')
        .select('id')
        .eq('role', 'customer')
        .limit(1)
        .maybeSingle()

      targetUserId = fallbackProfile?.id || null
    }

    // 5. Calculate totals securely
    let subtotal = 0
    const orderItemsToInsert: any[] = []

    for (const item of items) {
      const variant: any = item.product_variants
      if (!variant) continue

      const product = Array.isArray(variant.products) ? variant.products[0] : variant.products

      const price = Number(variant.price || 0)
      const quantity = Number(item.quantity || 1)
      const lineTotal = price * quantity

      subtotal += lineTotal

      orderItemsToInsert.push({
        product_id: product?.id || variant.product_id,
        variant_id: variant.id,
        product_name: product?.name || 'Spice Product',
        variant_name: variant.variant_name || 'Standard Pack',
        price_at_purchase: price,
        quantity: quantity,
        line_total: lineTotal,
      })
    }

    const shippingConfig = await getShippingConfig()
    const shipping_cost = subtotal >= shippingConfig.free_shipping_threshold ? 0 : shippingConfig.standard_shipping_cost
    const total_amount = subtotal + shipping_cost

    // Generate readable order number
    const order_number = `AS-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    const actualPaymentMethod = paymentMethod === 'RAZORPAY' ? 'Online Payment (Razorpay)' : 'Cash on Delivery (COD)'

    // 6. Insert Order via Admin Client to prevent any RLS issues
    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert([{
        order_number,
        user_id: targetUserId,
        address_id: addressId,
        shipping_address: shippingAddressSnapshot,
        subtotal,
        shipping_cost,
        total_amount,
        payment_status: 'pending',
        order_status: 'pending',
        payment_method: actualPaymentMethod,
      }])
      .select('id, order_number')
      .single()

    if (orderError || !order) {
      console.error('Failed to create order:', orderError)
      return { success: false, error: orderError?.message || 'Failed to place order. Please try again.' }
    }

    // 7. Insert Order Items
    const itemsWithOrderId = orderItemsToInsert.map(item => ({
      ...item,
      order_id: order.id,
    }))

    const { error: itemsError } = await adminClient
      .from('order_items')
      .insert(itemsWithOrderId)

    if (itemsError) {
      console.error('Failed to insert order items:', itemsError)
      // Even if items had an issue, order is logged, but return clean message
      return { success: false, error: 'Order item processing failed. Please contact support.' }
    }

    // 8. Handle Payment Method Specific Logic
    if (paymentMethod === 'RAZORPAY') {
      if (!razorpayInstance) {
        return { 
          success: false, 
          error: 'Online Payment Gateway is currently under maintenance. Please select Cash on Delivery (COD) to place your order!' 
        }
      }

      try {
        const options = {
          amount: Math.round(total_amount * 100),
          currency: 'INR',
          receipt: order.id,
          payment_capture: 1,
        }

        const rzpOrder = await razorpayInstance.orders.create(options)

        return {
          success: true,
          isRazorpay: true,
          razorpayOrderId: rzpOrder.id,
          orderId: order.id,
          orderNumber: order.order_number,
          amount: options.amount,
        }
      } catch (err: any) {
        console.error('Razorpay Error:', err)
        return { 
          success: false, 
          error: 'Online payment could not be initialized. Please choose Cash on Delivery (COD).' 
        }
      }
    }

    // 9. COD Flow: Clear cart
    // Clear user cart if authenticated
    if (user) {
      await adminClient
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
    }

    // Clear guest cart cookie
    try {
      const cookieStore = await cookies()
      cookieStore.delete('guest_cart')
    } catch (e) {
      console.warn('Could not clear guest cart cookie:', e)
    }

    revalidatePath('/cart')
    revalidatePath('/checkout')
    revalidatePath('/account/orders')
    revalidatePath('/admin/orders')

    return {
      success: true,
      isRazorpay: false,
      order_number: order.order_number,
      orderId: order.id,
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    return { success: false, error: error.message || 'Something went wrong while placing your order.' }
  }
}

export async function verifyRazorpayPayment(
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string,
  internal_order_id: string
) {
  try {
    const adminClient = createAdminClient()

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) return { success: false, error: 'Razorpay secret not configured' }

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex')

    if (generated_signature !== razorpay_signature) {
      return { success: false, error: 'Payment verification failed: Invalid signature' }
    }

    // Update order status to paid
    const { error: updateError } = await adminClient
      .from('orders')
      .update({
        payment_status: 'paid',
        order_status: 'processing',
        razorpay_payment_id,
        razorpay_order_id,
      })
      .eq('id', internal_order_id)

    if (updateError) {
      console.error('Failed to update order status:', updateError)
      return { success: false, error: 'Failed to update order payment status' }
    }

    // Clear user and guest cart
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await adminClient
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
    }

    const cookieStore = await cookies()
    cookieStore.delete('guest_cart')

    revalidatePath('/cart')
    revalidatePath('/checkout')
    revalidatePath('/account/orders')
    revalidatePath('/admin/orders')

    return { success: true }
  } catch (err: any) {
    console.error('Payment verification error:', err)
    return { success: false, error: 'Payment verification failed.' }
  }
}
