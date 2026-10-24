import { PageHero } from "@/components/ui/PageHero";
import { Stagger, StaggerItem, HoverLift } from "@/components/ui/Reveal";

const CATS = [
  { n: "01", t: "Для специалистов", s: "Начало работы", items: ["Как зарегистрироваться", "Как подключить GitHub", "Как пройти проверку", "Как получать заказы"] },
  { n: "02", t: "Для компаний", s: "Начало работы", items: ["Как разместить заказ", "Как работает подбор", "Как выбрать тариф", "Как работает эскроу"] },
  { n: "03", t: "Безопасность", s: "Данные и платежи", items: ["Как хранятся данные", "Какие данные GitHub читаются", "Как работает эскроу", "Как вернуть деньги"] },
];

export function Help() {
  return (
    <>
      <PageHero
        eyebrow="Центр помощи"
        title={<>Инструкции и статьи</>}
        lede="Всё, что нужно знать о работе с платформой."
      />
      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-5">
            {CATS.map((c) => (
              <StaggerItem key={c.n}>
                <HoverLift className="bg-surface border border-line rounded-2xl p-7 h-full hover:shadow-lg transition-shadow">
                  <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent font-mono text-[13px] font-semibold flex items-center justify-center mb-5">{c.n}</div>
                  <h3 className="text-[19px] font-semibold mb-1">{c.t}</h3>
                  <div className="text-[13px] text-ink-3 mb-5">{c.s}</div>
                  <ul className="space-y-2.5">
                    {c.items.map((it, i) => (
                      <li key={i} className="flex gap-2.5 text-[13.5px] text-ink-2">
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
