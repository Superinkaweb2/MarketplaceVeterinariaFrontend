import {
  Download,
  Plus,
  DollarSign,
  Calendar,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  Clock,
  CheckCircle2,
  Package,
  Loader2,
} from "lucide-react";
import { appointmentsData } from "../../data";
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

// Subcomponente interno para Inventory Item (Ahora Top Productos)
const TopProductRow = ({ product }: { product: DashboardMetrics['topProductos'][0] }) => {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg border bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700">
      <div className="h-10 w-10 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shrink-0">
        <Package size={20} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
          {product.nombreProducto}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {product.cantidadVendida} unidades vendidas
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          ${product.totalVendido.toLocaleString()}
        </p>
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
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <Download size={20} className="mr-2" />
              Exportar Reporte
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm cursor-pointer">
              <Plus size={20} className="mr-2" />
              Nuevo Turno
            </button>
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

        {/* Main Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart (SVG Implementation) */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Resumen de Ingresos
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Ventas de Productos vs Servicios
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select className="bg-slate-50 dark:bg-slate-800 border-none text-sm text-slate-600 dark:text-slate-300 rounded-lg focus:ring-1 focus:ring-primary py-1.5 pl-3 pr-8 cursor-pointer outline-none">
                  <option>Este Año</option>
                  <option>Año Pasado</option>
                </select>
              </div>
            </div>
            {/* SVG Chart */}
            <div className="relative h-64 w-full">
              <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 50"
              >
                {/* Grid Lines */}
                {[0, 12.5, 25, 37.5, 50].map((y, i) => (
                  <line
                    key={i}
                    className="dark:stroke-slate-700"
                    stroke="#e2e8f0"
                    strokeWidth="0.2"
                    x1="0"
                    x2="100"
                    y1={y}
                    y2={y}
                  />
                ))}

                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--color-primary)"
                      stopOpacity="0.3"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-primary)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {/* Area Path */}
                <path
                  d="M0 40 Q 10 35, 20 25 T 40 20 T 60 15 T 80 10 T 100 5 V 50 H 0 Z"
                  fill="url(#chartGradient)"
                />
                {/* Line Path */}
                <path
                  d="M0 40 Q 10 35, 20 25 T 40 20 T 60 15 T 80 10 T 100 5"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="0.8"
                />
              </svg>
              {/* X Axis Labels */}
              <div className="flex justify-between mt-4 text-xs text-slate-400 font-medium px-1">
                {["Ene", "Mar", "May", "Jul", "Sep", "Nov", "Dic"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Más Vendidos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total ventas histórico</p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              {metrics.topProductos.length > 0 ? (
                metrics.topProductos.map((prod) => (
                  <TopProductRow key={prod.productoId} product={prod} />
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <ShoppingBag size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Aún no hay ventas registradas.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Próximos Turnos (Simulado)
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Gestiona tu agenda para hoy y mañana.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-6 py-4">Mascota / Dueño</th>
                  <th className="px-6 py-4">Servicio</th>
                  <th className="px-6 py-4">Fecha & Hora</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {appointmentsData.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <img
                            src={apt.petImage}
                            alt={apt.petName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {apt.petName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {apt.petBreed} • {apt.ownerName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {apt.serviceName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {apt.serviceDesc}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        {apt.status === "Completed" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                        {apt.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${apt.status === "Upcoming"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : apt.status === "Pending"
                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                      >
                        {apt.status === "Pending"
                          ? "Check-in Pendiente"
                          : (apt.status === "Upcoming" ? "Próximo" : "Completado")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-primary transition-colors p-1 cursor-pointer">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
};