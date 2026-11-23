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
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ReportResponse } from "../types";
import { SkillRadar } from "../components/SkillRadar";

export default function Report({
    report,
    onRestart,
}: {
    report: ReportResponse;
    onRestart?: () => void;
}) {
    const goToDashboard = () => {
        window.location.href = "http://verumskills.ru";
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in duration-500">
            <div className="bg-card border border-divider rounded-[22px] shadow-card p-6 sm:p-8 space-y-8">
                <header className="text-center border-b border-divider pb-6">
                    <h1 className="text-[28px] font-bold text-ink">
                        Результат интервью
                    </h1>
                    <p className="text-ink-3 text-[14px] mt-1">
                        Уровень: {report.level} · Стек: {report.stack_id} ·
                        Язык: {report.language_id}
                        {report.library_id &&
                            ` · Библиотека: ${report.library_id}`}
                    </p>
                </header>

                {/* ГРЕЙД */}
                {!report.rejected && report.final_grade && (
                    <div className="flex flex-col items-center justify-center py-8 bg-page rounded-[22px] border border-divider">
                        <span className="text-[14px] text-ink-3 uppercase tracking-widest mb-2">
                            Итоговый уровень
                        </span>
                        <span className="text-[56px] font-black leading-none text-accent">
                            {report.final_grade}
                        </span>
                        {report.total_score_100 != null && (
                            <div className="mt-4 flex flex-col items-center w-full max-w-xs">
                                <span className="text-[16px] font-bold text-ink mb-2">
                                    Общий балл: {report.total_score_100} / 100
                                </span>
                                <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-accent"
                                        style={{
                                            width: `${report.total_score_100}%`,
                                        }}
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
                            <div className="font-bold text-warn text-[16px]">
                                Интервью прервано
                            </div>
                            <div className="text-[14px] text-warn/80 mt-1">
                                {report.reject_reason}
                            </div>
                        </div>
                    </div>
                )}

                {!report.rejected && (
                    <>
                        {/* ПАУТИНА НАВЫКОВ + КОММЕНТАРИИ */}
                        <section className="bg-card p-6 rounded-[22px] border border-divider shadow-sm">
                            <h2 className="text-[18px] font-bold text-ink mb-6 flex items-center gap-2">
                                <BarChart3 size={20} className="text-accent" />{" "}
                                Паутина навыков
                            </h2>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1 flex justify-center">
                                    <SkillRadar
                                        skills={report.skill_comments || []}
                                    />
                                </div>
                                <div className="flex-1 w-full space-y-4">
                                    {(report.skill_comments || []).map(
                                        (sc, idx) => {
                                            const color =
                                                sc.verdict === "strong"
                                                    ? "text-accent"
                                                    : sc.verdict === "weak"
                                                      ? "text-red-500"
                                                      : "text-amber-500";
                                            const Icon =
                                                sc.verdict === "strong"
                                                    ? CheckCircle2
                                                    : sc.verdict === "weak"
                                                      ? XCircle
                                                      : AlertTriangle;
                                            return (
                                                <motion.div
                                                    initial={{
                                                        opacity: 0,
                                                        x: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: 0.3 + idx * 0.1,
                                                    }}
                                                    key={sc.skill}
                                                    className="bg-page p-3 rounded-xl border border-divider"
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span
                                                            className={`text-[13px] font-bold ${color} flex items-center gap-1.5`}
                                                        >
                                                            <Icon size={14} />{" "}
                                                            {sc.skill
                                                                .replace(
                                                                    "_",
                                                                    " ",
                                                                )
                                                                .toUpperCase()}
                                                        </span>
                                                        <span className="text-[13px] font-bold text-ink">
                                                            {sc.score}/100
                                                        </span>
                                                    </div>
                                                    <p className="text-[12px] text-ink-2 leading-relaxed">
                                                        {sc.comment}
                                                    </p>
                                                </motion.div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* ИИ-РЕЗЮМЕ */}
                        {report.ai_resume && (
                            <section className="bg-accent-soft/30 p-6 rounded-[22px] border border-accent/20 relative overflow-hidden">
                                <Sparkles className="absolute -top-4 -right-4 text-accent/10 w-24 h-24" />
                                <h2 className="text-[16px] font-bold text-accent mb-3 flex items-center gap-2 relative z-10">
                                    <Brain size={18} /> ИИ-Резюме
                                </h2>
                                <p className="text-[14px] leading-relaxed text-ink/90 relative z-10 whitespace-pre-line">
                                    {report.ai_resume}
                                </p>
                            </section>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-accent-soft/50 rounded-[22px] p-5 border border-accent/10">
                                <h2 className="text-[15px] font-bold text-accent mb-3 flex items-center gap-2">
                                    <CheckCircle2 size={18} /> Что знаете хорошо
                                </h2>
                                <ul className="list-disc pl-5 text-[14px] space-y-1.5 text-ink/80">
                                    {(report.top_strengths?.length
                                        ? report.top_strengths
                                        : report.strengths
                                    ).map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                    {!report.top_strengths?.length &&
                                        !report.strengths.length && (
                                            <li>Не выявлены</li>
                                        )}
                                </ul>
                            </div>
                            <div className="bg-warn-soft/20 rounded-[22px] p-5 border border-warn/20">
                                <h2 className="text-[15px] font-bold text-warn mb-3 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Что подтянуть
                                </h2>
                                <ul className="list-disc pl-5 text-[14px] space-y-1.5 text-ink/80">
                                    {(report.top_gaps?.length
                                        ? report.top_gaps
                                        : report.gaps
                                    ).map((s, i) => (
                                        <li key={i}>{s}</li>
                                    ))}
                                    {!report.top_gaps?.length &&
                                        !report.gaps.length && (
                                            <li>Не выявлены</li>
                                        )}
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
