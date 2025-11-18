import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Minus, Plus } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  unit: string
  location: string
  image: string
  category: string
}

interface AddToCartModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function AddToCartModal({ product, isOpen, onClose, onAddToCart }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setQuantity(1) // Reset quantity
    onClose()
  }

  const total = product.price * quantity

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir al carrito</DialogTitle>
          <DialogDescription>
            Selecciona la cantidad que deseas comprar
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Información del producto */}
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
              <Badge variant="outline" className="mt-2">
                {product.category}
              </Badge>
            </div>
          </div>

          {/* Precio unitario */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio por {product.unit}</span>
            <span className="font-semibold">${product.price.toLocaleString()}</span>
          </div>

          {/* Selector de cantidad */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
                min={1}
              />
              
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>

              <span className="text-sm text-gray-600 ml-2">
                {product.unit}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold text-green-600">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700">
            Añadir al carrito
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}