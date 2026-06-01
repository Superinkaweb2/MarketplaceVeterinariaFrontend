import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

/**
 * Botón flotante del Libro de Reclamaciones
 * Requisito obligatorio de INDECOPI para portales de comercio electrónico en Perú.
 * Debe estar visible en todo momento y ser fácilmente accesible.
 */
export const LibroReclamacionesButton = () => {
  return (
    <Link
      to="/libro-reclamaciones"
      id="libro-reclamaciones-btn"
      aria-label="Libro de Reclamaciones"
      className="fixed bottom-6 left-6 z-50 group"
    >
      <div className="relative flex items-center">
        {/* Botón principal */}
        <div
          className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl
            shadow-lg shadow-black/10 dark:shadow-black/30
            border border-slate-200 dark:border-slate-700
            transition-all duration-300 ease-out
            group-hover:shadow-xl group-hover:shadow-primary/15
            group-hover:border-primary/30
            group-hover:-translate-y-0.5"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0 shadow-sm shadow-red-500/30">
            <BookOpen size={18} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
              Libro de
            </p>
            <p className="text-[11px] font-bold text-red-600 dark:text-red-400 leading-tight tracking-tight">
              Reclamaciones
            </p>
          </div>
        </div>

        {/* Indicador de pulso */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
        </span>
      </div>
    </Link>
  );
};
