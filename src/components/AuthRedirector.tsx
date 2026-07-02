import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

const AUTH_ROUTES = ["/login", "/register", "/auth/"];

/**
 * Componente global que redirige al usuario segun su estado de autenticacion.
 *
 * - Autenticado sin rol → /register/rol (seleccion de rol)
 * - Autenticado con rol sin perfil → /register/perfil/{role}
 * - No autenticado o en ruta de auth → no hace nada
 */
export const AuthRedirector = () => {
  const { isAuthenticated, role, perfilCompleto, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const isAuthRoute = AUTH_ROUTES.some((r) => location.pathname.startsWith(r));
    if (isAuthRoute) return;

    if (!role && !perfilCompleto) {
      navigate("/register/rol", { replace: true });
      return;
    }

    if (role && !perfilCompleto) {
      navigate(`/register/perfil/${role.toLowerCase()}`, { replace: true });
      return;
    }
  }, [isAuthenticated, role, perfilCompleto, isLoading, location.pathname, navigate]);

  return null;
};
