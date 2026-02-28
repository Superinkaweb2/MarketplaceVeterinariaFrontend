import { useState, useEffect } from "react";
import { Search, Plus, Layers, Edit2, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { adminService } from "../services/adminService";
import { CategoryModal } from "../components/CategoryModal";
import type { Category, CreateCategoryRequest } from "../types/admin.types";
import Swal from "sweetalert2";

export const CategoriasPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<number>>(new Set());

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCategories();
      // Ordenar por 'orden' primero, luego por nombre
      const sorted = [...data].sort((a, b) => {
        if (a.orden !== b.orden) return a.orden - b.orden;
        return a.nombre.localeCompare(b.nombre);
      });
      setCategories(sorted);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data: CreateCategoryRequest) => {
    try {
      await adminService.createCategory(data);
      Swal.fire({
        title: "¡Creada!",
        text: "La categoría se ha creado correctamente.",
        icon: "success",
        customClass: { popup: "rounded-2xl" }
      });
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la categoría.",
        icon: "error",
        customClass: { popup: "rounded-2xl" }
      });
    }
  };

  const handleUpdate = async (data: CreateCategoryRequest) => {
    if (!editingCategory) return;
    try {
      await adminService.updateCategory(editingCategory.id, data);
      Swal.fire({
        title: "¡Actualizada!",
        text: "La categoría se ha actualizado correctamente.",
        icon: "success",
        customClass: { popup: "rounded-2xl" }
      });
      setIsModalOpen(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la categoría.",
        icon: "error",
        customClass: { popup: "rounded-2xl" }
      });
    }
  };

  const handleDelete = async (category: Category) => {
    const result = await Swal.fire({
      title: "¿Eliminar categoría?",
      text: `¿Estás seguro de eliminar "${category.nombre}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl",
        cancelButton: "rounded-xl"
      }
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteCategory(category.id);
        fetchCategories();
        Swal.fire({
          title: "¡Eliminada!",
          text: "Categoría eliminada con éxito.",
          icon: "success",
          customClass: { popup: "rounded-2xl" }
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la categoría. Asegúrate de que no tenga productos asociados.",
          icon: "error",
          customClass: { popup: "rounded-2xl" }
        });
      }
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedParents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedParents(newExpanded);
  };

  const filteredCategories = categories.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rootCategories = filteredCategories.filter(c => !c.padreId);
  const getSubcategories = (parentId: number) => filteredCategories.filter(c => c.padreId === parentId);

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Categorías del Catálogo
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Gestiona la jerarquía de categorías para productos y servicios del marketplace.
          </p>
        </div>
        <Button 
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          <span>Nueva Categoría</span>
        </Button>
      </div>

      {/* Search */}
      <div className="shrink-0 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-auto custom-scrollbar bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4 animate-pulse">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl" />
              ))}
            </div>
          ) : rootCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Layers size={64} className="text-slate-200 dark:text-slate-800 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sin categorías</h3>
              <p className="text-slate-500">Comienza creando tu primera categoría principal.</p>
            </div>
          ) : (
            rootCategories.map((cat) => {
              const subs = getSubcategories(cat.id);
              const isExpanded = expandedParents.has(cat.id);
              
              return (
                <div key={cat.id} className="space-y-1">
                  {/* Parent Row */}
                  <div className={`flex items-center gap-2 p-3 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${!cat.activo ? 'opacity-60' : ''}`}>
                    <button 
                      onClick={() => toggleExpand(cat.id)}
                      className={`p-1 rounded-md text-slate-400 hover:text-primary transition-colors ${subs.length === 0 ? 'invisible' : ''}`}
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {cat.iconoUrl ? <img src={cat.iconoUrl} alt="" className="w-6 h-6" /> : cat.nombre.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate">{cat.nombre}</span>
                        {!cat.activo && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-100 text-red-600 font-bold uppercase">Inactiva</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{cat.slug}</p>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingCategory(cat);
                          setIsModalOpen(true);
                        }}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(cat)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && subs.length > 0 && (
                    <div className="ml-10 space-y-1 pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                      {subs.map(sub => (
                        <div key={sub.id} className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group ${!sub.activo ? 'opacity-60' : ''}`}>
                          <div className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-sm">
                            {sub.nombre.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{sub.nombre}</span>
                            <p className="text-[10px] text-slate-400 font-mono">{sub.slug}</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingCategory(sub);
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(sub)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingCategory ? handleUpdate : handleCreate}
        category={editingCategory}
        allCategories={categories}
        isLoading={false}
      />
    </div>
  );
};
