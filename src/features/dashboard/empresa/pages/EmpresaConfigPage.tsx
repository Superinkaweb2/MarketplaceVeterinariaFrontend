import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Settings,
    Building2,
    CreditCard,
    Save,
    Loader2,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    Camera,
    Image as ImageIcon,
    Lock
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../shared/http/api";
import { useAuth } from "../../../auth/context/useAuth";
import { authService } from "../../../auth/services/authService";
import Swal from "sweetalert2";
import { MapPicker } from "../components/MapPicker";

const generalDataSchema = z.object({
    nombreComercial: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    emailContacto: z.string().email("Email inválido"),
    telefono: z.string().min(7, "Teléfono inválido").regex(/^\d+$/, "Solo números permitidos"),
    tipoServicio: z.string().min(2, "Requerido"),
    tipoServicioOtro: z.string().optional(),
    direccion: z.string().min(5, "La dirección es muy corta"),
    descripcion: z.string().optional(),
    latitud: z.number().optional().nullable(),
    longitud: z.number().optional().nullable(),
}).refine((data) => data.tipoServicio !== "OTRO" || (data.tipoServicioOtro && data.tipoServicioOtro.trim().length > 0), {
    message: "Debe especificar el tipo de servicio",
    path: ["tipoServicioOtro"],
});

type GeneralDataValues = z.infer<typeof generalDataSchema>;

const mercadopagoSchema = z.object({
    mpPublicKey: z.string().min(10, "Public Key inválida"),
    mpAccessToken: z.string().min(10, "Access Token inválido"),
});

type MercadoPagoValues = z.infer<typeof mercadopagoSchema>;

