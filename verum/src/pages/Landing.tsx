import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ChevronRight, ShieldCheck, Clock, Target, Users, Building2, Briefcase,
    FileText, Search, CheckCircle2, Brain, Eye, XCircle, Check
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const FADE_UP = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.6, delay: i * 0.08, ease: EASE }
    })
};

/* ════════════════════════════════════════════════════════════ */
/*  ДАННЫЕ                                                     */
/* ════════════════════════════════════════════════════════════ */

const PROBLEMS = [
    { value: "78%", text: "разработчиков считают, что стандартные тесты не отражают реальные задачи" },
    { value: "2–3 нед.", text: "уходит в среднем на закрытие одной IT-вакансии через ручной скрининг" },
    { value: "40%", text: "кандидатов с «идеальным» резюме не могут решить базовую задачу без ИИ" },
    { value: "20+ ч", text: "тратит тимлид ежемесячно на технические собеседования" },
];

const STEPS = [
    {
        icon: FileText,
        title: "Создайте вакансию",
        desc: "Укажите стек, грейд и вилку. Получите ссылку на тест под эту роль.",
        mockLabel: "Backend · Middle · Python",
    },
    {
        icon: Search,
        title: "Разошлите ссылку",
        desc: "Кандидаты проходят ИИ-интервью с античитом. Запись экрана и камеры сохраняется.",
        mockLabel: "25 тестов отправлено",
    },
    {
        icon: CheckCircle2,
        title: "Смотрите финалистов",
        desc: "Только проверенные модерацией профили с баллами и тайм-кодами.",
        mockLabel: "3 кандидата прошли",
    },
];

const FEATURES = [
    { icon: Brain, title: "ИИ-интервью", desc: "GigaChat проверяет архитектуру, ревью кода и стресс-тест на нагрузку." },
    { icon: ShieldCheck, title: "Античит", desc: "Запись камеры, блокировка F12, детекция переключений вкладок и копирования." },
    { icon: Eye, title: "Модерация вручную", desc: "Наши модераторы смотрят видео по тайм-кодам аномалий, а не целиком." },
    { icon: Target, title: "Умный матчинг", desc: "Сопоставление по стеку, грейду, языкам и желаемой зарплате." },
];

const SEGMENTS = [
    { icon: Building2, title: "Стартапам", desc: "Нет штатного HR — не проблема. Тимлид видит только финалистов и экономит 20+ часов в месяц." },
    { icon: Briefcase, title: "Продуктовым командам", desc: "Быстрый скрининг при пике найма. Один поток отсеивает до 70% неподходящих." },
    { icon: Users, title: "IT-агентствам", desc: "Проверенные кандидаты для клиентов. Прозрачные отчёты с баллами и видео." },
];

const COMPARISON = [
    { old: "Резюме накручиваются", now: "Метрики с записью теста" },
    { old: "2–3 недели на скрининг", now: "3 дня от вакансии до финалиста" },
    { old: "Тимлид на 20 собеседованиях", now: "Только финальные 2–3 встречи" },
    { old: "Вайбкодеры проходят фильтр", now: "Античит + ручная модерация" },
    { old: "Нет объективных данных", now: "100-балльная шкала по 5 компетенциям" },
];

/* ════════════════════════════════════════════════════════════ */
/*  СЕКЦИИ                                                     */
/* ════════════════════════════════════════════════════════════ */

