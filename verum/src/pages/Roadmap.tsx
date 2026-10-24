import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { MOCK_ROADMAP } from "@/data/roadmap";

const STATUS: Record<string, { label: string; cls: string }> = {
  done: { label: "готово", cls: "bg-accent-soft text-accent" },
  "in-progress": { label: "в работе", cls: "bg-blue-soft text-blue" },
  planned: { label: "в планах", cls: "bg-bg-2 text-ink-2" },
  idea: { label: "идея", cls: "bg-bg-2 text-ink-2" },
};

export function Roadmap() {
  return (
    <>
      <PageHero
        eyebrow="Дорожная карта"
        title={<>Планы развития Верум</>}
        lede="Что мы делаем сейчас и что запланировали на ближайшие месяцы."
      />
      <section className="py-16">
        <div className="wrap max-w-[820px]">
          <Stagger className="space-y-4">
            {MOCK_ROADMAP.map((q, i) => (
              <StaggerItem key={i}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-6 hover:border-line-2 transition-colors">
                  <h3 className="text-[17px] font-semibold mb-4">{q.q}</h3>
                  <div className="space-y-4">
                    {q.items.map((it, j) => {
                      const s = STATUS[it.status] || STATUS.idea;
                      return (
                        <div key={j} className={`flex items-start justify-between gap-4 pb-4 ${j < q.items.length - 1 ? "border-b border-line" : ""}`}>
                          <div className="flex-1">
                            <div className="text-[14px] font-medium mb-1">{it.t}</div>
                            <div className="text-[12.5px] text-ink-3 leading-relaxed">{it.d}</div>
                          </div>
                          <span className={`inline-flex items-center h-6 px-2 rounded-md text-[11px] font-semibold tracking-wider shrink-0 ${s.cls}`}>{s.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
