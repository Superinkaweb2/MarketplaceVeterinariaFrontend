import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  empresaId: number | null;
  nombre: string | null;
  perfilCompleto: boolean;
  login: (token: string, role: string, empresaId?: number, nombre?: string) => void;
  logout: () => void;
  setPerfilCompleto: (value: boolean) => void;
}
export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// [NUEVO] Helper para decodificar y validar la expiración del JWT
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = atob(payloadBase64);
    const payload = JSON.parse(decodedJson);
    const exp = payload.exp;
    if (!exp) return false;
    return exp * 1000 < Date.now();
  } catch (error) {
    return true; // Si falla la decodificación, se asume inválido
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // [MODIFICADO] Verificamos el token antes de inicializar los estados
  const initialToken = localStorage.getItem("token");
  const isExpired = isTokenExpired(initialToken);

  // Si el token inicial está expirado, limpiamos localStorage inmediatamente
  if (initialToken && isExpired) {
    ["token", "userRole", "empresaId", "userNombre", "perfilCompleto"].forEach((k) =>
      localStorage.removeItem(k)
    );
  }

  // Inicializamos estados asegurándonos de que sean null/false si expiró
  const [token, setToken] = useState<string | null>(isExpired ? null : initialToken);
  const [role, setRole] = useState<string | null>(isExpired ? null : localStorage.getItem("userRole"));
  const [empresaId, setEmpresaId] = useState<number | null>(() => {
    if (isExpired) return null;
    const stored = localStorage.getItem("empresaId");
    return stored ? Number(stored) : null;
  });
  const [nombre, setNombre] = useState<string | null>(isExpired ? null : localStorage.getItem("userNombre"));
  const [perfilCompleto, setPerfilCompletoState] = useState<boolean>(
    isExpired ? false : localStorage.getItem("perfilCompleto") === "true",
  );

  // Capa extra: si el token expira mientras la app está abierta sin hacer peticiones
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [token]);

  const login = (
    newToken: string,
    newRole: string,
    newEmpresaId?: number,
    newNombre?: string,
  ) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userRole", newRole);
    if (newEmpresaId !== undefined) localStorage.setItem("empresaId", String(newEmpresaId));
    if (newNombre) localStorage.setItem("userNombre", newNombre);

    setToken(newToken);
    setRole(newRole);
    if (newEmpresaId !== undefined) setEmpresaId(newEmpresaId);
    if (newNombre) setNombre(newNombre);
  };

  const logout = () => {
    ["token", "userRole", "empresaId", "userNombre", "perfilCompleto"].forEach((k) =>
      localStorage.removeItem(k),
    );
    setToken(null);
    setRole(null);
    setEmpresaId(null);
    setNombre(null);
    setPerfilCompletoState(false);
  };

  const setPerfilCompleto = (value: boolean) => {
    localStorage.setItem("perfilCompleto", String(value));
    setPerfilCompletoState(value);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(token),
        role,
        empresaId,
        nombre,
        perfilCompleto,
        login,
        logout,
        setPerfilCompleto,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};