import { useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { toast } from "@/components/layout/ToastContainer";

export function Contacts() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = () => {
    if (!name || !email.includes("@") || msg.length < 10) {
      toast("Проверьте поля");
      return;
    }
    toast("Спасибо! Мы свяжемся с вами");
    setName(""); setEmail(""); setMsg("");
  };

  return (
    <>
      <PageHero
        eyebrow="Контакты"
        title={<>Напишите нам</>}
        lede="Отвечаем на все вопросы в течение рабочего дня."
      />
      <section className="py-16">
        <div className="wrap">
          <div className="grid lg:grid-cols-2 gap-12">
            <Reveal>
              <h3 className="text-[24px] font-semibold mb-6">Форма обратной связи</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium mb-2 text-ink-2">Имя и фамилия</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Анна Соколова" className="w-full border border-line-2 rounded-lg px-3.5 py-3 text-[15px] bg-surface outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-soft transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2 text-ink-2">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-line-2 rounded-lg px-3.5 py-3 text-[15px] bg-surface outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-soft transition-all" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium mb-2 text-ink-2">Сообщение</label>
                  <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Расскажите, что вас интересует" className="w-full border border-line-2 rounded-lg px-3.5 py-3 text-[15px] bg-surface outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-soft transition-all min-h-[120px] resize-y" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={submit}
                  className="h-[50px] px-7 rounded-xl bg-accent text-white font-medium shadow-md shadow-accent/20 hover:bg-accent-2 transition-colors"
                >
                  Отправить
                </motion.button>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <h3 className="text-[24px] font-semibold mb-6">Другие способы связи</h3>
              <div className="space-y-0">
                {[
                  ["Электронная почта", "hello@verum.ru", "Для общих вопросов"],
                  ["Партнёрство", "partners@verum.ru", "Для ATS-интеграций"],
                  ["Пресса", "press@verum.ru", "Для СМИ и интервью"],
                  ["Офис", "Москва, ул. Тверская, 1", "По предварительной договорённости"],
                ].map(([l, v, n], i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="py-5 border-b border-line last:border-0"
                  >
                    <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-1.5 font-semibold">{l}</div>
                    <div className="text-[15px] font-medium">{v}</div>
                    <div className="text-[13px] text-ink-3 mt-1">{n}</div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
