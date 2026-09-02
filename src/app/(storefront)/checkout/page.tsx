import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getCart } from '@/actions/cart'
import { getShippingConfig } from '@/actions/shipping'
import { CheckoutClient } from './_components/CheckoutClient'

export const metadata = {
  title: 'Checkout | Anisha Spices',
}

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get Cart & Shipping Configuration in parallel
  const [{ items }, shippingConfig] = await Promise.all([
    getCart(),
    getShippingConfig(),
  ])

  if (!items || items.length === 0) {
    redirect('/cart')
  }

  // Get Addresses if authenticated
  let addresses = []
  if (user) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })
    if (data) addresses = data
  }

  return (
    <div className="bg-[#FAF6F2] py-8 sm:py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Checkout
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Complete your order with 100% pure authentic spices.
          </p>
        </div>

        <CheckoutClient 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          initialItems={items as any[]} 
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          addresses={addresses as any[]} 
          isAuthenticated={!!user}
          userEmail={user?.email || ''}
          shippingConfig={shippingConfig}
        />
      </div>
    </div>
  )
}