export const EmpresaConfigPage = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<"general" | "pago" | "seguridad">("general");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Image states
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const {
        register: registerGeneral,
        handleSubmit: handleSubmitGeneral,
        reset: resetGeneral,
        watch: watchGeneral,
        setValue: setGeneralValue,
        formState: { errors: errorsGeneral },
    } = useForm<GeneralDataValues>({
        resolver: zodResolver(generalDataSchema),
    });

    const tipoServicio = watchGeneral("tipoServicio");
    const latitud = watchGeneral("latitud");
    const longitud = watchGeneral("longitud");

    const {
        register: registerMP,
        handleSubmit: handleSubmitMP,
        formState: { errors: errorsMP, isSubmitting: isSubmittingMP },
    } = useForm<MercadoPagoValues>({
        resolver: zodResolver(mercadopagoSchema),
    });

    useEffect(() => {
        fetchCompanyData();
    }, []);

    const fetchCompanyData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/companies/me");
            const data = response.data.data;

            const knownTypes = ["VETERINARIA", "PETSHOP", "GROOMING", "HIBRIDO"];
            const isCustom = !knownTypes.includes(data.tipoServicio);

            resetGeneral({
                nombreComercial: data.nombreComercial,
                emailContacto: data.emailContacto,
                telefono: data.telefono,
                direccion: data.direccion,
                descripcion: data.descripcion || "",
                tipoServicio: isCustom ? "OTRO" : data.tipoServicio,
                tipoServicioOtro: isCustom ? data.tipoServicio : "",
                latitud: data.latitud,
                longitud: data.longitud
            });

            if (data.logoUrl) setLogoPreview(data.logoUrl);
            if (data.bannerUrl) setBannerPreview(data.bannerUrl);

        } catch (error) {
            console.error("Error al cargar datos de empresa:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdateGeneral = async (data: GeneralDataValues) => {
        setIsSaving(true);
        try {
            const finalData = {
                ...data,
                tipoServicio: data.tipoServicio === "OTRO" ? data.tipoServicioOtro || "OTRO" : data.tipoServicio,
                latitud: data.latitud,
                longitud: data.longitud
            };

            const formData = new FormData();
            // El backend espera el objeto DTO en una parte llamada "data" como JSON
            formData.append("data", new Blob([JSON.stringify(finalData)], { type: "application/json" }));

            if (logoFile) {
                formData.append("logo", logoFile);
            }
            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            await api.put("/companies", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "¡Actualizado!",
                text: "Los datos generales han sido guardados.",
                timer: 2000,
                showConfirmButton: false,
            });

            // Refresh to get new signed URLs if any
            fetchCompanyData();
            setLogoFile(null);
            setBannerFile(null);

        } catch (error) {
            console.error("Error al actualizar empresa:", error);
            Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const onUpdateMP = async (data: MercadoPagoValues) => {
        try {
            await api.patch("/companies/mercadopago", data);
            Swal.fire({
                icon: "success",
                title: "Configuración Guardada",
                text: "Credenciales de Mercado Pago actualizadas.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar la configuración de pago.", "error");
        }
    };

    const handleLogoutAll = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar todas las sesiones?",
            text: "Se cerrará la sesión en todos tus dispositivos activos.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, cerrar todas",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                await authService.logoutAll();
                logout();
                Swal.fire({
                    icon: "success",
                    title: "Sesiones cerradas",
                    text: "Has cerrado todas tus sesiones exitosamente. Serás redirigido al login.",
                    timer: 2000,
                    showConfirmButton: false
                });
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } catch (error: any) {
                Swal.fire("Error", error.response?.data?.message || "No se pudo cerrar las sesiones.", "error");
            }
        }
    };

    const handleChangePassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: "Cambiar Contraseña",
            html: `
                <div class="space-y-4 text-left">
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-500 uppercase">Contraseña Actual</label>
                        <input id="swal-input1" type="password" class="swal2-input !mt-1 !mb-2 !w-full" placeholder="Contraseña actual">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-500 uppercase">Nueva Contraseña</label>
                        <input id="swal-input2" type="password" class="swal2-input !mt-1 !mb-2 !w-full" placeholder="Nueva contraseña">
                    </div>
                    <div class="space-y-1">
                        <label class="text-xs font-bold text-slate-500 uppercase">Confirmar Contraseña</label>
                        <input id="swal-input3" type="password" class="swal2-input !mt-1 !w-full" placeholder="Confirmar contraseña">
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Actualizar Contraseña",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                const oldPassword = (document.getElementById("swal-input1") as HTMLInputElement).value;
                const newPassword = (document.getElementById("swal-input2") as HTMLInputElement).value;
                const confirmPassword = (document.getElementById("swal-input3") as HTMLInputElement).value;

                if (!oldPassword || !newPassword || !confirmPassword) {
                    Swal.showValidationMessage("Por favor completa todos los campos");
                    return false;
                }
                if (newPassword.length < 8) {
                    Swal.showValidationMessage("La nueva contraseña debe tener al menos 8 caracteres");
                    return false;
                }
                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage("Las contraseñas no coinciden");
                    return false;
                }
                return { oldPassword, newPassword, confirmPassword };
            }
        });

        if (formValues) {
            try {
                await authService.changePassword(formValues);
                Swal.fire({
                    icon: "success",
                    title: "¡Contraseña Actualizada!",
                    text: "Tu contraseña ha sido cambiada correctamente.",
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (error: any) {
                Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar la contraseña.", "error");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="text-primary" /> Configuración de Empresa
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Gestiona la información pública de tu veterinaria y tus integraciones de pago.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 shrink-0">
                    <button
                        onClick={() => setActiveTab("general")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "general"
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        <Building2 size={18} />
                        <span>Datos Generales</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("pago")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "pago"
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        <CreditCard size={18} />
                        <span>Pagos & MercadoPago</span>
                    </button>
                    <button
                        onClick={() => setActiveTab("seguridad")}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "seguridad"
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-50"
                            }`}
                    >
                        <Lock size={18} />
                        <span>Seguridad</span>
                    </button>
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                    {activeTab === "general" ? (
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Perfil de la Empresa</h2>
                                    <p className="text-sm text-slate-500">Información básica que verán tus clientes.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitGeneral(onUpdateGeneral)} className="space-y-8">
                                {/* Visual Identity Section */}
                                <div className="space-y-6">
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                        Identidad Visual
                                    </div>

                                    {/* Banner Upload */}
                                    <div className="relative group rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 h-48">
                                        {bannerPreview ? (
                                            <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                <ImageIcon size={48} strokeWidth={1} />
                                                <span className="text-sm mt-2">Banner de la veterinaria</span>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setBannerFile(file);
                                                        setBannerPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                            <div className="flex flex-col items-center text-white">
                                                <Camera size={24} className="mb-1" />
                                                <span className="text-sm font-bold">Cambiar Banner</span>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Logo Upload */}
                                    <div className="flex flex-col sm:flex-row items-center gap-6">
                                        <div className="relative group w-32 h-32 rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 shrink-0">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                    <Building2 size={32} strokeWidth={1} />
                                                </div>
                                            )}
                                            <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            setLogoFile(file);
                                                            setLogoPreview(URL.createObjectURL(file));
                                                        }
                                                    }}
                                                />
                                                <Camera size={20} className="text-white" />
                                            </label>
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white">Logo de la Veterinaria</h4>
                                            <p className="text-sm text-slate-500">Se recomienda una imagen cuadrada de al menos 400x400px.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
                                        Información de Contacto
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Nombre de la Veterinaria
                                        </label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("nombreComercial")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        {errorsGeneral.nombreComercial && <p className="text-xs text-red-500">{errorsGeneral.nombreComercial.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email de Contacto</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("emailContacto")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        {errorsGeneral.emailContacto && <p className="text-xs text-red-500">{errorsGeneral.emailContacto.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Teléfono</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("telefono")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        {errorsGeneral.telefono && <p className="text-xs text-red-500">{errorsGeneral.telefono.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tipo de Servicio</label>
                                        <div className="relative group">
                                            <Settings className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <select
                                                {...registerGeneral("tipoServicio")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white appearance-none"
                                            >
                                                <option value="VETERINARIA">Veterinaria / Clínica</option>
                                                <option value="PETSHOP">Pet Shop / Tienda</option>
                                                <option value="GROOMING">Peluquería / Grooming</option>
                                                <option value="HIBRIDO">Servicio Híbrido (Todo junto)</option>
                                                <option value="OTRO">Otros (Especificar)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {tipoServicio === "OTRO" && (
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Especificar Servicio</label>
                                            <input
                                                {...registerGeneral("tipoServicioOtro")}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white"
                                                placeholder="Ej: Guardería, Adiestramiento..."
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dirección Física</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("direccion")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none dark:text-white"
                                            />
                                        </div>
                                        {errorsGeneral.direccion && <p className="text-xs text-red-500">{errorsGeneral.direccion.message}</p>}
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ubicación en el Mapa</label>
                                        <p className="text-xs text-slate-500">Mueve el marcador o haz clic en el mapa para indicar dónde se encuentra tu local.</p>
                                        <MapPicker
                                            lat={latitud || 0}
                                            lng={longitud || 0}
                                            onChange={(lat, lng) => {
                                                setGeneralValue("latitud", lat);
                                                setGeneralValue("longitud", lng);
                                            }}
                                        />
                                        {(latitud && longitud) && (
                                            <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                                                <span>LAT: {latitud.toFixed(6)}</span>
                                                <span>LNG: {longitud.toFixed(6)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción / Historia</label>
                                    <textarea
                                        {...registerGeneral("descripcion")}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none h-32 dark:text-white"
                                        placeholder="Cuéntanos un poco sobre tu centro..."
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button disabled={isSaving} className="gap-2 px-10 h-12 rounded-2xl shadow-xl shadow-primary/20 font-bold transition-all active:scale-95">
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : activeTab === "seguridad" ? (
                        <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                                    <Lock size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Seguridad de la Cuenta</h2>
                                    <p className="text-sm text-slate-500">Protege tu cuenta y gestiona tus sesiones.</p>
                                </div>
                            </div>

                            <div className="space-y-8 max-w-2xl">
                                <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg">Contraseña</h3>
                                        <p className="text-sm text-slate-500">Actualiza tu contraseña regularmente para mayor seguridad.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleChangePassword}
                                        className="w-full sm:w-auto justify-between items-center group font-medium text-slate-700 dark:text-slate-300 rounded-xl px-6"
                                    >
                                        <span>Cambiar mi contraseña</span>
                                        <Settings size={16} className="text-slate-400 group-hover:text-primary transition-colors ml-4" />
                                    </Button>
                                </div>

                                <div className="p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-lg text-red-500">Cerrar Sesión Global</h3>
                                        <p className="text-sm text-slate-500 text-pretty">Si sospechas de actividad inusual, puedes cerrar todas las sesiones activas en otros dispositivos.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={handleLogoutAll}
                                        className="w-full sm:w-auto text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-950/20 rounded-xl"
                                    >
                                        Cerrar todas las sesiones
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl">
                                    <CreditCard size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Credenciales de Pago</h2>
                                    <p className="text-sm text-slate-500">Conecta tu cuenta de Mercado Pago para recibir pagos.</p>
                                </div>
                            </div>

                            {import.meta.env.VITE_MP_PUBLIC_KEY?.startsWith("TEST-") && (
                                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-4 rounded-2xl mb-6 flex gap-4 items-center">
                                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Modo Sandbox</span>
                                            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">Entorno de Pruebas Activo</span>
                                        </div>
                                        <p className="text-sm text-blue-600/80 dark:text-blue-300/80">
                                            Se detectaron credenciales de prueba. Puedes usar las tarjetas ficticias de Mercado Pago para simular pagos sin costo real.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-2xl mb-8 flex gap-4">
                                <ShieldCheck className="text-amber-600 dark:text-amber-500 shrink-0" size={24} />
                                <div className="text-sm text-amber-800 dark:text-amber-300">
                                    <p className="font-bold mb-1">Sobre la seguridad:</p>
                                    <p>Tus credenciales están encriptadas y solo se utilizan para procesar transacciones seguras a través de nuestra plataforma oficial.</p>
                                </div>
                            </div>

                            <div className="mb-10 p-6 bg-primary/5 rounded-3xl border border-primary/20">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Conexión Recomendada</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                    Vincular tu cuenta con un solo clic es el método más rápido y seguro.
                                </p>
                                <button
                                    onClick={() => {
                                        const clientId = import.meta.env.VITE_MP_CLIENT_ID || "TU_CLIENT_ID_AQUI";
                                        const redirectUri = window.location.origin + "/portal/empresa/oauth/mercadopago";

                                        // Usamos el dominio de Perú .com.pe y quitamos platform_id si está dando problemas
                                        const mpUrl = `https://auth.mercadopago.com.pe/authorization?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;

                                        window.location.href = mpUrl;
                                    }}
                                    className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                                >
                                    <CreditCard size={20} />
                                    Conectar con Mercado Pago
                                </button>
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white dark:bg-slate-900 px-2 text-slate-500">O configuración manual (Avanzado)</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmitMP(onUpdateMP)} className="space-y-6 max-w-2xl">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                                            Public Key
                                            <span className="text-[10px] text-slate-400 font-normal italic uppercase">Ej: TEST-... o APP_USR-...</span>
                                        </label>
                                        <input
                                            {...registerMP("mpPublicKey")}
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono text-sm"
                                            placeholder="TEST-XXX..."
                                        />
                                        {errorsMP.mpPublicKey && <p className="text-xs text-red-500">{errorsMP.mpPublicKey.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                                            Access Token
                                            <span className="text-[10px] text-slate-400 font-normal italic uppercase text-right">Tu token privado de seguridad</span>
                                        </label>
                                        <input
                                            {...registerMP("mpAccessToken")}
                                            type="password"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-mono text-sm"
                                            placeholder="TEST-XXX..."
                                        />
                                        {errorsMP.mpAccessToken && <p className="text-xs text-red-500">{errorsMP.mpAccessToken.message}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button disabled={isSubmittingMP} className="gap-2 px-8">
                                        {isSubmittingMP ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Actualizar Credenciales
                                    </Button>
                                </div>
                            </form>

                            <div className="mt-12 pt-12 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">¿Cómo obtener mis credenciales?</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Ingresa a Mercado Pago Developers y crea una aplicación.</p>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Ve a la sección 'Credenciales de producción' y copia tu Public Key y Access Token.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
