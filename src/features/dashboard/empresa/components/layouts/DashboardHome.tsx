import {
  DollarSign,
  Calendar,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Loader2,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";
import type { DashboardMetrics } from "../../types/dashboard.types";
import { useAuth } from "../../../../auth/context/AuthContext";

const KPICard = ({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend: { value: string; positive: boolean };
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex justify-between items-start mb-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        trend.positive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}>
        {trend.positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend.value}
      </span>
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </p>
      <h3 className="text-3xl font-bold text-text-primary mt-1">
        {value}
      </h3>
    </div>
  </div>
);

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
          <p className="text-text-secondary font-medium">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-red-800">Error</h2>
          <p className="text-red-600 mt-2">{error || "Algo salió mal"}</p>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
              ¡Buen día, {nombre || "Empresa"}!
            </h1>
            <p className="text-text-secondary mt-1">
              Esto es lo que está pasando en tu negocio hoy.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            label="Ingresos Mensuales"
            value={`$${metrics.totalVentasMes.toLocaleString()}`}
            icon={<DollarSign size={22} />}
            trend={{ value: "+12%", positive: true }}
          />
          <KPICard
            label="Clientes Activos"
            value={metrics.clientesActivos}
            icon={<Users size={22} />}
            trend={{ value: "+8%", positive: true }}
          />
          <KPICard
            label="Órdenes Hoy"
            value={metrics.ordenesPagadasHoy}
            icon={<ShoppingBag size={22} />}
            trend={{ value: "Hoy", positive: true }}
          />
          <KPICard
            label="Órdenes Pendientes"
            value={metrics.ordenesPendientes}
            icon={<Calendar size={22} />}
            trend={{ value: "Pendientes", positive: true }}
          />
        </div>

        <FeedbackSection />
      </div>
    </div>
  );
};

const FeedbackSection = () => {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../../services/deliveryEmpresaService").then(m => {
        m.deliveryEmpresaService.getRatings()
            .then((data: any[]) => setRatings(data))
            .catch((err: any) => console.error("Error loading ratings:", err))
            .finally(() => setLoading(false));
    });
  }, []);

  if (loading) return null;
  if (ratings.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Star className="text-amber-500 fill-amber-500" size={20} />
                Feedback Reciente de Clientes
            </h3>
        </div>
        <div className="divide-y divide-border">
            {ratings.slice(0, 5).map(rating => (
                <div key={rating.idDelivery} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        className={i < (rating.calificacionProducto || 0) ? "fill-amber-500" : "text-slate-200"} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-text-primary">
                                {rating.clienteNombre || 'Cliente'}
                            </span>
                        </div>
                        <span className="text-xs text-text-secondary">
                            {rating.entregadoAt ? new Date(rating.entregadoAt).toLocaleDateString() : ''}
                        </span>
                    </div>
                    <p className="text-sm text-text-secondary italic">
                        "{rating.comentarioProducto || 'Sin comentario'}"
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary">Entrega:</span>
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                            <Star size={10} className="text-blue-500 fill-blue-500" />
                            <span className="text-[10px] font-bold text-blue-600">{rating.calificacionRepartidor}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
