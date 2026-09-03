import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, MapPin, Package, CreditCard } from 'lucide-react'
import { OrderStatusManager } from '../_components/OrderStatusManager'

export const metadata = {
  title: 'Order Details | Admin Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const orderId = resolvedParams.id
  const cookieStore = await cookies()
  const isAdminCookie = cookieStore.get('admin_session')?.value === 'authenticated'
  const supabase = isAdminCookie ? createAdminClient() : await createClient()

  // Fetch Order Details
  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      profiles:user_id (
        full_name,
        email,
        phone
      ),
      addresses:address_id (
        full_name,
        phone,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code
      ),
      order_items (*)
    `)
    .eq('id', orderId)
    .single()

  if (!order) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders"
            className="p-2 bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-stone-900">Order {order.order_number}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                order.order_status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                order.order_status === 'shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                order.order_status === 'processing' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                order.order_status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
                {order.order_status}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border uppercase tracking-wider ${
                order.payment_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                order.payment_status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-stone-100 text-stone-600 border-stone-200'
              }`}>
                Payment: {order.payment_status}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Details & Items */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-stone-400" />
                Customer
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-stone-900">{order.profiles?.full_name || 'Guest'}</p>
                <p className="text-stone-600">{order.profiles?.email}</p>
                {order.profiles?.phone && <p className="text-stone-600">{order.profiles.phone}</p>}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-stone-400" />
                Shipping Address
              </h3>
              {order.shipping_address || order.addresses ? (
                (() => {
                  const addr = order.shipping_address || order.addresses
                  return (
                    <div className="space-y-1 text-sm text-stone-600">
                      <p className="font-medium text-stone-900 mb-1">{addr.full_name}</p>
                      <p>{addr.address_line_1}</p>
                      {addr.address_line_2 && <p>{addr.address_line_2}</p>}
                      <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                      <p className="mt-2 pt-2 border-t border-stone-100">Phone: {addr.phone}</p>
                    </div>
                  )
                })()
              ) : (
                <p className="text-sm text-stone-500 italic">No address details available.</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 overflow-hidden">
            <div className="p-6 border-b border-stone-200/60 flex items-center gap-2">
              <Package className="w-5 h-5 text-stone-400" />
              <h3 className="text-lg font-bold text-stone-900">Order Items</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-xs">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Product</th>
                    <th className="px-6 py-4 font-semibold">Variant</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Qty</th>
                    <th className="px-6 py-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {order.order_items?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-stone-900">{item.product_name}</td>
                      <td className="px-6 py-4 text-stone-600">{item.variant_name}</td>
                      <td className="px-6 py-4 text-stone-600">₹{item.price_at_purchase}</td>
                      <td className="px-6 py-4 text-stone-600">{item.quantity}</td>
                      <td className="px-6 py-4 font-medium text-stone-900 text-right">₹{item.line_total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Status & Summary */}
        <div className="space-y-6">
          
          <OrderStatusManager 
            orderId={order.id} 
            initialOrderStatus={order.order_status}
            initialPaymentStatus={order.payment_status}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-stone-400" />
              Payment Summary
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                {order.shipping_cost === 0 ? (
                  <span className="font-medium text-green-600">Free</span>
                ) : (
                  <span className="font-medium text-stone-900">₹{order.shipping_cost}</span>
                )}
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                <span className="font-bold text-stone-900">Total</span>
                <span className="text-xl font-bold text-orange-600">₹{order.total_amount}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-200">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Payment Method</p>
              <p className="text-sm font-medium text-stone-900">{order.payment_method}</p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/60 p-6">
            <h3 className="text-lg font-bold text-stone-900 mb-6">Timeline</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Order Placed</span>
                <span className="font-medium text-stone-900">
                  {new Date(order.created_at).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              {order.paid_at && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Paid</span>
                  <span className="font-medium text-stone-900">
                    {new Date(order.paid_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {order.shipped_at && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Shipped</span>
                  <span className="font-medium text-stone-900">
                    {new Date(order.shipped_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {order.delivered_at && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivered</span>
                  <span className="font-medium text-stone-900">
                    {new Date(order.delivered_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              {order.cancelled_at && (
                <div className="flex justify-between text-red-600">
                  <span>Cancelled</span>
                  <span className="font-medium">
                    {new Date(order.cancelled_at).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
