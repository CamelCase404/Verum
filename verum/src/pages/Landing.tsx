import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    FileText,
    Search,
    CheckCircle2,
    Brain,
    Eye,
    XCircle,
    Check,
    Database
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
    }),
};

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается" },
    { value: "3 дня", label: "До готового шортлиста" },
    { value: "80%", label: "Экономии времени" },
    { value: "100", label: "Баллов в оценке" },
];

const STEPS = [
    { num: "01", title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку. Получите ссылку для кандидатов.", icon: FileText },
    { num: "02", title: "ИИ-интервью", desc: "12 вопросов с записью экрана, камерой и античитом.", icon: Search },
    { num: "03", title: "Ручная модерация", desc: "Модератор проверяет видео по тайм-кодам аномалий.", icon: Eye },
    { num: "04", title: "Чистый шортлист", desc: "Готовые профили с баллами и подтверждённым грейдом.", icon: CheckCircle2 },
];

const FEATURES = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Проверяет архитектурное мышление и работу с ИИ-кодом.", colSpan: "md:col-span-2" },
    { icon: ShieldCheck, title: "Античит", desc: "Камера, микрофон, блокировка DevTools.", colSpan: "md:col-span-1" },
    { icon: Database, title: "Матчинг по 7 осям", desc: "Стек, грейд, языки, зарплата, GitHub, балл теста.", colSpan: "md:col-span-1" },
    { icon: Eye, title: "Модерация по тайм-кодам", desc: "Модератор видит только подозрительные секунды.", colSpan: "md:col-span-2" },
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
        <div className="w-full bg-bg overflow-hidden text-ink selection:bg-accent/30">
            {/* 1. HERO */}
            <section className="relative pt-16 pb-16 md:pt-24 md:pb-24">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], opacity: [0.02, 0.06, 0.02] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent rounded-full blur-[150px] pointer-events-none -z-10"
                />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                        className="font-semibold tracking-[-0.04em] leading-[1.1] text-[clamp(36px,5vw,64px)] text-ink mb-6 text-balance max-w-[1000px] mx-auto"
                    >
                        Нанимайте тех, <br className="hidden sm:block" />
                        кто <span className="text-accent">реально</span> пишет код
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="text-[16px] md:text-[20px] text-ink-2 leading-[1.6] max-w-[700px] mx-auto mb-10"
                    >
                        Автоматический скрининг инженеров через ИИ-интервью с античитом. Проверяем хард-скиллы и отдаём только тех, кто умеет думать.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button onClick={goCompany} className="group h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 w-full sm:w-auto">
                            Проверить кандидатов <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <button onClick={goDev} className="group h-[52px] px-8 rounded-xl bg-surface border border-line text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                            Я разработчик <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* 2. METRICS (Без фона, только разделители) */}
            <section className="py-12 border-y border-line/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x-0 lg:divide-x divide-line/50 text-center">
                        {METRICS.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }} className="flex flex-col items-center justify-center">
                                <div className="text-[32px] md:text-[40px] font-bold text-ink leading-none tracking-[-0.03em] mb-2">{m.value}</div>
                                <div className="text-[13px] md:text-[15px] text-ink-3 font-medium">{m.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. FEATURES (Bento Grid) */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
                        <motion.div variants={fadeUp} custom={0} className="text-[12px] font-bold uppercase tracking-[0.15em] text-accent mb-3">Технология</motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink text-balance">Четыре уровня защиты от нечестного найма</motion.h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} whileHover={{ y: -2 }} className={`bg-surface border border-line rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-line-2 hover:shadow-lg ${f.colSpan}`}>
                                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-accent mb-6">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-[18px] md:text-[20px] font-semibold text-ink mb-2">{f.title}</h3>
                                    <p className="text-[14px] md:text-[16px] text-ink-3 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. STEPS (Сетка без фона) */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink text-balance">От вакансии до финалиста за 3 дня</motion.h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-surface border border-line rounded-2xl p-6 relative group hover:border-line-2 transition-colors">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[14px] font-bold text-accent tabular-nums bg-accent/10 px-2.5 py-1 rounded-md">{step.num}</span>
                                        <Icon size={22} className="text-ink-4" />
                                    </div>
                                    <h3 className="text-[17px] font-semibold text-ink mb-2 leading-tight">{step.title}</h3>
                                    <p className="text-[14px] text-ink-3 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. COMPARISON (Ультра-широкая, без фона) */}
            <section className="py-20 md:py-28">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink text-balance">Верум vs Обычный найм</motion.h2>
                    </motion.div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-[1200px] mx-auto">
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-surface/50 border border-line rounded-2xl p-6 md:p-8 opacity-90">
                            <h3 className="text-[18px] font-semibold text-ink-3 mb-6 pb-4 border-b border-line">Обычный найм</h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <XCircle size={14} className="text-ink-4" />
                                        </div>
                                        <span className="text-[15px] text-ink-3">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="bg-surface border-2 border-accent rounded-2xl p-6 md:p-8 shadow-xl shadow-accent/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                            <h3 className="text-[18px] font-semibold text-accent mb-6 pb-4 border-b border-line flex items-center gap-2">
                                <ShieldCheck size={20} /> С Верум
                            </h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={14} className="text-accent" />
                                        </div>
                                        <span className="text-[15px] text-ink font-medium">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 6. FINAL CTA (Единый фон) */}
            <section className="py-20 md:py-32 relative">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(32px,5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.1] text-ink mb-6 text-balance">
                            Перестаньте тратить часы на собеседования
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={1} className="text-[16px] md:text-[18px] text-ink-2 leading-relaxed mb-10 max-w-[600px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={goCompany} className="group h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-accent/30 flex items-center justify-center gap-2">
                                Подключить компанию <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <button onClick={goDev} className="group h-[52px] px-8 rounded-xl bg-surface border border-line text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
