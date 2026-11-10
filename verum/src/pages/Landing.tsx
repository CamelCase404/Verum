import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, Clock, Target, Users,
    Building2, Briefcase, FileText, Search, CheckCircle2, Brain,
    Eye, XCircle, Check
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const REVEAL = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.8, delay: i * 0.12, ease: EASE }
    })
};

/* ═══════ DATA ═══════ */

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается автоматически" },
    { value: "3 дня", label: "От вакансии до готового шортлиста" },
    { value: "20ч", label: "Экономии времени тимлида в месяц" },
    { value: "5", label: "Компетенций оценивается по 100-балльной шкале" },
];

const STAGES = [
    {
        num: "01",
        title: "Создайте вакансию",
        desc: "Заполните стек, грейд и вилку. Получите персональную ссылку на тест под эту роль — её можно вставить в описание на hh.ru или отправить напрямую.",
        tag: "Профиль компании",
    },
    {
        num: "02",
        title: "Кандидаты проходят ИИ-интервью",
        desc: "12 вопросов: 8 общих по стеку, 2 code review и 2 стресс-теста. Запись экрана и камеры включена. Античит блокирует F12, копирование и переключение вкладок.",
        tag: "20–40 минут на кандидата",
    },
    {
        num: "03",
        title: "Модератор проверяет видео",
        desc: "Ручная валидация по тайм-кодам аномалий: подозрительные повороты головы, шум, странный паттерн ввода. Списывающих — в бан, честных — в базу.",
        tag: "1–2 дня",
    },
    {
        num: "04",
        title: "Вы видите только чистых",
        desc: "В дашборде — готовые профили с баллами, вердиктом ИИ и подтверждённым грейдом. Открываете контакты за токены, пишете напрямую.",
        tag: "Финальный отбор",
    },
];

const PROBLEMS = [
    { value: "78%", text: "разработчиков считают, что стандартные тесты не отражают реальную работу" },
    { value: "40%", text: "кандидатов с сильным резюме не решают базовую задачу без ChatGPT" },
    { value: "2–3 нед.", text: "средний срок закрытия одной IT-вакансии с ручным скринингом" },
    { value: "20+ ч", text: "ежемесячно тратит тимлид на технические собеседования" },
];

const CAPABILITIES = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Проверяет архитектурное мышление, работу с ИИ-кодом и способность держать нагрузку." },
    { icon: ShieldCheck, title: "Античит с записью", desc: "Камера, микрофон, блокировка DevTools и детекция потери фокуса окна." },
    { icon: Eye, title: "Модерация по тайм-кодам", desc: "Модератор видит только подозрительные секунды — не смотрит 40 минут видео целиком." },
    { icon: Target, title: "Матчинг по 7 осям", desc: "Стек, грейд, языки, зарплата, GitHub-статистика, балл теста и совпадение с вакансией." },
];

const SEGMENTS = [
    {
        icon: Building2,
        who: "Стартапам 10–50",
        problem: "Нет HR, тимлид завален собеседованиями",
        solution: "Автоматический скрининг без ручного участия. Тимлид подключается только на финале.",
    },
    {
        icon: Briefcase,
        who: "Продуктовым командам 50–200",
        problem: "Пики найма и долгие циклы отбора",
        solution: "Отсеиваем 70% на входе. Остаются только те, кто реально умеет писать код.",
    },
    {
        icon: Users,
        who: "IT-агентствам",
        problem: "Клиенты недовольны качеством кандидатов",
        solution: "Передаёте клиенту только проверенных инженеров с объективным отчётом.",
    },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные 2–3 встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + ручная модерация"],
    ["Субъективное мнение интервьюера", "100-балльная шкала по 5 осям"],
];

