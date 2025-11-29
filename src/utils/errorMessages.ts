export function formatErrorMessage(error: unknown): string {
  if (!error) return "Ha ocurrido un error inesperado"
  
  const errorStr = error instanceof Error ? error.message : String(error)
  
  // Remover prefijos técnicos
  const cleaned = errorStr
    .replace(/^Error:\s*/i, '')
    .replace(/^ERR:\s*/i, '')
    .replace(/^[A-Z_]+:\s*/i, '')
    .replace(/Error \d+:\s*/i, '')
  
  // Mapear errores comunes a mensajes amigables
  if (cleaned.toLowerCase().includes('network') || cleaned.toLowerCase().includes('fetch')) {
    return "No se pudo conectar con el servidor. Verifica tu conexión a internet."
  }
  
  if (cleaned.toLowerCase().includes('unauthorized') || cleaned.includes('401')) {
    return "Tu sesión ha expirado. Inicia sesión nuevamente."
  }
  
  if (cleaned.toLowerCase().includes('forbidden') || cleaned.includes('403')) {
    return "No tienes permisos para realizar esta acción."
  }
  
  if (cleaned.toLowerCase().includes('not found') || cleaned.includes('404')) {
    return "El recurso solicitado no existe."
  }
  
  if (cleaned.toLowerCase().includes('server') || cleaned.includes('500')) {
    return "Error en el servidor. Inténtalo de nuevo en unos momentos."
  }
  
  // Si el mensaje ya es amigable, devolverlo
  if (cleaned.length > 10 && !cleaned.includes('Exception') && !cleaned.includes('Stack')) {
    return cleaned
  }
  
  return "Ha ocurrido un error inesperado. Inténtalo de nuevo."
}