import { authFetch } from "@/services/api/authFetch";

// El gateway redirige las peticiones al microservicio de compras (puerto 8003)
import { API_BASE_URL } from "@/services/api/config"

export interface ProductoUnitario {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    unidad: string;
}

export interface Compra {
    id: number;
    id_usuario: number;
    productos: ProductoUnitario[];
    fecha: string;
    total: number;
    estado: string;
}

export interface Envio {
    id: number;
    id_gremio: number;
    compra: Compra;
    destino: string;
    valor: number;
    estado: "PENDIENTE" | "DESPACHADO" | "EN_RUTA" | "ENTREGADO";
    fecha_envio: string | null;
}

export interface EnviosResponse {
    envios: Envio[];
}

// Obtener envíos por gremio
export async function obtenerEnviosPorGremio(gremioId: number): Promise<Envio[]> {
    const response = await authFetch(`${API_BASE_URL}/envios/gremio/${gremioId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Error al obtener envíos" }));
        throw new Error(errorData.detail || "Error al obtener envíos");
    }

    const data = await response.json();
    // El backend devuelve { status_code: 200, content: { envios: [...] } }
    return data.content?.envios || data.envios || [];
}

// Obtener envíos por usuario
export async function obtenerEnviosPorUsuario(usuarioId: number): Promise<Envio[]> {
    const response = await authFetch(`${API_BASE_URL}/envios/usuario/${usuarioId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Error al obtener envíos" }));
        throw new Error(errorData.detail || "Error al obtener envíos");
    }

    const data = await response.json();
    // El backend devuelve { status_code: 200, content: { envios: [...] } }
    return data.content?.envios || data.envios || [];
}

// Actualizar estado de envío
export async function actualizarEstadoEnvio(
    envioId: number,
    nuevoEstado: "DESPACHADO" | "EN_RUTA" | "ENTREGADO" | "PENDIENTE"
): Promise<void> {
    // El backend espera el parámetro 'status' como query parameter
    const response = await authFetch(
        `${API_BASE_URL}/envios/${envioId}?status=${nuevoEstado}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Error al actualizar estado del envío" }));
        throw new Error(errorData.detail || "Error al actualizar estado del envío");
    }

    // El backend devuelve { status_code: 200, content: { message: "...", envio_id: ... } }
}
