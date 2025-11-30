import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Trash2, UserMinus, AlertCircle } from "lucide-react"
import { obtenerGremio, removerProductorDeGremio, eliminarProductor, type Gremio, type Productor } from "@/services/api/gremioApi"
import { getProductorByUserId } from "@/services/api/productoresApi"
import { authStorage } from "@/services/storage/authStorage"
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
import { useNavigate } from "react-router-dom"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProducerManagement() {
    const navigate = useNavigate()
    const [gremio, setGremio] = useState<Gremio | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; productor: Productor | null }>({
        open: false,
        productor: null
    })
    const [removeDialog, setRemoveDialog] = useState<{ open: boolean; productor: Productor | null }>({
        open: false,
        productor: null
    })
    const [idGremio, setIdGremio] = useState<number | null>(null)

    useEffect(() => {
        obtenerIdGremio()
    }, [])

    const obtenerIdGremio = async () => {
        try {
            setLoading(true)
            setError(null)

            const token = authStorage.getAccessToken()
            if (!token) {
                setError("No se encontró token de autenticación")
                return
            }

            const payload = JSON.parse(atob(token.split('.')[1]))
            const userId = parseInt(payload.sub)

            if (!userId) {
                setError("No se pudo obtener el ID del usuario")
                return
            }

            const productor = await getProductorByUserId(userId)

            if (!productor?.id_gremio) {
                setError("No se encontró el gremio asociado al productor")
                return
            }

            setIdGremio(productor.id_gremio)
            await cargarGremio(productor.id_gremio)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al obtener información del gremio")
            console.error("Error al obtener el gremio del productor:", err)
        } finally {
            setLoading(false)
        }
    }

    const cargarGremio = async (gremioId?: number) => {
        try {
            setLoading(true)
            setError(null)
            const id = gremioId || idGremio
            if (!id) {
                setError("No se encontró el ID del gremio")
                return
            }
            const data = await obtenerGremio(id)
            setGremio(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar el gremio")
            console.error("Error al cargar gremio:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoverProductor = async () => {
        if (!removeDialog.productor || !idGremio) return

        try {
            await removerProductorDeGremio(removeDialog.productor.id, idGremio)
            await cargarGremio()
            setRemoveDialog({ open: false, productor: null })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al remover productor del gremio")
            console.error("Error al remover productor:", err)
        }
    }

    const handleEliminarProductor = async () => {
        if (!deleteDialog.productor) return

        try {
            await eliminarProductor(deleteDialog.productor.id)
            await cargarGremio()
            setDeleteDialog({ open: false, productor: null })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al eliminar productor")
            console.error("Error al eliminar productor:", err)
        }
    }

    if (loading) {
        return (
            <DashboardLayout title="Mi gremio" hideFilters>
                <div className="flex-1 bg-background p-6 flex items-center justify-center">
                    <p className="text-muted-foreground">Cargando información del gremio...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Mi gremio" hideFilters>
            <div className="flex-1 bg-background p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Card de información del gremio */}
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
                                    {gremio?.ubicacion && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            📍 {gremio.ubicacion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de productores asociados */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold">
                                Productores asociados
                            </CardTitle>
                            <Button
                                onClick={() => navigate("/dashboard/crear-productor")}
                                className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                                <UserPlus className="h-4 w-4" />
                                Crear Productor
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {!gremio?.productores || gremio.productores.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No hay productores asociados a este gremio</p>
                                    <p className="text-sm mt-1">Comienza creando un nuevo productor</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {gremio.productores.map((productor) => (
                                        <div
                                            key={productor.id}
                                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4 min-w-0 flex-1">
                                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={`https://ui.shadcn.com/avatars/0${(productor.id % 5) + 1}.png`}
                                                        alt={`${productor.nombres} ${productor.apellidos}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold truncate">
                                                        {productor.nombres} {productor.apellidos}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                                                        {productor.codigo && (
                                                            <span className="text-xs">Código: {productor.codigo}</span>
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
                                            <div className="flex gap-2 sm:flex-shrink-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setRemoveDialog({ open: true, productor })}
                                                    className="flex-1 sm:flex-none gap-2 border-orange-300 text-orange-600 hover:bg-orange-50"
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                    <span className="sm:inline">Remover</span>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog({ open: true, productor })}
                                                    className="flex-1 sm:flex-none gap-2 border-red-300 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sm:inline">Eliminar</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
