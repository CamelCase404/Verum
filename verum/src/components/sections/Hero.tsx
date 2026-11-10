import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import { 
    ChevronRight, Building2, Briefcase, Users, 
    ShieldCheck, Clock, Target, CheckCircle2, 
    Search, FileText, CheckCircle
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const SEGMENTS = [
    { icon: Building2, title: "Стартапам", desc: "Закрывайте вакансии без выделенного HR и сохраните часы тимлида." },
    { icon: Briefcase, title: "Продуктовым командам", desc: "Быстрый скрининг при пиковых нагрузках. Автоматический отсев 70%." },
    { icon: Users, title: "Агентствам", desc: "Проверяйте кандидатов перед передачей клиенту. Прозрачные отчеты." },
];

const STEPS = [
    { icon: FileText, title: "Создайте вакансию", desc: "Укажите стек, грейд и желаемую зарплату. Настройте фильтры." },
    { icon: Search, title: "Отправьте ссылку", desc: "Кандидаты проходят тест с записью экрана и античитом." },
    { icon: CheckCircle, title: "Получите шортлист", desc: "Смотрите только проверенных инженеров с объективными метриками." },
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

    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.7, delay: i * 0.1, ease: EASE }
        })
    };

    return (
        <div className="flex flex-col w-full bg-bg overflow-hidden">
            
            {/* 1. HERO SECTION (Главный экран) */}
            <section className="relative pt-16 md:pt-24 pb-16 md:pb-20">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center">
                        
                        {/* Текст и Главный CTA */}
                        <div className="text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-ink-2 text-[11px] md:text-[12px] font-semibold uppercase tracking-wider mb-6"
                            >
                                <ShieldCheck size={14} className="text-accent" /> Независимая верификация IT-кадров
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                                className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(32px,5vw,56px)] text-ink mb-6"
                            >
                                Платформа <span className="text-accent">проверенных</span> IT-специалистов
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                                className="text-[16px] md:text-[18px] text-ink-2 max-w-[540px] mx-auto lg:mx-0 leading-relaxed mb-8"
                            >
                                Замените ручной скрининг автоматическим тестированием хард-скиллов. Получайте только чистые профили без вайбкодеров и фейковых резюме.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8"
                            >
                                <button
                                    onClick={handleCompanyClick}
                                    className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Подключить компанию <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={handleDeveloperClick}
                                    className="text-[14px] font-medium text-ink-2 hover:text-ink transition-colors underline decoration-line-2 underline-offset-4 w-full sm:w-auto"
                                >
                                    Я ищу работу →
                                </button>
                            </motion.div>
                        </div>

                        {/* Визуализация (Карточка продукта) */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                            className="relative mx-auto w-full max-w-[440px]"
                        >
                            <div className="bg-surface border border-line rounded-2xl shadow-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-line bg-surface-2 flex justify-between items-center">
                                    <span className="text-[13px] font-semibold text-ink">Кандидат верифицирован</span>
                                    <ShieldCheck size={16} className="text-accent" />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-4 mb-5">
                                        <div className="w-14 h-14 rounded-full bg-accent-soft text-accent flex items-center justify-center font-bold text-lg">АК</div>
                                        <div>
                                            <div className="text-[16px] font-bold text-ink">Александр К.</div>
                                            <div className="text-[13px] text-ink-3">Senior Python Developer</div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between items-center text-[13px]">
                                            <span className="text-ink-3">Архитектура</span>
                                            <span className="font-semibold text-ink">92/100</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                            <div className="h-full bg-accent w-[92%] rounded-full" />
                                        </div>
                                        <div className="flex justify-between items-center text-[13px]">
                                            <span className="text-ink-3">Ревью кода</span>
                                            <span className="font-semibold text-ink">88/100</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                            <div className="h-full bg-accent w-[88%] rounded-full" />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-line">
                                        <span className="text-[13px] text-ink-3">Уровень подтвержден</span>
                                        <span className="px-2.5 py-1 bg-accent-soft text-accent text-[11px] font-bold uppercase rounded-md">Senior</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. VALUE PROPOSITION (Почему мы) */}
            <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <motion.div 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
                    >
                        <motion.div variants={fadeUp} custom={0} className="flex flex-col items-center text-center md:items-start md:text-left">
                            <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-accent mb-5 shadow-sm">
                                <Target size={24} />
                            </div>
                            <h3 className="text-[18px] font-semibold text-ink mb-2">Объективные метрики</h3>
                            <p className="text-[14px] text-ink-3 leading-relaxed">Не смотрим на резюме. Оцениваем реальные навыки по 100-балльной шкале и подтверждаем модерацией.</p>
                        </motion.div>

                        <motion.div variants={fadeUp} custom={1} className="flex flex-col items-center text-center md:items-start md:text-left">
                            <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-accent mb-5 shadow-sm">
                                <ShieldCheck size={24} />
                            </div>
                            <h3 className="text-[18px] font-semibold text-ink mb-2">Защита от фейков</h3>
                            <p className="text-[14px] text-ink-3 leading-relaxed">Античит (F12, переключение вкладок, запись камеры) и ручная проверка видео отсеивают вайбкодеров.</p>
                        </motion.div>

                        <motion.div variants={fadeUp} custom={2} className="flex flex-col items-center text-center md:items-start md:text-left">
                            <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center text-accent mb-5 shadow-sm">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-[18px] font-semibold text-ink mb-2">Экономия времени</h3>
                            <p className="text-[14px] text-ink-3 leading-relaxed">Вместо 20 собеседований вы смотрите 2-3 финалиста. Тимлид экономит до 20 часов в месяц.</p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 3. HOW IT WORKS (Как это работает) */}
            <section className="py-16 md:py-24">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="text-center max-w-[600px] mx-auto mb-12">
                        <h2 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.03em] text-ink mb-3">Как это работает</h2>
                        <p className="text-[15px] text-ink-3">От создания вакансии до найма чистого специалиста — 3 простых шага.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                                    className="bg-surface border border-line rounded-2xl p-6 relative"
                                >
                                    <div className="absolute top-6 right-6 text-[40px] font-bold text-surface-2 pointer-events-none select-none">
                                        0{i + 1}
                                    </div>
                                    <Icon size={24} className="text-accent mb-4" />
                                    <h4 className="text-[16px] font-semibold text-ink mb-2">{step.title}</h4>
                                    <p className="text-[14px] text-ink-3 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. FOR WHOM (Кому подходит) */}
            <section className="py-16 md:py-24 bg-surface-2 border-t border-line">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
                        <div>
                            <h2 className="text-[24px] md:text-[32px] font-semibold tracking-[-0.03em] text-ink mb-4">Для кого создан Верум</h2>
                            <p className="text-[15px] text-ink-3 leading-relaxed mb-6">
                                Мы решаем проблему долгого и неэффективного найма в IT. Если вы тратите часы на собеседования с кандидатами, которые не знают базу — мы для вас.
                            </p>
                            <button
                                onClick={handleCompanyClick}
                                className="h-[44px] px-6 rounded-lg bg-surface border border-line-2 text-ink text-[14px] font-medium hover:bg-surface-3 transition-colors"
                            >
                                Попробовать бесплатно
                            </button>
                        </div>
                        <div className="space-y-4">
                            {SEGMENTS.map((seg, i) => {
                                const Icon = seg.icon;
                                return (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                                        className="flex items-start gap-4 p-4 bg-surface border border-line rounded-xl"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0">
                                            <Icon size={18} className="text-accent" />
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-semibold text-ink mb-1">{seg.title}</div>
                                            <div className="text-[13px] text-ink-3 leading-relaxed">{seg.desc}</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
