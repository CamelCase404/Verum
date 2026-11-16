import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
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
    Database,
    Clock,
    TrendingUp,
    Wallet,
    Users,
    Code2,
    Server,
    Smartphone,
    Cloud,
    Gamepad2,
    BarChart3,
    Lock,
    Zap,
    Gauge,
    Target,
    Sparkles,
    MessageSquare,
    Lightbulb,
    Star,
    Code,
    Layers,
    Terminal,
    ExternalLink,
    UserPlus,
    Coins,
    Timer,
    ClipboardCheck,
    UserCheck,
    Building2,
    User,
    Route,
    GitMerge,
    CircleDollarSign,
    Scale,
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

/* ===== Красивый разделитель с иконкой ===== */
function SectionDivider({ icon: Icon }: { icon: any }) {
    return (
        <div className="relative py-12 md:py-16 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="max-w-[1400px] mx-auto px-6 w-full flex items-center gap-6"
            >
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-line-2/70 to-line-2" />
                <div className="relative flex items-center justify-center shrink-0">
                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-accent/10 blur-[10px]" />
                    <div className="relative w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-accent shadow-sm">
                        <Icon size={20} />
                    </div>
                </div>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-line-2/70 to-line-2" />
            </motion.div>
        </div>
    );
}

/* ===== Заголовок секции (без подчёркивания) ===== */
function AccentTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
            {children}
        </h2>
    );
}

/* ===== DATA ===== */
const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается", icon: XCircle },
    { value: "3 дня", label: "До шортлиста", icon: Clock },
    { value: "80%", label: "Экономии времени", icon: TrendingUp },
    { value: "1.5 млн ₽", label: "Экономия в год", icon: Wallet },
];

const STEPS = [
    {
        num: "01",
        title: "Создайте вакансию",
        desc: "Укажите стек, грейд и вилку. Получите ссылку.",
        icon: FileText,
        color: "var(--accent)",
    },
    {
        num: "02",
        title: "ИИ-тест кандидата",
        desc: "12 вопросов с записью экрана и античитом.",
        icon: Search,
        color: "var(--blue)",
    },
    {
        num: "03",
        title: "Ручная модерация",
        desc: "Проверка видео по тайм-кодам аномалий.",
        icon: Eye,
        color: "var(--violet)",
    },
    {
        num: "04",
        title: "Чистый шортлист",
        desc: "Готовые профили с баллами и контактами.",
        icon: CheckCircle2,
        color: "var(--amber)",
    },
];

const COMPETENCIES = [
    {
        icon: Layers,
        title: "Архитектурное мышление",
        desc: "Умение проектировать системы, выбирать паттерны и обосновывать trade-offs.",
    },
    {
        icon: Code,
        title: "Понимание кода",
        desc: "Чтение и рефакторинг чужого кода, поиск багов и узких мест.",
    },
    {
        icon: Sparkles,
        title: "Работа с ИИ",
        desc: "Умение формулировать промпты и использовать ИИ-ассистентов в работе.",
    },
    {
        icon: Target,
        title: "Adaptability",
        desc: "Скорость адаптации к новым задачам и продакшен-инцидентам.",
    },
    {
        icon: MessageSquare,
        title: "Soft skills",
        desc: "Ясность изложения, умение объяснять сложное простыми словами.",
    },
];

const MATCHING = [
    {
        icon: Code2,
        title: "Стек",
        desc: "Полное совпадение или пересечение по ключевым технологиям.",
    },
    {
        icon: Gauge,
        title: "Грейд",
        desc: "Точное попадание или разница в одну ступень.",
    },
    {
        icon: Terminal,
        title: "Языки",
        desc: "Пересечение языков кандидата и требований вакансии.",
    },
    {
        icon: Wallet,
        title: "Зарплата",
        desc: "Ожидания кандидата вписываются в вилку вакансии.",
    },
    {
        icon: Star,
        title: "GitHub",
        desc: "Активность, звёзды репозиториев и реальный код на GitHub.",
    },
    {
        icon: TrendingUp,
        title: "Балл теста",
        desc: "Итоговый балл 0–100 по результатам ИИ-интервью.",
    },
    {
        icon: Users,
        title: "Soft skills",
        desc: "Оценка коммуникабельности и умения работать в команде.",
    },
];

