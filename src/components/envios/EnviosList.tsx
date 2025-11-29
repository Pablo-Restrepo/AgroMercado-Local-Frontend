import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/auth/useAuth"
import * as enviosApi from "@/services/api/enviosApi"
import type { Envio } from "@/services/api/enviosApi"

interface EnviosListProps {
  usuarioId?: number // si no se pasa, se usa el usuario autenticado
}

export function EnviosList({ usuarioId }: EnviosListProps) {
  const { user } = useAuth()
  const [envios, setEnvios] = useState<Envio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEnvios = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      console.log("Fetching envíos for user:", id) // Debug log
      const items = await enviosApi.getEnviosByUsuario(id)
      console.log("Envíos received:", items) // Debug log
      setEnvios(items)
    } catch (err) {
      console.error("Error fetching envíos:", err) // Debug log
      setError(err instanceof Error ? err.message : String(err))
      setEnvios([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const id = usuarioId ?? user?.u_id
    console.log("EnviosList - User ID:", id, "User object:", user) // Debug log
    if (!id) {
      setError("Usuario no autenticado")
      return
    }
    fetchEnvios(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioId, user?.u_id])

  if (loading) return (
    <div className="p-8 text-center">
      <div className="text-lg">Cargando envíos...</div>
    </div>
  )

  if (error) return (
    <div className="p-8 space-y-4">
      <div className="text-red-600 text-center">
        <h3 className="text-lg font-semibold">Error al cargar envíos</h3>
        <p>{error}</p>
      </div>
      <div className="text-center">
        <Button onClick={() => {
          const id = usuarioId ?? user?.u_id
          if (id) fetchEnvios(id)
        }}>Reintentar</Button>
      </div>
    </div>
  )

  if (envios.length === 0) return (
    <div className="p-8 text-center">
      <div className="text-gray-600">
        <h3 className="text-lg font-medium mb-2">No hay envíos</h3>
        <p>Aún no tienes envíos registrados.</p>
      </div>
    </div>
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Seguimiento de Envios</h3>
        <Button size="sm" onClick={() => {
          const id = usuarioId ?? user?.u_id
          if (id) fetchEnvios(id)
        }}>Actualizar</Button>
      </div>

      <div className="space-y-3">
        {envios.map((e, idx) => (
          <div key={e.id ?? idx} className="p-3 border rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium truncate">Compra: {String(e.compra_id ?? "—")}</p>
                  <Badge variant={e.estado && e.estado.toLowerCase().includes("entregado") ? "secondary" : "default"}>
                    {e.estado ?? "Sin estado"}
                  </Badge>
                </div>
                {e.destino && <p className="text-sm text-gray-600 truncate">Destino: {e.destino}</p>}
                {e.fecha_creacion && <p className="text-xs text-muted-foreground mt-1">Fecha: {new Date(e.fecha_creacion).toLocaleString()}</p>}
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">${(e?.total ?? 0).toLocaleString?.() ?? ""}</p>
              </div>
            </div>

            {e.seguimiento && (
              <>
                <Separator className="my-2" />
                <div className="text-xs text-gray-700 space-y-1">
                  {Array.isArray(e.seguimiento)
                    ? e.seguimiento.map((s: any, i: number) => <div key={i}>• {typeof s === "string" ? s : JSON.stringify(s)}</div>)
                    : <div>{typeof e.seguimiento === "string" ? e.seguimiento : JSON.stringify(e.seguimiento)}</div>
                  }
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default EnviosList