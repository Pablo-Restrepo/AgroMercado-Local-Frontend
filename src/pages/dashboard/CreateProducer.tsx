import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { createProducer } from "@/services/api/producerApi"

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
    codigo: string
    telefono: string
    nombreUsuario: string
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
        confirmarCorreo: "",
        codigo: "",
        telefono: "",
        nombreUsuario: ""
    })

    const [errors, setErrors] = useState<Partial<Record<keyof ProducerForm, string>>>({})

    const handleInputChange = (field: keyof ProducerForm, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProducerForm, string>> = {}

        if (!form.cedula.trim()) newErrors.cedula = "La cédula es requerida"
        if (!form.nombre.trim()) newErrors.nombre = "El nombre es requerido"
        if (!form.apellidos.trim()) newErrors.apellidos = "Los apellidos son requeridos"
        if (!form.direccion.trim()) newErrors.direccion = "La dirección es requerida"
        if (!form.fechaNacimiento) newErrors.fechaNacimiento = "La fecha de nacimiento es requerida"
        if (!form.contrasena) newErrors.contrasena = "La contraseña es requerida"
        if (!form.confirmarContrasena) newErrors.confirmarContrasena = "Confirma la contraseña"
        if (!form.correo.trim()) newErrors.correo = "El correo es requerido"
        if (!form.confirmarCorreo.trim()) newErrors.confirmarCorreo = "Confirma el correo"
        if (!form.codigo.trim()) newErrors.codigo = "El código es requerido"
        if (!form.telefono.trim()) newErrors.telefono = "El teléfono es requerido"
        if (!form.nombreUsuario.trim()) newErrors.nombreUsuario = "El nombre de usuario es requerido"

        if (form.contrasena && form.confirmarContrasena && form.contrasena !== form.confirmarContrasena) {
            newErrors.confirmarContrasena = "Las contraseñas no coinciden"
        }

        if (form.correo && form.confirmarCorreo && form.correo !== form.confirmarCorreo) {
            newErrors.confirmarCorreo = "Los correos no coinciden"
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (form.correo && !emailRegex.test(form.correo)) {
            newErrors.correo = "Formato de correo inválido"
        }

        if (form.contrasena && form.contrasena.length < 6) {
            newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const payload = {
            codigo: form.codigo,
            id_gremio: 1,
            usuario: {
                u_nombre_usuario: form.nombreUsuario,
                u_contrasenia: form.contrasena,
                u_email: form.correo,
                u_rol: "productor-afiliado",
                persona: {
                    p_cedula: form.cedula,
                    p_apellido: form.apellidos,
                    p_nombre: form.nombre,
                    p_fecha_nacimiento: form.fechaNacimiento,
                    p_direccion: form.direccion,
                    p_telefono: form.telefono
                }
            }
        }

        try {
            await createProducer(payload)
            alert("Productor creado exitosamente")
            setForm({
                cedula: "",
                nombre: "",
                apellidos: "",
                direccion: "",
                fechaNacimiento: "",
                contrasena: "",
                confirmarContrasena: "",
                correo: "",
                confirmarCorreo: "",
                codigo: "",
                telefono: "",
                nombreUsuario: ""
            })
        } catch (error) {
            console.error("Error:", error)
            alert(`Error al crear productor: ${error instanceof Error ? error.message : "Error desconocido"}`)
        }
    }

    return (
        <DashboardLayout title="Mi gremio">
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
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

                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Crear productor
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="codigo" className="text-sm font-medium text-gray-700">
                                            Código
                                        </Label>
                                        <Input
                                            id="codigo"
                                            type="text"
                                            placeholder="PROD123"
                                            value={form.codigo}
                                            onChange={(e) => handleInputChange("codigo", e.target.value)}
                                            className={errors.codigo ? "border-red-500" : ""}
                                        />
                                        {errors.codigo && (
                                            <p className="text-xs text-red-500">{errors.codigo}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nombreUsuario" className="text-sm font-medium text-gray-700">
                                            Nombre de Usuario
                                        </Label>
                                        <Input
                                            id="nombreUsuario"
                                            type="text"
                                            placeholder="juanperez"
                                            value={form.nombreUsuario}
                                            onChange={(e) => handleInputChange("nombreUsuario", e.target.value)}
                                            className={errors.nombreUsuario ? "border-red-500" : ""}
                                        />
                                        {errors.nombreUsuario && (
                                            <p className="text-xs text-red-500">{errors.nombreUsuario}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cedula" className="text-sm font-medium text-gray-700">
                                            Cédula
                                        </Label>
                                        <Input
                                            id="cedula"
                                            type="text"
                                            placeholder="1234567890"
                                            value={form.cedula}
                                            onChange={(e) => handleInputChange("cedula", e.target.value)}
                                            className={errors.cedula ? "border-red-500" : ""}
                                        />
                                        {errors.cedula && (
                                            <p className="text-xs text-red-500">{errors.cedula}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                            Nombre
                                        </Label>
                                        <Input
                                            id="nombre"
                                            type="text"
                                            placeholder="Juan"
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
                                            placeholder="Pérez"
                                            value={form.apellidos}
                                            onChange={(e) => handleInputChange("apellidos", e.target.value)}
                                            className={errors.apellidos ? "border-red-500" : ""}
                                        />
                                        {errors.apellidos && (
                                            <p className="text-xs text-red-500">{errors.apellidos}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion" className="text-sm font-medium text-gray-700">
                                            Dirección
                                        </Label>
                                        <Input
                                            id="direccion"
                                            type="text"
                                            placeholder="Av. Siempre Viva 742"
                                            value={form.direccion}
                                            onChange={(e) => handleInputChange("direccion", e.target.value)}
                                            className={errors.direccion ? "border-red-500" : ""}
                                        />
                                        {errors.direccion && (
                                            <p className="text-xs text-red-500">{errors.direccion}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                                            Teléfono
                                        </Label>
                                        <Input
                                            id="telefono"
                                            type="text"
                                            placeholder="123456789"
                                            value={form.telefono}
                                            onChange={(e) => handleInputChange("telefono", e.target.value)}
                                            className={errors.telefono ? "border-red-500" : ""}
                                        />
                                        {errors.telefono && (
                                            <p className="text-xs text-red-500">{errors.telefono}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fechaNacimiento" className="text-sm font-medium text-gray-700">
                                            Fecha de nacimiento
                                        </Label>
                                        <Input
                                            id="fechaNacimiento"
                                            type="date"
                                            value={form.fechaNacimiento}
                                            onChange={(e) => handleInputChange("fechaNacimiento", e.target.value)}
                                            className={errors.fechaNacimiento ? "border-red-500" : ""}
                                        />
                                        {errors.fechaNacimiento && (
                                            <p className="text-xs text-red-500">{errors.fechaNacimiento}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contrasena" className="text-sm font-medium text-gray-700">
                                            Contraseña
                                        </Label>
                                        <Input
                                            id="contrasena"
                                            type="password"
                                            placeholder="******"
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
                                            placeholder="juan.perez@example.com"
                                            value={form.correo}
                                            onChange={(e) => handleInputChange("correo", e.target.value)}
                                            className={errors.correo ? "border-red-500" : ""}
                                        />
                                        {errors.correo && (
                                            <p className="text-xs text-red-500">{errors.correo}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmarContrasena" className="text-sm font-medium text-gray-700">
                                            Confirmar contraseña
                                        </Label>
                                        <Input
                                            id="confirmarContrasena"
                                            type="password"
                                            placeholder="******"
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
                                            placeholder="juan.perez@example.com"
                                            value={form.confirmarCorreo}
                                            onChange={(e) => handleInputChange("confirmarCorreo", e.target.value)}
                                            className={errors.confirmarCorreo ? "border-red-500" : ""}
                                        />
                                        {errors.confirmarCorreo && (
                                            <p className="text-xs text-red-500">{errors.confirmarCorreo}</p>
                                        )}
                                    </div>
                                </div>

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
