import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Users, ArrowUpRight, Plus, Search, BarChart3 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MOCK_SPECIALISTS } from "@/data/specialists";
import { MatchRow } from "@/components/ui/MatchRow";
import { NewVacancyModal } from "@/components/modals/NewVacancyModal";

export function CompanyDashboard() {
  const { user } = useAppStore();
  const [isNewVacancyOpen, setIsNewVacancyOpen] = useState(false);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">Кабинет компании</h1>
          <p className="text-ink-2 text-[13px] md:text-[15px]">
            {user?.name || "Компания"} · Бесплатно
          </p>
        </div>
        <button 
          onClick={() => setIsNewVacancyOpen(true)}
          className="h-[38px] md:h-[42px] px-4 md:px-5 rounded-xl bg-accent text-white font-medium text-[13px] md:text-[14px] shadow-md shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={16} className="md:w-4.5 md:h-4.5" /> Разместить вакансию
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 mb-6 md:mb-8">
        {[
          { label: "Активные вакансии", value: "2", icon: FileText },
          { label: "В шортлисте", value: "8", icon: Users },
          { label: "Просмотры", value: "124", icon: BarChart3 },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`bg-surface border border-line rounded-2xl p-3 md:p-6 flex items-center gap-3 md:gap-5 shadow-sm ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent-soft text-accent flex items-center justify-center shrink-0">
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <div className="text-xl md:text-2xl font-semibold tabular-nums">{stat.value}</div>
              <div className="text-[11px] md:text-[13px] text-ink-3">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-4 md:gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4 md:space-y-6">
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold text-base md:text-lg mb-4 md:mb-6 flex items-center justify-between">
              Мои вакансии
              <button className="text-[12px] md:text-[13px] text-accent hover:underline font-normal">Смотреть все</button>
            </h3>
            
            <div className="space-y-3 md:space-y-4">
              {[
                { title: "Frontend-разработчик", status: "В поиске", matches: 3, date: "Сегодня" },
                { title: "Продуктовый дизайнер", status: "В поиске", matches: 5, date: "Вчера" },
              ].map((vacancy, i) => (
                <div key={i} className="p-3 md:p-5 border border-line rounded-xl hover:border-accent/40 transition-colors">
                  <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div>
                      <h4 className="font-medium text-[14px] md:text-[15px] mb-0.5 md:mb-1">{vacancy.title}</h4>
                      <div className="text-[11px] md:text-[12.5px] text-ink-3">{vacancy.date}</div>
                    </div>
                    <span className="px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[10px] md:text-[11px] font-medium bg-accent-soft text-accent">{vacancy.status}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-line">
                    <div className="flex items-center gap-1.5 md:gap-2 text-[12px] md:text-[13px] text-ink-2">
                      <Users size={12} className="md:w-3.5 md:h-3.5" /> <span className="font-medium text-ink">{vacancy.matches} кандидата</span>
                    </div>
                    <button className="text-[12px] md:text-[13px] font-medium flex items-center gap-1 hover:text-accent transition-colors">
                      <span className="hidden sm:inline">Посмотреть</span> <ArrowUpRight size={12} className="md:w-3.5 md:h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4 md:space-y-6">
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <h3 className="font-semibold text-base md:text-lg mb-3 md:mb-4 flex items-center justify-between">
              Кандидаты
              <button className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center hover:bg-surface-3 transition-colors">
                <Search size={12} className="md:w-3.5 md:h-3.5" />
              </button>
            </h3>
            <div className="space-y-1">
              {MOCK_SPECIALISTS.slice(0, 3).map(m => (
                <MatchRow key={m.id} m={m} />
              ))}
            </div>
            <button className="w-full h-[38px] md:h-[42px] mt-3 md:mt-4 rounded-xl border border-line-2 text-ink-2 text-[12px] md:text-[13.5px] font-medium hover:bg-surface-2 transition-colors">
              Открыть шортлист
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isNewVacancyOpen && <NewVacancyModal onClose={() => setIsNewVacancyOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
