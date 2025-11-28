import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textArea"


export interface GremioFormData {
    nombre: string
    descripcion: string
    ubicacion: string
}

interface GremioFormProps {
    onSubmit: (data: GremioFormData) => void
    onCancel: () => void
}

export function GremioForm({ onSubmit, onCancel }: GremioFormProps) {
    const [formData, setFormData] = useState<GremioFormData>({
        nombre: "",
        descripcion: "",
        ubicacion: ""
    })
    const [errors, setErrors] = useState<Partial<Record<keyof GremioFormData, string>>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validación
        const newErrors: Partial<Record<keyof GremioFormData, string>> = {}

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre del gremio es requerido"
        } else if (formData.nombre.trim().length < 3) {
            newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es requerida"
        } else if (formData.descripcion.trim().length < 10) {
            newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
        }

        if (!formData.ubicacion.trim()) {
            newErrors.ubicacion = "La ubicación es requerida"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        onSubmit({
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
            ubicacion: formData.ubicacion.trim()
        })
    }

    const handleCancel = () => {
        setFormData({ nombre: "", descripcion: "", ubicacion: "" })
        setErrors({})
        onCancel()
    }

    const updateField = (field: keyof GremioFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                    Crear Gremio
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Crea un nuevo gremio para organizar y conectar a los productores de tu comunidad
                </p>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nombre del gremio */}
                    <div className="space-y-2">
                        <Label htmlFor="gremio-name" className="text-sm font-medium text-gray-700">
                            Nombre del Gremio <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="gremio-name"
                            type="text"
                            placeholder="Ej: Gremio de Agricultores"
                            value={formData.nombre}
                            onChange={(e) => updateField("nombre", e.target.value)}
                            className={`w-full ${errors.nombre ? "border-red-500" : ""}`}
                            autoFocus
                        />
                        {errors.nombre && (
                            <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            El nombre debe ser descriptivo y único para tu gremio
                        </p>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="gremio-descripcion" className="text-sm font-medium text-gray-700">
                            Descripción <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="gremio-descripcion"
                            placeholder="Ej: Gremio dedicado a la agricultura sostenible"
                            value={formData.descripcion}
                            onChange={(e) => updateField("descripcion", e.target.value)}
                            className={`w-full min-h-[100px] ${errors.descripcion ? "border-red-500" : ""}`}
                            rows={4}
                        />
                        {errors.descripcion && (
                            <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            Describe el propósito y objetivos del gremio
                        </p>
                    </div>

                    {/* Ubicación */}
                    <div className="space-y-2">
                        <Label htmlFor="gremio-ubicacion" className="text-sm font-medium text-gray-700">
                            Ubicación <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="gremio-ubicacion"
                            type="text"
                            placeholder="Ej: Vereda Santa Barbara, Popayán"
                            value={formData.ubicacion}
                            onChange={(e) => updateField("ubicacion", e.target.value)}
                            className={`w-full ${errors.ubicacion ? "border-red-500" : ""}`}
                        />
                        {errors.ubicacion && (
                            <p className="text-sm text-red-500 mt-1">{errors.ubicacion}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            Indica la ubicación geográfica del gremio
                        </p>
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
                            Crear Gremio
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
