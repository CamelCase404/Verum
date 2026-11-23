import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight, ChevronRight, ShieldCheck, FileText, Search,
    CheckCircle2, Brain, Eye, XCircle, Check, Database,
    Clock, TrendingUp, Wallet, Users, Code2,
    Cloud, Gamepad2, BarChart3, Lock, Zap, Gauge, Target, Sparkles,
    MessageSquare, Star, Code, Layers, Terminal, ExternalLink,
    UserPlus, Coins, Timer, ClipboardCheck, UserCheck, Building2, User,
    Route, GitMerge, CircleDollarSign, Scale, Award, AlertCircle, Github, Banknote
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const scaleIn = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } }
};
const slideInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
};
const slideInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } }
};
const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
};

const viewportConfig = { once: true, amount: 0.1, margin: "0px 0px -100px 0px" };
const viewportSafe = { once: true, amount: 0.2, margin: "0px 0px -100px 0px" };

function SectionDivider({ icon: Icon }: { icon: any }) {
    return (
        <div className="relative py-12 md:py-16 flex items-center justify-center">
            <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center gap-6">
                <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }} 
                    whileInView={{ scaleX: 1, opacity: 1 }} 
                    viewport={{ once: true, margin: "-50px" }} 
                    transition={{ duration: 0.8, ease: EASE }} 
                    className="flex-1 h-px bg-gradient-to-r from-transparent via-line-2/70 to-line-2 origin-right" 
                />
                <motion.div 
                    initial={{ scale: 0, opacity: 0 }} 
                    whileInView={{ scale: 1, opacity: 1 }} 
                    viewport={{ once: true, margin: "-50px" }} 
                    transition={{ duration: 0.5, delay: 0.2, ease: EASE }} 
                    className="relative flex items-center justify-center shrink-0"
                >
                    <div className="absolute inset-0 w-12 h-12 rounded-full bg-accent/10 blur-[10px]" />
                    <div className="relative w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center text-accent shadow-sm">
                        <Icon size={20} />
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }} 
                    whileInView={{ scaleX: 1, opacity: 1 }} 
                    viewport={{ once: true, margin: "-50px" }} 
                    transition={{ duration: 0.8, ease: EASE }} 
                    className="flex-1 h-px bg-gradient-to-l from-transparent via-line-2/70 to-line-2 origin-left" 
                />
            </div>
        </div>
    );
}

function AccentTitle({ children }: { children: ReactNode }) {
    return (
        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">
            {children}
        </h2>
    );
}

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
    { icon: Sparkles, title: "Работа с ИИ (Prompting)", desc: "Умение формулировать промпты, задавать контекст и управлять ИИ-генерацией." },
    { icon: Layers, title: "Архитектура", desc: "Проектирование систем, выбор паттернов и обоснование trade-offs." },
    { icon: Code, title: "Понимание кода", desc: "Аудит AI-кода, поиск галлюцинаций и скрытых багов." },
    { icon: Target, title: "Adaptability", desc: "Скорость реакции на инциденты и работа под давлением." },
    { icon: MessageSquare, title: "Soft skills", desc: "Ясность изложения, умение объяснять сложное простыми словами." },
];

const MATCHING = [
    { icon: Layers, title: "Стек", desc: "Полное совпадение или пересечение по ключевым технологиям." },
    { icon: Award, title: "Грейд", desc: "Точное попадание или разница в одну ступень." },
    { icon: Code2, title: "Языки", desc: "Пересечение языков кандидата и требований вакансии." },
    { icon: Banknote, title: "Зарплата", desc: "Ожидания кандидата вписываются в вилку вакансии." },
    { icon: Github, title: "GitHub", desc: "Активность, звёзды репозиториев и реальный код." },
    { icon: Gauge, title: "Балл теста", desc: "Итоговый балл 0–100 по результатам ИИ-интервью." },
    { icon: Users, title: "Soft skills", desc: "Оценка коммуникабельности и умения работать в команде." },
];

