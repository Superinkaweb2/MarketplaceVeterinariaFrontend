import { useEffect, useState } from "react";
import { StatsGrid } from "../components/StatsGrid";
import { ActivityTable } from "../components/ActivityTable";
import { FileDown, UserPlus, BarChart3, LineChart } from "lucide-react";
import { adminService } from "../services/adminService";
import type { AdminStats } from "../types/admin.types";

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Vista global de la plataforma <span className="text-primary font-medium">VetSaaS</span>.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-surface-darker">
            <FileDown size={18} className="mr-2 opacity-70" />
            Exportar
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-primary hover:bg-primary-dark transition-all active:scale-95">
            <UserPlus size={18} className="mr-2" />
            Invitar Usuario
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 lg:col-span-2 min-h-[350px] flex flex-col group hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <LineChart className="text-primary" size={20} />
              Crecimiento de Consultas
            </h2>
            <select className="text-xs bg-gray-50 dark:bg-surface-darker border-none rounded-lg p-1 text-gray-500">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 italic">
            Chart Component Placeholder
          </div>
        </div>

        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 min-h-[350px] flex flex-col group hover:shadow-md">
          <div className="flex items-center mb-6">
            <h2 className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <BarChart3 className="text-indigo-500" size={20} />
              Ventas Marketplace
            </h2>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 italic">
            Bar Chart Placeholder
          </div>
        </div>
      </div>

      {/* 4. Activity Table */}
      <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">
            Actividad Reciente
          </h2>
        </div>
        <div className="overflow-x-auto">
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}
