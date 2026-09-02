import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react'

export const metadata = {
  title: 'Order Confirmed | Anisha Spices',
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const orderNumber = resolvedParams.order_number as string

  return (
    <div className="bg-[#FAF6F2] py-16 sm:py-24 min-h-screen flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-12 text-center shadow-xl shadow-stone-200/50">
          
          {/* Brand Logo & Success Badge */}
          <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#E5AD58] bg-black shadow-md">
              <Image
                src="/images/logo.jpeg"
                alt="Anisha Spices Logo"
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
            Order Confirmed!
          </h1>
          
          <p className="text-stone-600 text-sm mb-6 leading-relaxed">
            Thank you for choosing <strong>Anisha Spices</strong>. Your order for 100% pure authentic spices has been received and is being prepared with utmost care.
          </p>

          {orderNumber && (
            <div className="bg-[#FAF6F2] border border-[#E8DFD5] rounded-2xl p-5 mb-6 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-1">
                Order Reference
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-[#6B1118] tracking-wider">
                {orderNumber}
              </span>
            </div>
          )}

          {/* Delivery Note */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl mb-8 flex items-center gap-3 text-left">
            <Truck className="w-6 h-6 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 leading-relaxed">
              <strong>Doorstep Delivery:</strong> Your freshly packed spices will be dispatched soon. Expected delivery is within 2 to 4 working days.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/shop"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#6B1118] to-[#80121A] text-white font-bold text-sm rounded-xl hover:from-[#520C12] hover:to-[#6B1118] shadow-md shadow-[#6B1118]/20 transition-all duration-200"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link 
              href="/account/orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-50 text-stone-700 font-semibold text-sm rounded-xl border border-stone-200 hover:bg-stone-100 transition-all duration-200"
            >
              <Package className="w-4 h-4" />
              View Orders
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
