import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, User, ChevronRight, Briefcase } from "lucide-react";
import { vacancyApi } from "@/api";
import { useNavigate } from "react-router-dom";

export function VacancyApplicantsModal({ job, onClose }: { job: any, onClose: () => void }) {
    const navigate = useNavigate();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Блокировка скролла
        const scrollY = window.scrollY;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = "100%";
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    useEffect(() => {
        vacancyApi.getTop(job.id)
            .then(res => setItems(res.data.items || []))
            .catch(e => setError(e.message || "Ошибка загрузки"))
            .finally(() => setLoading(false));
    }, [job.id]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-surface border border-line rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-ink-3 hover:text-ink">
                    <X size={20} />
                </button>

                <div className="mb-6 pr-8">
                    <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                        <Briefcase size={20} className="text-accent" /> 
                        Отклики на вакансию
                    </h2>
                    <p className="text-[13px] text-ink-3 mt-1">{job.title}</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]">
                    {loading && (
                        <div className="flex flex-col items-center justify-center h-full text-ink-3">
                            <Loader2 className="animate-spin mb-3" size={24} />
                            <span className="text-sm">Загрузка кандидатов...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-center text-warn bg-warn-soft/20 p-4 rounded-xl">{error}</div>
                    )}

                    {!loading && !error && items.length === 0 && (
                        <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                            <User size={32} className="mx-auto text-ink-4 mb-3" />
                            <div className="text-[15px] font-medium text-ink mb-1">Пока нет откликов</div>
                            <p className="text-[13px] text-ink-3">Разошлите ссылку разработчикам, чтобы они прошли тест.</p>
                        </div>
                    )}

                    {!loading && !error && items.length > 0 && (
                        <div className="space-y-3">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-2">
                                Рейтинг прошедших (ТОП {items.length})
                            </div>
                            {items.map((c, i) => (
                                <div 
                                    key={c.id} 
                                    onClick={() => navigate(`/profile/${c.id}`)}
                                    className="flex items-center gap-3 p-3 border border-line rounded-xl bg-surface hover:border-accent cursor-pointer transition-colors group"
                                >
                                    <div className="w-6 text-center text-[13px] font-bold text-ink-3 shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold overflow-hidden shrink-0">
                                        {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : c.full_name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-[14px] text-ink group-hover:text-accent transition-colors truncate">
                                            {c.full_name}
                                        </div>
                                        <div className="text-[12px] text-ink-3 flex items-center gap-2">
                                            <span className="px-1.5 py-0.5 bg-surface-2 border border-line rounded text-[10px] uppercase font-bold text-ink-2">
                                                {c.final_grade}
                                            </span>
                                            <span className="truncate max-w-[200px]">{c.summary}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-[14px] font-bold text-accent">{c.total_score}/100</div>
                                    </div>
                                    <ChevronRight size={16} className="text-ink-4 group-hover:text-accent transition-colors shrink-0" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
