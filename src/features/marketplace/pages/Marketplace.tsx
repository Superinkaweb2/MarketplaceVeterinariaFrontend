import { useEffect, useState, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { MarketplaceSidebar } from "../components/MarketplaceSidebar";
import { ProductCard } from "../components/ProductCard";
import { marketplaceService } from "../services/marketplaceService";
import { mapAdoptionToProduct, mapServiceToProduct } from "../utils/productAdapter";
import { Seo } from "../../../components/Seo";
import type { Product, AdoptionResponse, ServiceResponse, MarketplaceFilters } from "../types/marketplace";

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name';

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Más recientes',
  'price-asc': 'Menor precio',
  'price-desc': 'Mayor precio',
  name: 'A - Z',
};

export const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [filters, setFilters] = useState<MarketplaceFilters>({
    page: 0,
    size: 12,
    sort: 'desc'
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortParam = useMemo(() => {
    switch (sortBy) {
      case 'price-asc': return 'precioActual,asc';
      case 'price-desc': return 'precioActual,desc';
      case 'name': return 'nombre,asc';
      case 'newest':
      default: return 'desc';
    }
  }, [sortBy]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      if (filters.category === -1) {
        const data = await marketplaceService.searchAdoptions(filters.page, filters.size);
        const mappedAdoptions: Product[] = data.content.map((a: AdoptionResponse) => mapAdoptionToProduct(a));
        setProducts(mappedAdoptions);
        setTotalElements(data.totalElements || mappedAdoptions.length);
      } else if (filters.category === -2) {
        const data = await marketplaceService.searchServices(filters.page, filters.size, filters.q);
        const mappedServices: Product[] = data.content.map((s: ServiceResponse) => mapServiceToProduct(s));
        setProducts(mappedServices);
        setTotalElements(data.totalElements || mappedServices.length);
      } else {
        const productData = await marketplaceService.searchProducts({ ...filters, sort: sortParam });
        const mappedProducts: Product[] = productData.content.map((p: Product) => ({
          ...p,
          itemType: 'product' as const
        }));

        if (!filters.category) {
          try {
            const serviceData = await marketplaceService.searchServices(0, 6, filters.q);
            const mappedServices: Product[] = serviceData.content.map((s: ServiceResponse) => mapServiceToProduct(s));
            setProducts([...mappedProducts, ...mappedServices]);
          } catch {
            setProducts(mappedProducts);
          }
        } else {
          setProducts(mappedProducts);
        }
        setTotalElements(productData.totalElements || mappedProducts.length);
      }
    } catch (error) {
      console.error("Error fetching marketplace data:", error);
      toast.error("No se pudieron cargar los productos. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [filters, sortParam]);

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

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    setShowSortDropdown(false);
    setFilters(prev => ({ ...prev, page: 0 }));
  };

  const totalPages = Math.ceil(totalElements / (filters.size || 12));

  const categoryTitle = filters.category === -1
    ? "Adopciones"
    : filters.category === -2
      ? "Servicios Médicos"
      : "Marketplace";

  const categorySubtitle = filters.category === -1
    ? "Encuentra a tu nuevo mejor amigo."
    : filters.category === -2
      ? "Reserva citas con los mejores especialistas."
      : "Productos premium para tu mascota.";

  return (
    <div className="w-full bg-slate-50">
      <Seo title="Marketplace" description="Explora productos, servicios veterinarios y opciones de adopción para tu mascota en Huella360." />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <a href="/" className="hover:text-blue-600 transition-colors">Inicio</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-slate-900 font-medium">{categoryTitle}</span>
            {filters.q && (
              <>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="text-blue-600">"{filters.q}"</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        <MarketplaceSidebar
          selectedCategory={filters.category}
          onSelectCategory={handleCategorySelect}
        />

        <main className="flex-1 min-w-0">
          {/* Header + Filters */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{categoryTitle}</h1>
                <p className="text-slate-500 text-sm mt-0.5">{categorySubtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">sort</span>
                    {SORT_LABELS[sortBy]}
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>

                  {showSortDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1">
                        {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => handleSortChange(key)}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${sortBy === key
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-md">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                <input
                  type="text"
                  name="search"
                  defaultValue={filters.q || ''}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                />
              </div>
            </form>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-slate-500 mb-4">
              {totalElements} {totalElements === 1 ? 'resultado' : 'resultados'}
            </p>
          )}

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={filters.page === 0}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (filters.page! < 3) {
                      pageNum = i;
                    } else if (filters.page! > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = filters.page! - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${filters.page === pageNum
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={filters.page! >= totalPages - 1}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">inventory_2</span>
              <p className="text-slate-500 text-lg mb-1">No se encontraron productos</p>
              <p className="text-slate-400 text-sm mb-4">Intenta con otros filtros o términos de búsqueda</p>
              <button
                onClick={() => {
                  setFilters({ page: 0, size: 12, sort: 'desc' });
                  setSortBy('newest');
                }}
                className="text-blue-600 font-medium text-sm hover:underline"
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
