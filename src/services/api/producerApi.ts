import { authFetch } from "@/services/api/authFetch";
import { crearProductor as crearProductorGremio, type CreateProducerPayload } from "./gremioApi";

const API_BASE_URL = "http://localhost:8090";

// Re-export for backwards compatibility
export type { CreateProducerPayload };

export async function createProducer(payload: CreateProducerPayload) {
    // Use the new gremioApi implementation
    return crearProductorGremio(payload);
}
