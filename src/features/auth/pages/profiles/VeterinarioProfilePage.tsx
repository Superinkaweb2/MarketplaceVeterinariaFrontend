import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, User, Stethoscope, Award, FileText } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const veterinarioSchema = z.object({
  nombres: z.string().min(2, "Requerido"),
  apellidos: z.string().min(2, "Requerido"),
  especialidad: z.string().min(2, "Requerido"),
  numeroColegiatura: z.string().min(4, "Requerido"),
  biografia: z.string().optional(),
  aniosExperiencia: z.string().optional(),
});

type VeterinarioFormData = z.infer<typeof veterinarioSchema>;

export const VeterinarioProfilePage = () => {
  const { setPerfilCompleto } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<VeterinarioFormData>({
    resolver: zodResolver(veterinarioSchema),
    defaultValues: {
      nombres: "",
      apellidos: "",
      especialidad: "",
      numeroColegiatura: "",
      biografia: "",
      aniosExperiencia: ""
    }
  });

  const onSubmit = async (data: VeterinarioFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        aniosExperiencia: data.aniosExperiencia ? Number(data.aniosExperiencia) : undefined
      };
      await profileService.createVeterinarioProfile(payload);
      setPerfilCompleto(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Perfil verificado!",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/portal/veterinario");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "El número de colegiatura ya existe o hubo un error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Perfil Profesional</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Ingresa tus credenciales veterinarias para activar tu cuenta.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nombres *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                  <input type="text" {...register("nombres")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.nombres && <p className="mt-1 text-xs text-red-500">{errors.nombres.message}</p>}
              </div>

              {/* Apellidos */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Apellidos *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                  <input type="text" {...register("apellidos")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.apellidos && <p className="mt-1 text-xs text-red-500">{errors.apellidos.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Especialidad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Especialidad *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Stethoscope size={18} /></div>
                  <input type="text" placeholder="Ej. Medicina Interna" {...register("especialidad")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.especialidad && <p className="mt-1 text-xs text-red-500">{errors.especialidad.message}</p>}
              </div>

              {/* Colegiatura */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nº Colegiatura Médica *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Award size={18} /></div>
                  <input type="text" {...register("numeroColegiatura")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                {errors.numeroColegiatura && <p className="mt-1 text-xs text-red-500">{errors.numeroColegiatura.message}</p>}
              </div>
            </div>

            {/* Biografia */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Biografía (opcional)</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-slate-400"><FileText size={18} /></div>
                <textarea rows={3} {...register("biografia")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white resize-none" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full py-3.5 text-base font-bold rounded-xl shadow-lg">
                {isSubmitting ? "Guardando..." : "Ir al Portal Médico"} <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
