import type { User } from '@/types/auth';

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;

export const authStorage = {
    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    },

    getAccessToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    setUser(user: User): void {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    getUser(): User | null {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        if (!userStr) return null;

        try {
            return JSON.parse(userStr) as User;
        } catch {
            return null;
        }
    },

    clear(): void {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
    },

    hasSession(): boolean {
        return !!this.getAccessToken() && !!this.getUser();
    },
};
