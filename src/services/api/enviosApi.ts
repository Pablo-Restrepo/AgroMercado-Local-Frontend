import { authFetch } from "@/services/api/authFetch"
import { API_BASE_URL } from "@/services/api/config"

export interface Envio {
  id?: number
  compra_id?: number
  estado?: string
  destino?: string
  fecha_creacion?: string
  seguimiento?: any
  [key: string]: any
}

/** Helper para leer mensaje de error del response JSON */
async function parseError(res: Response) {
  try {
    const payload = await res.json()
    return payload?.message || payload || `Error ${res.status}`
  } catch {
    return `Error ${res.status}`
  }
}

/**
 * Obtiene todos los envíos del usuario por ID.
 */
export async function getEnviosByUsuario(usuario_id: number): Promise<Envio[]> {
  console.log("EnviosApi - Making request to:", `${API_BASE_URL}/envios/usuario/${usuario_id}`)
  
  const res = await authFetch(`${API_BASE_URL}/envios/usuario/${usuario_id}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  })

  console.log("EnviosApi - Response status:", res.status)

  if (!res.ok) {
    const msg = await parseError(res)
    console.error("EnviosApi - Error response:", msg)
    throw new Error(msg)
  }

  const body = await res.json().catch(() => null)
  console.log("EnviosApi - Response body:", body)

  if (Array.isArray(body)) return body as Envio[]
  if (body && Array.isArray(body.data)) return body.data as Envio[]

  // Algunos endpoints devuelven string o objeto simple
  if (typeof body === "string") return [{ estado: body }]
  if (body && typeof body === "object") return [body as Envio]

  return []
}

export default {
  getEnviosByUsuario,
}