import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/auth/useAuth"

/**
 * Protege rutas; usa el estado del AuthProvider para evitar falsos negativos
 */
export function RequireAuth() {
  const { isAuthenticated } = useAuth()

  // si no autenticado -> redirigir
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
