import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, Clock, Target, Users,
    Building2, Briefcase, FileText, Search, CheckCircle2, Brain,
    Eye, XCircle, Check, Sparkles
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { duration: 0.8, delay: i * 0.1, ease: EASE }
    })
};

/* ═══════ DATA ═══════ */

const METRICS = [
    { value: "70%", label: "Кандидатов отсеивается автоматически" },
    { value: "3 дня", label: "От вакансии до готового шортлиста" },
    { value: "80%", label: "Экономии времени тимлида на скрининге" },
    { value: "100", label: "Балльная шкала объективной оценки" },
];

const STEPS = [
    { num: "01", title: "Создайте вакансию", desc: "Укажите стек, грейд и вилку. Настройте фильтры под ваши задачи. Получите ссылку для кандидатов.", icon: FileText },
    { num: "02", title: "Кандидаты проходят ИИ-интервью", desc: "12 вопросов с записью экрана и античитом. Блокировка F12, копирования и переключения вкладок.", icon: Search },
    { num: "03", title: "Модератор проверяет видео", desc: "Ручная валидация по тайм-кодам аномалий. Списывающих — в бан, честных — в базу.", icon: Eye },
    { num: "04", title: "Смотрите только чистых", desc: "Готовые профили с баллами и подтверждённым грейдом. Открываете контакты и пишете напрямую.", icon: CheckCircle2 },
];

const PROBLEMS = [
    { value: "78%", text: "разработчиков считают, что стандартные тесты не отражают реальную работу" },
    { value: "40%", text: "кандидатов с сильным резюме не решают базовую задачу без ChatGPT" },
    { value: "2–3 нед.", text: "средний срок закрытия одной IT-вакансии с ручным скринингом" },
    { value: "20+ ч", text: "ежемесячно тратит тимлид на технические собеседования" },
];

const FEATURES = [
    { icon: Brain, title: "ИИ-судья на GigaChat", desc: "Проверяет архитектурное мышление, работу с ИИ-кодом и способность держать нагрузку.", colSpan: "md:col-span-2" },
    { icon: ShieldCheck, title: "Античит", desc: "Камера, микрофон, блокировка DevTools и детекция потери фокуса окна.", colSpan: "md:col-span-1" },
    { icon: Target, title: "Матчинг по 7 осям", desc: "Стек, грейд, языки, зарплата, GitHub-статистика, балл теста и совпадение с вакансией.", colSpan: "md:col-span-1" },
    { icon: Eye, title: "Модерация по тайм-кодам", desc: "Модератор видит только подозрительные секунды — не смотрит 40 минут видео целиком.", colSpan: "md:col-span-2" },
];

const SEGMENTS = [
    { icon: Building2, who: "Стартапам 10–50", problem: "Нет HR, тимлид завален собеседованиями", solution: "Автоматический скрининг без ручного участия." },
    { icon: Briefcase, who: "Продуктовым командам 50–200", problem: "Пики найма и долгие циклы отбора", solution: "Отсеиваем 70% на входе. Остаются только сильные." },
    { icon: Users, who: "IT-агентствам", problem: "Клиенты недовольны качеством кандидатов", solution: "Передаёте только проверенных инженеров с отчётом." },
];

