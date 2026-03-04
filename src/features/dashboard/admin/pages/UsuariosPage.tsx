import { useState, useEffect } from "react";
import { Search, Filter, Users, Shield, Ban, CheckCircle, Mail } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin.types";
import Swal from "sweetalert2";

export const UsuariosPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getUsers(0, 50);
      setUsers(data.content);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user: AdminUser) => {
    const result = await Swal.fire({
      title: user.estado ? '¿Desactivar usuario?' : '¿Activar usuario?',
      text: `El usuario ${user.correo} cambiará su estado.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: user.estado ? '#ef4444' : '#10b981',
      confirmButtonText: user.estado ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    });

    if (result.isConfirmed) {
      try {
        await adminService.toggleUserStatus(user.id);
        setUsers(users.map(u =>
          u.id === user.id ? { ...u, estado: !u.estado } : u
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

  const filteredUsers = users.filter(u => {
    const name = u.nombre?.toLowerCase() ?? "";
    const correo = u.correo?.toLowerCase() ?? "";
    const term = searchTerm.toLowerCase();

    return name.includes(term) || correo.includes(term);
  });

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-sm mt-1 text-slate-500 dark:text-slate-400">
            Control de accesos y perfiles de todos los usuarios del sistema.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="shrink-0 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
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
          <div className="hidden md:block min-w-[800px]">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Usuario</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Rol</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">Registro</th>
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
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                        <Users size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No hay usuarios</h3>
                        <p className="text-sm text-slate-500">No encontramos coincidencias para tu búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Mail size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.nombre}</p>
                            <p className="text-xs text-slate-500 truncate">{user.correo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Shield size={12} className="text-primary" />
                          {user.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${user.estado
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400'
                          }`}>
                          {user.estado ? 'ACTIVO' : 'INACTIVO'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            title={user.estado ? "Desactivar" : "Activar"}
                            onClick={() => handleToggleStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${user.estado
                              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                              }`}
                          >
                            {user.estado ? <Ban size={18} /> : <CheckCircle size={18} />}
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
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-primary">
                    <Mail size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.nombre}</h3>
                    <p className="text-xs text-slate-500 truncate">{user.correo}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                    <Shield size={10} />
                    {user.rol}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${user.estado ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {user.estado ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleStatus(user)}
                    className={`w-full text-xs py-2 h-auto rounded-lg ${user.estado ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                  >
                    {user.estado ? 'Desactivar Usuario' : 'Activar Usuario'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Section */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-medium text-slate-500">
            Mostrando <span className="text-slate-900 dark:text-white">{filteredUsers.length}</span> usuarios
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
