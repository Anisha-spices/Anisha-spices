import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Clock, Truck, CheckCircle2, XCircle, MapPin, MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata = {
  title: 'My Orders & Live Tracking | Anisha Spices',
}

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed', desc: 'Received & Confirmed' },
  { key: 'processing', label: 'Packed', desc: 'Aroma-Lock Sealing' },
  { key: 'shipped', label: 'In Transit', desc: 'Handed to Courier' },
  { key: 'delivered', label: 'Delivered', desc: 'Enjoy Fresh Spices' },
]

function getStepIndex(status: string) {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 0
    case 'processing':
      return 1
    case 'shipped':
      return 2
    case 'delivered':
      return 3
    default:
      return 0
  }
}

export default async function AccountOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const cookieStore = await cookies()
  const hasAdminCookie = cookieStore.get('admin_session')?.value === 'authenticated'

  if (!user && !hasAdminCookie) {
    redirect('/login')
  }

  const adminClient = createAdminClient()

  let effectiveUserId = user?.id || null
  let effectiveEmail = (user?.email || '').trim().toLowerCase()

  if (!effectiveUserId && hasAdminCookie) {
    const { data: adminProfile } = await adminClient
      .from('profiles')
      .select('id, email')
      .eq('role', 'admin')
      .maybeSingle()

    if (adminProfile) {
      effectiveUserId = adminProfile.id
      effectiveEmail = (adminProfile.email || '').trim().toLowerCase()
    }
  }

  // Check if current user is admin
  let isStoreAdmin = hasAdminCookie
  if (!isStoreAdmin && effectiveUserId) {
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .eq('id', effectiveUserId)
      .maybeSingle()
    if (profile?.role === 'admin') {
      isStoreAdmin = true
    }
  }

  // Fetch all orders with items and addresses via admin client (bypasses RLS so customer's guest/email orders are never hidden)
  const { data: allOrders } = await adminClient
    .from('orders')
    .select(`
      *,
      order_items (*),
      addresses:address_id (*)
    `)
    .order('created_at', { ascending: false })

  // Match orders:
  // - If store admin: show all orders so store owner can track all customer orders
  // - If customer: match by user_id OR by shipping_address email
  const orders = (allOrders || []).filter((order) => {
    if (isStoreAdmin) return true

    if (effectiveUserId && order.user_id === effectiveUserId) return true

    const orderEmail = order.shipping_address?.email?.trim().toLowerCase()
    if (effectiveEmail && orderEmail && orderEmail === effectiveEmail) return true

    return false
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📦</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">My Orders & Tracking</h1>
            </div>
            <p className="text-xs sm:text-sm text-[#8C7567]">
              Track your spice deliveries in real-time from our facility to your kitchen.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 self-start sm:self-center px-5 py-2.5 rounded-full bg-[#7B111A] text-white text-xs font-bold hover:bg-[#520C12] transition-colors shadow-xs"
          >
            <span>Explore Spices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-[#E8DFD5] shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF6F2] border border-[#E8DFD5] text-[#7B111A] flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2A1612]">No Orders Placed Yet</h3>
          <p className="text-xs sm:text-sm text-[#8C7567] max-w-sm mx-auto mt-1.5 mb-6">
            You haven&rsquo;t ordered any pure spices yet. Add authentic handpicked spices to your kitchen!
          </p>
          <Link 
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#7B111A] text-white text-sm font-bold rounded-full hover:bg-[#520C12] shadow-md shadow-[#7B111A]/20 transition-all active:scale-95"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStep = getStepIndex(order.order_status)
            const isCancelled = order.order_status === 'cancelled'
            const shippingAddr = order.shipping_address || order.addresses

            return (
              <div
                key={order.id}
                className="bg-white border border-[#E8DFD5] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Order Top Summary Bar */}
                <div className="bg-[#FAF6F2] p-5 sm:p-6 border-b border-[#E8DFD5] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7567] block mb-0.5">
                        Order Placed
                      </span>
                      <p className="text-xs sm:text-sm font-bold text-[#2A1612]">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7567] block mb-0.5">
                        Total Amount
                      </span>
                      <p className="text-xs sm:text-sm font-extrabold text-[#7B111A]">
                        ₹{order.total_amount}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C7567] block mb-0.5">
                        Order Number
                      </span>
                      <p className="text-xs sm:text-sm font-mono font-bold text-[#2A1612]">
                        {order.order_number}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      isCancelled 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : order.order_status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        isCancelled ? 'bg-rose-500' : order.order_status === 'delivered' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                      }`} />
                      {order.order_status}
                    </span>
                  </div>
                </div>

                {/* 📍 LIVE ORDER TRACKING PROGRESS BAR */}
                {!isCancelled && (
                  <div className="p-5 sm:p-6 bg-white border-b border-[#E8DFD5]/80">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2A1612] flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#7B111A]" />
                        <span>Live Delivery Tracker</span>
                      </h4>
                      <span className="text-xs font-semibold text-[#7B111A]">
                        {order.order_status === 'delivered' 
                          ? 'Delivered to your doorstep' 
                          : order.order_status === 'shipped' 
                          ? 'Package is in transit' 
                          : 'Processing at our spice mill'}
                      </span>
                    </div>

                    {/* Step Timeline */}
                    <div className="relative pt-2 pb-1">
                      {/* Background connecting bar */}
                      <div className="absolute top-6 left-6 right-6 h-1 bg-stone-200 rounded-full" />
                      {/* Active filled connecting bar */}
                      <div
                        className="absolute top-6 left-6 h-1 bg-[#7B111A] rounded-full transition-all duration-500"
                        style={{ width: `${(currentStep / (ORDER_STEPS.length - 1)) * 100}%` }}
                      />

                      <div className="relative flex justify-between">
                        {ORDER_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep
                          const isCurrent = idx === currentStep

                          return (
                            <div key={step.key} className="flex flex-col items-center text-center max-w-[85px] sm:max-w-none">
                              <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all z-10 ${
                                  isDone
                                    ? 'bg-[#7B111A] text-white shadow-md shadow-[#7B111A]/25'
                                    : 'bg-white border-2 border-stone-300 text-stone-400'
                                } ${isCurrent ? 'ring-4 ring-[#C89B65]/30' : ''}`}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              <span className={`text-[11px] sm:text-xs font-bold mt-2 leading-tight ${isDone ? 'text-[#2A1612]' : 'text-stone-400'}`}>
                                {step.label}
                              </span>
                              <span className="text-[10px] text-[#8C7567] hidden sm:block mt-0.5">
                                {step.desc}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Details: Items + Shipping Address */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Ordered Items (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <span className="text-xs uppercase font-bold tracking-wider text-[#8C7567] block mb-2">
                      Items in Package ({order.order_items?.length || 0})
                    </span>

                    <div className="divide-y divide-[#F2E8DC] border border-[#E8DFD5] rounded-2xl overflow-hidden bg-[#FAF6F2]/40">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="p-3.5 flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs sm:text-sm font-bold text-[#2A1612] truncate">
                              {item.product_name}
                            </h5>
                            <p className="text-xs text-[#8C7567] mt-0.5 font-medium">
                              Pack: <span className="text-[#2A1612]">{item.variant_name}</span> · Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs sm:text-sm font-extrabold text-[#7B111A]">
                              ₹{item.line_total}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Shipping Address & WhatsApp Help (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Shipping Address Box */}
                    <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5]">
                      <div className="flex items-center gap-1.5 text-xs uppercase font-bold tracking-wider text-[#8C7567] mb-2">
                        <MapPin className="w-3.5 h-3.5 text-[#7B111A]" />
                        <span>Delivery Destination</span>
                      </div>
                      {shippingAddr ? (
                        <div className="text-xs text-[#5A433B] space-y-0.5">
                          <p className="font-bold text-[#2A1612] text-sm">{shippingAddr.full_name}</p>
                          <p>{shippingAddr.address_line_1}</p>
                          {shippingAddr.address_line_2 && <p>{shippingAddr.address_line_2}</p>}
                          <p>{shippingAddr.city}, {shippingAddr.state} - {shippingAddr.postal_code}</p>
                          <p className="pt-1.5 font-semibold text-[#2A1612]">Phone: {shippingAddr.phone}</p>
                        </div>
                      ) : (
                        <p className="text-xs text-[#8C7567] italic">Address registered on file.</p>
                      )}
                    </div>

                    {/* WhatsApp Help / Support Button */}
                    <a
                      href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi Anisha Spices, I need an update on my order #${order.order_number}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Need help? Chat on WhatsApp</span>
                    </a>
                  </div>

                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
