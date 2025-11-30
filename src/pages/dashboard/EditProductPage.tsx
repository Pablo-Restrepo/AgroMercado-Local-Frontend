import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Select from "@/components/ui/select"
import * as productoApi from "@/services/api/productoApi"
import * as categoryApi from "@/services/api/categoryApi"
import type { ProductorProduct, UpdateProductRequest } from "@/services/api/productoApi"
import type { Category } from "@/services/api/categoryApi"
import { formatErrorMessage } from "@/utils/errorMessages"
import { mapCategoryIdToName, FALLBACK_CATEGORIES } from "@/utils/categoryMapper"
import { Upload, X, Image as ImageIcon } from "lucide-react"

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductorProduct | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [categorias, setCategorias] = useState<Category[]>(FALLBACK_CATEGORIES)
  const [loadingCategorias, setLoadingCategorias] = useState(true)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loadingImage, setLoadingImage] = useState(false)

  const [formData, setFormData] = useState<UpdateProductRequest>({
    p_nombre: "",
    cat_id: 1,
    p_unidad: "",
    img: "",
    p_precio: 0,
    p_stock: 0,
    p_medicinal: false
  })

  // Cargar categorías dinámicamente
  useEffect(() => {
    const loadCategorias = async () => {
      try {
        setLoadingCategorias(true)
        const categoriasData = await categoryApi.listarCategorias()
        if (categoriasData && categoriasData.length > 0) {
          setCategorias(categoriasData)
        } else {
          setCategorias(FALLBACK_CATEGORIES)
        }
      } catch (err) {
        console.error("Error loading categories:", err)
        setCategorias(FALLBACK_CATEGORIES)
      } finally {
        setLoadingCategorias(false)
      }
    }

    loadCategorias()
  }, [])

  // Helper para resolver la imagen
  const resolveImageSrc = (img?: string) => {
    if (!img || !img.trim()) return null
    const trimmed = img.trim()
    
    if (trimmed.startsWith("data:")) return trimmed
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    
    // Asumir que es base64 sin el prefijo
    const cleaned = trimmed.replace(/\s+/g, "")
    if (/^[A-Za-z0-9+/=]+$/.test(cleaned) && cleaned.length > 100) {
      return `data:image/jpeg;base64,${cleaned}`
    }
    
    return null
  }

  // Función para mapear cat_id del producto existente
  const mapProductCategoryId = (product: ProductorProduct): number => {
    // Si ya tiene cat_id, usarlo
    if (product.cat_id && product.cat_id > 0) {
      return product.cat_id
    }

    // Si no, intentar mapear desde p_tipo
    if (product.p_tipo) {
      const categoria = categorias.find(cat => 
        cat.cat_nombre.toLowerCase().includes(product.p_tipo!.toLowerCase()) ||
        product.p_tipo!.toLowerCase().includes(cat.cat_nombre.toLowerCase())
      )
      
      if (categoria) return categoria.cat_id
    }

    // Fallback al primer ID disponible
    return categorias.length > 0 ? categorias[0].cat_id : 1
  }

  // Cargar producto para editar
  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError("Identificador de producto no válido")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const productData = await productoApi.getProductById(Number(id))
        setProduct(productData)
        
        // Resolver imagen existente
        const existingImage = resolveImageSrc(productData.img)
        setImagePreview(existingImage)
        
        // Llenar formulario con datos existentes
        const mappedCategoryId = mapProductCategoryId(productData)
        
        setFormData({
          p_nombre: productData.p_nombre || "",
          cat_id: mappedCategoryId,
          p_unidad: productData.p_unidad || "",
          img: productData.img || "",
          p_precio: productData.p_precio || 0,
          p_stock: productData.p_stock || 0,
          p_medicinal: productData.p_medicinal || false
        })
      } catch (err) {
        setError(formatErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    // Esperar a que las categorías se carguen antes de cargar el producto
    if (!loadingCategorias) {
      loadProduct()
    }
  }, [id, categorias, loadingCategorias])

  // Convertir archivo a Base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Manejar selección de imagen
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setError("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen debe ser menor a 5MB")
      return
    }

    try {
      setLoadingImage(true)
      setImageFile(file)
      
      // Crear preview
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      // Convertir a base64 para el formulario
      const base64 = await convertFileToBase64(file)
      handleInputChange("img", base64)
      
    } catch (err) {
      console.error("Error procesando imagen:", err)
      setError("Error al procesar la imagen")
    } finally {
      setLoadingImage(false)
    }
  }

  // Limpiar imagen
  const handleClearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    handleInputChange("img", "")
    
    // Limpiar el input file
    const fileInput = document.getElementById("image-upload") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!id || !product?.p_id) {
      setError("No se puede guardar el producto. Información de identificación faltante.")
      return
    }

    setSaving(true)
    setError(null)

    try {
      await productoApi.updateProduct(product.p_id, formData)
      setHasUnsavedChanges(false)
      navigate("/dashboard/mis-productos")
    } catch (err) {
      // Actualizar la vista local para mostrar cambios
      if (product) {
        setProduct(prev => ({
          ...prev!,
          p_nombre: formData.p_nombre,
          cat_id: formData.cat_id,
          p_unidad: formData.p_unidad,
          img: formData.img || prev!.img,
          p_precio: formData.p_precio,
          p_stock: formData.p_stock,
          p_medicinal: formData.p_medicinal
        }))
      }
      setError(formatErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof UpdateProductRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    // Limpiar error cuando el usuario hace cambios
    if (error) setError(null)
  }

  // Generar opciones de categorías dinámicamente
  const categoryOptions = categorias.map(cat => ({
    value: String(cat.cat_id),
    label: cat.cat_nombre.charAt(0).toUpperCase() + cat.cat_nombre.slice(1)
  }))

  if (loading || loadingCategorias) {
    return (
      <DashboardLayout title="Editar Producto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">
              {loadingCategorias ? "Cargando categorías..." : "Cargando producto..."}
            </p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !product) {
    return (
      <DashboardLayout title="Editar Producto">
        <div className="container mx-auto px-4 py-6">
          <Card className="p-6">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">{error}</p>
              </div>
              <Button onClick={() => navigate("/dashboard/mis-productos")}>
                Volver a mis productos
              </Button>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title={`Editar: ${product?.p_nombre || "Producto"}`}>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-1">
                    <p className="text-red-800 text-sm font-medium">Problema al guardar</p>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-600 ml-2"
                  >
                    ×
                  </button>
                </div>
                <p className="text-red-600 text-xs mt-2">
                  Tus cambios se mantienen en pantalla. Puedes intentar guardar nuevamente.
                </p>
              </div>
            )}

            <div className="grid gap-4">
              {/* Imagen del producto */}
              <div>
                <Label>Imagen del producto</Label>
                <div className="mt-2 space-y-4">
                  {/* Preview de imagen actual */}
                  {imagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "https://via.placeholder.com/150?text=Error"
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Botón para seleccionar imagen */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      {loadingImage ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          {imagePreview ? <ImageIcon className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                          {imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}
                        </>
                      )}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={loadingImage}
                    />
                    <span className="text-sm text-gray-500">
                      Máximo 5MB, formatos: JPG, PNG, GIF
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="p_nombre">Nombre del producto</Label>
                <Input
                  id="p_nombre"
                  value={formData.p_nombre}
                  onChange={(e) => handleInputChange("p_nombre", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="cat_id">Categoría</Label>
                <Select
                  value={String(formData.cat_id)}
                  onValueChange={(value) => handleInputChange("cat_id", Number(value))}
                  options={categoryOptions}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Categoría actual: {mapCategoryIdToName(formData.cat_id, undefined, categorias)}
                </p>
              </div>

              <div>
                <Label htmlFor="p_unidad">Unidad de medida</Label>
                <Input
                  id="p_unidad"
                  value={formData.p_unidad}
                  onChange={(e) => handleInputChange("p_unidad", e.target.value)}
                  placeholder="kg, unidad, libra..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="p_precio">Precio</Label>
                <Input
                  id="p_precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.p_precio}
                  onChange={(e) => handleInputChange("p_precio", Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="p_stock">Stock disponible</Label>
                <Input
                  id="p_stock"
                  type="number"
                  min="0"
                  value={formData.p_stock}
                  onChange={(e) => handleInputChange("p_stock", Number(e.target.value))}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="p_medicinal"
                  checked={formData.p_medicinal}
                  onChange={(e) => handleInputChange("p_medicinal", e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <Label htmlFor="p_medicinal">¿Es medicinal?</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard/mis-productos")}
                className="flex-1"
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving || loadingImage}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>

            {hasUnsavedChanges && (
              <p className="text-xs text-amber-600 text-center">
                Tienes cambios sin guardar
              </p>
            )}
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}