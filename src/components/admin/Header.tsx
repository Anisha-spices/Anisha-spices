import { createClient } from '@/lib/supabase/server'
import { LogOut, User } from 'lucide-react'
import { logout } from '@/actions/auth'
import { MobileMenuTrigger } from './MobileMenuTrigger'

export default async function AdminHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
      <div className="flex items-center gap-3">
        <MobileMenuTrigger />
        <h2 className="text-base sm:text-lg font-semibold text-stone-900 truncate">
          Admin Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Admin info */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
            <User className="w-4 h-4 text-stone-500" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-stone-700 leading-tight">
              {user?.email || 'Admin'}
            </p>
            <p className="text-xs text-stone-400">Administrator</p>
          </div>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </form>
      </div>
    </header>
  )
}
