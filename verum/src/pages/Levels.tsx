import { motion } from "framer-motion";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";

const LEVELS = [
  { badge: "Junior", title: "Портфолио", sub: "Базовый анализ навыков", items: ["Анализ GitHub-профиля", "Оценка качества кода", "Сверка комментария с портфолио", "Итоговый профиль"], time: "~3 минуты", variant: "junior" as const },
  { badge: "Middle", title: "Портфолио + три этапа", sub: "Проверка практических навыков", items: ["Всё из Junior", "Архитектура: проектирование", "Ревью кода ИИ", "Адаптация к требованиям", "Оценка коммуникации"], time: "~20 минут", variant: "mid" as const, featured: true },
  { badge: "Senior", title: "Портфолио + расширенные этапы", sub: "Архитектура и работа с ИИ", items: ["Всё из Middle", "Расширенная архитектура", "Ревью: безопасность", "Сложная адаптация", "Работа с ИИ как инструментом"], time: "~40 минут", variant: "senior" as const },
];

const COMPARE = [
  ["GitHub-анализ", "базовый", "расширенный", "глубокий"],
  ["Архитектура", "—", "да", "расширенно"],
  ["Ревью кода ИИ", "—", "да", "да + безопасность"],
  ["Адаптация", "—", "простая", "сложная"],
  ["Время", "~3 мин", "~20 мин", "~40 мин"],
];

export function Levels() {
  return (
    <>
      <PageHero
        eyebrow="Уровни проверки"
        title={<>Чем выше уровень — тем строже проверка</>}
        lede="Мы не верим резюме на слово. Каждый уровень подтверждается ровно тем объёмом проверки, который нужен для задачи."
      />

      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-5">
            {LEVELS.map((l, i) => (
              <StaggerItem key={i}>
                <HoverLift
                  className={`relative flex flex-col p-7 rounded-2xl h-full border transition-all ${
                    l.featured
                      ? "border-accent bg-surface shadow-xl shadow-accent/5"
                      : "border-line bg-surface hover:border-line-2 hover:shadow-lg"
                  }`}
                >
                  {l.featured && (
                    <div className="absolute -top-2.5 left-7 px-2.5 py-0.5 bg-accent text-white text-[11px] font-semibold uppercase tracking-wider rounded">
                      Популярный
                    </div>
                  )}
                  <div className="mb-4">
                    <span className={`inline-flex items-center h-6 px-2 rounded-md text-[11.5px] font-semibold uppercase tracking-wider ${
                      l.variant === "mid" ? "bg-accent-soft text-accent" : l.variant === "senior" ? "bg-amber-soft text-amber" : "bg-bg-2 text-ink-2"
                    }`}>{l.badge}</span>
                  </div>
                  <h3 className="text-[22px] font-semibold mb-1.5">{l.title}</h3>
                  <div className="text-[13.5px] text-ink-3 mb-5">{l.sub}</div>
                  <ul className="flex-1 space-y-2.5 mb-6">
                    {l.items.map((it, j) => (
                      <li key={j} className="flex gap-2.5 text-[13.5px] text-ink-2 leading-snug">
                        <span className="w-[5px] h-[5px] rounded-full bg-accent mt-[7px] shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-line flex justify-between text-[12.5px] text-ink-3">
                    <span>Проверка занимает</span><b className="text-ink">{l.time}</b>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 bg-surface-2">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="Сравнение" title="Не сложность задач, а глубина проверки" /></Reveal>
          <Reveal delay={0.2}>
            <div className="bg-surface border border-line rounded-2xl overflow-x-auto">
              <div className="min-w-[560px]">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] bg-surface-2 border-b border-line px-5 py-4 text-[12px] font-semibold uppercase tracking-wider text-ink-3">
                  <div>Параметр</div><div className="text-center">Junior</div><div className="text-center">Middle</div><div className="text-center">Senior</div>
                </div>
                {COMPARE.map(([l, a, b, c], i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    className="grid grid-cols-[1.6fr_1fr_1fr_1fr] px-5 py-4 border-b border-line last:border-0 text-[13.5px]"
                  >
                    <div className="text-ink-2">{l}</div>
                    <div className="text-center text-ink-2">{a}</div>
                    <div className="text-center text-ink-2">{b}</div>
                    <div className="text-center text-ink-2">{c}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
