import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/context/useAuth";
import {
  LayoutDashboard,
  Stethoscope,
  Package,
  CreditCard,
  Users,
  Settings,
  LogOut,
  X,
  Heart,
  Inbox,
  Zap,
  Search,
} from "lucide-react";


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* OVERLAY (Fondo oscuro) - Solo visible en móvil cuando el menú está abierto */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50 h-full w-64 flex-col bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          flex
        `}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            {/* Branding Header con Botón de Cierre para Móvil */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <img
                  src="/LOGO HUELLA360_logo primario.png"
                  alt="Logo Huella360"
                  className="h-8 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col">
                  <h1 className="text-slate-900 dark:text-white text-base font-bold leading-none">
                    Huella360
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mt-1">
                    Business Admin
                  </p>
                </div>
              </div>
              {/* Botón X solo visible en móvil */}
              <button
                onClick={onClose}
                className="md:hidden p-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <NavItem
                icon={<LayoutDashboard size={20} />}
                label="Dashboard"
                to="/portal/empresa"
                end
              />
              <NavItem
                icon={<Stethoscope size={20} />}
                label="Servicios"
                to="/portal/empresa/servicios"
              />
              <NavItem
                icon={<Heart size={20} />}
                label="Adopciones"
                to="/portal/empresa/adopciones"
              />
              <NavItem
                icon={<Inbox size={20} />}
                label="Mis Adopciones"
                to="/portal/empresa/mis-adopciones"
              />
              <NavItem
                icon={<Package size={20} />}
                label="Productos"
                to="/portal/empresa/productos"
              />
              <NavItem
                icon={<Users size={20} />}
                label="Equipo"
                to="/portal/empresa/equipo"
              />
              <NavItem
                icon={<Search size={20} />}
                label="Talento"
                to="/portal/empresa/talento"
              />
              <NavItem
                icon={<Zap size={20} />}
                label="Mi Suscripción"
                to="/portal/empresa/suscripcion"
              />
              <NavItem
                icon={<CreditCard size={20} />}
                label="Facturación"
                to="/portal/empresa/facturacion"
              />
            </nav>
          </div>

          {/* Bottom Nav */}
          <div className="flex flex-col gap-1 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
            <NavItem
              icon={<Settings size={20} />}
              label="Configuración"
              to="/portal/empresa/configuracion"
            />
            {/* LogOut handled here */}
            <button
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem = ({
  icon,
  label,
  to,
  end = false,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
}) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${isActive
        ? "bg-primary-light/10 text-primary dark:bg-primary/20 dark:text-white"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={isActive ? "text-primary dark:text-white" : ""}>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </>
    )}
  </NavLink>
);