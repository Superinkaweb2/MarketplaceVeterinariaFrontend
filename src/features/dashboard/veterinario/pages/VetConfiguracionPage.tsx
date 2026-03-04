import { useState, useEffect } from "react";
import { User, Settings, Save, ShieldCheck, Briefcase, Award, FileText, Camera } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { vetService } from "../services/vetService";
import type { VetProfile } from "../types/vet.types";
import Swal from "sweetalert2";

export const VetConfiguracionPage = () => {
    const [profile, setProfile] = useState<VetProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        especialidad: "",
        biografia: "",
        aniosExperiencia: 0,
        numeroColegiatura: "",
        fotoPerfilUrl: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await vetService.getMyProfile();
                setProfile(data);
                setFormData({
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    especialidad: data.especialidad || "",
                    biografia: data.biografia || "",
                    aniosExperiencia: data.aniosExperiencia || 0,
                    numeroColegiatura: data.numeroColegiatura || "",
                    fotoPerfilUrl: data.fotoPerfilUrl || ""
                });
            } catch (error) {
                console.error("Error fetching profile:", error);
                Swal.fire("Error", "No se pudo cargar tu perfil", "error");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "aniosExperiencia" ? parseInt(value) || 0 : value
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedProfile = await vetService.updateProfile(formData);
            setProfile(updatedProfile);
            Swal.fire({
                icon: "success",
                title: "Perfil Actualizado",
                text: "Tus cambios se han guardado correctamente.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar el perfil", "error");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center animate-pulse">Cargando perfil...</div>;
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="text-teal-500" /> Mi Configuración
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                    Gestiona tu información profesional y personal.
                </p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Avatar & Core Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                        <div className="relative inline-block mb-4">
                            <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 overflow-hidden shadow-lg ring-4 ring-white dark:ring-slate-800 flex items-center justify-center">
                                {formData.fotoPerfilUrl ? (
                                    <img src={formData.fotoPerfilUrl} alt="Perfil" className="h-full w-full object-cover" />
                                ) : (
                                    <User size={64} className="text-white" />
                                )}
                            </div>
                            <button
                                type="button"
                                className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 text-teal-600 hover:text-teal-700 transition-all hover:scale-110"
                            >
                                <Camera size={18} />
                            </button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Dr. {profile?.nombres} {profile?.apellidos}
                        </h2>
                        <p className="text-sm text-slate-500">{profile?.email}</p>

                        <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-center gap-4">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Estado</p>
                                <p className={`text-sm font-semibold ${profile?.estadoValidacion === 'VEREFICADO' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {profile?.estadoValidacion}
                                </p>
                            </div>
                            <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Experiencia</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{profile?.aniosExperiencia} años</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-500/20">
                        <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 mb-2">
                            <ShieldCheck size={20} />
                            <h3 className="font-bold text-sm">Validación Profesional</h3>
                        </div>
                        <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
                            Tu número de colegiatura y especialidad son visibles para las empresas que buscan reclutar talento.
                        </p>
                    </div>
                </div>

                {/* Right Column - Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                            <Briefcase size={18} className="text-teal-500" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Información Profesional</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Especialidad</label>
                                <input
                                    type="text"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Años de Experiencia</label>
                                <input
                                    type="number"
                                    name="aniosExperiencia"
                                    value={formData.aniosExperiencia}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Award size={16} className="text-teal-500" /> Número de Colegiatura
                                </label>
                                <input
                                    type="text"
                                    name="numeroColegiatura"
                                    value={formData.numeroColegiatura}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <FileText size={16} className="text-teal-500" /> Biografía
                                </label>
                                <textarea
                                    name="biografia"
                                    value={formData.biografia}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none resize-none"
                                    placeholder="Cuéntanos sobre tu trayectoria y pasión por los animales..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-bold text-slate-900 dark:text-white">Información Personal</h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombres</label>
                                <input
                                    type="text"
                                    name="nombres"
                                    value={formData.nombres}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Apellidos</label>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 transition-all outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={isSaving} className="gap-2 px-8 bg-teal-500 hover:bg-teal-600">
                            <Save size={18} />
                            {isSaving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
