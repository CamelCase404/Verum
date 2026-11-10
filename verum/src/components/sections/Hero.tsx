import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import { 
    ChevronRight, ShieldCheck, CheckCircle2, Video, 
    ShieldAlert, Fingerprint, Check, X
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function Hero() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);

    const handleCompany = () => {
        if (!user) navigate("/register?role=company");
        else if (user.role === "company") navigate("/dashboard");
        else toast("Для найма нужен аккаунт компании");
    };

    const handleDev = () => {
        if (!user) navigate("/register?role=developer");
        else if (user.role === "developer") navigate("/dashboard");
        else toast("Для теста нужен аккаунт разработчика");
    };

    return (
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden bg-bg flex items-center min-h-[90vh]">
            {/* Фоновые элементы */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
            
            <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], x: [0, 50, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" 
            />

            <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 lg:gap-12 items-center">
                    
                    {/* ЛЕВАЯ КОЛОНКА: Текст и CTA */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-line text-ink-2 text-[11px] font-semibold uppercase tracking-wider mb-8"
                        >
                            <Fingerprint size={14} className="text-accent" />
                            Платформа верификации IT-кадров
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(36px,5.5vw,64px)] text-ink mb-6"
                        >
                            Нанимайте инженеров <br className="hidden lg:block" />
                            <span className="text-accent relative inline-block">
                                без вайбкодеров
                                {/* Подчеркивание */}
                                <motion.div 
                                    initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 0.8, ease: EASE }}
                                    className="absolute -bottom-1 left-0 right-0 h-[6px] bg-accent/20 rounded-full origin-left" 
                                />
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                            className="text-[16px] md:text-[18px] text-ink-2 max-w-[520px] mx-auto lg:mx-0 leading-relaxed mb-10"
                        >
                            Автоматический скрининг с ИИ и античитом. Вы получаете только проверенные профили с объективной оценкой хард-скиллов и записью честного теста.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
                        >
                            <button
                                onClick={handleCompany}
                                className="h-[54px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/25 hover:bg-accent-2 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Начать найм <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={handleDev}
                                className="h-[54px] px-6 rounded-xl bg-transparent border border-line-2 text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center w-full sm:w-auto"
                            >
                                Я разработчик
                            </button>
                        </motion.div>

                        {/* Микро-фичи */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[13px] text-ink-3 font-medium"
                        >
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Первый тест бесплатно</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Ручная модерация</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Экономия 20+ часов</div>
                        </motion.div>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: Визуальная композиция */}
                    <div className="relative h-[500px] w-full max-w-[500px] mx-auto lg:ml-auto perspective-1000 hidden sm:block">
                        
                        {/* 1. Главная карточка (Результат) */}
                        <motion.div
                            initial={{ opacity: 0, y: 40, rotateX: 10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                            className="absolute top-10 left-1/2 -translate-x-1/2 w-[320px] bg-surface border border-line rounded-2xl shadow-2xl z-20 overflow-hidden"
                        >
                            <div className="px-5 py-4 border-b border-line flex items-center justify-between bg-surface-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[13px]">АК</div>
                                    <div>
                                        <div className="text-[14px] font-bold text-ink">Александр К.</div>
                                        <div className="text-[11px] text-ink-3">Senior Backend</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-md text-[10px] font-bold uppercase">
                                    <ShieldCheck size={12} /> Verified
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <div className="flex justify-between text-[12px] mb-1.5">
                                        <span className="text-ink-3">Архитектура</span>
                                        <span className="font-semibold text-ink">94/100</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "94%" }} transition={{ duration: 1, delay: 1 }} className="h-full bg-accent rounded-full" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[12px] mb-1.5">
                                        <span className="text-ink-3">Ревью кода ИИ</span>
                                        <span className="font-semibold text-ink">88/100</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ duration: 1, delay: 1.2 }} className="h-full bg-accent rounded-full" />
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-line flex items-center justify-between">
                                    <span className="text-[12px] text-ink-3">Грейд подтвержден</span>
                                    <span className="px-2 py-1 bg-surface-2 text-ink text-[11px] font-bold rounded">Middle+</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 2. Левая плашка (Античит) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0, y: [0, -10, 0] }}
                            transition={{ opacity: { duration: 0.5, delay: 0.8 }, x: { duration: 0.5, delay: 0.8 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute top-24 -left-4 w-[200px] bg-surface border border-line rounded-xl shadow-xl z-30 p-4"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-warn/10 text-warn flex items-center justify-center"><ShieldAlert size={16} /></div>
                                <div className="text-[13px] font-bold text-ink">Античит</div>
                            </div>
                            <div className="text-[11px] text-ink-3 leading-tight">Зафиксировано переключение вкладки. Кандидат отклонен.</div>
                        </motion.div>

                        {/* 3. Правая плашка (Запись) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0, y: [0, 10, 0] }}
                            transition={{ opacity: { duration: 0.5, delay: 1 }, x: { duration: 0.5, delay: 1 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute bottom-32 -right-4 w-[180px] bg-surface border border-line rounded-xl shadow-xl z-30 p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink uppercase">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> REC
                                </div>
                                <span className="text-[11px] font-mono text-ink-3">14:02</span>
                            </div>
                            <div className="h-16 bg-surface-2 rounded border border-line flex items-center justify-center overflow-hidden relative">
                                <Video size={20} className="text-ink-4" />
                                <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">WebCam</div>
                            </div>
                        </motion.div>

                        {/* 4. Верхняя плашка (Воронка) */}
                        <motion.div
                            initial={{ opacity: 0, y: -30 }}
                            animate={{ opacity: 1, y: 0, x: [0, -5, 0] }}
                            transition={{ opacity: { duration: 0.5, delay: 1.2 }, y: { duration: 0.5, delay: 1.2 }, x: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                            className="absolute -top-6 right-10 bg-surface border border-line rounded-xl shadow-lg z-30 px-4 py-2 flex items-center gap-3"
                        >
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full bg-surface-2 border-2 border-surface flex items-center justify-center text-[9px] font-bold">1</div>
                                <div className="w-6 h-6 rounded-full bg-surface-2 border-2 border-surface flex items-center justify-center text-[9px] font-bold">2</div>
                                <div className="w-6 h-6 rounded-full bg-accent text-white border-2 border-surface flex items-center justify-center text-[9px] font-bold">3</div>
                            </div>
                            <div className="text-[11px] font-semibold text-ink">3 финалиста</div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
}
