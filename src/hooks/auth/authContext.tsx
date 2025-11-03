import React from "react";
import type { User } from "@/types/auth";

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login?: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);