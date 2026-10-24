import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { X } from "lucide-react";

const GROUPS = [
  {
    title: "Платформа",
    items: [
      { path: "/", label: "Главная" },
      { path: "/about", label: "О проекте" },
      { path: "/how", label: "Как работает" },
      { path: "/levels", label: "Уровни проверки" },
      { path: "/pricing", label: "Тарифы и комиссия" },
      { path: "/clients", label: "Для компаний" },
      { path: "/specialists", label: "Для специалистов" },
    ],
  },
  {
    title: "Материалы",
    items: [
      { path: "/cases", label: "Кейсы" },
      { path: "/blog", label: "Блог" },
      { path: "/faq", label: "Вопросы и ответы" },
      { path: "/help", label: "Центр помощи" },
    ],
  },
  {
    title: "Компания",
    items: [
      { path: "/partners", label: "Партнёры" },
      { path: "/press", label: "Пресс-центр" },
      { path: "/careers", label: "Вакансии" },
      { path: "/contacts", label: "Контакты" },
      { path: "/status", label: "Статус сервиса" },
      { path: "/changelog", label: "Обновления" },
      { path: "/roadmap", label: "Дорожная карта" },
    ],
  },
  {
    title: "Документы",
    items: [
      { path: "/terms", label: "Соглашение" },
      { path: "/privacy", label: "Конфиденциальность" },
    ],
  },
];

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function Drawer() {
  const { drawerOpen, toggleDrawer, user, reset } = useAppStore();
  const location = useLocation();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleDrawer}
            className="fixed inset-0 z-[200] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 left-0 bottom-0 z-[201] w-[min(400px,90vw)] bg-surface border-r border-line shadow-2xl flex flex-col overflow-hidden"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4, ease: EASE }}
              className="p-5 border-b border-line flex items-center justify-between shrink-0"
            >
              <Link to="/" onClick={toggleDrawer} className="font-bold text-xl tracking-tight">
                Верум<span className="text-accent">.</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDrawer}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-ink-3 hover:bg-black/5 hover:text-ink transition-colors"
                aria-label="Закрыть"
              >
                <X size={18} />
              </motion.button>
            </motion.div>

            <div className="flex-1 overflow-y-auto p-4">
              {GROUPS.map((group, gi) => (
                <motion.div
                  key={group.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + gi * 0.06, duration: 0.5, ease: EASE }}
                  className="mb-7"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-3 px-2.5 mb-2.5">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item, ii) => {
                      const active = location.pathname === item.path;
                      return (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.2 + gi * 0.06 + ii * 0.03,
                            duration: 0.4,
                            ease: EASE,
                          }}
                        >
                          <Link
                            to={item.path}
                            onClick={toggleDrawer}
                            className={`flex items-center w-full px-3 py-2.5 rounded-[9px] text-[14.5px] transition-all group ${
                              active
                                ? "bg-accent-soft text-accent font-medium"
                                : "text-ink-2 hover:bg-black/5 hover:text-ink"
                            }`}
                          >
                            <span>{item.label}</span>
                            <motion.span
                              className="ml-auto text-[12px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                              initial={{ x: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              →
                            </motion.span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
              className="p-4 border-t border-line flex flex-col gap-2 shrink-0 bg-surface"
            >
              {user ? (
                <>
                  <Link to="/dashboard" onClick={toggleDrawer} className="h-[42px] rounded-lg bg-ink text-bg font-medium flex items-center justify-center hover:opacity-90 transition-opacity">
                    Личный кабинет
                  </Link>
                  <button onClick={() => { reset(); toggleDrawer(); }} className="h-[42px] rounded-lg border border-line-2 text-ink-2 hover:text-ink hover:border-ink-4 transition-colors">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" onClick={toggleDrawer} className="h-[42px] rounded-lg bg-accent text-white font-medium flex items-center justify-center hover:bg-accent-2 transition-colors">
                    Регистрация
                  </Link>
                  <Link to="/login" onClick={toggleDrawer} className="h-[42px] rounded-lg border border-line-2 text-ink hover:bg-surface-2 transition-colors flex items-center justify-center">
                    Войти
                  </Link>
                </>
              )}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
