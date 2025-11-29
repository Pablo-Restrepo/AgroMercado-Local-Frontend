import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Trash2, UserMinus, AlertCircle } from "lucide-react"
import { obtenerGremio, removerProductorDeGremio, eliminarProductor, type Gremio, type Productor } from "@/services/api/gremioApi"
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

    const idGremio = 1 // Por ahora hardcodeado, debería venir del contexto del usuario

    useEffect(() => {
        cargarGremio()
    }, [])

    const cargarGremio = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await obtenerGremio(idGremio)
            setGremio(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar el gremio")
            console.error("Error al cargar gremio:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoverProductor = async () => {
        if (!removeDialog.productor) return

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
            <DashboardLayout title="Mi gremio">
                <div className="flex-1 bg-gray-50 p-6 flex items-center justify-center">
                    <p className="text-gray-600">Cargando información del gremio...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Mi gremio">
            <div className="flex-1 bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Card de información del gremio */}
                    <Card className="border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Users className="h-8 w-8 text-gray-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {gremio?.nombre || "Cargando..."}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {gremio?.descripcion || "Información acerca del gremio que administras"}
                                    </p>
                                    {gremio?.ubicacion && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            📍 {gremio.ubicacion}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de productores asociados */}
                    <Card className="border-gray-200">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-semibold text-gray-900">
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
                                <div className="text-center py-8 text-gray-500">
                                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                    <p>No hay productores asociados a este gremio</p>
                                    <p className="text-sm mt-1">Comienza creando un nuevo productor</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {gremio.productores.map((productor) => (
                                        <div
                                            key={productor.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
                                                    <h3 className="font-semibold text-gray-900">
                                                        {productor.nombres} {productor.apellidos}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
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
