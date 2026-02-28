import { api } from "../../../../shared/http/api";
import type { ApiResponse, PageResponse } from "../../../../shared/types/api";
import type {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from "../../../catalog/types/service.types";

export const serviceService = {
  /**
   * Obtiene los servicios de la empresa actual (paginado).
   */
  getMyServices: async (page = 0, size = 20): Promise<PageResponse<Service>> => {
    const { data } = await api.get<ApiResponse<PageResponse<Service>>>("/services/me", {
      params: { page, size },
    });
    return data.data;
  },

  /**
   * Crea un nuevo servicio.
   */
  createService: async (payload: CreateServiceRequest): Promise<Service> => {
    const { data } = await api.post<ApiResponse<Service>>("/services", payload);
    return data.data;
  },

  /**
   * Actualiza parcialmente un servicio existente.
   */
  updateService: async (id: number, payload: UpdateServiceRequest): Promise<Service> => {
    const { data } = await api.patch<ApiResponse<Service>>(`/services/${id}`, payload);
    return data.data;
  },

  /**
   * Elimina (desactiva) un servicio.
   */
  deleteService: async (id: number): Promise<void> => {
    await api.delete(`/services/${id}`);
  },
};
