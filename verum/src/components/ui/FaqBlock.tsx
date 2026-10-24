import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

export function FaqBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Stagger className="max-w-[820px] mx-auto">
      {items.map((item, i) => (
        <StaggerItem key={i}>
          <FaqItem q={item.q} a={item.a} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line first:border-t">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-6 flex items-center justify-between text-[15.5px] font-medium gap-4 hover:text-accent transition-colors"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "var(--accent-soft)" : "var(--bg-2)", color: open ? "var(--accent)" : "var(--ink-2)" }}
          transition={{ duration: 0.3 }}
          className="w-7 h-7 rounded-md flex items-center justify-center text-base shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 0.84, 0.44, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-10 text-[14.5px] leading-relaxed text-ink-2">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
