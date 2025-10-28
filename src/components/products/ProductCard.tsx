import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Heart, ShoppingCart } from "lucide-react"

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
    className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
    const getCategoryBadge = (category: string) => {
        const categoryLabels: Record<string, string> = {
            verduras: "Verduras",
            frutas: "Frutas",
            tuberculos: "Tubérculos",
            hierbas: "Hierbas",
            medicinales: "Medicinales",
        }
        return (
            <Badge variant="success">
                {categoryLabels[category] || category}
            </Badge>
        )
    }

    return (
        <Card className={`flex flex-col min-w-[235px] max-w-[313px] w-full h-[519px] p-5 rounded-xl border border-zinc-200 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="w-full h-[273px] rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full"
                />
            </div>

            <div className="flex flex-col flex-1 gap-3 min-h-0">
                <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
                    <div className="text-right flex-shrink-0 ml-2">
                        <p className="font-bold text-2xl">${product.price.toLocaleString()}</p>
                        <p className="text-sm text-zinc-500">por {product.unit}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-sm text-zinc-600">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{product.location}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-sm">{product.rating}</span>
                        <span className="text-sm text-zinc-500">
                            ({product.reviews} reseñas)
                        </span>
                    </div>
                    {getCategoryBadge(product.category)}
                </div>

                <div className="flex gap-2 mt-auto">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 text-sm" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Añadir al carrito
                    </Button>
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-10 w-10 rounded-lg border-zinc-200"
                    >
                        <Heart className="h-4 w-4 text-zinc-600" />
                    </Button>
                </div>
            </div>
        </Card>
    )
}