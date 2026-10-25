import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

// Глобальная шина событий для вызова уведомлений
export const toast = (message: string, type: "success" | "error" = "error") => {
  const event = new CustomEvent("verum-toast", { detail: { message, type } });
  window.dispatchEvent(event);
};

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handleToast = (e: any) => {
      const id = Date.now();
      const newToast = { id, message: e.detail.message, type: e.detail.type };
      
      setToasts((prev) => [...prev, newToast]);

      // Автоматическое удаление через 4 секунды
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("verum-toast", handleToast);
    return () => window.removeEventListener("verum-toast", handleToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border min-w-[280px] max-w-sm backdrop-blur-md ${
              t.type === "success" 
                ? "bg-accent/10 border-accent/20 text-ink" 
                : "bg-surface border-line text-ink"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1 text-sm font-medium pr-2">
              {t.message}
            </div>

            <button 
              onClick={() => removeToast(t.id)} 
              className="text-ink-3 hover:text-ink transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
