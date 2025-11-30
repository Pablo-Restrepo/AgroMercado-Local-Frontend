import type { User } from '@/types/auth';

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;

export const authStorage = {
    setTokens(accessToken: string, refreshToken: string): void {
        console.log('Guardando tokens en localStorage...');
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        console.log('Tokens guardados exitosamente');
    },

    getAccessToken(): string | null {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        console.log('Obteniendo token:', token ? `${token.substring(0, 20)}...` : 'No token found');
        return token;
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setUser(user: User): void {
        console.log('Guardando usuario en localStorage:', user);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    getUser(): User | null {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (!userStr) {
            console.log('No hay usuario en localStorage');
            return null;
        }

        try {
            const user = JSON.parse(userStr) as User;
            console.log('Usuario obtenido del localStorage:', user);
            return user;
        } catch {
            console.error('Error parseando usuario del localStorage');
            return null;
        }
    },

    clear(): void {
        console.log('Limpiando localStorage...');
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    hasSession(): boolean {
        const hasToken = !!this.getAccessToken();
        const hasUser = !!this.getUser();
        console.log('Verificando sesión - Token:', hasToken, 'User:', hasUser);
        return hasToken && hasUser;
    },
};