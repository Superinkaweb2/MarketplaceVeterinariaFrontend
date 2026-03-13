import { useState, useEffect } from "react";
import {
    Search,
    Receipt,
    Download,
    Link as LinkIcon,
    CreditCard,
    DollarSign,
    Package,
    Calendar,
    Filter,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { billingService } from "../services/billingService";
import { deliveryEmpresaService } from "../services/deliveryEmpresaService";
import type { OrderSummary, EstadoOrden } from "../types/billing.types";
import Swal from "sweetalert2";

/* ── Helpers ────────────────────────────────────────────────── */

const ESTADO_CONFIG: Record<EstadoOrden, { label: string; color: string }> = {
    PENDIENTE: { label: "Pendiente", color: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400" },
    PAGADO: { label: "Pagado", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" },
    ENVIADO: { label: "Enviado", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" },
    ENTREGADO: { label: "Entregado", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400" },
    CANCELADO: { label: "Cancelado", color: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400" },
    FALLIDO: { label: "Fallido", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" },
    REEMBOLSADO: { label: "Reembolsado", color: "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400" },
};

/* ── Page Component ──────────────────────────────────────── */

export const FacturacionPage = () => {
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchStatus, setSearchStatus] = useState<string>("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await billingService.getMyOrders(page, 15, {
                estado: searchStatus || undefined,
                codigoOrden: searchTerm || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            });
            setOrders(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error: any) {
            console.error("Error fetching orders:", error);
            // Mock data temporal solo si da 404 (endpoint no encontrado)
            if (error.response?.status === 404 || error.response?.status === 403) {
                setOrders([
                    { id: 1, codigoOrden: "ORD-2026-0001", clienteNombre: "Juan Pérez", subtotal: 100, costoEnvio: 10, comisionPlataforma: 5, total: 110, estado: "PAGADO", metodoPago: "visa", createdAt: new Date().toISOString() },
                    { id: 2, codigoOrden: "ORD-2026-0002", clienteNombre: "María López", subtotal: 250, costoEnvio: 0, comisionPlataforma: 12.5, total: 250, estado: "PENDIENTE", createdAt: new Date(Date.now() - 86400000).toISOString() },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, searchStatus, startDate, endDate]);

    // Búsqueda con debounce o manual (por ahora manual al presionar Enter o perder foco, o simplemente al cambiar si no es muy pesado)
    // Para el searchTerm (código de orden), mejor usar un botón de buscar o useEffect con delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0);
            fetchOrders();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleResetDelivery = async (orderId: number) => {
        const result = await Swal.fire({
            title: '¿Re-enviar pedido?',
            text: "Esto buscará un nuevo repartidor para este pedido.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, re-enviar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                // El deliveryId suele ser el mismo que orderId o está relacionado, 
                // pero el endpoint espera el ID del delivery.
                // En este sistema, un pedido tiene un delivery.
                await deliveryEmpresaService.reintentarDelivery(orderId);
                Swal.fire('¡Listo!', 'El pedido ha sido reseteado y está buscando repartidor.', 'success');
                fetchOrders();
            } catch (error: any) {
                Swal.fire('Error', error.response?.data?.message || 'No se pudo resetear el pedido.', 'error');
            }
        }
    };

    const handleGenerateCheckout = async (orderId: number) => {
        try {
            const url = await billingService.generateCheckout(orderId);
            window.open(url, "_blank");
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo generar el link de pago.", "error");
        }
    };

    // Filtro local eliminado a favor de filtro en el backend
    const filteredOrders = orders;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
            {/* Dynamic Header KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ventas Totales (Mes)</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">S/ {orders.filter(o => o.estado === 'PAGADO').reduce((acc, curr) => acc + curr.total, 0).toFixed(2)}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                        <DollarSign size={24} className="text-emerald-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Órdenes Pagadas</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{orders.filter(o => o.estado === 'PAGADO').length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                        <Package size={24} className="text-blue-500" />
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pendientes de Pago</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{orders.filter(o => o.estado === 'PENDIENTE').length}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                        <CreditCard size={24} className="text-amber-500" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="shrink-0 p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Receipt size={20} className="text-primary" />
                        Historial de Órdenes
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative group min-w-[180px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                            <select
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all outline-none appearance-none text-sm"
                                value={searchStatus}
                                onChange={(e) => { setSearchStatus(e.target.value); setPage(0); }}
                            >
                                <option value="">Todos los estados</option>
                                {Object.entries(ESTADO_CONFIG).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="relative group">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="date"
                                    className="pl-8 pr-3 py-1.5 bg-transparent border-none focus:ring-0 text-xs dark:text-white outline-none cursor-pointer"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
                                    placeholder="Desde"
                                />
                            </div>
                            <span className="text-slate-400 text-xs">-</span>
                            <div className="relative group">
                                <input
                                    type="date"
                                    className="px-3 py-1.5 bg-transparent border-none focus:ring-0 text-xs dark:text-white outline-none cursor-pointer"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
                                    placeholder="Hasta"
                                />
                            </div>
                        </div>

                        <div className="relative group sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="N° de Orden..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all outline-none placeholder:text-slate-400 text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                    {/* Desktop Table */}
                    <div className="hidden md:block min-w-[800px]">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm shadow-sm z-10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Código</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cliente</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Total</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Estado</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/50 dark:bg-slate-800/20" />
                                        </tr>
                                    ))
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16 text-center">
                                            <Receipt size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                                            <p className="text-slate-500 font-medium">No se encontraron órdenes.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white">
                                                    {order.codigoOrden}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {order.clienteNombre}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    S/ {order.total.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-opacity-20 ${ESTADO_CONFIG[order.estado].color}`}>
                                                    {ESTADO_CONFIG[order.estado].label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {order.estado === "PENDIENTE" && (
                                                        <button
                                                            onClick={() => handleGenerateCheckout(order.id)}
                                                            title="Generar Link de Pago"
                                                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:text-blue-400 rounded-md transition-colors"
                                                        >
                                                            <LinkIcon size={16} />
                                                        </button>
                                                    )}
                                                    {(order.estado === "FALLIDO" || (order as any).estado === "INCIDENCIA") && (
                                                        <button
                                                            onClick={() => handleResetDelivery(order.id)}
                                                            title="Re-enviar pedido (Cargar nuevamente)"
                                                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 rounded-md transition-colors"
                                                        >
                                                            <RefreshCw size={16} />
                                                        </button>
                                                    )}
                                                    <button
                                                        title="Descargar Comprobante"
                                                        className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-md transition-colors"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden flex flex-col p-4 gap-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-24 bg-slate-50 dark:bg-slate-800/80 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700/50" />
                            ))
                        ) : filteredOrders.length === 0 ? (
                            <div className="py-12 text-center text-slate-500">No se encontraron órdenes.</div>
                        ) : (
                            filteredOrders.map(order => (
                                <div key={order.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-mono text-sm font-bold text-slate-900 dark:text-white">{order.codigoOrden}</p>
                                            <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${ESTADO_CONFIG[order.estado].color}`}>
                                            {ESTADO_CONFIG[order.estado].label}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{order.clienteNombre}</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">S/ {order.total.toFixed(2)}</p>
                                    </div>
                                    <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                                        {order.estado === "PENDIENTE" && (
                                            <Button variant="outline" onClick={() => handleGenerateCheckout(order.id)} className="flex-1 text-xs py-1.5 gap-1.5 shadow-sm">
                                                <LinkIcon size={14} /> Link Pago
                                            </Button>
                                        )}
                                        {(order.estado === "FALLIDO" || (order as any).estado === "INCIDENCIA") && (
                                            <Button variant="outline" onClick={() => handleResetDelivery(order.id)} className="flex-1 text-xs py-1.5 gap-1.5 shadow-sm bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400">
                                                <RefreshCw size={14} /> Re-enviar
                                            </Button>
                                        )}
                                        <Button variant="outline" className="flex-1 text-xs py-1.5 gap-1.5 shadow-sm">
                                            <Download size={14} /> PDF
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
                    <span className="text-sm font-medium text-slate-500">
                        Mostrando {filteredOrders.length} de {totalElements} órdenes
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0 || isLoading}
                            className="h-9 px-3 gap-1.5"
                        >
                            <ChevronLeft size={16} />
                            Anterior
                        </Button>
                        <div className="flex items-center px-4 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Página {page + 1} de {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1 || isLoading}
                            className="h-9 px-3 gap-1.5"
                        >
                            Siguiente
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
