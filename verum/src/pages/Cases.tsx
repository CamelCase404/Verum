import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { MOCK_CASES } from "@/data/cases";
import { toast } from "@/components/layout/ToastContainer";

export function Cases() {
  return (
    <>
      <PageHero
        eyebrow="Кейсы"
        title={<>Как компании нанимают <span className="text-accent">с Верум</span></>}
        lede="Реальные истории компаний, которые перестали нанимать вайбкодеров."
      />
      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-6">
            {MOCK_CASES.map((c, i) => (
              <StaggerItem key={i}>
                <HoverLift
                  onClick={() => toast(`Открываем кейс: ${c.t}`)}
                  className="bg-surface border border-line rounded-2xl overflow-hidden hover:border-line-2 hover:shadow-xl transition-shadow h-full cursor-pointer"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-accent-soft to-bg-2 flex items-center justify-center">
                    <div className="text-[56px] font-bold text-accent opacity-40">{c.tone}</div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-accent mb-3">{c.tag}</span>
                    <div className="text-[16px] font-semibold leading-snug mb-2">{c.t}</div>
                    <div className="text-[13.5px] text-ink-2 leading-relaxed mb-3">{c.r}</div>
                    <div className="text-xs text-ink-3">{c.c}</div>
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>

          <Stagger className="grid md:grid-cols-4 gap-5 mt-12">
            {[
              { n: 40, suffix: "%", l: "снижение доли неудачных наймов" },
              { n: 3, suffix: "×", l: "быстрее закрывают вакансии" },
              { n: 23, suffix: "%", l: "кандидатов отсеиваются после проверки" },
              { n: 4.8, suffix: "", l: "средняя оценка клиентов", decimals: 1 },
            ].map((s, i) => (
              <StaggerItem key={i}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7">
                  <div className="text-[clamp(32px,5vw,44px)] font-semibold leading-none mb-3.5 text-accent tabular-nums">
                    <Counter to={s.n} suffix={s.suffix} decimals={s.decimals || 0} />
                  </div>
                  <div className="text-[13.5px] text-ink-2 leading-relaxed">{s.l}</div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
