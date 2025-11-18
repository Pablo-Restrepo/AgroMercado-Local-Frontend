import { authStorage } from '@/services/storage/authStorage';

export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = authStorage.getAccessToken();

    const headers: Record<string, string> = {
        'accept': 'application/json',
    };

    // Copiar headers existentes si los hay
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                headers[key] = value;
            });
        } else if (Array.isArray(options.headers)) {
            // Manejar formato de array [key, value][]
            options.headers.forEach(([key, value]) => {
                headers[key] = value;
            });
        } else {
            // Manejar objeto Record<string, string>
            Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
                headers[key] = value;
            });
        }
    }

    // Agregar token si existe
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('AuthFetch - URL:', url);
    console.log('AuthFetch - Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    console.log('AuthFetch - Headers:', headers);

    const response = await fetch(url, {
        ...options,
        headers,
    });

    console.log('AuthFetch - Response status:', response.status);

    // Si hay error 401, limpiar storage y lanzar error específico
    if (response.status === 401) {
        console.error('AuthFetch - 401 Unauthorized. Limpiando sesión...');
        authStorage.clear();
        // Lanzar error específico que el AppSidebar puede capturar
        throw new AuthError('Sesión expirada o token inválido');
    }

    return response;
}

// Error específico para problemas de autenticación
export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}