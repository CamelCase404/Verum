import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";
import { vacancyApi } from "@/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

export function PublicVacancy() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        vacancyApi.getPublic(slug as string)
            .then((res) => setJob(res.data))
            .catch((e) => setError(e.message || "Вакансия не найдена"))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleApply = () => {
        localStorage.setItem("verum.pending_job", JSON.stringify(job));
        
        if (!user) {
            navigate(`/register?role=developer&job=${slug}`);
        } else {
            // Пользователь уже зареган. Спрашиваем подтверждение пересдачи
            const confirmRetake = window.confirm(
                "Вы уже зарегистрированы на Verum.\n\n" +
                "Для отклика на эту вакансию вам нужно будет пройти собеседование заново, " +
                "даже если вы проходили его недавно.\n\n" +
                "Предыдущие результаты сохранятся в профиле, но в топ этой вакансии попадут новые.\n\n" +
                "Продолжить?"
            );
            if (confirmRetake) {
                navigate(`/dashboard?action=interview&job=${slug}`);
            }
        }
    };

    if (loading) return <div className="min-h-screen bg-bg flex items-center justify-center"><Loader2 className="animate-spin text-accent" size={32} /></div>;
    if (error) return <div className="min-h-screen bg-bg flex items-center justify-center text-ink-3">{error}</div>;

    return (
        <div className="min-h-[80vh] bg-bg py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-surface border border-line rounded-2xl p-8 md:p-10 shadow-sm">
                    <div className="flex items-start justify-between gap-6 mb-8">
                        <div>
                            <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-3 uppercase tracking-wider mb-2">
                                <Briefcase size={14} /> Внешняя вакансия
                            </div>
                            <h1 className="text-3xl font-bold text-ink mb-2">{job.title}</h1>
                            <div className="text-lg font-medium text-accent">{job.company_name}</div>
                        </div>
                        {job.company_avatar && (
                            <img src={job.company_avatar} className="w-16 h-16 rounded-xl object-cover border border-line" />
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8 pb-8 border-b border-line">
                        <span className="px-3 py-1.5 bg-surface-2 border border-line rounded-lg text-sm font-medium">{job.stack}</span>
                        <span className="px-3 py-1.5 bg-surface-2 border border-line rounded-lg text-sm font-medium">{job.level}</span>
                        <span className="px-3 py-1.5 bg-surface-2 border border-line rounded-lg text-sm font-medium">{job.format}</span>
                        {job.salary && <span className="px-3 py-1.5 bg-accent-soft text-accent rounded-lg text-sm font-semibold">{job.salary}</span>}
                    </div>

                    <div className="prose prose-sm text-ink-2 mb-10 whitespace-pre-line">
                        {job.description}
                    </div>

                    <div className="bg-surface-2 border border-line rounded-xl p-6 text-center">
                        <h3 className="font-semibold text-ink mb-2">Хотите откликнуться?</h3>
                        <p className="text-[13px] text-ink-3 mb-6 max-w-md mx-auto">
                            Пройдите ИИ-собеседование на платформе Verum. Ваш результат будет автоматически прикреплен к этой вакансии и увиден рекрутером компании.
                        </p>
                        <button
                            onClick={handleApply}
                            className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-xl bg-accent text-white font-medium hover:bg-accent-2 transition-colors w-full sm:w-auto"
                        >
                            {user ? "Пройти собеседование" : "Зарегистрироваться и пройти"} <ArrowRight size={18} />
                        </button>
                        <div className="mt-4 text-[12px] text-ink-3 flex items-center justify-center gap-1.5">
                            <ShieldCheck size={14} className="text-accent" /> Для разработчиков бесплатно
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
