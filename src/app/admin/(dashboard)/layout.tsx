import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/Header'

import { cookies } from 'next/headers'
import { AdminNavProvider } from '@/contexts/AdminNavContext'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const hasAdminCookie = cookieStore.get('admin_session')?.value === 'authenticated'

  if (!hasAdminCookie) {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        redirect('/admin/login')
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        redirect('/admin/login')
      }
    } catch {
      redirect('/admin/login')
    }
  }

  return (
    <AdminNavProvider>
      <div className="flex h-screen overflow-hidden bg-stone-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminNavProvider>
  )
}
