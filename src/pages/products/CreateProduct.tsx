import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textArea"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { X, ImagePlus } from "lucide-react"
import Select from "@/components/ui/select"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

interface ProductForm {
  name: string
  description: string
  price: string
  category: string
  images: File[]
}

export default function CreateProduct() {
  const navigate = useNavigate()
  
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    images: []
  })

  const [dragActive, setDragActive] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  const handleInputChange = (field: keyof ProductForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    )

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!form.name.trim()) {
      alert("El nombre del producto es requerido")
      return
    }
    
    if (!form.description.trim()) {
      alert("La descripción es requerida")
      return
    }
    
    if (!form.price || parseFloat(form.price) <= 0) {
      alert("El precio debe ser mayor a 0")
      return
    }
    
    if (!form.category) {
      alert("Selecciona una categoría")
      return
    }

    console.log("Formulario a enviar:", form)
    // Aquí conectarás con tu servicio
    alert("Producto creado exitosamente (placeholder)")
  }

  const handleCancel = () => {
    // Limpiar URLs de preview
    previewUrls.forEach(url => URL.revokeObjectURL(url))
    
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
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
                  />
                </div>

                {/* Precio */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Precio (por kg) <span className="text-red-500">*</span>
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
                  />
                </div>

                {/* Categoría */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => handleInputChange("category", value)}
                    className="w-full"
                    options={[
                      { value: "", label: "Selecciona categoría" },
                      { value: "frutas", label: "Frutas" },
                      { value: "verduras", label: "Verduras" },
                      { value: "tuberculos", label: "Tubérculos" },
                      { value: "hierbas", label: "Hierbas" },
                      { value: "medicinales", label: "Medicinales" },
                    ]}
                  />
                </div>

                {/* Imágenes */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Imágenes del producto <span className="text-red-500">*</span>
                  </Label>
                  
                  {/* Zona de carga */}
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      dragActive
                        ? "border-green-500 bg-green-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
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
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
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
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    Crear
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