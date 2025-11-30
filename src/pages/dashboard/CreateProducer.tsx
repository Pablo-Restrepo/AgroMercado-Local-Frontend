import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Users, Trash2, UserMinus } from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { crearProductor, obtenerGremio, removerProductorDeGremio, eliminarProductor, type Gremio, type Productor } from "@/services/api/gremioApi"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
    const [gremio, setGremio] = useState<Gremio | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)
    const [actionSuccess, setActionSuccess] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productor: Productor | null }>({
        open: false,
        productor: null
    })
    const [removeDialog, setRemoveDialog] = useState<{ open: boolean; productor: Productor | null }>({
        open: false,
        productor: null
    })

    const idGremio = 1 // Por ahora hardcodeado, debería venir del contexto del usuario

    useEffect(() => {
        cargarGremio()
    }, [])

    const cargarGremio = async () => {
        try {
            const data = await obtenerGremio(idGremio)
            setGremio(data)
        } catch (err) {
            console.error("Error al cargar gremio:", err)
        }
    }

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
            id_gremio: idGremio,
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
            setLoading(true)
            setError(null)
            setSuccessMessage(null)
            await crearProductor(payload)
            setSuccessMessage("Productor creado exitosamente")
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
            await cargarGremio()
        } catch (err) {
            console.error("Error:", err)
            const errorMessage = err instanceof Error ? err.message : "Error al crear productor";
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoverProductor = async () => {
        if (!removeDialog.productor) return

        try {
            setActionError(null)
            setActionSuccess(null)
            await removerProductorDeGremio(removeDialog.productor.id, idGremio)
            await cargarGremio()
            setRemoveDialog({ open: false, productor: null })
            setActionSuccess("Productor removido del gremio exitosamente")
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Error al remover productor del gremio")
            console.error("Error al remover productor:", err)
        }
    }

    const handleEliminarProductor = async () => {
        if (!deleteDialog.productor) return

        try {
            setActionError(null)
            setActionSuccess(null)
            await eliminarProductor(deleteDialog.productor.id)
            await cargarGremio()
            setDeleteDialog({ open: false, productor: null })
            setActionSuccess("Productor eliminado exitosamente")
        } catch (err) {
            setActionError(err instanceof Error ? err.message : "Error al eliminar productor")
            console.error("Error al eliminar productor:", err)
        }
    }

    return (
        <DashboardLayout title="Mi gremio">
            <div className="flex-1 bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {actionError && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{actionError}</AlertDescription>
                        </Alert>
                    )}

                    {actionSuccess && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                            <AlertDescription className="text-green-700 dark:text-green-400">{actionSuccess}</AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {gremio?.nombre || "Cargando..."}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {gremio?.descripcion || "Información acerca del gremio que administras"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de productores asociados */}
                    {gremio && gremio.productores.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    Productores asociados
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {gremio.productores.map((productor) => (
                                        <div
                                            key={productor.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={`https://ui.shadcn.com/avatars/0${(productor.id % 5) + 1}.png`}
                                                        alt={`${productor.nombres} ${productor.apellidos}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold">
                                                        {productor.nombres} {productor.apellidos}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                                        {productor.codigo && (
                                                            <span>Código: {productor.codigo}</span>
                                                        )}
                                                        {productor.rol && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {productor.rol.replace('productor-', '').replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                            </span>
                                                        )}
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${productor.es_activo
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${productor.es_activo ? 'bg-green-600' : 'bg-gray-600'
                                                                }`} />
                                                            {productor.es_activo ? "Activo" : "Inactivo"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setRemoveDialog({ open: true, productor })}
                                                    className="gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                    Remover
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog({ open: true, productor })}
                                                    className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Crear productor
                            </CardTitle>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-6">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {successMessage && (
                                <Alert className="bg-green-50 border-green-200 mb-6">
                                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                                </Alert>
                            )}

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
                                        disabled={loading}
                                    >
                                        {loading ? "Creando..." : "Crear"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialog para confirmar remover productor del gremio */}
            <AlertDialog open={removeDialog.open} onOpenChange={(open: boolean) => setRemoveDialog({ open, productor: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Remover productor del gremio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de remover a <strong>{removeDialog.productor?.nombres} {removeDialog.productor?.apellidos}</strong> del gremio.
                            El productor seguirá existiendo pero no estará asociado a este gremio.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRemoverProductor}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog para confirmar eliminar productor */}
            <AlertDialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, productor: null })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar productor permanentemente?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de eliminar permanentemente a <strong>{deleteDialog.productor?.nombres} {deleteDialog.productor?.apellidos}</strong>.
                            Esta acción no se puede deshacer y eliminará toda la información del productor del sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleEliminarProductor}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}
