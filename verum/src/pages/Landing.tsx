import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, FileText, Search,
    CheckCircle2, Brain, Eye, XCircle, Check, Database,
    Clock, TrendingUp, Wallet, Users, Code2, Server, Smartphone,
    Cloud, Gamepad2, BarChart3, Star, Quote, Zap, Lock
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

/* ===== DATA ===== */
const TRUSTED_BY = ["Яндекс", "Сбер", "Тинькофф", "Ozon", "Wildberries", "VK"];

const CATEGORIES = [
    { icon: Code2, title: "Frontend", count: "2 400+ кандидатов", desc: "React, Vue, Angular, TypeScript" },
    { icon: Server, title: "Backend", count: "3 100+ кандидатов", desc: "Python, Go, Java, Node.js" },
    { icon: Smartphone, title: "Mobile", count: "900+ кандидатов", desc: "iOS, Android, Flutter, RN" },
    { icon: Cloud, title: "DevOps / SRE", count: "600+ кандидатов", desc: "Kubernetes, Docker, CI/CD" },
    { icon: BarChart3, title: "Data / ML", count: "700+ кандидатов", desc: "Python, PyTorch, SQL, Airflow" },
    { icon: Gamepad2, title: "GameDev", count: "300+ кандидатов", desc: "Unity, Unreal, Godot" },
];

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается", icon: XCircle },
    { value: "3 дня", label: "До готового шортлиста", icon: Clock },
    { value: "80%", label: "Экономии времени HR", icon: TrendingUp },
    { value: "1.5 млн ₽", label: "Экономия в год", icon: Wallet },
];

const STEPS = [
    { num: "01", title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку зарплаты. Получите короткую ссылку для кандидатов.", icon: FileText },
    { num: "02", title: "Кандидат проходит ИИ-тест", desc: "12 вопросов, 5 этапов, запись экрана и камеры. Античит блокирует списывание.", icon: Search },
    { num: "03", title: "Модерация по тайм-кодам", desc: "Модератор видит только подозрительные секунды, а не всё видео целиком.", icon: Eye },
    { num: "04", title: "Получите чистый шортлист", desc: "Готовые профили с баллами, грейдом и подтверждёнными контактами.", icon: CheckCircle2 },
];

const WHY_US = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Проверяет архитектурное мышление и умение работать с ИИ-ассистентами." },
    { icon: ShieldCheck, title: "4 уровня античита", desc: "Камера, микрофон, детект потери фокуса, блокировка DevTools и копирования." },
    { icon: Database, title: "Матчинг по 7 осям", desc: "Стек, грейд, языки, зарплата, GitHub-статистика, балл теста, soft skills." },
    { icon: Lock, title: "Ручная модерация", desc: "Каждый профиль проверяется человеком перед тем, как попасть в базу." },
    { icon: Zap, title: "Результат за 3 дня", desc: "Вместо 2–3 недель скрининга — готовый шортлист к концу недели." },
    { icon: Users, title: "Только реальные инженеры", desc: "Вайбкодеры и накрученные резюме отсеиваются ещё на этапе теста." },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные 2–3 встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + ручная модерация"],
    ["Субъективное мнение", "100-балльная шкала по 5 осям"],
];

const REVIEWS = [
    { text: "Закрыли 3 senior-вакансии за неделю. Раньше на это уходило по месяцу и десятки собеседований.", name: "Анна К.", role: "Head of HR, финтех", rating: 5 },
    { text: "Кандидаты приходят уже с записью теста и баллами. Тимлиды перестали тратить время на скрининг.", name: "Дмитрий М.", role: "CTO, SaaS-стартап", rating: 5 },
    { text: "Античит реально работает — отсеяли несколько вайбкодеров, которые красиво говорили, но не писали код.", name: "Игорь С.", role: "Tech Lead, e-commerce", rating: 5 },
];

