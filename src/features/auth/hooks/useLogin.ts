import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authService } from "../services/authService";
import { profileService } from "../services/profileService";
import { getRedirectByRole } from "../services/authRedirect";
import { useAuth } from "../context/useAuth";

/**
 * Después del login se verifica si el usuario ya tiene perfil.
 * Si no → redirige al formulario de perfil de su rol.
 * Si sí → redirige al dashboard.
 */
const checkPerfilByRole = async (role: string): Promise<boolean> => {
  try {
    let response;
    if (role === "CLIENTE") response = await profileService.getClienteProfile();
    else if (role === "VETERINARIO") response = await profileService.getVeterinarioProfile();
    else if (role === "EMPRESA") response = await profileService.getEmpresaProfile();
    else if (role === "REPARTIDOR") response = await profileService.getRepartidorProfile();
    else return true; // ADMIN siempre tiene acceso directo

    // El backend devuelve: { success: true, message: "...", data: {...} | null }
    // Si "data" viene null o vacío, significa que el perfil no se ha creado aún.
    if (!response || !response.data) return false;

    // Prevención adicional: Si por alguna razón es un array u objeto vacío "{}"
    if (typeof response.data === "object" && Object.keys(response.data).length === 0) {
      return false;
    }

    return true;
  } catch {
    // Si el backend lanza 404 Not Found, llega aquí directamente
    return false;
  }
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login, setPerfilCompleto } = useAuth();

  const loginUser = async (correo: string, password: string, redirectTo?: string) => {
    try {
      const response = await authService.login({ correo, password });

      login(response.token, response.rol, response.empresaId, response.nombre);

      // Verificar si el perfil ya está creado
      const tieneP = await checkPerfilByRole(response.rol);
      setPerfilCompleto(tieneP);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Bienvenido${response.nombre ? `, ${response.nombre}` : ""}`,
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      if (tieneP) {
        navigate(redirectTo || getRedirectByRole(response.rol));
      } else {
        navigate(`/register/perfil/${response.rol.toLowerCase()}`);
      }
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;

      if (status === 401) {
        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: "El correo o la contraseña no son válidos.",
        });
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: "Ocurrió un error inesperado. Intenta de nuevo.",
      });
    }
  };

  return { login: loginUser };
};
