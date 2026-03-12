import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  PawPrint,
  ShoppingBag,
  Settings,
  LogOut,
  ChevronLeft,
  X,
  Heart,
  Calendar,
  CalendarCheck,
  Package,
  Award
} from "lucide-react";
import { useAuth } from "../../../../auth/context/useAuth";

const MENU_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/portal/cliente", end: true },
  { label: "Mis Mascotas", icon: PawPrint, href: "/portal/cliente/mascotas" },
  { label: "Adopciones", icon: Heart, href: "/portal/cliente/adopciones" },
  { label: "Mis Solicitudes", icon: Heart, href: "/portal/cliente/mis-solicitudes" },
  { label: "Mis Servicios", icon: Calendar, href: "/portal/cliente/servicios" },
  { label: "Mis Citas", icon: CalendarCheck, href: "/portal/cliente/citas" },
  { label: "Marketplace", icon: ShoppingBag, href: "/marketplace" },
  { label: "Mis Pedidos", icon: Package, href: "/portal/cliente/compras" },
  { label: "Mis Puntos", icon: Award, href: "/portal/cliente/puntos" },
];

interface SidebarProps {
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({ isMobileOpen, setMobileOpen }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 transition-all duration-300
        lg:static lg:translate-x-0 h-full
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-20" : "w-64"}
      `}
      >
        {/* Header / Branding */}
        <div className="h-16 flex items-center justify-between px-6 shrink-0 border-b border-gray-100 dark:border-gray-800">
          {!isCollapsed && (
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/LOGO HUELLA360_logo primario.png"
                alt="Logo Huella360"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Huella360
              </span>
            </Link>
          )}
          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X size={20} />
          </button>
          {isCollapsed && (
            <div className="flex items-center justify-center mx-auto">
              <img
                src="/LOGO HUELLA360_logo primario.png"
                alt="Logo Huella360"
                className="h-8 w-auto object-contain"
              />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={18} className={`transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {MENU_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.href}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group
              ${isActive
                  ? "bg-primary/10 text-primary dark:text-primary-light"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-darker hover:text-gray-900 dark:hover:text-gray-200"}
            `}
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <item.icon size={20} className={isActive ? "text-primary" : "text-gray-400 group-hover:text-primary transition-colors"} />
                  {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <Link
            to="/portal/cliente/configuracion"
            className={`
            flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-darker hover:text-gray-900 transition-all
            ${isCollapsed ? "justify-center" : ""}
          `}
          >
            <Settings size={20} className="text-gray-400" />
            {!isCollapsed && <span className="text-sm">Configuración</span>}
          </Link>
          <button
            onClick={logout}
            className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all
            ${isCollapsed ? "justify-center" : ""}
          `}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="text-sm">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
};