const PRICING = [
    {
        name: "Start",
        price: "30 000 ₽",
        desc: "Для небольших команд и стартапов.",
        features: [
            "50 тестов в месяц",
            "5 000 токенов для доступа к базе",
            "Базовый античит-контроль",
            "Доступ к базе верифицированных",
        ],
        featured: false,
    },
    {
        name: "Pro",
        price: "75 000 ₽",
        desc: "Для растущих компаний с активным наймом.",
        features: [
            "200 тестов в месяц",
            "20 000 токенов",
            "Приоритетная поддержка",
            "Расширенная аналитика",
        ],
        featured: true,
    },
    {
        name: "Enterprise",
        price: "200 000 ₽",
        desc: "Для крупных компаний с большим потоком.",
        features: [
            "Безлимитные тесты",
            "Безлимит токенов",
            "Выделенный менеджер",
            "SLA и кастомные интеграции",
        ],
        featured: false,
    },
];

const WHY_US = [
    {
        icon: Brain,
        title: "ИИ-судья на GigaChat",
        desc: "Оценивает архитектурное мышление и работу с кодом.",
    },
    {
        icon: ShieldCheck,
        title: "4 уровня античита",
        desc: "Камера, микрофон, фокус, блокировка DevTools.",
    },
    {
        icon: Database,
        title: "Матчинг по 7 осям",
        desc: "Стек, грейд, зарплата, GitHub, soft skills.",
    },
    {
        icon: Lock,
        title: "Ручная модерация",
        desc: "Каждый профиль проверяется человеком.",
    },
    {
        icon: Zap,
        title: "Результат за 3 дня",
        desc: "Вместо 2–3 недель скрининга.",
    },
    {
        icon: Users,
        title: "Реальные инженеры",
        desc: "Вайбкодеры отсеиваются на этапе теста.",
    },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + модерация"],
    ["Субъективное мнение", "100-балльная шкала"],
];

const TEST_STAGES = [
    {
        num: "01",
        title: "Общие знания",
        desc: "8 вопросов по стеку и грейду",
        time: "15 мин",
    },
    {
        num: "02",
        title: "Code Review",
        desc: "Поиск багов в реальном коде",
        time: "10 мин",
    },
    {
        num: "03",
        title: "Продакшен-инцидент",
        desc: "Как починить сломанный код",
        time: "10 мин",
    },
    {
        num: "04",
        title: "Code Review 2",
        desc: "Другие баги и уязвимости",
        time: "10 мин",
    },
    {
        num: "05",
        title: "Вторая проблема",
        desc: "Новая ситуация из продакшена",
        time: "10 мин",
    },
];

const TEST_RESULTS = [
    {
        icon: Gauge,
        title: "Итоговый балл 0–100",
        desc: "Сводная оценка по всем 5 этапам собеседования.",
    },
    {
        icon: Star,
        title: "Грейд кандидата",
        desc: "Junior, Middle, Senior или Reject — по реальным ответам.",
    },
    {
        icon: Layers,
        title: "Разбивка по компетенциям",
        desc: "5 осей: архитектура, код, работа с ИИ, adaptability, soft skills.",
    },
    {
        icon: MessageSquare,
        title: "Резюме и рекомендация",
        desc: "Текст от ИИ-судьи: сильные стороны, пробелы, вердикт.",
    },
    {
        icon: Eye,
        title: "Запись видео",
        desc: "Полное видео собеседования с записью экрана и камеры.",
    },
    {
        icon: Clock,
        title: "Тайм-коды аномалий",
        desc: "Модератор видит только подозрительные секунды.",
    },
];

