import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign,
  Clock,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  Leaf
} from "lucide-react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useAuth } from "@/hooks/auth/useAuth"
import { obtenerEnviosPorUsuario, type Envio } from "@/services/api/enviosApi"
import { getProductsByIds, type ProductorProduct } from "@/services/api/productoApi"

const ESTADO_COLORS = {
  "PENDIENTE": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "DESPACHADO": "bg-blue-100 text-blue-800 border-blue-200", 
  "EN_RUTA": "bg-orange-100 text-orange-800 border-orange-200",
  "ENTREGADO": "bg-green-100 text-green-800 border-green-200"
}

const ESTADO_ICONS = {
  "PENDIENTE": Clock,
  "DESPACHADO": Package,
  "EN_RUTA": Truck,
  "ENTREGADO": CheckCircle
}

const ESTADO_LABELS = {
  "PENDIENTE": "Pendiente",
  "DESPACHADO": "Despachado", 
  "EN_RUTA": "En Ruta",
  "ENTREGADO": "Entregado"
}

// Tipo para productos enriquecidos con nombres
interface ProductoConNombre {
  id_producto: number
  nombre: string
  cantidad: number
  unidad: string
  precio_unitario: number
  categoria?: string
  gremio?: string
  imagen?: string
  es_medicinal?: boolean
}

// Tipo para envíos enriquecidos
interface EnvioEnriquecido extends Omit<Envio, 'compra'> {
  compra: Omit<Envio['compra'], 'productos'> & {
    productos: ProductoConNombre[]
  }
}

export default function MisPedidosPage() {
  const { user } = useAuth()
  const [envios, setEnvios] = useState<EnvioEnriquecido[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarMisPedidos = async () => {
      if (!user?.u_id) {
        setError("Usuario no identificado")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        // Obtener envíos
        console.log("Obteniendo envíos para usuario:", user.u_id)
        const enviosData = await obtenerEnviosPorUsuario(user.u_id)
        console.log("Envíos obtenidos:", enviosData.length)
        
        if (enviosData.length === 0) {
          setEnvios([])
          return
        }
        
        // Extraer todos los IDs de productos únicos
        const productIds = Array.from(
          new Set(
            enviosData.flatMap(envio => 
              envio.compra.productos.map(p => p.id_producto)
            )
          )
        )
        
        console.log("IDs de productos a obtener:", productIds)
        
        // Obtener información de productos
        const productosInfo = await getProductsByIds(productIds)
        console.log("Información de productos obtenida:", productosInfo.length)
        
        // Crear un mapa para búsqueda rápida
        const productosMap = new Map(
          productosInfo.map(p => [p.p_id!, p])
        )
        
        // Enriquecer envíos con nombres de productos
        const enviosEnriquecidos: EnvioEnriquecido[] = enviosData.map(envio => ({
          ...envio,
          compra: {
            ...envio.compra,
            productos: envio.compra.productos.map(producto => {
              const productoInfo = productosMap.get(producto.id_producto)
              return {
                id_producto: producto.id_producto,
                nombre: productoInfo?.p_nombre || `Producto #${producto.id_producto}`,
                cantidad: producto.cantidad,
                unidad: producto.unidad,
                precio_unitario: producto.precio_unitario,
                categoria: productoInfo?.p_tipo,
                gremio: productoInfo?.gre_nombre,
                imagen: productoInfo?.img,
                es_medicinal: productoInfo?.p_medicinal
              }
            })
          }
        }))
        
        setEnvios(enviosEnriquecidos)
      } catch (err) {
        console.error("Error al cargar mis pedidos:", err)
        setError(err instanceof Error ? err.message : "Error al cargar los pedidos")
      } finally {
        setIsLoading(false)
      }
    }

    cargarMisPedidos()
  }, [user?.u_id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getEstadoInfo = (estado: Envio["estado"]) => {
    const Icon = ESTADO_ICONS[estado]
    return {
      color: ESTADO_COLORS[estado],
      label: ESTADO_LABELS[estado],
      icon: Icon
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Mis Pedidos" hideFilters>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-gray-600">Cargando tus pedidos...</p>
            <p className="text-sm text-gray-500">Obteniendo información de productos...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Mis Pedidos" hideFilters>
      <div className="space-y-6 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(ESTADO_LABELS).map(([estado, label]) => {
            const count = envios.filter(envio => envio.estado === estado).length
            const estadoInfo = getEstadoInfo(estado as Envio["estado"])
            const Icon = estadoInfo.icon
            
            return (
              <Card key={estado} className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${estadoInfo.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600">{label}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Lista de pedidos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Historial de Pedidos ({envios.length})
            </h2>
          </div>

          {envios.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes pedidos aún
              </h3>
              <p className="text-gray-600 mb-4">
                Cuando realices tu primera compra, aparecerá aquí.
              </p>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/dashboard/compras">Explorar Productos</a>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {envios.map((envio) => {
                const estadoInfo = getEstadoInfo(envio.estado)
                const Icon = estadoInfo.icon

                return (
                  <Card key={envio.id} className="overflow-hidden">
                    <div className="p-6">
                      {/* Header del envío */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Pedido #{envio.id}
                            </h3>
                            <Badge className={`${estadoInfo.color} flex items-center gap-1`}>
                              <Icon className="h-3 w-3" />
                              {estadoInfo.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(envio.compra.fecha)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {envio.destino}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(envio.compra.total)}
                          </div>
                          {envio.fecha_envio && (
                            <p className="text-xs text-gray-500">
                              Enviado: {formatDate(envio.fecha_envio)}
                            </p>
                          )}
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Productos del pedido - MEJORADO CON NOMBRES REALES */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                          Productos ({envio.compra.productos.length})
                        </h4>
                        <div className="grid gap-3">
                          {envio.compra.productos.map((producto, index) => (
                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              {/* Imagen del producto */}
                              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-200">
                                {producto.imagen && producto.imagen.startsWith('http') ? (
                                  <img
                                    src={producto.imagen}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      console.log('Error loading image:', producto.imagen);
                                      e.currentTarget.src = "/placeholder-product.png"
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                  <h5 className="font-medium text-gray-900 truncate">
                                    {producto.nombre}
                                  </h5>
                                  {producto.es_medicinal && (
                                    <Badge variant="outline" className="text-green-600 border-green-200">
                                      <Leaf className="h-3 w-3 mr-1" />
                                      Medicinal
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="flex flex-col gap-1 text-sm text-gray-600">
                                  {producto.categoria && (
                                    <p className="capitalize">
                                      Categoría: {producto.categoria}
                                    </p>
                                  )}
                                  {producto.gremio && (
                                    <p>Gremio: {producto.gremio}</p>
                                  )}
                                  <p className="font-medium">
                                    {producto.cantidad} {producto.unidad} × {formatCurrency(producto.precio_unitario)}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-semibold text-gray-900 text-lg">
                                  {formatCurrency(producto.cantidad * producto.precio_unitario)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  ID: {producto.id_producto}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Estado del envío:</span>
                            <p className="font-medium text-gray-900">{estadoInfo.label}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">ID del Gremio:</span>
                            <p className="font-medium text-gray-900">{envio.id_gremio}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Costo del envío:</span>
                            <p className="font-medium text-gray-900">{formatCurrency(envio.valor)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}