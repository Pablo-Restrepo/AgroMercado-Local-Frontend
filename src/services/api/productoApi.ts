/* eslint-disable @typescript-eslint/no-explicit-any */
import { authFetch } from "@/services/api/authFetch"
import { API_BASE_URL } from "@/services/api/config"

export interface ProductorProduct {
  p_nombre: string
  p_tipo: string
  p_unidad: string
  gre_nombre: string
  p_precio: number
  img: string
}

// Resumen de producto que incluye stock según la documentación del endpoint /productos/
export interface ProductSummary extends ProductorProduct {
  p_stock: number
}

// Nuevo tipo solicitado por el backend para crear producto
export interface CreateProductRequest {
  p_nombre: string
  p_tipo: string
  p_unidad: string
  prod_id: number
  img?: string
  p_precio: number
  p_stock?: number
}

/**
 * Lista productos por productor.
 * El endpoint espera el prod_id como entero en la ruta.
 */
export async function getProductsByProductor(prod_id: number | string): Promise<ProductorProduct[]> {
  const id = Number(prod_id)
  if (!Number.isInteger(id)) {
    throw new Error("prod_id debe ser un entero válido")
  }

  const res = await authFetch(`${API_BASE_URL}/productos/productor/${id}`, {
    method: "GET",
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}`)
  }

  const body = await res.json().catch(() => null)

  // Aceptar tanto respuestas directas en array como { data: [...] }
  if (Array.isArray(body)) return body as ProductorProduct[]
  if (body && Array.isArray((body as any).data)) return (body as any).data as ProductorProduct[]

  throw new Error("Formato de respuesta inesperado")
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(productData: CreateProductRequest): Promise<number> {
  const res = await authFetch(`${API_BASE_URL}/productos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}: No se pudo crear el producto`)
  }

  const body = await res.json().catch(() => null)

  // El backend puede devolver:
  // - un número (id)
  // - { id: number } 
  // - { data: { id: number } } o { data: number }
  // - el recurso creado { ...producto, id: number }
  const maybeId =
    (body && (typeof body === "number" ? body : undefined)) ??
    (body && (typeof body.id === "number" ? body.id : undefined)) ??
    (body && body.data && typeof body.data === "number" ? body.data : undefined) ??
    (body && body.data && typeof body.data.id === "number" ? body.data.id : undefined)

  if (typeof maybeId === "number") return maybeId

  // Si el cuerpo es el recurso creado sin id explícito, intentar extraer id por convenciones
  if (body && typeof body === "object") {
    for (const key of ["p_id", "prod_id", "id"]) {
      if (typeof (body as any)[key] === "number") return (body as any)[key]
    }
  }

  throw new Error("Respuesta inesperada del servidor al crear producto")
}

/**
 * Lista todos los productos
 * GET /api/productos/
 */
export async function getAllProducts(): Promise<ProductSummary[]> {
  const res = await authFetch(`${API_BASE_URL}/productos/`, {
    method: "GET",
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}`)
  }

  const body = await res.json().catch(() => null)

  if (Array.isArray(body)) return body as ProductSummary[]
  if (body && Array.isArray((body as any).data)) return (body as any).data as ProductSummary[]
  if (body && typeof body.id === 'number') return [body]

  throw new Error("Formato de respuesta inesperado")
}

/**
 * Listar productos segun gremio
 * /api/productos/gremio/{prod_cod_gremio}
 * [
  {
    "p_nombre": "string",
    "p_tipo": "string",
    "p_unidad": "string",
    "gre_nombre": "string",
    "p_precio": 0,
    "p_stock": 0,
    "img": "string"
  }
]
 */
export interface GremioProduct {
  p_nombre: string
  p_tipo: string
  p_unidad: string
  gre_nombre: string
  p_precio: number
  p_stock: number
  img: string
}
export async function listarProductosPorGremio(prod_cod_gremio: string): Promise<GremioProduct[]> {
  const res = await authFetch(`${API_BASE_URL}/productos/gremio/${prod_cod_gremio}`, {
    method: "GET",
  })
  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || "Error al listar los productos por gremio")
  }

  const body = await res.json().catch(() => null)
  if (Array.isArray(body)) return body as GremioProduct[]
  if (body && Array.isArray((body as any).data)) return (body as any).data as GremioProduct[]
  throw new Error("Formato de respuesta inesperado")
};