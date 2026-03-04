import { api } from "../../../shared/http/api";
import type { ApiResponse } from "../../../shared/types/api";
import type { Product, Category, MarketplaceFilters } from "../types/marketplace";

export const marketplaceService = {
    searchProducts: async (filters: MarketplaceFilters) => {
        const params = new URLSearchParams();
        if (filters.q) params.append("q", filters.q);
        if (filters.category) params.append("category", filters.category.toString());
        if (filters.page !== undefined) params.append("page", filters.page.toString());
        if (filters.size !== undefined) params.append("size", filters.size.toString());
        if (filters.sort) params.append("sort", filters.sort);

        const { data } = await api.get<ApiResponse<{ content: Product[] }>>("/public/products", { params });
        return data.data;
    },

    getProductById: async (id: number): Promise<Product> => {
        const { data } = await api.get<ApiResponse<Product>>(`/public/products/${id}`);
        return data.data;
    },

    getCategories: async (): Promise<Category[]> => {
        const { data } = await api.get<ApiResponse<Category[]>>("/categories");
        return data.data;
    },

    createOrder: async (orderData: { empresaId: number; items: { productoId: number; cantidad: number }[] }): Promise<number> => {
        const { data } = await api.post<ApiResponse<number>>("/orders", orderData);
        return data.data;
    },

    getPaymentLink: async (orderId: number): Promise<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }> => {
        const { data } = await api.post<ApiResponse<{ preferenceId: string; initPoint: string; sandboxInitPoint: string }>>(`/payments/checkout/${orderId}`);
        return data.data;
    },

    searchAdoptions: async (page = 0, size = 12) => {
        const { data } = await api.get<ApiResponse<{ content: any[] }>>("/adoptions", {
            params: { page, size }
        });
        return data.data;
    },

    getAdoptionById: async (id: number): Promise<any> => {
        const { data } = await api.get<ApiResponse<any>>(`/adoptions/${id}`);
        return data.data;
    },

    searchServices: async (page = 0, size = 12) => {
        const { data } = await api.get<ApiResponse<{ content: any[] }>>("/services", {
            params: { page, size }
        });
        return data.data;
    }
};


