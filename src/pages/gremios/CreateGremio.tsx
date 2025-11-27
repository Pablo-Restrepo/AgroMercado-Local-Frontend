import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GremioForm, type GremioFormData } from "@/components/gremios/GremioForm"
import { createGremio } from "@/services/api/gremiosApi"
import { authStorage } from "@/services/storage/authStorage"

export default function CreateGremio() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: GremioFormData) => {
        setIsLoading(true)

        try {
            // Obtener el ID del usuario del token almacenado
            const token = authStorage.getAccessToken()
            if (!token) {
                alert("No se encontró token de autenticación")
                navigate("/login")
                return
            }

            // Decodificar el token para obtener el user ID
            const payload = JSON.parse(atob(token.split('.')[1]))
            const userId = parseInt(payload.sub)

            if (!userId) {
                alert("No se pudo obtener el ID del usuario")
                return
            }

            // Crear el gremio
            const gremio = await createGremio(userId, data)

            console.log("Gremio creado exitosamente:", gremio)
            alert(`Gremio "${gremio.nombre}" creado exitosamente`)

            // Navegar al dashboard o a la página de gremios
            navigate("/dashboard")
        } catch (error) {
            console.error("Error al crear el gremio:", error)
            alert(error instanceof Error ? error.message : "Error al crear el gremio")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <DashboardLayout title="Crear Gremio" showBackButton>
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
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
