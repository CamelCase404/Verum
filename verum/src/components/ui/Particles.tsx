import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Particles() {
  const [parts, setParts] = useState<{ id: number; x: number; y: number; size: number; dur: number; delay: number }[]>([]);

  useEffect(() => {
    const newParts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      dur: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParts(newParts);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {parts.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-accent opacity-20 blur-[1px]"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{
            y: ["0%", "-100%", "0%"],
            x: ["0%", "50%", "0%"],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "linear", delay: p.delay }}
        />
      ))}
    </div>
  );
}
