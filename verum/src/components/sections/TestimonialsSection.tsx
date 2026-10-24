import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const ITEMS = [
  { q: "Раньше тратили две недели на интервью, теперь — один день.", name: "Алексей Кузнецов", role: "CTO, «Северный поток»", i: "АК" },
  { q: "Впервые вижу платформу, которая реально проверяет мышление.", name: "Марина Ковалёва", role: "Frontend-разработчик", i: "МК" },
  { q: "Для нас Верум — это фильтр от вайбкодеров.", name: "Дмитрий Егоров", role: "Техдир, «Гранит»", i: "ДЕ" },
];

export function TestimonialsSection() {
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
          <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-2 md:mb-4">Отзывы</span>
          <h2 className="font-semibold tracking-[-0.038em] text-[clamp(22px,4.4vw,40px)]">
            Что говорят компании и специалисты
          </h2>
        </motion.div>
        
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          {ITEMS.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} // Убрали y
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 0.84, 0.44, 1] }}
              className="min-w-[280px] w-[85vw] md:w-auto md:min-w-0 snap-center shrink-0"
            >
              <div className="bg-surface border border-line rounded-2xl p-5 md:p-7 relative h-full flex flex-col">
                <Quote className="absolute top-4 right-4 text-accent opacity-[0.03] w-12 h-12 md:w-16 md:h-16 rotate-180" />
                
                <div className="flex gap-1 mb-3 md:mb-4 text-amber">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={12} className="md:w-3.5 md:h-3.5" fill="currentColor" />
                  ))}
                </div>
                
                <div className="text-[13px] md:text-[14.5px] leading-relaxed text-ink-2 mb-5 flex-1 relative z-10">
                  "{t.q}"
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t border-line mt-auto relative z-10">
                  <div className="w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-[11px] md:text-[13px]">
                    {t.i}
                  </div>
                  <div>
                    <div className="text-[13px] md:text-[14px] font-medium">{t.name}</div>
                    <div className="text-[11px] md:text-[12px] text-ink-3">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
