'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export type ChatbotOption = {
  id: string
  label: string
  type: 'track_order' | 'faq_answer' | 'whatsapp'
  answer?: string
  is_active: boolean
  display_order: number
}

export type ChatbotConfig = {
  bot_name: string
  welcome_title: string
  welcome_subtitle: string
  whatsapp_number: string
  whatsapp_message: string
  options: ChatbotOption[]
}

const DEFAULT_CHATBOT_CONFIG: ChatbotConfig = {
  bot_name: 'Anisha Spices Assistant',
  welcome_title: 'Namaste! Welcome to Anisha Spices 🌿',
  welcome_subtitle: 'How can we help you today? Select any option below for instant answers:',
  whatsapp_number: '919540048786',
  whatsapp_message: 'Hi Anisha Spices, I have a query regarding my order / spices.',
  options: [
    {
      id: 'opt_track',
      label: '📦 Track My Order',
      type: 'track_order',
      is_active: true,
      display_order: 1,
    },
    {
      id: 'opt_shipping',
      label: '🚚 Delivery Timelines & Charges',
      type: 'faq_answer',
      answer: `• Free Shipping: All orders above ₹500 enjoy free delivery across India.\n• Metro Cities: Delivery within 2-3 business days (Delhi NCR, Mumbai, Bengaluru, etc.).\n• Rest of India: Delivery within 3-5 business days.\n• Payment Modes: Cash on Delivery (COD) and all online UPI/Cards are supported.`,
      is_active: true,
      display_order: 2,
    },
    {
      id: 'opt_purity',
      label: '🌿 Spice Purity & Cold Grinding',
      type: 'faq_answer',
      answer: `• 100% Pure & Authentic: Zero artificial food coloring, zero starch, and no artificial preservatives.\n• Cold-Ground Technology: Ground at low temperatures so essential aromatic oils remain preserved.\n• Direct Farm Sourcing: Single-origin Salem Turmeric, Guntur Red Chillies, and Gujarat Saurashtra Cumin.`,
      is_active: true,
      display_order: 3,
    },
    {
      id: 'opt_bulk',
      label: '💼 Wholesale & Bulk Inquiries',
      type: 'faq_answer',
      answer: `We supply authentic whole and ground spices to premium restaurants, cloud kitchens, and retailers at special B2B wholesale pricing. Please reach out to our team for bulk inquiries!`,
      is_active: true,
      display_order: 4,
    },
  ],
}

const CONFIG_SLUG = '__system_chatbot_config__'

/**
 * Get current chatbot configuration
 * Always returns a valid configuration with defaults
 */
export async function getChatbotConfig(): Promise<ChatbotConfig> {
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
        bot_name: parsed.bot_name || DEFAULT_CHATBOT_CONFIG.bot_name,
        welcome_title: parsed.welcome_title || DEFAULT_CHATBOT_CONFIG.welcome_title,
        welcome_subtitle: parsed.welcome_subtitle || DEFAULT_CHATBOT_CONFIG.welcome_subtitle,
        whatsapp_number: parsed.whatsapp_number || DEFAULT_CHATBOT_CONFIG.whatsapp_number,
        whatsapp_message: parsed.whatsapp_message || DEFAULT_CHATBOT_CONFIG.whatsapp_message,
        options: Array.isArray(parsed.options) && parsed.options.length > 0
          ? parsed.options
          : DEFAULT_CHATBOT_CONFIG.options,
      }
    }
  } catch (err) {
    console.warn('Error reading chatbot config, using default:', err)
  }

  return DEFAULT_CHATBOT_CONFIG
}

/**
 * Update chatbot configuration (Admin Only)
 */
export async function updateChatbotConfig(
  config: ChatbotConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const isAdminCookie = cookieStore.get('admin_session')?.value === 'authenticated'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let isAuthorized = isAdminCookie
    if (!isAuthorized && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (profile?.role === 'admin') isAuthorized = true
    }

    if (!isAuthorized) {
      return { success: false, error: 'Unauthorized: Admin access required.' }
    }

    const adminClient = createAdminClient()

    // Upsert into system configuration
    const { error } = await adminClient
      .from('categories')
      .upsert({
        slug: CONFIG_SLUG,
        name: 'System Chatbot Configuration',
        description: JSON.stringify(config),
        is_active: false,
      }, { onConflict: 'slug' })

    if (error) {
      console.error('Error saving chatbot config:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    revalidatePath('/admin/settings/chatbot')
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update chatbot configuration.' }
  }
}

export type OrderTrackingResult = {
  found: boolean
  order_number?: string
  order_status?: string
  payment_status?: string
  payment_method?: string
  total_amount?: number
  created_at?: string
  items_summary?: string
  message?: string
}

/**
 * Live Order Tracking for Chatbot
 * Supports automatic lookup for logged-in user or by specific Order ID / Phone number
 */
export async function trackOrderForChatbot(
  searchQuery?: string
): Promise<OrderTrackingResult> {
  try {
    const adminClient = createAdminClient()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let queryBuilder = adminClient
      .from('orders')
      .select(`
        id,
        order_number,
        order_status,
        payment_status,
        payment_method,
        total_amount,
        created_at,
        order_items (
          product_name,
          variant_name,
          quantity
        )
      `)

    const cleanSearch = searchQuery?.trim()

    if (cleanSearch) {
      // 1. Search by Order Number or Phone number
      if (/^[6-9]\d{9}$/.test(cleanSearch.replace(/\D/g, ''))) {
        const cleanPhone = cleanSearch.replace(/\D/g, '')
        queryBuilder = queryBuilder
          .filter('shipping_address->>phone', 'eq', cleanPhone)
          .order('created_at', { ascending: false })
          .limit(1)
      } else {
        queryBuilder = queryBuilder
          .ilike('order_number', `%${cleanSearch}%`)
          .order('created_at', { ascending: false })
          .limit(1)
      }
    } else if (user?.id) {
      // 2. Fetch latest order for logged-in user
      queryBuilder = queryBuilder
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
    } else {
      return {
        found: false,
        message: 'Please enter your Order ID (e.g. AS-XXXX) or 10-digit mobile number.',
      }
    }

    const { data, error } = await queryBuilder.maybeSingle()

    if (error || !data) {
      return {
        found: false,
        message: cleanSearch
          ? `No order found matching "${cleanSearch}". Please double-check your Order ID or phone number.`
          : 'No previous orders found for your account.',
      }
    }

    // Format items summary
    const items = data.order_items || []
    const itemsSummary = items.length > 0
      ? items.map((it: any) => `${it.quantity}x ${it.product_name} (${it.variant_name})`).join(', ')
      : 'Authentic Spices'

    return {
      found: true,
      order_number: data.order_number,
      order_status: data.order_status,
      payment_status: data.payment_status,
      payment_method: data.payment_method,
      total_amount: Number(data.total_amount || 0),
      created_at: data.created_at,
      items_summary: itemsSummary,
    }
  } catch (err: any) {
    console.error('Error tracking order for chatbot:', err)
    return {
      found: false,
      message: 'Unable to track order right now. Please try again or contact support.',
    }
  }
}
