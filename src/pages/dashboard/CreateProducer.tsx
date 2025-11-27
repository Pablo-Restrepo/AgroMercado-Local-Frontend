import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"

interface ProducerForm {
    cedula: string
    nombre: string
    apellidos: string
    direccion: string
    fechaNacimiento: string
    contrasena: string
    confirmarContrasena: string
    correo: string
    confirmarCorreo: string
}

export default function CreateProducer() {
    const [form, setForm] = useState<ProducerForm>({
        cedula: "",
        nombre: "",
        apellidos: "",
        direccion: "",
        fechaNacimiento: "",
        contrasena: "",
        confirmarContrasena: "",
        correo: "",
        confirmarCorreo: ""
    })

    const [errors, setErrors] = useState<Partial<Record<keyof ProducerForm, string>>>({})

    const handleInputChange = (field: keyof ProducerForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProducerForm, string>> = {}

        // Validar campos requeridos
        if (!form.cedula.trim()) newErrors.cedula = "La cédula es requerida"
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!form.apellidos.trim()) newErrors.apellidos = "Los apellidos son requeridos"
        if (!form.direccion.trim()) newErrors.direccion = "La dirección es requerida"
        if (!form.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida"
        if (!form.contrasena) newErrors.contrasena = "La contraseña es requerida"
        if (!form.confirmarContrasena) newErrors.confirmarContrasena = "Confirma la contraseña"
        if (!form.correo.trim()) newErrors.correo = "El correo es requerido"
        if (!form.confirmarCorreo.trim()) newErrors.confirmarCorreo = "Confirma el correo"

        // Validar contraseñas coincidan
        if (form.contrasena && form.confirmarContrasena && form.contrasena !== form.confirmarContrasena) {
            newErrors.confirmarContrasena = "Las contraseñas no coinciden"
        }

        // Validar correos coincidan
        if (form.correo && form.confirmarCorreo && form.correo !== form.confirmarCorreo) {
            newErrors.confirmarCorreo = "Los correos no coinciden"
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (form.correo && !emailRegex.test(form.correo)) {
            newErrors.correo = "Formato de correo inválido"
        }

        // Validar longitud de contraseña
        if (form.contrasena && form.contrasena.length < 6) {
            newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        console.log("Formulario a enviar:", form)
        // Aquí conectarás con tu servicio
        alert("Productor creado exitosamente (placeholder)")

        // Resetear formulario
        setForm({
            cedula: "",
            nombre: "",
            apellidos: "",
            direccion: "",
            fechaNacimiento: "",
            contrasena: "",
            confirmarContrasena: "",
            correo: "",
            confirmarCorreo: ""
        })
    }

    return (
        <DashboardLayout title="Mi gremio">
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header Card - Información del Gremio */}
                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="h-8 w-8 text-gray-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Finca Los Robles</h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Información acerca del gremio que administras
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulario de Creación */}
                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Crear productor
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Primera fila: Cédula, Nombre, Apellidos */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                                            Cédula
                                        </Label>
                                        <Input
                                            id="cedula"
                                            type="text"
                                            placeholder="Value"
                                            value={form.cedula}
                                            onChange={(e) => handleInputChange("cedula", e.target.value)}
                                            className={errors.cedula ? "border-red-500" : ""}
                                        />
                                        {errors.cedula && (
                                            <p className="text-xs text-red-500">{errors.cedula}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="nombre"
                                            type="text"
                                            placeholder="Value"
                                            value={form.nombre}
                                            onChange={(e) => handleInputChange("nombre", e.target.value)}
                                            className={errors.nombre ? "border-red-500" : ""}
                                        />
                                        {errors.nombre && (
                                            <p className="text-xs text-red-500">{errors.nombre}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="apellidos" className="text-sm font-medium text-gray-700">
                                            Apellidos
                                        </Label>
                                        <Input
                                            id="apellidos"
                                            type="text"
                                            placeholder="Value"
                                            value={form.apellidos}
                                            onChange={(e) => handleInputChange("apellidos", e.target.value)}
                                            className={errors.apellidos ? "border-red-500" : ""}
                                        />
                                        {errors.apellidos && (
                                            <p className="text-xs text-red-500">{errors.apellidos}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Segunda fila: Dirección, Fecha de nacimiento */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion" className="text-sm font-medium text-gray-700">
                                            Dirección
                                        </Label>
                                        <Input
                                            id="direccion"
                                            type="text"
                                            placeholder="Value"
                                            value={form.direccion}
                                            onChange={(e) => handleInputChange("direccion", e.target.value)}
                                            className={errors.direccion ? "border-red-500" : ""}
                                        />
                                        {errors.direccion && (
                                            <p className="text-xs text-red-500">{errors.direccion}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fechaNacimiento" className="text-sm font-medium text-gray-700">
                                            fecha de nacimiento
                                        </Label>
                                        <Input
                                            id="fechaNacimiento"
                                            type="date"
                                            placeholder="DD/MM/YYYY"
                                            value={form.fechaNacimiento}
                                            onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                                            className={errors.fechaNacimiento ? "border-red-500" : ""}
                                        />
                                        {errors.fechaNacimiento && (
                                            <p className="text-xs text-red-500">{errors.fechaNacimiento}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tercera fila: Contraseña, Correo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contrasena" className="text-sm font-medium text-gray-700">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="contrasena"
                                            type="password"
                                            placeholder="Value"
                                            value={form.contrasena}
                                            onChange={(e) => handleInputChange("contrasena", e.target.value)}
                                            className={errors.contrasena ? "border-red-500" : ""}
                                        />
                                        {errors.contrasena && (
                                            <p className="text-xs text-red-500">{errors.contrasena}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="correo" className="text-sm font-medium text-gray-700">
                                            Correo
                                        </Label>
                                        <Input
                                            id="correo"
                                            type="email"
                                            placeholder="Value"
                                            value={form.correo}
                                            onChange={(e) => handleInputChange("correo", e.target.value)}
                                            className={errors.correo ? "border-red-500" : ""}
                                        />
                                        {errors.correo && (
                                            <p className="text-xs text-red-500">{errors.correo}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Cuarta fila: Confirmar contraseña, Confirmar correo */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmarContrasena" className="text-sm font-medium text-gray-700">
                                            Confirmar contraseña
                                        </Label>
                                        <Input
                                            id="confirmarContrasena"
                                            type="password"
                                            placeholder="Value"
                                            value={form.confirmarContrasena}
                                            onChange={(e) => handleInputChange("confirmarContrasena", e.target.value)}
                                            className={errors.confirmarContrasena ? "border-red-500" : ""}
                                        />
                                        {errors.confirmarContrasena && (
                                            <p className="text-xs text-red-500">{errors.confirmarContrasena}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmarCorreo" className="text-sm font-medium text-gray-700">
                                            Confirmar correo
                                        </Label>
                                        <Input
                                            id="confirmarCorreo"
                                            type="email"
                                            placeholder="Value"
                                            value={form.confirmarCorreo}
                                            onChange={(e) => handleInputChange("confirmarCorreo", e.target.value)}
                                            className={errors.confirmarCorreo ? "border-red-500" : ""}
                                        />
                                        {errors.confirmarCorreo && (
                                            <p className="text-xs text-red-500">{errors.confirmarCorreo}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botón de crear */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                                    >
                                        Crear
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    )
}
