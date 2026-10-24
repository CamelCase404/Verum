import { motion } from "framer-motion";
import { Counter } from "@/components/ui/Counter";
import { Search, Target, TrendingDown } from "lucide-react";

const STATS = [
  { n: 78, text: "разработчиков считают, что тесты не соответствуют реальным задачам", icon: Search },
  { n: 66, text: "предпочитают оценку на основе практических задач", icon: Target },
  { n: 74, text: "говорят, что им трудно найти работу в IT", icon: TrendingDown },
];

export function StatsSection() {
  return (
    <section className="py-8 md:py-16 overflow-hidden">
      <div className="wrap">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.16, 0.84, 0.44, 1] }}
          className="max-w-[660px] mx-auto mb-8 md:mb-14 text-center px-4"
        >
          <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-2 md:mb-4">Данные</span>
          <h2 className="font-semibold tracking-[-0.038em] text-[clamp(22px,4.4vw,40px)] mb-2 md:mb-4">Рынок требует нового стандарта</h2>
          <p className="text-[13px] md:text-[16.5px] leading-relaxed text-ink-2 max-w-[56ch] mx-auto">
            По данным HackerRank Developer Skills Report 2025 — 13 000+ разработчиков из 102 стран.
          </p>
        </motion.div>
        
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }} // Убрали y, чтобы не обрезалось
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 0.84, 0.44, 1] }}
                className="min-w-[260px] w-[85vw] md:w-auto md:min-w-0 snap-center shrink-0"
              >
                <div className="bg-surface border border-line rounded-2xl p-5 md:p-7 h-full flex flex-col">
                  <div className="flex items-center gap-4 md:gap-5 mb-3 md:mb-6">
                    <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shrink-0">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="var(--accent-soft)" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="4" />
                        <motion.circle
                          cx="50" cy="50" r="42"
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          pathLength="100"
                          strokeDasharray="100"
                          initial={{ strokeDashoffset: 100 }}
                          whileInView={{ strokeDashoffset: 100 - s.n }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 1.5, delay: 0.3 + i * 0.15, ease: "easeOut" }}
                        />
                      </svg>
                      <Icon size={18} className="text-accent md:w-5 md:h-5 relative z-10" />
                    </div>

                    <div className="text-[28px] md:text-[40px] font-semibold leading-none text-ink tabular-nums">
                      <Counter to={s.n} suffix="%" />
                    </div>
                  </div>
                  <div className="text-[13px] md:text-[14.5px] text-ink-2 leading-relaxed flex-1">{s.text}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
