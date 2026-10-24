import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBand() {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden bg-surface border border-line rounded-[22px] p-12 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-xl dark:shadow-none">
            <div className="absolute -top-40 -right-20 w-[400px] h-[400px] bg-accent/5 dark:bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="max-w-[520px] relative z-10">
              <h2 className="font-semibold tracking-[-0.038em] text-[clamp(24px,4.4vw,40px)] text-ink mb-3.5">
                Соберите профиль за вечер
              </h2>
              <p className="text-ink-2 text-[15.5px] leading-relaxed">
                Подключите GitHub, напишите пару абзацев о себе. Профиль начнёт попадать в подборки заказчиков в тот же день.
              </p>
            </div>
            
            <div className="flex gap-3 flex-wrap relative z-10">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="h-[50px] px-7 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors"
              >
                Собрать профиль
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/register")}
                className="h-[50px] px-7 rounded-xl bg-surface-2 border border-line-2 text-ink font-medium text-[15px] hover:bg-surface-3 transition-colors"
              >
                Разместить заказ
              </motion.button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
