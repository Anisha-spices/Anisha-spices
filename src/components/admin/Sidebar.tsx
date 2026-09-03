'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderTree,
  Package,
  Users,
  ShoppingCart,
  MessageSquare,
  Image as ImageIcon,
  Megaphone,
  Truck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Bot,
} from 'lucide-react'
import { useAdminNav } from '@/contexts/AdminNavContext'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Hero Slides', href: '/admin/hero-slides', icon: ImageIcon },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Delivery Settings', href: '/admin/settings/shipping', icon: Truck },
  { label: 'Global FAQs', href: '/admin/settings/faqs', icon: Settings },
  { label: 'Chatbot Settings', href: '/admin/settings/chatbot', icon: Bot },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { mobileOpen, setMobileOpen, collapsed, setCollapsed } = useAdminNav()

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-stone-950 border-r border-stone-800/50 transition-all duration-300 ease-in-out shrink-0
          lg:static lg:translate-x-0
          ${mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          ${collapsed ? 'lg:w-[72px]' : 'lg:w-64'}
          w-72 max-w-[85vw]
        `}
      >
        {/* Brand & Mobile Close */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-stone-800/50 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-orange-500/40 shrink-0 shadow-md bg-black">
              <Image
                src="/images/logo.jpeg"
                alt="Anisha Spices Logo"
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="overflow-hidden">
                <p className="text-white font-semibold text-sm leading-tight truncate">
                  Anisha Masale
                </p>
                <p className="text-stone-500 text-xs truncate">Admin Panel</p>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive
                      ? 'text-orange-400'
                      : 'text-stone-500 group-hover:text-stone-300'
                  }`}
                />
                {(!collapsed || mobileOpen) && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:block p-3 border-t border-stone-800/50">
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-stone-500 hover:text-stone-300 hover:bg-stone-800/60 transition-all duration-200 text-sm"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
