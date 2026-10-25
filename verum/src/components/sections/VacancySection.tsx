import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MOCK_SPECIALISTS } from "@/data/specialists";
import { MatchRow } from "@/components/ui/MatchRow";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Layers, MapPin, FileText, ScanLine, Banknote } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

export function VacancySection() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);

  const handlePostJob = () => {
    if (!user) {
      toast("Пожалуйста, войдите или зарегистрируйтесь как компания");
      navigate("/register?role=company");
    } else if (user.role === "company") {
      navigate("/dashboard");
    } else {
      toast("❌ Размещать вакансии могут только компании");
    }
  };


  const handleCreateVacancy = () => {
    if (!user) {
      toast("Пожалуйста, войдите или зарегистрируйтесь как компания");
      navigate("/register?role=company");
    } else if (user.role === "company") {
      navigate("/dashboard");
    } else {
      toast("❌ Размещать вакансии могут только компании");
    }
  };

  return (
    <section className="py-8 md:py-16 relative w-full overflow-hidden">
      <div className="wrap">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6 md:gap-12 lg:gap-20 items-center w-full min-w-0">
          <Reveal>
            <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-2 md:mb-4 flex items-center justify-center lg:justify-start gap-2">
              <span className="w-4 md:w-6 h-px bg-accent inline-block" /> Для компаний
            </span>
            <h2 className="font-semibold tracking-[-0.038em] leading-[1.04] text-[clamp(22px,4.4vw,40px)] mb-3 md:mb-4 text-center lg:text-left break-words">
              Опишите вакансию — получите шортлист
            </h2>
            <p className="text-[13px] md:text-[15px] text-ink-3 leading-relaxed max-w-[400px] mb-5 md:mb-8 mx-auto lg:mx-0 text-center lg:text-left">
              Вам не нужно вручную перебирать сотни резюме. Напишите, кто вам нужен, а система сама выделит требования и подберёт кандидатов.
            </p>
            
            <div className="flex justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCreateVacancy}
                className="h-[46px] md:h-[50px] px-6 md:px-8 rounded-xl bg-accent text-white font-medium text-[14px] md:text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                Разместить вакансию →
              </motion.button>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="w-full max-w-full min-w-0">
            <div className="bg-surface border border-line rounded-2xl shadow-xl overflow-hidden relative w-full">
              <div className="px-4 md:px-5 py-3 md:py-4 border-b border-line bg-surface-2 flex items-center justify-between relative">
                <span className="text-[14px] md:text-[15px] font-semibold flex items-center gap-2">
                  <FileText size={16} className="text-ink-3" /> Описание вакансии
                </span>
              </div>
              
              <div className="p-4 md:p-5 w-full min-w-0">
                {/* break-words спасает от горизонтального выезда */}
                <div className="font-mono text-[11px] md:text-xs leading-relaxed text-ink-2 bg-bg border border-line rounded-lg p-3 md:p-3.5 mb-4 relative overflow-hidden break-words w-full">
                  Ищем <span className="text-accent font-medium">Frontend-разработчика</span> в продуктовую команду. Стек — <span className="text-accent font-medium">React + TypeScript</span>.
                </div>
                
                <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-5 w-full">
                  <div className="flex justify-between text-[12px] md:text-sm items-center">
                    <span className="text-ink-3 flex items-center gap-2"><Banknote size={14} /> Зарплата</span>
                    <span className="font-medium text-right">от 180 000 ₽</span>
                  </div>
                  <div className="flex justify-between text-[12px] md:text-sm items-center">
                    <span className="text-ink-3 flex items-center gap-2"><Layers size={14} /> Уровень</span>
                    <span className="font-medium text-right">Middle</span>
                  </div>
                  <div className="flex justify-between text-[12px] md:text-sm items-center">
                    <span className="text-ink-3 flex items-center gap-2"><MapPin size={14} /> Формат</span>
                    <span className="font-medium text-right">Удалённо</span>
                  </div>
                </div>
                
                <div className="text-[11px] md:text-[11.5px] font-semibold uppercase tracking-wider text-ink-3 mb-2.5 flex items-center gap-2">
                  <ScanLine size={14} className="animate-pulse" /> Кандидаты
                </div>
                
                <Stagger className="w-full">
                  {MOCK_SPECIALISTS.slice(0, 3).map((m) => (
                    <StaggerItem key={m.id} className="w-full">
                      <MatchRow m={m} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
