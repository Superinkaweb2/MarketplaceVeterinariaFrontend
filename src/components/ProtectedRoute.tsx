import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

const PORTALS: Record<string, string> = {
  CLIENTE: "/portal/cliente",
  VETERINARIO: "/portal/veterinario",
  EMPRESA: "/portal/empresa",
  REPARTIDOR: "/portal/repartidor",
  ADMIN: "/portal/admin",
};

interface ProtectedRouteProps {
  allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to={PORTALS[role] ?? "/"} replace />;
  }

  if (!role) {
    return <Navigate to="/register/rol" replace />;
  }

  return <Outlet />;
};
