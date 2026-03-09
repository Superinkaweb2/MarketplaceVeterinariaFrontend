import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { ThemeToggle } from "../ui/ThemeToggle";
import { useAuth } from "../../features/auth/context/useAuth";
import { UserDropdown } from "../UserDropdown";

export const Header = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Empresas", path: "/empresas" },
    { name: "Marketplace", path: "/marketplace" },
  ];

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7ecf3] dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md px-10 py-3">
      <Link
        to="/home"
        className="flex items-center hover:opacity-80 transition-opacity"
      >
        <div className="flex items-center justify-center">
          <img
            src="/LOGO HUELLA60-logo secundario.png"
            alt="Logo Huella360"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </div>
      </Link>

      <div className="flex flex-1 justify-end gap-8">
        <div className="hidden md:flex items-center gap-9">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`text-sm font-medium leading-normal transition-colors ${location.pathname === item.path
                ? "text-primary font-bold"
                : "text-[#0d131b] dark:text-slate-300 hover:text-primary"
                }`}
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex gap-2">
          {!isAuthenticated ? (
            <>
              <Link to="/register">
                <Button
                  variant="primary"
                  className="min-w-21 h-10 px-4 text-sm"
                >
                  Prueba Gratis
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="secondary"
                  className="min-w-21 h-10 px-4 text-sm"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};