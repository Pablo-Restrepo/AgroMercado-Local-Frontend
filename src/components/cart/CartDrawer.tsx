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
import { useState } from "react"
import { useAuth } from "@/hooks/auth/useAuth"
import * as checkoutService from "@/services/checkout/checkoutService"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { DeliveryModal } from "@/components/modals/DeliveryModal"

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
  const { user } = useAuth()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [checkoutResult, setCheckoutResult] = useState<checkoutService.CheckoutResult | null>(null)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  const handleCheckout = async (destino: string) => {
    if (!user?.u_id) {
      alert("Debes iniciar sesión para realizar una compra")
      return
    }

    setIsProcessingCheckout(true)
    setCheckoutResult(null)

    try {
      const result = await checkoutService.processCheckout(
        cart, 
        user.u_id, 
        destino
      )
      
      setCheckoutResult(result)
      
      if (result.success) {
        // Éxito: limpiar carrito después de un breve delay
        setTimeout(() => {
          onClearCart()
          setCheckoutResult(null)
          onClose()
        }, 5000)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setCheckoutResult({
        success: false,
        compras: [],
        errors: [error instanceof Error ? error.message : "Error durante el checkout"]
      })
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  return (
    <>
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
            {/* Resultado del checkout mejorado */}
            {checkoutResult && (
              <div className="py-4 space-y-3">
                {checkoutResult.success ? (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="space-y-2">
                        <p className="font-semibold">¡Compra realizada exitosamente!</p>
                        <p className="text-sm">
                          Se procesaron {checkoutResult.compras.length} compra(s) por un total de ${cart.total.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">
                          Este carrito se vaciará automáticamente en unos segundos...
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-semibold">Error en el procesamiento</p>
                        <p className="text-sm">{checkoutResult.errors.join(". ")}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Detalle de compras mejorado */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Detalle por gremio:</p>
                  {checkoutResult.compras.map((compra, idx) => (
                    <div key={idx} className={`p-3 border rounded-lg text-sm ${
                      compra.status === 'paid' ? 'bg-green-50 border-green-200' : 
                      compra.status === 'error' ? 'bg-red-50 border-red-200' : 
                      'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{compra.gremio}</p>
                          <p className="text-xs text-gray-600">
                            {compra.productos.length} producto(s) - ${compra.total.toLocaleString()}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded capitalize ${
                          compra.status === 'paid' ? 'bg-green-100 text-green-700' : 
                          compra.status === 'error' ? 'bg-red-100 text-red-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {compra.status === 'paid' ? 'Completado' : 
                           compra.status === 'error' ? 'Error' : 
                           compra.status}
                        </span>
                      </div>
                      {compra.error && (
                        <p className="text-red-600 mt-2 text-xs">{compra.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      {/* Contenido existente del item */}
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
                      onClick={() => setShowDeliveryModal(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                      disabled={isProcessingCheckout || checkoutResult?.success}
                    >
                      {isProcessingCheckout ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Proceder al pago
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={onClearCart}
                      variant="outline"
                      className="w-full"
                      disabled={isProcessingCheckout}
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

      <DeliveryModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onConfirm={handleCheckout}
        total={cart.total}
      />
    </>
  )
}