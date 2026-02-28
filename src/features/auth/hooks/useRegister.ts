import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authService } from "../services/authService";
import { useAuth } from "../context/useAuth";
import type { RegisterRequest } from "../types/auth";

/**
 * Hook para registrar un nuevo usuario.
 * Después del registro el perfil nunca está completo → siempre
 * redirige al formulario de perfil del rol elegido.
 */
export const useRegister = () => {
  const navigate = useNavigate();
  const { login, setPerfilCompleto } = useAuth();

  const register = async (payload: RegisterRequest) => {
    try {
      const response = await authService.register(payload);

      // Guardar token en el contexto para que las llamadas de perfil lleven el JWT
      login(response.token, response.rol, response.empresaId, response.nombre);

      // Recién registrado → perfil SIEMPRE incompleto
      setPerfilCompleto(false);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Cuenta creada!",
        text: "Ahora completa tu perfil para continuar.",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      // Redirigir al formulario de perfil del rol
      navigate(`/register/perfil/${payload.rol.toLowerCase()}`);
    } catch (error: any) {
      const message = error.response?.data?.message || "Ocurrió un error en el registro";
      Swal.fire({
        icon: "error",
        title: "Error de Registro",
        text: message
      });
      throw error;
    }
  };

  return { register };
};
