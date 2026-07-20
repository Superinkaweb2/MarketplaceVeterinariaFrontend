import { api } from "../../../../shared/http/api";
import type { ApiResponse } from "../../../../shared/types/api";
import type { DashboardMetrics } from "../types/dashboard.types";

export const dashboardService = {
    /**
     * Obtiene las métricas del dashboard para la empresa autenticada.
     * Endpoint: GET /dashboard
     */
    getMetrics: async (): Promise<DashboardMetrics> => {
        const { data } = await api.get<ApiResponse<DashboardMetrics>>("/dashboard");
        return data.data;
    },
};
