import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertCircle } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GremioForm, type GremioFormData } from "@/components/gremios/GremioForm"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createGremio } from "@/services/api/gremiosApi"
import { authStorage } from "@/services/storage/authStorage"

export default function CreateGremio() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: GremioFormData) => {
        setIsLoading(true)
        setError(null) // Clear any previous errors

        try {
            // Obtener el ID del usuario del token almacenado
            const token = authStorage.getAccessToken()
            if (!token) {
                setError("No se encontró token de autenticación")
                navigate("/login")
                return
            }

            // Decodificar el token para obtener el user ID
            const payload = JSON.parse(atob(token.split('.')[1]))
            const userId = parseInt(payload.sub)

            if (!userId) {
                setError("No se pudo obtener el ID del usuario")
                return
            }

            // Crear el gremio
            await createGremio(userId, data)

            // Navegar al dashboard o a la página de gremios
            navigate("/dashboard")
        } catch (error) {
            console.error("Error al crear el gremio:", error)
            setError(error instanceof Error ? error.message : "Error al crear el gremio")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <DashboardLayout title="Crear Gremio" showBackButton hideFilters>
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="flex items-center justify-center p-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                                <p className="mt-4 text-gray-600">Creando gremio...</p>
                            </div>
                        </div>
                    ) : (
                        <GremioForm onSubmit={handleSubmit} onCancel={handleCancel} />
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
