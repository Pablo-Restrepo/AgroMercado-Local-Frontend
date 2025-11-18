import { useState, useEffect } from "react"
import type { Cart, CartItem } from "@/types/cart"
import { cartStorage } from "@/services/storage/cartStorage"

export function useCart() {
  const [cart, setCart] = useState<Cart>(() => cartStorage.getCart())

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    const updatedCart = cartStorage.addItem(item, quantity)
    setCart(updatedCart)
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    const updatedCart = cartStorage.updateItemQuantity(itemId, quantity)
    setCart(updatedCart)
  }

  const removeFromCart = (itemId: string) => {
    const updatedCart = cartStorage.removeItem(itemId)
    setCart(updatedCart)
  }

  const clearCart = () => {
    cartStorage.clearCart()
    setCart({ items: [], total: 0, itemCount: 0 })
  }

  // Sincronizar con cambios en otras pestañas
  useEffect(() => {
    const handleStorageChange = () => {
      setCart(cartStorage.getCart())
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  }
}