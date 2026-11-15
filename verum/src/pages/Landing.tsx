import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, FileText, Search,
    CheckCircle2, Brain, Eye, XCircle, Check, Database,
    Clock, TrendingUp, Wallet, Users, Code2, Server, Smartphone,
    Cloud, Gamepad2, BarChart3, Lock, Zap
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

/* ===== Animated Divider ===== */
function AnimatedDivider() {
    return (
        <div className="relative w-full py-14 md:py-20">
            <div className="max-w-[1400px] mx-auto px-6">
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 1.4, ease: EASE }}
                    className="relative h-[2px] origin-center rounded-full overflow-hidden bg-gradient-to-r from-transparent via-line-2 to-transparent"
                >
                    <motion.div
                        animate={{ left: ["-40%", "140%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.5 }}
                        className="absolute top-0 h-full w-[40%] bg-gradient-to-r from-transparent via-accent/70 to-transparent"
                    />
                </motion.div>
            </div>
        </div>
    );
}

/* ===== DATA ===== */
const CATEGORIES = [
    { icon: Code2, title: "Frontend", count: "2 400+", desc: "React, Vue, Angular, TS" },
    { icon: Server, title: "Backend", count: "3 100+", desc: "Python, Go, Java, Node.js" },
    { icon: Smartphone, title: "Mobile", count: "900+", desc: "iOS, Android, Flutter" },
    { icon: Cloud, title: "DevOps / SRE", count: "600+", desc: "Kubernetes, Docker, CI/CD" },
    { icon: BarChart3, title: "Data / ML", count: "700+", desc: "Python, PyTorch, SQL" },
    { icon: Gamepad2, title: "GameDev", count: "300+", desc: "Unity, Unreal, Godot" },
];

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается", icon: XCircle },
    { value: "3 дня", label: "До шортлиста", icon: Clock },
    { value: "80%", label: "Экономии времени", icon: TrendingUp },
    { value: "1.5 млн ₽", label: "Экономия в год", icon: Wallet },
];

const STEPS = [
    { num: "01", title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку. Получите ссылку.", icon: FileText, color: "var(--accent)" },
    { num: "02", title: "ИИ-тест кандидата", desc: "12 вопросов с записью экрана и античитом.", icon: Search, color: "var(--blue)" },
    { num: "03", title: "Ручная модерация", desc: "Проверка видео по тайм-кодам аномалий.", icon: Eye, color: "var(--violet)" },
    { num: "04", title: "Чистый шортлист", desc: "Готовые профили с баллами и контактами.", icon: CheckCircle2, color: "var(--amber)" },
];

const WHY_US = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Оценивает архитектурное мышление и работу с кодом." },
    { icon: ShieldCheck, title: "4 уровня античита", desc: "Камера, микрофон, фокус, блокировка DevTools." },
    { icon: Database, title: "Матчинг по 7 осям", desc: "Стек, грейд, зарплата, GitHub, soft skills." },
    { icon: Lock, title: "Ручная модерация", desc: "Каждый профиль проверяется человеком." },
    { icon: Zap, title: "Результат за 3 дня", desc: "Вместо 2–3 недель скрининга." },
    { icon: Users, title: "Реальные инженеры", desc: "Вайбкодеры отсеиваются на этапе теста." },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + модерация"],
    ["Субъективное мнение", "100-балльная шкала"],
];

