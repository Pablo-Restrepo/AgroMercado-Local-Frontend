/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { X, ImagePlus, Loader2 } from "lucide-react"
import Select from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import * as productoApi from "@/services/api/productoApi"
import { useAuth } from "@/hooks/auth/useAuth"

interface ProductForm {
  name: string
  description: string
  price: string
  category: string
  unit: string
  stock: string
  images: File[]
}

export default function CreateProduct() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    unit: "kg",
    stock: "0",
    images: []
  })

  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null) // Limpiar error al hacer cambios
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(file => {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`)
        return false
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} es muy grande (máximo 5MB)`)
        return false
      }
      
      return true
    })

    if (newFiles.length === 0) return

    // Crear URLs de preview
    const newUrls = newFiles.map(file => URL.createObjectURL(file))
    
    setForm(prev => ({ 
      ...prev, 
      images: [...prev.images, ...newFiles] 
    }))
    
    setPreviewUrls(prev => [...prev, ...newUrls])
  }

  const removeImage = (index: number) => {
    // Revocar URL del preview para liberar memoria
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index])
    }
    
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  // Mapeo simple de categorías a cat_id (ajusta los ids según tu backend)
  const categoryToCatId: Record<string, number> = {
    frutas: 1,
    verduras: 2,
    tuberculos: 3,
    hierbas: 4,
    medicinales: 5,
  }

  // Convierte File -> base64 (solo la parte después de la coma)
  const uploadImage = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = () => {
        reader.abort()
        reject(new Error("Error leyendo la imagen"))
      }
      reader.onload = () => {
        const result = reader.result as string
        // result es "data:<mime>;base64,AAAA..."
        const parts = result.split(",")
        if (parts.length === 2) resolve(parts[1])
        else resolve(result) // ya es probable base64 puro
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validaciones
    if (!form.name.trim()) {
      setError("El nombre del producto es requerido")
      return
    }
    
    if (!form.description.trim()) {
      setError("La descripción es requerida")
      return
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("El precio debe ser mayor a 0")
      return
    }
    
    const stockNum = Number.parseInt(form.stock, 10)
    if (Number.isNaN(stockNum) || stockNum < 0) {
      setError("El stock debe ser 0 o un número entero positivo")
      return
    }

    if (!form.category) {
      setError("Selecciona una categoría")
      return
    }

    if (!form.unit) {
      setError("Selecciona una unidad")
      return
    }

    if (!user?.u_id) {
      setError("No se pudo obtener la información del usuario")
      return
    }

    setIsSubmitting(true)

    try {
      // Subir/convertir la primera imagen a base64 (o dejar vacío)
      let imageBase64 = ""
      if (form.images.length > 0) {
        imageBase64 = await uploadImage(form.images[0])
      }

      // Determinar prod_id
      const producerId = Number((user as any).prod_id ?? (user as any).p_id ?? (user as any).prodId ?? user?.u_id)
      if (!Number.isInteger(producerId)) {
        setIsSubmitting(false)
        setError("No se encontró el identificador de productor en el perfil. Completa tu perfil de productor antes de crear productos.")
        return
      }

      // mapear categoría a cat_id y p_medicinal
      const selectedCatId = categoryToCatId[form.category] ?? 0
      const isMedicinal = form.category === "medicinales"

      const productData = {
        p_nombre: form.name.trim(),
        p_tipo: form.category,
        p_unidad: form.unit,
        prod_id: producerId,
        img: imageBase64,          // base64 puro (sin data:)
        p_precio: parseFloat(form.price),
        p_stock: stockNum,
        cat_id: selectedCatId,     // requerido por backend
        p_medicinal: isMedicinal,  // requerido por backend
      }

      // Llamada al API
      const createFn = (productoApi as any).createProduct ?? (productoApi as any).default?.createProduct
      if (typeof createFn !== "function") {
        throw new Error("createProduct no disponible en productoApi. Reinicia el dev server.")
      }

      const productId = await createFn(productData)
      console.log("Producto creado con ID:", productId)
      
      // Limpiar formulario
      previewUrls.forEach(url => URL.revokeObjectURL(url))
      
      // Redirigir a la lista de productos
      navigate("/dashboard/mis-productos", { 
        replace: true,
        state: { message: "Producto creado exitosamente" }
      })
      
    } catch (err) {
      console.error("Error creando producto:", err)
      // Detectar violación de FK (mensaje del backend / código 1452) y mostrar mensaje útil
      const msg = err instanceof Error ? err.message : String(err)
      if (/1452/.test(msg) || /foreign key/i.test(msg) || /Cannot add or update a child row/i.test(msg)) {
        setError("No existe un productor con el id enviado. Verifica tu perfil de productor o contacta soporte.")
      } else {
        setError(msg || "Error al crear el producto")
      }
     } finally {
       setIsSubmitting(false)
     }
  }

  const handleCancel = () => {
    // Limpiar URLs de preview
    previewUrls.forEach(url => URL.revokeObjectURL(url))
    
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      unit: "kg",
      stock: "0",
      images: []
    })
    setPreviewUrls([])
    
    // Navegar hacia atrás
    navigate(-1)
  }

  return (
    <DashboardLayout title="Crear Producto">
      <div className="flex-1 bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Crear producto
              </CardTitle>
              <p className="text-sm text-gray-600">
                Comparte tus productos frescos con la comunidad local
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre del producto */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Nombre del producto <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ej: Tomates orgánicos"
                    value={form.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu producto: origen, características especiales, método de cultivo..."
                    value={form.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="w-full resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Precio y Unidad */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                      Precio <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium text-gray-700">
                      Stock (cantidad) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      value={form.stock}
                      onChange={(e) => handleInputChange("stock", e.target.value)}
                      min="0"
                      step="1"
                      className="w-full"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">
                        Unidad <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={form.unit}
                        onValueChange={(value) => handleInputChange("unit", value)}
                        className={`w-full ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                        options={[
                          { value: "kg", label: "Kilogramo (kg)" },
                          { value: "g", label: "Gramo (g)" },
                          { value: "lb", label: "Libra (lb)" },
                          { value: "unidad", label: "Unidad" },
                          { value: "manojo", label: "Manojo" },
                          { value: "docena", label: "Docena" },
                        ]}
                      />
                    </div>
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    className={`w-full ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                    options={[
                      { value: "", label: "Selecciona categoría" },
                      { value: "frutas", label: "Frutas" },
                      { value: "verduras", label: "Verduras" },
                      { value: "tuberculos", label: "Tubérculos" },
                      { value: "hierbas", label: "Hierbas aromáticas" },
                      { value: "medicinales", label: "Plantas medicinales" },
                    ]}
                  />
                </div>
                {/* Imágenes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Imágenes del producto
                  </Label>
                  
                  {/* Zona de carga */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isSubmitting}
                    />
                    
                    <div className="flex flex-col items-center gap-2">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Arrastra imágenes aquí o{" "}
                        <span className="text-green-600 font-medium">haz clic para seleccionar</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG hasta 5MB cada una
                      </p>
                    </div>
                  </div>

                  {/* Preview de imágenes */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border"
                          />
                          {!isSubmitting && (
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      "Crear Producto"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}