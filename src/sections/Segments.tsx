import {
  PawPrint,
  Stethoscope,
  Store,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface Segment {
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  href: string;
  featured?: boolean;
}

const SEGMENTS: Segment[] = [
  {
    icon: PawPrint,
    title: "Para dueños de mascotas",
    description:
      "Centraliza todas las historias clínicas de tu mascota en un solo lugar. Reserva citas al instante y recibe recordatorios de vacunas y controles.",
    cta: "Saber más",
    href: "#duenos",
  },
  {
    icon: Stethoscope,
    title: "Para veterinarios",
    description:
      "Sistema de gestión clínica integral (PMS). Administra pacientes, expedientes clínicos electrónicos y recetas desde un único panel.",
    cta: "Ver funcionalidades",
    href: "#veterinarios",
    featured: true,
  },
  {
    icon: Store,
    title: "Para negocios y proveedores",
    description:
      "Amplía tu alcance. Publica tus productos en nuestro marketplace integrado y gestiona tu inventario en tiempo real.",
    cta: "Empieza a vender",
    href: "#negocios",
  },
];

export const Segments = () => {
  return (
    <section
      aria-labelledby="segments-heading"
      className="w-full max-w-7xl mx-auto px-4 md:px-10 py-20"
    >
      {/* Encabezado */}
      <div className="flex flex-col gap-4 mb-12 text-center items-center">
        <h2
          id="segments-heading"
          className="text-[#0d131b] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight"
        >
          Diseñado para cada perfil veterinario
        </h2>
        <p className="text-[#4c6c9a] dark:text-slate-400 text-lg font-normal leading-normal max-w-2xl">
          Ya seas dueño de mascota, veterinario o proveedor, VetSaaS cuenta con
          las herramientas específicas que necesitas para tener éxito.
        </p>
      </div>

      {/* Grid de Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none p-0 m-0">
        {SEGMENTS.map((segment) => {
          const Icon = segment.icon;
          return (
            <li key={segment.title}>
              <article className="group flex flex-col gap-4 rounded-xl border border-[#cfd9e7] dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-xl hover:border-primary/50 transition-all duration-300 h-full relative overflow-hidden">
                {segment.featured && (
                  <span
                    aria-label="Más popular"
                    className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider"
                  >
                    Más popular
                  </span>
                )}

                <div
                  aria-hidden="true"
                  className="size-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                >
                  <Icon size={28} />
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d131b] dark:text-white text-xl font-bold">
                    {segment.title}
                  </h3>
                  <p className="text-[#4c6c9a] dark:text-slate-400 text-sm leading-relaxed">
                    {segment.description}
                  </p>
                </div>

                <a
                  href={segment.href}
                  aria-label={`${segment.cta} — ${segment.title}`}
                  className="mt-auto pt-4 text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  {segment.cta}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
