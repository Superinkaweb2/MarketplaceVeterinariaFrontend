import { useEffect, useState, useCallback } from "react";
import { MarketplaceSidebar } from "../components/MarketplaceSidebar";
import { ProductCard } from "../components/ProductCard";
import { marketplaceService } from "../services/marketplaceService";
import type { Product, MarketplaceFilters } from "../types/marketplace";

export const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    page: 0,
    size: 12,
    sort: 'desc'
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (filters.category === -1) {
        const data = await marketplaceService.searchAdoptions(filters.page, filters.size);
        const mappedAdoptions: Product[] = data.content.map((a: any) => ({
          id: `adoption_${a.id}` as any,
          nombre: a.titulo,
          descripcion: a.historia,
          precio: 0,
          precioActual: 0,
          stock: 1,
          imagenes: a.mascotaFotoUrl ? [a.mascotaFotoUrl] : [],
          categoriaId: -1,
          categoriaNombre: "Adopción",
          empresaId: a.publicadoPorId,
          empresaNombre: a.publicadoPorNombre || "Dueño Particular",
          badge: { text: "Adopción", style: "adoption" }
        }));
        setProducts(mappedAdoptions);
      } else {

        const data = await marketplaceService.searchProducts(filters);
        setProducts(data.content);
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);


  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("search") as string;
    setFilters(prev => ({ ...prev, q, page: 0 }));
  };

  const handleCategorySelect = (categoryId?: number) => {
    setFilters(prev => ({ ...prev, category: categoryId, page: 0 }));
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950">
      <div className="flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <MarketplaceSidebar
          selectedCategory={filters.category}
          onSelectCategory={handleCategorySelect}
        />

        <main className="flex-1">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {filters.category === -1 ? "Adopciones" : "Marketplace"}
              </h1>
              <p className="text-slate-500">
                {filters.category === -1
                  ? "Encuentra a tu nuevo mejor amigo."
                  : "Productos premium para tu mascota."}
              </p>
            </div>


            <form onSubmit={handleSearch} className="flex-1 max-w-md w-full">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                />
              </div>
            </form>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 bg-slate-100 dark:bg-slate-900 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-700 mb-4">inventory_2</span>
              <p className="text-slate-500 dark:text-slate-400 text-lg">No se encontraron productos.</p>
              <button
                onClick={() => setFilters({ page: 0, size: 12, sort: 'desc' })}
                className="mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};