import { PageHero } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { MOCK_CAREERS } from "@/data/careers";
import { motion } from "framer-motion";
import { toast } from "@/components/layout/ToastContainer";

export function Careers() {
  return (
    <>
      <PageHero
        eyebrow="Вакансии"
        title={<>Работа <span className="text-accent">в Верум</span></>}
        lede="Мы делаем найм в IT предсказуемым. Если вам близка эта идея — присоединяйтесь."
      />
      <section className="py-16">
        <div className="wrap max-w-[900px]">
          <Stagger className="space-y-3">
            {MOCK_CAREERS.map((c, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className="bg-surface border border-line rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 hover:border-line-2 transition-colors"
                >
                  <div className="flex-1 min-w-[240px]">
                    <h3 className="text-[17px] font-semibold mb-1">{c.t}</h3>
                    <div className="text-[13px] text-ink-3 mb-2">{c.loc} · {c.type}</div>
                    <p className="text-[14px] text-ink-2 leading-relaxed">{c.desc}</p>
                  </div>
                  <button
                    onClick={() => toast("Спасибо! Мы свяжемся с вами в течение дня")}
                    className="h-[38px] px-4 rounded-lg border border-line-2 text-[13.5px] hover:bg-surface-2 transition-colors shrink-0"
                  >
                    Откликнуться
                  </button>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
