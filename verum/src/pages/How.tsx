import { motion } from "framer-motion";
import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { FaqBlock } from "@/components/ui/FaqBlock";

const STAGES = [
  { n: "01", t: "Архитектура", s: "Проектирование по требованиям", d: "Кандидат получает бизнес-требования: спроектировать сервис. Описывает компоненты, схему данных, обработку отказов." },
  { n: "02", t: "Ревью кода ИИ", s: "Поиск дефектов в сгенерированном коде", d: "Код 200–300 строк от нейросети с дефектами: sync в async, N+1, отсутствие таймаута. Найти, приоритизировать, предложить фиксы." },
  { n: "03", t: "Адаптация", s: "Изменение требований на ходу", d: "ИИ резко меняет требования — нагрузка выросла в 10 раз. Кандидат объясняет, что сломается и как перестроить архитектуру." },
];

const STEPS_SPEC = [
  { n: "01", t: "Сбор профиля", d: "Подключаете GitHub и пишете комментарий. Система анализирует репозитории." },
  { n: "02", t: "Прохождение проверки", d: "Три этапа: архитектура, ревью кода ИИ, адаптация. Таймер и вопросы." },
  { n: "03", t: "Получение профиля", d: "Профиль с баллами, примерами решений и рекомендациями." },
];

const STEPS_CLIENT = [
  { n: "01", t: "Афиша", d: "Описываете задачу своими словами. Система разбирает требования." },
  { n: "02", t: "Шортлист", d: "3–10 кандидатов с прозрачной причиной совпадения." },
  { n: "03", t: "Финальный выбор", d: "Короткое знакомство с топ-2 и оффер. Верум не участвует в найме." },
];

export function How() {
  return (
    <>
      <PageHero
        eyebrow="Как это работает"
        title={<>Три этапа проверки и три шага найма</>}
        lede="Мы проверяем не память и не синтаксис, а реальные инженерные навыки."
      />

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="Для специалиста" title="Путь от регистрации до профиля" /></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-0 border-t border-ink">
            {STEPS_SPEC.map((s, i) => (
              <StaggerItem key={i} className={`py-8 ${i > 0 ? "md:pl-8 md:border-l border-line" : ""} ${i < STEPS_SPEC.length - 1 ? "md:pr-8" : ""}`}>
                <div className="font-mono text-xs text-accent font-medium mb-4">{s.n}</div>
                <h3 className="text-[17px] font-semibold mb-2">{s.t}</h3>
                <p className="text-[14.5px] text-ink-2 leading-relaxed">{s.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 bg-surface-2">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="Тест" title="Что проверяет наш тест" /></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-5">
            {STAGES.map((s) => (
              <StaggerItem key={s.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:border-line-2 hover:shadow-xl transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">
                    {s.n}
                  </div>
                  <h3 className="text-[19px] font-semibold mb-1.5">{s.t}</h3>
                  <div className="text-[13px] text-ink-3 mb-4">{s.s}</div>
                  <p className="text-[14px] text-ink-2 leading-relaxed mb-4">{s.d}</p>
                  <div className="pt-4 border-t border-line text-[12.5px] text-ink-3">
                    <b className="text-ink">Проверяем:</b> системное мышление и обоснование
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="Для компании" title="Путь от заявки до оффера" /></Reveal>
          <Stagger className="grid md:grid-cols-3 gap-0 border-t border-ink">
            {STEPS_CLIENT.map((s, i) => (
              <StaggerItem key={i} className={`py-8 ${i > 0 ? "md:pl-8 md:border-l border-line" : ""}`}>
                <div className="font-mono text-xs text-accent font-medium mb-4">{s.n}</div>
                <h3 className="text-[17px] font-semibold mb-2">{s.t}</h3>
                <p className="text-[14.5px] text-ink-2 leading-relaxed">{s.d}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 bg-surface-2">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="FAQ" title="Короткие ответы на важные вопросы" centered /></Reveal>
          <FaqBlock items={[
            { q: "Почему это не пройти с ИИ?", a: "Задача — спроектировать систему и проверить конкретный ответ ИИ. Другой ИИ даст другой ответ. Кандидат должен обосновать выбор." },
            { q: "Сколько времени занимает тест?", a: "Junior — 15 минут. Middle — 20 минут. Senior — 40 минут." },
            { q: "Что видит заказчик?", a: "Профиль с баллами по трём этапам, примерами решений, найденными дефектами и рекомендацией." },
          ]} />
        </div>
      </section>
    </>
  );
}
