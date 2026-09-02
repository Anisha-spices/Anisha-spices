import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AddressList } from './_components/AddressList'

export const metadata = {
  title: 'My Addresses | Anisha Spices',
}

export default async function AccountAddressesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false }) // default first
    .order('created_at', { ascending: false })

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-sm min-h-full">
      <AddressList addresses={addresses || []} />
    </div>
  )
}
