import { authFetch } from "@/services/api/authFetch";
import { API_BASE_URL } from "@/services/api/config";

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
    const res = await authFetch(`${API_BASE_URL}/gremios/${userId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const payload = await res.json().catch(() => ({ detail: "Error en el servidor" }));

        // Manejar errores de validación de Pydantic
        if (Array.isArray(payload.detail)) {
            const errors = payload.detail.map((err: any) => {
                const field = err.loc && err.loc.length > 0 ? err.loc[err.loc.length - 1] : 'desconocido';
                return `${field}: ${err.msg}`;
            }).join('\n');
            throw new Error(errors);
        }

        throw new Error(typeof payload.detail === 'string' ? payload.detail : payload.message || "Error al crear el gremio");
    }

    const body = await res.json();
    return body;
}

/** Gremio body
 * [
  {
    "id": 0,
    "nombre": "string",
    "descripcion": "string",
    "ubicacion": "string",
    "productores": []
  }
]
 */
export interface GremioListBody {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
}


/**
 * Listar gremios
 */
export async function listarGremios(): Promise<GremioListBody[]> {
    const res = await authFetch(`${API_BASE_URL}/gremios/`, {
        method: "GET",
    });
    if (!res.ok) {
        const payload = await res.json().catch(() => ({ message: "Error en el servidor" }));
        throw new Error(payload.detail || payload.message || "Error al listar los gremios");
    }
    const body = await res.json();
    return body;
}
