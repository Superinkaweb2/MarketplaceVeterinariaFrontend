import { api } from "../../../../shared/http/api";
import type { AxiosResponse } from "axios";

export interface DeliveryTrackingDTO {
    idDelivery: number;
    ordenId: number;
    estado: string;

    // Repartidor
    repartidorId: number | null;
    repartidorNombre: string | null;
    repartidorFoto: string | null;
    repartidorTelefono: string | null;
    repartidorVehiculo: string | null;
    repartidorLat: number | null;
    repartidorLng: number | null;

    // Origen
    origenLat: number;
    origenLng: number;
    origenDireccion: string;

    // Destino
    destinoLat: number;
    destinoLng: number;
    destinoDireccion: string;
    destinoReferencia: string | null;

    // Tiempos y costos
    tiempoEstimadoMin: number | null;
    distanciaKm: number | null;
    costoDelivery: number;

    // OTP (solo al crear, luego null)
    otpCliente: string | null;

    // Foto de entrega
    fotoEntregaUrl: string | null;

    // Timestamps
    asignadoAt: string | null;
    recogidoAt: string | null;
    entregadoAt: string | null;
    createdAt: string | null;
}

export const deliveryService = {
    getByOrden: (ordenId: number): Promise<AxiosResponse<DeliveryTrackingDTO>> =>
        api.get(`/deliveries/orden/${ordenId}`),

    cancelarDelivery: (deliveryId: number): Promise<AxiosResponse<DeliveryTrackingDTO>> =>
        api.post(`/deliveries/${deliveryId}/cancelar`),
};
