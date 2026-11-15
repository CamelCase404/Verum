import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight,
    ShieldCheck,
    FileText,
    Search,
    CheckCircle2,
    Brain,
    Eye,
    XCircle,
    Check,
    Terminal,
    Cpu,
    Fingerprint,
    Zap
} from "lucide-react";
import { useRef } from "react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, delay: i * 0.1, ease: EASE },
    }),
};

const METRICS = [
    "70% кандидатов отсеивается до созвона",
    "3 дня от вакансии до финалиста",
    "80% времени тимлида экономится",
    "100 баллов в шкале оценки",
    "5 осей проверки компетенций",
    "0 человеческого фактора при скрининге"
];

const STEPS = [
    {
        num: "01",
        title: "Создайте вакансию",
        desc: "Опишите стек и требования. Система сгенерирует уникальную ссылку для кандидатов.",
        icon: FileText,
    },
    {
        num: "02",
        title: "ИИ-интервью",
        desc: "12 вопросов с записью экрана, камерой и античитом. Кандидат не сможет списать.",
        icon: Terminal,
    },
    {
        num: "03",
        title: "Модерация",
        desc: "Модератор проверяет видео по тайм-кодам аномалий и подтверждает грейд.",
        icon: Eye,
    },
    {
        num: "04",
        title: "Шортлист",
        desc: "Получите профили с баллами, GitHub-статистикой и подтвержденным грейдом.",
        icon: CheckCircle2,
    },
];

const FEATURES = [
    {
        icon: Brain,
        title: "ИИ-судья на GigaChat",
        desc: "Анализирует архитектурное мышление, умение работать с ИИ-кодом и глубинное понимание стека.",
        colSpan: "md:col-span-2",
    },
    {
        icon: Fingerprint,
        title: "Античит 360",
        desc: "Камера, микрофон, блокировка DevTools и переключений вкладок.",
        colSpan: "md:col-span-1",
    },
    {
        icon: Cpu,
        title: "Матчинг по 7 осям",
        desc: "Стек, грейд, языки, зарплата, GitHub, балл теста, софт-скиллы.",
        colSpan: "md:col-span-1",
    },
    {
        icon: Zap,
        title: "Модерация по тайм-кодам",
        desc: "Модератор тратит время только на подозрительные секунды, а не на все видео.",
        colSpan: "md:col-span-2",
    },
];

const COMPARISON = [
    ["Резюме накручиваются", "Реальные метрики и код"],
    ["2–3 недели на скрининг", "3 дня до финалиста"],
    ["Тимлид на 20 созвонах", "Только финальные 2–3 встречи"],
    ["Вайбкодеры проходят", "Античит + ручная модерация"],
    ["Субъективное мнение", "100-балльная шкала"],
];

