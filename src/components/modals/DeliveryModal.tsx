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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { MapPin, Truck } from "lucide-react"

interface DeliveryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (destino: string) => void
  total: number
}

export function DeliveryModal({ isOpen, onClose, onConfirm, total }: DeliveryModalProps) {
  const [deliveryType, setDeliveryType] = useState("domicilio")
  const [address, setAddress] = useState("")

  const handleConfirm = () => {
    const destino = deliveryType === "domicilio" ? address : "recoger_en_tienda"
    if (deliveryType === "domicilio" && !address.trim()) {
      alert("Por favor ingresa una dirección de entrega")
      return
    }
    onConfirm(destino)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Método de entrega
          </DialogTitle>
          <DialogDescription>
            Selecciona cómo quieres recibir tu pedido
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="domicilio" id="domicilio" />
              <div className="flex-1">
                <Label htmlFor="domicilio" className="flex items-center gap-2 cursor-pointer">
                  <MapPin className="h-4 w-4" />
                  Entrega a domicilio
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Recibe tu pedido en la dirección que indiques
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <RadioGroupItem value="recoger" id="recoger" />
              <div className="flex-1">
                <Label htmlFor="recoger" className="flex items-center gap-2 cursor-pointer">
                  <Truck className="h-4 w-4" />
                  Recoger en tienda
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Recoge tu pedido directamente en el punto de venta
                </p>
              </div>
            </div>
          </RadioGroup>

          {deliveryType === "domicilio" && (
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de entrega</Label>
              <Input
                id="address"
                placeholder="Ingresa tu dirección completa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Incluye ciudad, barrio, número de casa y referencias
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total a pagar:</span>
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
          <Button onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            Confirmar pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}