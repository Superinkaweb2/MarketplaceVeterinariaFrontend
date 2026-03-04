import { useState, useEffect } from "react";
import { Search, Filter, Building2, Eye, Ban, CheckCircle } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { adminService } from "../services/adminService";
import type { Company } from "../types/admin.types";
import Swal from "sweetalert2";

export const EmpresasPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCompanies(0, 50);
      setCompanies(data.content);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleToggleStatus = async (company: Company) => {
    const isVerified = company.estadoValidacion === 'VERIFICADO';
    const result = await Swal.fire({
      title: isVerified ? '¿Desactivar empresa?' : '¿Activar empresa?',
      text: `La empresa ${company.nombreComercial} cambiará su estado de validación.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isVerified ? '#ef4444' : '#10b981',
      confirmButtonText: isVerified ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    });

    if (result.isConfirmed) {
      try {
        await adminService.toggleCompanyStatus(company.id);
        const nextStatus = isVerified ? 'RECHAZADO' : 'VERIFICADO';
        setCompanies(companies.map(c =>
          c.id === company.id ? { ...c, estadoValidacion: nextStatus as any } : c
        ));
        Swal.fire({
          title: '¡Éxito!',
          text: 'Estado actualizado correctamente.',
          icon: 'success',
          customClass: { popup: 'rounded-2xl' }
        });
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado.',
          icon: 'error',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  };

  const filteredCompanies = companies.filter(c =>
    c.nombreComercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ruc.includes(searchTerm)
  );

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestión de Empresas
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Administra los tenants (clínicas y petshops) registrados en la plataforma.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="shrink-0 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o RUC..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary dark:text-white transition-all outline-none placeholder:text-slate-400 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <Filter size={18} className="text-slate-500" />
          <span className="font-medium">Filtros</span>
        </Button>
      </div>

      {/* Table Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar">
          {/* Desktop View */}
          <div className="hidden md:block min-w-[1000px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Empresa</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">RUC</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Contacto</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Estado</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4 h-20 bg-slate-50/30 dark:bg-slate-800/10"></td>
                    </tr>
                  ))
                ) : filteredCompanies.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <Building2 size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No hay empresas</h3>
                        <p className="text-sm text-slate-500">No encontramos coincidencias para tu búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company) => (
                    <tr key={company.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold">
                            {company.nombreComercial.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{company.nombreComercial}</p>
                            <p className="text-xs text-slate-500 truncate">{company.emailContacto}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {company.ruc}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700 dark:text-slate-300">{company.telefonoContacto}</span>
                          <span className="text-xs text-slate-500 truncate max-w-[200px]">{company.direccion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${company.estadoValidacion === 'VERIFICADO'
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : company.estadoValidacion === 'PENDIENTE'
                            ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400'
                          }`}>
                          {company.estadoValidacion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button title="Ver detalles" className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                            <Eye size={18} />
                          </button>
                          <button
                            title={company.estadoValidacion === 'VERIFICADO' ? "Desactivar" : "Activar"}
                            onClick={() => handleToggleStatus(company)}
                            className={`p-2 rounded-lg transition-colors ${company.estadoValidacion === 'VERIFICADO'
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                              }`}
                          >
                            {company.estadoValidacion === 'VERIFICADO' ? <Ban size={18} /> : <CheckCircle size={18} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden flex flex-col p-4 gap-4">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 font-bold text-xl">
                    {company.nombreComercial.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{company.nombreComercial}</h3>
                    <p className="text-xs text-slate-500 truncate">{company.emailContacto}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${company.estadoValidacion === 'VERIFICADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {company.estadoValidacion}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-400 uppercase font-semibold text-[10px]">RUC</p>
                    <p className="dark:text-white font-mono">{company.ruc}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 uppercase font-semibold text-[10px]">Teléfono</p>
                    <p className="dark:text-white">{company.telefonoContacto}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700">
                  <Button variant="outline" className="flex-1 text-xs py-2 h-auto rounded-lg">Detalles</Button>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(company)}
                    className={`flex-1 text-xs py-2 h-auto rounded-lg ${company.estadoValidacion === 'VERIFICADO' ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                  >
                    {company.estadoValidacion === 'VERIFICADO' ? 'Desactivar' : 'Activar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Section */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-500">
            Mostrando <span className="text-slate-900 dark:text-white">{filteredCompanies.length}</span> empresas
          </span>
          <div className="flex gap-2">
            <Button variant="outline" className="text-sm px-4 py-2 h-auto" disabled>Anterior</Button>
            <Button variant="outline" className="text-sm px-4 py-2 h-auto" disabled>Siguiente</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
