import { PageHero, SectionHead } from "@/components/ui/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { FaqBlock } from "@/components/ui/FaqBlock";
import { motion } from "framer-motion";
import { Percent, Gift, ShieldCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Pricing() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        eyebrow="Экономика платформы"
        title={<>Прозрачные условия <span className="text-accent">без тарифов</span></>}
        lede="Мы не берём денег за публикацию, подбор или просмотр. Платформа зарабатывает только когда вы нанимаете специалиста — 8% с годового оклада."
      />

      <section className="py-16">
        <div className="wrap">
          <Stagger className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Gift, title: "0 ₽ за всё", desc: "Регистрация, публикация задачи, подбор кандидатов, просмотр профилей и переписка — бесплатно навсегда." },
              { icon: Percent, title: "8% с годового оклада", desc: "Платформа удерживает комиссию с исполнителя только после того, как работа сдана и оплата проведена." },
              { icon: ShieldCheck, title: "Никаких подписок", desc: "Никаких месячных платежей, абонементов или платных функций. Только процент с результата." },
            ].map((c, i) => (
              <StaggerItem key={i}>
                <div className="bg-surface border border-line rounded-2xl p-7 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center mb-5">
                    <c.icon size={24} />
                  </div>
                  <h3 className="text-[19px] font-semibold mb-2">{c.title}</h3>
                  <p className="text-[14px] text-ink-2 leading-relaxed flex-1">{c.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-16 bg-surface-2">
        <div className="wrap max-w-[720px]">
          <Reveal>
            <div className="bg-surface border border-line rounded-[22px] p-10 md:p-12 text-center relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring" }}
                className="w-16 h-16 rounded-2xl bg-accent text-white flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/20"
              >
                <Wallet size={32} />
              </motion.div>
              <h2 className="text-[clamp(24px,4vw,32px)] font-semibold mb-4 tracking-tight">
                Наш единственный заработок
              </h2>
              <p className="text-ink-2 text-[16px] leading-relaxed max-w-[480px] mx-auto mb-8">
                Мы получаем <span className="font-semibold text-accent">8%</span> с годового оклада разработчика только при успешном закрытии сделки. Если кандидат не вышел на работу — платформа не зарабатывает ничего.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="h-[50px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors"
              >
                Попробовать бесплатно →
              </motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="wrap">
          <Reveal><SectionHead eyebrow="FAQ" title="Частые вопросы про оплату" centered /></Reveal>
          <FaqBlock items={[
            { q: "Когда именно вы удерживаете 8%?", a: "Только после того, как специалист прошёл испытательный срок или закрыл первый оплачиваемый этап. Платёж проходит через защищённый эскроу-счёт Верум." },
            { q: "Есть ли скрытые платежи?", a: "Нет. Регистрация, публикация задачи, подбор, чат и интеграции — бесплатно навсегда." },
            { q: "Что если кандидат отказался?", a: "Комиссия не удерживается вообще. Вы платите только за результат." },
            { q: "Как для разработчика рассчитывается 8%?", a: "От годового оклада по договору. Например, при окладе 2 400 000 ₽ комиссия составит 192 000 ₽. Разбивается на несколько этапов." },
            { q: "Можно ли оплатить напрямую разработчику?", a: "Все расчёты проходят через эскроу Верум для защиты обеих сторон. Комиссия удерживается автоматически." },
          ]} />
        </div>
      </section>
    </>
  );
}