const NAV_METHODS = [
    {
        badge: "Способ 1",
        title: "Интеграция для своих кандидатов",
        desc: "Уже нашли человека сами (на hh.ru, по рекомендациям)? Отправьте ему ссылку на тест — он пройдёт его заново под вашу вакансию.",
        icon: ExternalLink,
        featured: true,
        steps: [
            "Создаёте вакансию в ЛК Верума",
            "Получаете короткую ссылку /v/abc123",
            "Отправляете ссылку кандидату",
            "Кандидат проходит тест за 45–60 минут",
            "Составляется топ откликов на вакансию",
            "Открываете контакты только прошедших",
        ],
    },
    {
        badge: "Способ 2",
        title: "Найм из базы Верум",
        desc: "Алгоритм сам подбирает кандидатов по вашим требованиям. Вы открываете контакты только тех, кто подошёл.",
        icon: UserPlus,
        featured: false,
        steps: [
            "Заполняете профиль компании в Веруме",
            "В поиске указываете стек, грейд, вилку",
            "Алгоритм подбирает по 7 осям матчинга",
            "Смотрите профили: балл, видео, компетенции",
            "Открываете контакты за токены",
            "Связываетесь с кандидатом напрямую",
        ],
    },
];

const TOKEN_COSTS = [
    { grade: "Junior", tokens: "100 токенов" },
    { grade: "Middle", tokens: "200 токенов" },
    { grade: "Senior", tokens: "350 токенов" },
];

