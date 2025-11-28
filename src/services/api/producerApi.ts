import { authFetch } from "@/services/api/authFetch";

const API_BASE_URL = "http://localhost:8090";

export interface CreateProducerPayload {
    codigo: string;
    id_gremio: number;
    usuario: {
        u_nombre_usuario: string;
        u_contrasenia: string;
        u_email: string;
        u_rol: string;
        persona: {
            p_cedula: string;
            p_apellido: string;
            p_nombre: string;
            p_fecha_nacimiento: string;
            p_direccion: string;
            p_telefono: string;
        };
    };
}

export async function createProducer(payload: CreateProducerPayload) {
    const response = await authFetch(`${API_BASE_URL}/productores/`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(JSON.stringify(errorData));
    }

    return response.json();
}
