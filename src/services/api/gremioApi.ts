import { authFetch } from "@/services/api/authFetch";

const API_BASE_URL = "http://localhost:8090";

export interface Productor {
    id: number;
    codigo: string | null;
    nombres: string;
    apellidos: string;
    id_gremio: number | null;
    rol: string | null;
    es_activo: boolean;
    u_id: number;
}

export interface Gremio {
    id: number;
    nombre: string;
    descripcion: string;
    ubicacion: string;
    productores: Productor[];
}

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

// Obtener información de un gremio específico
export async function obtenerGremio(idGremio: number): Promise<Gremio> {
    const response = await authFetch(`${API_BASE_URL}/api/gremios/${idGremio}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al obtener gremio" }));
        throw new Error(errorData.detail || "Error al obtener gremio");
    }

    return response.json();
}

// Listar todos los gremios
export async function listarGremios(): Promise<Gremio[]> {
    const response = await authFetch(`${API_BASE_URL}/api/gremios/`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al listar gremios" }));
        throw new Error(errorData.detail || "Error al listar gremios");
    }

    return response.json();
}

// Crear productor
export async function crearProductor(payload: CreateProducerPayload): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/productores/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Error al crear productor" }));

        // Manejar errores de validación de Pydantic
        if (Array.isArray(errorData.detail)) {
            const errors = errorData.detail.map((err: any) => {
                const field = err.loc[err.loc.length - 1];
                return `${field}: ${err.msg}`;
            }).join(', ');
            throw new Error(errors);
        }

        throw new Error(typeof errorData.detail === 'string' ? errorData.detail : "Error al crear productor");
    }

    return response.json();
}

// Listar todos los productores
export async function listarProductores(): Promise<Productor[]> {
    const response = await authFetch(`${API_BASE_URL}/api/productores/`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al listar productores" }));
        throw new Error(errorData.detail || "Error al listar productores");
    }

    return response.json();
}

// Obtener un productor específico
export async function obtenerProductor(id: number): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/productores/${id}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al obtener productor" }));
        throw new Error(errorData.detail || "Error al obtener productor");
    }

    return response.json();
}

// Obtener productor por user_id
export async function obtenerProductorPorUserId(userId: number): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/productores/user/${userId}`, {
        method: "GET",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al obtener productor" }));
        throw new Error(errorData.detail || "Error al obtener productor");
    }

    return response.json();
}

// Eliminar un productor
export async function eliminarProductor(id: number): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/productores/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al eliminar productor" }));
        throw new Error(errorData.detail || "Error al eliminar productor");
    }

    return response.json();
}

// Agregar productor a gremio
export async function agregarProductorAGremio(idProductor: number, idGremio: number): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/gremios/${idGremio}/agregar/${idProductor}`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al agregar productor al gremio" }));
        throw new Error(errorData.detail || "Error al agregar productor al gremio");
    }

    return response.json();
}

// Remover productor de gremio
export async function removerProductorDeGremio(idProductor: number, idGremio: number): Promise<Productor> {
    const response = await authFetch(`${API_BASE_URL}/api/gremios/${idGremio}/remover/${idProductor}`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Error al remover productor del gremio" }));
        throw new Error(errorData.detail || "Error al remover productor del gremio");
    }

    return response.json();
}
