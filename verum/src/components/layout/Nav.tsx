import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { chatApi } from "@/api";
import { Menu, MessageSquare, User, Sun, Moon, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function Nav() {
  const { toggleDrawer, user, theme } = useAppStore();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) {
        setUnreadCount(0);
        return;
    }
    const fetchUnread = async () => {
        try {
            const res = await chatApi.getConversations();
            const total = res.data.reduce((sum: number, c: any) => sum + (c.unread || 0), 0);
            setUnreadCount(total);
        } catch (e) {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000); // Каждые 15 сек
    return () => clearInterval(interval);
  }, [user]);
  const location = useLocation();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Если в сторе есть метод setTheme, обновляем и там
    const setTheme = useAppStore.getState().setTheme;
    if (setTheme) setTheme(newTheme);
    else window.location.reload(); // Принудительная перезагрузка для применения темы, если стор не обновляется
  };

  return (
    // Убрали max-w-[1280px], чтобы шапка растянулась на всю ширину, и добавили px-6
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="w-full px-2 sm:px-4 md:px-8 h-14 md:h-16 flex items-center justify-between gap-2">
        
        {/* ЛЕВАЯ СТОРОНА: Бургер и Лого */}
        <div className="flex items-center gap-4">
          <button onClick={toggleDrawer} className="p-2 -ml-2 text-ink-2 hover:text-ink transition-colors">
            <Menu size={24} />
          </button>
          <Link to="/" className="font-bold text-xl tracking-tight">
            Верум<span className="text-accent">.</span>
          </Link>
        </div>

        {/* ПРАВАЯ СТОРОНА: Тумблер темы и Кнопки */}
        <div className="flex items-center gap-1.5 sm:gap-3 md:gap-5">
          
          {/* Плавный переключатель темы (Тумблер) */}
          <button 
            onClick={toggleTheme} 
            className="hidden sm:inline-flex relative h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none border border-line-2 bg-surface-2"
            title="Переключить тему"
          >
            <span className="sr-only">Переключить тему</span>
            
            {/* Иконки внутри тумблера */}
            <span className={`absolute left-1.5 transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}>
              <Moon size={12} className="text-ink-4" />
            </span>
            <span className={`absolute right-1.5 transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-100"}`}>
              <Sun size={12} className="text-ink-4" />
            </span>

            {/* Сам ползунок */}
            <span
              className={`inline-block h-5 w-5 transform rounded-full shadow-sm ring-0 transition-transform duration-300 ease-in-out ${
                theme === "dark" ? "translate-x-6 bg-accent" : "translate-x-1 bg-white"
              }`}
            />
          </button>

          
          <button 
            onClick={toggleTheme} 
            className="sm:hidden p-2 text-ink-2 hover:text-accent transition-colors flex items-center justify-center"
            title="Переключить тему"
          >
            {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
<div className="w-px h-6 bg-line hidden sm:block"></div>

          {/* Кнопки авторизации / навигации */}
          {user ? (
            <div className="flex items-center gap-2">
              
              {/* КНОПКА АДМИНА */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-sm font-semibold hover:bg-red-500/20 transition-colors"
                  title="Панель модератора"
                >
                  <ShieldCheck size={18} />
                  <span className="hidden md:inline">Модерация</span>
                </Link>
              )}

              <Link 
                to="/messages" 
                className="relative flex items-center justify-center gap-1.5 p-2 md:px-3 md:py-2 rounded-lg text-sm font-medium text-ink-2 hover:text-accent hover:bg-surface-2 transition-colors"
                title="Сообщения"
              >
                <MessageSquare size={20} className="md:w-[18px] md:h-[18px]" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-surface"></span>
                )}
                <span className="hidden lg:inline">Сообщения</span>
              </Link>
              
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-2 border border-line text-ink text-sm font-medium hover:bg-surface-3 transition-colors shadow-sm"
              >
                <User size={18} />
                <span className="hidden lg:inline">Кабинет</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-2 md:px-4 py-2 text-sm font-medium hover:text-accent transition-colors text-center">
                Войти
              </Link>
              <Link to="/register" className="px-3 py-2 md:px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-2 transition-colors shadow-sm text-center">
                Регистрация
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </header>
  );
}
