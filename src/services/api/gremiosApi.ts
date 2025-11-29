import { authFetch } from "@/services/api/authFetch";

const API_BASE_URL = "http://localhost:8090";

export interface CreateGremioData {
    nombre: string;
    descripcion: string;
    ubicacion: string;
}

export interface Gremio {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Crea un nuevo gremio
 * @param userId - ID del usuario que crea el gremio
 * @param data - Datos del gremio a crear
 */
export async function createGremio(userId: number, data: CreateGremioData): Promise<Gremio> {
    const res = await authFetch(`${API_BASE_URL}/api/gremios/${userId}`, {
        method: "POST",
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const payload = await res.json().catch(() => ({ detail: "Error en el servidor" }));
        throw new Error(payload.detail || payload.message || "Error al crear el gremio");
    }

    const body = await res.json();
    return body;
}
