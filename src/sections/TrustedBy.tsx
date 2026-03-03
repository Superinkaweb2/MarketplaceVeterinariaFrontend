import {
  PawPrint,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Activity,
  type LucideIcon,
} from "lucide-react";

interface TrustedLogo {
  icon: LucideIcon;
  name: string;
}

const LOGOS: TrustedLogo[] = [
  { icon: PawPrint, name: "PetCare+" },
  { icon: Stethoscope, name: "VetHealth" },
  { icon: HeartPulse, name: "Paws&Claws" },
  { icon: ShieldCheck, name: "SafePet" },
  { icon: Activity, name: "HeartVet" },
];

export const TrustedBy = () => {
  return (
    <section
      aria-label="Clínicas y empresas que confían en Huella360"
      className="w-full border-y border-[#e7ecf3] dark:border-slate-800 bg-white dark:bg-background-dark py-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col lg:flex-row items-center gap-10">
        {/* Texto de confianza */}
        <p className="text-xs md:text-sm font-bold text-[#4c6c9a] dark:text-slate-500 whitespace-nowrap tracking-widest uppercase">
          Más de 2.000 clínicas confían en nosotros
        </p>

        {/* Logos */}
        <ul
          role="list"
          aria-label="Empresas asociadas"
          className="flex flex-wrap justify-center lg:justify-between items-center flex-1 gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-700 list-none p-0 m-0"
        >
          {LOGOS.map((logo) => {
            const Icon = logo.icon;
            return (
              <li
                key={logo.name}
                className="flex items-center gap-2.5 font-bold text-lg md:text-xl text-slate-600 dark:text-slate-400 group cursor-default"
              >
                <Icon
                  size={24}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="group-hover:text-primary transition-colors"
                />
                <span className="tracking-tight">{logo.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};