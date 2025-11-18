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

export interface CreateProductRequest {
  p_nombre: string
  p_tipo: string
  p_unidad: string
  prod_id: number
  img: string
  p_precio: number
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
  
  // El API retorna el ID del producto creado como número
  if (typeof body === 'number') return body
  if (body && typeof body.data === 'number') return body.data
  if (body && typeof body.id === 'number') return body.id

  throw new Error("Formato de respuesta inesperado")
}