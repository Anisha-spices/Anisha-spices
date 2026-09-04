'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, MapPin, Package, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AccountNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    { name: 'Profile', href: '/account', icon: User },
    { name: 'Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Orders', href: '/account/orders', icon: Package },
  ]

  return (
    <div className="flex flex-col divide-y divide-[#F2E8DC]">
      {links.map((link) => {
        const Icon = link.icon
        const isActive = pathname === link.href || (link.href !== '/account' && pathname.startsWith(link.href))
        
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 px-6 py-4 text-xs sm:text-sm font-bold transition-all ${
              isActive 
                ? 'bg-[#FAF6F2] text-[#7B111A] border-l-4 border-l-[#7B111A] pl-5' 
                : 'text-[#5A433B] hover:bg-[#FAF6F2]/60 hover:text-[#7B111A] border-l-4 border-l-transparent pl-5'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#7B111A]' : 'text-[#8C7567]'}`} />
            <span>{link.name}</span>
          </Link>
        )
      })}
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-6 py-4 text-xs sm:text-sm font-bold text-rose-700 hover:bg-rose-50 transition-colors border-l-4 border-l-transparent pl-5 w-full text-left cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-rose-600" />
        <span>Sign Out</span>
      </button>
    </div>
  )
}
