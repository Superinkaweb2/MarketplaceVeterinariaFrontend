import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "../../../shared/http/api";

export interface AuthContextType {
  isAuthenticated: boolean;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently,
    isLoading
  } = useAuth0();

  const [role, setRoleState] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [perfilCompleto, setPerfilCompletoState] = useState<boolean>(
    localStorage.getItem("perfilCompleto") === "true",
  );

  // Sincronizar estado cuando el usuario se autentica con Auth0
  useEffect(() => {
    const checkProfileStatus = async (userRole: string, config: any) => {
      try {
        if (userRole === "CLIENTE") await api.get("/clients/me", config);
        else if (userRole === "EMPRESA") await api.get("/companies/me", config);
        else if (userRole === "VETERINARIO") await api.get("/veterinarians/me", config);
        else if (userRole === "REPARTIDOR") await api.get("/repartidores/me", config);

        // Si responde 200, el perfil existe
        setPerfilCompleto(true);
      } catch (error: any) {
        // BusinessException (400) o ResourceNotFoundException (404)
        if (error.response?.status === 404 || error.response?.status === 400) {
          // El perfil no existe
          setPerfilCompleto(false);
        }
      }
    };

    const syncUserWithBackend = async () => {
      setIsSyncing(true);
      try {
        const token = await getAccessTokenSilently();
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Obtener el rol real de la base de datos (Backend)
        const userRes = await api.get("/users/me", config);
        const realRole = userRes.data.data.rol; // "EMPRESA", "CLIENTE", etc.
        setRoleState(realRole);

        // 2. Revisar si tiene el perfil completo usando el rol verdadero
        if (localStorage.getItem("perfilCompleto") === null) {
          await checkProfileStatus(realRole, config);
        }
      } catch (error) {
        console.error("Error sincronizando usuario con el backend:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    if (isAuthenticated && user) {
      // Extraemos otros datos estáticos del JWT si existen
      const auth0EmpresaId = user['https://vet-saas.com/empresaId'] || user.empresaId || null;
      const auth0Nombre = user['https://vet-saas.com/nombre'] || user.nickname || user.name || null;

      if (auth0EmpresaId) setEmpresaId(Number(auth0EmpresaId));
      if (auth0Nombre) setNombre(auth0Nombre);

      // Sincronizar rol y perfil contra el backend
      syncUserWithBackend();

    } else {
      setRoleState(null);
      setEmpresaId(null);
      setNombre(null);
    }
  }, [isAuthenticated, user]);

  // Configurar Interceptor de Axios para inyectar el token de Auth0
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(async (config) => {
      const url = config.url || "";
      const method = config.method?.toLowerCase() || "";

      // Definir rutas públicas
      const alwaysPublic = ["/public/", "/payments/webhook", "/reclamos"].some(e => url.includes(e));
      const publicGet = method === 'get' && ["/services", "/adoptions", "/categories", "/subscriptions/plans"].some(e => url.includes(e));
      const isProtected = url.includes("/me") || url.includes("/applications");
      const isPublic = (alwaysPublic || (publicGet && !isProtected));

      if (!isPublic && isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error al obtener token de Auth0:", error);
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(requestInterceptor);
    };
  }, [getAccessTokenSilently, isAuthenticated]);

  const login = () => {
    loginWithRedirect();
  };

  const logout = () => {
    ["perfilCompleto"].forEach((k) => localStorage.removeItem(k));
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const setPerfilCompleto = (value: boolean) => {
    localStorage.setItem("perfilCompleto", String(value));
    setPerfilCompletoState(value);
  };

  const setRole = (newRole: string) => {
    setRoleState(newRole);
  };


  if (isLoading || isSyncing) {
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