import { useState, useEffect, useMemo } from "react";
import {
    Search,
    Stethoscope,
    Clock,
    MapPin,
    Monitor,
    Home,
    RefreshCw,
} from "lucide-react";
import { vetService } from "../services/vetService";
import type { Service, ModalidadServicio } from "../../../catalog/types/service.types";

/* ── Helpers ────────────────────────────────────────────────── */

const MODALIDAD_CONFIG: Record<ModalidadServicio, { label: string; icon: typeof MapPin; color: string }> = {
    PRESENCIAL: { label: "Presencial", icon: MapPin, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10" },
    VIRTUAL: { label: "Virtual", icon: Monitor, color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-500/10" },
    DOMICILIO: { label: "Domicilio", icon: Home, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" },
    HIBRIDO: { label: "Híbrido", icon: RefreshCw, color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-500/10" },
};

const ModalidadBadge = ({ modalidad }: { modalidad: ModalidadServicio }) => {
    const config = MODALIDAD_CONFIG[modalidad];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <Icon size={14} />
            {config.label}
        </span>
    );
};

/* ── Page Component ──────────────────────────────────────── */

export const VetServiciosPage = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await vetService.getMyServices(0, 50);
                setServices(data.content);
            } catch (error) {
                console.error("Error fetching vet services:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    const filteredServices = useMemo(
        () => services.filter((s) => s.nombre.toLowerCase().includes(searchTerm.toLowerCase())),
        [services, searchTerm],
    );

    return (
        <div className="h-full flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
            {/* Header */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        Mis Servicios
                    </h1>
                    <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
                        Servicios que ofreces a través de las empresas donde colaboras.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="shrink-0">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar servicio..."
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 dark:text-white transition-all outline-none placeholder:text-slate-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {/* Desktop Table */}
                    <div className="hidden md:block min-w-[600px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shadow-sm">
                                <tr>
                                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Servicio</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Precio</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Duración</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Modalidad</th>
                                    <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {isLoading
                                    ? Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/30 dark:bg-slate-800/10" />
                                        </tr>
                                    ))
                                    : filteredServices.length === 0
                                        ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center max-w-sm mx-auto">
                                                        <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                                            <Stethoscope size={32} className="text-slate-400" />
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Sin servicios</h3>
                                                        <p className="text-sm text-slate-500 text-center">
                                                            {searchTerm ? "No encontramos coincidencias." : "Aún no tienes servicios asignados."}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                        : filteredServices.map((s) => (
                                            <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-9 w-9 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
                                                            <Stethoscope size={18} className="text-teal-500" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{s.nombre}</p>
                                                            {s.empresaNombre && <p className="text-xs text-slate-500 truncate">{s.empresaNombre}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">S/ {s.precio.toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                                                        <Clock size={14} className="text-slate-400" /> {s.duracionMinutos} min
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4"><ModalidadBadge modalidad={s.modalidad} /></td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${s.activo ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20" : "bg-slate-50 text-slate-600 ring-slate-600/20 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20"}`}>
                                                        {s.activo ? "Activo" : "Inactivo"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col p-4 gap-4">
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl animate-pulse space-y-3 border border-slate-100 dark:border-slate-700">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                                </div>
                            ))
                            : filteredServices.length === 0
                                ? (
                                    <div className="py-12 text-center">
                                        <Stethoscope size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                                        <p className="text-slate-500 font-medium">No se encontraron servicios.</p>
                                    </div>
                                )
                                : filteredServices.map((s) => (
                                    <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                                        <div className="flex gap-3">
                                            <div className="w-10 h-10 shrink-0 rounded-lg bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center">
                                                <Stethoscope size={18} className="text-teal-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{s.nombre}</h3>
                                                {s.empresaNombre && <p className="text-xs text-slate-500 truncate">{s.empresaNombre}</p>}
                                                <div className="mt-1.5 flex items-center gap-3">
                                                    <span className="text-base font-bold text-teal-600 dark:text-teal-400">S/ {s.precio.toFixed(2)}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {s.duracionMinutos} min</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                                            <ModalidadBadge modalidad={s.modalidad} />
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${s.activo ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                                                {s.activo ? "Activo" : "Inactivo"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        Mostrando <span className="text-slate-900 dark:text-white">{filteredServices.length}</span> servicios
                    </span>
                </div>
            </div>
        </div>
    );
};