const PRICING = [
    { name: "Start", price: "15 000 ₽", desc: "Для небольших команд и стартапов.", features: ["50 тестов в месяц", "5 000 токенов для доступа к базе", "Базовый античит-контроль", "Доступ к базе верифицированных"], featured: false },
    { name: "Pro", price: "30 000 ₽", desc: "Для растущих компаний с активным наймом.", features: ["200 тестов в месяц", "20 000 токенов", "Приоритетная поддержка", "Расширенная аналитика"], featured: true },
    { name: "Enterprise", price: "80 000 ₽", desc: "Для крупных компаний с большим потоком.", features: ["Безлимитные тесты", "Безлимит токенов", "Выделенный менеджер", "SLA и кастомные интеграции"], featured: false },
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

const TEST_STAGES = [
    { num: "01", title: "AI-Driven Prompting", desc: "Написание ТЗ для ИИ-копилота под Highload", time: "15 мин", icon: Brain },
    { num: "02", title: "Ревью ИИ-кода", desc: "Поиск скрытого бага в коде от нейросети", time: "10 мин", icon: Code },
    { num: "03", title: "Стресс-тест", desc: "Диагностика аварии по логам и отказ от плохого совета ИИ", time: "10 мин", icon: AlertCircle },
    { num: "04", title: "Reverse Engineering", desc: "Промпт для рефакторинга легаси-кода", time: "10 мин", icon: Code },
];

const TEST_RESULTS = [
    { icon: Gauge, title: "Итоговый балл 0–100", desc: "Сводная оценка по всем 5 этапам собеседования." },
    { icon: Star, title: "Грейд кандидата", desc: "Junior, Middle, Senior или Reject — по реальным ответам." },
    { icon: Layers, title: "Разбивка по компетенциям", desc: "5 осей: архитектура, код, работа с ИИ, adaptability, soft skills." },
    { icon: MessageSquare, title: "Резюме и рекомендация", desc: "Текст от ИИ-судьи: сильные стороны, пробелы, вердикт." },
    { icon: Eye, title: "Запись видео", desc: "Полное видео собеседования с записью экрана и камеры." },
    { icon: Clock, title: "Тайм-коды аномалий", desc: "Модератор видит только подозрительные секунды." },
];

const NAV_METHODS = [
    { badge: "Способ 1", title: "Интеграция для своих кандидатов", desc: "Уже нашли человека сами (на hh.ru, по рекомендациям)? Отправьте ему ссылку на тест — он пройдёт его заново под вашу вакансию.", icon: ExternalLink, featured: true, steps: ["Создаёте вакансию в ЛК Верума", "Получаете короткую ссылку /v/abc123", "Отправляете ссылку кандидату", "Кандидат проходит тест за 45–60 минут", "Составляется топ откликов на вакансию", "Открываете контакты только прошедших"] },
    { badge: "Способ 2", title: "Найм из базы Верум", desc: "Алгоритм сам подбирает кандидатов по вашим требованиям. Вы открываете контакты только тех, кто подошёл.", icon: UserPlus, featured: false, steps: ["Заполняете профиль компании в Веруме", "В поиске указываете стек, грейд, вилку", "Алгоритм подбирает по 7 осям матчинга", "Смотрите профили: балл, видео, компетенции", "Открываете контакты за токены", "Связываетесь с кандидатом напрямую"] },
];

const TOKEN_COSTS = [
    { grade: "Junior", tokens: "100 токенов" },
    { grade: "Middle", tokens: "200 токенов" },
    { grade: "Senior", tokens: "350 токенов" },
];

export function Landing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const [audience, setAudience] = useState<"company" | "developer">("company");

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
            {/* HERO (статичный текст, анимированы только орбы) */}
            <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 md:opacity-50 pointer-events-none -z-10" />
                <div className="absolute inset-0 pointer-events-none -z-10">
                    <motion.div animate={{ opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[900px] md:h-[900px] bg-accent rounded-full blur-[80px] md:blur-[140px]" />
                </div>
                <div className="max-w-[1000px] mx-auto px-6 text-center relative z-10 flex flex-col items-center">
                    <h1 className="font-heading font-extrabold text-[clamp(40px,6vw,76px)] leading-[1.1] tracking-tight text-ink mb-6 max-w-[900px]">
                        Нанимайте только <span className="text-accent">проверенных</span> разработчиков
                    </h1>
                    <p className="text-[17px] md:text-[21px] text-ink-2 font-medium leading-relaxed mb-10 max-w-[680px]">
                        Скрининг через ИИ-интервью с античитом и записью видео. Отсеиваем 70% кандидатов и экономим до 1.5 млн ₽ в год.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full mt-2">
                        <button onClick={goCompany} className="group h-[56px] px-10 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl shadow-accent/20 hover:-translate-y-0.5">
                            Нанять <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                        </button>
                        <button onClick={goDev} className="group text-ink-2 hover:text-ink font-medium text-[15px] transition-colors h-[56px] px-4 w-full sm:w-auto flex items-center justify-center relative">
                            Я разработчик
                            <span className="absolute bottom-[14px] left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] h-px bg-ink scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                        </button>
                    </div>
                </div>
            </section>

            {/* ROLE SELECTION */}
            <section className="py-16 md:py-20 relative">
                <div className="max-w-[1100px] mx-auto px-6">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent mb-3 font-heading">Кто вы?</div>
                        <h2 className="font-heading text-[clamp(28px,3.5vw,40px)] font-extrabold leading-tight text-ink mb-3">Выберите свою роль</h2>
                        <p className="text-[16.0px] md:text-[16px] text-ink-3 font-medium leading-relaxed">Мы покажем только то, что важно именно для вас.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <motion.div initial="hidden" whileInView="visible" viewport={viewportSafe} variants={slideInLeft}>
                            <button onClick={() => setAudience("company")} className={`w-full h-full group relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${audience === "company" ? "border-accent bg-surface shadow-xl shadow-accent/10" : "border-line bg-surface hover:border-accent/40"}`}>
                                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${audience === "company" ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}><Building2 size={26} /></div>
                                <h3 className="relative font-heading text-[22px] font-bold text-ink mb-2">Ищу разработчика</h3>
                                <p className="relative text-[15.0px] text-ink-3 font-medium leading-relaxed mb-4">Хочу быстро находить проверенных инженеров и экономить время на скрининге.</p>
                                <div className={`relative inline-flex items-center gap-2 text-[14.0px] font-bold font-heading ${audience === "company" ? "text-accent" : "text-ink-3"}`}>{audience === "company" ? "Выбрано" : "Выбрать"}<ArrowRight size={14} /></div>
                            </button>
                        </motion.div>
                        <motion.div initial="hidden" whileInView="visible" viewport={viewportSafe} variants={slideInRight}>
                            <button onClick={() => setAudience("developer")} className={`w-full h-full group relative text-left p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${audience === "developer" ? "border-accent bg-surface shadow-xl shadow-accent/10" : "border-line bg-surface hover:border-accent/40"}`}>
                                <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors ${audience === "developer" ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}><User size={26} /></div>
                                <h3 className="relative font-heading text-[22px] font-bold text-ink mb-2">Ищу работу</h3>
                                <p className="relative text-[15.0px] text-ink-3 font-medium leading-relaxed mb-4">Хочу попасть в базу проверенных инженеров и получать предложения напрямую.</p>
                                <div className={`relative inline-flex items-center gap-2 text-[14.0px] font-bold font-heading ${audience === "developer" ? "text-accent" : "text-ink-3"}`}>{audience === "developer" ? "Выбрано" : "Выбрать"}<ArrowRight size={14} /></div>
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                <motion.div key={audience} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    {audience === "company" ? (
                        <>
                            <SectionDivider icon={TrendingUp} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-14 max-w-2xl mx-auto"><AccentTitle>Результаты в деньгах и времени</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                                        {METRICS.map((m, i) => (
                                            <motion.div variants={fadeUp} key={i} className="text-center">
                                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4"><m.icon size={26} /></div>
                                                <div className="font-heading text-[36px] md:text-[44px] font-extrabold text-ink leading-none mb-2">{m.value}</div>
                                                <div className="text-[14.0px] md:text-[15.0px] font-semibold text-ink-3">{m.label}</div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={Scale} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1200px] mx-auto px-6">
                                    <div className="text-center mb-12"><AccentTitle>Верум vs Обычный найм</AccentTitle></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <motion.div initial="hidden" whileInView="visible" viewport={viewportSafe} variants={slideInLeft} className="bg-surface border border-line rounded-2xl p-6 md:p-8">
                                            <h3 className="font-heading text-[18px] font-bold text-ink-3 mb-6 pb-4 border-b border-line">Обычный найм</h3>
                                            <ul className="space-y-4">{COMPARISON.map((row, i) => (<li key={i} className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-ink-4/10 flex items-center justify-center shrink-0 mt-0.5"><XCircle size={14} className="text-ink-4" /></div><span className="text-[16.0px] text-ink-3 font-medium leading-relaxed">{row[0]}</span></li>))}</ul>
                                        </motion.div>
                                        <motion.div initial="hidden" whileInView="visible" viewport={viewportSafe} variants={slideInRight} className="bg-surface border-2 border-accent rounded-2xl p-6 md:p-8 relative overflow-hidden">
                                            <h3 className="font-heading text-[18px] font-bold text-accent mb-6 pb-4 border-b border-line flex items-center gap-2"><ShieldCheck size={20} /> С Верум</h3>
                                            <ul className="space-y-4">{COMPARISON.map((row, i) => (<li key={i} className="flex items-start gap-3"><div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5"><Check size={14} className="text-accent" /></div><span className="text-[15px] text-ink font-semibold leading-relaxed">{row[1]}</span></li>))}</ul>
                                        </motion.div>
                                    </div>
                                </div>
                            </section>

                            <SectionDivider icon={Route} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-16"><AccentTitle>От вакансии до финалиста — 4 шага</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                                        {STEPS.map((step, i) => (
                                            <motion.div variants={fadeUp} key={i} className="relative flex flex-col items-center text-center">
                                                <motion.div variants={scaleIn} className="relative mb-6">
                                                    <div className="w-20 h-20 rounded-full bg-surface border-2 border-line flex items-center justify-center relative z-10"><step.icon size={30} style={{ color: step.color }} /></div>
                                                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[12px] font-bold z-20">{step.num}</div>
                                                </motion.div>
                                                <h3 className="font-heading text-[17px] font-bold text-ink mb-2">{step.title}</h3>
                                                <p className="text-[14.5px] text-ink-3 leading-relaxed font-medium">{step.desc}</p>
                                                
                                                {/* Стрелочка между шагами */}
                                                {i < STEPS.length - 1 && (
                                                    <div className="hidden md:flex absolute top-[38px] -right-[24px] w-12 items-center z-0">
                                                        <div className="flex-1 h-[2px] bg-accent/30" />
                                                        <ChevronRight size={16} className="text-accent/50 -ml-1" />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={Target} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl"><AccentTitle>5 компетенций в 100-балльной шкале</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {COMPETENCIES.map((c, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-2xl p-5 hover:border-accent/40">
                                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><c.icon size={22} /></div>
                                                <h3 className="font-heading text-[15px] font-bold text-ink mb-2">{c.title}</h3>
                                                <p className="text-[14.0px] text-ink-3 leading-relaxed">{c.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={GitMerge} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl"><AccentTitle>Матчинг по 7 осям</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                                        {MATCHING.map((m, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-xl p-5 hover:border-accent/40">
                                                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-3"><m.icon size={20} /></div>
                                                <h3 className="font-heading text-[15px] font-bold text-ink mb-2">{m.title}</h3>
                                                <p className="text-[14.0px] text-ink-3 leading-relaxed">{m.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={CircleDollarSign} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-14"><AccentTitle>Прозрачные цены без скрытых платежей</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {PRICING.map((plan, i) => (
                                            <motion.div variants={fadeUp} key={i} className={`rounded-2xl p-8 flex flex-col relative ${plan.featured ? "bg-surface border-2 border-accent shadow-xl" : "bg-surface border border-line"}`}>
                                                {plan.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-wider z-10">Популярный</div>}
                                                <h3 className="font-heading text-[20px] font-bold text-ink mb-2">{plan.name}</h3>
                                                <p className="text-[14.0px] text-ink-3 font-medium mb-6">{plan.desc}</p>
                                                <div className="font-heading text-[36px] font-extrabold text-ink mb-6">{plan.price}<span className="text-[15.0px] text-ink-3 font-medium">/мес</span></div>
                                                <ul className="space-y-3 mb-8 flex-1">{plan.features.map((f, j) => (<li key={j} className="flex items-start gap-2.5"><Check size={16} className="text-accent shrink-0 mt-0.5" /><span className="text-[15.0px] text-ink-2 font-medium">{f}</span></li>))}</ul>
                                                <button onClick={goCompany} className={`h-[48px] rounded-xl font-heading font-bold text-[14px] transition-colors flex items-center justify-center gap-2 ${plan.featured ? "bg-accent text-white hover:bg-accent-2" : "bg-surface-2 border border-line text-ink hover:bg-surface-3"}`}>Подключить <ArrowRight size={16} /></button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={ExternalLink} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-14"><AccentTitle>Как нанимать через Верум</AccentTitle></div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        {NAV_METHODS.map((method, idx) => (
                                            <motion.div initial="hidden" whileInView="visible" viewport={viewportSafe} variants={idx === 0 ? slideInLeft : slideInRight} key={idx} className={`rounded-2xl p-8 relative overflow-hidden ${method.featured ? "bg-surface border-2 border-accent" : "bg-surface border border-line"}`}>
                                                <div className="flex items-center gap-3 mb-5"><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${method.featured ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}><method.icon size={22} /></div><div><div className={`text-[12.0px] font-bold uppercase ${method.featured ? "text-accent" : "text-ink-3"}`}>{method.badge}</div><h3 className="font-heading text-[20px] font-bold text-ink">{method.title}</h3></div></div>
                                                <p className="text-[15.5px] text-ink-2 mb-5">{method.desc}</p>
                                                <ol className="space-y-3">{method.steps.map((text, i) => (<li key={i} className="flex items-start gap-3"><span className={`w-6 h-6 rounded-full text-[13.0px] font-bold flex items-center justify-center shrink-0 ${method.featured ? "bg-accent text-white" : "bg-surface-2 text-ink-2"}`}>{i + 1}</span><span className="text-[15.0px] text-ink-2 font-medium">{text}</span></li>))}</ol>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeUp} className="bg-surface border border-line rounded-2xl p-8">
                                        <h3 className="font-heading text-[20px] font-bold text-ink mb-4">Стоимость открытия контактов</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {TOKEN_COSTS.map((item, i) => (<div key={i} className="bg-surface-2 border border-line rounded-xl p-5 text-center"><div className="text-[12px] text-accent mb-2">{item.grade}</div><div className="font-heading text-[24px] font-extrabold text-ink">{item.tokens}</div></div>))}
                                        </div>
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={ShieldCheck} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl"><AccentTitle>Технология, которая заменяет 20 часов собеседований</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {WHY_US.map((f, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-xl p-6">
                                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><f.icon size={22} /></div>
                                                <h3 className="font-heading text-[17px] font-bold text-ink mb-2">{f.title}</h3>
                                                <p className="text-[15.0px] text-ink-3 leading-relaxed font-medium">{f.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>
                        </>
                    ) : (
                        <>
                            <SectionDivider icon={Timer} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl"><AccentTitle>Что происходит за 45–60 минут</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
                                        {TEST_STAGES.map((s, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-2xl p-6 flex flex-col">
                                                <motion.div variants={scaleIn} className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-mono text-[14px] font-bold mb-5 shadow-lg shadow-accent/20">{s.num}</motion.div>
                                                <div className="flex items-center gap-2 mb-3"><s.icon size={16} className="text-accent" /><span className="text-[12px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">{s.time}</span></div>
                                                <h3 className="font-heading text-[15px] font-bold text-ink mb-2">{s.title}</h3>
                                                <p className="text-[14.0px] text-ink-3 mt-auto">{s.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeUp} className="mt-8 bg-surface border border-line rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0"><ShieldCheck size={24} /></div>
                                        <div><h3 className="font-heading text-[17px] font-bold text-ink mb-1">Античит работает всё время</h3><p className="text-[15.0px] text-ink-3">Камера и микрофон записываются, детектируется переключение вкладок, блокируются DevTools и копирование.</p></div>
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={ClipboardCheck} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="text-center mb-12"><AccentTitle>Что вы получаете после теста</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                                        {TEST_RESULTS.map((f, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-xl p-6">
                                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><f.icon size={22} /></div>
                                                <h3 className="font-heading text-[17px] font-bold text-ink mb-2">{f.title}</h3>
                                                <p className="text-[15.0px] text-ink-3 leading-relaxed">{f.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={Target} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1400px] mx-auto px-6">
                                    <div className="mb-12 max-w-2xl"><AccentTitle>5 компетенций в 100-балльной шкале</AccentTitle></div>
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                        {COMPETENCIES.map((c, i) => (
                                            <motion.div variants={fadeUp} key={i} className="bg-surface border border-line rounded-2xl p-5 hover:border-accent/40">
                                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-4"><c.icon size={22} /></div>
                                                <h3 className="font-heading text-[15px] font-bold text-ink mb-2">{c.title}</h3>
                                                <p className="text-[14.0px] text-ink-3 leading-relaxed">{c.desc}</p>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            </section>

                            <SectionDivider icon={UserCheck} />
                            <section className="py-16 md:py-20 bg-bg">
                                <div className="max-w-[1200px] mx-auto px-6">
                                    <motion.div initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeUp} className="bg-surface border-2 border-accent rounded-3xl p-8 md:p-12 relative overflow-hidden">
                                        <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
                                            <div><h2 className="font-heading text-[clamp(32px,4vw,48px)] font-extrabold leading-tight text-ink mb-4">Хотите в базу проверенных инженеров?</h2><button onClick={goDev} className="h-[52px] px-7 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">Пройти тест <ArrowRight size={18} /></button></div>
                                            <div className="space-y-3">{["Бесплатное прохождение теста", "Верифицированный профиль в базе", "Прямые контакты с компаниями", "Никаких резюме и самопрезентаций", "Тест всего за 45–60 минут"].map((item, i) => (<div key={i} className="flex items-start gap-3 bg-surface-2 border border-line rounded-xl p-4"><Check size={14} className="text-accent shrink-0 mt-0.5" /><span className="text-[15.5px] text-ink-2 font-semibold">{item}</span></div>))}</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        </>
                    )}
                </motion.div>
            </AnimatePresence>

            <SectionDivider icon={Sparkles} />
            <motion.section initial="hidden" whileInView="visible" viewport={viewportConfig} variants={fadeUp} className="py-20 md:py-28 bg-bg">
                <div className="max-w-[900px] mx-auto px-6 text-center">
                    <h2 className="font-heading text-[clamp(36px,5vw,60px)] font-extrabold leading-[1.1] text-ink mb-6">
                        {audience === "company" ? "Перестаньте тратить часы на собеседования" : "Получите верифицированный профиль за 45 минут"}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {audience === "company" ? (
                            <><button onClick={goCompany} className="h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">Подключить компанию <ArrowRight size={18} /></button><button onClick={() => setAudience("developer")} className="h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">Я разработчик <ChevronRight size={18} /></button></>
                        ) : (
                            <><button onClick={goDev} className="h-[56px] px-8 rounded-xl bg-accent text-white font-heading font-bold text-[15px] hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">Пройти тест <ArrowRight size={18} /></button><button onClick={() => setAudience("company")} className="h-[56px] px-8 rounded-xl bg-surface border border-line text-ink font-heading font-bold text-[15px] hover:bg-surface-2 transition-colors flex items-center justify-center gap-2">Я компания <ChevronRight size={18} /></button></>
                        )}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
