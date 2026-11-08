import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Loader2, ShieldCheck, Banknote, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export function HireConfirmModal({
    candidate,
    onClose,
    onConfirm,
    loading
}: {
    candidate: any;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}) {
  // Блокировка скролла на мобильных (предотвращает баг с прыжком страницы)
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

    const [agreed, setAgreed] = useState(false);
    const isCase = candidate?.is_case;
    
    // Считаем комиссию: 8% от годового оклада
    const monthlySalary = candidate.final_price || candidate.estimated_salary || 0;
    const annualSalary = monthlySalary * 12;
    
    // Если это кейс, показываем стоимость проекта, иначе годовую зарплату
    const finalCost = isCase ? monthlySalary : annualSalary;
    const commission = Math.round(finalCost * 0.08);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-surface border border-line rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink">
                    <X size={20} />
                </button>
                
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-accent-soft text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Подтверждение найма</h2>
                    <p className="text-ink-2 text-sm">
                        Вы собираетесь {isCase ? "заказать услугу" : "нанять специалиста"} <b>{candidate.full_name}</b>.
                    </p>
                </div>

                <div className="bg-surface-2 border border-line rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-ink-3 flex items-center gap-2"><Banknote size={16}/> {isCase ? "Стоимость проекта:" : "Оценка в месяц:"}</span>
                        <span className="font-semibold">~ {monthlySalary.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-ink-3">{isCase ? "Итого:" : "Годовой оклад:"}</span>
                        <span className="font-semibold">~ {finalCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="pt-3 border-t border-line flex justify-between items-center">
                        <span className="text-ink font-medium">Комиссия платформы (8%):</span>
                        <span className="text-lg font-bold text-accent">~ {commission.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer group mb-6">
                    <div className="relative flex items-center mt-0.5">
                        <input 
                            type="checkbox" 
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="peer sr-only"
                        />
                        <div className="w-5 h-5 rounded border border-line-2 peer-checked:bg-accent peer-checked:border-accent flex items-center justify-center transition-colors">
                            {agreed && <ShieldCheck size={14} className="text-white" />}
                        </div>
                    </div>
                    <span className="text-[13px] text-ink-2 leading-relaxed select-none group-hover:text-ink transition-colors">
                        Я согласен с <Link to="/terms" target="_blank" className="text-accent hover:underline">условиями найма</Link> и обязуюсь выплатить комиссию платформы в размере 8% от {isCase ? "стоимости проекта" : "годового оклада"} специалиста после успешного закрытия сделки.
                    </span>
                </label>

                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors">
                        Отмена
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={!agreed || loading}
                        className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                        Подтвердить и перейти в чат
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
