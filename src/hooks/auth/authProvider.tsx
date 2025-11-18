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
      const res = await authApi.login(credentials); // retorna LoginResponse

      // guardar tokens y user (usar setTokens que existe en authStorage)
      if (res.access_token || res.refresh_token) {
        authStorage.setTokens(res.access_token ?? "", res.refresh_token ?? "");
      }

      const userToStore: User = {
        u_id: res.u_id,
        u_nombre_usuario: res.u_nombre_usuario,
        u_email: res.u_email,
        u_rol: res.u_rol,
      };
      authStorage.setUser(userToStore);
      setUser(userToStore);
      setIsAuthenticated(true);
      return res;
    } catch (e: any) {
      setError(e?.message || "Error en login");
      setIsAuthenticated(false);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    authStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }

  React.useEffect(() => {
    // sincronizar con storage en cambios externos
    const onStorage = () => {
      setUser(authStorage.getUser());
      setIsAuthenticated(authStorage.hasSession());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = { user, isAuthenticated, login, logout, isLoading, error };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}