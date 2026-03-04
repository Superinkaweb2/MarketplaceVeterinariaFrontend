import { useState, useEffect } from "react";
import { Clock, Calendar, Check, X, Eye, Info } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { api } from "../../../../shared/http/api";
import type { ApiResponse } from "../../../../shared/types/api";
import { vetService } from "../services/vetService";
import Swal from "sweetalert2";

export interface Cita {
    idCita: number;
    clienteNombre: string;
    mascotaNombre: string;
    servicioNombre: string;
    fechaProgramada: string;
    horaInicio: string;
    horaFin: string;
    estado: 'SOLICITADA' | 'CONFIRMADA' | 'RECHAZADA' | 'COMPLETADA' | 'CANCELADA' | 'NOSHOW';
    notasCliente?: string;
    notasInternas?: string;
}

export const VetCitasPage = () => {
    const [citas, setCitas] = useState<Cita[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCitas = async () => {
        try {
            const profile = await vetService.getMyProfile();
            const { data } = await api.get<ApiResponse<Cita[]>>(`/appointments/veterinario/${profile.idVeterinario}`);
            setCitas(data.data);
        } catch (error) {
            console.error("Error fetching citas:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, []);

    const handleUpdateStatus = async (citaId: number, nuevoEstado: string) => {
        const result = await Swal.fire({
            title: `¿Cambiar estado a ${nuevoEstado}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, cambiar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                await api.patch(`/appointments/${citaId}/status`, null, {
                    params: { estado: nuevoEstado }
                });
                Swal.fire("Éxito", "Estado actualizado", "success");
                fetchCitas();
            } catch (error) {
                Swal.fire("Error", "No se pudo actualizar el estado", "error");
            }
        }
    };

    const getStatusColor = (estado: string) => {
        switch (estado) {
            case 'SOLICITADA': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400';
            case 'CONFIRMADA': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400';
            case 'COMPLETADA': return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400';
            case 'RECHAZADA':
            case 'CANCELADA': return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar text-slate-900 dark:text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="text-teal-500" /> Mi Agenda
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona tus citas próximas y pasadas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="text-xs h-9">Hoy</Button>
                    <Button variant="outline" className="text-xs h-9">Filtrar</Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <Clock size={48} className="text-slate-300 mb-4" />
                    <p className="text-slate-400">Cargando agenda...</p>
                </div>
            ) : citas.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Calendar size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No hay citas programadas</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                        Cuando un cliente solicite una cita con tus servicios, aparecerá aquí.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {citas.map((cita) => (
                        <div
                            key={cita.idCita}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:border-teal-500/30 transition-all group"
                        >
                            <div className="p-5 flex flex-col md:flex-row md:items-center gap-5">
                                {/* Time Column */}
                                <div className="flex md:flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 md:w-28 shrink-0">
                                    <span className="text-lg font-black text-teal-600 dark:text-teal-400">{cita.horaInicio}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase md:mt-0.5">{cita.fechaProgramada}</span>
                                </div>

                                {/* Patient/Client Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg truncate group-hover:text-teal-600 transition-colors">
                                            {cita.mascotaNombre || "Sin mascota"}
                                        </h3>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(cita.estado)}`}>
                                            {cita.estado}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                                        <p className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                                            <Eye size={14} className="text-teal-500" /> {cita.servicioNombre}
                                        </p>
                                        <p className="flex items-center gap-1.5">
                                            <Info size={14} /> Dueño: {cita.clienteNombre}
                                        </p>
                                    </div>
                                    {cita.notasCliente && (
                                        <p className="mt-2 text-xs italic text-slate-400 line-clamp-1">"{cita.notasCliente}"</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 md:flex-col lg:flex-row">
                                    {cita.estado === 'SOLICITADA' && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(cita.idCita, 'CONFIRMADA')}
                                                className="flex-1 lg:flex-none h-9 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5"
                                            >
                                                <Check size={14} /> Confirmar
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(cita.idCita, 'RECHAZADA')}
                                                className="flex-1 lg:flex-none h-9 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <X size={14} /> Rechazar
                                            </button>
                                        </>
                                    )}
                                    {cita.estado === 'CONFIRMADA' && (
                                        <button
                                            onClick={() => handleUpdateStatus(cita.idCita, 'COMPLETADA')}
                                            className="w-full lg:w-auto h-9 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <Check size={14} /> Completar
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
