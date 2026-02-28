import { Card } from "./ui/Card";
import * as LucideIcons from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isIncrease: boolean;
  icon: keyof typeof LucideIcons;
  colorClass: string;
  bgClass: string;
}

const StatItem = ({
  title,
  value,
  change,
  isIncrease,
  icon,
  colorClass,
  bgClass,
}: StatCardProps) => {
  const DynamicIcon = LucideIcons[icon] as React.ElementType;

  return (
    <Card className="relative overflow-hidden group p-4 sm:p-6 hover:shadow-lg hover:-translate-y-1 border-gray-100 dark:border-gray-800">
      {/* Decoración de fondo sutil (UX visual) */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 opacity-[0.03] dark:opacity-[0.05] group-hover:scale-125 ${colorClass}`}>
         {DynamicIcon && <DynamicIcon size={96} />}
      </div>

      <div className="relative flex flex-row sm:flex-col lg:flex-row items-center sm:items-start lg:items-center gap-4">
        {/* Icono: Tamaño adaptable */}
        <div className={`shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${bgClass} shadow-inner`}>
          {DynamicIcon && <DynamicIcon className={`${colorClass}`} size={28} />}
        </div>

        {/* Información: Alineación inteligente */}
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
            {title}
          </p>
          <div className="flex items-baseline flex-wrap gap-x-2">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-none">
              {value}
            </h3>
            
            <div
              className={`inline-flex items-center text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full mt-1 sm:mt-0 ${
                isIncrease 
                  ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                  : "bg-red-100/50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              }`}
            >
              {isIncrease ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
              {change}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const StatsGrid = () => {
  return (
    <section className="w-full">
      {/* Grid Dinámico: 1 col en móvil pequeño, 2 en mobile-wide/tablet, 4 en desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatItem
          title="Usuarios"
          value="12,450"
          change="+12.5%"
          isIncrease={true}
          icon="Users"
          colorClass="text-primary"
          bgClass="bg-primary/10"
        />
        <StatItem
          title="Vets"
          value="842"
          change="+3.2%"
          isIncrease={true}
          icon="Stethoscope"
          colorClass="text-emerald-500"
          bgClass="bg-emerald-500/10"
        />
        <StatItem
          title="Citas"
          value="3,210"
          change="-2.4%"
          isIncrease={false}
          icon="Calendar"
          colorClass="text-indigo-500"
          bgClass="bg-indigo-500/10"
        />
        <StatItem
          title="Ingresos"
          value="$45k"
          change="+18%"
          isIncrease={true}
          icon="DollarSign"
          colorClass="text-amber-500"
          bgClass="bg-amber-500/10"
        />
      </div>
    </section>
  );
};