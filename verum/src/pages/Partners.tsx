import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";

const ITEMS = [
  { n: "01", t: "Хантфлоу", s: "ATS-система", d: "Автоматическая передача результатов теста в карточку кандидата." },
  { n: "02", t: "Поток", s: "ATS-система", d: "Синхронизация статусов и уведомлений о результатах." },
  { n: "03", t: "GitHub", s: "Источник данных", d: "Анализ публичных репозиториев и активности." },
];

export function Partners() {
  return (
    <>
      <PageHero
        eyebrow="Партнёры"
        title={<>Интеграции и партнёрства</>}
        lede="Верум совместим с популярными ATS-системами и готов к интеграциям."
      />
      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-5">
            {ITEMS.map((s) => (
              <StaggerItem key={s.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:border-line-2 hover:shadow-xl transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">{s.n}</div>
                  <h3 className="text-[19px] font-semibold mb-1">{s.t}</h3>
                  <div className="text-[13px] text-ink-3 mb-3">{s.s}</div>
                  <p className="text-[14px] text-ink-2 leading-relaxed">{s.d}</p>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
