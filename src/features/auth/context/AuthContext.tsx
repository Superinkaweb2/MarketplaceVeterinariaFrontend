import { createContext, useState, useContext } from "react";
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("userRole"));
  const [empresaId, setEmpresaId] = useState<number | null>(() => {
    const stored = localStorage.getItem("empresaId");
    return stored ? Number(stored) : null;
  });
  const [nombre, setNombre] = useState<string | null>(localStorage.getItem("userNombre"));
  const [perfilCompleto, setPerfilCompletoState] = useState<boolean>(
    // Sólo se marca como true si existe la key y es "true"
    localStorage.getItem("perfilCompleto") === "true",
  );

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

