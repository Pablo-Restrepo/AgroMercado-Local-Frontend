import * as comprasApi from "@/services/api/comprasApi"
import type { Cart, CartItem } from "@/types/cart"

export interface CheckoutResult {
  success: boolean
  compras: CompraCreada[]
  errors: string[]
}

export interface CompraCreada {
  gremio: string
  compraId: string
  productos: CartItem[]
  total: number
  status: 'created' | 'confirmed' | 'paid' | 'error'
  error?: string
}

/**
 * Agrupa los productos del carrito por gremio/location
 * Asume que CartItem.location contiene info del gremio
 */
function groupProductsByGremio(cartItems: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>()
  
  for (const item of cartItems) {
    const gremio = item.location || "Sin Gremio"
    if (!groups.has(gremio)) {
      groups.set(gremio, [])
    }
    groups.get(gremio)!.push(item)
  }
  
  return groups
}

/**
 * Convierte el ID string del producto a número
 * Asume formato como "general-tomate-1" o "gremio-lechuga-2"
 */
function extractProductId(productStringId: string): number {
  // Intenta extraer número del final del ID
  const match = productStringId.match(/-(\d+)$/)
  if (match) {
    return parseInt(match[1], 10)
  }
  
  // Fallback: hash del nombre como ID temporal
  let hash = 0
  for (let i = 0; i < productStringId.length; i++) {
    const char = productStringId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convertir a 32bit integer
  }
  return Math.abs(hash) % 10000 // Limitar a 4 dígitos
}

/**
 * Procesa el checkout completo: crea compras por gremio, las confirma y procesa pagos
 */
export async function processCheckout(
  cart: Cart, 
  userId: number, 
  destino: string // Cambiar de paymentMethod a destino
): Promise<CheckoutResult> {
  const result: CheckoutResult = {
    success: false,
    compras: [],
    errors: []
  }

  try {
    // 1. Agrupar productos por gremio
    const productGroups = groupProductsByGremio(cart.items)
    
    // 2. Crear una compra por cada gremio
    for (const [gremio, productos] of productGroups) {
      const compraData: CompraCreada = {
        gremio,
        compraId: '',
        productos,
        total: productos.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        status: 'created'
      }

      try {
        // Crear compra usando el ID numérico real
        const createRequest = {
          id_usuario: userId,
          productos: productos.map(p => ({
            id_producto: p.productId,
            cantidad: p.quantity
          }))
        }
        
        const compraId = await comprasApi.createCompra(createRequest)
        compraData.compraId = compraId
        compraData.status = 'created'
        
        // Confirmar compra
        await comprasApi.confirmarCompra(parseInt(compraId))
        compraData.status = 'confirmed'
        
        // Procesar pago con destino
        await comprasApi.pagarCompra(parseInt(compraId), destino)
        compraData.status = 'paid'
        
      } catch (error) {
        compraData.status = 'error'
        compraData.error = error instanceof Error ? error.message : 'Error desconocido'
        result.errors.push(`Error en compra de ${gremio}: ${compraData.error}`)
      }
      
      result.compras.push(compraData)
    }

    // 3. Determinar éxito general
    const successfulCompras = result.compras.filter(c => c.status === 'paid')
    result.success = successfulCompras.length === result.compras.length && result.compras.length > 0

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Error durante el checkout')
  }

  return result
}

/**
 * Obtiene el historial de compras del usuario
 */
export async function getUserPurchaseHistory(userId: number) {
  try {
    return await comprasApi.getComprasByUsuario(userId)
  } catch (error) {
    console.error("Error fetching purchase history:", error)
    throw error
  }
}