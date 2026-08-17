import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      className="theme-toggle inline-flex items-center rounded-full border p-1"
    >
      <div className="relative flex h-8 w-[4.4rem] items-center rounded-full bg-black/6 px-1">
        <motion.div
          animate={{ x: isDark ? 34 : 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-[0_10px_18px_rgba(25,25,25,0.16)]"
        />

        <div className="relative z-10 flex w-full items-center justify-between px-1 text-[11px] font-semibold">
          <span className={isDark ? "text-black/30" : "text-[#c58b1d]"}>L</span>
          <span className={isDark ? "text-[#7b86aa]" : "text-black/30"}>D</span>
        </div>
      </div>
    </button>
  );
}
