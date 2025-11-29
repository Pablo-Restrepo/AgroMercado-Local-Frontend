/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useEffect } from "react"
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
  ArrowLeft,
  Users
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { AddToCartModal } from "@/components/cart/AddToCartModal"
import { FloatingCart } from "@/components/cart/FloatingCart"
import { useCart } from "@/hooks/useCart"
import * as productoApi from "@/services/api/productoApi"
import * as gremiosApi from "@/services/api/gremiosApi"
import type { ProductSummary, GremioProduct } from "@/services/api/productoApi"
import type { GremioListBody } from "@/services/api/gremiosApi"

// Modo de vista
type ViewMode = "products" | "gremios" | "gremio-products"

// Producto unificado para visualización
type ViewProduct = {
  id: string
  productId: number       // Agregar productId numérico
  name: string
  price: number
  unit: string
  location: string
  rating: number
  reviews: number
  category: string
  image: string
  available: boolean
  stock?: number
}

const PLACEHOLDER_URL = "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"

// Agregar helper para normalizar imagenes
function resolveImageSrc(img?: string, fallback = PLACEHOLDER_URL) {
  if (!img || !img.trim()) return fallback
  const trimmed = img.trim()
  if (trimmed.startsWith("data:")) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  const cleaned = trimmed.replace(/\s+/g, "")
  // heurístico base64
  if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length > 100) {
    return `data:image/jpeg;base64,${cleaned}`
  }
  return fallback
}

// Mapear productos generales
function mapGeneralProduct(item: ProductSummary, index: number): ViewProduct {
  const stock = typeof item.p_stock === "number" ? item.p_stock : undefined
  return {
    id: item.p_id ? `product-${item.p_id}` : `general-${index}`,
    productId: item.p_id || 0,
    name: item.p_nombre,
    price: item.p_precio ?? 0,
    unit: item.p_unidad ?? "unidad",
    location: item.gre_nombre ?? "Gremio",
    rating: 4.6,
    reviews: 0,
    category: (item.p_tipo ?? "otro").toLowerCase(),
    image: resolveImageSrc(item.img, PLACEHOLDER_URL),
    available: stock === undefined || stock > 0, // Solo disponible si hay stock
    stock: stock
  }
}

// Mapear productos de gremio
function mapGremioProduct(item: GremioProduct, index: number): ViewProduct {
  const stock = typeof item.p_stock === "number" ? item.p_stock : undefined
  return {
    id: item.p_id ? `product-${item.p_id}` : `gremio-${index}`,
    productId: item.p_id || 0,
    name: item.p_nombre,
    price: item.p_precio ?? 0,
    unit: item.p_unidad ?? "unidad",
    location: item.gre_nombre ?? "Gremio",
    rating: 4.6,
    reviews: 0,
    category: (item.p_tipo ?? "otro").toLowerCase(),
    image: resolveImageSrc(item.img, PLACEHOLDER_URL),
    available: stock === undefined || stock > 0, // Solo disponible si hay stock
    stock: stock
  }
}

