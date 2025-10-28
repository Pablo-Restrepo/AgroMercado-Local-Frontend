import { authStorage } from '@/services/storage/authStorage';

export async function authFetch(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = authStorage.getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'accept': 'application/json',
    };

    if (options.headers) {
        const optionsHeaders = new Headers(options.headers);
        optionsHeaders.forEach((value, key) => {
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

    if (response.status === 401) {
        authStorage.clear();
        window.location.href = '/login';
    }

    return response;
}
