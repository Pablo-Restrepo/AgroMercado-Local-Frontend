import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MapPin, Leaf, Package } from "lucide-react"
import * as categoryApi from "@/services/api/categoryApi"
import type { ProductorProduct } from "@/services/api/productoApi"
import type { Category } from "@/services/api/categoryApi"
import { mapCategoryIdToName, FALLBACK_CATEGORIES } from "@/utils/categoryMapper"

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
 * - fallback -> PLACEHOLDER por tipo o genérico
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
      if (tt.includes('tubérculo') || tt.includes('tuberculo')) {
        return "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
      if (tt.includes('hierba') || tt.includes('aromática')) {
        return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
      if (tt.includes('medicinal')) {
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
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
  return resolveImageSrc(undefined, tipo)
}

export function ProductManagementCard({ product, onEdit, onDelete }: ProductManagementCardProps) {
  const [categorias, setCategorias] = useState<Category[]>(FALLBACK_CATEGORIES)

  // Usar la nueva función para mapear la categoría
  const categoryName = mapCategoryIdToName(product.cat_id, product.p_tipo, categorias)
  const imgSrc = resolveImageSrc(product.img, categoryName)

  // Cargar categorías dinámicamente con fallback
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const categoriasData = await categoryApi.listarCategorias()
        if (categoriasData && categoriasData.length > 0) {
          setCategorias(categoriasData)
        }
      } catch (error) {
        console.error("Error cargando categorías:", error)
        // Mantener las categorías de fallback
        setCategorias(FALLBACK_CATEGORIES)
      }
    }

    loadCategorias()
  }, [])

  // Función para obtener información de categoría enriquecida
  const getCategoryInfo = (categoryName: string) => {
    const isValidCategory = categoryName !== "Sin categoría"

    // Determinar variante de badge y color basado en el nombre
    const getVariantAndColor = (catName: string) => {
      const name = catName.toLowerCase()

      if (name.includes('fruta'))
        return { variant: "default" as const, color: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100" }

      if (name.includes('verdura') || name.includes('hortaliza'))
        return { variant: "secondary" as const, color: "text-green-700 bg-green-50 border-green-200 hover:bg-green-100" }

      if (name.includes('tubérculo') || name.includes('tuberculo'))
        return { variant: "outline" as const, color: "text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100" }

      if (name.includes('hierba') || name.includes('aromática'))
        return { variant: "default" as const, color: "text-purple-700 bg-purple-50 border-purple-200 hover:bg-purple-100" }

      if (name.includes('medicinal'))
        return { variant: "destructive" as const, color: "text-red-700 bg-red-50 border-red-200 hover:bg-red-100" }

      return { variant: "outline" as const, color: "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100" }
    }

    return {
      displayName: categoryName,
      isValidCategory,
      ...getVariantAndColor(categoryName)
    }
  }

  const categoryInfo = getCategoryInfo(categoryName)

  return (
    <Card className="flex flex-col min-w-[235px] max-w-[313px] w-full h-auto p-5 bg-card text-card-foreground">
      {/* Product Image */}
      <div className="w-full h-[273px] rounded-lg overflow-hidden flex-shrink-0 relative">
        <img
          src={imgSrc}
          alt={product.p_nombre}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = PLACEHOLDER
          }}
        />

        {/* Stock Badge */}
        {product.p_stock !== undefined && (
          <Badge
            variant={product.p_stock > 0 ? "default" : "destructive"}
            className="absolute bottom-2 left-2"
          >
            {product.p_stock > 0 ? `Stock: ${product.p_stock}` : "Agotado"}
          </Badge>
        )}

        {/* Medicinal Badge */}
        {product.p_medicinal && (
          <Badge
            variant="outline"
            className="absolute top-2 left-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
          >
            <Leaf className="h-3 w-3 mr-1" />
            Medicinal
          </Badge>
        )}

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
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-tight">
            {product.p_nombre}
          </h3>
          <Badge
            variant={categoryInfo.variant}
            className={`ml-2 flex-shrink-0 capitalize ${categoryInfo.color}`}
          >
            {categoryInfo.isValidCategory ? (
              categoryInfo.displayName
            ) : (
              <>
                <Package className="h-3 w-3 mr-1" />
                {categoryInfo.displayName}
              </>
            )}
          </Badge>
        </div>

        {/* Gremio info */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{product.gre_nombre || "Sin gremio"}</span>
        </div>

        {/* Precio */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">
              ${product.p_precio?.toLocaleString() || "0"}
            </div>
            <div className="text-sm text-muted-foreground">por {product.p_unidad || "unidad"}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}