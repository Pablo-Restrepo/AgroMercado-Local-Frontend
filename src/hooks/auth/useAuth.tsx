import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest, User, AuthState } from '@/types/auth';
import { authApi } from '@/services/api/authApi';
import { authStorage } from '@/services/storage/authStorage';

interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSession = () => {
            const user = authStorage.getUser();
            const accessToken = authStorage.getAccessToken();
            const refreshToken = authStorage.getRefreshToken();

            if (user && accessToken && refreshToken) {
                setAuthState({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            }
        };

        loadSession();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authApi.login(credentials);

            const user: User = {
                u_id: response.u_id,
                u_nombre_usuario: response.u_nombre_usuario,
                u_email: response.u_email,
                u_rol: response.u_rol,
            };

            authStorage.setTokens(response.access_token, response.refresh_token);
            authStorage.setUser(user);

            setAuthState({
                user,
                accessToken: response.access_token,
                refreshToken: response.refresh_token,
                isAuthenticated: true,
            });

            switch (response.u_rol) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'productor':
                    navigate('/productor/dashboard');
                    break;
                case 'cliente':
                default:
                    navigate('/');
                    break;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authStorage.clear();
        setAuthState({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        });
        navigate('/login');
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                isLoading,
                error,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
}
