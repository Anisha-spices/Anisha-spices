import { Navbar } from '@/components/storefront/Navbar'
import { Footer } from '@/components/storefront/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { getCartCount } from '@/actions/cart'
import { AnnouncementBar } from '@/components/storefront/AnnouncementBar'
import { FloatingContact } from '@/components/storefront/FloatingContact'
import { MobileBottomBar } from '@/components/storefront/MobileBottomBar'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const metadata = {
  title: {
    template: '%s | Anisha Spices',
    default: 'Anisha Spices | Pure Spice. Real Taste. Trusted Every Time.',
  },
  description: 'Bringing the authentic, rich flavors and uncompromised purity of traditional Indian spices right to your kitchen.',
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let cartCount = 0
  let isLoggedIn = false
  let categories: { name: string; slug: string }[] = []

  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    const hasAuthCookie = allCookies.some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'))

    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('categories')
        .select('name, slug')
        .eq('is_active', true)
        .order('name')
      if (data && data.length > 0) {
        categories = data
      }
    } catch {
      // Fallback
    }

    cartCount = await getCartCount()

    if (hasAuthCookie) {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      isLoggedIn = !!data?.user
    }
  } catch {
    // Safe offline fallback
  }

  return (
    <CartProvider initialCount={cartCount}>
      <div className="min-h-screen flex flex-col bg-[#F8ECE7]">
        <AnnouncementBar />
        <Navbar isLoggedIn={isLoggedIn} categories={categories} />
        <main className="flex-grow pb-16 lg:pb-0">{children}</main>
        <Footer />
        <FloatingContact />
        <MobileBottomBar categories={categories} />
      </div>
    </CartProvider>
  )
}
