import { motion } from "framer-motion";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";

const TEAM = [
  { n: "Максим Мартыненко", r: "Сооснователь, backend", b: "Архитектура платформы, интеграция с GigaChat API и прототип движка оценки.", i: "ММ" },
  { n: "Максим Соколов", r: "Сооснователь, продукт", b: "Исследование рынка, дизайн, работа с первыми клиентами.", i: "МС" },
  { n: "ML-инженер", r: "Открытая позиция", b: "Калибровка рубрик оценки и обучение LLM-судьи.", i: "+" },
  { n: "Fullstack-разработчик", r: "Открытая позиция", b: "Развитие платформы и интеграции с внешними системами.", i: "+" },
];

const TIMELINE = [
  { d: "Сентябрь 2025", t: "Первая версия концепции", desc: "Провели 15 интервью с потенциальными клиентами и специалистами." },
  { d: "Октябрь 2025", t: "Переход к проверке архитектуры", desc: "Переориентировались на архитектурное мышление и ревью кода ИИ." },
  { d: "Ноябрь 2025", t: "Первый прототип", desc: "Работающий прототип на FastAPI с GigaChat API. Пилот на 10 разработчиках." },
  { d: "Декабрь 2025", t: "Запуск платформы", desc: "Открыли доступ для первых компаний." },
];

export function About() {
  return (
    <>
      <PageHero
        eyebrow="О проекте"
        title={<>Мы делаем найм предсказуемым</>}
        lede="Верум — платформа проверенных IT-специалистов. Мы проверяем то, чего не проверяют биржи и ATS-системы: архитектурное мышление и способность работать с кодом, который написан ИИ."
      />

      <section className="py-16">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <SectionHead eyebrow="Миссия" title="Перестать платить за вайбкодеров" />
              <p className="text-[16.5px] leading-relaxed text-ink-2 mb-4">
                Мы хотим, чтобы компании перестали платить за «вайбкодеров» — специалистов, которые генерируют код, но не понимают его внутренней логики. И чтобы хорошие специалисты могли доказать свой уровень без десяти собеседований.
              </p>
              <p className="text-[16.5px] leading-relaxed text-ink-2">
                Верум — это слой доверия между компаниями и IT-специалистами, основанный на объективных данных, а не на отзывах, которые можно накрутить.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-surface border border-line rounded-2xl p-8 shadow-lg"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-amber/5 pointer-events-none" />
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3 mb-4">Три принципа</div>
                <div className="space-y-4 relative">
                  {[
                    ["Проверка, а не декларация", "Навыки подтверждены объективными результатами"],
                    ["Архитектура важнее синтаксиса", "Проверяем мышление, а не память"],
                    ["Работа с ИИ обязательна", "Специалист должен уметь проверять код нейросети"],
                  ].map(([t, d], i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="pb-4 border-b border-line last:border-0 last:pb-0"
                    >
                      <div className="font-medium mb-1 text-[15px]">{t}</div>
                      <div className="text-[13px] text-ink-3">{d}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-2">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="История" title="Как мы к этому пришли" /></Reveal>
          <div className="relative max-w-[700px] pl-10">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 0.84, 0.44, 1] }}
              className="absolute left-2 top-2 w-px bg-line-2 origin-top"
            />
            <Stagger>
              {TIMELINE.map((it, i) => (
                <StaggerItem key={i} className="relative pb-10 last:pb-0">
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.4, type: "spring" }}
                    className="absolute -left-10 top-1.5 w-[17px] h-[17px] rounded-full bg-surface border-2 border-accent"
                  />
                  <div className="font-mono text-xs text-accent font-medium mb-1.5">{it.d}</div>
                  <div className="text-[17px] font-semibold mb-1">{it.t}</div>
                  <div className="text-[14px] text-ink-2 leading-relaxed">{it.desc}</div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="Команда" title="Люди, которые это делают" /></Reveal>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((m, i) => (
              <StaggerItem key={i}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-6 h-full hover:border-line-2 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-[20px] mb-4">
                    {m.i}
                  </div>
                  <div className="text-[15.5px] font-semibold mb-1">{m.n}</div>
                  <div className="text-[12.5px] text-ink-3 mb-3">{m.r}</div>
                  <div className="text-[13px] text-ink-2 leading-relaxed">{m.b}</div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
