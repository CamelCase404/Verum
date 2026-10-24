import { PageHero } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";

const SERVICES = [
  { t: "Веб-приложение", u: "100%" },
  { t: "API", u: "99.98%" },
  { t: "GitHub-интеграция", u: "99.95%" },
  { t: "Платежи", u: "100%" },
  { t: "Уведомления", u: "99.9%" },
  { t: "Чат", u: "100%" },
];

export function Status() {
  return (
    <>
      <PageHero
        eyebrow="Статус сервиса"
        title={<>Все системы работают</>}
        lede="Актуальная информация о доступности платформы."
        centered
      />
      <section className="py-16">
        <div className="wrap max-w-[820px]">
          <Reveal>
            <div className="bg-surface border border-line rounded-2xl p-7 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[17px] font-semibold">Компоненты</h3>
                <span className="inline-flex items-center gap-2 text-[12.5px] text-accent">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_0_3px_var(--accent-soft)]" />
                  всё в порядке
                </span>
              </div>
              <Stagger>
                {SERVICES.map((s, i) => (
                  <StaggerItem key={i}>
                    <div className={`flex items-center justify-between py-4 ${i < SERVICES.length - 1 ? "border-b border-line" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_0_3px_var(--accent-soft)]" />
                        <span className="text-[14px]">{s.t}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-ink-3">{s.u} uptime</span>
                        <span className="inline-flex items-center h-6 px-2 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-accent-soft text-accent">работает</span>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
