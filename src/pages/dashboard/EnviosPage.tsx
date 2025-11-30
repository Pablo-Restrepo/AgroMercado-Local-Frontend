import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Truck, CheckCircle2, AlertCircle, MapPin, Calendar } from "lucide-react"
import { obtenerEnviosPorGremio, actualizarEstadoEnvio, type Envio } from "@/services/api/enviosApi"
import { getProductsByIds, type ProductorProduct } from "@/services/api/productoApi"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

const estadoConfig = {
    PENDIENTE: {
        label: "Pendiente",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Package,
        nextStates: ["DESPACHADO"] as const,
    },
    DESPACHADO: {
        label: "Despachado",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Package,
        nextStates: ["EN_RUTA"] as const,
    },
    EN_RUTA: {
        label: "En Ruta",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Truck,
        nextStates: ["ENTREGADO"] as const,
    },
    ENTREGADO: {
        label: "Entregado",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle2,
        nextStates: [] as const,
    },
}

export default function EnviosPage() {
    const [envios, setEnvios] = useState<Envio[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [productosMap, setProductosMap] = useState<Map<number, ProductorProduct>>(new Map())
    const [updateDialog, setUpdateDialog] = useState<{
        open: boolean
        envio: Envio | null
        nuevoEstado: "DESPACHADO" | "EN_RUTA" | "ENTREGADO" | null
    }>({
        open: false,
        envio: null,
        nuevoEstado: null,
    })

    const idGremio = 1 // Por ahora hardcodeado, debería venir del contexto del usuario

    useEffect(() => {
        cargarEnvios()
    }, [])

    const cargarEnvios = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await obtenerEnviosPorGremio(idGremio)
            setEnvios(data)

            // Extraer IDs únicos de productos
            const productIds = new Set<number>()
            data.forEach(envio => {
                envio.compra.productos.forEach(prod => {
                    productIds.add(prod.id_producto)
                })
            })

            // Cargar información de productos
            if (productIds.size > 0) {
                const productos = await getProductsByIds(Array.from(productIds))
                const map = new Map<number, ProductorProduct>()
                productos.forEach(prod => {
                    if (prod.p_id) {
                        map.set(prod.p_id, prod)
                    }
                })
                setProductosMap(map)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar envíos")
            console.error("Error al cargar envíos:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleActualizarEstado = async () => {
        if (!updateDialog.envio || !updateDialog.nuevoEstado) return

        try {
            await actualizarEstadoEnvio(updateDialog.envio.id, updateDialog.nuevoEstado)
            await cargarEnvios()
            setUpdateDialog({ open: false, envio: null, nuevoEstado: null })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar estado del envío")
            console.error("Error al actualizar estado:", err)
        }
    }

    const formatearFecha = (fecha: string | null) => {
        if (!fecha) return "Sin fecha"
        return new Date(fecha).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const formatearMoneda = (valor: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(valor)
    }

    if (loading) {
        return (
            <DashboardLayout title="Envíos" hideFilters>
                <div className="flex-1 bg-background p-6 flex items-center justify-center">
                    <p className="text-muted-foreground">Cargando envíos...</p>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout title="Envíos" hideFilters>
            <div className="flex-1 bg-background p-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {!envios || envios.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-12 text-muted-foreground">
                                    <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg font-medium text-foreground">No hay envíos registrados</p>
                                    <p className="text-sm mt-1">
                                        Los envíos se generan automáticamente cuando se realiza una compra
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {envios.map((envio) => {
                                const estadoInfo = estadoConfig[envio.estado]
                                const IconoEstado = estadoInfo.icon

                                return (
                                    <Card key={envio.id} className="py-1 hover:shadow-md transition-shadow overflow-hidden">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="space-y-4">
                                                {/* Encabezado */}
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-base lg:text-lg font-semibold whitespace-nowrap">
                                                                Envío #{envio.id}
                                                            </h3>
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${estadoInfo.color}`}
                                                            >
                                                                <IconoEstado className="h-3.5 w-3.5" />
                                                                {estadoInfo.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <div className="text-lg lg:text-2xl font-bold">
                                                                {formatearMoneda(envio.compra.total)}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                                + {formatearMoneda(envio.valor)} envío
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs lg:text-sm text-gray-600">
                                                        <span className="flex items-center gap-1.5">
                                                            <Calendar className="h-4 w-4 flex-shrink-0" />
                                                            <span>Compra: {formatearFecha(envio.compra.fecha)}</span>
                                                        </span>
                                                        {envio.fecha_envio && (
                                                            <span className="flex items-center gap-1.5">
                                                                <Truck className="h-4 w-4 flex-shrink-0" />
                                                                <span>Despachado: {formatearFecha(envio.fecha_envio)}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Información de destino */}
                                                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-100 dark:border-blue-800">
                                                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                                            Destino
                                                        </p>
                                                        <p className="text-sm text-blue-700 dark:text-blue-400 break-words">{envio.destino}</p>
                                                    </div>
                                                </div>

                                                {/* Productos */}
                                                <div>
                                                    <p className="text-sm font-medium mb-2">
                                                        Productos ({envio.compra.productos.length})
                                                    </p>
                                                    <div className="space-y-2">
                                                        {envio.compra.productos.map((producto, idx) => {
                                                            const productoInfo = productosMap.get(producto.id_producto)
                                                            const imageSrc = productoInfo?.img
                                                                ? productoInfo.img.startsWith('data:')
                                                                    ? productoInfo.img
                                                                    : `data:image/png;base64,${productoInfo.img}`
                                                                : null
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between gap-3 p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                        {imageSrc ? (
                                                                            <img
                                                                                src={imageSrc}
                                                                                alt={productoInfo?.p_nombre || 'Producto'}
                                                                                className="h-12 w-12 rounded object-cover border border-gray-200 flex-shrink-0"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-12 w-12 rounded bg-muted flex items-center justify-center border flex-shrink-0">
                                                                                <Package className="h-6 w-6 text-muted-foreground" />
                                                                            </div>
                                                                        )}
                                                                        <div className="min-w-0 flex-1">
                                                                            <p className="text-sm font-medium truncate">
                                                                                {productoInfo?.p_nombre || `Producto #${producto.id_producto}`}
                                                                            </p>
                                                                            <p className="text-xs text-muted-foreground truncate">
                                                                                {producto.cantidad} {producto.unidad} × {formatearMoneda(producto.precio_unitario)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="font-semibold text-sm whitespace-nowrap">
                                                                        {formatearMoneda(
                                                                            producto.cantidad * producto.precio_unitario
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Acciones */}
                                                {estadoInfo.nextStates.length > 0 && (
                                                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                                                        <span className="text-sm text-muted-foreground">
                                                            Actualizar estado:
                                                        </span>
                                                        {estadoInfo.nextStates.map((estado) => {
                                                            const EstadoIcon = estadoConfig[estado].icon
                                                            return (
                                                                <Button
                                                                    key={estado}
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setUpdateDialog({
                                                                            open: true,
                                                                            envio,
                                                                            nuevoEstado: estado,
                                                                        })
                                                                    }}
                                                                    className="gap-2"
                                                                >
                                                                    <EstadoIcon className="h-4 w-4" />
                                                                    {estadoConfig[estado].label}
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Dialog para confirmar actualización de estado */}
            <AlertDialog
                open={updateDialog.open}
                onOpenChange={(open: boolean) =>
                    setUpdateDialog({ open, envio: null, nuevoEstado: null })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Actualizar estado del envío?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Estás a punto de cambiar el estado del envío #
                            {updateDialog.envio?.id} a{" "}
                            <strong>
                                {updateDialog.nuevoEstado &&
                                    estadoConfig[updateDialog.nuevoEstado].label}
                            </strong>
                            . Esta acción actualizará el estado del envío en el sistema.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleActualizarEstado}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    )
}
