/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type { ReactNode } from "react";
import type { User, LoginRequest } from "@/types/auth";
import { AuthContext } from "./authContext";
import { authStorage } from "@/services/storage/authStorage";
import { authApi } from "@/services/api/authApi";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => authStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => authStorage.hasSession());
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  async function login(credentials: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Iniciando login...');
      const res = await authApi.login(credentials);
      console.log('Login response:', res);

      // Guardar tokens
      if (res.access_token && res.refresh_token) {
        console.log('Guardando tokens...');
        authStorage.setTokens(res.access_token, res.refresh_token);
        console.log('Token guardado:', res.access_token.substring(0, 20) + '...');
      } else {
        console.error('No se recibieron tokens en la respuesta:', res);
      }

      // Guardar usuario
      const userToStore: User = {
        u_id: res.u_id,
        u_nombre_usuario: res.u_nombre_usuario,
        u_email: res.u_email,
        u_rol: res.u_rol,
      };
      
      console.log('Guardando usuario:', userToStore);
      authStorage.setUser(userToStore);
      setUser(userToStore);
      setIsAuthenticated(true);
      
      console.log('Login exitoso');
      return res;
    } catch (e: any) {
      console.error('Error en login:', e);
      setError(e?.message || "Error en login");
      setIsAuthenticated(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    console.log('Cerrando sesión...');
    authStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }

  // Función para verificar si la sesión sigue siendo válida
  const checkSession = React.useCallback(async () => {
    const token = authStorage.getAccessToken();
    const storedUser = authStorage.getUser();
    
    console.log('Verificando sesión - Token:', !!token, 'User:', !!storedUser);
    
    if (!token || !storedUser) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      setUser(storedUser);
      setIsAuthenticated(true);
    } catch {
      console.log('Error verificando sesión, limpiando...');
      logout();
    }
  }, []);

  React.useEffect(() => {
    checkSession();
  }, [checkSession]);

  React.useEffect(() => {
    // Sincronizar con storage en cambios externos
    const onStorage = () => {
      const hasSession = authStorage.hasSession();
      const storedUser = authStorage.getUser();
      
      console.log('Storage changed - Session:', hasSession, 'User:', !!storedUser);
      
      setUser(storedUser);
      setIsAuthenticated(hasSession);
    };
    
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = { user, isAuthenticated, login, logout, isLoading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}