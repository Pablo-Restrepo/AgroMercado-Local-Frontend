import { authStorage } from '@/services/storage/authStorage';

export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = authStorage.getAccessToken();

    const headers: Record<string, string> = {
        'accept': 'application/json',
    };

    if (options.headers) {
        const optHeaders = new Headers(options.headers);
        optHeaders.forEach((value, key) => {
            headers[key] = value;
        });
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Solo lanzar error 401, no limpiar storage aquí
    // Dejar que cada componente maneje la limpieza según su contexto
    if (response.status === 401) {
        throw new Error('Unauthorized');
    }

    return response;
}