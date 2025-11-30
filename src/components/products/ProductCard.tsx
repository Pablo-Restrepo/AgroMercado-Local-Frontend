import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart, ShoppingCart } from "lucide-react"
import * as categoryApi from "@/services/api/categoryApi"
import type { Category } from "@/services/api/categoryApi"

export interface Product {
    id: string
    name: string
    price: number
    unit: string
    location: string
    rating: number
    reviews: number
    category: string
    image: string
    stock: "disponible" | "bajo" | "agotado"
}

interface ProductCardProps {
    product: Product
}

const PLACEHOLDER = "https://via.placeholder.com/400x300?text=No+image"

// Categorías de fallback hardcodeadas
const FALLBACK_CATEGORIES: Category[] = [
  { cat_id: 1, cat_nombre: "frutas" },
  { cat_id: 4, cat_nombre: "hierbas" },
  { cat_id: 5, cat_nombre: "hortalizas" },
  { cat_id: 3, cat_nombre: "tubérculos" },
  { cat_id: 2, cat_nombre: "verduras" }
]

function resolveImageSrc(img?: string) {
  if (!img) return PLACEHOLDER
  const trimmed = img.trim()
  // Si ya viene con data: (data URI) usar tal cual
  if (trimmed.startsWith("data:")) return trimmed
  // Si parece un URL (http, https) usar tal cual
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  // Si parece base64 (solo chars base64) devolver como data URI (fallback to jpeg)
  // Nota: esto es heurístico — si tu backend guarda mime puedes adaptar.
  if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length > 100) {
    return `data:image/jpeg;base64,${trimmed}`
  }
  // por defecto usar placeholder
  return PLACEHOLDER
}

export function ProductCard({ product }: ProductCardProps) {
    const [categorias, setCategorias] = useState<Category[]>(FALLBACK_CATEGORIES)
    const imgSrc = resolveImageSrc(product.image)

    // Cargar categorías dinámicamente con fallback
    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const categoriasData = await categoryApi.listarCategorias()
                if (categoriasData && categoriasData.length > 0) {
                    setCategorias(categoriasData)
                }
                // Si no hay datos del API, mantener las categorías hardcodeadas
            } catch (error) {
                console.error("Error cargando categorías:", error)
                // Mantener categorías hardcodeadas en caso de error
                setCategorias(FALLBACK_CATEGORIES)
            }
        }

        loadCategorias()
    }, [])

    const getCategoryBadge = (category: string) => {
        if (!category || !category.trim()) {
            return (
                <Badge variant="outline" className="capitalize">
                    Sin categoría
                </Badge>
            )
        }

        const categoryLower = category.toLowerCase().trim()
        
        // Intentar encontrar la categoría real desde el API o fallback
        const realCategory = categorias.find(cat => {
            const catName = cat.cat_nombre.toLowerCase()
            
            return catName === categoryLower ||
                   catName.includes(categoryLower) ||
                   categoryLower.includes(catName)
        })

        // Mapeos adicionales para diferentes variaciones
        const categoryMappings: Record<string, string> = {
            'fruta': 'frutas',
            'fruit': 'frutas',
            'verdura': 'verduras',
            'hortaliza': 'hortalizas',
            'vegetal': 'verduras',
            'vegetales': 'verduras',
            'tuberculo': 'tubérculos',
            'tubérculo': 'tubérculos',
            'tuber': 'tubérculos',
            'hierba': 'hierbas',
            'aromática': 'hierbas',
            'aromaticas': 'hierbas',
            'herbs': 'hierbas',
            'herb': 'hierbas'
        }

        let displayName = category
        
        if (realCategory) {
            displayName = realCategory.cat_nombre
        } else {
            // Intentar mapeo directo
            const mappedCategory = categoryMappings[categoryLower]
            if (mappedCategory) {
                const mappedCat = categorias.find(cat => 
                    cat.cat_nombre.toLowerCase() === mappedCategory
                )
                if (mappedCat) {
                    displayName = mappedCat.cat_nombre
                }
            }
        }

        // Mapeo de colores por tipo de categoría
        const getCategoryVariant = (catName: string) => {
            const name = catName.toLowerCase()
            
            if (name.includes('fruta')) return "default"
            if (name.includes('verdura') || name.includes('hortaliza')) return "secondary" 
            if (name.includes('tubérculo') || name.includes('tuberculo')) return "outline"
            if (name.includes('hierba') || name.includes('aromática')) return "default"
            if (name.includes('medicinal')) return "destructive"
            
            return "outline" // Por defecto
        }

        return (
            <Badge variant={getCategoryVariant(displayName)} className="capitalize">
                {displayName}
            </Badge>
        )
    }

    return (
        <Card className="flex flex-col min-w-[235px] max-w-[313px] w-full h-[519px] p-5">
            <div className="w-full h-[273px] rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={imgSrc}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement
                        if (target.src !== PLACEHOLDER) target.src = PLACEHOLDER
                    }}
                />
            </div>

            <div className="flex flex-col flex-1 gap-3 min-h-0">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                    <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-2xl">${product.price.toLocaleString()}</p>
                        <p className="text-sm text-zinc-400">por {product.unit}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-zinc-500">{product.location}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{product.rating}</span>
                        <span className="text-sm text-zinc-400">
                            ({product.reviews} reseñas)
                        </span>
                    </div>
                    {getCategoryBadge(product.category)}
                </div>

                <div className="flex gap-2 mt-auto">
                    <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 text-sm" 
                        size="sm"
                        disabled={product.stock === "agotado"}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock === "agotado" ? "Agotado" : "Añadir al carrito"}
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-lg"
                    >
                        <Heart className="h-4 w-4 text-zinc-500" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}