export function Landing() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

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
        <div className="w-full bg-bg overflow-hidden text-ink selection:bg-accent/30 relative font-sans">
            
            {/* Фоновая сетка и шум (убирают эффект "стерильного ИИ") */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(var(--ink) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />

            {/* ══════════ 1. HERO (Асимметричный) ══════════ */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 z-10" ref={containerRef}>
                <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        
                        {/* Левая часть - текст */}
                        <motion.div style={{ y, opacity }} className="lg:col-span-7 flex flex-col items-start text-left">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, ease: EASE }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-line text-[12px] font-medium text-ink-2 mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Платформа проверенных инженеров
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
                                className="font-display font-semibold tracking-[-0.03em] leading-[1.05] text-[clamp(36px,6vw,76px)] text-ink mb-6"
                            >
                                Не верьте резюме. <br />
                                Смотрите, как <span className="text-accent underline decoration-accent/30 decoration-4 underline-offset-8">думают</span>.
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
                                className="text-[16px] md:text-[20px] text-ink-2 leading-[1.5] max-w-[600px] mb-10"
                            >
                                Автоматический скрининг разработчиков через ИИ-интервью с античитом и записью экрана. Отдаем только тех, кто реально умеет писать код.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                            >
                                <button
                                    onClick={goCompany}
                                    className="group h-[56px] px-8 rounded-2xl bg-accent text-white font-medium text-[15px] hover:bg-accent-2 transition-all hover:-translate-y-1 shadow-xl shadow-accent/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Начать нанимать <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                                </button>
                                <button
                                    onClick={goDev}
                                    className="group h-[56px] px-8 rounded-2xl bg-surface border-2 border-line text-ink font-medium text-[15px] hover:border-ink/20 hover:bg-surface-2 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    Пройти тест <Terminal size={18} className="transition-transform group-hover:scale-110" />
                                </button>
                            </motion.div>
                        </motion.div>

                        {/* Правая часть - Интерактивный терминал/код */}
                        <motion.div 
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
                            className="lg:col-span-5 relative hidden lg:block"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-transparent blur-3xl opacity-50 rounded-full" />
                            
                            {/* Имитация окна редактора кода */}
                            <div className="relative bg-[#1E1E1E] rounded-2xl border border-[#333] shadow-2xl overflow-hidden animate-float">
                                <div className="flex items-center gap-2 px-4 py-3 bg-[#2D2D2D] border-b border-[#333]">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <span className="ml-4 text-[12px] font-mono text-gray-400">verum_interview.ts</span>
                                </div>
                                <div className="p-5 font-mono text-[13px] leading-loose text-gray-300">
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">1</span><span className="text-pink-400">const</span> <span className="text-blue-300">candidate</span> = <span className="text-pink-400">await</span> <span className="text-yellow-300">verum</span>.<span className="text-blue-300">interview</span>(&#123;</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">2</span>  <span className="text-gray-400">stack:</span> <span className="text-green-300">"Python/FastAPI"</span>,</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">3</span>  <span className="text-gray-400">level:</span> <span className="text-green-300">"Senior"</span>,</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">4</span>  <span className="text-gray-400">anticheat:</span> <span className="text-pink-400">true</span></div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">5</span>&#125;);</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">6</span></div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">7</span><span className="text-gray-500">// Результат: Grade "Senior", Score: 92/100</span></div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">8</span><span className="text-pink-400">if</span> (candidate.grade === <span className="text-green-300">"Senior"</span>) &#123;</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">9</span>  <span className="text-yellow-300">hire</span>(candidate);</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">10</span>&#125;</div>
                                    <div className="flex"><span className="text-gray-600 w-8 select-none">11</span><span className="w-2 h-4 bg-accent animate-blink ml-1" /></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ══════════ 2. MARQUEE (Бегущая строка с метриками) ══════════ */}
            <section className="py-4 border-y border-line bg-surface relative z-10 overflow-hidden flex">
                <div className="flex whitespace-nowrap animate-marquee">
                    {[...METRICS, ...METRICS].map((text, i) => (
                        <div key={i} className="flex items-center mx-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-6" />
                            <span className="text-[14px] font-medium text-ink-2 uppercase tracking-wider">{text}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════ 3. BENTO GRID (Асимметричный) ══════════ */}
            <section className="py-20 md:py-32 relative z-10">
                <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="mb-12 md:mb-20 max-w-[800px]">
                        <h2 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.02em] leading-[1.1] text-ink mb-4">
                            Четыре уровня защиты от фейковых сеньоров
                        </h2>
                        <p className="text-ink-3 text-[16px] md:text-[18px]">
                            Мы не просто задаем вопросы. Мы создаем среду, в которой невозможно списать или подсмотреть ответ.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-100px" }}
                                    variants={fadeUp}
                                    custom={i}
                                    className={`bg-surface border border-line rounded-3xl p-8 md:p-10 transition-all duration-300 hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/5 group ${f.colSpan}`}
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-line flex items-center justify-center text-ink mb-8 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                                        <Icon size={28} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-display text-[20px] md:text-[24px] font-medium text-ink mb-3">
                                        {f.title}
                                    </h3>
                                    <p className="text-[15px] md:text-[16px] text-ink-3 leading-relaxed max-w-[90%]">
                                        {f.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ 4. STEPS (Таймлайн) ══════════ */}
            <section className="py-20 md:py-32 bg-surface-2 border-y border-line relative z-10">
                <div className="max-w-[1700px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.02em] leading-[1.1] text-ink mb-4">
                            От вакансии до оффера
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative">
                        {/* Соединительная линия на десктопе */}
                        <div className="hidden md:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-line z-0" />
                        
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeUp}
                                    custom={i}
                                    className="relative z-10 flex flex-col items-center text-center group"
                                >
                                    <div className="w-24 h-24 rounded-full bg-surface border border-line flex items-center justify-center mb-6 shadow-xl group-hover:border-accent group-hover:scale-105 transition-all duration-300">
                                        <Icon size={32} className="text-ink-2 group-hover:text-accent transition-colors" strokeWidth={1.5} />
                                    </div>
                                    <span className="font-mono text-[12px] font-bold text-accent bg-accent/10 px-3 py-1 rounded-full mb-3">
                                        ШАГ {step.num}
                                    </span>
                                    <h3 className="font-display text-[18px] font-medium text-ink mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-[14px] text-ink-3 leading-relaxed max-w-[250px]">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══════════ 5. COMPARISON ══════════ */}
            <section className="py-20 md:py-32 relative z-10">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                        
                        <div>
                            <h2 className="font-display text-[clamp(28px,4vw,48px)] font-semibold tracking-[-0.02em] leading-[1.1] text-ink mb-6">
                                Почему старый найм <br />
                                <span className="text-ink-3">больше не работает</span>
                            </h2>
                            <p className="text-[16px] md:text-[18px] text-ink-2 leading-relaxed mb-8">
                                Вы тратите десятки часов тимлида на созвоны с кандидатами, которые идеально рассказывают теорию, но не могут написать простой цикл. Верум решает это до того, как вы включите Zoom.
                            </p>
                            <ul className="space-y-4">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-center gap-4 bg-surface p-4 rounded-xl border border-line">
                                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                                            <XCircle size={16} className="text-red-500" />
                                        </div>
                                        <span className="text-[15px] text-ink-3 line-through decoration-ink-4/50">{row[0]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-surface border-2 border-accent rounded-[32px] p-8 md:p-12 shadow-2xl shadow-accent/10 relative overflow-hidden">
                            <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/10 rounded-full blur-2xl pointer-events-none" />
                            
                            <h3 className="font-display text-[24px] md:text-[32px] font-medium text-ink mb-8 flex items-center gap-3">
                                <ShieldCheck size={32} className="text-accent" /> С Верум
                            </h3>
                            <ul className="space-y-5">
                                {COMPARISON.map((row, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check size={16} className="text-accent" strokeWidth={3} />
                                        </div>
                                        <span className="text-[16px] md:text-[18px] text-ink font-medium">{row[1]}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* ══════════ 6. FINAL CTA ══════════ */}
            <section className="py-24 md:py-40 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-accent" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#fff 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
                
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.h2
                            variants={fadeUp}
                            custom={0}
                            className="font-display text-[clamp(32px,6vw,72px)] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-6"
                        >
                            Хватит тратить время на пустые собеседования
                        </motion.h2>
                        <motion.p
                            variants={fadeUp}
                            custom={1}
                            className="text-[16px] md:text-[20px] text-white/80 leading-relaxed mb-10 max-w-[600px] mx-auto"
                        >
                            Подключите компанию и получите доступ к базе проверенных инженеров. Первый тест и открытие контакта — бесплатно.
                        </motion.p>
                        <motion.div
                            variants={fadeUp}
                            custom={2}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <button
                                onClick={goCompany}
                                className="group h-[60px] px-8 rounded-2xl bg-white text-accent font-semibold text-[16px] hover:bg-gray-100 transition-all hover:-translate-y-1 shadow-xl flex items-center justify-center gap-2"
                            >
                                Подключить компанию <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                            <button
                                onClick={goDev}
                                className="group h-[60px] px-8 rounded-2xl bg-transparent border-2 border-white/30 text-white font-semibold text-[16px] hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center gap-2"
                            >
                                Я разработчик <Terminal size={18} className="transition-transform group-hover:scale-110" />
                            </button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
