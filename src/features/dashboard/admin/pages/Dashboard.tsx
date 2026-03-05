import { useEffect, useState } from "react";
import { StatsGrid } from "../components/StatsGrid";
import { ActivityTable } from "../components/ActivityTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { BarChart3, LineChart, PieChart as PieIcon } from "lucide-react";
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

  const distributionData = stats ? [
    { name: 'Empresas', value: stats.totalEmpresas },
    { name: 'Veterinarios', value: stats.totalVeterinarios },
    { name: 'Clientes', value: stats.totalUsuarios - stats.totalEmpresas - stats.totalVeterinarios },
  ].filter(d => d.value > 0) : [];

  const COLORS = ['#1ea59c', '#2D3E82', '#6366f1'];

  const salesData = [
    { name: 'Ene', total: (stats?.ingresosGlobales ?? 0) * 0.1 },
    { name: 'Feb', total: (stats?.ingresosGlobales ?? 0) * 0.15 },
    { name: 'Mar', total: (stats?.ingresosGlobales ?? 0) * 0.25 },
    { name: 'Abr', total: (stats?.ingresosGlobales ?? 0) * 0.2 },
    { name: 'May', total: (stats?.ingresosGlobales ?? 0) * 0.3 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#2D3E82] dark:text-white tracking-tight leading-tight">
            Panel de Control
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Supervisión global de <span className="text-[#1ea59c] font-bold">VetSaaS</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/50 dark:bg-surface-dark/50 backdrop-blur-md rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Última actualización</p>
            <p className="text-sm font-bold text-[#2D3E82] dark:text-white">Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <StatsGrid stats={stats} loading={loading} />

      {/* 3. Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Marketplace Sales Chart (BarChart) */}
        <div className="lg:col-span-3 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 dark:border-white/10 shadow-soft group">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#2D3E82]/10 rounded-xl text-[#2D3E82]">
                <BarChart3 size={20} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-[#2D3E82] dark:text-white tracking-tight">
                Ventas Marketplace
              </h2>
            </div>
            <select className="text-xs font-bold bg-[#f6f8f8] dark:bg-surface-dark border-none rounded-full px-4 py-2 text-gray-500 cursor-pointer outline-none focus:ring-2 focus:ring-[#1ea59c]/20">
              <option>Mensual</option>
              <option>Semanal</option>
            </select>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip
                  cursor={{ fill: '#1ea59c', opacity: 0.05 }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="total"
                  fill="#2D3E82"
                  radius={[10, 10, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entity Distribution Chart (PieChart) */}
        <div className="lg:col-span-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 dark:border-white/10 shadow-soft">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-[#1ea59c]/10 rounded-xl text-[#1ea59c]">
              <PieIcon size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-[#2D3E82] dark:text-white tracking-tight">
              Distribución Global
            </h2>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {distributionData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-4 bg-[#1ea59c]/5 dark:bg-[#1ea59c]/10 rounded-2xl">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Dato destacado</p>
            <p className="text-sm font-bold text-[#1ea59c]">
              El {stats ? Math.round((stats.totalEmpresas / stats.totalUsuarios) * 100) : 0}% de los usuarios son empresas activas.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Activity Table */}
      <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-soft overflow-hidden">
        <div className="p-8 border-b border-gray-100/50 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 dark:bg-white/5 rounded-xl text-gray-500">
              <LineChart size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-[#2D3E82] dark:text-white tracking-tight">
              Actividad Reciente
            </h2>
          </div>
          <button className="text-xs font-bold text-[#1ea59c] hover:text-[#1ea59c]/80 flex items-center gap-1 transition-colors">
            Ver auditoría completa →
          </button>
        </div>
        <div className="overflow-x-auto p-4">
          <ActivityTable />
        </div>
      </div>
    </div>
  );
}
