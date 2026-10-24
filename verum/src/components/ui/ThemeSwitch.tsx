import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitch() {
  const { theme, setTheme } = useAppStore();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-[64px] h-[32px] rounded-full bg-surface-3 border border-line p-1 flex items-center cursor-pointer shadow-inner overflow-hidden transition-colors duration-300"
      title="Переключить тему"
      aria-label="Переключить тему"
    >
      {/* Иконки на фоне (плавно меняют цвет) */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none">
        <Sun size={14} className={`transition-colors duration-300 ${!isDark ? "text-amber" : "text-ink-4"}`} />
        <Moon size={14} className={`transition-colors duration-300 ${isDark ? "text-accent" : "text-ink-4"}`} />
      </div>

      {/* Ползунок (более мягкая пружина) */}
      <motion.div
        className="relative z-10 w-[24px] h-[24px] rounded-full bg-surface shadow-md flex items-center justify-center"
        animate={{ x: isDark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }} // Сделали пружину мягче
      >
        {isDark ? (
          <Moon size={12} className="text-accent" />
        ) : (
          <Sun size={12} className="text-amber" />
        )}
      </motion.div>
    </button>
  );
}
