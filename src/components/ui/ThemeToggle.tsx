import { useTheme } from "../../hooks/useTheme"; 
export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#e7ecf3] dark:bg-slate-800 text-[#0d131b] dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
    >
      <span className="material-symbols-outlined text-[20px]">
        {theme === "light" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
};