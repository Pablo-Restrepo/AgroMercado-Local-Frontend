/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
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
  ShoppingBag,
  Loader2
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AddToCartModal } from "@/components/cart/AddToCartModal"
import { FloatingCart } from "@/components/cart/FloatingCart"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/auth/useAuth"
import { getAllProducts, type ProductSummary } from "@/services/api/productoApi"
import { listarCategorias, type Category } from "@/services/api/categoryApi"

// Interfaz para productos formateados para la UI
interface FormattedProduct {
  id: string
  name: string
  price: number
  unit: string
  location: string
  rating: number
  reviews: number
  category: string
  image: string
  available: boolean
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Estados para productos y categorías desde la API
  const [products, setProducts] = useState<FormattedProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()

  // Cargar productos y categorías desde la API
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Cargar productos y categorías en paralelo
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          listarCategorias()
        ])

        setCategories(categoriesData)

        // Formatear productos para la UI
        const formattedProducts: FormattedProduct[] = productsData.map((product: ProductSummary) => {
          // Buscar el nombre de la categoría
          const category = categoriesData.find(cat => cat.cat_id === product.cat_id)

          // Imagen por defecto si no hay imagen o es string vacío
          const defaultImage = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"

          // Convertir imagen base64 a data URL si existe
          let productImage = defaultImage
          if (product.img && product.img.trim() !== "") {
            // Si ya es una URL (http/https), usarla directamente
            if (product.img.startsWith("http://") || product.img.startsWith("https://")) {
              productImage = product.img
            }
            // Si ya tiene el prefijo data:, usarla directamente
            else if (product.img.startsWith("data:")) {
              productImage = product.img
            }
            // Si es base64 puro, agregar el prefijo de data URL
            else {
              productImage = `data:image/jpeg;base64,${product.img}`
            }
          }

          return {
            id: String(product.p_id),
            name: product.p_nombre,
            price: product.p_precio,
            unit: product.p_unidad,
            location: product.gre_nombre ? `${product.gre_nombre}` : "Ubicación no disponible",
            rating: 4.5, // Placeholder - se puede agregar en el backend
            reviews: 0,  // Placeholder - se puede agregar en el backend
            category: category?.cat_nombre || product.p_tipo || "Sin categoría",
            image: productImage,
            available: (product.p_stock ?? 0) > 0
          }
        })

        setProducts(formattedProducts)
      } catch (err) {
        console.error("Error al cargar productos:", err)
        setError(err instanceof Error ? err.message : "Error al cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Determinar si debe ocultar filtros basado en el rol del usuario
  const shouldHideFilters = user?.u_rol === "productor" || user?.u_rol === "admin"

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      setSelectedProduct(product)
      setIsModalOpen(true)
    }
  }

  const handleConfirmAddToCart = (product: any, quantity: number) => {
    addToCart({
      id: product.id,
      productId: Number(product.id),
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      location: product.location
    }, quantity)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <DashboardLayout title="Productos" hideFilters={shouldHideFilters}>
        <div className="flex-1 bg-gray-50 dark:bg-gray-900">
          {/* Search and Filters - Ahora dentro del layout */}
          <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
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

              {/* Search and Filters - Solo mostrar si no es productor */}
              {!shouldHideFilters && (
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
                    className="w-full sm:w-[200px] border rounded px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map((cat) => (
                      <option key={cat.cat_id} value={cat.cat_nombre.toLowerCase()}>
                        {cat.cat_nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Cargando productos...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex flex-1 items-center justify-center py-12">
              <div className="text-center">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-medium mb-2 text-red-600">Error al cargar productos</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
              <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-full max-w-7xl place-items-center">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="flex flex-col min-w-[235px] max-w-[313px] w-full h-[519px] p-5">
                    <div className="w-full h-[273px] rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
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
                        <Badge variant="outline" className="flex-shrink-0">
                          {product.category}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-auto">
                        <Button
                          onClick={() => handleAddToCart(product.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg h-10 text-sm"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Añadir al carrito
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
          )}
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