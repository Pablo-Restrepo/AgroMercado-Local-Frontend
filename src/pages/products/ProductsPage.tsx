/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  MapPin, 
  Star, 
  Heart, 
  ShoppingCart, 
  Search,
  ShoppingBag
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AddToCartModal } from "@/components/cart/AddToCartModal"
import { FloatingCart } from "@/components/cart/FloatingCart"
import { useCart } from "@/hooks/useCart"

// Datos placeholder - después conectarás con tu servicio
const mockProducts = [
  {
    id: "1",
    name: "Tomates orgánicos",
    price: 5000,
    unit: "kg",
    location: "Finca Los Robles • Popayán",
    rating: 4.8,
    reviews: 24,
    category: "Verduras",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  },
  {
    id: "2", 
    name: "Lechuga fresca",
    price: 4000,
    unit: "kg",
    location: "Finca La Esperanza • Popayán", 
    rating: 4.8,
    reviews: 24,
    category: "Verduras",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  },
  {
    id: "3",
    name: "Zanahorias",
    price: 7000,
    unit: "kg", 
    location: "Finca Los Robles • Popayán",
    rating: 4.8,
    reviews: 24,
    category: "Verduras",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  },
  {
    id: "4",
    name: "Papa Pastusa", 
    price: 18000,
    unit: "kg",
    location: "Finca Los Robles • Popayán",
    rating: 4.8,
    reviews: 24,
    category: "Verduras",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  },
  {
    id: "5",
    name: "Banano Maduro",
    price: 3290,
    unit: "kg",
    location: "Finca Los Robles • Popayán", 
    rating: 4.8,
    reviews: 24,
    category: "Frutas",
    image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  },
  {
    id: "6",
    name: "Cebolla Roja",
    price: 5500, 
    unit: "kg",
    location: "Finca Los Robles • Popayán",
    rating: 4.8,
    reviews: 24,
    category: "Verduras", 
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    available: true
  }
]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
  console.log("Product selected:", selectedProduct)
  console.log("Modal open:", isModalOpen)
  console.log("Cart state:", cart)
  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    }
  }

  const handleConfirmAddToCart = (product: any, quantity: number) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      location: product.location
    }, quantity)
  }

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <DashboardLayout title="Productos">
        <div className="flex-1 bg-gray-50">
          {/* Search and Filters - Ahora dentro del layout */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1" />
                <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Carrito de compras
                  {cart.itemCount > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {cart.itemCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-[200px] border rounded px-3 py-2 bg-white"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="verduras">Verduras</option>
                  <option value="frutas">Frutas</option>
                  <option value="tuberculos">Tubérculos</option>
                  <option value="hierbas">Hierbas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </Button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                        {product.name}
                      </h3>
                      <Badge variant="outline" className="ml-2 flex-shrink-0">
                        {product.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{product.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{product.rating}</span>
                        <span className="text-sm text-gray-500">
                          ({product.reviews} reseñas)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${product.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">por {product.unit}</div>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleAddToCart(product.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Añadir al carrito
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                  <p>Intenta con otros términos de búsqueda o categorías</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      {/* Modal para añadir al carrito */}
      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleConfirmAddToCart}
      />

      {/* Carrito flotante */}
      <FloatingCart
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </>
  )
}