import axios from "axios";
import Swal from "sweetalert2";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// ── Guard anti-re-entrancia ──────────────────────────────────────────────────
let isSessionExpiredGuardActive = false;

// ── Helper: Logout completo + redirect ────────────────────────────────────────
const handleSessionExpired = async () => {
    if (isSessionExpiredGuardActive) return;
    isSessionExpiredGuardActive = true;

    const authKeys = ["token", "userRole", "empresaId", "userNombre", "perfilCompleto"];
    authKeys.forEach((k) => localStorage.removeItem(k));

    await Swal.fire({
        icon: "warning",
        title: "Sesión Expirada",
        text: "Tu sesión ha caducado. Inicia sesión nuevamente.",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "Ir al Login",
        allowOutsideClick: false,
    });

    window.location.href = "/login";
};

// ── Helper: Determinar si un endpoint es publico ─────────────────────────────
// Los endpoints publicos NO deben disparar "Sesion Expirada" en 401/403.
const isPublicEndpoint = (url: string, method: string): boolean => {
    const alwaysPublic = [
        "/auth/",
        "/public/",
        "/payments/webhook",
        "/reclamos",
    ].some((e) => url.includes(e));

    const publicGet =
        method === "get" &&
        [
            "/services",
            "/adoptions",
            "/categories",
            "/subscriptions/plans",
        ].some((e) => url.includes(e));

    // /me y /applications SIEMPRE necesitan token aunque contengan substrings publicos
    const isProtected = url.includes("/me") || url.includes("/applications");

    return alwaysPublic || (publicGet && !isProtected);
};

// ── Interceptor de REQUEST ───────────────────────────────────────────────────
api.interceptors.request.use((config) => {
    return config;
});

// ── Interceptor de RESPONSE ──────────────────────────────────────────────────
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";
        const method = error.config?.method?.toLowerCase() || "";

        if ((status === 401 || status === 403) && !isPublicEndpoint(url, method)) {
            await handleSessionExpired();
        }

        return Promise.reject(error);
    }
);
