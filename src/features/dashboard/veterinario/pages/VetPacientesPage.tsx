import { useState, useEffect } from "react";
import { PawPrint, User, Search, Filter, Eye, Calendar } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { vetService } from "../services/vetService";

interface Patient {
    idMascota: number;
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    nombreDueño: string;
    ultimaConsulta?: string;
    fotoUrl?: string;
}

export const VetPacientesPage = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchPatients = async () => {
        try {
            // Since there's no specific "patients" endpoint yet, we'll fetch from a generic one or mock for now
            // In a real scenario, we'd have /veterinarians/me/patients
            await vetService.getMyProfile();
            // Mocking for demonstration if endpoint doesn't exist yet
            // const { data } = await api.get<ApiResponse<Patient[]>>(`/veterinarians/${profile.idVeterinario}/patients`);

            // Temporary mock data to show UI
            const mockPatients: Patient[] = [
                { idMascota: 1, nombre: "Chester", especie: "Canino", raza: "Golden Retriever", edad: 4, nombreDueño: "Gabriel Rojas", ultimaConsulta: "2026-02-15" },
                { idMascota: 2, nombre: "Luna", especie: "Felino", raza: "Siamés", edad: 2, nombreDueño: "Ana Lopez", ultimaConsulta: "2026-03-01" },
                { idMascota: 3, nombre: "Max", especie: "Canino", raza: "Pastor Alemán", edad: 6, nombreDueño: "Carlos Ruiz", ultimaConsulta: "2026-01-20" },
            ];

            setPatients(mockPatients);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((p: Patient) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.nombreDueño.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar text-slate-900 dark:text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <PawPrint className="text-teal-500" /> Mis Pacientes
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">Base de datos de mascotas atendidas.</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar paciente o dueño..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 outline-none w-full md:w-64"
                        />
                    </div>
                    <Button variant="outline" className="h-10 px-3">
                        <Filter size={18} />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : filteredPatients.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <PawPrint size={32} />
                    </div>
                    <h3 className="text-lg font-bold">No se encontraron pacientes</h3>
                    <p className="text-sm text-slate-500 mt-1">Intenta con otro término de búsqueda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPatients.map((patient: Patient) => (
                        <div
                            key={patient.idMascota}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:border-teal-500/30 transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                                    <PawPrint size={28} />
                                </div>
                                <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-wider">
                                    ID: {patient.idMascota}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold group-hover:text-teal-600 transition-colors">
                                {patient.nombre}
                            </h3>
                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{patient.especie}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{patient.raza}</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <User size={14} className="text-teal-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Dueño:</span> {patient.nombreDueño}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={14} className="text-teal-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-300">Última cita:</span> {patient.ultimaConsulta || "N/A"}
                                </div>
                            </div>

                            <button className="mt-5 w-full h-10 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-teal-500 hover:text-white text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2">
                                <Eye size={14} /> Ver Historia Clínica
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
