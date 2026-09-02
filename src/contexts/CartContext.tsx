'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

type CartContextType = {
  itemCount: number
  refreshCart: () => void
}

const CartContext = createContext<CartContextType>({
  itemCount: 0,
  refreshCart: () => {},
})

export function CartProvider({ 
  children, 
  initialCount 
}: { 
  children: ReactNode
  initialCount: number 
}) {
  const [itemCount, setItemCount] = useState(initialCount)

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart/count')
      const data = await res.json()
      setItemCount(data.count ?? 0)
    } catch {
      // Silently fail
    }
  }, [])

  // Sync with initialCount when it changes (e.g. after server revalidation)
  useEffect(() => {
    setItemCount(initialCount)
  }, [initialCount])

  return (
    <CartContext.Provider value={{ itemCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    return { itemCount: 0, refreshCart: () => {} }
  }
  return context
}
