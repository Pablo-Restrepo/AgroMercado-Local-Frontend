import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import * as productoApi from "@/services/api/productoApi"
import * as categoryApi from "@/services/api/categoryApi"
import type { ProductorProduct } from "@/services/api/productoApi"
import type { Category } from "@/services/api/categoryApi"
import { useAuth } from "@/hooks/auth/useAuth"
import { ProductManagementCard } from "@/components/products/ProductManagementCard"
import { useNavigate } from "react-router-dom"
import { DeleteConfirmDialog } from "@/components/modals/DeleteConfirmDialog"
import { formatErrorMessage } from "@/utils/errorMessages"
import { mapCategoryIdToName, FALLBACK_CATEGORIES, normalizeCategoryForFilter } from "@/utils/categoryMapper"

export default function DashBoardProductsList() {
    const [products, setProducts] = useState<ProductorProduct[]>([])
    const [categorias, setCategorias] = useState<Category[]>(FALLBACK_CATEGORIES)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean
        product: ProductorProduct | null
        isLoading: boolean
    }>({
        isOpen: false,
        product: null,
        isLoading: false
    })
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    
    const [filters, setFilters] = useState({
        selectedCategory: "todo",
        priceRange: [0]
    })

    // Función para mapear categorías para filtrado
    const mapCategoryToFilterId = useCallback((product: ProductorProduct): string => {
        const categoryName = mapCategoryIdToName(product.cat_id, product.p_tipo, categorias)
        if (categoryName === "Sin categoría") return 'otros'
        return normalizeCategoryForFilter(categoryName)
    }, [categorias])

    // Cargar categorías con fallback
    useEffect(() => {
        const loadCategorias = async () => {
            try {
                const categoriasData = await categoryApi.listarCategorias()
                if (categoriasData && categoriasData.length > 0) {
                    setCategorias(categoriasData)
                } else {
                    setCategorias(FALLBACK_CATEGORIES)
                }
            } catch (err) {
                console.error("Error loading categories:", err)
                setCategorias(FALLBACK_CATEGORIES)
            }
        }

        loadCategorias()
    }, [])

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
                setError(formatErrorMessage(err))
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [user, isAuthenticated])

    // Filtrar productos - MEJORADO
    const filteredProducts = products.filter(product => {
        try {
            const categoryMatch = filters.selectedCategory === "todo" || 
                                 mapCategoryToFilterId(product) === filters.selectedCategory
            
            const priceMatch = filters.priceRange[0] === 0 || 
                              (product.p_precio !== undefined && product.p_precio <= filters.priceRange[0])
            
            return categoryMatch && priceMatch
        } catch (err) {
            console.warn("Error filtering product:", product, err)
            return true
        }
    })

    // Función para manejar edición de producto
    const handleEditProduct = (product: ProductorProduct) => {
        if (product.p_id) {
            navigate(`/dashboard/editar-producto/${product.p_id}`)
        } else {
            console.error("Producto sin ID:", product)
            setError("No se puede editar este producto. Falta información del ID.")
        }
    }

    // Abrir dialog de confirmación
    const handleDeleteProduct = (product: ProductorProduct) => {
        if (!product.p_id) {
            setError("No se puede eliminar este producto. Falta información del ID.")
            return
        }
        setDeleteDialog({ isOpen: true, product, isLoading: false })
    }

    // Confirmar eliminación
    const confirmDelete = async () => {
        if (!deleteDialog.product?.p_id) return

        setDeleteDialog(prev => ({ ...prev, isLoading: true }))
        
        try {
            await productoApi.deleteProduct(deleteDialog.product.p_id)
            setProducts(prev => prev.filter(p => p.p_id !== deleteDialog.product!.p_id))
            setDeleteDialog({ isOpen: false, product: null, isLoading: false })
        } catch (err) {
            console.error("Error deleting product:", err)
            setError(formatErrorMessage(err))
            setDeleteDialog(prev => ({ ...prev, isLoading: false }))
        }
    }

    // Cerrar dialog
    const closeDeleteDialog = () => {
        if (!deleteDialog.isLoading) {
            setDeleteDialog({ isOpen: false, product: null, isLoading: false })
        }
    }

    // Manejar cambio de filtros
    const handleFilterChange = useCallback((newFilters: { selectedCategory: string; priceRange: number[] }) => {
        try {
            setFilters(newFilters)
        } catch (err) {
            console.error("Error updating filters:", err)
        }
    }, [])

    if (!isAuthenticated) {
        return (
            <DashboardLayout title="Mis Productos" hideFilters>
                <div className="flex flex-1 flex-col items-center justify-center p-4">
                    <p className="text-muted-foreground">Debes iniciar sesión para ver tus productos</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout 
            title="Mis Productos"
            onFilterChange={handleFilterChange}
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
                    <div className="flex items-center justify-center py-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
                            <div className="text-center">
                                <p className="text-red-800 mb-4">{error}</p>
                                <button 
                                    onClick={() => {
                                        setError(null)
                                        window.location.reload()
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">
                                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                                {filters.selectedCategory !== "todo" && (
                                    <span className="ml-2 text-xs text-gray-500 capitalize">
                                        - Categoría: {filters.selectedCategory.replace(/_/g, ' ')}
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="grid auto-rows-fr grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto w-full max-w-7xl place-items-center">
                            {filteredProducts.map((product, index) => (
                                <ProductManagementCard 
                                    key={product.p_id ? `product-${product.p_id}` : `${product.p_nombre}-${index}`}
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
                                {products.length > 0 && filters.selectedCategory !== "todo" && (
                                    <button 
                                        onClick={() => setFilters(prev => ({ ...prev, selectedCategory: "todo" }))}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                    >
                                        Limpiar filtros
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmDialog
                    isOpen={deleteDialog.isOpen}
                    onClose={closeDeleteDialog}
                    onConfirm={confirmDelete}
                    title={deleteDialog.product?.p_nombre || ""}
                    description="Este producto se eliminará permanentemente de tu catálogo."
                    isLoading={deleteDialog.isLoading}
                />
            </div>
        </DashboardLayout>
    )
}