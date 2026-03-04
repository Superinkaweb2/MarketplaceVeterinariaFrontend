import { useState, useEffect } from "react";
import { Menu, Search, User as UserIcon } from "lucide-react";
import { useAuth } from "../../../../auth/context/useAuth";
import { api } from "../../../../../shared/http/api";

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const { role } = useAuth();
  const [companyData, setCompanyData] = useState<{ nombreComercial: string; logoUrl?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await api.get("/companies/me");
        setCompanyData(response.data.data);
      } catch (error) {
        console.error("Error fetching company data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white dark:bg-surface-dark border-b border-slate-200 dark:border-slate-800 shrink-0 z-10">
      {/* Mobile Toggle Button (Ahora funcional) */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
      >
        <Menu size={24} />
      </button>

      {/* Search - Oculto en móviles muy pequeños */}
      <div className="flex-1 max-w-lg hidden sm:flex ml-2 md:ml-0">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={20} />
          </span>
          <input
            className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary dark:text-white placeholder-slate-400 outline-none transition-all"
            placeholder="Search..."
            type="text"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        {/* Botón de búsqueda solo visible en móvil (opcional) */}
        <button className="sm:hidden p-2 text-slate-600 dark:text-slate-300">
          <Search size={20} />
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-slate-200 dark:border-slate-700">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
              {isLoading ? "Cargando..." : (companyData?.nombreComercial || "Mi Empresa")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{role?.toLowerCase() || "Admin"}</p>
          </div>
          <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-white dark:ring-slate-800 shrink-0 overflow-hidden transition-all hover:bg-primary hover:text-white">
            {companyData?.logoUrl ? (
              <img src={companyData.logoUrl} alt="Logo" className="h-full w-full object-contain p-1" />
            ) : (
              <UserIcon size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};