import { Edit2, Trash2, Calendar, Scale, Scissors, Info } from "lucide-react";
import { type Pet, Sexo } from "../types/pet.types";

interface PetCardProps {
  pet: Pet;
  onEdit: (pet: Pet) => void;
  onDelete: (pet: Pet) => void;
}

export const PetCard = ({ pet, onEdit, onDelete }: PetCardProps) => {
  const calculateAge = (birthday: string) => {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();

    if (years > 0) return `${years} ${years === 1 ? 'año' : 'años'}`;
    return `${months} ${months === 1 ? 'mes' : 'meses'}`;
  };

  return (
    <div className="group relative bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col gap-5">
      {/* Photo & Actions Combined Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 group-hover:scale-105 transition-transform duration-500 shadow-sm">
            {pet.fotoUrl ? (
              <img src={pet.fotoUrl} alt={pet.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-50 dark:bg-surface-darker flex items-center justify-center text-primary font-bold text-xl">
                {pet.nombre.charAt(0)}
              </div>
            )}
          </div>
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg border-2 border-white dark:border-surface-dark flex items-center justify-center text-white text-[10px] font-bold ${pet.sexo === Sexo.MACHO ? 'bg-blue-500' : 'bg-pink-500'}`}>
            {pet.sexo === Sexo.MACHO ? '♂' : '♀'}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={() => onEdit(pet)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(pet)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          {pet.nombre}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-1.5 py-0.5 rounded">{pet.especie}</span>
          {pet.raza && <span className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />}
          {pet.raza && <span className="text-xs font-medium text-gray-500 truncate">{pet.raza}</span>}
        </div>
      </div>

      {/* Structured Info Grid */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-gray-50 dark:bg-surface-darker p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Calendar size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Edad</span>
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">
            {pet.fechaNacimiento ? calculateAge(pet.fechaNacimiento) : 'N/A'}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-surface-darker p-3 rounded-xl border border-gray-100 dark:border-gray-800/50 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Scale size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Peso</span>
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-white">{pet.pesoKg} Kg</p>
        </div>
      </div>

      {/* Footer Features */}
      <div className="flex flex-wrap gap-2 pt-1">
        {pet.esterilizado && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-tight">
            <Scissors size={10} className="mr-1" />
            Esterilizado
          </span>
        )}
        {pet.observacionesMedicas && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase tracking-tight">
            <Info size={10} className="mr-1" />
            Historial
          </span>
        )}
      </div>

      <button className="w-full py-2.5 mt-2 rounded-xl text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:text-white hover:bg-primary transition-all uppercase tracking-widest border border-gray-200 dark:border-gray-800 hover:border-primary">
        Ver Perfil Médico
      </button>
    </div>
  );
};
