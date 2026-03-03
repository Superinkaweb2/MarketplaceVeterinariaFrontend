import { useState, useEffect } from "react";
import { Check, X, Shield, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { subscriptionService } from "../features/dashboard/shared/subscriptions/services/subscriptionService";
import type { Plan } from "../features/dashboard/shared/subscriptions/types/subscription.types";
import { Button } from "../components/ui/Button";

export const Pricing = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await subscriptionService.getPlans();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleStart = (planName: string) => {
    navigate(`/register?plan=${encodeURIComponent(planName)}`);
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      // Fondo azul oscuro del diseño HTML original
      className="w-full py-24 bg-secondary text-white relative overflow-hidden"
    >
      {/* Glows decorativos del HTML */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Encabezado adaptado al HTML */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2
            id="pricing-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Precios Simples y Transparentes
          </h2>
          <p className="text-blue-100 text-lg">
            Elige el plan que mejor se adapte al tamaño y necesidades de tu práctica.
          </p>
        </div>

        {/* Grid de Planes */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto" role="list">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[500px] bg-white/10 rounded-xl animate-pulse" />
            ))
          ) : (
            plans?.map((plan) => {
              const isPro = plan.nombre.toLowerCase().includes('pro');
              const isPremium = plan.nombre.toLowerCase().includes('premium');

              const icons = {
                'básico': <Shield size={28} />,
                'pro': <Zap size={28} />,
                'premium': <Crown size={28} />,
              };

              const planIcon = icons[plan.nombre.toLowerCase() as keyof typeof icons] || <Shield size={28} />;

              return (
                <article
                  key={plan.id}
                  role="listitem"
                  aria-label={`Plan ${plan.nombre}`}
                  // Lógica visual: Si es Pro, usa la tarjeta verde elevada. Si no, usa la tarjeta blanca.
                  className={`relative group rounded-xl p-8 flex flex-col transition-all duration-300 shadow-xl ${isPro
                    ? "bg-primary text-white border-4 border-primary-light/50 transform lg:-translate-y-4 z-10"
                    : "bg-white text-slate-800 dark:bg-surface-dark dark:text-slate-200 border border-transparent"
                    }`}
                >
                  {isPro && (
                    <div className="absolute top-0 right-0 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                      POPULAR
                    </div>
                  )}

                  <div className="mb-6">
                    {/* Contenedor del icono que tenías, adaptado a los colores de la tarjeta */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${isPro ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
                      }`}>
                      {planIcon}
                    </div>

                    <h3 className={`text-2xl font-bold mb-2 ${isPro ? "" : "text-secondary dark:text-white"}`}>
                      {plan.nombre}
                    </h3>
                    <p className={`text-sm min-h-[40px] ${isPro ? "text-white/80" : "text-slate-500"}`}>
                      {plan.descripcion}
                    </p>
                  </div>

                  {/* Precios */}
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className={`text-4xl font-bold ${isPro ? "" : "text-secondary dark:text-white"}`}>
                      S/ {plan.precioMensual}
                    </span>
                    <span className={`font-bold uppercase text-[10px] tracking-widest ${isPro ? "text-white/80" : "text-slate-400"}`}>
                      /mes
                    </span>
                  </div>

                  <hr className={`mb-8 ${isPro ? "border-white/20" : "border-slate-100 dark:border-slate-800"}`} />

                  {/* Lista de Features usando tu componente interno */}
                  <ul className="space-y-4 mb-10 flex-1">
                    <FeatureItem text={`${plan.limiteMascotas === 0 ? 'Mascotas Ilimitadas' : `Hasta ${plan.limiteMascotas} Mascotas`}`} included={true} isFeatured={isPro} />
                    <FeatureItem text={`${plan.limiteProductos === 0 ? 'Productos Ilimitados' : `Hasta ${plan.limiteProductos} Productos`}`} included={true} isFeatured={isPro} />
                    <FeatureItem text="Gestión de Citas" included={true} isFeatured={isPro} />
                    <FeatureItem text="Facturación Digital" included={isPro || isPremium} isFeatured={isPro} />
                    <FeatureItem text="Reportes Pro" included={isPro || isPremium} isFeatured={isPro} />
                    <FeatureItem text="Soporte VIP 24/7" included={isPremium} isFeatured={isPro} />
                  </ul>

                  {/* Tu componente Button con clases para simular el HTML */}
                  <Button
                    variant={isPro ? "secondary" : "outline"} // Ajusta la variante según soporte tu UI
                    onClick={() => handleStart(plan.nombre)}
                    className={`w-full py-4 rounded-lg font-bold text-sm h-auto transition-all ${isPro
                      ? "bg-white text-primary hover:bg-slate-50 shadow-lg"
                      : "border-2 border-primary text-primary hover:bg-primary hover:text-white"
                      }`}
                  >
                    Comenzar Ahora
                  </Button>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

// Tu FeatureItem restaurado y adaptado para que se vea bien en fondos blancos y verdes
const FeatureItem = ({ text, included, isFeatured }: { text: string, included: boolean, isFeatured: boolean }) => (
  <li className={`flex items-center gap-4 text-sm font-semibold transition-colors ${included
    ? (isFeatured ? "text-white" : "text-slate-700 dark:text-slate-200")
    : (isFeatured ? "text-white/50" : "text-slate-400")
    }`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${included
      ? (isFeatured ? "bg-white/20 text-white" : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400")
      : (isFeatured ? "bg-black/10 text-white/40" : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500")
      }`}>
      {included ? <Check size={14} strokeWidth={4} /> : <X size={14} />}
    </div>
    <span className={included ? "" : "line-through opacity-50"}>{text}</span>
  </li>
);