import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export function Modal({ children, onClose, size = "md" }: ModalProps) {
    useEffect(() => {
        const scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    

  

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-ink/50 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 0.84, 0.44, 1] }}
        className={cn(
          "bg-surface border border-line rounded-2xl shadow-2xl w-full relative my-auto",
          size === "sm" && "max-w-[420px]",
          size === "md" && "max-w-[560px]",
          size === "lg" && "max-w-[760px]"
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:bg-black/5 hover:text-ink transition-colors z-10"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        {children}
      </motion.div>
    </div>,
    document.body
  );
}
