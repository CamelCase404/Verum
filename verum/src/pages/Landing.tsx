import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {ArrowRight, ChevronRight, ShieldCheck, FileText, Search,
    CheckCircle2, Brain, Eye, XCircle, Check, Database,
    Clock, TrendingUp, Wallet, Users, Code2, Server, Smartphone,
    Cloud, Gamepad2, BarChart3, Lock, Zap, Gauge, Target, Sparkles,
    MessageSquare, Lightbulb, Star, Code, Layers, Terminal, Route, GitMerge, CircleDollarSign, Scale, Rocket, ExternalLink, UserPlus, Coins } from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
};

/* ===== Красивый статичный разделитель ===== */
function SectionDivider({ icon: Icon }: { icon: any }) {
    return (
        <div className="relative py-14 md:py-20 flex items-center justify-center">
            <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center gap-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-line-2/70 to-line-2" />
                <div className="relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-accent/10 blur-[10px]" />
                    <div className="relative w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-accent shadow-sm">
                        <Icon size={20} />
                    </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-line-2/70 to-line-2" />
            </div>
        </div>
    );
}

/* ===== DATA ===== */
const CATEGORIES = [
    { icon: Code2, title: "Frontend", desc: "React, Vue, Angular, TS" },
    { icon: Server, title: "Backend", desc: "Python, Go, Java, Node.js" },
    { icon: Smartphone, title: "Mobile", desc: "iOS, Android, Flutter" },
    { icon: Cloud, title: "DevOps / SRE", desc: "Kubernetes, Docker, CI/CD" },
    { icon: BarChart3, title: "Data / ML", desc: "Python, PyTorch, SQL" },
    { icon: Gamepad2, title: "GameDev", desc: "Unity, Unreal, Godot" },
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

const COMPETENCIES = [
    { icon: Layers, title: "Архитектурное мышление", score: 35, desc: "Умение проектировать системы, выбирать паттерны и обосновывать trade-offs." },
    { icon: Code, title: "Понимание кода", score: 30, desc: "Чтение и рефакторинг чужого кода, поиск багов и узких мест." },
    { icon: Sparkles, title: "Работа с ИИ", score: 15, desc: "Умение формулировать промпты и использовать ИИ-ассистентов в работе." },
    { icon: Target, title: "Adaptability", score: 10, desc: "Скорость адаптации к новым задачам и продакшен-инцидентам." },
    { icon: MessageSquare, title: "Soft skills", score: 10, desc: "Ясность изложения, умение объяснять сложное простыми словами." },
];

const MATCHING = [
    { icon: Code2, title: "Стек", desc: "Полное совпадение или пересечение по ключевым технологиям." },
    { icon: Gauge, title: "Грейд", desc: "Точное попадание или разница в одну ступень (Junior → Middle)." },
    { icon: Terminal, title: "Языки", desc: "Пересечение языков кандидата и требований вакансии." },
    { icon: Wallet, title: "Зарплата", desc: "Ожидания кандидата вписываются в вилку вакансии." },
    { icon: Star, title: "GitHub", desc: "Активность, звёзды репозиториев и реальный код на GitHub." },
    { icon: TrendingUp, title: "Балл теста", desc: "Итоговый балл 0–100 по результатам ИИ-интервью." },
    { icon: Users, title: "Soft skills", desc: "Оценка коммуникабельности и умения работать в команде." },
];

const PRICING = [
    {
        name: "Start",
        price: "30 000 ₽",
        period: "/мес",
        desc: "Для небольших команд и стартапов.",
        features: ["20 тестов в месяц", "3 000 токенов для доступа к базе", "Базовый античит-контроль", "Доступ к базе верифицированных"],
        featured: false,
    },
    {
        name: "Pro",
        price: "75 000 ₽",
        period: "/мес",
        desc: "Для растущих компаний с активным наймом.",
        features: ["60 тестов в месяц", "10 000 токенов", "Приоритетная поддержка", "Расширенная аналитика"],
        featured: true,
    },
    {
        name: "Enterprise",
        price: "200 000 ₽",
        period: "/мес",
        desc: "Для крупных компаний с большим потоком.",
        features: ["Безлимитные тесты", "Безлимит токенов", "Выделенный менеджер", "SLA и кастомные интеграции"],
        featured: false,
    },
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
    { q: "Сколько стоит подключение?", a: "Первый тест и открытие контакта — бесплатно. Дальше — подписка от 30 000 ₽/мес в зависимости от объёма." },
    { q: "Что если кандидат не пройдёт тест?", a: "Вы не платите за него. Оплата списывается только при открытии контакта прошедшего кандидата." },
    { q: "Сколько идёт тест?", a: "Около 45–60 минут. 5 этапов, 12 вопросов, включая code review и разбор реальных продакшен-кейсов." },
    { q: "Есть ли гарантия возврата?", a: "Да. Если кандидат отклонён на модерации — кредит возвращается. Списываем токены только за одобренных кандидатов." },
    { q: "Можно ли проходить тест несколько раз?", a: "Да, но с интервалом 180 дней для обычных тестов. Для тестов под конкретную вакансию — без ограничений." },
    { q: "Что видит компания в профиле?", a: "Балл, грейд, видео собеседования, разбивку по компетенциям и подтверждённые контакты после оплаты." },
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

            <SectionDivider icon={Route} />

{/* ===== STEPS (статичная дорожка) ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Как это работает</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            От вакансии до финалиста — 4 шага
                        </h2>
                    </div>

                    <div className="relative">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8 relative">
                            {STEPS.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div key={i} variants={itemVariants} className="relative flex flex-col items-center text-center">
                                        <div className="relative mb-6">
                                            {/* Маркер на дорожке */}
                                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-accent/5" />
                                            <div className="w-20 h-20 rounded-full bg-surface border-2 border-line flex items-center justify-center relative z-10 shadow-sm">
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

                                        {/* Соединительная линия со стрелкой между шагами */}
                                        {i < STEPS.length - 1 && (
                                            <div className="hidden md:flex absolute top-[32px] -right-[40px] w-24 items-center z-0">
                                                <div className="flex-1 h-[2px] bg-accent/60" />
                                                <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-accent ml-[-2px]" />
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </div>
            </section>

<SectionDivider icon={Code2} />

{/* ===== CATEGORIES (без счётчика) ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Категории</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            База кандидатов по всем стекам
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Только верифицированные инженеры с записью теста и подтверждённым грейдом.
                        </p>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {CATEGORIES.map((cat, i) => {
                            const Icon = cat.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-heading text-[18px] font-bold text-ink mb-1">{cat.title}</h3>
                                    <p className="text-[14px] text-ink-3 font-medium">{cat.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

<SectionDivider icon={TrendingUp} />

{/* ===== METRICS ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Цифры</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            Результаты, которые видно в деньгах и времени
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Средние показатели по компаниям, которые уже используют Верум для найма инженеров.
                        </p>
                    </div>

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

<SectionDivider icon={Target} />

{/* ===== ЧТО ОЦЕНИВАЕТСЯ ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Что оценивается</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            5 компетенций в 100-балльной шкале
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            ИИ-судья оценивает каждую компетенцию отдельно и выдаёт итоговый балл.
                        </p>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                        {COMPETENCIES.map((c, i) => {
                            const Icon = c.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-6">
                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">{c.title}</h3>
                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">{c.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <SectionDivider icon={GitMerge} />

            {/* ===== КАК ПОДБИРАЕТСЯ ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="mb-12 max-w-2xl">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Как подбирается</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            Матчинг по 7 осям
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Алгоритм сравнивает кандидата с вакансией сразу по 7 параметрам, а не только по стеку.
                        </p>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {MATCHING.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-xl p-5">
                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3">
                                        <Icon size={20} />
                                    </div>
                                    <h3 className="font-heading text-[15px] font-bold text-ink mb-2">{m.title}</h3>
                                    <p className="text-[13px] text-ink-3 leading-relaxed font-medium">{m.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            <SectionDivider icon={CircleDollarSign} />

            {/* ===== ТАРИФЫ ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Тарифы</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            Прозрачные цены без скрытых платежей
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Платите только за результат. Первый тест и открытие контакта — бесплатно.
                        </p>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PRICING.map((plan, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className={`rounded-2xl p-8 flex flex-col ${
                                    plan.featured
                                        ? "bg-surface border-2 border-accent shadow-xl relative"
                                        : "bg-surface border border-line"
                                }`}
                            >
                                {plan.featured && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider font-heading">
                                        Популярный
                                    </div>
                                )}
                                <h3 className="font-heading text-[20px] font-bold text-ink mb-2">{plan.name}</h3>
                                <p className="text-[13px] text-ink-3 font-medium mb-6">{plan.desc}</p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="font-heading text-[36px] font-extrabold text-ink">{plan.price}</span>
                                    <span className="text-[14px] text-ink-3 font-medium">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2.5">
                                            <Check size={16} className="text-accent shrink-0 mt-0.5" />
                                            <span className="text-[14px] text-ink-2 font-medium leading-relaxed">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={goCompany}
                                    className={`h-[48px] rounded-xl font-heading font-bold text-[14px] transition-colors flex items-center justify-center gap-2 ${
                                        plan.featured
                                            ? "bg-accent text-white hover:bg-accent-2"
                                            : "bg-surface-2 border border-line text-ink hover:bg-surface-3"
                                    }`}
                                >
                                    Подключить <ArrowRight size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <SectionDivider icon={ShieldCheck} />

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

            <SectionDivider icon={Scale} />

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

            <SectionDivider icon={ExternalLink} />

            {/* ===== НАЙМ И ИНТЕГРАЦИЯ ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-14 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Найм и интеграции</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                            Как нанимать на Веруме и сколько это стоит
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                            Полный цикл от вакансии до оффера. Платите только за открытие контактов прошедших кандидатов.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div className="bg-surface border border-line rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <UserPlus size={22} />
                                </div>
                                <h3 className="font-heading text-[20px] font-bold text-ink">Как проходит найм</h3>
                            </div>
                            <ol className="space-y-4">
                                {[
                                    "Создаёте вакансию в ЛК: стек, грейд, вилка",
                                    "Получаете короткую ссылку /v/abc123",
                                    "Кандидат проходит ИИ-тест за 45–60 минут",
                                    "Профиль уходит на ручную модерацию",
                                    "После одобрения — балл, грейд, видео",
                                    "Открываете контакты — списываются токены",
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-accent text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                                        <span className="text-[14.5px] text-ink-2 font-medium leading-relaxed">{text}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="bg-surface border-2 border-accent rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent text-white flex items-center justify-center">
                                    <ExternalLink size={22} />
                                </div>
                                <h3 className="font-heading text-[20px] font-bold text-accent">Интеграция с hh.ru</h3>
                            </div>
                            <p className="text-[14.5px] text-ink-2 font-medium leading-relaxed mb-4">
                                Публикуйте вакансии на hh.ru с той же ссылкой на ИИ-тест — кандидаты проходят его прямо со страницы вакансии.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Создаёте вакансию в Веруме",
                                    "Копируете публичную ссылку /v/...",
                                    "Вставляете её в описание на hh.ru",
                                    "Кандидаты проходят тест автоматически",
                                    "Одобренные профили сразу у вас",
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-2.5">
                                        <Check size={16} className="text-accent shrink-0 mt-1" />
                                        <span className="text-[14px] text-ink-2 font-medium leading-relaxed">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-surface border border-line rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                <Coins size={22} />
                            </div>
                            <h3 className="font-heading text-[20px] font-bold text-ink">Стоимость открытия контактов</h3>
                        </div>
                        <p className="text-[14.5px] text-ink-2 font-medium leading-relaxed mb-6">
                            Токены списываются только когда вы открываете контакты кандидата из базы. Тестирование внешних кандидатов считается отдельно по количеству верификаций.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { grade: "Junior", tokens: "100 токенов" },
                                { grade: "Middle", tokens: "200 токенов" },
                                { grade: "Senior", tokens: "350 токенов" },
                            ].map((item, i) => (
                                <div key={i} className="bg-surface-2 border border-line rounded-xl p-5 text-center">
                                    <div className="text-[12px] font-bold uppercase tracking-wider text-accent mb-2 font-heading">{item.grade}</div>
                                    <div className="font-heading text-[24px] font-extrabold text-ink">{item.tokens}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[13px] text-ink-3 font-medium leading-relaxed mt-5 pt-4 border-t border-line">
                            Токены входят в подписку. Например, на тарифе Pro (10 000 токенов) хватит на 28 открытий Senior-контактов или 100 Junior.
                        </p>
                    </div>
                </div>
            </section>

            <SectionDivider icon={MessageSquare} />

            {/* ===== FAQ (карточками) ===== */}
            <section className="py-16 md:py-20 bg-bg">
                <div className="max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-12 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">FAQ</div>
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink">
                            Частые вопросы
                        </h2>
                    </div>

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        {FAQ.map((f, i) => (
                            <motion.div key={i} variants={itemVariants} className="bg-surface border border-line rounded-2xl p-6 md:p-7">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                        <Lightbulb size={16} />
                                    </div>
                                    <h3 className="font-heading text-[17px] font-bold text-ink leading-tight">{f.q}</h3>
                                </div>
                                <p className="text-[14.5px] text-ink-3 leading-relaxed font-medium pl-11">{f.a}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <SectionDivider icon={Rocket} />

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