/* ═══════ SECTIONS ═══════ */

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
        <div className="w-full bg-bg overflow-hidden">

            {/* ══════════ HERO ══════════ */}
            <section className="pt-16 md:pt-28 pb-20 md:pb-32 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-8 md:mb-12"
                    >
                        <span className="w-6 h-px bg-accent" />
                        B2B-скрининг IT-кадров
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                        className="font-semibold tracking-[-0.05em] leading-[0.95] text-[clamp(40px,8vw,96px)] text-ink mb-8 md:mb-12 max-w-[900px]"
                    >
                        Нанимайте тех,<br />
                        кто <span className="text-accent">реально</span> пишет код
                    </motion.h1>

                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10 lg:gap-16 items-end">
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                            className="text-[18px] md:text-[20px] text-ink-2 leading-[1.5] max-w-[560px]"
                        >
                            Автоматический скрининг инженеров через ИИ-интервью с античитом. Мы проверяем хард-скиллы вручную и отдаём только тех, кто действительно умеет думать — без вайбкодеров и фейковых резюме.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
                            className="flex flex-col gap-3"
                        >
                            <button
                                onClick={goCompany}
                                className="h-[56px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-between group"
                            >
                                <span>Подключить компанию</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={goDev}
                                className="h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-between group"
                            >
                                <span>Я разработчик</span>
                                <ChevronRight size={18} className="text-ink-3 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════ METRICS ══════════ */}
            <section className="py-16 md:py-20 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={REVEAL}
                                custom={i}
                            >
                                <div className="text-[40px] md:text-[64px] font-semibold text-ink leading-none tracking-[-0.03em] mb-3 tabular-nums">
                                    {m.value}
                                </div>
                                <div className="text-[13px] md:text-[14px] text-ink-3 leading-snug max-w-[200px]">
                                    {m.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ STAGES (Editorial list) ══════════ */}
            <section className="py-20 md:py-32 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mb-16 md:mb-24"
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6 flex items-center gap-3">
                            <span className="w-6 h-px bg-accent" /> Как это работает
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,5.5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink max-w-[800px]">
                            Полный цикл скрининга <br />
                            <span className="text-ink-3">без вашего участия</span>
                        </motion.h2>
                    </motion.div>

                    <div className="border-t border-line">
                        {STAGES.map((stage, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={REVEAL}
                                custom={i}
                                className="grid grid-cols-1 md:grid-cols-[80px_1fr_240px] gap-6 md:gap-10 py-8 md:py-12 border-b border-line group"
                            >
                                <div className="text-[32px] md:text-[48px] font-semibold text-ink-4 tabular-nums leading-none">
                                    {stage.num}
                                </div>
                                <div>
                                    <h3 className="text-[20px] md:text-[26px] font-semibold text-ink mb-2 md:mb-3 tracking-[-0.02em] group-hover:text-accent transition-colors">
                                        {stage.title}
                                    </h3>
                                    <p className="text-[14px] md:text-[15.5px] text-ink-2 leading-relaxed max-w-[560px]">
                                        {stage.desc}
                                    </p>
                                </div>
                                <div className="md:text-right">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-line text-[11px] font-medium text-ink-3">
                                        {stage.tag}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ PROBLEMS ══════════ */}
            <section className="py-20 md:py-32 bg-surface-2 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mb-16 md:mb-20"
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6 flex items-center gap-3">
                            <span className="w-6 h-px bg-warn" /> Проблема
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,5.5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink max-w-[800px]">
                            IT-рынок тонет в кандидатах, <br />
                            <span className="text-ink-3">которые не умеют писать код</span>
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line rounded-xl overflow-hidden">
                        {PROBLEMS.map((p, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={REVEAL}
                                custom={i}
                                className="bg-surface p-6 md:p-8"
                            >
                                <div className="text-[36px] md:text-[52px] font-semibold text-warn leading-none tracking-[-0.03em] mb-3 tabular-nums">
                                    {p.value}
                                </div>
                                <div className="text-[13px] md:text-[15px] text-ink-2 leading-relaxed">
                                    {p.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ CAPABILITIES ══════════ */}
            <section className="py-20 md:py-32 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mb-16 md:mb-20"
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6 flex items-center gap-3">
                            <span className="w-6 h-px bg-accent" /> Технология
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,5.5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink max-w-[800px]">
                            Четыре уровня защиты <br />
                            <span className="text-ink-3">от нечестного найма</span>
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {CAPABILITIES.map((cap, i) => {
                            const Icon = cap.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-60px" }}
                                    variants={REVEAL}
                                    custom={i}
                                    className="flex gap-5 py-6 md:py-8 border-t border-line"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-accent shrink-0">
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] md:text-[18px] font-semibold text-ink mb-2">
                                            {cap.title}
                                        </h3>
                                        <p className="text-[13.5px] md:text-[14.5px] text-ink-3 leading-relaxed">
                                            {cap.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ COMPARISON ══════════ */}
            <section className="py-20 md:py-32 bg-surface-2 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mb-16 md:mb-20"
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6 flex items-center gap-3">
                            <span className="w-6 h-px bg-accent" /> Сравнение
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,5.5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink max-w-[800px]">
                            Обычный найм vs Верум
                        </motion.h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, ease: EASE }}
                        className="bg-surface border border-line rounded-xl overflow-hidden"
                    >
                        <div className="grid grid-cols-2 border-b border-line">
                            <div className="px-5 md:px-8 py-5 text-[11px] md:text-[12px] font-semibold text-ink-3 uppercase tracking-[0.1em]">
                                Обычный найм
                            </div>
                            <div className="px-5 md:px-8 py-5 text-[11px] md:text-[12px] font-semibold text-accent uppercase tracking-[0.1em] border-l border-line flex items-center gap-2">
                                <ShieldCheck size={14} /> С Верум
                            </div>
                        </div>
                        {COMPARISON.map(([oldText, newText], i) => (
                            <div key={i} className="grid grid-cols-2 border-b border-line last:border-b-0">
                                <div className="px-5 md:px-8 py-5 flex items-start gap-3">
                                    <XCircle size={16} className="text-ink-4 shrink-0 mt-0.5" />
                                    <span className="text-[13px] md:text-[14.5px] text-ink-3 leading-relaxed">{oldText}</span>
                                </div>
                                <div className="px-5 md:px-8 py-5 flex items-start gap-3 border-l border-line">
                                    <Check size={16} className="text-accent shrink-0 mt-0.5" />
                                    <span className="text-[13px] md:text-[14.5px] text-ink font-medium leading-relaxed">{newText}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ══════════ SEGMENTS ══════════ */}
            <section className="py-20 md:py-32 border-b border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        className="mb-16 md:mb-20"
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6 flex items-center gap-3">
                            <span className="w-6 h-px bg-accent" /> Кому подходит
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,5.5vw,56px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink max-w-[800px]">
                            Для команд, которые <br />
                            <span className="text-ink-3">устали нанимать наугад</span>
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SEGMENTS.map((seg, i) => {
                            const Icon = seg.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-60px" }}
                                    variants={REVEAL}
                                    custom={i}
                                    className="bg-surface border border-line rounded-xl p-6 md:p-8"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-[15px] font-semibold text-ink">{seg.who}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-warn mb-1.5">Проблема</div>
                                            <p className="text-[13px] text-ink-3 leading-relaxed">{seg.problem}</p>
                                        </div>
                                        <div className="pt-4 border-t border-line">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent mb-1.5">Решение</div>
                                            <p className="text-[13px] text-ink-2 leading-relaxed">{seg.solution}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ FINAL CTA ══════════ */}
            <section className="py-20 md:py-32">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        <motion.div variants={REVEAL} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-6">
                            Начните сейчас
                        </motion.div>
                        <motion.h2 variants={REVEAL} custom={1} className="text-[clamp(32px,6vw,64px)] font-semibold tracking-[-0.04em] leading-[1.02] text-ink mb-6">
                            Перестаньте тратить <br />
                            <span className="text-accent">часы на собеседования</span>
                        </motion.h2>
                        <motion.p variants={REVEAL} custom={2} className="text-[16px] md:text-[17px] text-ink-2 leading-relaxed mb-10 max-w-[560px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={REVEAL} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={goCompany}
                                className="h-[54px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 shadow-sm flex items-center justify-center gap-2"
                            >
                                Подключить компанию <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={goDev}
                                className="h-[54px] px-8 rounded-xl bg-surface border border-line text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
                            >
                                Я разработчик <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
}
