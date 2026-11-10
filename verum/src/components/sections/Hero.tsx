import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import { Particles } from "@/components/ui/Particles";
import { ShieldCheck, Clock, ChevronRight, CheckCircle2, Cpu } from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function Hero() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);

    const handleCompanyClick = () => {
        if (!user) {
            navigate("/register?role=company");
        } else if (user.role === "company") {
            navigate("/dashboard");
        } else {
            toast("Вы вошли как разработчик. Для найма нужен аккаунт компании.");
        }
    };

    const handleDeveloperClick = () => {
        if (!user) {
            navigate("/register?role=developer");
        } else if (user.role === "developer") {
            navigate("/dashboard");
        } else {
            toast("Вы вошли как компания. Для прохождения теста нужен аккаунт разработчика.");
        }
    };

    return (
        <section className="pt-10 md:pt-16 pb-16 md:pb-24 relative overflow-hidden">
            <Particles />

            {/* Фоновые пятна (динамичные) */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.15, 0.3, 0.15] }}
                transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-40 -right-40 w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full bg-accent-soft/40 blur-[120px] pointer-events-none -z-10"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -bottom-40 -left-40 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-accent/10 blur-[100px] pointer-events-none -z-10"
            />

            <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center w-full">
                    
                    {/* ЛЕВАЯ КОЛОНКА: B2B Фокус */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: EASE }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] font-semibold uppercase tracking-wider mb-6"
                        >
                            <ShieldCheck size={14} /> Платформа верификации IT-кадров
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                            className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(32px,5vw,64px)] text-ink mb-6"
                        >
                            Найм разработчиков <br className="hidden md:block" />
                            <span className="text-accent">без ручного</span> скрининга
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                            className="text-[16px] md:text-[18px] text-ink-2 max-w-[540px] mx-auto lg:mx-0 leading-relaxed mb-8"
                        >
                            Автоматически отсеиваем 70% фейков и вайбкодеров. Вы получаете только проверенных инженеров с объективными метриками и записью честного теста.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10"
                        >
                            <button
                                onClick={handleCompanyClick}
                                className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[16px] shadow-lg shadow-accent/25 hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Найти специалиста <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={handleDeveloperClick}
                                className="h-[52px] px-8 rounded-xl bg-surface border border-line-2 text-ink font-medium text-[16px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Я разработчик
                            </button>
                        </motion.div>

                        {/* Мини-фичи под кнопками */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[13px] text-ink-3 font-medium"
                        >
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-accent" /> Только чистые профили
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-accent" /> Экономия 20+ часов
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-accent" /> Отчеты с тайм-кодами
                            </div>
                        </motion.div>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Живой Дашборд (Воронка) */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                        className="relative mx-auto w-full max-w-[500px] mt-12 lg:mt-0"
                    >
                        {/* Флоатинги (плавающие виджеты) */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -left-4 md:-left-8 z-20 bg-surface p-3 rounded-xl shadow-xl border border-line flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center shrink-0">
                                <Clock size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-ink-3 font-semibold uppercase tracking-wider">Сэкономлено</div>
                                <div className="text-[14px] font-bold text-ink">142 часа</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-6 -right-4 md:-right-8 z-20 bg-surface p-3 rounded-xl shadow-xl border border-line flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-accent-soft text-accent flex items-center justify-center shrink-0">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <div className="text-[10px] text-ink-3 font-semibold uppercase tracking-wider">Отсеяно фейков</div>
                                <div className="text-[14px] font-bold text-ink">78%</div>
                            </div>
                        </motion.div>

                        {/* Карточка-мокап дашборда */}
                        <div className="bg-surface border border-line rounded-[22px] shadow-2xl overflow-hidden relative">
                            <div className="px-5 py-4 border-b border-line bg-surface-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="text-[13px] font-semibold text-ink">Воронка кандидатов</span>
                                </div>
                                <span className="text-[11px] text-ink-3 font-medium">Обновлено только что</span>
                            </div>

                            <div className="p-4 space-y-3">
                                {/* Кандидат 1 (Одобрен) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                                    className="flex items-center gap-3 p-3 bg-surface-2 border border-line rounded-xl"
                                >
                                    <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[13px]">АК</div>
                                    <div className="flex-1">
                                        <div className="text-[13px] font-semibold text-ink">Александр К.</div>
                                        <div className="text-[11px] text-ink-3">Senior Backend (Python)</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[14px] font-bold text-accent">95/100</div>
                                        <div className="text-[10px] text-accent font-semibold uppercase">Одобрен</div>
                                    </div>
                                </motion.div>

                                {/* Кандидат 2 (В процессе) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                                    className="flex items-center gap-3 p-3 bg-surface border border-accent/30 rounded-xl relative overflow-hidden"
                                >
                                    <motion.div 
                                        className="absolute bottom-0 left-0 h-1 bg-accent"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="w-10 h-10 rounded-full bg-surface-2 text-ink-3 flex items-center justify-center font-bold text-[13px]">МС</div>
                                    <div className="flex-1">
                                        <div className="text-[13px] font-semibold text-ink">Мария С.</div>
                                        <div className="text-[11px] text-ink-3">Middle Frontend (React)</div>
                                    </div>
                                    <div className="text-right flex items-center gap-2">
                                        <Cpu size={16} className="text-accent animate-pulse" />
                                        <div className="text-[11px] text-ink-3 font-medium">ИИ проверяет...</div>
                                    </div>
                                </motion.div>

                                {/* Кандидат 3 (Отклонен) */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                                    className="flex items-center gap-3 p-3 bg-surface-2 border border-line rounded-xl opacity-60"
                                >
                                    <div className="w-10 h-10 rounded-full bg-warn/10 text-warn flex items-center justify-center font-bold text-[13px]">ДЕ</div>
                                    <div className="flex-1">
                                        <div className="text-[13px] font-semibold text-ink">Дмитрий Е.</div>
                                        <div className="text-[11px] text-ink-3">Junior (QA Automation)</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[14px] font-bold text-warn">12/100</div>
                                        <div className="text-[10px] text-warn font-semibold uppercase">Отклонен</div>
                                    </div>
                                </motion.div>
                            </div>
                            
                            <div className="px-4 py-3 border-t border-line bg-surface-2 text-center">
                                <button onClick={handleCompanyClick} className="text-[12px] font-semibold text-accent hover:underline">
                                    Посмотреть всех кандидатов →
                                </button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
