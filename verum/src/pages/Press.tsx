import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";
import { toast } from "@/components/layout/ToastContainer";

const ITEMS = [
  { n: "01", t: "Пресс-кит", s: "Логотипы, факты, фото", d: "Все материалы о Верум в одном месте." },
  { n: "02", t: "Комментарии экспертов", s: "По запросу", d: "Основатели готовы комментировать темы найма и ИИ." },
  { n: "03", t: "Публикации", s: "СМИ о нас", d: "Собрали публикации о платформе в СМИ." },
];

export function Press() {
  return (
    <>
      <PageHero
        eyebrow="Пресс-центр"
        title={<>Для СМИ <span className="text-accent">и интервью</span></>}
        lede="Материалы о платформе, комментарии экспертов и контакты для прессы."
      />
      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-5">
            {ITEMS.map((s) => (
              <StaggerItem key={s.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:shadow-lg transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">{s.n}</div>
                  <h3 className="text-[19px] font-semibold mb-1">{s.t}</h3>
                  <div className="text-[13px] text-ink-3 mb-3">{s.s}</div>
                  <p className="text-[14px] text-ink-2 leading-relaxed mb-4">{s.d}</p>
                  {s.n === "01" && (
                    <button
                      onClick={() => toast("Пресс-кит отправлен на вашу почту")}
                      className="h-[36px] px-4 rounded-lg bg-accent text-white text-[13px] font-medium hover:bg-accent-2 transition-colors"
                    >
                      Скачать пресс-кит
                    </button>
                  )}
                </HoverLift>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
