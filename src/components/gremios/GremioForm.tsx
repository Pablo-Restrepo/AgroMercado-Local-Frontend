import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

interface GremioFormProps {
    onSubmit: (name: string) => void
    onCancel: () => void
}

export function GremioForm({ onSubmit, onCancel }: GremioFormProps) {
    const [gremioName, setGremioName] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validación
        if (!gremioName.trim()) {
            setError("El nombre del gremio es requerido")
            return
        }

        if (gremioName.trim().length < 3) {
            setError("El nombre debe tener al menos 3 caracteres")
            return
        }

        setError("")
        onSubmit(gremioName.trim())
    }

    const handleCancel = () => {
        setGremioName("")
        setError("")
        onCancel()
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
                            placeholder="Ej: Gremio de Productores de Café"
                            value={gremioName}
                            onChange={(e) => {
                                setGremioName(e.target.value)
                                if (error) setError("")
                            }}
                            className={`w-full ${error ? "border-red-500" : ""}`}
                            autoFocus
                        />
                        {error && (
                            <p className="text-sm text-red-500 mt-1">{error}</p>
                        )}
                        <p className="text-xs text-gray-500">
                            El nombre debe ser descriptivo y único para tu gremio
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
