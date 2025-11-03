import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { authStorage } from "@/services/storage/authStorage"

/**
 * Protege rutas: si no hay token, redirige a /login
 */
export function RequireAuth() {
  const token = authStorage?.getAccessToken?.()
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}
