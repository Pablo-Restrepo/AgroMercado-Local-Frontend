import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MapPin } from "lucide-react"
import type { ProductorProduct } from "@/services/api/productorApi"

interface ProductManagementCardProps {
  product: ProductorProduct
  onEdit: (product: ProductorProduct) => void
  onDelete: (product: ProductorProduct) => void
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"

/**
 * Resolve image source:
 * - si viene con data: -> usar tal cual
 * - si es URL http(s) -> usar tal cual
 * - si parece base64 (solo chars base64 y longitud suficiente) -> convertir a data URI (jpeg por defecto)
 * - fallback -> PLACEHOLDER
 */
function resolveImageSrc(img?: string, tipo?: string) {
  if (!img || !img.trim()) {
    // si no hay img, intentar elegir por tipo
    if (tipo) {
      const tt = tipo.toLowerCase()
      if (tt.includes('fruta')) {
        return "https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
      if (tt.includes('verdura') || tt.includes('hortaliza')) {
        return "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    }
    return PLACEHOLDER
  }

  const trimmed = img.trim()

  // data URI completo
  if (trimmed.startsWith("data:")) return trimmed

  // url http(s)
  if (/^https?:\/\//i.test(trimmed)) return trimmed

  // heurística base64: caracteres válidos y longitud razonable
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.replace(/\s+/g, '').length > 100) {
    return `data:image/jpeg;base64,${trimmed.replace(/\s+/g, '')}`
  }

  // fallback por tipo o placeholder
  return PLACEHOLDER
}

export function ProductManagementCard({ product, onEdit, onDelete }: ProductManagementCardProps) {
  const imgSrc = resolveImageSrc(product.img, product.p_tipo)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow w-full max-w-sm">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imgSrc}
          alt={product.p_nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = PLACEHOLDER
          }}
        />
        
        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 bg-red-500/90 hover:bg-red-600"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight">
            {product.p_nombre}
          </h3>
          <Badge variant="outline" className="ml-2 flex-shrink-0 capitalize">
            {product.p_tipo}
          </Badge>
        </div>

        <div className="flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{product.gre_nombre}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ${product.p_precio.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">por {product.p_unidad}</div>
          </div>
        </div>

        {/* Management Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={() => onEdit(product)}
            variant="outline"
            className="flex-1 gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button 
            onClick={() => onDelete(product)}
            variant="destructive"
            className="flex-1 gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </Card>
  )
}