const FAQ = [
    { q: "Сколько стоит подключение?", a: "Первый тест и открытие контакта — бесплатно. Дальше — подписка от 30 000 ₽/мес в зависимости от объёма." },
    { q: "Что если кандидат не пройдёт тест?", a: "Вы не платите за него. Оплата списывается только при открытии контакта прошедшего кандидата." },
    { q: "Сколько идёт тест?", a: "Около 45–60 минут. 5 этапов, 12 вопросов, включая code review и разбор реальных продакшен-кейсов." },
    { q: "Можно ли использовать для hh.ru?", a: "Да. Вы создаёте вакансию, получаете короткую ссылку и вставляете её в описание на hh.ru." },
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

            {/* ===== HERO ===== */}
            <section className="relative pt-20 pb-16 md:pt-28 md:pb-24">
                <div className="max-w-[1400px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-line text-[13px] font-medium text-ink-2 font-heading">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                            Платформа проверенных IT-специалистов
                        </motion.div>

                        <motion.h1 variants={itemVariants} className="font-display font-bold text-[clamp(40px,5vw,68px)] leading-[1.05] text-ink mb-6">
                            Наймите инженера, который <span className="text-accent">реально</span> пишет код
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-[17px] md:text-[20px] text-ink-2 font-medium leading-relaxed mb-8 max-w-[600px]">
                            Скрининг через ИИ-интервью с античитом и записью видео. Отсеиваем 70% кандидатов и экономим до 1.5 млн ₽ в год на HR.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-10">
                            <button onClick={goCompany} className="group h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">
                                Проверить кандидатов <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button onClick={goDev} className="group h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} />
                            </button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-4 flex-wrap">
                            <div className="flex -space-x-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-accent/20 border-2 border-bg flex items-center justify-center text-[12px] font-bold text-accent">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center gap-1 mb-0.5">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber fill-amber" />)}
                                </div>
                                <div className="text-[13px] text-ink-3 font-medium">
                                    <span className="font-bold text-ink">500+ компаний</span> уже используют Верум
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Правая часть — превью карточки кандидата */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                        className="hidden lg:block relative"
                    >
                        <div className="bg-surface border-2 border-line rounded-2xl p-6 shadow-lg">
                            <div className="flex items-start justify-between mb-6 pb-4 border-b border-line">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                                        <Code2 size={22} className="text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-bold text-ink font-heading">Senior Frontend Engineer</div>
                                        <div className="text-[12px] text-ink-3 font-medium">React · TypeScript · 6 лет опыта</div>
                                    </div>
                                </div>
                                <div className="px-2.5 py-1 rounded-lg bg-accent text-white text-[11px] font-bold font-heading">SENIOR</div>
                            </div>

                            <div className="space-y-3 mb-6">
                                {[
                                    { label: "Архитектура", score: 92 },
                                    { label: "Понимание кода", score: 88 },
                                    { label: "Adaptability", score: 94 },
                                    { label: "Soft skills", score: 85 },
                                ].map((c, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-1.5">
                                            <span className="text-[12px] font-medium text-ink-2">{c.label}</span>
                                            <span className="text-[12px] font-bold text-ink">{c.score}/100</span>
                                        </div>
                                        <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${c.score}%` }}
                                                transition={{ duration: 1.2, delay: 0.6 + i * 0.15, ease: EASE }}
                                                className="h-full bg-accent rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-line">
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-accent" />
                                    <span className="text-[12px] font-semibold text-ink">Верифицирован</span>
                                </div>
                                <div className="text-[12px] text-ink-3 font-medium">Общий балл: <span className="font-bold text-ink">89</span></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== TRUSTED BY ===== */}
            <section className="border-y border-line bg-surface-2/40 py-6">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                        <div className="text-[12px] font-bold uppercase tracking-[0.15em] text-ink-3 font-heading whitespace-nowrap">Нам доверяют</div>
                        <div className="flex-1 flex items-center justify-center md:justify-between gap-6 md:gap-10 flex-wrap">
                            {TRUSTED_BY.map((name, i) => (
                                <div key={i} className="text-[18px] md:text-[20px] font-bold text-ink-4 font-display whitespace-nowrap">{name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CATEGORIES (Fiverr-style) ===== */}
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 md:mb-16 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Категории</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink mb-4">
                            База кандидатов по всем популярным стекам
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Только верифицированные инженеры с записью теста и подтверждённым грейдом.
                        </p>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {CATEGORIES.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6 hover:border-accent/40 transition-colors group cursor-pointer">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                            <Icon size={22} />
                                        </div>
                                        <ChevronRight size={18} className="text-ink-4 group-hover:text-accent transition-colors" />
                                    </div>
                                    <h3 className="font-heading text-[18px] font-bold text-ink mb-1">{cat.title}</h3>
                                    <p className="text-[13px] text-ink-3 font-medium mb-3">{cat.desc}</p>
                                    <div className="text-[12px] font-bold text-accent font-heading">{cat.count}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== METRICS ===== */}
            <section className="py-16 md:py-20 bg-surface-2/40 border-y border-line">
                <div className="max-w-[1400px] mx-auto px-6">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {METRICS.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                                        <Icon size={26} />
                                    </div>
                                    <div className="font-display text-[36px] md:text-[44px] font-bold text-ink leading-none mb-2">{m.value}</div>
                                    <div className="text-[13px] md:text-[14px] font-semibold text-ink-3">{m.label}</div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== STEPS ===== */}
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Как это работает</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink mb-4">
                            От вакансии до финалиста — 4 шага
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6 relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="font-mono text-[14px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-lg">{step.num}</span>
                                        <Icon size={22} className="text-ink-4" />
                                    </div>
                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2 leading-tight">{step.title}</h3>
                                    <p className="text-[13.5px] text-ink-3 leading-relaxed font-medium">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* ===== WHY US ===== */}
            <section className="py-20 md:py-28 bg-surface-2/40 border-y border-line">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 md:mb-16 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Почему мы</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink mb-4">
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

            {/* ===== COMPARISON ===== */}
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Сравнение</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink">
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

            {/* ===== REVIEWS ===== */}
            <section className="py-20 md:py-28 bg-surface-2/40 border-y border-line">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Отзывы</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink">
                            Что говорят компании
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        {REVIEWS.map((r, i) => (
                            <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6 relative">
                                <Quote size={32} className="text-accent/15 absolute top-4 right-4" />
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: r.rating }).map((_, j) => (
                                        <Star key={j} size={14} className="text-amber fill-amber" />
                                    ))}
                                </div>
                                <p className="text-[14.5px] text-ink-2 leading-relaxed font-medium mb-5">{r.text}</p>
                                <div className="pt-4 border-t border-line">
                                    <div className="text-[14px] font-bold text-ink font-heading">{r.name}</div>
                                    <div className="text-[12px] text-ink-3 font-medium">{r.role}</div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="text-center mb-12 md:mb-16">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">FAQ</div>
                        <h2 className="font-display text-[clamp(32px,4vw,48px)] font-bold leading-tight text-ink">
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

            {/* ===== FINAL CTA ===== */}
            <section className="py-20 md:py-28 bg-surface-2/40 border-t border-line">
                <div className="max-w-[900px] mx-auto px-6 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={containerVariants}>
                        <motion.h2 variants={itemVariants} className="font-display text-[clamp(36px,5vw,60px)] font-bold leading-[1.1] text-ink mb-6">
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
