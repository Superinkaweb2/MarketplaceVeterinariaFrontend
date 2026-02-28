import { User, Settings, Save, ShieldCheck, Bell, Lock } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useAuth } from "../../../auth/context/useAuth";
import Swal from "sweetalert2";

export const ClienteConfigPage = () => {
    const auth = useAuth();

    const handleSave = () => {
        Swal.fire({
            icon: "info",
            title: "Configuración",
            text: "Los ajustes del cliente se guardarán próximamente.",
            timer: 2000,
            showConfirmButton: false,
        });
    };

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="text-primary" /> Mi Configuración
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Administra tus preferencias de cuenta y notificaciones.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <User size={48} />
                            </div>
                            <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-primary transition-colors">
                                <Settings size={16} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{auth?.nombre || "Usuario"}</h2>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white"></h2>
                        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-center gap-4">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Rol</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cliente</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Estado</p>
                                <p className="text-sm font-semibold text-emerald-500">Activo</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-500/20">
                        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400 mb-2">
                            <ShieldCheck size={20} />
                            <h3 className="font-bold">Tu Privacidad</h3>
                        </div>
                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80 leading-relaxed">
                            Tu información personal está protegida. Nunca compartimos tus datos con terceros sin tu consentimiento explícito.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                            <Bell size={18} className="text-primary" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Notificaciones</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">Alertas de Adopción</p>
                                    <p className="text-xs text-slate-500">Recibe avisos cuando Pets similares a tus intereses se publiquen.</p>
                                </div>
                                <div className="h-6 w-11 bg-primary rounded-full relative">
                                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">Resumen Semanal</p>
                                    <p className="text-xs text-slate-500">Un resumen de la actividad de tus mascotas y novedades.</p>
                                </div>
                                <div className="h-6 w-11 bg-slate-200 dark:bg-slate-700 rounded-full relative">
                                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                            <Lock size={18} className="text-primary" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Seguridad</h3>
                        </div>
                        <div className="p-6">
                            <Button variant="outline" className="w-full justify-between items-center group font-medium text-slate-700 dark:text-slate-300">
                                <span>Cambiar mi contraseña</span>
                                <Settings size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} className="gap-2 px-8">
                            <Save size={18} />
                            Guardar Preferencias
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
