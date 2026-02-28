import { api } from "../../../../shared/http/api";
import type { ApiResponse, PageResponse } from "../../../../shared/types/api";
import type { VetProfile, StaffInvitation } from "../types/vet.types";
import type { Service } from "../../../catalog/types/service.types";

export const vetService = {
  /**
   * Obtiene el perfil del veterinario autenticado.
   * Endpoint: GET /veterinarians/me
   */
  getMyProfile: async (): Promise<VetProfile> => {
    const { data } = await api.get<ApiResponse<VetProfile>>("/veterinarians/me");
    return data.data;
  },

  /**
   * Obtiene los servicios del veterinario autenticado (paginado).
   * Endpoint: GET /services/me
   */
  getMyServices: async (page = 0, size = 20): Promise<PageResponse<Service>> => {
    const { data } = await api.get<ApiResponse<PageResponse<Service>>>("/services/me", {
      params: { page, size },
    });
    return data.data;
  },

  /**
   * Obtiene las invitaciones de staff pendientes del veterinario.
   * Endpoint: GET /companies/staff/invitations
   */
  getMyInvitations: async (): Promise<StaffInvitation[]> => {
    const { data } = await api.get<ApiResponse<StaffInvitation[]>>("/companies/staff/invitations");
    return data.data;
  },

  /**
   * Acepta una invitación de staff.
   * Endpoint: PUT /companies/staff/invitations/{staffId}/accept
   */
  acceptInvitation: async (staffId: number): Promise<void> => {
    await api.put(`/companies/staff/invitations/${staffId}/accept`);
  },

  /**
   * Rechaza una invitación de staff.
   * Endpoint: PUT /companies/staff/invitations/{staffId}/reject
   */
  rejectInvitation: async (staffId: number): Promise<void> => {
    await api.put(`/companies/staff/invitations/${staffId}/reject`);
  },
};
