import { PlayCircle, CheckCircle2, ArrowRight} from "lucide-react";
import { Button } from "../components/ui/Button";

const TRUST_BADGES = [
  {label: "Cumple con normativas de privacidad" },
  {label: "14 días gratis, sin tarjeta" },
] as const;

export const Hero = () => {
  return (
    <section
      aria-label="Sección principal de VetSaaS"
      className="w-full max-w-7xl mx-auto px-4 md:px-10 py-12 md:py-20 overflow-hidden"
    >
      <div className="@container">
        <div className="flex flex-col-reverse gap-10 md:gap-16 lg:flex-row items-center">

          {/* ── Lado Izquierdo: Contenido ── */}
          <div className="flex flex-col gap-8 flex-1 text-center lg:text-left">
            <div className="flex flex-col gap-4">

              {/* Eyebrow: keyword visible para SEO on-page */}
              <p className="text-primary font-bold text-sm tracking-widest uppercase inline-block m-0">
                Software veterinario todo en uno
              </p>

              {/* H1: única por página, con keyword principal */}
              <h1 className="text-[#0d131b] dark:text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                La plataforma integral para{" "}
                <span className="text-primary">clínicas veterinarias modernas</span>
              </h1>

              {/* Párrafo descriptivo: amplía las keywords naturalmente */}
              <p className="text-[#4c6c9a] dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Gestiona tu clínica veterinaria, las historias clínicas de tus
                pacientes y haz crecer tu negocio con nuestro ecosistema integrado
                de marketplace y herramientas profesionales.
              </p>
            </div>

            {/* CTA principal + secundario */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                aria-label="Comenzar prueba gratuita de VetSaaS por 14 días"
                className="h-14 px-8 text-base font-bold rounded-xl group transition-all"
              >
                <span>Comenzar gratis</span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>

              <Button
                variant="outline"
                aria-label="Ver demostración de VetSaaS"
                className="h-14 px-8 text-base font-semibold rounded-xl border-2"
              >
                <span className="flex items-center gap-2">
                  <PlayCircle size={20} aria-hidden="true" className="text-primary" />
                  Ver demostración
                </span>
              </Button>
            </div>

            {/* Trust badges */}
            <ul
              role="list"
              aria-label="Garantías de VetSaaS"
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 pt-2 text-sm font-medium text-[#4c6c9a] dark:text-slate-500 list-none p-0 m-0"
            >
              {TRUST_BADGES.map(({ label }) => (
                <li key={label} className="flex items-center gap-2">
                  <CheckCircle2 size={18} aria-hidden="true" className="text-emerald-500 shrink-0" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Lado Derecho: Visual ── */}
          <div className="w-full flex-1 relative group">
            {/* Glow decorativo */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 bg-linear-to-r from-primary/30 to-blue-400/20 dark:from-primary/10 dark:to-blue-900/10 rounded-4xl blur-3xl opacity-60 group-hover:opacity-100 transition duration-1000"
            />

            {/* Imagen principal con aspect-ratio fijo para evitar CLS */}
            <div className="relative w-full aspect-square sm:aspect-video lg:aspect-4/3 rounded-4xl overflow-hidden shadow-2xl bg-slate-200 border-4 border-white dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200"
                alt="Veterinario profesional usando VetSaaS en su tablet para gestionar la clínica"
                width={1200}
                height={900}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover transform transition duration-1000 group-hover:scale-105"
              />

              {/* Ring inset decorativo */}
              <div aria-hidden="true" className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-4xl" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};