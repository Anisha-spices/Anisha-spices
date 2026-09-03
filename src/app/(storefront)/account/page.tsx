import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Package, Phone, Mail, ShieldCheck, ArrowRight, UserCheck, Sparkles, Clock } from 'lucide-react'
import { ProfileForm } from './_components/ProfileForm'

export const metadata = {
  title: 'My Profile & Details | Anisha Spices',
  description: 'Manage your personal details, contact number, and delivery settings.',
}

export default async function AccountProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. Fetch Primary Address
  const { data: defaultAddress } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .limit(1)
    .maybeSingle()

  // 3. Fetch Orders Count
  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="space-y-6">
      
      {/* 👑 Top Welcome & Account Overview Card */}
      <div className="bg-white rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DFD5] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌿</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">
                Personal Profile & Details
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#8C7567]">
              Manage your personal information, mobile contact, and default delivery preferences.
            </p>
          </div>

        </div>

        {/* 3 Quick Stat Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pt-6">
          <Link
            href="/account/orders"
            className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] hover:border-[#7B111A]/40 transition-colors group"
          >
            <div className="flex items-center gap-2 text-[#7B111A] mb-1">
              <Package className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7567]">Orders Placed</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#2A1612] group-hover:text-[#7B111A] transition-colors">
              {ordersCount || 0}
            </p>
          </Link>

          <Link
            href="/account/addresses"
            className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] hover:border-[#7B111A]/40 transition-colors group"
          >
            <div className="flex items-center gap-2 text-[#7B111A] mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7567]">Saved Addresses</span>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-[#2A1612] group-hover:text-[#7B111A] transition-colors">
              {defaultAddress ? 'Configured' : 'None yet'}
            </p>
          </Link>

          <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5]">
            <div className="flex items-center gap-2 text-[#7B111A] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#C89B65]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C7567]">Security</span>
            </div>
            <p className="text-sm font-bold text-emerald-800">
              Verified User ✦
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Left (Profile Form) + Right (Address & Shortcuts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Edit Profile Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E8DFD5] p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6 border-b border-[#E8DFD5] pb-4">
            <UserCheck className="w-5 h-5 text-[#7B111A]" />
            <h2 className="font-serif text-lg sm:text-xl font-bold text-[#2A1612]">
              Edit Profile Information
            </h2>
          </div>

          <ProfileForm 
            initialFullName={profile?.full_name || ''} 
            initialPhone={profile?.phone || ''}
            email={profile?.email || user.email || ''} 
          />
        </div>

        {/* Right Column: Default Delivery Address & Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Primary Address Snapshot Box */}
          <div className="bg-white rounded-3xl border border-[#E8DFD5] p-6 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#E8DFD5] pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7B111A]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#2A1612]">
                  Default Delivery Address
                </h3>
              </div>
              <Link
                href="/account/addresses"
                className="text-xs font-bold text-[#7B111A] hover:underline"
              >
                Manage →
              </Link>
            </div>

            {defaultAddress ? (
              <div className="p-4 rounded-2xl bg-[#FAF6F2] border border-[#E8DFD5] text-xs text-[#5A433B] space-y-1">
                <p className="font-bold text-sm text-[#2A1612]">{defaultAddress.full_name}</p>
                <p>{defaultAddress.address_line_1}</p>
                {defaultAddress.address_line_2 && <p>{defaultAddress.address_line_2}</p>}
                <p>{defaultAddress.city}, {defaultAddress.state} - {defaultAddress.postal_code}</p>
                <p className="pt-1.5 font-semibold text-[#2A1612]">Phone: {defaultAddress.phone}</p>
              </div>
            ) : (
              <div className="text-center py-6 px-3 bg-[#FAF6F2] rounded-2xl border border-dashed border-[#E8DFD5]">
                <p className="text-xs text-[#8C7567] mb-3">No delivery address saved yet.</p>
                <Link
                  href="/account/addresses"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B111A] text-white text-xs font-bold rounded-full hover:bg-[#520C12] transition-colors shadow-xs"
                >
                  <span>+ Add Delivery Address</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Helpful Shortcuts */}
          <div className="bg-white rounded-3xl border border-[#E8DFD5] p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8C7567] mb-3">
              Quick Shortcuts
            </h3>
            <div className="divide-y divide-[#F2E8DC] text-xs">
              <Link
                href="/account/orders"
                className="flex items-center justify-between py-2.5 text-[#2A1612] hover:text-[#7B111A] font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#C89B65]" />
                  <span>Track Package Delivery</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-between py-2.5 text-[#2A1612] hover:text-[#7B111A] font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C89B65]" />
                  <span>Browse Fresh Spices</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <a
                href="https://wa.me/919999999999?text=Hi%20Anisha%20Spices%2C%20I%20need%20assistance%20with%20my%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2.5 text-emerald-800 hover:text-emerald-900 font-semibold transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span>WhatsApp Concierge</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
