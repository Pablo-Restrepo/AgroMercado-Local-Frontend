import type { Category } from "@/services/api/categoryApi"

// Categorías de fallback hardcodeadas
export const FALLBACK_CATEGORIES: Category[] = [
  { cat_id: 1, cat_nombre: "frutas" },
  { cat_id: 4, cat_nombre: "hierbas" },
  { cat_id: 5, cat_nombre: "hortalizas" },
  { cat_id: 3, cat_nombre: "tubérculos" },
  { cat_id: 2, cat_nombre: "verduras" }
]

/**
 * Mapea un cat_id o p_tipo a nombre de categoría
 */
export function mapCategoryIdToName(
  cat_id?: number,
  p_tipo?: string,
  categorias: Category[] = FALLBACK_CATEGORIES
): string {
  // Si tenemos cat_id, buscar por ID
  if (cat_id) {
    const category = categorias.find(cat => cat.cat_id === cat_id)
    if (category) return category.cat_nombre
  }

  // Si tenemos p_tipo, buscar por nombre
  if (p_tipo && p_tipo.trim()) {
    const tipo = p_tipo.toLowerCase().trim()
    
    // Buscar coincidencia exacta
    const exactMatch = categorias.find(cat => 
      cat.cat_nombre.toLowerCase() === tipo
    )
    if (exactMatch) return exactMatch.cat_nombre
    
    // Buscar coincidencia parcial
    const partialMatch = categorias.find(cat => {
      const catName = cat.cat_nombre.toLowerCase()
      return catName.includes(tipo) || tipo.includes(catName)
    })
    if (partialMatch) return partialMatch.cat_nombre
    
    // Mapeos de normalización
    const categoryMappings: Record<string, number> = {
      'fruta': 1,
      'fruit': 1,
      'verdura': 2,
      'vegetal': 2,
      'hortaliza': 5,
      'tuberculo': 3,
      'tubérculo': 3,
      'hierba': 4,
      'aromática': 4,
      'herbs': 4
    }
    
    const mappedId = categoryMappings[tipo]
    if (mappedId) {
      const mappedCategory = categorias.find(cat => cat.cat_id === mappedId)
      if (mappedCategory) return mappedCategory.cat_nombre
    }
    
    return p_tipo
  }

  return "Sin categoría"
}

/**
 * Normaliza una categoría para filtrado
 */
export function normalizeCategoryForFilter(categoryName: string): string {
  if (!categoryName || !categoryName.trim()) return "otros"
  return categoryName.toLowerCase().replace(/\s+/g, '_')
}