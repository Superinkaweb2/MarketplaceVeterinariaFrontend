import { useState, useEffect } from "react";
import {
    Check,
    AlertCircle,
    Crown,
    Smartphone,
    Package,
    ShieldCheck,
    Clock
} from "lucide-react";
import { subscriptionService } from "../../shared/subscriptions/services/subscriptionService";
import type { Plan, Suscripcion, SubscriptionUsage } from "../../shared/subscriptions/types/subscription.types";
import { Button } from "../../../../components/ui/Button";
import { useAuth } from "../../../../features/auth/context/useAuth";

import Swal from "sweetalert2";

export const MySubscriptionPage = () => {
    const { empresaId } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [mySub, setMySub] = useState<Suscripcion | null>(null);
    const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchSubscriptionData = async () => {
        try {
            setLoading(true);

            // Fetch everything based on session token
            const [allPlansResult, mySubResult, usageResult] = await Promise.allSettled([
                subscriptionService.getPlans(),
                subscriptionService.getMySubscription(),
                subscriptionService.getUsageMetrics()
            ]);

            if (allPlansResult.status === 'fulfilled') setPlans(allPlansResult.value);
            if (mySubResult.status === 'fulfilled') setMySub(mySubResult.value);
            if (usageResult.status === 'fulfilled') setUsage(usageResult.value);

            if (allPlansResult.status === 'rejected') console.error("Error loading plans:", allPlansResult.reason);
            if (mySubResult.status === 'rejected') console.error("Error loading current sub:", mySubResult.reason);
            if (usageResult.status === 'rejected') console.error("Error loading metrics:", usageResult.reason);

        } catch (error) {
            console.error("Critical error loading subscription data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscriptionData();

        // Si regresamos de un pago exitoso, refrescar periódicamente hasta que el backend procese el webhook
        const queryParams = new URLSearchParams(window.location.search);
        if (queryParams.get('payment') === 'success' || queryParams.get('status') === 'approved') {
            const interval = setInterval(fetchSubscriptionData, 3000);
            const timeout = setTimeout(() => clearInterval(interval), 15000); // Parar después de 15 segundos
            return () => {
                clearInterval(interval);
                clearTimeout(timeout);
            };
        }
    }, [empresaId]);


    const loadMercadoPago = () => {
        return new Promise<any>((resolve) => {
            if (window.MercadoPago) {
                resolve(window.MercadoPago);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.onload = () => resolve(window.MercadoPago);
            document.body.appendChild(script);
        });
    };

    const handleUpgrade = async (plan: Plan) => {
        if (!mySub || mySub.plan.id === plan.id) return;

        const isFree = plan.precioMensual === 0;

        const result = await Swal.fire({
            title: isFree ? `¿Cambiar al plan ${plan.nombre}?` : `¿Suscribirse al plan ${plan.nombre}?`,
            text: isFree
                ? `Se actualizarán tus límites a ${plan.limiteMascotas === 0 ? 'Ilimitadas' : plan.limiteMascotas} mascotas.`
                : `Serás redirigido a la pasarela de pagos para completar la suscripción de S/ ${plan.precioMensual}/mes.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: isFree ? 'Sí, cambiar' : 'Ir a pagar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#fe5c3c'
        });

        if (result.isConfirmed) {
            try {
                if (isFree) {
                    await subscriptionService.updatePlan(mySub.empresaId || empresaId!, plan.id);
                    Swal.fire({
                        title: '¡Plan Actualizado!',
                        text: 'Has vuelto al plan gratuito correctamente.',
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    fetchSubscriptionData();
                } else {
                    // Flujo de Pago Real
                    Swal.fire({
                        title: 'Procesando...',
                        text: 'Estamos generando tu enlace de pago.',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // 1. Obtener preferencia de pago
                    const { preferenceId } = await subscriptionService.createSubscriptionCheckout(plan.id);

                    // 2. Cargar MP y abrir checkout
                    await loadMercadoPago();

                    const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

                    if (!MP_PUBLIC_KEY) {
                        Swal.fire({
                            title: 'Configuración Incompleta',
                            text: 'No se ha configurado la clave pública de Mercado Pago (VITE_MP_PUBLIC_KEY) en el archivo .env.local',
                            icon: 'warning'
                        });
                        return;
                    }

                    const mp = new window.MercadoPago(MP_PUBLIC_KEY, {
                        locale: 'es-PE'
                    });

                    mp.checkout({
                        preference: {
                            id: preferenceId
                        },
                        autoOpen: true
                    });

                    Swal.close();
                }
            } catch (error) {
                console.error("Error en checkout:", error);
                Swal.fire('Error', 'No se pudo procesar el pago. Verifica tus credenciales de Mercado Pago.', 'error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Cargando suscripción...</p>
                </div>
            </div>
        );
    }

    return (
        // [MODIFICADO] Añadido contenedor flex-1 y overflow-y-auto para permitir el scroll
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Mi Suscripción</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Controla tu plan actual, gestiona tus límites y descubre nuevas funciones para potenciar tu veterinaria.
                    </p>
                </header>

                {/* Current Plan Card */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-primary/5 overflow-hidden">
                    <div className="bg-gradient-to-br from-primary via-orange-500 to-primary-dark p-8 md:p-12 text-white relative overflow-hidden">
                        {/* Decorative shapes */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-[2rem] flex items-center justify-center border border-white/30 shadow-2xl">
                                    <Crown size={40} className="text-white drop-shadow-lg" />
                                </div>
                                <div>
                                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest mb-2 border border-white/20">
                                        Plan Activo
                                    </span>
                                    <h2 className="text-4xl md:text-5xl font-black">{mySub?.plan.nombre}</h2>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-end gap-1">
                                <p className="text-white/70 text-sm font-medium">Estado de la suscripción</p>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                    <span className="text-lg font-bold uppercase tracking-tighter">{mySub?.estado}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            icon={<Smartphone size={24} />}
                            label="Mascotas"
                            value={usage ? `${usage.currentPets} / ${usage.maxPets === 0 ? '∞' : usage.maxPets}` : '-'}
                            percentage={usage?.maxPets === 0 ? undefined : usage?.petPercentage}
                            color="blue"
                        />
                        <StatCard
                            icon={<Package size={24} />}
                            label="Productos"
                            value={usage ? `${usage.currentProducts} / ${usage.maxProducts === 0 ? '∞' : usage.maxProducts}` : '-'}
                            percentage={usage?.maxProducts === 0 ? undefined : usage?.productPercentage}
                            color="emerald"
                        />
                        <StatCard
                            icon={<Clock size={24} />}
                            label="Ciclo"
                            value="Mensual"
                            color="purple"
                        />
                        <StatCard
                            icon={<ShieldCheck size={24} />}
                            label="Seguridad"
                            value="Protegida"
                            color="amber"
                        />
                    </div>
                </div>

                {/* Available Plans Grid */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white px-2">Explora nuestros planes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-4">
                        {plans.map((plan) => {
                            const isCurrent = mySub?.plan.id === plan.id;
                            const isPro = plan.nombre.toLowerCase().includes('pro');
                            const isPremium = plan.nombre.toLowerCase().includes('premium');

                            return (
                                <div
                                    key={plan.id}
                                    className={`group relative rounded-[2.5rem] p-8 md:p-10 border transition-all duration-300 flex flex-col ${isCurrent
                                        ? 'border-primary ring-4 ring-primary/5 bg-primary/[0.02] dark:bg-primary/[0.05]'
                                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                                        }`}
                                >
                                    {isCurrent && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
                                            Tu Plan
                                        </div>
                                    )}

                                    <div className="mb-8">
                                        <h3 className={`text-2xl font-black mb-3 ${isCurrent ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                                            {plan.nombre}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                            {plan.descripcion}
                                        </p>
                                    </div>

                                    <div className="mb-10 flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">S/ {plan.precioMensual.toFixed(0)}</span>
                                        <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">/mes</span>
                                    </div>

                                    <div className="space-y-5 mb-12 flex-1">
                                        <FeatureItem text={plan.limiteMascotas === 0 ? 'Mascotas Ilimitadas' : `Hasta ${plan.limiteMascotas} mascotas`} />
                                        <FeatureItem text={plan.limiteProductos === 0 ? 'Productos Ilimitados' : `Hasta ${plan.limiteProductos} productos`} />
                                        <FeatureItem text="Gestión de Citas" />
                                        {(isPro || isPremium) && <FeatureItem text="Reportes Avanzados" />}
                                        {isPremium && <FeatureItem text="Soporte VIP 24/7" />}
                                    </div>

                                    <Button
                                        variant={isCurrent ? 'outline' : 'primary'}
                                        disabled={isCurrent}
                                        onClick={() => handleUpgrade(plan)}
                                        className={`w-full py-6 rounded-2xl font-black shadow-lg transition-all transform group-hover:scale-[1.02] h-auto text-sm uppercase tracking-widest ${isCurrent ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : ''
                                            }`}
                                    >
                                        {isCurrent ? 'Plan Actual' : 'Subir de Nivel'}
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Support Banner */}
                <div className="bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left border border-white/5 shadow-2xl">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
                        <AlertCircle size={32} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <h4 className="text-xl font-bold text-white">¿Necesitas algo más grande?</h4>
                        <p className="text-slate-400 max-w-xl">
                            Para cadenas de hospitales o funcionalidades a medida, ofrecemos planes Enterprise con asistencia personalizada.
                        </p>
                    </div>
                    <Button variant="outline" className="shrink-0 border-slate-700 text-slate-300 hover:bg-slate-800 px-8 py-6 rounded-2xl font-bold border-2">
                        Contactar Ventas
                    </Button>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, color, percentage }: { icon: React.ReactNode, label: string, value: string | number, color: string, percentage?: number }) => {
    const colors = {
        blue: {
            bg: "bg-blue-50 dark:bg-blue-500/10 text-blue-500",
            bar: "bg-blue-500"
        },
        emerald: {
            bg: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500",
            bar: "bg-emerald-500"
        },
        purple: {
            bg: "bg-purple-50 dark:bg-purple-500/10 text-purple-500",
            bar: "bg-purple-500"
        },
        amber: {
            bg: "bg-amber-50 dark:bg-amber-500/10 text-amber-500",
            bar: "bg-amber-500"
        },
    };

    const colorConfig = colors[color as keyof typeof colors];

    return (
        <div className="flex flex-col gap-4 p-4 rounded-3xl transition-all border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <div className="flex items-center gap-5 group">
                <div className={`p-4 rounded-2xl ${colorConfig.bg} transition-transform duration-300 group-hover:scale-110 shadow-sm border border-transparent`}>
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h4>
                </div>
            </div>
            {percentage !== undefined && (
                <div className="space-y-2">
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${colorConfig.bar} transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 text-right">{percentage.toFixed(0)}% utilizado</p>
                </div>
            )}
        </div>
    );
};

const FeatureItem = ({ text }: { text: string }) => (
    <div className="flex items-center gap-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <Check size={14} strokeWidth={4} />
        </div>
        <span>{text}</span>
    </div>
);