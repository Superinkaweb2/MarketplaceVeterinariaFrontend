import { api } from "../../../../shared/http/api";
import type { ApiResponse } from "../../../../shared/types/api";
import type { ClienteProfile, UpdateClienteRequest } from "../types/cliente.types";

export const clienteService = {
  /**
   * Obtiene el perfil personal del cliente autenticado.
   * Endpoint: GET /clients/me
   */
  getMyProfile: async (): Promise<ClienteProfile> => {
    const { data } = await api.get<ApiResponse<ClienteProfile>>("/clients/me");
    return data.data;
  },

  /**
   * Actualiza el perfil personal del cliente autenticado.
   * Endpoint: PATCH /clients/me
   */
  updateMyProfile: async (payload: UpdateClienteRequest): Promise<ClienteProfile> => {
    const { data } = await api.patch<ApiResponse<ClienteProfile>>("/clients/me", payload);
    return data.data;
  },
};
