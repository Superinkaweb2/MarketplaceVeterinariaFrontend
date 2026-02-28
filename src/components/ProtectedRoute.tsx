import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

/**
 * Guarda de ruta basada en rol.
 * - Sin token → redirige a /login
 * - Con token pero rol no permitido → redirige a /
 * - Autorizado → renderiza los hijos (<Outlet />)
 */
export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
