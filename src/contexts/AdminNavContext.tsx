'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type AdminNavContextType = {
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  toggleMobile: () => void
  collapsed: boolean
  setCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void
}

const AdminNavContext = createContext<AdminNavContextType | undefined>(undefined)

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <AdminNavContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        toggleMobile: () => setMobileOpen((prev) => !prev),
        collapsed,
        setCollapsed,
      }}
    >
      {children}
    </AdminNavContext.Provider>
  )
}

export function useAdminNav() {
  const context = useContext(AdminNavContext)
  if (!context) {
    throw new Error('useAdminNav must be used within an AdminNavProvider')
  }
  return context
}
