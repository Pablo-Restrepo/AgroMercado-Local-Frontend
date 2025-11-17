/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingCart, User } from "lucide-react"
import { authApi } from "@/services/api/authApi"
import { useAuth } from "@/hooks/auth/useAuth"

interface RegisterForm {
  nombre: string
  apellidos: string
  email: string
  cedula: string
  fechaNacimiento: string
  direccion: string
  telefono: string
  nombreUsuario: string
  contrasenia: string
  confirmarContrasenia: string
  tipoUsuario: "comprador" | "productor"
}

export default function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [form, setForm] = useState<RegisterForm>({
    nombre: "",
    apellidos: "",
    email: "",
    cedula: "",
    fechaNacimiento: "",
    direccion: "",
    telefono: "",
    nombreUsuario: "",
    contrasenia: "",
    confirmarContrasenia: "",
    tipoUsuario: "comprador"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleInputChange = (field: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError("") // Limpiar error al escribir
  }

  const validateForm = (): boolean => {
    if (!form.nombre.trim()) {
      setError("El nombre es requerido")
      return false
    }
    if (!form.apellidos.trim()) {
      setError("Los apellidos son requeridos")
      return false
    }
    if (!form.email.trim()) {
      setError("El correo electrónico es requerido")
      return false
    }
    if (!form.email.includes("@")) {
      setError("Ingresa un correo electrónico válido")
      return false
    }
    if (!form.cedula.trim()) {
      setError("La cédula es requerida")
      return false
    }
    if (!form.fechaNacimiento) {
      setError("La fecha de nacimiento es requerida")
      return false
    }
    if (!form.direccion.trim()) {
      setError("La dirección es requerida")
      return false
    }
    if (!form.telefono.trim()) {
      setError("El teléfono es requerido")
      return false
    }
    if (!form.nombreUsuario.trim()) {
      setError("El nombre de usuario es requerido")
      return false
    }
    if (form.contrasenia.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres")
      return false
    }
    if (form.contrasenia !== form.confirmarContrasenia) {
      setError("Las contraseñas no coinciden")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setError("")

    try {
      const payload = {
        u_nombre_usuario: form.nombreUsuario,
        u_contrasenia: form.contrasenia,
        u_email: form.email,
        u_rol: form.tipoUsuario === "comprador" ? "comprador" : "productor-admin",
        persona: {
          p_cedula: form.cedula,
          p_apellido: form.apellidos,
          p_nombre: form.nombre,
          p_fecha_nacimiento: form.fechaNacimiento,
          p_direccion: form.direccion,
          p_telefono: form.telefono
        }
      }

      await authApi.register(payload)
      
      // Registro exitoso, redirigir al login
      navigate("/login", { 
        state: { message: "Registro exitoso. Ahora puedes iniciar sesión." }
      })
    } catch (err: any) {
      setError(err.message || "Error al registrar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://growtanical.co.uk/cdn/shop/collections/vpLGH2GzU97jufqBhgtCGB.jpg" 
          alt="Productos frescos"
          className="absolute inset-0 h-full w-full object-cover"
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
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Registrarse</h1>
              <p className="text-gray-600 text-sm mt-1">
                Únete a AgroMercado Local y conecta con productores locales
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ingresa tu nombre"
                  value={form.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  type="text"
                  placeholder="Ingresa tus apellidos"
                  value={form.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@acme.co"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Cédula */}
              <div>
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  type="text"
                  placeholder="Número de cédula"
                  value={form.cedula}
                  onChange={(e) => handleInputChange("cedula", e.target.value)}
                  required
                />
              </div>

              {/* Fecha de nacimiento */}
              <div>
                <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                  required
                />
              </div>

              {/* Dirección */}
              <div>
                <Label htmlFor="direccion">Dirección</Label>
                <Input
                  id="direccion"
                  type="text"
                  placeholder="Tu dirección completa"
                  value={form.direccion}
                  onChange={(e) => handleInputChange("direccion", e.target.value)}
                  required
                />
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  type="tel"
                  placeholder="Número de teléfono"
                  value={form.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  required
                />
              </div>

              {/* Nombre de usuario */}
              <div>
                <Label htmlFor="nombreUsuario">Nombre de usuario</Label>
                <Input
                  id="nombreUsuario"
                  type="text"
                  placeholder="Elige un nombre de usuario"
                  value={form.nombreUsuario}
                  onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="contrasenia">Contraseña</Label>
                <Input
                  id="contrasenia"
                  type="password"
                  placeholder="Crea una contraseña segura"
                  value={form.contrasenia}
                  onChange={(e) => handleInputChange("contrasenia", e.target.value)}
                  required
                />
              </div>

              {/* Confirmar contraseña */}
              <div>
                <Label htmlFor="confirmarContrasenia">Confirmar contraseña</Label>
                <Input
                  id="confirmarContrasenia"
                  type="password"
                  placeholder="Ingresa nuevamente la contraseña"
                  value={form.confirmarContrasenia}
                  onChange={(e) => handleInputChange("confirmarContrasenia", e.target.value)}
                  required
                />
              </div>

              {/* Tipo de cuenta */}
              <div>
                <Label className="text-base font-medium">Tipo de cuenta</Label>
                <RadioGroup
                  value={form.tipoUsuario}
                  onValueChange={(value) => handleInputChange("tipoUsuario", value as "comprador" | "productor")}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="comprador" id="comprador" />
                    <Label htmlFor="comprador" className="flex items-center gap-2 cursor-pointer flex-1">
                      <ShoppingCart className="h-4 w-4" />
                      Comprador
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4 flex-1 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="productor" id="productor" />
                    <Label htmlFor="productor" className="flex items-center gap-2 cursor-pointer flex-1">
                      <User className="h-4 w-4" />
                      Productor
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Botón de registro */}
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>

              {/* Términos y condiciones */}
              <p className="text-xs text-center text-gray-500 mt-4">
                Al hacer clic en continuar, aceptas nuestros{" "}
                <Link to="/terminos" className="underline">
                  Términos de servicio
                </Link>{" "}
                y{" "}
                <Link to="/privacidad" className="underline">
                  Política de privacidad
                </Link>
                .
              </p>

              {/* Link a login */}
              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  Inicia sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}