import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, XCircle, FileText, CheckCircle2 } from "lucide-react";
import { api, ApiError } from "../api";
import type { LevelId, ReportResponse } from "../types";

interface Props {
    interviewId: string;
    level: LevelId;
    onReady: (report: ReportResponse) => void;
    onAbort: () => void;
}

type Phase = "pending" | "failed" | "not_found";

export default function Processing({
    interviewId,
    level,
    onReady,
    onAbort,
}: Props) {
    const [phase, setPhase] = useState<Phase>("pending");
    const [elapsed, setElapsed] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [attemptKey, setAttemptKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        let timer: number | undefined;

        const tick = async (attempt: number) => {
            if (cancelled) return;
            try {
                const report = await api.report(interviewId);
                if (cancelled) return;

                // Токен читается из "verum_token" внутри api.ts
                const token = localStorage.getItem("verum_token");
                if (token) {
                    try {
                        // ВАЖНО: Передаем interview_id вместе с отчетом
                        await api.saveSkills({ ...report, interview_id: report.interview_id || interviewId, rejected: report.rejected ?? false });
                        console.log("✅ Результаты сохранены в профиль");
                    } catch (e) {
                        console.warn("⚠ Не удалось сохранить навыки:", e);
                    }
                } else {
                    console.warn(
                        "⚠ Токен не найден в localStorage['verum_token']. " +
                        "Результаты не сохранятся в профиль.",
                    );
                }

                onReady(report);
            } catch (e) {
                if (cancelled) return;
                if (e instanceof ApiError && e.status === 404) {
                    setPhase("not_found");
                    return;
                }
                if (
                    e instanceof ApiError &&
                    (e.status === 409 || e.status === 0 || e.status >= 500)
                ) {
                    const backoff = Math.min(5000, 1200 + attempt * 400);
                    timer = window.setTimeout(() => tick(attempt + 1), backoff);
                    return;
                }
                setPhase("failed");
                setErrorMsg(e instanceof ApiError ? e.message : String(e));
            }
        };

        void tick(0);

        const started = Date.now();
        const el = window.setInterval(
            () => setElapsed(Math.round((Date.now() - started) / 1000)),
            500,
        );

        return () => {
            cancelled = true;
            if (timer) window.clearTimeout(timer);
            window.clearInterval(el);
        };
    }, [interviewId, onReady, attemptKey]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-card rounded-[22px] shadow-card p-8 text-center">
                {phase === "pending" && (
                    <>
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-surface-2"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 size={28} className="text-accent animate-pulse" />
                            </div>
                        </div>
                        
                        <h1 className="text-[22px] font-bold mb-2">Анализируем ваши ответы</h1>
                        <p className="text-[13px] text-muted mb-8 max-w-[280px] mx-auto leading-relaxed">
                            ИИ оценивает архитектурное мышление и работу с кодом. Обычно это занимает до 40 секунд.
                        </p>
                        
                        <div className="space-y-3 text-left max-w-[240px] mx-auto mb-8">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 size={18} className="text-accent" />
                                <span className="text-[13px] text-ink font-medium">Видео загружено</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Loader2 size={18} className="text-accent animate-spin" />
                                <span className="text-[13px] text-ink font-medium">ИИ формирует вердикт...</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-40">
                                <div className="w-4 h-4 rounded-full border-2 border-muted flex items-center justify-center"></div>
                                <span className="text-[13px] text-muted">Готовый отчёт</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-muted font-mono bg-page px-3 py-1.5 rounded-lg inline-block">
                            {elapsed} с · ID: {interviewId.slice(0, 8)}
                        </p>
                    </>
                )}

                {phase === "not_found" && (
                    <>
                        <div className="mx-auto w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                            <XCircle size={26} />
                        </div>
                        <h1 className="mt-4 text-[20px] font-bold">Интервью не найдено</h1>
                        <p className="mt-1 text-[13px] text-muted">
                            Возможно, сессия была удалена или истекла. Начните заново.
                        </p>
                        <button
                            onClick={onAbort}
                            className="mt-5 inline-flex items-center gap-2 rounded-[22px] bg-accent text-white px-4 py-2 font-medium"
                        >
                            <FileText size={16} /> На главную
                        </button>
                    </>
                )}

                {phase === "failed" && (
                    <>
                        <div className="mx-auto w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                            <AlertTriangle size={26} />
                        </div>
                        <h1 className="mt-4 text-[20px] font-bold">Не удалось получить отчёт</h1>
                        <p className="mt-1 text-[13px] text-red-600">{errorMsg}</p>
                        <div className="mt-5 flex gap-2 justify-center">
                            <button
                                onClick={() => {
                                    setPhase("pending");
                                    setErrorMsg(null);
                                    setAttemptKey((k) => k + 1);
                                }}
                                className="rounded-[22px] bg-accent text-white px-4 py-2 font-medium"
                            >
                                Повторить
                            </button>
                            <button
                                onClick={onAbort}
                                className="rounded-[22px] border border-divider px-4 py-2 font-medium"
                            >
                                На главную
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
