import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Stethoscope, Building2, Truck, Check, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useAuth } from "../context/useAuth";
import { api } from "../../../shared/http/api";

type RoleId = "CLIENTE" | "VETERINARIO" | "EMPRESA" | "REPARTIDOR";

const roles: {
  id: RoleId;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: "CLIENTE",
    label: "Cliente",
    description: "Accede a servicios veterinarios, compra productos y gestiona el bienestar de tus mascotas.",
    icon: User,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-400 dark:border-blue-500",
  },
  {
    id: "VETERINARIO",
    label: "Veterinario",
    description: "Gestiona tus citas, pacientes y servicios profesionales desde un panel especializado.",
    icon: Stethoscope,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    borderColor: "border-emerald-400 dark:border-emerald-500",
  },
  {
    id: "EMPRESA",
    label: "Empresa / Clínica",
    description: "Administra tu clínica, equipo veterinario, productos y suscripciones en un solo lugar.",
    icon: Building2,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    borderColor: "border-violet-400 dark:border-violet-500",
  },
  {
    id: "REPARTIDOR",
    label: "Repartidor",
    description: "Gestiona tus entregas, rutas y estado de pedidos de forma eficiente.",
    icon: Truck,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-400 dark:border-amber-500",
  },
];

/**
 * Página de selección de rol.
 * Se muestra DESPUÉS del registro en Auth0, cuando el usuario
 * todavía tiene el rol por defecto (CLIENTE) y perfilCompleto=false.
 */
export const RoleSelectionPage = () => {
  const { isAuthenticated, role, perfilCompleto, setRole } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si no está autenticado, mandarlo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si ya tiene perfil completo, mandarlo a su portal
  if (perfilCompleto && role) {
    const portals: Record<string, string> = {
      CLIENTE: "/portal/cliente",
      VETERINARIO: "/portal/veterinario",
      EMPRESA: "/portal/empresa",
      REPARTIDOR: "/portal/repartidor",
      ADMIN: "/portal/admin",
    };
    return <Navigate to={portals[role] ?? "/"} replace />;
  }

  const handleConfirm = async () => {
    if (!selectedRole) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Llamar al backend para actualizar el rol en la BD
      await api.patch("/users/me/role", { rol: selectedRole });

      // 2. Actualizar el rol localmente en el contexto para que el resto de la app lo use
      setRole(selectedRole);

      // 3. Navegar al formulario de perfil del rol elegido
      navigate(`/register/perfil/${selectedRole.toLowerCase()}`, { replace: true });

    } catch (err: any) {
      const msg = err?.response?.data?.message || "Error al guardar el rol. Inténtalo de nuevo.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/LOGO HUELLA360_logo primario.png"
              alt="Logo Huella360"
              className="h-10 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Huella360</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            ¿Cómo usarás la plataforma?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base">
            Elige el tipo de cuenta. Esta selección define tu experiencia en la plataforma.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                id={`role-select-${r.id.toLowerCase()}`}
                onClick={() => setSelectedRole(r.id)}
                disabled={isLoading}
                className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer group
                  ${isSelected
                    ? `${r.bgColor} ${r.borderColor} shadow-lg scale-[1.02]`
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              >
                {/* Checkmark */}
                {isSelected && (
                  <span className={`absolute top-4 right-4 ${r.color} bg-white dark:bg-slate-900 rounded-full p-0.5`}>
                    <Check size={15} strokeWidth={3} />
                  </span>
                )}

                {/* Icon */}
                <span className={`w-11 h-11 rounded-xl flex items-center justify-center
                  ${isSelected ? `${r.bgColor} ${r.color}` : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 group-hover:bg-slate-200"}`}>
                  <Icon size={22} />
                </span>

                {/* Text */}
                <div>
                  <p className={`font-bold text-base ${isSelected ? r.color : "text-slate-800 dark:text-slate-100"}`}>
                    {r.label}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <p className="text-center text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Confirm button */}
        <Button
          id="btn-confirm-role"
          onClick={handleConfirm}
          disabled={!selectedRole || isLoading}
          variant="primary"
          className="w-full py-4 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Guardando...
            </>
          ) : selectedRole ? (
            `Continuar como ${roles.find((r) => r.id === selectedRole)?.label}`
          ) : (
            "Selecciona un tipo de cuenta para continuar"
          )}
        </Button>

        <p className="text-center text-xs text-slate-400 mt-4">
          Podrás completar tu perfil en el siguiente paso.
        </p>
      </div>
    </div>
  );
};
