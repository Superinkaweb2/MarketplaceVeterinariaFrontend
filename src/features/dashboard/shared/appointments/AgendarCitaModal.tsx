import { useState, useEffect } from "react";
import { X, Calendar, Clock, PawPrint, Loader2, CheckCircle } from "lucide-react";
import { petService } from "../../cliente/services/petService";
import { appointmentService } from "./appointmentService";
import type { Pet } from "../../cliente/types/pet.types";
import type { CitaRequest } from "./appointmentService";

interface AgendarCitaModalProps {
    isOpen: boolean;
    onClose: () => void;
    servicioId: number;
    empresaId: number;
    servicioNombre: string;
}

export const AgendarCitaModal = ({ isOpen, onClose, servicioId, empresaId, servicioNombre }: AgendarCitaModalProps) => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const [form, setForm] = useState<{
        mascotaId: string;
        fechaProgramada: string;
        horaInicio: string;
        notasCliente: string;
    }>({
        mascotaId: "",
        fechaProgramada: today,
        horaInicio: "09:00",
        notasCliente: "",
    });

    useEffect(() => {
        if (!isOpen) return;
        setSuccess(false);
        setForm({ mascotaId: "", fechaProgramada: today, horaInicio: "09:00", notasCliente: "" });
        const load = async () => {
            setIsLoadingPets(true);
            try {
                const data = await petService.getMyPets();
                setPets(data);
                if (data.length > 0) setForm(f => ({ ...f, mascotaId: String(data[0].id) }));
            } catch {
                // No pets is fine
            } finally {
                setIsLoadingPets(false);
            }
        };
        load();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const request: CitaRequest = {
                servicioId,
                empresaId,
                fechaProgramada: form.fechaProgramada,
                horaInicio: form.horaInicio,
                notasCliente: form.notasCliente || undefined,
            };
            if (form.mascotaId) request.mascotaId = Number(form.mascotaId);
            await appointmentService.create(request);
            setSuccess(true);
        } catch (err) {
            console.error("Error creating appointment:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Agendar Cita</h2>
                        <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{servicioNombre}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                {success ? (
                    <div className="p-10 flex flex-col items-center text-center gap-4">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <CheckCircle className="text-emerald-500" size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white">¡Cita Solicitada!</h3>
                        <p className="text-slate-500 text-sm max-w-[260px]">
                            Tu solicitud fue enviada. La empresa o veterinario confirmará tu cita pronto.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all"
                        >
                            Entendido
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        {/* Pet selector */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                                <PawPrint size={16} className="text-blue-500" /> Mascota
                            </label>
                            {isLoadingPets ? (
                                <div className="h-11 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                            ) : pets.length > 0 ? (
                                <select
                                    name="mascotaId"
                                    value={form.mascotaId}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="">Sin mascota específica</option>
                                    {pets.map(p => (
                                        <option key={p.id} value={p.id}>{p.nombre} ({p.especie})</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                    No tienes mascotas registradas. La cita se agendará sin mascota específica.
                                </p>
                            )}
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                                <Calendar size={16} className="text-blue-500" /> Fecha preferida
                            </label>
                            <input
                                type="date"
                                name="fechaProgramada"
                                value={form.fechaProgramada}
                                min={today}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-blue-500" /> Hora preferida
                            </label>
                            <input
                                type="time"
                                name="horaInicio"
                                value={form.horaInicio}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
                                Notas adicionales <span className="text-slate-400 font-normal">(opcional)</span>
                            </label>
                            <textarea
                                name="notasCliente"
                                value={form.notasCliente}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Síntomas, motivo de la consulta, preferencias..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
                                {isSubmitting ? "Enviando..." : "Solicitar Cita"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
