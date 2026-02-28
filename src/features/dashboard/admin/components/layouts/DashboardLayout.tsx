import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Bell, ChevronRight, Home } from "lucide-react";
import { ThemeToggle } from "../../../../../components/ui/ThemeToggle";

export const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2">
              <li>
                <a
                  className="text-gray-400 hover:text-primary transition-colors"
                  href="#"
                >
                  <Home size={20} />
                </a>
              </li>
              <li className="text-gray-400">
                <ChevronRight size={14} />
              </li>
              <li>
                <span className="text-sm font-medium text-primary">
                  Overview
                </span>
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark"></span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};
