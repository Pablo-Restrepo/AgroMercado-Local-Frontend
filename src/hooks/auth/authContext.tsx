import React from "react";
import type { User, LoginRequest, LoginResponse } from "@/types/auth";

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
  isLoading?: boolean;
  error?: string | null;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);