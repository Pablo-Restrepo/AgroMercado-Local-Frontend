import { Link, Navigate } from "react-router-dom"
import { LoginForm } from "@/components/auth/LoginForm"
import { useAuth } from "@/hooks/auth/useAuth"

export default function LoginPage() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://growtanical.co.uk/cdn/shop/collections/vpLGH2GzU97jufqBhgtCGB.jpg" alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src="/logo.svg" alt="AgroMercado" className="h-8 w-8" />
            <span className="text-xl font-bold">AgroMercado</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>

    </div>
  )
}
