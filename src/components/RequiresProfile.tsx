import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

/**
 * Segunda barrera de acceso a los dashboards.
 * Debe usarse DENTRO de un <ProtectedRoute> (ya verifica el token).
 *
 * Si el usuario tiene token + rol correcto BUT perfilCompleto=false
 * → lo fuerza al formulario de perfil de su rol.
 */
export const RequiresProfile = () => {
  const { perfilCompleto, role } = useAuth();

  if (!perfilCompleto && role) {
    return <Navigate to={`/register/perfil/${role.toLowerCase()}`} replace />;
  }

  return <Outlet />;
};
