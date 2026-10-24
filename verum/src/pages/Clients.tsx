import { motion } from "framer-motion";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { FaqBlock } from "@/components/ui/FaqBlock";

const SEGMENTS = [
  { n: "01", t: "Стартапы", s: "10–50 человек", d: "Нет HR-отдела, тимлид тратит 30% времени на интервью. Нужно быстро закрывать вакансии." },
  { n: "02", t: "Продуктовые команды", s: "50–200 человек", d: "Есть HR, но технический скрининг занимает недели. Нужны объективные данные о кандидатах." },
  { n: "03", t: "Агентства и аутсорс", s: "постоянный поток", d: "Регулярно нанимают разработчиков. Нужен быстрый фильтр от вайбкодеров." },
];

export function Clients() {
  return (
    <>
      <PageHero
        eyebrow="Для компаний"
        title={<>Найм без риска и без бюрократии</>}
        lede="Опишите задачу — получите шортлист проверенных специалистов, которые действительно подходят по стеку и опыту работы с ИИ."
      />

      <section className="py-16">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <SectionHead eyebrow="Проблема" title="Рынок наводнили вайбкодеры" />
              <p className="text-[16.5px] leading-relaxed text-ink-2 mb-4">
                Специалисты, которые генерируют код с помощью ИИ, но не понимают его внутренней логики. Внешне код выглядит рабочим, но ломается при первой нагрузке.
              </p>
              <p className="text-[16.5px] leading-relaxed text-ink-2">
                Существующие биржи проверяют резюме и отзывы, которые можно накрутить. ATS управляют процессом, но не проверяют навыки. Верум проверяет архитектурное мышление и способность находить дефекты в коде ИИ.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                className="relative bg-surface border border-line rounded-2xl p-8 shadow-lg"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-blue/5 pointer-events-none" />
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3 mb-4 relative">Что получает компания</div>
                <div className="space-y-4 relative">
                  {[
                    ["Экономия времени", "не нужно тратить 2 недели на скрининг"],
                    ["Снижение риска", "не наймём вайбкодера, если провалил тест"],
                    ["Прозрачность", "видно, что кандидат нашёл и что пропустил"],
                    ["Интеграция с ATS", "Хантфлоу и Поток"],
                  ].map(([t, d], i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="pb-4 border-b border-line last:border-0 last:pb-0"
                    >
                      <div className="font-medium text-[15px] mb-1">{t}</div>
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
          <Reveal><SectionHead eyebrow="Сегменты" title="Для каких компаний мы созданы" /></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5">
            {SEGMENTS.map((s) => (
              <StaggerItem key={s.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:border-line-2 hover:shadow-xl transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">
                    {s.n}
                  </div>
                  <h3 className="text-[19px] font-semibold mb-1">{s.t}</h3>
                  <div className="text-[13px] text-ink-3 mb-3">{s.s}</div>
                  <p className="text-[14px] text-ink-2 leading-relaxed">{s.d}</p>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="FAQ" title="Отвечаем на главные вопросы" centered /></Reveal>
          <FaqBlock items={[
            { q: "Как вы защищаете от вайбкодеров?", a: "Три этапа проверки: архитектура, ревью кода ИИ, адаптация. Вайбкодер не справится ни с одним из них." },
            { q: "Вы заменяете наш HR-отдел?", a: "Нет. Мы делаем технический скрининг. Финальное интервью и оффер — за вами." },
            { q: "Работаете ли вы с ATS?", a: "Да, совместимы с Хантфлоу, Поток и другими популярными системами." },
            { q: "Что если кандидат не подойдёт?", a: "На расширенном тарифе — гарантия замены 14 дней." },
          ]} />
        </div>
      </section>
    </>
  );
}
