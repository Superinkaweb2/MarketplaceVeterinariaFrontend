import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Stethoscope, Check } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { serviceService } from "../services/serviceService";
import type { Service, CreateServiceRequest } from "../../../catalog/types/service.types";
import Swal from "sweetalert2";

/* ── Validation Schema ─────────────────────────────────────── */

const MODALIDADES = ["PRESENCIAL", "VIRTUAL", "DOMICILIO", "HIBRIDO"] as const;

const serviceSchema = z.object({
    nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    descripcion: z.string().optional(),
    precio: z.number().min(0, "El precio no puede ser negativo"),
    duracionMinutos: z.number().int().positive("La duración debe ser mayor a 0").optional().nullable(),
    modalidad: z.enum(MODALIDADES, { error: "Selecciona una modalidad" }),
    visible: z.boolean(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

/* ── Props ──────────────────────────────────────────────────── */

interface ServiceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    service?: Service | null;
}

/* ── Component ──────────────────────────────────────────────── */

export const ServiceFormModal = ({
    isOpen,
    onClose,
    onSuccess,
    service,
}: ServiceFormModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ServiceFormData>({
        resolver: zodResolver(serviceSchema),
        defaultValues: { visible: true, modalidad: "PRESENCIAL" },
    });

    /* Reset form when modal opens / service changes */
    useEffect(() => {
        if (!isOpen) return;

        if (service) {
            reset({
                nombre: service.nombre,
                descripcion: service.descripcion ?? "",
                precio: service.precio,
                duracionMinutos: service.duracionMinutos ?? null,
                modalidad: service.modalidad,
                visible: service.visible,
            });
        } else {
            reset({
                nombre: "",
                descripcion: "",
                precio: 0,
                duracionMinutos: 30,
                modalidad: "PRESENCIAL",
                visible: true,
            });
        }
    }, [isOpen, service, reset]);

    /* ── Submit Handler ──────────────────────────────────────── */

    const onSubmit = async (data: ServiceFormData) => {
        try {
            const payload: CreateServiceRequest = {
                ...data,
                duracionMinutos: data.duracionMinutos ?? undefined,
                descripcion: data.descripcion || undefined,
            };

            if (service) {
                await serviceService.updateService(service.id, payload);
                Swal.fire("¡Éxito!", "Servicio actualizado correctamente", "success");
            } else {
                await serviceService.createService(payload);
                Swal.fire("¡Éxito!", "Servicio creado correctamente", "success");
            }

            onSuccess();
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Ocurrió un error al procesar el servicio";
            Swal.fire("Error", msg, "error");
        }
    };

    if (!isOpen) return null;

    /* ── Render ──────────────────────────────────────────────── */

    const MODALIDAD_LABELS: Record<string, string> = {
        PRESENCIAL: "🏥 Presencial",
        VIRTUAL: "💻 Virtual",
        DOMICILIO: "🏠 A Domicilio",
        HIBRIDO: "🔄 Híbrido",
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
            <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col transition-all duration-300">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                            <Stethoscope size={20} className="sm:hidden" />
                            <Stethoscope size={24} className="hidden sm:block" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                            {service ? "Editar Servicio" : "Nuevo Servicio"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {/* Nombre */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Nombre del Servicio
                            </label>
                            <input
                                {...register("nombre")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Ej: Consulta General, Vacunación, Cirugía"
                            />
                            {errors.nombre && <p className="text-xs text-red-500">{errors.nombre.message}</p>}
                        </div>

                        {/* Precio */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Precio (S/)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register("precio", { valueAsNumber: true })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-mono transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            {errors.precio && <p className="text-xs text-red-500">{errors.precio.message}</p>}
                        </div>

                        {/* Duración */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Duración (minutos)
                            </label>
                            <input
                                type="number"
                                {...register("duracionMinutos", { valueAsNumber: true })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="30"
                            />
                            {errors.duracionMinutos && (
                                <p className="text-xs text-red-500">{errors.duracionMinutos.message}</p>
                            )}
                        </div>

                        {/* Modalidad */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Modalidad
                            </label>
                            <select
                                {...register("modalidad")}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                            >
                                {MODALIDADES.map((m) => (
                                    <option key={m} value={m}>
                                        {MODALIDAD_LABELS[m]}
                                    </option>
                                ))}
                            </select>
                            {errors.modalidad && <p className="text-xs text-red-500">{errors.modalidad.message}</p>}
                        </div>

                        {/* Visible toggle */}
                        <div className="flex items-center gap-3">
                            <div className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="visible-service" {...register("visible")} className="sr-only peer" />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary" />
                                <label htmlFor="visible-service" className="ml-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Visible en el Marketplace
                                </label>
                            </div>
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Descripción
                            </label>
                            <textarea
                                {...register("descripcion")}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white resize-none transition-all focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Describe en qué consiste el servicio..."
                            />
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        type="button"
                        className="w-full sm:w-auto order-2 sm:order-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto gap-2 order-1 sm:order-2 rounded-xl py-2.5"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Procesando
                            </span>
                        ) : (
                            <>
                                <Check size={20} />
                                <span>{service ? "Guardar Cambios" : "Crear Servicio"}</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};
