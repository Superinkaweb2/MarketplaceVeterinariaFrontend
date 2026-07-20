import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, User, Phone, MapPin } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../context/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const clienteSchema = z.object({
  nombres: z.string().min(2, "Los nombres son requeridos"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  telefono: z.string().min(6, "El teléfono es requerido").regex(/^\d+$/, "Solo números permitidos"),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  pais: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export const ClienteProfilePage = () => {
  const { perfilCompleto, setPerfilCompleto } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { pais: "Perú" }
  });

  useEffect(() => {
    const checkProfile = async () => {
      try {
        await profileService.getClienteProfile();
        setPerfilCompleto(true);
        navigate("/portal/cliente", { replace: true });
      } catch {
        setIsChecking(false);
      }
    };
    if (!perfilCompleto) {
      checkProfile();
    } else {
      setIsChecking(false);
    }
  }, [perfilCompleto, setPerfilCompleto, navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 animate-pulse font-medium">Verificando perfil...</p>
        </div>
      </div>
    );
  }

  if (perfilCompleto) {
    return <Navigate to="/portal/cliente" replace />;
  }

  const onSubmit = async (data: ClienteFormData) => {
    setIsSubmitting(true);
    try {
      await profileService.createClienteProfile(data);
      setPerfilCompleto(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Perfil completado!",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/portal/cliente", { replace: true });
    } catch (error: any) {
      console.error("Error creating profile:", error);

      let message = "No se pudo guardar el perfil";
      let footer = undefined;

      if (error.response?.data) {
        const data = error.response.data;
        message = data.message || message;

        if (data.validationErrors) {
          const errors = Object.values(data.validationErrors).map(err => `<li>${err}</li>`).join("");
          footer = `<div class="text-left"><p class="font-bold mb-2">Errores de validación:</p><ul class="list-disc pl-4 space-y-1">${errors}</ul></div>`;
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        footer: footer
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Completa tu perfil</h2>
          <p className="mt-2 text-slate-600">Cuéntanos sobre ti para brindarte una mejor experiencia.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nombres *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" {...register("nombres")} className="block w-full pl-10 rounded-xl border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-primary" />
                </div>
                {errors.nombres && <p className="mt-1 text-xs text-red-500">{errors.nombres.message}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Apellidos *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" {...register("apellidos")} className="block w-full pl-10 rounded-xl border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-primary" />
                </div>
                {errors.apellidos && <p className="mt-1 text-xs text-red-500">{errors.apellidos.message}</p>}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input type="tel" {...register("telefono")} className="block w-full pl-10 rounded-xl border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-primary" />
              </div>
              {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Direccion */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Dirección (opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" {...register("direccion")} className="block w-full pl-10 rounded-xl border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-primary" />
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ciudad (opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" {...register("ciudad")} className="block w-full pl-10 rounded-xl border-slate-200 bg-slate-50 py-2.5 focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full py-3.5 text-base font-bold rounded-xl shadow-lg">
                {isSubmitting ? "Guardando..." : "Terminar Registro"} <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