const COMPARISON = [
    ["Резюме накручиваются", "Метрики + запись теста"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 собеседованиях", "Только финальные 2–3 встречи"],
    ["Вайбкодеры проходят фильтр", "Античит + ручная модерация"],
    ["Субъективное мнение интервьюера", "100-балльная шкала по 5 осям"],
];

/* ═══════ COMPONENTS ═══════ */

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
            
            {/* ══════════ 1. HERO ══════════ */}
            <section className="relative pt-20 pb-24 md:pt-32 md:pb-40 flex items-center justify-center min-h-[80vh]">
                {/* Тонкое свечение на фоне (современный motion design) */}
                <motion.div 
                    animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-accent rounded-full blur-[120px] pointer-events-none -z-10"
                />

                <div className="max-w-[1120px] mx-auto px-4 md:px-8 text-center relative z-10">
                    

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
                        className="font-semibold tracking-[-0.05em] leading-[1.05] text-[clamp(42px,7vw,88px)] text-ink mb-6 max-w-[900px] mx-auto"
                    >
                        Нанимайте тех,<br />
                        кто <span className="text-accent">реально</span> пишет код
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                        className="text-[18px] md:text-[20px] text-ink-2 leading-[1.6] max-w-[640px] mx-auto mb-10"
                    >
                        Автоматический скрининг инженеров через ИИ-интервью с античитом. Мы проверяем хард-скиллы вручную и отдаём только тех, кто умеет думать.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        <button
                            onClick={goCompany}
                            className="h-[56px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Нанять <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={goDev}
                            className="h-[56px] px-6 text-ink-2 font-medium text-[15px] hover:text-ink transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto"
                        >
                            Я разработчик <ChevronRight size={16} className="text-ink-4" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-[13px] text-ink-3 font-medium"
                    >
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Первый тест бесплатно</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Ручная модерация</div>
                        <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-accent" /> Экономия 20+ часов</div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════ 2. METRICS (Horizontal Strip) ══════════ */}
            <section className="border-y border-line bg-surface/50 backdrop-blur-sm">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8 py-10 md:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {METRICS.map((m, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                                <div className="text-[40px] md:text-[56px] font-semibold text-ink leading-none tracking-[-0.04em] mb-2 tabular-nums">
                                    {m.value}
                                </div>
                                <div className="text-[13px] md:text-[14px] text-ink-3 leading-snug max-w-[180px]">
                                    {m.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ 3. PROBLEM (Grid) ══════════ */}
            <section className="py-24 md:py-32">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 md:mb-20 text-center max-w-[800px] mx-auto">
                        <motion.div variants={fadeUp} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-warn mb-4">Проблема</motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink mb-4">
                            IT-рынок тонет в кандидатах, <br /> которые не умеют писать код
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {PROBLEMS.map((p, i) => (
                            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="flex flex-col">
                                <div className="text-[40px] md:text-[48px] font-semibold text-warn leading-none tracking-[-0.03em] mb-4 tabular-nums">
                                    {p.value}
                                </div>
                                <div className="text-[13px] md:text-[14px] text-ink-3 leading-relaxed">
                                    {p.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════ 4. HOW IT WORKS (Vertical Timeline) ══════════ */}
            <section className="py-24 md:py-32 bg-surface-2/30 border-y border-line">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 md:mb-20 text-center max-w-[800px] mx-auto">
                        <motion.div variants={fadeUp} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent mb-4">Процесс</motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                            От вакансии до финалиста за 3 дня
                        </motion.h2>
                    </motion.div>

                    <div className="max-w-[800px] mx-auto relative">
                        {/* Вертикальная линия */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-line hidden md:block" />
                        
                        <div className="space-y-12">
                            {STEPS.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="relative flex flex-col md:flex-row gap-6 md:gap-10">
                                        <div className="hidden md:flex w-14 h-14 rounded-full bg-surface border-2 border-line items-center justify-center text-accent shrink-0 relative z-10">
                                            <Icon size={22} />
                                        </div>
                                        <div className="bg-surface border border-line rounded-2xl p-6 md:p-8 flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-[13px] font-bold text-accent tabular-nums">{step.num}</span>
                                                <h3 className="text-[18px] md:text-[20px] font-semibold text-ink">{step.title}</h3>
                                            </div>
                                            <p className="text-[14.5px] md:text-[15px] text-ink-3 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════ 5. FEATURES (Bento Grid) ══════════ */}
            <section className="py-24 md:py-32">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16">
                        <motion.div variants={fadeUp} custom={0} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent mb-4">Технология</motion.div>
                        <motion.h2 variants={fadeUp} custom={1} className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink max-w-[600px]">
                            Четыре уровня защиты от нечестного найма
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className={`bg-surface border border-line rounded-2xl p-6 md:p-8 ${f.colSpan}`}>
                                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-line flex items-center justify-center text-accent mb-6">
                                        <Icon size={22} />
                                    </div>
                                    <h3 className="text-[18px] md:text-[20px] font-semibold text-ink mb-2">{f.title}</h3>
                                    <p className="text-[14px] md:text-[15px] text-ink-3 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ 6. COMPARISON (Split View) ══════════ */}
            <section className="py-24 md:py-32 bg-surface-2/30 border-y border-line">
                <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                            Верум vs Обычный найм
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Обычный найм */}
                        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-surface border border-line rounded-2xl p-6 md:p-8 opacity-70">
                            <h3 className="text-[18px] font-semibold text-ink-3 mb-6 pb-4 border-b border-line">Обычный найм</h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <XCircle size={18} className="text-ink-4 shrink-0 mt-0.5" />
                                        <span className="text-[14px] text-ink-3">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* С Верум */}
                        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-surface border-2 border-accent rounded-2xl p-6 md:p-8 shadow-lg shadow-accent/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
                            <h3 className="text-[18px] font-semibold text-accent mb-6 pb-4 border-b border-line flex items-center gap-2">
                                <ShieldCheck size={20} /> С Верум
                            </h3>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-accent shrink-0 mt-0.5" />
                                        <span className="text-[14px] text-ink font-medium">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════ 7. SEGMENTS ══════════ */}
            <section className="py-24 md:py-32">
                <div className="max-w-[1120px] mx-auto px-4 md:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12 md:mb-16 text-center">
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(32px,5vw,48px)] font-semibold tracking-[-0.03em] leading-[1.1] text-ink">
                            Для команд, которые устали нанимать наугад
                        </motion.h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SEGMENTS.map((seg, i) => {
                            const Icon = seg.icon;
                            return (
                                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-surface border border-line rounded-2xl p-6 md:p-8 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                                            <Icon size={20} />
                                        </div>
                                        <div className="text-[15px] font-semibold text-ink">{seg.who}</div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-warn mb-1">Проблема</div>
                                            <p className="text-[13px] text-ink-3 leading-relaxed">{seg.problem}</p>
                                        </div>
                                        <div className="pt-4 border-t border-line">
                                            <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent mb-1">Решение</div>
                                            <p className="text-[13px] text-ink font-medium leading-relaxed">{seg.solution}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ 8. FINAL CTA ══════════ */}
            <section className="py-24 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 pointer-events-none" />
                <div className="max-w-[800px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <motion.h2 variants={fadeUp} custom={0} className="text-[clamp(36px,6vw,64px)] font-semibold tracking-[-0.04em] leading-[1.05] text-ink mb-6">
                            Перестаньте тратить <br /> часы на собеседования
                        </motion.h2>
                        <motion.p variants={fadeUp} custom={1} className="text-[16px] md:text-[18px] text-ink-2 leading-relaxed mb-10 max-w-[520px] mx-auto">
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div variants={fadeUp} custom={2} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={goCompany}
                                className="h-[56px] px-8 rounded-xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-0.5 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
                            >
                                Подключить компанию <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={goDev}
                                className="h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-medium text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2"
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
