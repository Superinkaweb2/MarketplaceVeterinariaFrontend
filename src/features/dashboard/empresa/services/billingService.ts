import { api } from "../../../../shared/http/api";
import type { ApiResponse, PageResponse } from "../../../../shared/types/api";
import type { OrderSummary } from "../types/billing.types";

export const billingService = {
  /**
   * Obtiene las órdenes de la empresa autenticada (paginado).
   *
   * TODO: Backend pendiente — Este endpoint aún no está implementado en el backend.
   * Cuando se cree el endpoint GET /orders/me en OrderController, este servicio
   * funcionará automáticamente sin cambios en el frontend.
   *
   * Endpoint esperado: GET /orders/me?page={page}&size={size}
   * Respuesta esperada: ApiResponse<PageResponse<OrderSummary>>
   */
  getMyOrders: async (page = 0, size = 20): Promise<PageResponse<OrderSummary>> => {
    const { data } = await api.get<ApiResponse<PageResponse<OrderSummary>>>("/orders/me", {
      params: { page, size },
    });
    return data.data;
  },

  /**
   * Genera un link de pago (checkout) de MercadoPago para una orden.
   * Endpoint: POST /payments/checkout/{orderId}
   */
  generateCheckout: async (orderId: number): Promise<string> => {
    const { data } = await api.post<ApiResponse<string>>(`/payments/checkout/${orderId}`);
    return data.data;
  },
};
