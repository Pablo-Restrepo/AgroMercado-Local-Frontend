import type { MeResponse, LoggedUser } from "@/types/userLogged";

const API_BASE_URL = "http://127.0.0.1:8001";

/**
 * Obtiene el usuario autenticado desde /usuarios/me.
 * Si pasas `token`, se incluye en Authorization; si no, la petición se hace sin token.
 */
export async function getCurrentUser(token?: string): Promise<LoggedUser> {
  const headers: Record<string, string> = {
    accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/usuarios/me`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }));
    throw new Error(payload.message || "Error al obtener el usuario autenticado");
  }

  const body = (await res.json()) as MeResponse;
  return body.data;
}