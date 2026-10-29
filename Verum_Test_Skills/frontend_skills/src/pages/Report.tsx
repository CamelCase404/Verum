import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    BarChart3,
    Brain,
    Code2,
    MessageSquare,
    Terminal,
    Layers,
    ExternalLink,
} from "lucide-react";
import type { ReportResponse } from "../types";

function StatBar({
    label,
    score,
    icon: Icon,
}: {
    label: string;
    score?: number | null;
    icon: any;
}) {
    if (score === undefined || score === null) return null;
    return (
        <div className="mb-5">
            <div className="flex justify-between items-center text-[14px] mb-1.5">
                <span className="font-medium text-ink flex items-center gap-2">
                    <Icon size={16} className="text-ink-3" /> {label}
                </span>
                <span className="font-bold text-ink">{score} / 100</span>
            </div>
            <div className="h-2.5 w-full bg-page rounded-full overflow-hidden">
                <div
                    className="h-full bg-accent transition-all duration-1000 ease-out"
                    style={{ width: `${score}%` }}
                />
            </div>
        </div>
    );
}

export default function Report({
    report,
}: {
    report: ReportResponse;
}) {
    const goToDashboard = () => {
        window.location.href = "https://verumskills.ru/dashboard";
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 animate-in fade-in duration-500">
            <div className="bg-card border border-divider rounded-[22px] shadow-card p-8 space-y-8">
                <header className="text-center border-b border-divider pb-6">
                    <h1 className="text-[28px] font-bold text-ink">Результат интервью</h1>
                    <p className="text-ink-3 text-[14px] mt-1">
                        Уровень: {report.level} · Стек: {report.stack_id} · Язык: {report.language_id}
                    </p>
                </header>

                {!report.rejected && report.final_grade && (
                    <div className="flex flex-col items-center justify-center py-8 bg-page rounded-[22px] border border-divider">
                        <span className="text-[14px] text-ink-3 uppercase tracking-widest mb-2">
                            Ваш итоговый уровень
                        </span>
                        <span className="text-[56px] font-black leading-none text-accent">
                            {report.final_grade}
                        </span>
                        {report.total_score_100 !== undefined &&
                            report.total_score_100 !== null && (
                                <div className="mt-4 flex flex-col items-center w-full max-w-xs">
                                    <span className="text-[16px] font-bold text-ink mb-2">
                                        Общий балл: {report.total_score_100} / 100
                                    </span>
                                    <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-accent"
                                            style={{ width: `${report.total_score_100}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                    </div>
                )}

                {report.rejected && (
                    <div className="rounded-[22px] border border-warn-soft bg-warn-soft/20 px-6 py-5 flex items-start gap-4">
                        <XCircle className="text-warn mt-0.5" size={24} />
                        <div>
                            <div className="font-bold text-warn text-[16px]">Интервью прервано</div>
                            <div className="text-[14px] text-warn/80 mt-1">{report.reject_reason}</div>
                        </div>
                    </div>
                )}

                {!report.rejected && (
                    <>
                        <section className="bg-card p-6 rounded-[22px] border border-divider shadow-sm">
                            <h2 className="text-[18px] font-bold text-ink mb-6 flex items-center gap-2">
                                <BarChart3 size={20} className="text-accent" /> Статистика навыков
                            </h2>
                            <div className="space-y-2">
                                <StatBar label="Понимание архитектуры" score={report.competency_architecture} icon={Layers} />
                                <StatBar label="Понимание кода (Code Review)" score={report.competency_code_understanding} icon={Code2} />
                                <StatBar label="Навык промптинга (Работа с ИИ)" score={report.competency_prompting} icon={MessageSquare} />
                                <StatBar label="Адаптивность к нагрузке" score={report.competency_adaptability} icon={Terminal} />
                                <StatBar label="Soft Skills (Коммуникация)" score={report.competency_soft_skills} icon={Brain} />
                            </div>
                        </section>

                        <section>
                            <h2 className="text-[16px] font-bold mb-3 text-ink">Резюме интервью</h2>
                            <p className="text-[15px] leading-relaxed whitespace-pre-line text-ink/80 bg-page p-5 rounded-[22px] border border-divider">
                                {report.summary}
                            </p>
                        </section>

                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-accent-soft/50 rounded-[22px] p-5 border border-accent/10">
                                <h2 className="text-[15px] font-bold text-accent mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Плюсы
                                </h2>
                                <ul className="list-disc pl-5 text-[14px] space-y-1.5 text-ink/80">
                                    {report.strengths.length > 0
                                        ? report.strengths.map((s, i) => <li key={i}>{s}</li>)
                                        : <li>Не выявлены</li>}
                                </ul>
                            </div>
                            <div className="bg-warn-soft/20 rounded-[22px] p-5 border border-warn/20">
                                <h2 className="text-[15px] font-bold text-warn mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Минусы
                                </h2>
                                <ul className="list-disc pl-5 text-[14px] space-y-1.5 text-ink/80">
                                    {report.gaps.length > 0
                                        ? report.gaps.map((s, i) => <li key={i}>{s}</li>)
                                        : <li>Не выявлены</li>}
                                </ul>
                            </div>
                        </div>
                    </>
                )}

                <div className="flex justify-center pt-6 border-t border-divider">
                    <button
                        onClick={goToDashboard}
                        className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-accent text-white px-10 py-3.5 font-medium hover:brightness-110 transition-all duration-200 min-w-[240px]"
                    >
                        <ExternalLink size={18} /> Вернуться в профиль
                    </button>
                </div>
            </div>
        </div>
    );
}
