import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, User, Phone, Truck, Camera, X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const repartidorSchema = z.object({
  nombres: z.string().min(2, "Los nombres son requeridos"),
  apellidos: z.string().min(2, "Los apellidos son requeridos"),
  telefono: z.string().min(6, "El teléfono es requerido").regex(/^\d+$/, "Solo números permitidos"),
  tipoVehiculo: z.string().min(2, "El tipo de vehículo es requerido"),
  placaVehiculo: z.string().min(3, "La placa del vehículo es requerida"),
});

type RepartidorFormData = z.infer<typeof repartidorSchema>;

export const RepartidorProfilePage = () => {
  const { setPerfilCompleto } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RepartidorFormData>({
    resolver: zodResolver(repartidorSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("Error", "La imagen debe ser menor a 2MB", "error");
        return;
      }
      setFotoPerfil(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setFotoPerfil(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: RepartidorFormData) => {
    setIsSubmitting(true);
    try {
      await profileService.createRepartidorProfile(data, fotoPerfil || undefined);
      setPerfilCompleto(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Perfil completado!",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/portal/repartidor");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      let message = "No se pudo guardar el perfil";
      
      if (error.response?.data) {
        message = error.response.data.message || message;
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Registro de Repartidor</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Completa tu información para empezar a realizar entregas.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Foto de Perfil */}
            <div className="flex flex-col items-center mb-8">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center w-full">
                Foto de Perfil / Identificación *
              </label>
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="text-slate-400 w-10 h-10" />
                  )}
                </div>
                {previewUrl ? (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                ) : (
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors rounded-full">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">Haz clic para subir una foto clara de tu rostro.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nombres */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nombres *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input type="text" {...register("nombres")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white outline-none" />
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
                  <input type="text" {...register("apellidos")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white outline-none" />
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
                <input type="tel" {...register("telefono")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white outline-none" />
              </div>
              {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Tipo de Vehículo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Tipo de Vehículo *</label>
                <select
                  {...register("tipoVehiculo")}
                  className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white outline-none px-4 appearance-none"
                >
                  <option value="">Selecciona uno...</option>
                  <option value="MOTO">Motocicleta</option>
                  <option value="BICICLETA">Bicicleta</option>
                  <option value="AUTO">Automóvil</option>
                  <option value="A_PIE">A pie / Caminando</option>
                </select>
                {errors.tipoVehiculo && <p className="mt-1 text-xs text-red-500">{errors.tipoVehiculo.message}</p>}
              </div>

              {/* Placa */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Placa del Vehículo *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Truck size={18} />
                  </div>
                  <input
                    type="text"
                    {...register("placaVehiculo")}
                    placeholder="Ej: ABC-123 o N/A"
                    className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white outline-none"
                  />
                </div>
                {errors.placaVehiculo && <p className="mt-1 text-xs text-red-500">{errors.placaVehiculo.message}</p>}
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                {isSubmitting ? "Guardando..." : "Terminar Registro"} <ArrowRight size={22} className="ml-2" />
              </Button>
              <p className="text-center text-xs text-slate-500 mt-4 italic">
                Nota: Tu cuenta será verificada por el equipo administrativo antes de recibir solicitudes.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
