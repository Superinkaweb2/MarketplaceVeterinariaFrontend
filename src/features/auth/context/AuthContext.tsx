import { createContext, useState, useContext, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../../../shared/http/api";

// ── Constantes de storage ────────────────────────────────────────────────────
const STORAGE_KEYS = {
    PERFIL_COMPLETO: "perfilCompleto",
    TOKEN: "token",
    USER_ROLE: "userRole",
    EMPRESA_ID: "empresaId",
    USER_NOMBRE: "userNombre",
} as const;

const AUTH_STORAGE_KEYS = [
    STORAGE_KEYS.TOKEN,
    STORAGE_KEYS.USER_ROLE,
    STORAGE_KEYS.EMPRESA_ID,
    STORAGE_KEYS.USER_NOMBRE,
    STORAGE_KEYS.PERFIL_COMPLETO,
];

// ── Claims de Auth0 (namespace del Post Login Action) ────────────────────────
const AUTH0_CLAIMS = {
    EMAIL: "https://vet-saas.com/email",
    ROLE: "https://vet-saas.com/role",
    EMPRESA_ID: "https://vet-saas.com/empresaId",
    NOMBRE: "https://vet-saas.com/nombre",
} as const;

// ── Helpers de storage ───────────────────────────────────────────────────────
const clearAuthStorage = () => {
    AUTH_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
};

// ── Context ──────────────────────────────────────────────────────────────────
export interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    role: string | null;
    empresaId: number | null;
    nombre: string | null;
    perfilCompleto: boolean;
    login: () => void;
    logout: () => void;
    setPerfilCompleto: (value: boolean) => void;
    setRole: (role: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// ── Hook publico ─────────────────────────────────────────────────────────────
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};

// ── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const {
        isAuthenticated,
        user,
        loginWithRedirect,
        logout: auth0Logout,
        getAccessTokenSilently,
        isLoading,
    } = useAuth0();

    const [role, setRoleState] = useState<string | null>(
        localStorage.getItem(STORAGE_KEYS.USER_ROLE)
    );
    const [empresaId, setEmpresaId] = useState<number | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.EMPRESA_ID);
        return stored ? Number(stored) : null;
    });
    const [nombre, setNombre] = useState<string | null>(
        localStorage.getItem(STORAGE_KEYS.USER_NOMBRE)
    );
    const [perfilCompleto, setPerfilCompletoState] = useState<boolean>(
        localStorage.getItem(STORAGE_KEYS.PERFIL_COMPLETO) === "true"
    );

    const syncRef = useRef(false);

    // ── 1. Leer claims de Auth0 INMEDIATAMENTE (no bloquea UI) ──────────
    useEffect(() => {
        if (!isAuthenticated || !user) return;

        const auth0EmpresaId = user[AUTH0_CLAIMS.EMPRESA_ID] || user.empresaId || null;
        const auth0Nombre = user[AUTH0_CLAIMS.NOMBRE] || user.nickname || user.name || null;

        if (auth0EmpresaId) {
            const id = String(auth0EmpresaId);
            localStorage.setItem(STORAGE_KEYS.EMPRESA_ID, id);
            setEmpresaId(Number(auth0EmpresaId));
        }
        if (auth0Nombre) {
            localStorage.setItem(STORAGE_KEYS.USER_NOMBRE, auth0Nombre);
            setNombre(auth0Nombre);
        }
    }, [isAuthenticated, user]);

    // ── 2. Sync con backend en background (NO bloquea la UI) ────────────
    // localStorage "userRole" es la fuente de verdad:
    //   - Si es null → usuario nuevo, necesita elegir rol → NO sync
    //   - Si tiene valor → usuario existente → sync con backend
    useEffect(() => {
        if (!isAuthenticated || !user || syncRef.current) return;

        const storedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);

        if (!storedRole) {
            localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, "false");
            setPerfilCompletoState(false);
            return;
        }

        syncRef.current = true;

        const syncWithBackend = async () => {
            try {
                const token = await getAccessTokenSilently();
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const auth0Email = (user[AUTH0_CLAIMS.EMAIL] as string) || user.email;
                const auth0Role = (user[AUTH0_CLAIMS.ROLE] as string) || null;
                if (auth0Email) {
                    await api.post("/auth/sync", {
                        correo: auth0Email,
                        nombre: user[AUTH0_CLAIMS.NOMBRE] || user.nickname || user.name || null,
                        auth0Sub: user.sub || null,
                        rol: auth0Role || storedRole,
                    });
                }

                const userRes = await api.get("/users/me", config);
                const backendRole = userRes.data.data.rol;
                const VALID_ROLES = ["CLIENTE", "VETERINARIO", "EMPRESA", "REPARTIDOR", "ADMIN"];

                if (backendRole && VALID_ROLES.includes(backendRole)) {
                    localStorage.setItem(STORAGE_KEYS.USER_ROLE, backendRole);
                    setRoleState(backendRole);
                } else if (backendRole) {
                    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
                    setRoleState(null);
                    localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, "false");
                    setPerfilCompletoState(false);
                }

                if (localStorage.getItem(STORAGE_KEYS.PERFIL_COMPLETO) === null) {
                    try {
                        if (backendRole === "CLIENTE") await api.get("/clients/me", config);
                        else if (backendRole === "EMPRESA") await api.get("/companies/me", config);
                        else if (backendRole === "VETERINARIO") await api.get("/veterinarians/me", config);
                        else if (backendRole === "REPARTIDOR") await api.get("/repartidores/me", config);

                        localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, "true");
                        setPerfilCompletoState(true);
                    } catch (error: any) {
                        if (error.response?.status === 404 || error.response?.status === 400) {
                            localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, "false");
                            setPerfilCompletoState(false);
                        }
                    }
                }
            } catch (error) {
                console.error("Error sincronizando con el backend:", error);
            }
        };

        syncWithBackend();
    }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Interceptor: inyectar token de Auth0 en requests protegidos ─────
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                const url = config.url || "";
                const method = config.method?.toLowerCase() || "";

                const alwaysPublic = ["/auth/", "/public/", "/payments/webhook", "/reclamos"].some(
                    (e) => url.includes(e)
                );
                const publicGet =
                    method === "get" &&
                    ["/services", "/adoptions", "/categories", "/subscriptions/plans"].some(
                        (e) => url.includes(e)
                    );
                const isProtected = url.includes("/me") || url.includes("/applications");
                const isPublic = alwaysPublic || (publicGet && !isProtected);

                if (!isPublic && isAuthenticated) {
                    try {
                        const token = await getAccessTokenSilently();
                        config.headers.Authorization = `Bearer ${token}`;
                    } catch (error) {
                        console.error("Error al obtener token de Auth0:", error);
                    }
                }

                return config;
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
        };
    }, [getAccessTokenSilently, isAuthenticated]);

    // ── Auth actions ────────────────────────────────────────────────────
    const login = useCallback(() => {
        loginWithRedirect();
    }, [loginWithRedirect]);

    const logout = useCallback(() => {
        syncRef.current = false;
        clearAuthStorage();
        auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    }, [auth0Logout]);

    const setPerfilCompleto = useCallback((value: boolean) => {
        localStorage.setItem(STORAGE_KEYS.PERFIL_COMPLETO, String(value));
        setPerfilCompletoState(value);
    }, []);

    const setRole = useCallback((newRole: string) => {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, newRole);
        setRoleState(newRole);
    }, []);

    // ── Loading state (solo Auth0 init, NO el sync) ─────────────────────
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium">Validando sesión...</p>
            </div>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                role,
                empresaId,
                nombre,
                perfilCompleto,
                login,
                logout,
                setPerfilCompleto,
                setRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
