import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textArea"
import Select from "@/components/ui/select"
import * as productoApi from "@/services/api/productoApi"
import type { ProductorProduct, UpdateProductRequest } from "@/services/api/productoApi"
import { formatErrorMessage } from "@/utils/errorMessages"

const categoryOptions = [
  { value: "1", label: "Frutas" },
  { value: "2", label: "Verduras" },
  { value: "3", label: "Medicinales" },
  { value: "4", label: "Tubérculos" },
  { value: "5", label: "Hierbas" }
]

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [product, setProduct] = useState<ProductorProduct | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [formData, setFormData] = useState<UpdateProductRequest>({
    p_nombre: "",
    cat_id: 1,
    p_unidad: "",
    img: "",
    p_precio: 0,
    p_stock: 0,
    p_medicinal: false
  })

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
        
        // Llenar formulario con datos existentes
        setFormData({
          p_nombre: productData.p_nombre || "",
          cat_id: 1, // TODO: mapear desde p_tipo a cat_id
          p_unidad: productData.p_unidad || "",
          img: productData.img || "",
          p_precio: productData.p_precio || 0,
          p_stock: 0, // TODO: obtener stock real si está disponible
          p_medicinal: productData.p_tipo?.toLowerCase().includes("medicinal") || false
        })
      } catch (err) {
        setError(formatErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id])

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
      // Aún así actualizar la vista local para mostrar cambios
      if (product) {
        setProduct(prev => ({
          ...prev!,
          p_nombre: formData.p_nombre,
          p_unidad: formData.p_unidad,
          img: formData.img || prev!.img,
          p_precio: formData.p_precio,
          p_tipo: formData.p_medicinal ? "medicinal" : prev!.p_tipo
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

  if (loading) {
    return (
      <DashboardLayout title="Editar Producto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Cargando producto...</p>
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

              <div>
                <Label htmlFor="img">Imagen (Base64 o URL)</Label>
                <Textarea
                  id="img"
                  value={formData.img}
                  onChange={(e) => handleInputChange("img", e.target.value)}
                  placeholder="data:image/jpeg;base64,... o https://..."
                  rows={3}
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
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
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