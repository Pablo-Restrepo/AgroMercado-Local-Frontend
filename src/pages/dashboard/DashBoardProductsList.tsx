import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import * as productoApi from "@/services/api/productoApi"
import type { ProductorProduct } from "@/services/api/productoApi"
import { useAuth } from "@/hooks/auth/useAuth"
import { ProductManagementCard } from "@/components/products/ProductManagementCard"

export default function DashBoardProductsList() {
    const [products, setProducts] = useState<ProductorProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user, isAuthenticated } = useAuth()
    
    const [filters, setFilters] = useState({
        selectedCategory: "todo",
        priceRange: [0]
    })

    // Cargar productos del backend
    useEffect(() => {
        const loadProducts = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setError(null)
                const productsData = await productoApi.getProductsByProductor(user.u_id)
                setProducts(productsData)
            } catch (err) {
                console.error("Error loading products:", err)
                setError(err instanceof Error ? err.message : "Error al cargar productos")
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [user, isAuthenticated])

    // Función para mapear categoría de backend a categorías del filtro
    const mapCategoryToFilter = (p_tipo: string): string => {
        const tipo = p_tipo.toLowerCase()
        if (tipo.includes('fruta')) return 'frutas'
        if (tipo.includes('verdura') || tipo.includes('hortaliza')) return 'verduras'
        if (tipo.includes('medicinal') || tipo.includes('medicina')) return 'medicinales'
        if (tipo.includes('tuberculo') || tipo.includes('tubérculo')) return 'tuberculos'
        if (tipo.includes('hierba') || tipo.includes('aromática')) return 'hierbas'
        return 'otros'
    }

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const categoryMatch = filters.selectedCategory === "todo" || 
                             mapCategoryToFilter(product.p_tipo) === filters.selectedCategory
        const priceMatch = filters.priceRange[0] === 0 || 
                          product.p_precio <= filters.priceRange[0]
        
        return categoryMatch && priceMatch
    })

    // Función para manejar edición de producto
    const handleEditProduct = (product: ProductorProduct) => {
        console.log("Editar producto:", product)
        // TODO: Implementar navegación a página de edición
        // navigate(`/dashboard/editar-producto/${product.id}`)
    }

    // Función para manejar eliminación de producto
    const handleDeleteProduct = async (product: ProductorProduct) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar "${product.p_nombre}"?`)) {
            try {
                // TODO: Implementar llamada al API para eliminar
                console.log("Eliminar producto:", product)
                // await deleteProduct(product.id)
                // Actualizar lista después de eliminar
                // setProducts(prev => prev.filter(p => p.id !== product.id))
            } catch (err) {
                console.error("Error deleting product:", err)
                alert("Error al eliminar el producto")
            }
        }
    }

    if (!isAuthenticated) {
        return (
            <DashboardLayout title="Mis Productos">
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <p className="text-muted-foreground">Debes iniciar sesión para ver tus productos</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout 
            title="Mis Productos"
            onFilterChange={setFilters}
        >
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                            <p className="mt-2 text-muted-foreground">Cargando productos...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <p className="text-red-600 mb-4">Error: {error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Reintentar
                            </button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-full max-w-7xl place-items-center">
                            {filteredProducts.map((product, index) => (
                                <ProductManagementCard 
                                    key={`${product.p_nombre}-${index}`}
                                    product={product} 
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    {products.length === 0 
                                        ? "No tienes productos registrados" 
                                        : "No se encontraron productos con los filtros seleccionados"
                                    }
                                </p>
                                {products.length === 0 && (
                                    <a 
                                        href="/dashboard/crear-producto"
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Crear mi primer producto
                                    </a>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}