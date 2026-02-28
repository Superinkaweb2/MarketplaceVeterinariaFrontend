import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, User, Phone, MapPin } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const clienteSchema = z.object({
  nombres: z.string().min(2, "Los nombres son requeridos"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  telefono: z.string().min(6, "El teléfono es requerido"),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  pais: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

export const ClienteProfilePage = () => {
  const { setPerfilCompleto } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: { pais: "Perú" }
  });

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
      navigate("/portal/cliente");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo guardar el perfil" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Completa tu perfil</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Cuéntanos sobre ti para brindarte una mejor experiencia.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nombres *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" {...register("nombres")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.nombres && <p className="mt-1 text-xs text-red-500">{errors.nombres.message}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Apellidos *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" {...register("apellidos")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.apellidos && <p className="mt-1 text-xs text-red-500">{errors.apellidos.message}</p>}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Teléfono *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone size={18} />
                </div>
                <input type="tel" {...register("telefono")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
              </div>
              {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Direccion */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Dirección (opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" {...register("direccion")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Ciudad (opcional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={18} />
                  </div>
                  <input type="text" {...register("ciudad")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
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
