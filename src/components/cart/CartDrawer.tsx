import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Trash2, Minus, Plus, ShoppingBag, CreditCard } from "lucide-react"
import type { Cart } from "@/types/cart"

interface CartDrawerProps {
  cart: Cart
  isOpen: boolean
  onClose: () => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

export function CartDrawer({
  cart,
  isOpen,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const handleCheckout = () => {
    // Aquí implementarás el proceso de pago
    console.log("Proceder al pago:", cart)
    alert("Funcionalidad de pago próximamente")
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Tu carrito
            <Badge variant="secondary">{cart.itemCount} productos</Badge>
          </SheetTitle>
          <SheetDescription>
            Revisa tus productos antes de proceder al pago
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Lista de productos */}
          <div className="flex-1 overflow-auto py-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <ShoppingBag className="h-12 w-12 mb-4" />
                <p>Tu carrito está vacío</p>
                <p className="text-sm">Añade productos para empezar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.name}</h4>
                      <p className="text-xs text-gray-600 truncate">{item.location}</p>
                      <p className="text-sm font-semibold text-green-600">
                        ${item.price.toLocaleString()} / {item.unit}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-center text-sm"
                          min={1}
                        />
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="ml-auto text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer con total y acciones */}
          {cart.items.length > 0 && (
            <>
              <Separator />
              <SheetFooter className="flex-col space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${cart.total.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid gap-2 w-full">
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceder al pago
                  </Button>
                  
                  <Button
                    onClick={onClearCart}
                    variant="outline"
                    className="w-full"
                  >
                    Vaciar carrito
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}