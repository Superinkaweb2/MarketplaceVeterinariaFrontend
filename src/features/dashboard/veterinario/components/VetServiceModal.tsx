import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import type { Service, ModalidadServicio } from "../../../catalog/types/service.types";
import { vetService } from "../services/vetService";
import Swal from "sweetalert2";

interface VetServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    serviceToEdit?: Service | null;
}

const MODALIDADES: { value: ModalidadServicio; label: string }[] = [
    { value: "PRESENCIAL", label: "Presencial" },
    { value: "VIRTUAL", label: "Virtual" },
    { value: "DOMICILIO", label: "Domicilio" },
    { value: "HIBRIDO", label: "Híbrido" }
];

export const VetServiceModal = ({ isOpen, onClose, onSuccess, serviceToEdit }: VetServiceModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        duracionMinutos: "30",
        modalidad: "PRESENCIAL" as ModalidadServicio,
        visible: true,
        activo: true
    });

    useEffect(() => {
        if (serviceToEdit) {
            setFormData({
                nombre: serviceToEdit.nombre,
                descripcion: serviceToEdit.descripcion || "",
                precio: serviceToEdit.precio.toString(),
                duracionMinutos: serviceToEdit.duracionMinutos ? serviceToEdit.duracionMinutos.toString() : "30",
                modalidad: serviceToEdit.modalidad,
                visible: serviceToEdit.visible,
                activo: serviceToEdit.activo
            });
        } else {
            setFormData({
                nombre: "",
                descripcion: "",
                precio: "",
                duracionMinutos: "30",
                modalidad: "PRESENCIAL",
                visible: true,
                activo: true
            });
        }
    }, [serviceToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const payload = {
                ...formData,
                precio: parseFloat(formData.precio),
                duracionMinutos: parseInt(formData.duracionMinutos) || 30,
            };

            if (serviceToEdit) {
                await vetService.updateService(serviceToEdit.id, payload);
                Swal.fire({ title: "Actualizado", text: "Servicio actualizado correctamente", icon: "success", timer: 2000, showConfirmButton: false });
            } else {
                await vetService.createService(payload);
                Swal.fire({ title: "Creado", text: "Servicio creado correctamente", icon: "success", timer: 2000, showConfirmButton: false });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error saving service:", error);
            Swal.fire("Error", "Ocurrió un error al guardar el servicio", "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {serviceToEdit ? "Editar Servicio" : "Nuevo Servicio"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
                    <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Nombre del Servicio <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej: Consulta General"
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Descripción</label>
                            <textarea
                                value={formData.descripcion}
                                onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                placeholder="Detalles sobre lo que incluye el servicio..."
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all text-sm resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Precio (S/) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={e => setFormData({ ...formData, precio: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Duración (minutos) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="1"
                                    value={formData.duracionMinutos}
                                    onChange={e => setFormData({ ...formData, duracionMinutos: e.target.value })}
                                    placeholder="30"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Modalidad <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={formData.modalidad}
                                onChange={e => setFormData({ ...formData, modalidad: e.target.value as ModalidadServicio })}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 dark:text-white appearance-none transition-all text-sm"
                            >
                                {MODALIDADES.map(m => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.visible}
                                    onChange={e => setFormData({ ...formData, visible: e.target.checked })}
                                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                                />
                                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Visible en catálogo</span>
                            </label>

                            {serviceToEdit && (
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.activo}
                                        onChange={e => setFormData({ ...formData, activo: e.target.checked })}
                                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Servicio activo</span>
                                </label>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-800/50">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="serviceForm"
                        className="bg-teal-500 hover:bg-teal-600 text-white min-w-[120px]"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <><Save size={18} className="mr-2" /> Guardar</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
