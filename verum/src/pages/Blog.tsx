import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { MOCK_BLOG } from "@/data/blog";
import { toast } from "@/components/layout/ToastContainer";

const TONE: Record<string, string> = {
  "01": "from-accent-soft to-bg-2",
  "02": "from-blue-soft to-bg-2",
  "03": "from-amber-soft to-bg-2",
  "04": "from-violet-soft to-bg-2",
};

export function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Блог"
        title={<>Пишем о найме, ИИ <span className="text-accent">и культуре</span></>}
        lede="Разбираем, как изменился найм в эпоху ИИ, и что делать компаниям и специалистам."
      />
      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_BLOG.map((b, i) => (
              <StaggerItem key={i}>
                <HoverLift
                  onClick={() => toast(`Открываем статью: ${b.title}`)}
                  className="bg-surface border border-line rounded-2xl overflow-hidden hover:border-line-2 hover:shadow-xl transition-shadow cursor-pointer h-full"
                >
                  <div className={`aspect-[16/9] bg-gradient-to-br ${TONE[b.tone] || TONE["01"]} flex items-center justify-center`}>
                    <div className="text-[56px] font-bold text-accent opacity-40">{b.tone}</div>
                  </div>
                  <div className="p-6">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.08em] text-accent mb-3">{b.tag}</span>
                    <div className="text-[17px] font-semibold leading-snug mb-2.5">{b.title}</div>
                    <div className="text-[13.5px] text-ink-2 leading-relaxed mb-4">{b.excerpt}</div>
                    <div className="flex gap-2.5 text-xs text-ink-3">
                      <span>{b.date}</span><span>·</span><span>{b.read}</span>
                    </div>
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
