import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    AlertTriangle,
    RotateCcw,
    Loader2,
    Check,
    ShieldAlert,
    Sun,
    Moon,
    ArrowLeft
} from "lucide-react";
import { api, ApiError } from "../api";
import { getIcon } from "../icons";
import type {
    CatalogResponse,
    LevelApi,
    LevelId,
    Option,
    StackOption,
    SessionState,
} from "../types";
import type { StartPayload } from "../App";

interface Props {
    activeSession: SessionState | null;
    onStarted: (payload: StartPayload) => void;
    onAbandon: () => void;
}

const LEVEL_TO_API: Record<LevelId, LevelApi> = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
};

export default function Landing({ activeSession, onStarted, onAbandon }: Props) {
    const [catalog, setCatalog] = useState<CatalogResponse | null>(null);
    const [catalogError, setCatalogError] = useState<string | null>(null);

    const [levelId, setLevelId] = useState<LevelId>("middle");
    const [stackId, setStackId] = useState<string>("");
    const [languageIds, setLanguageIds] = useState<string[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Состояние темы
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    useEffect(() => {
        const saved = localStorage.getItem("verum.lastSettings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.level) setLevelId(parsed.level.toLowerCase() as LevelId);
                if (parsed.stack) setStackId(parsed.stack);
                if (parsed.langs && Array.isArray(parsed.langs)) setLanguageIds(parsed.langs);
                localStorage.removeItem("verum.lastSettings");
            } catch (e) {}
        }
    }, []);

    const load = () => {
        setCatalogError(null);
        api.catalog()
            .then(setCatalog)
            .catch((e: unknown) => setCatalogError(e instanceof ApiError ? e.message : String(e)));
    };

    useEffect(() => {
        load();
    }, []);

    const _level: Option | undefined = useMemo(() => catalog?.levels.find((l) => l.id === levelId), [catalog, levelId]);
    const stack: StackOption | undefined = useMemo(() => catalog?.stacks.find((s) => s.id === stackId), [catalog, stackId]);

    const canStart = Boolean(stackId && languageIds.length > 0) && !loading;

    const toggleLanguage = (id: string) => {
        if (languageIds.includes(id)) setLanguageIds((ids) => ids.filter((x) => x !== id));
        else if (languageIds.length < 4) setLanguageIds((ids) => [...ids, id]);
    };

    const start = async () => {
        if (!canStart) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.startInterview(LEVEL_TO_API[levelId], stackId, languageIds);
            onStarted({
                interviewId: res.interview_id,
                level: levelId,
                stackId,
                languageId: languageIds.join(", "),
                firstQuestion: res.question,
                stage: res.stage,
                stageName: res.stage_name,
            });
        } catch (e) {
            setError(e instanceof ApiError ? e.message : String(e));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative">
            {/* Кнопка переключения темы (Тумблер) */}
            <a 
                href="https://verumskills.ru/dashboard" 
                className="absolute top-6 left-6 z-50 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-divider text-sm font-medium text-ink-2 hover:text-accent hover:bg-surface-2 transition-colors shadow-sm"
            >
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Вернуться на сайт</span>
            </a>

            <button 
                onClick={toggleTheme} 
                className={`fixed top-6 right-6 z-50 inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none shadow-md border ${
                    theme === "dark" ? "bg-accent/20 border-accent/30" : "bg-card border-divider"
                }`}
            >
                <span className="sr-only">Переключить тему</span>
                <span className={`absolute left-2 transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"}`}>
                    <Moon size={16} className="text-accent" />
                </span>
                <span className={`absolute right-2 transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-100"}`}>
                    <Sun size={16} className="text-muted" />
                </span>
                <span
                    className={`inline-block h-6 w-6 transform rounded-full shadow-sm ring-0 transition-transform duration-300 ease-in-out ${
                        theme === "dark" ? "translate-x-9 bg-accent" : "translate-x-1 bg-white"
                    }`}
                />
            </button>

            <div className="w-full max-w-4xl">
                <div className="mb-6 rounded-[22px] border border-amber-200/20 bg-amber-500/10 px-5 py-4 flex items-start gap-3 shadow-sm">
                    <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={20} />
                    <div>
                        <h3 className="text-[14px] font-bold text-amber-500">Внимание: запись анализируется</h3>
                        <p className="text-[13px] text-amber-500/80 mt-1 leading-snug">
                            Аудио и видео с камеры будут записаны и отправлены на рассмотрение ревьюеру. Ответы оцениваются с помощью ИИ. Не пытайтесь использовать сторонние источники.
                        </p>
                    </div>
                </div>

                {activeSession && (
                    <div className="mb-4 rounded-[22px] border border-amber-200/20 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
                        <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                        <div className="flex-1">
                            <div className="text-[14px] font-medium text-amber-500">Найдено незавершённое интервью</div>
                            <div className="text-[12px] text-amber-500/80">Вы не можете его продолжить, так как сессия была прервана. Начните заново.</div>
                        </div>
                        <button onClick={onAbandon} className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 px-3 py-1.5 text-[13px] text-amber-500 hover:bg-amber-500/20 transition">
                            <RotateCcw size={14} /> Сбросить
                        </button>
                    </div>
                )}

                <div className="bg-card border border-divider rounded-[22px] shadow-card p-6 sm:p-10 transition-colors duration-300">
                    <h1 className="text-[28px] font-bold text-ink text-center transition-colors duration-300">Проверка знаний</h1>
                    <p className="text-muted mt-2 text-[15px] text-center transition-colors duration-300">Выберите уровень, стек и до 4 языков.</p>

                    {catalogError && (
                        <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-[13px] text-red-500 flex items-center justify-between">
                            <span>Ошибка загрузки: {catalogError}</span>
                            <button onClick={load} className="underline">Повторить</button>
                        </div>
                    )}

                    <section className="mt-10">
                        <h2 className="text-[13px] font-semibold tracking-wide uppercase text-muted text-center">Уровень</h2>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {catalog?.levels.map((l) => {
                                const active = l.id === levelId;
                                const Icon = getIcon(l.icon);
                                return (
                                    <button
                                        key={l.id}
                                        onClick={() => setLevelId(l.id as LevelId)}
                                        className={`text-left rounded-[22px] border p-4 transition-all duration-200 active:scale-95 ${active ? "border-accent bg-accent text-white shadow-lg shadow-accent/20" : "border-line bg-surface-3 hover:border-line-2 hover:bg-surface-2"}`}
                                    >
                                        <div className="flex items-center gap-2 justify-center">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${active ? "bg-white/20 text-white shadow-sm" : "bg-card text-ink"}`}>
                                                <Icon size={16} />
                                            </span>
                                            <span className="font-semibold text-[15px]">{l.name}</span>
                                        </div>
                                        <p className={`text-[12px] mt-3 text-center leading-snug ${active ? "text-white/80" : "text-muted"}`}>{l.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mt-10">
                        <h2 className="text-[13px] font-semibold tracking-wide uppercase text-muted text-center">Стек</h2>
                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                            {catalog?.stacks.map((s) => {
                                const active = s.id === stackId;
                                const Icon = getIcon(s.icon);
                                return (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setStackId(s.id);
                                            setLanguageIds([]);
                                        }}
                                        className={`flex items-center gap-3 rounded-[22px] border px-5 py-3 transition-all duration-200 active:scale-95 ${active ? "border-accent bg-accent text-white shadow-lg shadow-accent/20" : "border-line bg-surface-3 hover:border-line-2 hover:bg-surface-2"}`}
                                    >
                                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${active ? "bg-white/20 text-white shadow-sm" : "bg-card text-ink"}`}>
                                            <Icon size={18} />
                                        </span>
                                        <span className="font-semibold text-[14px]">{s.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {stack && (
                        <motion.section 
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.3 }}
                            className="mt-10"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <h2 className="text-[13px] font-semibold tracking-wide uppercase text-muted">Языки (макс. 4)</h2>
                                <span className="text-[12px] font-medium bg-surface-3 px-2 py-0.5 rounded text-muted">{languageIds.length} / 4</span>
                            </div>
                            <div className="mt-4 flex flex-wrap justify-center gap-3">
                                {stack.languages.map((lang) => {
                                    const active = languageIds.includes(lang.id);
                                    const Icon = getIcon(lang.icon);
                                    return (
                                        <button
                                            key={lang.id}
                                            onClick={() => toggleLanguage(lang.id)}
                                            disabled={!active && languageIds.length >= 4}
                                            className={`flex items-center gap-2 rounded-[22px] border px-4 py-3 transition-all duration-200 active:scale-95 ${active ? "border-accent bg-accent text-white shadow-md shadow-accent/20" : "border-line bg-surface-3 hover:border-line-2 hover:bg-surface-2"} ${!active && languageIds.length >= 4 ? "opacity-40 cursor-not-allowed" : ""}`}
                                        >
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${active ? "bg-white/20 text-white" : "bg-card text-ink"}`}>
                                                <Icon size={16} />
                                            </span>
                                            <span className="font-medium text-[13px]">{lang.name}</span>
                                            {active && <Check size={14} className="ml-1 text-white" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.section>
                    )}

                    <div className="mt-12 pt-8 border-t border-divider flex flex-col items-center transition-colors duration-300">
                        <button
                            disabled={!canStart}
                            onClick={start}
                            className="w-full max-w-sm inline-flex items-center justify-center gap-2 rounded-[22px] bg-accent text-white font-semibold py-4 disabled:opacity-40 transition-colors duration-200 shadow-lg"
                        >
                            {loading ? (
                                <><Loader2 size={18} className="animate-spin" /> Готовим интервью…</>
                            ) : (
                                "Начать интервью"
                            )}
                        </button>
                        {error && <p className="mt-3 text-red-500 text-[13px] text-center">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
