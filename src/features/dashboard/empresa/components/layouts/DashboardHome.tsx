import {
  DollarSign,
  Calendar,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";
import type { DashboardMetrics } from "../../types/dashboard.types";
import { useAuth } from "../../../../auth/context/AuthContext";

// Subcomponente interno para KPI Cards
const KPICard = ({
  label,
  value,
  icon,
  trendLabel
}: {
  label: string;
  value: string | number;
  icon: "revenue" | "appointments" | "sales";
  trendLabel: string;
}) => {
  const getIcon = () => {
    switch (icon) {
      case "revenue":
        return (
          <DollarSign
            className="text-green-600 dark:text-green-400"
            size={24}
          />
        );
      case "appointments":
        return (
          <Calendar className="text-primary dark:text-blue-400" size={24} />
        );
      case "sales":
        return (
          <ShoppingBag
            className="text-purple-600 dark:text-purple-400"
            size={24}
          />
        );
    }
  };

  const getBg = () => {
    switch (icon) {
      case "revenue":
        return "bg-green-50 dark:bg-green-900/20";
      case "appointments":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "sales":
        return "bg-purple-50 dark:bg-purple-900/20";
    }
  };

  return (
    <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${getBg()}`}>{getIcon()}</div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <TrendingUp size={14} className="mr-1" /> {trendLabel}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
          {value}
        </h3>
      </div>
    </div>
  );
};

export const DashboardHome = () => {
  const { nombre } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
        setError("No se pudieron cargar las métricas en tiempo real.");
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-800 dark:text-red-400">Error</h2>
          <p className="text-red-600 dark:text-red-400 mt-2">{error || "Algo salió mal"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              ¡Buen día, {nombre || "Empresa"}!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Esto es lo que está pasando en tu negocio hoy.
            </p>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            label="Ingresos Mensuales"
            value={`$${metrics.totalVentasMes.toLocaleString()}`}
            icon="revenue"
            trendLabel="Este mes"
          />
          <KPICard
            label="Clientes Activos"
            value={metrics.clientesActivos}
            icon="appointments"
            trendLabel="Total"
          />
          <KPICard
            label="Órdenes Hoy"
            value={metrics.ordenesPagadasHoy}
            icon="sales"
            trendLabel="Pagadas"
          />
        </div>
      </div>
    </div >
  );
};