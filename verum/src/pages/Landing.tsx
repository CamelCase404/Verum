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

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
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
        <div className="w-full bg-bg overflow-hidden text-ink selection:bg-accent/30 font-sans">
            <section className="relative pt-16 pb-20 md:pt-24 md:pb-28">
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.03, 0.06, 0.03] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-accent rounded-full blur-[120px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.02, 0.05, 0.02] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent-2 rounded-full blur-[100px]"
                    />
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center">
                        <motion.h1
                            variants={itemVariants}
                            className="font-bold tracking-tight leading-[1.15] text-[clamp(36px,5vw,64px)] text-ink mb-6 text-balance max-w-[1000px]"
                        >
                            Нанимайте тех, <br className="hidden sm:block" />
                            кто <span className="text-accent relative inline-block">
                                реально
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1, duration: 0.8, ease: EASE }}
                                    className="absolute bottom-1 left-0 w-full h-2 bg-accent/20 -z-10 origin-left"
                                />
                            </span> пишет код
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-[16px] md:text-[20px] text-ink-2 font-medium leading-relaxed max-w-[700px] mx-auto mb-10"
                        >
                            Автоматический скрининг инженеров через ИИ-интервью с античитом. Проверяем хард-скиллы и отдаём только тех, кто умеет думать.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                            <button
                                onClick={goCompany}
                                className="group h-[56px] px-8 rounded-2xl bg-accent text-white font-semibold text-[15px] hover:bg-accent-2 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Проверить кандидатов <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                onClick={goDev}
                                className="group h-[56px] px-8 rounded-2xl bg-surface border border-line text-ink font-semibold text-[15px] hover:bg-surface-2 hover:border-line-2 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Я разработчик <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <section className="border-y border-line/50 bg-bg py-10">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: EASE }}
                                className="flex flex-col items-center justify-center"
                            >
                                <div className="text-[36px] md:text-[48px] font-extrabold text-ink leading-none tracking-tighter mb-2">{m.value}</div>
                                <div className="text-[13px] md:text-[15px] text-ink-3 font-medium uppercase tracking-wider">{m.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-12 md:mb-16 text-center">
                        <motion.div variants={itemVariants} className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3">Технология</motion.div>
                        <motion.h2 variants={itemVariants} className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight leading-tight text-ink text-balance max-w-[800px] mx-auto">
                            Четыре уровня защиты от нечестного найма
                        </motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, scale: 1.01 }}
                                    className={`bg-surface border border-line/80 rounded-3xl p-8 transition-all duration-300 hover:border-accent/40 hover:shadow-xl group ${f.colSpan}`}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-[18px] md:text-[20px] font-bold text-ink mb-3">{f.title}</h3>
                                    <p className="text-[15px] text-ink-3 leading-relaxed font-medium">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 md:py-28 bg-bg border-t border-line/50">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={itemVariants} className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight leading-tight text-ink text-balance">
                            От вакансии до финалиста за 3 дня
                        </motion.h2>
                    </motion.div>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line/80 rounded-3xl p-8 relative group hover:border-line-2 transition-colors duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-[14px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">{step.num}</span>
                                        <Icon size={24} className="text-ink-4 group-hover:text-accent transition-colors" />
                                    </div>
                                    <h3 className="text-[18px] font-bold text-ink mb-3 leading-tight">{step.title}</h3>
                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <section className="py-20 md:py-28 bg-bg border-t border-line/50">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={itemVariants} className="text-[clamp(28px,4vw,44px)] font-bold tracking-tight leading-tight text-ink text-balance">
                            Верум vs Обычный найм
                        </motion.h2>
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="bg-surface border border-line/80 rounded-3xl p-8 md:p-10 opacity-90"
                        >
                            <h3 className="text-[18px] font-bold text-ink-3 mb-6 pb-4 border-b border-line/50">Обычный найм</h3>
                            <ul className="space-y-5">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <XCircle size={14} className="text-ink-4" />
                                        </div>
                                        <span className="text-[15px] text-ink-3 font-medium leading-relaxed">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                            className="bg-surface border-2 border-accent rounded-3xl p-8 md:p-10 shadow-lg shadow-accent/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-bl-full pointer-events-none" />
                            <h3 className="text-[18px] font-bold text-accent mb-6 pb-4 border-b border-accent/20 flex items-center gap-2">
                                <ShieldCheck size={20} /> С Верум
                            </h3>
                            <ul className="space-y-5">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={14} className="text-accent" />
                                        </div>
                                        <span className="text-[15px] text-ink font-semibold leading-relaxed">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 md:py-32 relative overflow-hidden border-t border-line/50">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <div className="max-w-[1000px] mx-auto px-4 sm:px-6 text-center relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="text-[clamp(32px,5vw,56px)] font-bold tracking-tight leading-[1.1] text-ink mb-6 text-balance">
                            Перестаньте тратить часы на собеседования
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-[16px] md:text-[18px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[600px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={goCompany} className="group h-[56px] px-8 rounded-2xl bg-accent text-white font-semibold text-[15px] hover:bg-accent-2 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-accent/30 flex items-center justify-center gap-2">
                                Подключить компанию <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button onClick={goDev} className="group h-[56px] px-8 rounded-2xl bg-surface border border-line text-ink font-semibold text-[15px] hover:bg-surface-2 transition-colors duration-300 flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
