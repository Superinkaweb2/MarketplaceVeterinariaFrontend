import { useState, useEffect } from "react";
import {
    Stethoscope,
    Award,
    Clock,
    Shield,
    ShieldCheck,
    ShieldX,
    Mail,
    Check,
    X,
    Briefcase,
} from "lucide-react";
import { vetService } from "../services/vetService";
import type { VetProfile, StaffInvitation, VerificationStatus } from "../types/vet.types";
import Swal from "sweetalert2";

/* ── Helpers ────────────────────────────────────────────────── */

const VERIFICATION_CONFIG: Record<VerificationStatus, { label: string; icon: typeof Shield; color: string }> = {
    PENDIENTE: { label: "Pendiente de verificación", icon: Shield, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10" },
    VEREFICADO: { label: "Verificado", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10" },
    RECHAZADO: { label: "Rechazado", icon: ShieldX, color: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10" },
};

/* ── Component ──────────────────────────────────────────────── */

export const VetHomePage = () => {
    const [profile, setProfile] = useState<VetProfile | null>(null);
    const [invitations, setInvitations] = useState<StaffInvitation[]>([]);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await vetService.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching vet profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        const fetchInvitations = async () => {
            try {
                const data = await vetService.getMyInvitations();
                setInvitations(data);
            } catch (error) {
                console.error("Error fetching invitations:", error);
            } finally {
                setIsLoadingInvitations(false);
            }
        };

        fetchProfile();
        fetchInvitations();
    }, []);

    const handleAccept = async (staffId: number) => {
        try {
            await vetService.acceptInvitation(staffId);
            setInvitations((prev) => prev.filter((i) => i.idStaff !== staffId));
            Swal.fire("¡Aceptada!", "Ahora eres parte del equipo.", "success");
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo aceptar la invitación.", "error");
        }
    };

    const handleReject = async (staffId: number) => {
        const result = await Swal.fire({
            title: "¿Rechazar invitación?",
            text: "No podrás unirte al equipo a menos que te vuelvan a invitar.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#64748b",
            confirmButtonText: "Sí, rechazar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await vetService.rejectInvitation(staffId);
                setInvitations((prev) => prev.filter((i) => i.idStaff !== staffId));
                Swal.fire("Rechazada", "La invitación ha sido rechazada.", "info");
            } catch {
                Swal.fire("Error", "No se pudo rechazar la invitación.", "error");
            }
        }
    };

    const verif = profile ? VERIFICATION_CONFIG[profile.estadoValidacion] : null;
    const VerifIcon = verif?.icon;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Banner */}
                <div className="h-28 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 relative">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMjBMMjAgMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMCAyMEw0MCAyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50" />
                </div>

                {/* Content */}
                <div className="px-5 md:px-8 pb-6 -mt-12 relative">
                    {isLoadingProfile ? (
                        <div className="animate-pulse flex items-end gap-5">
                            <div className="w-24 h-24 rounded-2xl bg-slate-200 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900" />
                            <div className="space-y-3 pb-1 flex-1">
                                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48" />
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
                            </div>
                        </div>
                    ) : profile ? (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-5">
                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-white dark:ring-slate-900 shadow-lg shrink-0 bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                                    {profile.fotoPerfilUrl ? (
                                        <img src={profile.fotoPerfilUrl} alt={profile.nombres} className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-2xl font-bold text-white">
                                            {profile.nombres.charAt(0)}{profile.apellidos.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white truncate">
                                        Dr. {profile.nombres} {profile.apellidos}
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{profile.email}</p>
                                    <div className="mt-2 flex flex-wrap items-center gap-2">
                                        {verif && VerifIcon && (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${verif.color}`}>
                                                <VerifIcon size={14} /> {verif.label}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <StatCard icon={Stethoscope} label="Especialidad" value={profile.especialidad || "General"} color="text-teal-500" />
                                <StatCard icon={Award} label="Colegiatura" value={profile.numeroColegiatura} color="text-indigo-500" />
                                <StatCard icon={Clock} label="Experiencia" value={`${profile.aniosExperiencia} años`} color="text-emerald-500" />
                                <StatCard icon={Mail} label="Invitaciones" value={`${invitations.length} independientes`} color="text-amber-500" />
                            </div>

                            {profile.biografia && (
                                <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                    {profile.biografia}
                                </p>
                            )}
                        </>
                    ) : (
                        <p className="text-slate-500 pt-14">No se pudo cargar el perfil.</p>
                    )}
                </div>
            </div>

            {/* Invitations Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 md:p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                    <Mail size={20} className="text-teal-500" />
                    Invitaciones Pendientes
                </h2>

                {isLoadingInvitations ? (
                    <div className="space-y-3">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : invitations.length === 0 ? (
                    <div className="text-center py-8">
                        <Mail size={36} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm text-slate-500">No tienes invitaciones pendientes.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {invitations.map((inv) => (
                            <div
                                key={inv.idStaff}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                        {inv.empresaNombre ? inv.empresaNombre.charAt(0) : "E"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {inv.empresaNombre || "Empresa"}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <Briefcase size={12} /> Rol: {inv.rolInterno}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(inv.idStaff)}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors"
                                    >
                                        <Check size={16} /> Aceptar
                                    </button>
                                    <button
                                        onClick={() => handleReject(inv.idStaff)}
                                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
                                    >
                                        <X size={16} /> Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ── Subcomponent ─────────────────────────────────────────── */

const StatCard = ({ icon: Icon, label, value, color = "text-teal-500" }: { icon: any; label: string; value: string; color?: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-teal-500/20 transition-all">
        <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${color}`}>
            <Icon size={18} />
        </div>
        <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{value}</p>
        </div>
    </div>
);
