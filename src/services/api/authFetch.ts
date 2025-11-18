import { authStorage } from '@/services/storage/authStorage';
export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = authStorage.getAccessToken();

    // No forzar content-type para GET, construir headers base
    const headers: Record<string, string> = {
        'accept': 'application/json',
    };

    // Si se pasa Content-Type en options.headers respetarlo
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

    // No redirigir desde aquí. Devolver error para que el authProvider gestione refresh/clear.
    if (response.status === 401) {
        // limpiar storage para evitar bucles, pero no forzar location.href
        authStorage.clear();
        throw new Error('Unauthorized');
    }

    return response;
}