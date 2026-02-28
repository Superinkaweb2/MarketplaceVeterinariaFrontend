import { Menu } from "lucide-react";
import { ThemeToggle } from "../../../../../components/ui/ThemeToggle";

interface VetHeaderProps {
    onMenuClick: () => void;
}

export const VetHeader = ({ onMenuClick }: VetHeaderProps) => {
    return (
        <header className="h-14 shrink-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 md:px-6">
            {/* Left: Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-surface-darker transition-colors"
            >
                <Menu size={22} />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden lg:block" />

            {/* Right: actions */}
            <div className="flex items-center gap-3">
                <ThemeToggle />
            </div>
        </header>
    );
};
