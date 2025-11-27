import type { LoginRequest, LoginResponse } from '@/types/auth';

const API_BASE_URL = 'http://localhost:8090';

export const authApi = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await fetch(`${API_BASE_URL}/api/usuarios/login`, {
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
};