export function Landing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const [audience, setAudience] = useState<"company" | "developer">(
        "company",
    );

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
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 md:opacity-50 pointer-events-none -z-10" />
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <motion.div
                        animate={{
                            opacity: [0.05, 0.1, 0.05],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[900px] md:h-[900px] bg-accent rounded-full blur-[80px] md:blur-[140px]"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.03, 0.06, 0.03],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 2,
                        }}
                        className="hidden md:block absolute top-[20%] left-[10%] w-[400px] h-[400px] bg-accent-2 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.02, 0.05, 0.02],
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                        className="hidden md:block absolute bottom-[10%] right-[15%] w-[500px] h-[500px] bg-accent-3 rounded-full blur-[120px]"
                    />
                </div>

                <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex flex-col items-center"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="font-heading font-extrabold text-[clamp(40px,6vw,76px)] leading-[1.1] tracking-tight text-ink mb-6 max-w-[900px]"
                        >
                            Наймите инженера, который{" "}
                            <span className="text-accent">реально</span> пишет
                            код
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-[17px] md:text-[21px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[680px]"
                        >
                            Скрининг через ИИ-интервью с античитом и записью
                            видео. Отсеиваем 70% кандидатов и экономим до 1.5
                            млн ₽ в год.
                        </motion.p>

                        <motion.div variants={itemVariants}>
                            <button
                                onClick={goCompany}
                                className="group h-[56px] px-10 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors inline-flex items-center justify-center gap-2"
                            >
                                Нанять{" "}
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ===== ВЫБОР РОЛИ ===== */}
            <section className="py-16 md:py-20 relative">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                            Кто вы?
                        </div>
                        <h2 className="font-heading text-[clamp(28px,3.5vw,40px)] font-extrabold leading-tight text-ink mb-3">
                            Выберите свою роль
                        </h2>
                        <p className="text-[15px] md:text-[16px] text-ink-3 font-medium leading-relaxed">
                            Мы покажем только то, что важно именно для вас.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <button
                            onClick={() => setAudience("company")}
                            className={`group relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                audience === "company"
                                    ? "border-accent bg-surface shadow-xl shadow-accent/10"
                                    : "border-line bg-surface hover:border-accent/40"
                            }`}
                        >
                            {audience === "company" && (
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                            )}
                            <div
                                className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                                    audience === "company"
                                        ? "bg-accent text-white"
                                        : "bg-accent/10 text-accent"
                                }`}
                            >
                                <Building2 size={26} />
                            </div>
                            <h3 className="relative font-heading text-[22px] font-bold text-ink mb-2">
                                Ищу разработчика
                            </h3>
                            <p className="relative text-[14px] text-ink-3 font-medium leading-relaxed mb-4">
                                Хочу быстро находить проверенных инженеров и
                                экономить время на скрининге.
                            </p>
                            <div
                                className={`relative inline-flex items-center gap-2 text-[13px] font-bold font-heading ${
                                    audience === "company"
                                        ? "text-accent"
                                        : "text-ink-3"
                                }`}
                            >
                                {audience === "company" ? "Выбрано" : "Выбрать"}
                                <ArrowRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </button>

                        <button
                            onClick={() => setAudience("developer")}
                            className={`group relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                audience === "developer"
                                    ? "border-accent bg-surface shadow-xl shadow-accent/10"
                                    : "border-line bg-surface hover:border-accent/40"
                            }`}
                        >
                            {audience === "developer" && (
                                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
                            )}
                            <div
                                className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${
                                    audience === "developer"
                                        ? "bg-accent text-white"
                                        : "bg-accent/10 text-accent"
                                }`}
                            >
                                <User size={26} />
                            </div>
                            <h3 className="relative font-heading text-[22px] font-bold text-ink mb-2">
                                Ищу работу
                            </h3>
                            <p className="relative text-[14px] text-ink-3 font-medium leading-relaxed mb-4">
                                Хочу попасть в базу проверенных инженеров и
                                получать предложения напрямую.
                            </p>
                            <div
                                className={`relative inline-flex items-center gap-2 text-[13px] font-bold font-heading ${
                                    audience === "developer"
                                        ? "text-accent"
                                        : "text-ink-3"
                                }`}
                            >
                                {audience === "developer"
                                    ? "Выбрано"
                                    : "Выбрать"}
                                <ArrowRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== КОНТЕНТ ПО АУДИТОРИИ ===== */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={audience}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: EASE }}
                >
                    {audience === "company" ? (
                        <>
                            {/* КОМПАНИЯМ: Метрики */}
                            <SectionDivider icon={TrendingUp} />
                            <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
                                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                                <div className="max-w-[1400px] mx-auto px-6 relative">
                                    <div className="text-center mb-14 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Цифры
                                        </div>
                                        <AccentTitle>
                                            Результаты в деньгах и времени
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Средние показатели по компаниям,
                                            которые уже используют Верум.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                                        {METRICS.map((m, i) => {
                                            const Icon = m.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="text-center"
                                                >
                                                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                                                        <Icon size={26} />
                                                    </div>
                                                    <div className="font-heading text-[36px] md:text-[44px] font-extrabold text-ink leading-none mb-2">
                                                        {m.value}
                                                    </div>
                                                    <div className="text-[13px] md:text-[14px] font-semibold text-ink-3">
                                                        {m.label}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Сравнение */}
                            <SectionDivider icon={Scale} />
                            <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
                                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                                <div className="max-w-[1200px] mx-auto px-6 relative">
                                    <div className="text-center mb-12 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Сравнение
                                        </div>
                                        <AccentTitle>
                                            Верум vs Обычный найм
                                        </AccentTitle>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8">
                                            <h3 className="font-heading text-[18px] font-bold text-ink-3 mb-6 pb-4 border-b border-line">
                                                Обычный найм
                                            </h3>
                                            <ul className="space-y-4">
                                                {COMPARISON.map((row, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0 mt-0.5">
                                                            <XCircle
                                                                size={14}
                                                                className="text-ink-4"
                                                            />
                                                        </div>
                                                        <span className="text-[15px] text-ink-3 font-medium leading-relaxed">
                                                            {row[0]}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-surface border-2 border-accent rounded-2xl p-6 md:p-8 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                                            <h3 className="font-heading text-[18px] font-bold text-accent mb-6 pb-4 border-b border-line flex items-center gap-2">
                                                <ShieldCheck size={20} /> С
                                                Верум
                                            </h3>
                                            <ul className="space-y-4">
                                                {COMPARISON.map((row, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-start gap-3"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check
                                                                size={14}
                                                                className="text-accent"
                                                            />
                                                        </div>
                                                        <span className="text-[15px] text-ink font-semibold leading-relaxed">
                                                            {row[1]}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Шаги */}
                            <SectionDivider icon={Route} />
                            <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
                                <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="max-w-[1400px] mx-auto px-6 relative">
                                    <div className="text-center mb-16 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Как это работает
                                        </div>
                                        <AccentTitle>
                                            От вакансии до финалиста — 4 шага
                                        </AccentTitle>
                                    </div>
                                    <div className="relative">
                                        <div className="hidden md:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[2px] rounded-full bg-gradient-to-r from-line-2/30 via-accent/50 to-line-2/30" />
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                                            {STEPS.map((step, i) => {
                                                const Icon = step.icon;
                                                return (
                                                    <div
                                                        key={i}
                                                        className="relative flex flex-col items-center text-center"
                                                    >
                                                        <div className="relative mb-6">
                                                            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-accent/5" />
                                                            <div className="w-20 h-20 rounded-full bg-surface border-2 border-line flex items-center justify-center relative z-10 shadow-sm">
                                                                <Icon
                                                                    size={30}
                                                                    style={{
                                                                        color: step.color,
                                                                    }}
                                                                />
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
                                                        {i <
                                                            STEPS.length -
                                                                1 && (
                                                            <div className="hidden md:flex absolute top-[32px] -right-[40px] w-24 items-center z-0">
                                                                <div className="flex-1 h-[2px] bg-accent/60" />
                                                                <div className="w-2 h-2 rotate-45 border-t-2 border-r-2 border-accent ml-[-2px]" />
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Что оценивается */}
                            <SectionDivider icon={Target} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Что оценивается
                                        </div>
                                        <AccentTitle>
                                            5 компетенций в 100-балльной шкале
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            ИИ-судья оценивает каждую
                                            компетенцию отдельно и выдаёт
                                            итоговый балл.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {COMPETENCIES.map((c, i) => {
                                            const Icon = c.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-surface border border-line rounded-xl p-6"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                                        <Icon size={22} />
                                                    </div>
                                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">
                                                        {c.title}
                                                    </h3>
                                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">
                                                        {c.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Как подбирается */}
                            <SectionDivider icon={GitMerge} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Как подбирается
                                        </div>
                                        <AccentTitle>
                                            Матчинг по 7 осям
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Алгоритм сравнивает кандидата с
                                            вакансией сразу по 7 параметрам, а
                                            не только по стеку.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                                        {MATCHING.map((m, i) => {
                                            const Icon = m.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-surface border border-line rounded-xl p-5"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3">
                                                        <Icon size={20} />
                                                    </div>
                                                    <h3 className="font-heading text-[15px] font-bold text-ink mb-2">
                                                        {m.title}
                                                    </h3>
                                                    <p className="text-[13px] text-ink-3 leading-relaxed font-medium">
                                                        {m.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Тарифы */}
                            <SectionDivider icon={CircleDollarSign} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-14 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Тарифы
                                        </div>
                                        <AccentTitle>
                                            Прозрачные цены без скрытых платежей
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Платите только за результат. Первый
                                            тест и открытие контакта —
                                            бесплатно.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {PRICING.map((plan, i) => (
                                            <div
                                                key={i}
                                                className={`rounded-2xl p-8 flex flex-col relative ${
                                                    plan.featured
                                                        ? "bg-surface border-2 border-accent shadow-xl shadow-accent/10"
                                                        : "bg-surface border border-line"
                                                }`}
                                            >
                                                {/* Фоновый орб внутри overflow-hidden, чтобы не вылезал за рамки */}
                                                <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                                                    {plan.featured && (
                                                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
                                                    )}
                                                </div>

                                                {plan.featured && (
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider font-heading whitespace-nowrap shadow-md z-10">
                                                        Популярный
                                                    </div>
                                                )}
                                                <h3 className="font-heading text-[20px] font-bold text-ink mb-2">
                                                    {plan.name}
                                                </h3>
                                                <p className="text-[13px] text-ink-3 font-medium mb-6">
                                                    {plan.desc}
                                                </p>
                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className="font-heading text-[36px] font-extrabold text-ink">
                                                        {plan.price}
                                                    </span>
                                                    <span className="text-[14px] text-ink-3 font-medium">
                                                        /мес
                                                    </span>
                                                </div>
                                                <ul className="space-y-3 mb-8 flex-1">
                                                    {plan.features.map(
                                                        (f, j) => (
                                                            <li
                                                                key={j}
                                                                className="flex items-start gap-2.5"
                                                            >
                                                                <Check
                                                                    size={16}
                                                                    className="text-accent shrink-0 mt-0.5"
                                                                />
                                                                <span className="text-[14px] text-ink-2 font-medium leading-relaxed">
                                                                    {f}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                                <button
                                                    onClick={goCompany}
                                                    className={`h-[48px] rounded-xl font-heading font-bold text-[14px] transition-colors flex items-center justify-center gap-2 ${
                                                        plan.featured
                                                            ? "bg-accent text-white hover:bg-accent-2"
                                                            : "bg-surface-2 border border-line text-ink hover:bg-surface-3"
                                                    }`}
                                                >
                                                    Подключить{" "}
                                                    <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Найм и интеграция */}
                            <SectionDivider icon={ExternalLink} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-14 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Два способа найма
                                        </div>
                                        <AccentTitle>
                                            Как нанимать через Верум
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Ищите готовых инженеров в базе или
                                            прогоняйте своих кандидатов через
                                            тест под вакансию.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        {NAV_METHODS.map((method, idx) => {
                                            const Icon = method.icon;
                                            return (
                                                <div
                                                    key={idx}
                                                    className={`rounded-2xl p-8 relative overflow-hidden ${
                                                        method.featured
                                                            ? "bg-surface border-2 border-accent"
                                                            : "bg-surface border border-line"
                                                    }`}
                                                >
                                                    {method.featured && (
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                                                    )}
                                                    <div className="flex items-center gap-3 mb-5 relative">
                                                        <div
                                                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                                                method.featured
                                                                    ? "bg-accent text-white"
                                                                    : "bg-accent/10 text-accent"
                                                            }`}
                                                        >
                                                            <Icon size={22} />
                                                        </div>
                                                        <div>
                                                            <div
                                                                className={`text-[11px] font-bold uppercase tracking-wider font-heading ${
                                                                    method.featured
                                                                        ? "text-accent"
                                                                        : "text-ink-3"
                                                                }`}
                                                            >
                                                                {method.badge}
                                                            </div>
                                                            <h3 className="font-heading text-[20px] font-bold text-ink">
                                                                {method.title}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <p className="text-[14.5px] text-ink-2 font-medium leading-relaxed mb-5 relative">
                                                        {method.desc}
                                                    </p>
                                                    <ol className="space-y-3 relative">
                                                        {method.steps.map(
                                                            (text, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-start gap-3"
                                                                >
                                                                    <span
                                                                        className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                                                            method.featured
                                                                                ? "bg-accent text-white"
                                                                                : "bg-surface-2 border border-line text-ink-2"
                                                                        }`}
                                                                    >
                                                                        {i + 1}
                                                                    </span>
                                                                    <span className="text-[14px] text-ink-2 font-medium leading-relaxed">
                                                                        {text}
                                                                    </span>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ol>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-surface border border-line rounded-2xl p-8">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                                <Coins size={22} />
                                            </div>
                                            <h3 className="font-heading text-[20px] font-bold text-ink">
                                                Стоимость открытия контактов
                                            </h3>
                                        </div>
                                        <p className="text-[14.5px] text-ink-2 font-medium leading-relaxed mb-6">
                                            Токены списываются только когда вы
                                            открываете контакты кандидата.
                                            Тестирование своих кандидатов
                                            считается отдельно по количеству
                                            верификаций.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {TOKEN_COSTS.map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="bg-surface-2 border border-line rounded-xl p-5 text-center"
                                                >
                                                    <div className="text-[12px] font-bold uppercase tracking-wider text-accent mb-2 font-heading">
                                                        {item.grade}
                                                    </div>
                                                    <div className="font-heading text-[24px] font-extrabold text-ink">
                                                        {item.tokens}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[13px] text-ink-3 font-medium leading-relaxed mt-5 pt-4 border-t border-line">
                                            Токены входят в подписку. На тарифе
                                            Pro (20 000 токенов) хватит на 57
                                            открытий Senior-контактов или 200
                                            Junior.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* КОМПАНИЯМ: Почему мы */}
                            <SectionDivider icon={ShieldCheck} />
                            <section className="py-16 md:py-20 bg-bg relative overflow-hidden">
                                <div className="hidden md:block absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                                <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-2/5 rounded-full blur-[100px] pointer-events-none" />
                                <div className="max-w-[1400px] mx-auto px-6 relative">
                                    <div className="mb-12 max-w-2xl">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Почему мы
                                        </div>
                                        <AccentTitle>
                                            Технология, которая заменяет 20
                                            часов собеседований
                                        </AccentTitle>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {WHY_US.map((f, i) => {
                                            const Icon = f.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-surface border border-line rounded-xl p-6"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                                        <Icon size={22} />
                                                    </div>
                                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">
                                                        {f.title}
                                                    </h3>
                                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">
                                                        {f.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            {/* РАЗРАБОТЧИКАМ: Что происходит за 45-60 минут */}
                            <SectionDivider icon={Timer} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Внутри теста
                                        </div>
                                        <AccentTitle>
                                            Что происходит за 45–60 минут
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Кандидат проходит 5 этапов разной
                                            сложности. Каждый этап — новая тема,
                                            без повторов.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                        {TEST_STAGES.map((s, i) => (
                                            <div
                                                key={i}
                                                className="bg-surface border border-line rounded-xl p-5"
                                            >
                                                <div className="text-[11px] font-bold text-accent mb-2 font-mono">
                                                    {s.num}
                                                </div>
                                                <h3 className="font-heading text-[15px] font-bold text-ink mb-1.5 leading-tight">
                                                    {s.title}
                                                </h3>
                                                <p className="text-[12.5px] text-ink-3 font-medium leading-relaxed mb-3">
                                                    {s.desc}
                                                </p>
                                                <div className="text-[11px] font-bold text-ink-4 uppercase tracking-wider">
                                                    {s.time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-surface border border-line rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-heading text-[17px] font-bold text-ink mb-1">
                                                Античит работает всё время
                                            </h3>
                                            <p className="text-[14px] text-ink-3 font-medium leading-relaxed">
                                                Камера и микрофон записываются,
                                                детектируется переключение
                                                вкладок, блокируются DevTools,
                                                копирование и контекстное меню.
                                                Любое нарушение — стоп-кадр с
                                                тайм-кодом для модератора.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* РАЗРАБОТЧИКАМ: Что получаете после теста */}
                            <SectionDivider icon={ClipboardCheck} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-12 max-w-2xl mx-auto">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Результат
                                        </div>
                                        <AccentTitle>
                                            Что вы получаете после теста
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            Полный отчёт с обоснованием каждого
                                            балла. Компании видят вас именно
                                            таким.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {TEST_RESULTS.map((f, i) => {
                                            const Icon = f.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-surface border border-line rounded-xl p-6"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                                        <Icon size={22} />
                                                    </div>
                                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">
                                                        {f.title}
                                                    </h3>
                                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">
                                                        {f.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* РАЗРАБОТЧИКАМ: Что оценивается */}
                            <SectionDivider icon={Target} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl">
                                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                            Что оценивается
                                        </div>
                                        <AccentTitle>
                                            5 компетенций в 100-балльной шкале
                                        </AccentTitle>
                                        <p className="text-[16px] md:text-[18px] text-ink-3 font-medium leading-relaxed">
                                            ИИ-судья оценивает каждую
                                            компетенцию отдельно и выдаёт
                                            итоговый балл.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {COMPETENCIES.map((c, i) => {
                                            const Icon = c.icon;
                                            return (
                                                <div
                                                    key={i}
                                                    className="bg-surface border border-line rounded-xl p-6"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4">
                                                        <Icon size={22} />
                                                    </div>
                                                    <h3 className="font-heading text-[17px] font-bold text-ink mb-2">
                                                        {c.title}
                                                    </h3>
                                                    <p className="text-[14px] text-ink-3 leading-relaxed font-medium">
                                                        {c.desc}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </section>

                            {/* РАЗРАБОТЧИКАМ: CTA */}
                            <SectionDivider icon={UserCheck} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1200px] mx-auto px-6">
                                    <div className="bg-surface border-2 border-accent rounded-3xl p-8 md:p-12 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-bl-full pointer-events-none" />
                                        <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                                            <div>
                                                <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">
                                                    Разработчикам
                                                </div>
                                                <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
                                                    Хотите в базу проверенных
                                                    инженеров?
                                                </h2>
                                                <p className="text-[16px] md:text-[17px] text-ink-2 font-medium leading-relaxed mb-6">
                                                    Пройдите бесплатный тест и
                                                    получите верифицированный
                                                    профиль с баллами. Компании
                                                    сами найдут вас.
                                                </p>
                                                <button
                                                    onClick={goDev}
                                                    className="group h-[52px] px-7 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                                >
                                                    Пройти тест{" "}
                                                    <ArrowRight
                                                        size={18}
                                                        className="transition-transform group-hover:translate-x-1"
                                                    />
                                                </button>
                                            </div>
                                            <div className="space-y-3">
                                                {[
                                                    "Бесплатное прохождение теста",
                                                    "Верифицированный профиль в базе",
                                                    "Прямые контакты с компаниями",
                                                    "Никаких резюме и самопрезентаций",
                                                    "Тест всего за 45–60 минут",
                                                ].map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-start gap-3 bg-surface-2 border border-line rounded-xl p-4"
                                                    >
                                                        <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                                            <Check
                                                                size={14}
                                                                className="text-accent"
                                                            />
                                                        </div>
                                                        <span className="text-[14.5px] text-ink-2 font-semibold leading-relaxed">
                                                            {item}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* ===== ФИНАЛЬНЫЙ CTA ===== */}
            <SectionDivider icon={Sparkles} />
            <section className="py-20 md:py-28 bg-bg">
                <div className="max-w-[900px] mx-auto px-6 text-center">
                    <h2 className="font-heading text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.1] text-ink mb-6">
                        {audience === "company"
                            ? "Перестаньте тратить часы на собеседования"
                            : "Получите верифицированный профиль за 45 минут"}
                    </h2>
                    <p className="text-[17px] md:text-[20px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[600px] mx-auto">
                        {audience === "company"
                            ? "Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно."
                            : "Пройдите бесплатный ИИ-тест и попадните в базу проверенных инженеров. Компании сами напишут вам."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {audience === "company" ? (
                            <>
                                <button
                                    onClick={goCompany}
                                    className="group h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
                                >
                                    Подключить компанию{" "}
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                                <button
                                    onClick={() => setAudience("developer")}
                                    className="group h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
                                >
                                    Я разработчик <ChevronRight size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={goDev}
                                    className="group h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
                                >
                                    Пройти тест{" "}
                                    <ArrowRight
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </button>
                                <button
                                    onClick={() => setAudience("company")}
                                    className="group h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
                                >
                                    Я компания <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
