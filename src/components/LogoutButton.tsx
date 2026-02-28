// components/LogoutButton.tsx
import { Button } from "./ui/Button";
import { useAuth } from "../features/auth/context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface LogoutButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  className?: string;
  showConfirmation?: boolean;
}

export const LogoutButton = ({
  variant = "primary",
  className = "",
  showConfirmation = true,
}: LogoutButtonProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (showConfirmation) {
      const result = await Swal.fire({
        title: "¿Cerrar sesión?",
        text: "¿Estás seguro de que deseas salir?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar",
      });

      if (!result.isConfirmed) return;
    }

    logout();
    navigate("/login");

    Swal.fire({
      toast: true,
      icon: "success",
      title: "Sesión cerrada",
      timer: 2000,
      showConfirmButton: false,
      position: "top-end",
    });
  };

  return (
    <Button variant={variant} onClick={handleLogout} className={className}>
      Cerrar sesión
    </Button>
  );
};
