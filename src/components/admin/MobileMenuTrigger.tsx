'use client'

import { Menu } from 'lucide-react'
import { useAdminNav } from '@/contexts/AdminNavContext'

export function MobileMenuTrigger() {
  const { toggleMobile } = useAdminNav()

  return (
    <button
      onClick={toggleMobile}
      type="button"
      className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors shrink-0"
      aria-label="Open navigation menu"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
