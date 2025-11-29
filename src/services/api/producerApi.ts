import { crearProductor as crearProductorGremio, type CreateProducerPayload } from "./gremioApi";
export type { CreateProducerPayload };

export async function createProducer(payload: CreateProducerPayload) {
    // Use the new gremioApi implementation
    return crearProductorGremio(payload);
}
