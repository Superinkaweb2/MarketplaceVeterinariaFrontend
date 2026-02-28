import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Building2, Phone, Mail, MapPin, Search, UploadCloud, X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { profileService } from "../../services/profileService";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const empresaSchema = z.object({
  nombreComercial: z.string().min(2, "Requerido"),
  razonSocial: z.string().min(2, "Requerido"),
  ruc: z.string().min(11, "Mínimo 11 dígitos"),
  tipoServicio: z.string().min(2, "Requerido"),
  telefono: z.string().min(6, "Requerido"),
  emailContacto: z.string().email("Correo inválido"),
  direccion: z.string().min(5, "Requerido"),
  ciudad: z.string().min(2, "Requerido"),
  descripcion: z.string().optional(),
});

type EmpresaFormData = z.infer<typeof empresaSchema>;

export const EmpresaProfilePage = () => {
  const { setPerfilCompleto } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<EmpresaFormData>({
    resolver: zodResolver(empresaSchema),
    defaultValues: { tipoServicio: "VETERINARIA" }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'logo') setLogoPreview(e.target?.result as string);
      else setBannerPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (type: 'logo' | 'banner') => {
    if (type === 'logo') {
      setLogoPreview(null);
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else {
      setBannerPreview(null);
      if (bannerInputRef.current) bannerInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: EmpresaFormData) => {
    setIsSubmitting(true);
    try {
      const logoFile = logoInputRef.current?.files?.[0];
      const bannerFile = bannerInputRef.current?.files?.[0];

      console.log("Submitting profile with data:", data);
      await profileService.createEmpresaProfile(data, logoFile, bannerFile);
      setPerfilCompleto(true);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Empresa registrada!",
        timer: 3000,
        showConfirmButton: false,
      });
      navigate("/portal/empresa");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      if (error.response) {
        console.log("Full error response:", error.response);
        console.dir(error.response.data);
      }
      const message = error.response?.data?.message || "Ocurrió un error inesperado al crear el perfil.";
      Swal.fire({ 
        icon: "error", 
        title: "Error al crear perfil", 
        text: message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Perfil de Empresa</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Registra tu clínica o veterinaria para comenzar a operar en la plataforma.</p>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 sm:p-10 space-y-8">
            
            {/* ── Subida de Imágenes ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 dark:text-white">Imágenes de Marca</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Logo */}
                <div className="col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Logo</label>
                  <div className="relative group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-40 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={(e) => handleImageChange(e, 'logo')} />
                    
                    {logoPreview ? (
                      <>
                        <img src={logoPreview} alt="Logo preview" className="h-full w-full object-contain p-2" />
                        <button type="button" onClick={() => removeImage('logo')} className="absolute top-2 right-2 bg-slate-900/50 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => logoInputRef.current?.click()} className="flex flex-col items-center text-slate-500 hover:text-primary transition-colors">
                        <UploadCloud size={28} className="mb-2" />
                        <span className="text-sm font-medium">Subir logo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Banner */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Banner (Portada)</label>
                  <div className="relative group border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl h-40 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <input type="file" accept="image/*" className="hidden" ref={bannerInputRef} onChange={(e) => handleImageChange(e, 'banner')} />
                    
                    {bannerPreview ? (
                      <>
                        <img src={bannerPreview} alt="Banner preview" className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeImage('banner')} className="absolute top-2 right-2 bg-slate-900/50 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => bannerInputRef.current?.click()} className="flex flex-col items-center text-slate-500 hover:text-primary transition-colors">
                        <UploadCloud size={28} className="mb-2" />
                        <span className="text-sm font-medium">Subir imagen panorámica</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Datos Legales ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 dark:text-white">Información Legal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Razón Social *</label>
                  <input type="text" {...register("razonSocial")} className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 px-4 focus:ring-2 focus:ring-primary dark:text-white" />
                  {errors.razonSocial && <p className="mt-1 text-xs text-red-500">{errors.razonSocial.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">RUC / NIT *</label>
                  <input type="text" {...register("ruc")} className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 px-4 focus:ring-2 focus:ring-primary dark:text-white" />
                  {errors.ruc && <p className="mt-1 text-xs text-red-500">{errors.ruc.message}</p>}
                </div>
              </div>
            </div>

            {/* ── Datos Comerciales ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 dark:text-white">Perfil Público</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Nombre Comercial *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Building2 size={18} /></div>
                    <input type="text" {...register("nombreComercial")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  {errors.nombreComercial && <p className="mt-1 text-xs text-red-500">{errors.nombreComercial.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Tipo de Servicio *</label>
                  <select {...register("tipoServicio")} className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 px-4 focus:ring-2 focus:ring-primary dark:text-white">
                    <option value="VETERINARIA">Veterinaria / Clínica</option>
                    <option value="PETSHOP">Pet Shop / Tienda</option>
                    <option value="GROOMING">Peluquería / Grooming</option>
                    <option value="HIBRIDO">Servicio Híbrido (Todo junto)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Teléfono de Contacto *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                    <input type="tel" {...register("telefono")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  {errors.telefono && <p className="mt-1 text-xs text-red-500">{errors.telefono.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email de Contacto *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                    <input type="email" {...register("emailContacto")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  {errors.emailContacto && <p className="mt-1 text-xs text-red-500">{errors.emailContacto.message}</p>}
                </div>
              </div>
            </div>

            {/* ── Ubicación ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b border-slate-100 dark:border-slate-800 pb-2 dark:text-white">Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Ciudad *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Search size={18} /></div>
                    <input type="text" {...register("ciudad")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  {errors.ciudad && <p className="mt-1 text-xs text-red-500">{errors.ciudad.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Dirección exacta *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><MapPin size={18} /></div>
                    <input type="text" {...register("direccion")} className="block w-full pl-10 rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-2.5 focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                  {errors.direccion && <p className="mt-1 text-xs text-red-500">{errors.direccion.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full py-4 text-lg font-bold rounded-xl shadow-lg">
                {isSubmitting ? "Creando perfil de empresa..." : "Activar Empresa en VetSaaS"} <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
