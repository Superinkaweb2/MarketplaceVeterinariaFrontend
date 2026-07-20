import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";

const SKIP_REDIRECT_PATTERNS = ["/login", "/register", "/auth/"];

export const AuthRedirector = () => {
  const { isAuthenticated, role, perfilCompleto, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    const shouldSkip = SKIP_REDIRECT_PATTERNS.some((r) => location.pathname.startsWith(r));
    if (shouldSkip) return;

    if (!role && !perfilCompleto) {
      navigate("/register/rol", { replace: true });
      return;
    }

    if (role && !perfilCompleto) {
      navigate(`/register/perfil/${role.toLowerCase()}`, { replace: true });
      return;
    }
  }, [isAuthenticated, role, perfilCompleto, isLoading, navigate]);

  return null;
};
