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
import { useSnackbar } from "notistack"

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
  const { enqueueSnackbar } = useSnackbar()

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
    tipoUsuario: "comprador",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleChange = (field: keyof RegisterForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const validate = (): boolean => {
    if (!form.nombre.trim()) return setError("El nombre es requerido"), false
    if (!form.apellidos.trim()) return setError("Los apellidos son requeridos"), false
    if (!form.email.trim() || !form.email.includes("@")) return setError("Correo inválido"), false
    if (!form.cedula.trim()) return setError("La cédula es requerida"), false
    if (!form.fechaNacimiento) return setError("La fecha de nacimiento es requerida"), false
    if (!form.direccion.trim()) return setError("La dirección es requerida"), false
    if (!form.telefono.trim()) return setError("El teléfono es requerido"), false
    if (!form.nombreUsuario.trim()) return setError("El nombre de usuario es requerido"), false
    if (form.contrasenia.length < 8) return setError("La contraseña debe tener al menos 8 caracteres"), false
    if (form.contrasenia !== form.confirmarContrasenia) return setError("Las contraseñas no coinciden"), false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setError(null)

    const payload = {
      u_nombre_usuario: form.nombreUsuario,
      u_contrasenia: form.contrasenia,
      u_email: form.email,
      u_rol: form.tipoUsuario === "comprador" ? "cliente" : "productor-admin",
      persona: {
        p_cedula: form.cedula,
        p_apellido: form.apellidos,
        p_nombre: form.nombre,
        p_fecha_nacimiento: form.fechaNacimiento,
        p_direccion: form.direccion,
        p_telefono: form.telefono,
      },
    }

    try {
      await authApi.register(payload)
      // Notificación de éxito y redirección
      enqueueSnackbar("Registro exitoso. Puedes iniciar sesión.", { variant: "success" })
      navigate("/login")
    } catch (err: any) {
      // Mostrar mensaje amigable (sin códigos)
      const getFriendly = (e: any) => {
        if (!e) return "Error al registrar el usuario"
        if (typeof e === "string") return stripCode(e)
        if (e?.response?.data?.message) return stripCode(String(e.response.data.message))
        if (e?.message) return stripCode(String(e.message))
        return "Error al registrar el usuario"
      }

      const stripCode = (s: string) =>
        s.replace(/^request failed with status code \d+\s*[:-]?\s*/i, "")
          .replace(/^error[:\s]*\d+\s*[:-]?\s*/i, "")
          .replace(/^[[(]?(\d{3})[\])]?[:-]?\s*/i, "")
          .trim()

      const friendly = getFriendly(err)
      setError(friendly)
      enqueueSnackbar(friendly, { variant: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden lg:block bg-gray-100">
        <img
          src="https://growtanical.co.uk/cdn/shop/collections/vpLGH2GzU97jufqBhgtCGB.jpg"
          alt="Productos frescos"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col p-6 md:p-10">
        <div className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="AgroMercado" className="h-8 w-8" />
            <span className="text-lg font-bold">AgroMercado</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">Registrarse</h1>
              <p className="text-gray-600 text-sm mt-1">Únete a AgroMercado Local y conecta con productores locales</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre <span className="text-red-600">*</span></Label>
                <Input id="nombre" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos <span className="text-red-600">*</span></Label>
                <Input id="apellidos" value={form.apellidos} onChange={(e) => handleChange("apellidos", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico <span className="text-red-600">*</span></Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cedula">Cédula <span className="text-red-600">*</span></Label>
                  <Input id="cedula" value={form.cedula} onChange={(e) => handleChange("cedula", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaNacimiento">Fecha de nacimiento <span className="text-red-600">*</span></Label>
                  <Input id="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={(e) => handleChange("fechaNacimiento", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección <span className="text-red-600">*</span></Label>
                <Input id="direccion" value={form.direccion} onChange={(e) => handleChange("direccion", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono <span className="text-red-600">*</span></Label>
                <Input id="telefono" value={form.telefono} onChange={(e) => handleChange("telefono", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nombreUsuario">Nombre de usuario <span className="text-red-600">*</span></Label>
                <Input id="nombreUsuario" value={form.nombreUsuario} onChange={(e) => handleChange("nombreUsuario", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contrasenia">Contraseña <span className="text-red-600">*</span></Label>
                  <Input id="contrasenia" type="password" value={form.contrasenia} onChange={(e) => handleChange("contrasenia", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarContrasenia">Confirmar contraseña <span className="text-red-600">*</span></Label>
                  <Input id="confirmarContrasenia" type="password" value={form.confirmarContrasenia} onChange={(e) => handleChange("confirmarContrasenia", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base text-center">Tipo de cuenta</Label>
                <RadioGroup value={form.tipoUsuario} onValueChange={(v) => handleChange("tipoUsuario", v as "comprador" | "productor")} className="grid grid-cols-2 gap-3 mt-2">
                  <Label htmlFor="comprador" className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                    <RadioGroupItem value="comprador" id="comprador" />
                    <ShoppingCart className="h-4 w-4" /> Comprador
                  </Label>
                  <Label htmlFor="productor" className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                    <RadioGroupItem value="productor" id="productor" />
                    <User className="h-4 w-4" /> Productor
                  </Label>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>

              <p className="text-xs text-center text-gray-500 mt-3">
                Al hacer clic en continuar, aceptas nuestros{" "}
                <Link to="/terminos" className="underline">Términos de servicio</Link> y{" "}
                <Link to="/privacidad" className="underline">Política de privacidad</Link>.
              </p>

              <div className="text-center text-sm">
                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                <Link to="/login" className="text-green-600 font-medium">Inicia sesión</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}