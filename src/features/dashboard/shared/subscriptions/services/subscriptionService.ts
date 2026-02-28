import { api } from "../../../../../shared/http/api";
import type { ApiResponse } from "../../../../../shared/types/api";
import type { Plan, Suscripcion, SubscriptionUsage } from "../types/subscription.types";

const BASE_URL = "/subscriptions";

export const subscriptionService = {
    /**
   * Obtiene las métricas de uso de la empresa actual (basado en token)
   */
    getUsageMetrics: async (): Promise<SubscriptionUsage> => {
        const { data } = await api.get<ApiResponse<SubscriptionUsage>>("/subscriptions/usage/me");
        return data.data;
    },

    /**
     * Obtener todos los planes activos.
     */
    async getPlans(): Promise<Plan[]> {
        const response = await api.get<{ data: Plan[] }>(`${BASE_URL}/plans`);
        return response.data.data;
    },

    /**
   * Obtiene la suscripción de la empresa actual (basado en token)
   */
    getMySubscription: async (): Promise<Suscripcion> => {
        const { data } = await api.get<ApiResponse<Suscripcion>>("/subscriptions/me");
        return data.data;
    },

    /**
     * Actualizar el plan de una empresa.
     */
    async updatePlan(empresaId: number, planId: number): Promise<Suscripcion> {
        const response = await api.patch<{ data: Suscripcion }>(`${BASE_URL}/update-plan`, null, {
            params: { empresaId, planId }
        });
        return response.data.data;
    }
};
