/* eslint-disable @typescript-eslint/no-explicit-any */
import { authFetch } from "@/services/api/authFetch"
import { API_BASE_URL } from "@/services/api/config"

export interface ProductorProduct {
  p_id?: number
  p_nombre: string
  cat_id?: number          // Cambio: usar cat_id en lugar de p_tipo
  p_tipo?: string          // Mantener para compatibilidad hacia atrás
  p_unidad: string
  gre_nombre?: string
  p_precio: number
  p_stock?: number
  p_medicinal?: boolean
  img?: string
}

export interface ProductSummary {
  p_id?: number
  p_nombre: string
  cat_id?: number          // Cambio: usar cat_id
  p_tipo?: string          // Mantener para compatibilidad
  p_unidad: string
  gre_nombre?: string
  p_precio: number
  p_stock: number
  p_medicinal?: boolean
  img?: string
}

/**
 * Request type para crear un producto.
 * Incluye los campos que normalmente se envían al crear un producto;
 * p_id queda excluido porque lo genera el servidor.
 */
export interface CreateProductRequest {
  p_nombre: string
  cat_id: number           // Cambio: usar cat_id
  p_unidad: string
  gre_nombre: string
  p_precio: number
  p_stock?: number
  p_medicinal?: boolean
  img?: string
}

export interface GremioProduct {
  p_id?: number
  p_nombre: string
  cat_id?: number          // Cambio: usar cat_id
  p_tipo?: string          // Mantener para compatibilidad
  p_unidad: string
  gre_nombre?: string
  p_precio: number
  p_stock: number
  p_medicinal?: boolean
  img?: string
}

export interface UpdateProductRequest {
  p_nombre: string
  cat_id: number
  p_unidad: string
  img?: string
  p_precio: number
  p_stock: number
  p_medicinal: boolean
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
}

/**
 * Edita un producto existente
 * PUT /api/productos/{p_id}
 */
export async function updateProduct(p_id: number, productData: UpdateProductRequest): Promise<number> {
  const res = await authFetch(`${API_BASE_URL}/productos/${p_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}: No se pudo actualizar el producto`)
  }

  const body = await res.json().catch(() => null)
  
  // Retorna el ID del producto actualizado
  if (typeof body === "number") return body
  if (body && typeof body.id === "number") return body.id
  if (body && typeof body.p_id === "number") return body.p_id
  
  return p_id // fallback al ID enviado
}

/**
 * Elimina un producto
 * DELETE /api/productos/{p_id}
 */
export async function deleteProduct(p_id: number): Promise<number> {
  const res = await authFetch(`${API_BASE_URL}/productos/${p_id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}: No se pudo eliminar el producto`)
  }

  const body = await res.json().catch(() => null)
  
  // Retorna el ID del producto eliminado
  if (typeof body === "number") return body
  if (body && typeof body.id === "number") return body.id
  
  return p_id // fallback al ID enviado
}

/**
 * Obtiene un producto por ID para edición
 * GET /api/productos/{p_id}
 */
export async function getProductById(p_id: number): Promise<ProductorProduct> {
  const res = await authFetch(`${API_BASE_URL}/productos/${p_id}`, {
    method: "GET",
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}: Producto no encontrado`)
  }

  const body = await res.json()
  return body as ProductorProduct
}


// Actualizar la interfaz para que coincida con el schema del backend
interface ProductById {
  p_id?: number
  p_nombre: string
  cat_id?: number          // Usar cat_id del schema
  p_tipo?: string          // Mantener para compatibilidad
  p_unidad: string
  gre_nombre?: string
  p_precio: number
  p_stock?: number
  p_medicinal?: boolean
  img?: string
}

/**
 * Obtiene múltiples productos por sus IDs de forma optimizada
 */
export async function getProductsByIds(productIds: number[]): Promise<ProductById[]> {
  if (productIds.length === 0) return []
  
  // Hacer llamadas individuales ya que no existe endpoint batch
  const promises = productIds.map(async (id) => {
    try {
      return await getProductById(id)
    } catch (error) {
      console.warn(`Error obteniendo producto ${id}:`, error)
      // Retornar un producto placeholder en caso de error
      return {
        p_id: id,
        p_nombre: `Producto #${id} (No disponible)`,
        p_tipo: "unknown",
        p_unidad: "unidad",
        gre_nombre: "Desconocido",
        p_precio: 0,
        img: ""
      } as ProductorProduct
    }
  })
  
  const results = await Promise.all(promises)
  return results
}