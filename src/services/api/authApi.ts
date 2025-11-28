/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginRequest, LoginResponse } from '@/types/auth';
import { API_BASE_URL } from '@/services/api/config';

export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Error en el servidor' }));
            throw new Error(error.detail || 'Error al iniciar sesión');
        }

        return response.json();
    },

    async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
        const response = await fetch(`${API_BASE_URL}/usuarios/refresh`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Error al refrescar el token');
        }

        return response.json();
    },

    async register(payload: {
        u_nombre_usuario: string
        u_contrasenia: string
        u_email: string
        u_rol: string
        persona: {
            p_cedula: string
            p_apellido: string
            p_nombre: string
            p_fecha_nacimiento: string
            p_direccion: string
            p_telefono: string
        }
    }): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errBody = await response.json().catch(() => ({ detail: 'Error en el servidor' }));
            // intenta obtener mensaje de error estándar o fallback
            const message = errBody.detail || errBody.message || 'Error al registrar el usuario';
            throw new Error(message);
        }

        return response.json();
    },
};
