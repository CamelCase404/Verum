import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, User, LogOut, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Drawer() {
  const { drawerOpen, toggleDrawer, user, setUser } = useAppStore();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("verum_token");
    if (setUser) setUser(null);
    window.location.href = "/";
  };

  const navItems = [
    { title: "ПЛАТФОРМА", links: [
      { name: "Главная", path: "/" },
      ...(user?.role === "admin" ? [{ name: "🛡️ Модерация", path: "/admin" }] : []),
      { name: "О проекте", path: "/about" },
      { name: "Как работает", path: "/how" },
      { name: "Уровни проверки", path: "/levels" },
      { name: "Тарифы и комиссия", path: "/pricing" },
      { name: "Для компаний", path: "/clients" },
      { name: "Для специалистов", path: "/specialists" },
    ]},
    { title: "МАТЕРИАЛЫ", links: [
      
      { name: "Блог", path: "/blog" },
      { name: "Вопросы и ответы", path: "/faq" },
      { name: "Центр помощи", path: "/help" },
    ]},
    { title: "КОМПАНИЯ", links: [
      
      { name: "Контакты", path: "/contacts" },
      { name: "Статус сервиса", path: "/status" },
    ]}
  ];

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={toggleDrawer} 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.aside 
            initial={{ x: "-100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "-100%" }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-surface border-r border-line z-[101] flex flex-col shadow-2xl"
          >
            {/* Шапка меню */}
            <div className="p-5 flex items-center justify-between border-b border-line">
              <Link to="/" onClick={toggleDrawer} className="font-bold text-xl">Верум<span className="text-accent">.</span></Link>
              <button onClick={toggleDrawer} className="text-ink-3 hover:text-ink"><X size={20} /></button>
            </div>

            

            {/* Основной список */}
            <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              {navItems.map((group) => (
                <div key={group.title} className="mb-6">
                  <div className="px-5 mb-2 text-[11px] font-semibold text-ink-3 uppercase tracking-wider">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {group.links.map((link) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <Link
                          key={link.name}
                          to={link.path}
                          onClick={toggleDrawer}
                          className={`block px-5 py-2 text-[14px] transition-colors ${
                            isActive ? "text-accent font-medium bg-accent/5 border-r-2 border-accent" : "text-ink-2 hover:text-ink hover:bg-surface-2"
                          }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка выхода (внизу) */}
            {user && (
              <div className="p-4 border-t border-line">
                <button
                  onClick={handleLogout}
                  className="w-full h-[42px] rounded-lg border border-line-2 text-ink-2 hover:text-red-500 hover:bg-red-500/10 transition-colors text-[14px] flex items-center justify-center gap-2"
                >
                  <LogOut size={16} /> Выйти
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
