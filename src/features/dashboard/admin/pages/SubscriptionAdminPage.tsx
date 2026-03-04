import { useState, useEffect } from "react";
import {
    Shield,
    Plus,
    Settings2,
    Trash2,
    AlertTriangle,
    Package,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { subscriptionService } from "../../shared/subscriptions/services/subscriptionService";
import type { Plan } from "../../shared/subscriptions/types/subscription.types";
import { Button } from "../../../../components/ui/Button";
import Swal from "sweetalert2";

export const SubscriptionAdminPage = () => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const data = await subscriptionService.getPlans();
            setPlans(data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleToggleStatus = async (plan: Plan) => {
        const action = plan.activo ? 'desactivar' : 'activar';
        const result = await Swal.fire({
            title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} plan?`,
            text: `¿Estás seguro de que deseas ${action} el plan ${plan.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, continuar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await subscriptionService.togglePlanStatus(plan.id);
                Swal.fire({
                    title: '¡Éxito!',
                    text: `El plan ha sido ${plan.activo ? 'desactivado' : 'activado'} correctamente.`,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchPlans();
            } catch (error) {
                Swal.fire('Error', 'No se pudo cambiar el estado del plan.', 'error');
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <Shield className="text-primary" size={32} />
                        Gestión de Planes
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Configura los tiers de suscripción y límites del SaaS</p>
                </div>
                <Button className="rounded-2xl gap-2 font-bold shadow-lg shadow-primary/20 py-6 px-6 h-auto">
                    <Plus size={20} strokeWidth={3} />
                    Nuevo Plan
                </Button>
            </header>

            {/* KPI OverView */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard label="Planes Activos" value={plans.filter(p => p.activo).length} icon={<Shield className="text-emerald-500" />} />
                <KpiCard label="Total Planes" value={plans.length} icon={<Package className="text-blue-500" />} />
                <KpiCard label="Planes Inactivos" value={plans.filter(p => !p.activo).length} icon={<XCircle className="text-rose-500" />} />
                <KpiCard label="Alertas" value="0" icon={<AlertTriangle className="text-primary" />} />
            </div>

            {/* Plans Table */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Nombre del Plan</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Precio</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Límites</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6 h-20 bg-slate-50/50 dark:bg-slate-800/10" />
                                    </tr>
                                ))
                            ) : (
                                plans.map((plan) => (
                                    <tr key={plan.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white mb-0.5">{plan.nombre}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{plan.descripcion}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 font-black text-slate-900 dark:text-white">
                                            S/ {plan.precioMensual.toFixed(2)}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                    {plan.limiteMascotas === 0 ? 'Mascotas ∞' : `${plan.limiteMascotas} Mascotas`}
                                                </span>
                                                <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                                                    {plan.limiteProductos === 0 ? 'Productos ∞' : `${plan.limiteProductos} Productos`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-center">
                                                {plan.activo ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        <CheckCircle2 size={12} /> ACTIVO
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        <XCircle size={12} /> INACTIVO
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleToggleStatus(plan)}
                                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors rounded-xl"
                                                    title="Editar Plan"
                                                >
                                                    <Settings2 size={18} />
                                                </button>
                                                <button
                                                    className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors rounded-xl"
                                                    title="Eliminar Plan"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white space-y-4">
                    <h4 className="text-xl font-bold flex items-center gap-2">
                        <Settings2 className="text-primary" />
                        Límites por Defecto
                    </h4>
                    <p className="text-slate-400 text-sm">
                        Controla los parámetros globales aplicables a nuevas veterinarias registradas en la plataforma.
                    </p>
                    <div className="pt-4 flex gap-4">
                        <Button variant="outline" className="border-slate-700 text-slate-300 rounded-xl">Configurar Globales</Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 flex flex-col justify-center items-center text-center space-y-4">
                    <Plus size={48} className="text-slate-200 dark:text-slate-800" />
                    <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 dark:text-white">¿Crear una oferta flash?</h4>
                        <p className="text-xs text-slate-500">Crea cupones de descuento para planes específicos.</p>
                    </div>
                    <Button variant="outline" className="rounded-xl px-8">Crear Cupón</Button>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 group hover:border-primary/30 transition-all">
        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
        </div>
    </div>
);
