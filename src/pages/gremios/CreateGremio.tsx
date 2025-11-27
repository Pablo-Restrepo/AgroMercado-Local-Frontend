import { useNavigate } from "react-router-dom"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GremioForm } from "@/components/gremios/GremioForm"

export default function CreateGremio() {
    const navigate = useNavigate()

    const handleSubmit = (name: string) => {
        console.log("Crear gremio con nombre:", name)

        // Aquí conectarás con tu servicio/API
        // Por ahora, solo mostramos un mensaje de éxito
        alert(`Gremio "${name}" creado exitosamente`)

        // Navegar al dashboard o a la página de gremios
        navigate("/dashboard")
    }

    const handleCancel = () => {
        navigate(-1)
    }

    return (
        <DashboardLayout title="Crear Gremio" showBackButton>
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <GremioForm onSubmit={handleSubmit} onCancel={handleCancel} />
                </div>
            </div>
        </DashboardLayout>
    )
}
