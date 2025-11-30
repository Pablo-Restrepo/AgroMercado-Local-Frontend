import type { Cart, CartItem } from "@/types/cart"

const CART_STORAGE_KEY = "agromercado_cart"

export const cartStorage = {
  getCart(): Cart {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)

      if (!stored) {
        return { items: [], total: 0, itemCount: 0 }
      }

      return JSON.parse(stored)
    } catch {
      return { items: [], total: 0, itemCount: 0 }
    }
  },

  setCart(cart: Cart): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  },

  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY)
  },

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): Cart {
    const cart = this.getCart()
    const existingItemIndex = cart.items.findIndex(i => i.id === item.id)

    if (existingItemIndex >= 0) {
      // Actualizar cantidad del producto existente
      cart.items[existingItemIndex].quantity += quantity
    } else {
      // Agregar nuevo producto
      cart.items.push({
        ...item,
        quantity
      })
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