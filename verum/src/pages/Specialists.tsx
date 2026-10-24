import { motion } from "framer-motion";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { FaqBlock } from "@/components/ui/FaqBlock";

export function Specialists() {
  return (
    <>
      <PageHero
        eyebrow="Для специалистов"
        title={<>Докажите свой уровень за вечер</>}
        lede="Верум даёт хорошим специалистам способ выделиться среди вайбкодеров. Один раз прошли проверку — получаете доступ к качественным вакансиям."
      />

      <section className="py-16">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <SectionHead eyebrow="Почему" title="Выделитесь среди вайбкодеров" />
              <p className="text-[16.5px] leading-relaxed text-ink-2 mb-4">
                На обычных биржах заказчик выбирает по цене. Часто выигрывает тот, кто просто сгенерировал код. Хороший специалист не может доказать, что он лучше — потому что все выглядят одинаково.
              </p>
              <p className="text-[16.5px] leading-relaxed text-ink-2">
                Верум даёт вам способ показать реальный уровень. Вы проходите тест один раз — и получаете верифицированный профиль.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <motion.div whileHover={{ y: -4 }} className="relative bg-surface border border-line rounded-2xl p-8 shadow-lg">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 via-transparent to-violet/5 pointer-events-none" />
                <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-3 mb-4 relative">Что вы получаете</div>
                <div className="space-y-4 relative">
                  {[
                    ["Верифицированный профиль", "с баллами по трём этапам"],
                    ["Доступ к вакансиям", "только проверенным специалистам"],
                    ["Изоляция от демпинга", "вайбкодеры не пройдут тест"],
                    ["Честная комиссия", "8% с закрытой сделки"],
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
          <Reveal><SectionHead eyebrow="Как проходит" title="Три этапа, которые доказывают уровень" /></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Архитектура", d: "Проектирование системы по бизнес-требованиям. Системное мышление и умение обосновать." },
              { n: "02", t: "Ревью кода ИИ", d: "Поиск дефектов в коде от нейросети. Критическое мышление и контроль качества." },
              { n: "03", t: "Адаптация", d: "Изменение требований на ходу. Гибкость мышления и умение пересматривать." },
            ].map((s) => (
              <StaggerItem key={s.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:border-line-2 hover:shadow-xl transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">
                    {s.n}
                  </div>
                  <h3 className="text-[19px] font-semibold mb-3">{s.t}</h3>
                  <p className="text-[14px] text-ink-2 leading-relaxed">{s.d}</p>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="FAQ" title="Частые вопросы" centered /></Reveal>
          <FaqBlock items={[
            { q: "Сколько стоит пройти проверку?", a: "0 ₽. Проверка бесплатна. Вы платите только 8% с закрытой сделки." },
            { q: "Что если я не пройду тест?", a: "Мы не отсеиваем — мы определяем уровень. Получите разбор и сможете пройти повторно через 30 дней." },
            { q: "Могу ли я пройти тест ещё раз?", a: "Да, через 30 дней после предыдущей попытки." },
            { q: "Как часто я буду получать предложения о работе?", a: "Зависит от стека и уровня. В среднем 3–7 предложений в месяц." },
          ]} />
        </div>
      </section>
    </>
  );
}
