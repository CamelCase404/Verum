import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, User, ChevronRight, Briefcase, Award } from "lucide-react";
import { vacancyApi } from "@/api";
import { motion } from "framer-motion";

export function VacancyApplicants() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const jobTitle = location.state?.title || "Отклики на вакансию";

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        vacancyApi.getTop(id)
            .then(res => setItems(res.data.items || []))
            .catch(e => setError(e.message || "Ошибка загрузки"))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div className="max-w-[1000px] w-full mx-auto px-4 py-8 md:py-12">
            <button 
                onClick={() => navigate("/dashboard")} 
                className="inline-flex items-center gap-2 text-ink-2 hover:text-accent mb-6 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} /> Назад в кабинет
            </button>

            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink mb-2">
                    Отклики на вакансию
                </h1>
                <p className="text-ink-3 text-[15px]">{jobTitle}</p>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 text-ink-3">
                    <Loader2 className="animate-spin mb-4 text-accent" size={32} />
                    <span className="text-sm">Загрузка кандидатов...</span>
                </div>
            )}

            {error && (
                <div className="text-center text-warn bg-warn-soft/20 p-6 rounded-2xl border border-warn/20">
                    {error}
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <div className="text-center py-20 border border-dashed border-line-2 rounded-2xl bg-surface-2">
                    <User size={48} className="mx-auto text-ink-4 mb-4 opacity-50" />
                    <h3 className="text-[17px] font-medium text-ink mb-1">Пока нет откликов</h3>
                    <p className="text-[14px] text-ink-3">Разошлите ссылку разработчикам, чтобы они прошли тест.</p>
                </div>
            )}

            {!loading && !error && items.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-ink-3 mb-2">
                        <Award size={16} className="text-accent" /> ТОП {items.length} кандидатов
                    </div>
                    
                    {items.map((c, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={c.id} 
                            onClick={() => navigate(`/profile/${c.id}`)}
                            className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 border border-line rounded-2xl bg-surface hover:border-accent hover:shadow-sm cursor-pointer transition-all group"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="w-8 text-center text-[16px] font-bold text-ink-3 shrink-0">
                                    #{i + 1}
                                </div>
                                <div className="w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-lg overflow-hidden shrink-0 border border-line">
                                    {c.avatar_url ? <img src={c.avatar_url} className="w-full h-full object-cover" /> : c.full_name.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-[16px] text-ink group-hover:text-accent transition-colors truncate">
                                        {c.full_name}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-surface-2 border border-line rounded text-[11px] uppercase font-bold text-ink-2">
                                            {c.final_grade}
                                        </span>
                                        <span className="text-[13px] text-ink-3 truncate max-w-[300px] sm:max-w-[400px]">
                                            {c.summary}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-line">
                                <div className="text-left sm:text-right">
                                    <div className="text-[11px] text-ink-3 mb-0.5 uppercase tracking-wider font-semibold">Балл</div>
                                    <div className="text-[18px] font-bold text-accent leading-none">{c.total_score}<span className="text-[12px] text-ink-3 font-normal">/100</span></div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                                    <ChevronRight size={18} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
