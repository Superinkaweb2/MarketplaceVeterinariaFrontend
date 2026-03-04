import {
  Users,
  Building2,
  Stethoscope,
  ShoppingBag,
  TrendingUp,
  Heart
} from "lucide-react";
import type { AdminStats } from "../types/admin.types";

interface StatsGridProps {
  stats: AdminStats | null;
  loading: boolean;
}

export const StatsGrid = ({ stats, loading }: StatsGridProps) => {
  const statCards = [
    {
      title: "Usuarios Totales",
      value: stats?.totalUsuarios ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      desc: "Registrados en la plataforma"
    },
    {
      title: "Empresas",
      value: stats?.totalEmpresas ?? 0,
      icon: Building2,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      desc: "Clínicas y Tiendas"
    },
    {
      title: "Veterinarios",
      value: stats?.totalVeterinarios ?? 0,
      icon: Stethoscope,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      desc: "Profesionales activos"
    },
    {
      title: "Ventas Globales",
      value: `S/ ${stats?.ingresosGlobales?.toLocaleString() ?? '0'}`,
      icon: ShoppingBag,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
      desc: "Ingresos por marketplace"
    },
    {
      title: "Servicios",
      value: stats?.totalServicios ?? 0,
      icon: TrendingUp,
      color: "text-cyan-600",
      bg: "bg-cyan-100 dark:bg-cyan-900/20",
      desc: "Servicios ofrecidos"
    },
    {
      title: "Adopciones",
      value: stats?.totalAdopciones ?? 0,
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-100 dark:bg-rose-900/20",
      desc: "Mascotas publicadas"
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
            <div className="h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
            <div className="h-8 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-md transition-all group"
        >
          <div className={`${stat.bg} ${stat.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
            <stat.icon size={24} />
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</h3>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">
            {stat.desc}
          </p>
        </div>
      ))}
    </div>
  );
};