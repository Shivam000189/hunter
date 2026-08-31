import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="inline-flex items-center rounded-xl p-1.5 transition border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div className="relative flex items-center gap-1.5 px-1">
        {isDark ? (
          <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20" />
        )}
        <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:inline">
          {isDark ? "Dark" : "Light"}
        </span>
      </div>
    </button>
  );
}
