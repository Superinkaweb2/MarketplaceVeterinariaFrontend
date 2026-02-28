import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor de Solicitud: Inyectar Token automáticamente
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    const publicEndpoints = [
        "/auth/login",
        "/auth/register",
        "/public/products",
        "/categories",
        "/subscriptions/plans"
    ];

    const isPublic = publicEndpoints.some(endpoint =>
        config.url?.includes(endpoint)
    ) || (config.method === 'get' && config.url?.includes('/categories'));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


// Interceptor de Respuesta: Manejar Expiración de Token (401/403)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/register");

        if ((status === 401 || status === 403) && !isAuthRequest) {
            localStorage.removeItem("token");
            localStorage.removeItem("userRole");

            await Swal.fire({
                icon: "warning",
                title: "Sesión Expirada",
                text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
                confirmButtonColor: "#3b82f6",
                confirmButtonText: "Ir al Login",
                allowOutsideClick: false
            });

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);
