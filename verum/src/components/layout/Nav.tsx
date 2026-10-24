import { Link, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { ThemeSwitch } from "@/components/ui/ThemeSwitch";

export function Nav() {
  const navigate = useNavigate();
  const { user, toggleDrawer } = useAppStore();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 0.84, 0.44, 1] }}
      className="sticky top-0 z-50 bg-bg transition-colors duration-300"
    >
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between gap-2 md:gap-4">
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDrawer}
            className="w-10 h-10 rounded-lg flex items-center justify-center text-ink-2 hover:bg-black/5 hover:text-ink transition-colors -ml-2"
            aria-label="Меню"
          >
            <Menu size={22} />
          </button>
          <Link to="/" className="font-bold text-[19px] md:text-[21px] tracking-tight whitespace-nowrap">
            Верум<span className="text-accent">.</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeSwitch />
          <div className="w-px h-6 bg-line mx-1 hidden sm:block" />
          {user ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="h-[36px] md:h-[38px] px-3 md:px-4 inline-flex items-center justify-center rounded-lg bg-ink text-bg text-[13px] md:text-[13.5px] font-medium hover:opacity-90 transition-opacity"
            >
              Кабинет
            </button>
          ) : (
            <button
              onClick={() => navigate("/register")}
              className="h-[36px] md:h-[38px] px-3 md:px-4 inline-flex items-center justify-center rounded-lg bg-accent text-white text-[13px] md:text-[13.5px] font-medium hover:bg-accent-2 transition-colors"
            >
              Регистрация
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