const FAQ = [
    { q: "Сколько стоит подключение?", a: "Первый тест и открытие контакта — бесплатно. Дальше — подписка от 30 000 ₽/мес." },
    { q: "Что если кандидат не пройдёт тест?", a: "Вы не платите за него. Оплата списывается только при открытии контакта." },
    { q: "Сколько идёт тест?", a: "Около 45–60 минут. 5 этапов, 12 вопросов, code review и продакшен-кейсы." },
    { q: "Можно ли использовать для hh.ru?", a: "Да. Создаёте вакансию, получаете ссылку и вставляете в описание." },
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
        <div className="w-full bg-bg overflow-hidden text-ink font-sans">

            {/* ===== HERO (Чистый, с фоновой сеткой) ===== */}
            <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
                <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />
                <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center items-center">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.04, 0.08, 0.04] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[800px] h-[800px] bg-accent rounded-full blur-[120px]"
                    />
                </div>

                <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center">
                        <motion.h1 variants={itemVariants} className="font-heading font-extrabold text-[clamp(40px,6vw,76px)] leading-[1.1] tracking-tight text-ink mb-6 max-w-[900px]">
                            Наймите инженера, который <span className="text-accent">реально</span> пишет код
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-[17px] md:text-[21px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[680px]">
                            Скрининг через ИИ-интервью с античитом и записью видео. Отсеиваем 70% кандидатов и экономим до 1.5 млн ₽ в год.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                            <button onClick={goCompany} className="group h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">
                                Проверить кандидатов <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button onClick={goDev} className="group h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== CATEGORIES ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Категории</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            База кандидатов по всем стекам
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {CATEGORIES.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6 transition-colors">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-heading text-[18px] font-bold text-ink mb-1">{cat.title}</h3>
                                    <p className="text-[13px] text-ink-3 font-medium mb-3">{cat.desc}</p>
                                    <div className="text-[12px] font-bold text-accent font-heading">{cat.count} кандидатов</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== METRICS ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {METRICS.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                                        <Icon size={26} />
                                    </div>
                                    <div className="font-heading text-[36px] md:text-[44px] font-extrabold text-ink leading-none mb-2">{m.value}</div>
                                    <div className="text-[13px] md:text-[14px] font-semibold text-ink-3">{m.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== STEPS (видимая анимированная дорожка) ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Как это работает</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            От вакансии до финалиста — 4 шага
                        </h2>
                    </div>

                    <div className="relative">
                        {/* Дорожка: линия от центра 1-й иконки до центра 4-й */}
                        <div className="hidden md:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[2px] rounded-full overflow-hidden z-0">
                            <div className="absolute inset-0 bg-line-2/60" />
                            <motion.div
                                animate={{ left: ["-30%", "130%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
                                className="absolute top-0 h-full w-[30%] bg-gradient-to-r from-transparent via-accent to-transparent"
                            />
                        </div>

                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                            {STEPS.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div key={i} variants={itemVariants} className="relative flex flex-col items-center text-center">
                                        <div className="relative mb-6">
                                            <div className="w-20 h-20 rounded-full bg-bg border-4 border-line flex items-center justify-center relative z-10 shadow-sm">
                                                <Icon size={30} style={{ color: step.color }} />
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[12px] font-bold shadow-md z-20">
                                                {step.num}
                                            </div>
                                        </div>

                                        <h3 className="font-heading text-[17px] md:text-[18px] font-bold text-ink mb-2 max-w-[200px]">
                                            {step.title}
                                        </h3>
                                        <p className="text-[13.5px] text-ink-3 leading-relaxed font-medium max-w-[220px]">
                                            {step.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== WHY US ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Почему мы</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            Технология, которая заменяет 20 часов рутинных собеседований
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {WHY_US.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">{f.title}</h3>
                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== COMPARISON ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Сравнение</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink">
                            Верум vs Обычный найм
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
                            <h3 className="font-heading text-[18px] font-bold text-ink-3 mb-6 pb-4 border-b border-line">Обычный найм</h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <XCircle size={14} className="text-ink-4" />
                                        </div>
                                        <span className="text-[15px] text-ink-3 font-medium leading-relaxed">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-surface border-2 border-accent rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                            <h3 className="font-heading text-[18px] font-bold text-accent mb-6 pb-4 border-b border-line flex items-center gap-2">
                                <ShieldCheck size={20} /> С Верум
                            </h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={14} className="text-accent" />
                                        </div>
                                        <span className="text-[15px] text-ink font-semibold leading-relaxed">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== FAQ ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">FAQ</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink">
                            Частые вопросы
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="space-y-3">
                        {FAQ.map((f, i) => (
                            <motion.details key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-5 group">
                                <summary className="flex items-center justify-between cursor-pointer list-none">
                                    <span className="text-[16px] font-bold text-ink font-heading pr-4">{f.q}</span>
                                    <ChevronRight size={18} className="text-ink-4 transition-transform group-open:rotate-90 shrink-0" />
                                </summary>
                                <p className="text-[14.5px] text-ink-3 leading-relaxed font-medium mt-3 pt-3 border-t border-line">{f.a}</p>
                            </motion.details>
                        ))}
                    </motion.div>
                </div>
            </section>

            <AnimatedDivider />

            {/* ===== FINAL CTA ===== */}
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[900px] mx-auto px-6 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="font-heading text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.1] text-ink mb-6">
                            Перестаньте тратить часы на собеседования
                        </motion.h2>
                        <motion.p variants={itemVariants} className="text-[17px] md:text-[20px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[600px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button onClick={goCompany} className="group h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">
                                Подключить компанию <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button onClick={goDev} className="group h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
