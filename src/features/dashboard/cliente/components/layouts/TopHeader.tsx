import { useState, useEffect } from "react";
import { Search, Menu, User as UserIcon } from "lucide-react";
import { useAuth } from "../../../../auth/context/useAuth";
import { clienteService } from "../../services/clienteService";
import type { ClienteProfile } from "../../types/cliente.types";

interface TopHeaderProps {
    onMenuClick: () => void;
}

export const TopHeader = ({ onMenuClick }: TopHeaderProps) => {
    const { role } = useAuth();
    const [profile, setProfile] = useState<ClienteProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await clienteService.getMyProfile();
                setProfile(data);
            } catch (error) {
                console.error("Error fetching cliente profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const displayName = profile
        ? `${profile.nombres} ${profile.apellidos}`.trim()
        : "Usuario";

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
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[150px]">
                            {isLoading ? "Cargando..." : displayName}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                            {role || "Cliente"}
                        </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 transition-all hover:bg-primary hover:text-white overflow-hidden shrink-0 ring-2 ring-white dark:ring-slate-800">
                        {profile?.fotoPerfilUrl ? (
                            <img
                                src={profile.fotoPerfilUrl}
                                alt={displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <UserIcon size={20} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};