import { useEffect, useState, useMemo } from "react";
import { marketplaceService } from "../../../marketplace/services/marketplaceService";
import type { Order } from "../types/order.types";
import { 
  Receipt, AlertCircle, CheckCircle, Clock, 
  Calendar, X, Package, Ban 
} from "lucide-react";
import Swal from "sweetalert2";

export const MisCompras = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState<number | null>(null);

  // Estados para el filtro de fechas
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await marketplaceService.getMyOrders(0, 50);
      setOrders(response.content);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar tus compras.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagar = async (orderId: number) => {
    try {
      setIsPaying(orderId);
      const paymentData = await marketplaceService.getPaymentLink(orderId);
      window.location.href = paymentData.initPoint;
    } catch (error) {
      console.error("Error al iniciar el pago:", error);
      Swal.fire({
        icon: "error",
        title: "Error de pago",
        text: "Hubo un problema al generar el enlace de pago. Intenta nuevamente.",
      });
    } finally {
      setIsPaying(null);
    }
  };

  // Filtrado de órdenes optimizado con useMemo
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Asumimos que createdAt viene en formato ISO (ej. "2024-03-15T10:30:00Z")
      const orderDateStr = order.createdAt.split("T")[0]; 

      if (dateFilter.start && orderDateStr < dateFilter.start) return false;
      if (dateFilter.end && orderDateStr > dateFilter.end) return false;
      
      return true;
    });
  }, [orders, dateFilter]);

  const clearFilters = () => {
    setDateFilter({ start: "", end: "" });
  };

  const renderEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide"><Clock size={14} /> PENDIENTE</span>;
      case "PAGADO":
        return <span className="flex items-center gap-1.5 text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide"><CheckCircle size={14} /> PAGADO</span>;
      case "FALLIDO":
      case "CANCELADO":
        return <span className="flex items-center gap-1.5 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide"><Ban size={14} /> {estado}</span>;
      default:
        return <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold tracking-wide"><AlertCircle size={14} /> {estado}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <p className="animate-pulse font-medium">Cargando tus compras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <Receipt size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Mis Compras</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Historial de tus pedidos y servicios en Huella360.</p>
          </div>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      {orders.length > 0 && (
        <div className="bg-white dark:bg-surface-dark p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 w-full md:w-auto">
            <Calendar size={20} />
            <span className="font-medium text-sm">Filtrar por fecha:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto items-center gap-3">
            <input 
              type="date" 
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-gray-200"
            />
            <span className="text-gray-400 hidden sm:block">-</span>
            <input 
              type="date" 
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              className="w-full sm:w-auto px-4 py-2 text-sm bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-gray-200"
            />
          </div>

          {(dateFilter.start || dateFilter.end) && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors ml-auto md:ml-0"
            >
              <X size={16} /> Limpiar
            </button>
          )}
        </div>
      )}

      {/* LISTA DE ÓRDENES */}
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark p-12 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <div className="bg-gray-50 dark:bg-surface-darker p-6 rounded-full mb-4">
            <Package size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Aún no tienes compras</h3>
          <p className="text-gray-500 max-w-sm">Explora nuestro Marketplace y encuentra los mejores productos y servicios para tu mascota.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No hay compras en este rango de fechas.</p>
          <button onClick={clearFilters} className="text-primary hover:underline mt-2">Ver todas mis compras</button>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-surface-dark rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Info de la Orden */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="hidden sm:flex h-12 w-12 bg-gray-50 dark:bg-surface-darker rounded-xl items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800">
                    <Package size={24} className="text-gray-500" />
                  </div>
                  <div className="space-y-1.5 w-full">
                    <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3">
                      <span className="font-extrabold text-lg text-gray-900 dark:text-white">{order.codigoOrden}</span>
                      {renderEstadoBadge(order.estado)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <span><span className="font-medium">Vendedor:</span> {order.empresaNombre || 'Huella360'}</span>
                      <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                      <span><span className="font-medium">Fecha:</span> {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    {/* Opcional: Mostrar cantidad de items si lo tienes en el DTO */}
                    {order.items && order.items.length > 0 && (
                      <p className="text-xs text-gray-500 bg-gray-50 dark:bg-surface-darker inline-block px-2 py-1 rounded-md mt-2">
                        {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones y Precio */}
                <div className="flex flex-row md:flex-col items-center justify-between md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-6 min-w-[140px]">
                  <div className="text-left md:text-right">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total a pagar</p>
                    <p className="text-2xl font-black text-primary">S/ {order.total.toFixed(2)}</p>
                  </div>

                  {order.estado === 'PENDIENTE' && (
                    <button
                      onClick={() => handlePagar(order.id)}
                      disabled={isPaying === order.id}
                      className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-primary/30 disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
                    >
                      {isPaying === order.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      ) : null}
                      {isPaying === order.id ? "Conectando..." : "Pagar Ahora"}
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};