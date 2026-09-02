import { getShippingConfig } from '@/actions/shipping'
import { ShippingSettingsClient } from './_components/ShippingSettingsClient'

export const metadata = {
  title: 'Shipping Settings | Admin Dashboard',
}

export const dynamic = 'force-dynamic'

export default async function AdminShippingSettingsPage() {
  const config = await getShippingConfig()

  return <ShippingSettingsClient initialConfig={config} />
}
