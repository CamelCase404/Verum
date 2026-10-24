import { motion } from "framer-motion";

export function ScoreRow({
  label,
  value,
  warn,
  delay = 0,
}: {
  label: string;
  value: number;
  warn?: boolean;
  delay?: number;
}) {
  return (
    <div className="mb-[18px]">
      <div className="flex justify-between items-baseline mb-[7px] gap-2.5">
        <span className="text-[13.5px] text-ink-2">{label}</span>
        <span className="font-mono text-[13px] font-medium tabular-nums">{value}</span>
      </div>
      {/* Трек */}
      <div className="h-[5px] rounded-sm bg-bg-2 overflow-hidden relative">
        {/* Сама полоска. Анимируем scaleX от 0 до value/100 */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: value / 100 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.6 + delay * 0.15, 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="h-full w-full rounded-sm origin-left"
          style={{
            // Жесткие HEX-цвета для надежности (янтарный для warn)
            background: warn
              ? "linear-gradient(90deg, #f59e0b, #d97706)"
              : "linear-gradient(90deg, #1e4d3a, #3d8a68)",
          }}
        />
      </div>
    </div>
  );
}
