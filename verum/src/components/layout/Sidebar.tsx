import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Building2, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const GROUPS = [
  { title: "Платформа", items: [
    { path: "/", label: "Главная" },
    { path: "/about", label: "О проекте" },
    { path: "/how", label: "Как работает" },
    { path: "/levels", label: "Уровни проверки" },
    { path: "/pricing", label: "Тарифы и комиссия" },
    { path: "/clients", label: "Для компаний" },
    { path: "/specialists", label: "Для специалистов" },
  ]},
  { title: "Материалы", items: [
    { path: "/cases", label: "Кейсы" },
    { path: "/blog", label: "Блог" },
    { path: "/faq", label: "Вопросы и ответы" },
    { path: "/help", label: "Центр помощи" },
  ]},
  { title: "Компания", items: [
    { path: "/partners", label: "Партнёры" },
    { path: "/press", label: "Пресс-центр" },
    { path: "/careers", label: "Вакансии" },
    { path: "/contacts", label: "Контакты" },
    { path: "/status", label: "Статус сервиса" },
    { path: "/changelog", label: "Обновления" },
    { path: "/roadmap", label: "Дорожная карта" },
  ]},
  { title: "Документы", items: [
    { path: "/terms", label: "Соглашение" },
    { path: "/privacy", label: "Конфиденциальность" },
  ]},
];

export function Drawer() {
  const { drawerOpen, toggleDrawer, user, reset } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuth = (path: string) => {
    toggleDrawer();
    navigate(path);
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-[200] bg-ink/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-[201] w-[min(320px,90vw)] bg-surface border-r border-line shadow-2xl flex flex-col"
          >
            {/* Header inside drawer */}
            <div className="p-5 border-b border-line flex items-center justify-between shrink-0">
              <Link
                to="/"
                onClick={toggleDrawer}
                className="font-bold text-[21px] tracking-tight whitespace-nowrap"
              >
                Верум<span className="text-accent">.</span>
              </Link>
              <button
                onClick={toggleDrawer}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:bg-black/5 hover:text-ink transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable navigation list */}
            <nav className="flex-1 overflow-y-auto p-4">
              {GROUPS.map((group, gi) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + gi * 0.03, duration: 0.3 }}
                  className="mb-6"
                >
                  <div className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-ink-3 px-2.5 mb-2">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = location.pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={toggleDrawer}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-[14px] transition-colors",
                            active
                              ? "bg-accent-soft text-accent font-medium"
                              : "text-ink-2 hover:text-ink hover:bg-black/5 dark:hover:bg-white/5"
                          )}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </nav>

            {/* Footer with buttons inside drawer */}
            <div className="p-4 border-t border-line shrink-0 bg-surface space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => { toggleDrawer(); navigate("/dashboard"); }}
                    className="w-full h-[42px] rounded-lg bg-ink text-bg font-medium text-[14px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <ShieldCheck size={16} /> Личный кабинет
                  </button>
                  <button
                    onClick={() => { reset(); toggleDrawer(); }}
                    className="w-full h-[42px] rounded-lg border border-line-2 text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors text-[14px]"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleAuth("/register")}
                    className="w-full h-[42px] rounded-lg bg-accent text-white font-medium text-[14px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <User size={16} /> Регистрация
                  </button>
                  <button
                    onClick={() => handleAuth("/login")}
                    className="w-full h-[42px] rounded-lg border border-line-2 text-ink-2 hover:text-ink hover:bg-surface-2 transition-colors text-[14px] flex items-center justify-center gap-2"
                  >
                    <Building2 size={16} /> Войти
                  </button>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
