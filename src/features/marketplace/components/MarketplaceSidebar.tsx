import { useEffect, useState } from "react";
import { marketplaceService } from "../services/marketplaceService";
import type { Category } from "../types/marketplace";

interface MarketplaceSidebarProps {
  selectedCategory?: number;
  onSelectCategory: (categoryId?: number) => void;
}

export const MarketplaceSidebar = ({ selectedCategory, onSelectCategory }: MarketplaceSidebarProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await marketplaceService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-8">
      <div className="flex flex-col gap-4">
        <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase">Categorías</h3>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${selectedCategory === undefined
              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            Todos los productos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${selectedCategory === cat.id
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
            >
              {cat.nombre}
            </button>
          ))}
          <div className="h-px bg-slate-200 dark:bg-slate-800 my-2" />
          <button
            onClick={() => onSelectCategory(-1)}
            className={`px-3 py-2 rounded-lg text-sm text-left transition-colors flex items-center gap-2 ${selectedCategory === -1
              ? "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">pets</span>
            Adopciones
          </button>
          <button
            onClick={() => onSelectCategory(-2)}
            className={`px-3 py-2 rounded-lg text-sm text-left transition-colors flex items-center gap-2 ${selectedCategory === -2
              ? "bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 font-medium"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">medical_services</span>
            Servicios Médicos
          </button>
        </nav>
      </div>
    </aside>
  );
};
