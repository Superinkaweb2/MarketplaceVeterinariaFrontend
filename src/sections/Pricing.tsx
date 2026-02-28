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

  const handleStart = () => {
    navigate("/register");
  };

  return (
    <section
      aria-labelledby="pricing-heading"
      className="w-full bg-background-dark text-white py-24 relative overflow-hidden"
    >
      {/* Glows decorativos */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        {/* Encabezado */}
        <div className="text-center mb-16 space-y-4">
          <h2
            id="pricing-heading"
            className="text-4xl md:text-6xl font-black tracking-tighter"
          >
            Planes <span className="text-primary">Simples</span> y Transparentes
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Elige el plan que mejor se adapta a tu clínica. Diseñados para escalar junto a tu negocio, desde clínicas independientes hasta redes hospitalarias.
          </p>
        </div>

        {/* Loading State or Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[500px] bg-slate-800/30 rounded-3xl animate-pulse border border-slate-700/50" />
            ))
          ) : (
            plans?.map((plan) => {
              const isPro = plan.nombre.toLowerCase().includes('pro');
              const isPremium = plan.nombre.toLowerCase().includes('premium');

              const icons = {
                'básico': <Shield className="text-blue-400" size={32} />,
                'pro': <Zap className="text-amber-400" size={32} />,
                'premium': <Crown className="text-primary" size={32} />,
              };

              const planIcon = icons[plan.nombre.toLowerCase() as keyof typeof icons] || <Shield size={32} />;

              return (
                <article
                  key={plan.id}
                  role="listitem"
                  aria-label={`Plan ${plan.nombre}`}
                  className={`relative group rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 flex flex-col ${isPro
                    ? "bg-slate-900 border-primary/50 shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-105 z-10"
                    : "bg-slate-800/40 backdrop-blur-xl border-slate-700/50 hover:bg-slate-800/60"
                    }`}
                >
                  {isPro && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-full shadow-xl">
                      Más Popular
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      {planIcon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-2">{plan.nombre}</h3>
                  <p className="text-slate-400 text-sm mb-10 min-h-[40px]">
                    {plan.descripcion}
                  </p>

                  <div className="flex items-baseline gap-1 mb-10">
                    <span className="text-5xl font-black tracking-tighter">S/ {plan.precioMensual}</span>
                    <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">/mes</span>
                  </div>

                  <hr className="border-white/5 mb-10" />

                  <ul className="space-y-5 mb-12 flex-1">
                    <FeatureItem text={`${plan.limiteMascotas === 0 ? 'Mascotas Ilimitadas' : `Hasta ${plan.limiteMascotas} Mascotas`}`} included={true} isFeatured={isPro} />
                    <FeatureItem text={`${plan.limiteProductos === 0 ? 'Productos Ilimitados' : `Hasta ${plan.limiteProductos} Productos`}`} included={true} isFeatured={isPro} />
                    <FeatureItem text="Gestión de Citas" included={true} isFeatured={isPro} />
                    <FeatureItem text="Facturación Digital" included={isPro || isPremium} isFeatured={isPro} />
                    <FeatureItem text="Reportes Pro" included={isPro || isPremium} isFeatured={isPro} />
                    <FeatureItem text="Soporte VIP 24/7" included={isPremium} isFeatured={isPro} />
                  </ul>

                  <Button
                    variant={isPro ? "primary" : "outline"}
                    onClick={handleStart}
                    className={`w-full py-7 rounded-2xl font-black uppercase tracking-widest text-xs h-auto shadow-2xl transition-all transform hover:scale-[1.02] ${isPro ? "shadow-primary/30" : "border-slate-700 hover:border-slate-500"
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

const FeatureItem = ({ text, included, isFeatured }: { text: string, included: boolean, isFeatured: boolean }) => (
  <li className={`flex items-center gap-4 text-sm font-semibold transition-colors ${included ? (isFeatured ? "text-white" : "text-slate-200") : "text-slate-600"}`}>
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${included
      ? (isFeatured ? "bg-white/20 text-white" : "bg-primary/10 text-primary")
      : "bg-slate-800/50 text-slate-700"
      }`}>
      {included ? <Check size={14} strokeWidth={4} /> : <X size={14} />}
    </div>
    <span className={included ? "" : "line-through opacity-50"}>{text}</span>
  </li>
);

