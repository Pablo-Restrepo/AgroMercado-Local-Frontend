import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { Cart } from "@/types/cart"
import { CartDrawer } from "./CartDrawer"

interface FloatingCartProps {
  cart: Cart
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

export function FloatingCart({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart 
}: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (cart.itemCount === 0) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg relative"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Carrito
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs"
          >
            {cart.itemCount}
          </Badge>
        </Button>
      </div>

      <CartDrawer
        cart={cart}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
      />
    </>
  )
}