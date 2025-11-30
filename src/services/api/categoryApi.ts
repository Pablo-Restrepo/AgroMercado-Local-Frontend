import { authFetch } from "@/services/api/authFetch"
import { API_BASE_URL } from "@/services/api/config"

export interface Category {
  cat_id: number
  cat_nombre: string
}

/**
 * Obtiene todas las categorías disponibles
 * GET /api/productos/categorias/
 */
export async function listarCategorias(): Promise<Category[]> {
  const res = await authFetch(`${API_BASE_URL}/productos/categorias/`, {
    method: "GET",
  })

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }))
    throw new Error(payload.message || `Error ${res.status}: No se pudieron obtener las categorías`)
  }

  const body = await res.json()
  
  if (Array.isArray(body)) {
    return body as Category[]
  }
  
  if (body && Array.isArray(body.data)) {
    return body.data as Category[]
  }
  
  throw new Error("Formato de respuesta inesperado")
}

/**
 * Obtiene una categoría por ID
 */
export async function obtenerCategoriaPorId(catId: number): Promise<Category> {
  const categorias = await listarCategorias()
  const categoria = categorias.find(cat => cat.cat_id === catId)
  
  if (!categoria) {
    throw new Error(`Categoría con ID ${catId} no encontrada`)
  }
  
  return categoria
}

/**
 * Busca categorías por nombre (útil para filtros)
 */
export async function buscarCategoriasPorNombre(nombre: string): Promise<Category[]> {
  const categorias = await listarCategorias()
  const nombreLower = nombre.toLowerCase()
  
  return categorias.filter(cat => 
    cat.cat_nombre.toLowerCase().includes(nombreLower)
  )
}

// Helper para mapear nombres de categorías comunes a IDs
export function mapearNombreACategoria(nombre: string, categorias: Category[]): Category | null {
  const nombreLower = nombre.toLowerCase()
  
  // Primero buscar coincidencia exacta
  let categoria = categorias.find(cat => 
    cat.cat_nombre.toLowerCase() === nombreLower
  )
  
  if (categoria) return categoria
  
  // Luego buscar coincidencias parciales comunes
  const mapeoComun: Record<string, string[]> = {
    "frutas": ["fruta", "frutas", "fruit"],
    "verduras": ["verdura", "verduras", "vegetales", "vegetal", "vegetables"],
    "tubérculos": ["tubérculo", "tubérculos", "tuber", "tuberculo", "tuberculos"],
    "hierbas": ["hierba", "hierbas", "aromática", "aromaticas", "herbs"],
    "medicinales": ["medicinal", "medicinales", "medicina", "medicinas"]
  }
  
  for (const [categoriaKey, alias] of Object.entries(mapeoComun)) {
    if (alias.some(a => a === nombreLower)) {
      categoria = categorias.find(cat => 
        cat.cat_nombre.toLowerCase().includes(categoriaKey)
      )
      if (categoria) return categoria
    }
  }
  
  return null
}