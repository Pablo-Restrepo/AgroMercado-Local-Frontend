import React from "react";
import type { User } from "@/types/auth";
import { AuthContext } from "./authContext";
import { authStorage } from "@/services/storage/authStorage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(() => authStorage.getUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(() => authStorage.hasSession());

  function login(accessToken: string, refreshToken: string, u?: User) {
    authStorage.setTokens(accessToken, refreshToken);
    if (u) authStorage.setUser(u);
    setUser(u ?? authStorage.getUser());
    setIsAuthenticated(true);
  }

  function logout() {
    authStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}