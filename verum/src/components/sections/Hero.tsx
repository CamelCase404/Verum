import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import { ChevronRight, Building2, Briefcase, Users, ShieldCheck, CheckCircle2 } from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const SEGMENTS = [
    { icon: Building2, title: "Стартапам и небольшим командам", desc: "Тимлид экономит 20+ часов в месяц, которые раньше уходили на технические собеседования." },
    { icon: Briefcase, title: "Продуктовым компаниям", desc: "Быстрый скрининг при пиковых нагрузках найма. Автоматический отсев до 70% неподходящих." },
    { icon: Users, title: "IT-агентствам и аутсорсу", desc: "Отсеиваем вайбкодеров до передачи кандидата клиенту. Рекомендации с обоснованием." },
];

const STATS = [
    { value: "70%", label: "Кандидатов отсеивается автоматически" },
    { value: "20ч", label: "Экономии времени на каждом найме" },
    { value: "3 дня", label: "От заявки до проверенного финалиста" },
];

export function Hero() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);

    const handleCompanyClick = () => {
        if (!user) navigate("/register?role=company");
        else if (user.role === "company") navigate("/dashboard");
        else toast("Для найма нужен аккаунт компании");
    };

    const handleDeveloperClick = () => {
        if (!user) navigate("/register?role=developer");
        else if (user.role === "developer") navigate("/dashboard");
        else toast("Для прохождения теста нужен аккаунт разработчика");
    };

    return (
        <section className="pt-12 md:pt-20 pb-16 md:pb-24 bg-bg relative">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-start">
                    {/* ЛЕВАЯ КОЛОНКА: слоган + CTA + статистика */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-2 border border-line text-ink-2 text-[12px] font-semibold uppercase tracking-wider mb-6"
                        >
                            <ShieldCheck size={14} className="text-accent" /> B2B Скрининг IT-кадров
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                            className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(32px,5.5vw,60px)] text-ink mb-6"
                        >
                            Платформа <span className="text-accent">проверенных</span> IT-специалистов
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                            className="text-[16px] md:text-[18px] text-ink-2 max-w-[560px] leading-relaxed mb-8"
                        >
                            Автоматизированный отбор инженеров с объективной оценкой навыков, записью теста и ручной модерацией. Без вайбкодеров и фейковых резюме.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
                        >
                            <button
                                onClick={handleCompanyClick}
                                className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
                            >
                                Найти специалиста <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={handleDeveloperClick}
                                className="h-[52px] px-8 rounded-xl bg-surface border border-line-2 text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center"
                            >
                                Я разработчик
                            </button>
                        </motion.div>

                        {/* Метрики */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
                            className="grid grid-cols-3 gap-4 md:gap-6 pt-8 border-t border-line"
                        >
                            {STATS.map((s, i) => (
                                <div key={i}>
                                    <div className="text-[24px] md:text-[32px] font-bold text-ink leading-none mb-1">{s.value}</div>
                                    <div className="text-[11px] md:text-[12px] text-ink-3 leading-snug">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ПРАВАЯ КОЛОНКА: кому подходит */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="bg-surface border border-line rounded-2xl p-6 md:p-8"
                    >
                        <div className="text-[11px] font-bold uppercase tracking-wider text-ink-3 mb-1">Кому подходит</div>
                        <h2 className="text-[20px] font-semibold text-ink mb-6">Решаем задачи найма в IT</h2>

                        <div className="space-y-5">
                            {SEGMENTS.map((seg, i) => {
                                const Icon = seg.icon;
                                return (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-surface-2 border border-line flex items-center justify-center text-accent shrink-0">
                                            <Icon size={18} />
                                        </div>
                                        <div>
                                            <div className="text-[14px] font-semibold text-ink mb-1">{seg.title}</div>
                                            <div className="text-[13px] text-ink-3 leading-relaxed">{seg.desc}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-line">
                            <div className="flex items-center gap-2 text-[12px] text-ink-3 mb-3">
                                <CheckCircle2 size={14} className="text-accent" /> Для разработчиков — бесплатно
                            </div>
                            <button
                                onClick={handleCompanyClick}
                                className="w-full h-[42px] rounded-lg bg-surface-2 border border-line-2 text-ink text-[13px] font-medium hover:bg-surface-3 transition-colors"
                            >
                                Подключить компанию
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
