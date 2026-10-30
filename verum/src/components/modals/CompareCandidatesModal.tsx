import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ShieldCheck, Github, Star, CheckCircle2 } from "lucide-react";

export function CompareCandidatesModal({
 candidates, onClose }: { candidates: any[], onClose: () => void }) {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-line rounded-[22px] w-[calc(100vw-2rem)] sm:w-full max-w-5xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-3 sm:p-5 border-b border-line flex justify-between items-center bg-surface-2">
          <h2 className="font-bold text-xl">Сравнение кандидатов</h2>
          <button onClick={onClose} className="text-ink-3 hover:text-ink p-1"><X size={24} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {candidates.map((c) => (
              <div key={c.id} className="border border-line rounded-2xl bg-surface-2 overflow-hidden flex flex-col">
                {/* Шапка карточки */}
                <div className="p-4 bg-surface border-b border-line text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center text-xl font-bold mb-3 overflow-hidden">
                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : c.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-lg">{c.full_name}</h3>
                  <span className="text-sm text-accent font-medium mt-1">{c.final_grade}</span>
                </div>

                {/* Данные */}
                <div className="p-4 space-y-4 flex-1">
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-ink-3 mb-1">Стоимость на рынке</div>
                    <div className="text-xl font-bold text-ink">~ {c.estimated_salary.toLocaleString('ru-RU')} ₽</div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-3">Match Score:</span>
                      <span className="font-bold text-accent">{c.match_score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${c.match_score}%` }} />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm items-center border-t border-line pt-3">
                    <span className="text-ink-3">Балл за тест:</span>
                    <span className="font-bold">{c.total_score} / 100</span>
                  </div>
                  
                  <div className="flex justify-between text-sm items-center border-t border-line pt-3">
                    <span className="text-ink-3">Стек:</span>
                    <span className="font-medium">{c.stack}</span>
                  </div>

                  <div className="flex justify-between text-sm items-center border-t border-line pt-3">
                    <span className="text-ink-3">GitHub (звезды):</span>
                    <span className="font-medium flex items-center gap-1"><Star size={14} className="text-amber-500"/> {c.github_stars}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
