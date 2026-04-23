import { authFetch } from "@/services/api/authFetch"
import { API_BASE_URL } from "@/services/api/config"

export interface CompraProducto {
  cantidad: number
  id_producto: number
}

export interface CreateCompraRequest {
  id_usuario: number
  productos: CompraProducto[]
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
 * Crea una nueva compra.
 * Retorna el body (string/id) que devuelva el backend.
 */
export async function createCompra(body: CreateCompraRequest): Promise<string> {
  const res = await authFetch(`${API_BASE_URL}/compras/`, { // Agregar /api/
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  try {
    const data = await res.json()
    // Manejar la estructura específica del backend
    if (data.content && typeof data.content.compra_id === "number") {
      return String(data.content.compra_id)
    }
    if (data == null) return ""
    if (typeof data === "object") {
      if (typeof data.id === "number" || typeof data.id === "string") return String(data.id)
      if (typeof data.data === "number" || typeof data.data === "string") return String(data.data)
    }
    return String(data)
  } catch {
    return (await res.text()).trim()
  }
}

/**
 * Confirma una compra por ID.
 * Retorna el body (string) del backend.
 */
export async function confirmarCompra(compra_id: number): Promise<string> {
  const res = await authFetch(`${API_BASE_URL}/compras/${compra_id}/confirmar`, {
    method: "POST",
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  try {
    const data = await res.json()
    return typeof data === "string" ? data : JSON.stringify(data)
  } catch {
    return (await res.text()).trim()
  }
}

/**
 * Marca una compra como pagada.
 * destino se envía como query param (string).
 */
export async function pagarCompra(compra_id: number, destino: string): Promise<string> {
  const base = `${API_BASE_URL}/compras/${compra_id}/pagar`
  const queryString = destino != null ? `?destino=${encodeURIComponent(destino)}` : ""
  const finalUrl = `${base}${queryString}`

  const res = await authFetch(finalUrl, {
    method: "POST",
  })

  if (!res.ok) {
    // Manejo específico del error 400
    if (res.status === 400) {
      throw new Error("No hay stock suficiente para completar la compra")
    }
    const msg = await parseError(res)
    throw new Error(msg)
  }

  try {
    const data = await res.json()
    return typeof data === "string" ? data : JSON.stringify(data)
  } catch {
    return (await res.text()).trim()
  }
}

/**
 * Obtiene todas las compras de un usuario por ID.
 */
export async function getComprasByUsuario(usuario_id: number): Promise<any[]> {
  const res = await authFetch(`${API_BASE_URL}/compras/usuario/${usuario_id}`, {
    method: "GET",
  })

  if (!res.ok) {
    const msg = await parseError(res)
    throw new Error(msg)
  }

  const body = await res.json().catch(() => null)
  
  if (Array.isArray(body)) return body
  if (body && Array.isArray(body.data)) return body.data
  
  return []
}

export default {
  createCompra,
  confirmarCompra,
  pagarCompra,
  getComprasByUsuario,
}