import { authFetch } from "@/services/api/authFetch";
import { API_BASE_URL } from "@/services/api/config";

export interface ProductorResponse {
    id: number;
    codigo: string | null;
    nombres: string;
    apellidos: string;
    id_gremio: number | null;
    rol: string | null;
    es_activo: boolean;
    u_id: number;
}

/**
 * Obtiene el productor por user_id
 */
export async function getProductorByUserId(userId: number): Promise<ProductorResponse> {
    console.log('getProductorByUserId llamado con userId:', userId);
    const url = `${API_BASE_URL}/productores/user/${userId}`;
    console.log('URL completa:', url);

    const res = await authFetch(url, {
        method: "GET",
    });

    console.log('Respuesta del servidor:', res.status, res.statusText);

    if (!res.ok) {
        const payload = await res.json().catch(() => ({ detail: "Error en el servidor" }));
        console.error('Error en la respuesta:', payload);
        throw new Error(payload.detail || "Error al obtener el productor");
    }

    const data = await res.json();
    console.log('Datos del productor recibidos:', data);
    return data;
}
