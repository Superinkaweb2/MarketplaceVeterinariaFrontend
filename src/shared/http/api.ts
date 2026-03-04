import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    const url = config.url || "";
    const method = config.method?.toLowerCase() || "";

    // endpoints that are always public regardless of method (usually POST)
    const alwaysPublic = ["/auth/login", "/auth/register", "/public/", "/payments/webhook"].some(e => url.includes(e));

    // GET requests that are public (catalog, plans, categories)
    const publicGet = method === 'get' && ["/services", "/adoptions", "/categories", "/subscriptions/plans"].some(e => url.includes(e));

    // Protected routes that might contain public substrings (must override publicGet)
    const isProtected = url.includes("/me") || url.includes("/applications");

    const isPublic = (alwaysPublic || (publicGet && !isProtected));

    if (token && !isPublic) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        const isAuthRequest = url.includes("/auth/login") || url.includes("/auth/register");

        if ((status === 401 || status === 403) && !isAuthRequest) {
            ["token", "userRole", "empresaId", "userNombre", "perfilCompleto"].forEach((k) =>
                localStorage.removeItem(k)
            );

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