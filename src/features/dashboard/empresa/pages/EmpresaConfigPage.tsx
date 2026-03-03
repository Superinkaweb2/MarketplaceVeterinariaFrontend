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
    AlertCircle
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../shared/http/api";
import Swal from "sweetalert2";

const generalDataSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(7, "Teléfono inválido"),
    direccion: z.string().min(5, "La dirección es muy corta"),
    descripcion: z.string().optional(),
});

type GeneralDataValues = z.infer<typeof generalDataSchema>;

const mercadopagoSchema = z.object({
    mpPublicKey: z.string().min(10, "Public Key inválida"),
    mpAccessToken: z.string().min(10, "Access Token inválido"),
});

type MercadoPagoValues = z.infer<typeof mercadopagoSchema>;

export const EmpresaConfigPage = () => {
    const [activeTab, setActiveTab] = useState<"general" | "pago">("general");
    const [isLoading, setIsLoading] = useState(true);

    const {
        register: registerGeneral,
        handleSubmit: handleSubmitGeneral,
        reset: resetGeneral,
        formState: { errors: errorsGeneral, isSubmitting: isSubmittingGeneral },
    } = useForm<GeneralDataValues>({
        resolver: zodResolver(generalDataSchema),
    });

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
            resetGeneral({
                nombre: data.nombre,
                email: data.email,
                telefono: data.telefono,
                direccion: data.direccion,
                descripcion: data.descripcion || "",
            });
        } catch (error) {
            console.error("Error al cargar datos de empresa:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdateGeneral = async (data: GeneralDataValues) => {
        try {
            const formData = new FormData();
            // El backend espera el objeto DTO en una parte llamada "data" como JSON
            formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));

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
        } catch (error) {
            console.error("Error al actualizar empresa:", error);
            Swal.fire("Error", "No se pudieron guardar los cambios.", "error");
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

                            <form onSubmit={handleSubmitGeneral(onUpdateGeneral)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Nombre de la Veterinaria
                                        </label>
                                        <div className="relative group">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("nombre")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        {errorsGeneral.nombre && <p className="text-xs text-red-500">{errorsGeneral.nombre.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email de Contacto</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("email")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        {errorsGeneral.email && <p className="text-xs text-red-500">{errorsGeneral.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Teléfono</label>
                                        <div className="relative group">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("telefono")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        {errorsGeneral.telefono && <p className="text-xs text-red-500">{errorsGeneral.telefono.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dirección Física</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                {...registerGeneral("direccion")}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                            />
                                        </div>
                                        {errorsGeneral.direccion && <p className="text-xs text-red-500">{errorsGeneral.direccion.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción / Historia</label>
                                    <textarea
                                        {...registerGeneral("descripcion")}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none h-32"
                                        placeholder="Cuéntanos un poco sobre tu centro..."
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button disabled={isSubmittingGeneral} className="gap-2 px-8">
                                        {isSubmittingGeneral ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                        Guardar Cambios
                                    </Button>
                                </div>
                            </form>
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
                                        // Usamos el dominio global .com para mayor compatibilidad
                                        const mpUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirectUri)}`;
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
