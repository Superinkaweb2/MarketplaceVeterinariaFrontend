import { api } from "../../../../shared/http/api"; // Ajusta a la ruta de tu axios
import type { AxiosResponse } from "axios";
import type { RepartidorResponseDTO, DeliveryResponseDTO, DeliveryStatus } from "../types/delivery";

export const repartidorService = {
    getPerfil: (): Promise<AxiosResponse<RepartidorResponseDTO>> => 
        api.get("/repartidores/me"),

    actualizarUbicacion: (lat: number, lng: number): Promise<AxiosResponse<void>> => 
        api.patch(`/repartidores/me/ubicacion`, { lat, lng }),
        
    cambiarDisponibilidad: (disponible: boolean): Promise<AxiosResponse<void>> => 
        api.patch(`/repartidores/me/disponibilidad?disponible=${disponible}`),
    
    getDeliveryActivo: (): Promise<AxiosResponse<DeliveryResponseDTO>> => 
        api.get("/repartidores/me/delivery-activo"),
    
    cambiarEstado: (deliveryId: number, nuevoEstado: DeliveryStatus, descripcion: string = ""): Promise<AxiosResponse<DeliveryResponseDTO>> => 
        api.patch(`/deliveries/${deliveryId}/estado`, { nuevoEstado, descripcion }),
    
    confirmarOTP: (deliveryId: number, codigo: string): Promise<AxiosResponse<void>> => 
        api.post(`/deliveries/${deliveryId}/confirmar-otp`, { codigo }),
        
    confirmarFoto: (deliveryId: number, fotoFile: File): Promise<AxiosResponse<void>> => {
        const formData = new FormData();
        formData.append("foto", fotoFile);
        return api.post(`/deliveries/${deliveryId}/confirmar-foto`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
    },

    getPedidosDisponibles: (): Promise<AxiosResponse<DeliveryResponseDTO[]>> => 
        api.get("/deliveries/disponibles"),

    aceptarPedido: (deliveryId: number): Promise<AxiosResponse<DeliveryResponseDTO>> => 
        api.post(`/deliveries/${deliveryId}/aceptar`),

    getHistorial: (): Promise<AxiosResponse<DeliveryResponseDTO[]>> =>
        api.get("/repartidores/me/historial")
};