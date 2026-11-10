import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ChevronRight, ShieldCheck, Clock, Target, Users, Building2, Briefcase,
    FileText, Search, CheckCircle2, Brain, Eye, XCircle, Check, ArrowRight
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const FADE_UP = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.7, delay: i * 0.1, ease: EASE }
    })
};

// --- ДАННЫЕ ---

const PROBLEMS = [
    { value: "78%", text: "разработчиков считают, что стандартные тесты не отражают реальные задачи" },
    { value: "2–3 нед.", text: "уходит в среднем на закрытие одной IT-вакансии через ручной скрининг" },
    { value: "40%", text: "кандидатов с «идеальным» резюме не могут решить базовую задачу без ИИ" },
    { value: "20+ ч", text: "тратит тимлид ежемесячно на технические собеседования" },
];

const STEPS = [
    { icon: FileText, title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку. Настройте фильтры под ваши задачи." },
    { icon: Search, title: "Отправьте ссылку", desc: "Кандидаты проходят ИИ-интервью с античитом. Запись экрана сохраняется." },
    { icon: CheckCircle2, title: "Смотрите финалистов", desc: "Только проверенные модерацией профили с объективными баллами." },
];

const FEATURES = [
    { icon: Brain, title: "ИИ-интервью", desc: "GigaChat проверяет архитектуру, ревью кода и стресс-тест на нагрузку." },
    { icon: ShieldCheck, title: "Античит", desc: "Запись камеры, блокировка F12, детекция переключений вкладок и копирования." },
    { icon: Eye, title: "Ручная модерация", desc: "Наши модераторы смотрят видео по тайм-кодам аномалий, а не целиком." },
    { icon: Target, title: "Умный матчинг", desc: "Сопоставление по стеку, грейду, языкам и желаемой зарплате." },
];

const SEGMENTS = [
    { icon: Building2, title: "Стартапам", desc: "Нет штатного HR — не проблема. Тимлид видит только финалистов и экономит время." },
    { icon: Briefcase, title: "Продуктовым командам", desc: "Быстрый скрининг при пике найма. Автоматический отсев до 70% неподходящих." },
    { icon: Users, title: "IT-агентствам", desc: "Проверенные кандидаты для клиентов. Прозрачные отчёты с баллами и видео." },
];

const COMPARISON = [
    { old: "Резюме накручиваются", now: "Метрики с записью теста" },
    { old: "2–3 недели на скрининг", now: "3 дня от вакансии до финалиста" },
    { old: "Тимлид на 20 собеседованиях", now: "Только финальные 2–3 встречи" },
    { old: "Вайбкодеры проходят фильтр", now: "Античит + ручная модерация" },
    { old: "Нет объективных данных", now: "100-балльная шкала по 5 компетенциям" },
];

// --- СЕКЦИИ ---

export function Landing() {
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
        <div className="flex flex-col w-full bg-bg overflow-hidden">
            
            {/* 1. HERO SECTION */}
            <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 bg-bg">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                        
                        <div className="text-center lg:text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface-2 border border-line text-ink-2 text-[11px] font-semibold uppercase tracking-wider mb-6"
                            >
                                <ShieldCheck size={13} className="text-accent" />
                                Автоматизированный скрининг IT-кадров
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
                                className="font-semibold tracking-[-0.04em] leading-[1.05] text-[clamp(32px,5.5vw,64px)] text-ink mb-6"
                            >
                                Нанимайте инженеров<br />
                                <span className="text-accent">без вайбкодеров</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                                className="text-[16px] md:text-[18px] text-ink-2 max-w-[540px] mx-auto lg:mx-0 leading-relaxed mb-8"
                            >
                                Мы проверяем хард-скиллы через ИИ-интервью с античитом и ручной модерацией. Вы получаете только чистые профили с объективными метриками.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
                            >
                                <button
                                    onClick={handleCompany}
                                    className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Начать найм <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={handleDev}
                                    className="h-[52px] px-6 rounded-xl bg-surface border border-line-2 text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center w-full sm:w-auto"
                                >
                                    Я разработчик
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-[13px] text-ink-3 font-medium"
                            >
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Первый тест бесплатно</div>
                                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Ручная модерация</div>
                            </motion.div>
                        </div>

                        {/* Строгий мокап дашборда */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                            className="mx-auto w-full max-w-[480px]"
                        >
                            <div className="bg-surface border border-line rounded-2xl shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-line flex justify-between items-center bg-surface-2">
                                    <span className="text-[13px] font-semibold text-ink">Воронка кандидатов</span>
                                    <span className="text-[11px] text-ink-3 font-medium">Обновлено сейчас</span>
                                </div>
                                <div className="p-4 space-y-3">
                                    
                                    {/* Кандидат 1 (Проверен) */}
                                    <div className="flex items-center gap-3 p-3 bg-surface-2 border border-line rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-[13px]">АК</div>
                                        <div className="flex-1">
                                            <div className="text-[13px] font-semibold text-ink">Александр К.</div>
                                            <div className="text-[11px] text-ink-3">Senior Backend (Python)</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[14px] font-bold text-accent">95/100</div>
                                            <div className="text-[10px] text-accent font-semibold uppercase">Одобрен</div>
                                        </div>
                                    </div>

                                    {/* Кандидат 2 (В процессе) */}
                                    <div className="flex items-center gap-3 p-3 bg-surface border border-line-2 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-surface-3 text-ink-3 flex items-center justify-center font-bold text-[13px]">МС</div>
                                        <div className="flex-1">
                                            <div className="text-[13px] font-semibold text-ink">Мария С.</div>
                                            <div className="text-[11px] text-ink-3">Middle Frontend (React)</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[14px] font-bold text-ink-3">—</div>
                                            <div className="text-[10px] text-ink-3 font-semibold uppercase">На модерации</div>
                                        </div>
                                    </div>

                                    {/* Кандидат 3 (Отклонен) */}
                                    <div className="flex items-center gap-3 p-3 bg-surface-2 border border-line rounded-xl opacity-60">
                                        <div className="w-10 h-10 rounded-full bg-warn/10 text-warn flex items-center justify-center font-bold text-[13px]">ДЕ</div>
                                        <div className="flex-1">
                                            <div className="text-[13px] font-semibold text-ink">Дмитрий Е.</div>
                                            <div className="text-[11px] text-ink-3">Junior (QA Automation)</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[14px] font-bold text-warn">12/100</div>
                                            <div className="text-[10px] text-warn font-semibold uppercase">Отклонен</div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. PROBLEM SECTION */}
            <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-[720px] mb-12">
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
                            <motion.div key={i} variants={FADE_UP} custom={i + 3} className="bg-surface border border-line rounded-xl p-5">
                                <div className="text-[28px] md:text-[36px] font-bold text-ink leading-none mb-2 tabular-nums">{p.value}</div>
                                <div className="text-[12px] md:text-[13px] text-ink-3 leading-snug">{p.text}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. HOW IT WORKS */}
            <section className="py-16 md:py-24 bg-bg">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-[720px] mb-12">
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
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} className="bg-surface border border-line rounded-2xl p-6 relative">
                                    <div className="absolute top-6 right-6 text-[40px] font-bold text-surface-2 pointer-events-none select-none">0{i + 1}</div>
                                    <Icon size={24} className="text-accent mb-4" />
                                    <h3 className="text-[17px] font-semibold text-ink mb-2">{step.title}</h3>
                                    <p className="text-[13px] text-ink-3 leading-relaxed">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. FEATURES */}
            <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-[720px] mb-12">
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
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }} className="bg-surface border border-line rounded-2xl p-6 flex items-start gap-4">
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

            {/* 5. COMPARISON */}
            <section className="py-16 md:py-24 bg-bg">
                <div className="max-w-[1080px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-[640px] mx-auto text-center mb-12">
                        <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Сравнение</motion.div>
                        <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                            Чем Верум отличается от ручного найма
                        </motion.h2>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: EASE }} className="bg-surface border border-line rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-2 bg-surface-2 border-b border-line">
                            <div className="px-5 md:px-6 py-4 text-[12px] md:text-[13px] font-semibold text-ink-3 uppercase tracking-wider">Обычный найм</div>
                            <div className="px-5 md:px-6 py-4 text-[12px] md:text-[13px] font-semibold text-accent uppercase tracking-wider flex items-center gap-1.5">
                                <ShieldCheck size={14} /> С Верум
                            </div>
                        </div>
                        <div className="divide-y divide-line">
                            {COMPARISON.map((row, i) => (
                                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }} className="grid grid-cols-2">
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

            {/* 6. SEGMENTS */}
            <section className="py-16 md:py-24 bg-surface-2 border-y border-line">
                <div className="max-w-[1280px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="max-w-[720px] mb-12">
                        <motion.div variants={FADE_UP} custom={0} className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-4">Кому подходит</motion.div>
                        <motion.h2 variants={FADE_UP} custom={1} className="text-[clamp(24px,4vw,40px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                            Верум создан для команд, которые ценят время
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SEGMENTS.map((seg, i) => {
                            const Icon = seg.icon;
                            return (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }} className="bg-surface border border-line rounded-2xl p-6">
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

            {/* 7. FINAL CTA */}
            <section className="py-16 md:py-24 bg-bg">
                <div className="max-w-[900px] mx-auto px-4 md:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, ease: EASE }} className="bg-surface border border-line rounded-2xl p-8 md:p-12 text-center">
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
                            onClick={handleCompany}
                            className="h-[52px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-colors inline-flex items-center justify-center gap-2"
                        >
                            Подключить компанию <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