export default function DashBoardShoppingPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [gremioSearchQuery, setGremioSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ViewProduct[]>([])
  const [gremios, setGremios] = useState<GremioListBody[]>([])
  const [selectedGremio, setSelectedGremio] = useState<GremioListBody | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Estado para filtros de sidebar
  const [sidebarFilters, setSidebarFilters] = useState({
    selectedCategory: "todo",
    priceRange: [0]
  })
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart()
 
  const handleFilterChange = useCallback((filters: { selectedCategory: string; priceRange: number[] }) => {
    setSidebarFilters(filters)
  }, [])

  const handleConfirmAddToCart = (product: any, quantity: number) => {
    console.log("Adding product to cart:", {
      id: product.id,
      productId: product.productId,
      name: product.name,
      location: product.location
    })
    
    addToCart({
      id: product.id,
      productId: product.productId || 0,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      location: product.location
    }, quantity)
    
    console.log("Cart after adding:", cart)
  }

  // Cargar productos generales
  const loadGeneralProducts = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const items = await productoApi.getAllProducts()
      const mapped = items.map((it, idx) => mapGeneralProduct(it, idx))
      setProducts(mapped)
    } catch (err) {
      console.error("Error fetching products:", err)
      setFetchError(typeof err === "string" ? err : ((err as any)?.message ?? "Error al cargar productos"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar gremios
  const loadGremios = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const items = await gremiosApi.listarGremios()
      setGremios(items)
    } catch (err) {
      console.error("Error fetching gremios:", err)
      setFetchError(typeof err === "string" ? err : ((err as any)?.message ?? "Error al cargar gremios"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Cargar productos por gremio
  const loadGremioProducts = useCallback(async (gremioId: number) => {
    setIsLoading(true)
    setFetchError(null)
    try {
      const items = await productoApi.listarProductosPorGremio(gremioId.toString())
      const mapped = items.map((it, idx) => mapGremioProduct(it, idx))
      setProducts(mapped)
    } catch (err) {
      console.error("Error fetching gremio products:", err)
      setFetchError(typeof err === "string" ? err : ((err as any)?.message ?? "Error al cargar productos del gremio"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Efecto inicial
  useEffect(() => {
    if (viewMode === "products") {
      loadGeneralProducts()
    } else if (viewMode === "gremios") {
      loadGremios()
    }
  }, [viewMode, loadGeneralProducts, loadGremios])

  // Manejar selección de gremio
  const handleSelectGremio = (gremio: GremioListBody) => {
    setSelectedGremio(gremio)
    setViewMode("gremio-products")
    loadGremioProducts(gremio.id)
    setSearchQuery("")
  }

  // Volver a vista anterior
  const handleGoBack = () => {
    if (viewMode === "gremio-products") {
      setViewMode("gremios")
      setSelectedGremio(null)
      setProducts([])
    } else {
      setViewMode("products")
    }
    setSearchQuery("")
  }

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSidebarCategory = sidebarFilters.selectedCategory === "todo" || 
                                   product.category.toLowerCase() === sidebarFilters.selectedCategory.toLowerCase()
    const matchesSidebarPrice = sidebarFilters.priceRange[0] === 0 || 
                               product.price <= sidebarFilters.priceRange[0]
    const hasStock = product.stock === undefined || product.stock > 0 // Ocultar productos sin stock
    
    return matchesSearch && matchesSidebarCategory && matchesSidebarPrice && hasStock
  })

  // Filtrar gremios
  const filteredGremios = gremios.filter(gremio =>
    gremio.nombre.toLowerCase().includes(gremioSearchQuery.toLowerCase()) ||
    gremio.descripcion.toLowerCase().includes(gremioSearchQuery.toLowerCase()) ||
    gremio.ubicacion.toLowerCase().includes(gremioSearchQuery.toLowerCase())
  )

  const getTitle = () => {
    switch (viewMode) {
      case "gremios": return "Gremios Disponibles"
      case "gremio-products": return `Productos de ${selectedGremio?.nombre || "Gremio"}`
      default: return "Productos Disponibles"
    }
  }

  return (
    <>
      <DashboardLayout 
        title={getTitle()}
        onFilterChange={handleFilterChange}
      >
        <div className="flex-1 bg-gray-50">
          {/* Header con controles de vista */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  {/* Botón de volver */}
                  {(viewMode === "gremios" || viewMode === "gremio-products") && (
                    <Button variant="ghost" onClick={handleGoBack} className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Volver
                    </Button>
                  )}

                  {/* Filtros activos */}
                  {viewMode !== "gremios" && (
                    <>
                      {sidebarFilters.selectedCategory !== "todo" && (
                        <Badge variant="outline" className="capitalize">
                          {sidebarFilters.selectedCategory}
                        </Badge>
                      )}
                      {sidebarFilters.priceRange[0] > 0 && (
                        <Badge variant="outline">
                          Hasta ${sidebarFilters.priceRange[0].toLocaleString()}
                        </Badge>
                      )}
                    </>
                  )}

                  <span className="text-sm text-gray-600">
                    {isLoading ? "Cargando..." : 
                     viewMode === "gremios" ? 
                       `${filteredGremios.length} gremio${filteredGremios.length !== 1 ? 's' : ''} encontrado${filteredGremios.length !== 1 ? 's' : ''}` :
                       `${filteredProducts.length} producto${filteredProducts.length !== 1 ? 's' : ''} encontrado${filteredProducts.length !== 1 ? 's' : ''}`
                    }
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Botones de cambio de vista */}
                  {viewMode === "products" && (
                    <Button 
                      variant="outline" 
                      onClick={() => setViewMode("gremios")}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Ver Gremios
                    </Button>
                  )}

                  {/* Carrito */}
                  <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Carrito
                    {cart.itemCount > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {cart.itemCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                {viewMode === "gremios" ? (
                  <Input
                    placeholder="Buscar gremios por nombre, descripción o ubicación..."
                    value={gremioSearchQuery}
                    onChange={(e) => setGremioSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                ) : (
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="container mx-auto px-4 py-8">
            {viewMode === "gremios" ? (
              // Vista de Gremios
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGremios.map((gremio) => (
                  <Card 
                    key={gremio.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectGremio(gremio)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-xl text-gray-900 mb-2">
                            {gremio.nombre}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {gremio.descripcion}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                          <Users className="h-3 w-3 mr-1" />
                          Gremio
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{gremio.ubicacion}</span>
                      </div>

                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        Ver Productos
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Vista de Productos
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== PLACEHOLDER_URL) target.src = PLACEHOLDER_URL
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4 text-gray-600" />
                      </Button>
                      {product.stock !== undefined && (
                        <Badge 
                          variant={product.available ? "default" : "destructive"}
                          className="absolute bottom-2 left-2"
                        >
                          {product.available ? `Stock: ${product.stock}` : "Agotado"}
                        </Badge>
                      )}
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
                          {product.name}
                        </h3>
                        <Badge variant="outline" className="ml-2 flex-shrink-0 capitalize">
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
                        onClick={() => {
                          setSelectedProduct(product)
                          setIsModalOpen(true)
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
                        disabled={!product.available}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {product.available ? "Añadir al carrito" : "Agotado"}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty States */}
            {isLoading ? (
              <div className="text-center py-12">Cargando...</div>
            ) : viewMode === "gremios" && filteredGremios.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron gremios</h3>
                  <p>Intenta cambiar los términos de búsqueda</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 && viewMode !== "gremios" ? (
              <div className="text-center py-12">
                <div className="text-gray-500">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                  <p>Intenta cambiar los filtros o términos de búsqueda</p>
                </div>
              </div>
            ) : null}

            {/* Error State */}
            {fetchError && (
              <div className="text-center py-12">
                <div className="text-red-500">
                  <h3 className="text-lg font-medium mb-2">Error al cargar datos</h3>
                  <p>{fetchError}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      if (viewMode === "products") loadGeneralProducts()
                      else if (viewMode === "gremios") loadGremios()
                      else if (selectedGremio) loadGremioProducts(selectedGremio.id)
                    }}
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>

      <AddToCartModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleConfirmAddToCart}
      />

      <FloatingCart
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
      />
    </>
  )
}