function HeroSection() {
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
        <section className="pt-12 md:pt-24 pb-16 md:pb-24 bg-bg relative overflow-hidden">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                    {/* Текст */}
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: EASE }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-line text-ink-2 text-[11px] font-semibold uppercase tracking-wider mb-6"
                        >
                            <ShieldCheck size={13} className="text-accent" />
                            Автоматизированный скрининг IT-кадров
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                            className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(32px,5.5vw,60px)] text-ink mb-6"
                        >
                            Найм инженеров<br />
                            <span className="text-accent">без вайбкодеров</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
                            className="text-[16px] md:text-[18px] text-ink-2 max-w-[560px] mx-auto lg:mx-0 leading-relaxed mb-8"
                        >
                            Мы проверяем хард-скиллы через ИИ-интервью с античитом и ручной модерацией. Вы получаете только чистые профили с объективными метриками.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
                        >
                            <button
                                onClick={handleCompany}
                                className="h-[52px] px-7 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Начать найм <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={handleDev}
                                className="h-[52px] px-6 text-ink-2 text-[14px] font-medium hover:text-ink transition-colors flex items-center justify-center gap-1.5"
                            >
                                Я разработчик <span className="text-ink-4">→</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Мокап карточки кандидата */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="mx-auto w-full max-w-[420px]"
                    >
                        <div className="bg-surface border border-line rounded-2xl shadow-sm overflow-hidden">
                            {/* Шапка карточки */}
                            <div className="px-5 py-4 border-b border-line flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[13px]">АК</div>
                                    <div>
                                        <div className="text-[14px] font-semibold text-ink">Александр К.</div>
                                        <div className="text-[11px] text-ink-3">Senior · Backend · Python</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 text-accent text-[10px] font-bold uppercase">
                                    <ShieldCheck size={11} /> Проверен
                                </div>
                            </div>

                            {/* Компетенции */}
                            <div className="px-5 py-4 space-y-3">
                                {[
                                    { label: "Архитектура", value: 92 },
                                    { label: "Ревью кода", value: 88 },
                                    { label: "Работа с ИИ", value: 85 },
                                ].map((c, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-[12px] mb-1">
                                            <span className="text-ink-3">{c.label}</span>
                                            <span className="font-semibold text-ink tabular-nums">{c.value}/100</span>
                                        </div>
                                        <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${c.value}%` }}
                                                transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: EASE }}
                                                className="h-full bg-accent rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Статусы */}
                            <div className="px-5 py-3 border-t border-line bg-surface-2 flex flex-col gap-2 text-[11px]">
                                <div className="flex items-center justify-between">
                                    <span className="text-ink-3">Античит</span>
                                    <span className="flex items-center gap-1 text-accent font-semibold">
                                        <CheckCircle2 size={12} /> Нарушений нет
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-ink-3">Модерация</span>
                                    <span className="flex items-center gap-1 text-accent font-semibold">
                                        <CheckCircle2 size={12} /> Одобрен
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ProblemSection() {
    return (
        <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-[720px] mb-12"
                >
                    <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Проблема</motion.div>
                    <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink mb-4">
                        Рынок наводнили вайбкодеры
                    </motion.h2>
                    <motion.p variants={FADE_UP} custom={2} className="text-[16px] text-ink-2 leading-relaxed">
                        Резюме можно накрутить. GitHub — подделать. Собеседования отнимают недели. Существующие биржи и ATS не проверяют, умеет ли инженер думать.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {PROBLEMS.map((p, i) => (
                        <motion.div
                            key={i}
                            variants={FADE_UP}
                            custom={i + 3}
                            className="bg-surface border border-line rounded-xl p-5"
                        >
                            <div className="text-[28px] md:text-[36px] font-bold text-ink leading-none mb-2 tabular-nums">{p.value}</div>
                            <div className="text-[12px] md:text-[13px] text-ink-3 leading-snug">{p.text}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorksSection() {
    return (
        <section className="py-16 md:py-24 bg-bg">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-[720px] mb-12"
                >
                    <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Процесс</motion.div>
                    <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink mb-4">
                        От вакансии до финалиста за 3 дня
                    </motion.h2>
                    <motion.p variants={FADE_UP} custom={2} className="text-[16px] text-ink-2 leading-relaxed">
                        Полный цикл скрининга автоматизирован. Вы подключаетесь только на финальном этапе, когда остаются 2–3 кандидата.
                    </motion.p>
                </motion.div>

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
                                className="bg-surface border border-line rounded-2xl overflow-hidden flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-[36px] font-bold text-surface-2 leading-none tabular-nums">0{i + 1}</div>
                                    </div>
                                    <h3 className="text-[17px] font-semibold text-ink mb-2">{step.title}</h3>
                                    <p className="text-[13px] text-ink-3 leading-relaxed">{step.desc}</p>
                                </div>
                                <div className="px-6 py-3 border-t border-line bg-surface-2">
                                    <div className="text-[11px] font-mono text-ink-3 truncate">{step.mockLabel}</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-[720px] mb-12"
                >
                    <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Технология</motion.div>
                    <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink mb-4">
                        Что защищает от вайбкодеров
                    </motion.h2>
                    <motion.p variants={FADE_UP} custom={2} className="text-[16px] text-ink-2 leading-relaxed">
                        Четыре уровня защиты: от ИИ-проверки до ручной модерации видео. Списывать физически невозможно, а списывающих мы отсеиваем.
                    </motion.p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                                className="bg-surface border border-line rounded-2xl p-6 flex items-start gap-4"
                            >
                                <div className="w-11 h-11 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <h3 className="text-[16px] font-semibold text-ink mb-1">{f.title}</h3>
                                    <p className="text-[13.5px] text-ink-3 leading-relaxed">{f.desc}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ComparisonSection() {
    return (
        <section className="py-16 md:py-24 bg-bg">
            <div className="max-w-[1080px] mx-auto px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-[640px] mx-auto text-center mb-12"
                >
                    <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Сравнение</motion.div>
                    <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                        Чем Верум отличается от ручного найма
                    </motion.h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="bg-surface border border-line rounded-2xl overflow-hidden"
                >
                    <div className="grid grid-cols-2 bg-surface-2 border-b border-line">
                        <div className="px-5 md:px-6 py-4 text-[12px] md:text-[13px] font-semibold text-ink-3 uppercase tracking-wider">
                            Обычный найм
                        </div>
                        <div className="px-5 md:px-6 py-4 text-[12px] md:text-[13px] font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck size={14} /> С Верум
                        </div>
                    </div>
                    <div className="divide-y divide-line">
                        {COMPARISON.map((row, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="grid grid-cols-2"
                            >
                                <div className="px-5 md:px-6 py-4 flex items-start gap-2.5">
                                    <XCircle size={16} className="text-ink-4 shrink-0 mt-0.5" />
                                    <span className="text-[13px] md:text-[14px] text-ink-3">{row.old}</span>
                                </div>
                                <div className="px-5 md:px-6 py-4 flex items-start gap-2.5 border-l border-line">
                                    <Check size={16} className="text-accent shrink-0 mt-0.5" />
                                    <span className="text-[13px] md:text-[14px] text-ink font-medium">{row.now}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function SegmentsSection() {
    return (
        <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
            <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="max-w-[720px] mb-12"
                >
                    <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Кому подходит</motion.div>
                    <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                        Верум создан для команд, которые ценят время
                    </motion.h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {SEGMENTS.map((seg, i) => {
                        const Icon = seg.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                                className="bg-surface border border-line rounded-2xl p-6"
                            >
                                <div className="w-11 h-11 rounded-lg bg-surface-2 border border-line text-accent flex items-center justify-center mb-5">
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-[17px] font-semibold text-ink mb-2">{seg.title}</h3>
                                <p className="text-[13.5px] text-ink-3 leading-relaxed">{seg.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function FinalCtaSection() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);

    const handleClick = () => {
        if (!user) navigate("/register?role=company");
        else if (user.role === "company") navigate("/dashboard");
        else toast("Для найма нужен аккаунт компании");
    };

    return (
        <section className="py-16 md:py-24 bg-bg">
            <div className="max-w-[900px] mx-auto px-4 md:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="bg-surface border border-line rounded-2xl p-8 md:p-12 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-2 border border-line text-ink-2 text-[11px] font-semibold uppercase tracking-wider mb-6">
                        <Clock size={13} className="text-accent" /> Первый тест — бесплатно
                    </div>
                    <h2 className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink mb-4">
                        Перестаньте нанимать наугад
                    </h2>
                    <p className="text-[16px] text-ink-2 leading-relaxed max-w-[520px] mx-auto mb-8">
                        Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                    </p>
                    <button
                        onClick={handleClick}
                        className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors inline-flex items-center justify-center gap-2"
                    >
                        Подключить компанию <ChevronRight size={18} />
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

/* ════════════════════════════════════════════════════════════ */
/*  ГЛАВНЫЙ ЭКСПОРТ                                            */
/* ════════════════════════════════════════════════════════════ */

export function Landing() {
    return (
        <>
            <HeroSection />
            <ProblemSection />
            <HowItWorksSection />
            <FeaturesSection />
            <ComparisonSection />
            <SegmentsSection />
            <FinalCtaSection />
        </>
    );
}
