import { Search, Menu, NotebookIcon } from "lucide-react";
import { useAuth } from "../../../../auth/context/useAuth";

interface TopHeaderProps {
    onMenuClick: () => void;
}

export const TopHeader = ({ onMenuClick }: TopHeaderProps) => {
    const { nombre } = useAuth();

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex-shrink-0 z-20">
            {/* Mobile Menu Toggle */}
            <button
                onClick={onMenuClick}
                className="lg:hidden mr-4 p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-darker rounded-lg transition-colors"
            >
                <Menu size={24} />
            </button>

            {/* Search Bar - Mockup Style */}
            <div className="flex-1 max-w-xl hidden sm:flex">
                <div className="relative w-full group">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-primary transition-colors">
                        <Search size={18} />
                    </span>
                    <input
                        className="w-full bg-gray-50 dark:bg-surface-darker border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white placeholder-gray-400 outline-none transition-all"
                        placeholder="Buscar citas, mascotas o servicios..."
                        type="text"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker text-gray-400 hover:text-primary transition-colors border border-gray-100 dark:border-gray-800">
                    <NotebookIcon size={20} />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-surface-dark animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{nombre}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Cliente</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 transition-colors hover:bg-primary hover:text-white">
                        {nombre?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};
