import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { MOCK_CHANGELOG } from "@/data/changelog";

export function Changelog() {
  return (
    <>
      <PageHero
        eyebrow="Обновления"
        title={<>Что нового на платформе</>}
        lede="Мы постоянно улучшаем Верум."
      />
      <section className="py-16">
        <div className="wrap max-w-[820px]">
          <Stagger className="space-y-4">
            {MOCK_CHANGELOG.map((c, i) => (
              <StaggerItem key={i}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-6 hover:border-line-2 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-semibold">{c.v}</h3>
                    <span className="text-[12.5px] text-ink-3">{c.date}</span>
                  </div>
                  <ul className="space-y-2">
                    {c.items.map((it, j) => (
                      <li key={j} className="flex gap-2.5 text-[13.5px] text-ink-2">
                        <span className="w-[5px] h-[5px] rounded-full bg-accent mt-[7px] shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
