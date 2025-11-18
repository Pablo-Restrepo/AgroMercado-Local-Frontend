import { useAuth } from "@/hooks/auth/useAuth"
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"

export function useSessionHandler() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleSessionExpired = useCallback(() => {
    console.log('Sesión expirada, cerrando sesión...')
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return { handleSessionExpired }
}