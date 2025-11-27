import type { MeResponse, LoggedUser } from "@/types/userLogged";
import { authFetch } from "@/services/api/authFetch"; // usar authFetch que añade Authorization

const API_BASE_URL = "http://localhost:8090";

/**
 * Obtiene el usuario autenticado desde /usuarios/me usando authFetch
 */
export async function getCurrentUser(): Promise<LoggedUser> {
  const res = await authFetch(`${API_BASE_URL}/usuarios/me`, {
    method: "GET",
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ message: "Error en el servidor" }));
    throw new Error(payload.message || "Error al obtener el usuario autenticado");
  }

  const body = (await res.json()) as MeResponse;
  return body.data;
}