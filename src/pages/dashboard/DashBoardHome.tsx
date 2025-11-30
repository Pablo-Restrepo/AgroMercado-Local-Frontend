import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"
import { Loader2 } from "lucide-react"

export default function DashboardHome() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return
    }

    // Redirigir según el rol del usuario
    if (user.u_rol === "productor" || user.u_rol === "admin" || user.u_rol === "productor-admin") {
      // Los productores y admins van a ver sus propios productos
      navigate("/dashboard/mis-productos", { replace: true })
    } else {
      // Los clientes van a ver productos disponibles para comprar
      navigate("/dashboard/compras", { replace: true })
    }
  }, [user, isAuthenticated, navigate])

  // Mostrar loading mientras se redirige
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    </div>
  )
}