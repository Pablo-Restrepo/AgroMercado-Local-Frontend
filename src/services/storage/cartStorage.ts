import type { Cart } from "@/types/cart"
const CART_COOKIE_NAME = "agromercado_cart"
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 días

export const cartStorage = {
  getCart(): Cart {
    try {
      const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith(`${CART_COOKIE_NAME}=`))
      
      if (!cookie) {
        return { items: [], total: 0, itemCount: 0 }
      }
      
      const value = decodeURIComponent(cookie.split('=')[1])
      return JSON.parse(value)
    } catch {
      return { items: [], total: 0, itemCount: 0 }
    }
  },

  setCart(cart: Cart): void {
    try {
      const value = encodeURIComponent(JSON.stringify(cart))
      document.cookie = `${CART_COOKIE_NAME}=${value}; path=/; max-age=${CART_COOKIE_MAX_AGE}`
    } catch (error) {
      console.error("Error saving cart to cookies:", error)
    }
  },

  clearCart(): void {
    document.cookie = `${CART_COOKIE_NAME}=; path=/; max-age=0`
  },

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
    const cart = this.getCart()
    const existingItemIndex = cart.items.findIndex(i => i.id === item.id)
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({ ...item, quantity })
    }
    
    this.updateCartTotals(cart)
    this.setCart(cart)
    return cart
  },

  updateItemQuantity(itemId: string, quantity: number): Cart {
    const cart = this.getCart()
    const itemIndex = cart.items.findIndex(i => i.id === itemId)
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1)
      } else {
        cart.items[itemIndex].quantity = quantity
      }
    }
    
    this.updateCartTotals(cart)
    this.setCart(cart)
    return cart
  },

  removeItem(itemId: string): Cart {
    const cart = this.getCart()
    cart.items = cart.items.filter(item => item.id !== itemId)
    this.updateCartTotals(cart)
    this.setCart(cart)
    return cart
  },

  updateCartTotals(cart: Cart): void {
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    cart.itemCount = cart.items.reduce((count, item) => count + item.quantity, 0)
  }
}