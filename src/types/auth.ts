export interface LoginRequest {
    u_email: string;
    u_contrasenia: string;
}

export interface LoginResponse {
    u_id: number;
    u_nombre_usuario: string;
    u_email: string;
    u_rol: 'cliente' | 'productor' | 'admin';
    access_token: string;
    refresh_token: string;
    token_type: string;
    mensaje: string;
}

export interface User {
    u_id: number;
    u_nombre_usuario: string;
    u_email: string;
    u_rol: 'cliente' | 'productor' | 'admin';
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}
