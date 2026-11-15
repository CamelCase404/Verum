import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, FileText, Search,
    CheckCircle2, Brain, Eye, XCircle, Check, Database,
    Clock, TrendingUp, Wallet, Users, Zap
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } }
};

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается", icon: XCircle },
    { value: "3 дня", label: "До готового шортлиста", icon: Clock },
    { value: "80%", label: "Экономии времени", icon: TrendingUp },
    { value: "1.5 млн ₽", label: "Экономия на HR в год", icon: Wallet },
];

const WHY_US = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Проверяет архитектурное мышление и работу с ИИ-кодом." },
    { icon: ShieldCheck, title: "Античит", desc: "Камера, микрофон, блокировка DevTools." },
    { icon: Database, title: "Матчинг по 7 осям", desc: "Стек, грейд, языки, зарплата, GitHub, балл теста." },
    { icon: Eye, title: "Модерация по тайм-кодам", desc: "Модератор видит только подозрительные секунды." },
];

const STEPS = [
    { num: "01", title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку. Получите ссылку для кандидатов.", icon: FileText },
    { num: "02", title: "ИИ-интервью", desc: "12 вопросов с записью экрана, камерой и античитом.", icon: Search },
    { num: "03", title: "Ручная модерация", desc: "Модератор проверяет видео по тайм-кодам аномалий.", icon: Eye },
    { num: "04", title: "Чистый шортлист", desc: "Готовые профили с баллами и подтверждённым грейдом.", icon: CheckCircle2 },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные 2–3 встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + ручная модерация"],
    ["Субъективное мнение", "100-балльная шкала по 5 осям"],
];

export function Landing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    
    // Параллакс эффект для hero-секции
    const { scrollY } = useScroll();
    const heroY = useTransform(scrollY, [0, 500], [0, 100]);
    const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

    const goCompany = () => {
        if (!user) navigate("/register?role=company");
        else if (user.role === "company") navigate("/dashboard");
        else toast("Для найма нужен аккаунт компании");
    };

    const goDev = () => {
        if (!user) navigate("/register?role=developer");
        else if (user.role === "developer") navigate("/dashboard");
        else toast("Для теста нужен аккаунт разработчика");
    };

    return (
        <div className="w-full bg-bg overflow-hidden text-ink selection:bg-accent/30 font-sans">
            
            {/* 1. HERO (Огромный шрифт, параллакс) */}
            <section className="relative pt-24 pb-32 md:pt-40 md:pb-48 flex flex-col items-center justify-center min-h-[90vh]">
                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-center">
                    <div className="w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] mix-blend-normal" />
                </motion.div>

                <div className="max-w-[1400px] mx-auto px-6 text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center">
                        <motion.div variants={itemVariants} className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface ring-1 ring-line/50 text-ink-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            Платформа проверенных IT-специалистов
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="font-display font-bold text-[clamp(48px,7vw,96px)] leading-[1.05] text-ink mb-8 max-w-[1100px]">
                            Нанимайте тех, кто <span className="text-accent italic">реально</span> пишет код
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-[18px] md:text-[24px] text-ink-2 font-medium leading-relaxed max-w-[800px] mb-12">
                            Автоматический скрининг инженеров через ИИ-интервью с античитом. Отсеиваем 70% кандидатов и экономим до 1.5 млн ₽ в год на HR.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button onClick={goCompany} className="group h-[64px] px-10 rounded-2xl bg-accent text-white font-heading font-bold text-[16px] hover:bg-accent-2 transition-all duration-300 hover:-translate-y-1 shadow-[0_15px_40px_-10px_rgba(var(--accent-rgb),0.6)] flex items-center justify-center gap-3">
                                Проверить кандидатов <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button onClick={goDev} className="group h-[64px] px-10 rounded-2xl bg-surface text-ink ring-1 ring-line hover:ring-line-2 font-heading font-bold text-[16px] transition-all duration-300 flex items-center justify-center gap-3 hover:bg-surface-2">
                                Я разработчик <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. METRICS / MONEY (Стеклянные карточки с деньгами) */}
            <section className="relative z-20 -mt-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {METRICS.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 ring-1 ring-line/50 shadow-2xl shadow-black/5 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                        <Icon size={24} className="text-accent" />
                                    </div>
                                    <div className="font-display text-[32px] md:text-[42px] font-bold text-ink leading-none mb-2">{m.value}</div>
                                    <div className="text-[13px] md:text-[15px] font-medium text-ink-3">{m.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* 3. WHY US (Bento Grid, без разделителей) */}
            <section className="py-24 md:py-40 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <motion.div variants={itemVariants} className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-4">Почему мы</motion.div>
                            <motion.h2 variants={itemVariants} className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-tight text-ink">
                                Технология, которая заменяет 20 часов рутинных собеседований
                            </motion.h2>
                        </div>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {WHY_US.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} whileHover={{ scale: 1.02 }} className="bg-surface rounded-[32px] p-10 md:p-12 ring-1 ring-line/50 hover:ring-accent/30 transition-all duration-500 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-full pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                                    <div className="w-16 h-16 rounded-2xl bg-surface-2 ring-1 ring-line flex items-center justify-center text-accent mb-8 group-hover:rotate-6 transition-transform duration-300">
                                        <Icon size={32} />
                                    </div>
                                    <h3 className="font-heading text-[24px] md:text-[28px] font-bold text-ink mb-4">{f.title}</h3>
                                    <p className="text-[16px] md:text-[18px] text-ink-3 leading-relaxed font-medium">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* 4. STEPS (Как это работает) */}
            <section className="py-24 md:py-40 bg-surface-2/30">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-16 md:mb-24 text-center">
                        <motion.h2 variants={itemVariants} className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-tight text-ink max-w-3xl mx-auto">
                            От вакансии до финалиста за 3 дня
                        </motion.h2>
                    </motion.div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface rounded-[32px] p-8 ring-1 ring-line/50 relative group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="font-mono text-[16px] font-bold text-accent bg-accent/10 px-4 py-2 rounded-xl">{step.num}</span>
                                        <Icon size={28} className="text-ink-4 group-hover:text-accent transition-colors duration-300" />
                                    </div>
                                    <h3 className="font-heading text-[20px] font-bold text-ink mb-3 leading-tight">{step.title}</h3>
                                    <p className="text-[15px] text-ink-3 leading-relaxed font-medium">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* 5. COMPARISON */}
            <section className="py-24 md:py-40 bg-bg">
                <div className="max-w-[1200px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-16 md:mb-24 text-center">
                        <motion.h2 variants={itemVariants} className="font-display text-[clamp(36px,5vw,64px)] font-bold leading-tight text-ink">
                            Верум vs Обычный найм
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="bg-surface rounded-[40px] p-10 md:p-14 ring-1 ring-line/50">
                            <h3 className="font-heading text-[24px] font-bold text-ink-3 mb-8 pb-6 border-b border-line/50">Обычный найм</h3>
                            <ul className="space-y-6">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0">
                                            <XCircle size={18} className="text-ink-4" />
                                        </div>
                                        <span className="text-[18px] text-ink-3 font-medium leading-relaxed pt-1">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }} className="bg-surface rounded-[40px] p-10 md:p-14 ring-2 ring-accent shadow-2xl shadow-accent/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-bl-full pointer-events-none" />
                            <h3 className="font-heading text-[24px] font-bold text-accent mb-8 pb-6 border-b border-accent/20 flex items-center gap-3">
                                <ShieldCheck size={28} /> С Верум
                            </h3>
                            <ul className="space-y-6">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                                            <Check size={18} className="text-accent" />
                                        </div>
                                        <span className="text-[18px] text-ink font-bold leading-relaxed pt-1">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. FINAL CTA */}
            <section className="py-32 md:py-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/10 pointer-events-none" />
                <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="font-display text-[clamp(40px,6vw,80px)] font-bold leading-[1.1] text-ink mb-8">
                            Перестаньте тратить часы на собеседования
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-[18px] md:text-[24px] text-ink-2 font-medium leading-relaxed mb-12 max-w-[700px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={goCompany} className="group h-[64px] px-10 rounded-2xl bg-accent text-white font-heading font-bold text-[18px] hover:bg-accent-2 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-accent/30 flex items-center justify-center gap-3">
                                Подключить компанию <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
