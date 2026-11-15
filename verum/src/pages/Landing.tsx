import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";
import {
    ArrowRight,
    ChevronRight,
    ShieldCheck,
    Search,
    CheckCircle2,
    Brain,
    Eye,
    XCircle,
    Check,
    Database,
    Terminal,
    Activity
} from "lucide-react";

const EASE = [0.16, 0.84, 0.44, 1] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.1, ease: EASE },
    }),
};

const METRICS = [
    { value: "70%", label: "кандидатов отсеивается на входе" },
    { value: "3 дня", label: "от публикации вакансии до финалиста" },
    { value: "80%", label: "времени тимлида экономится" },
    { value: "100", label: "баллов в объективной оценке" },
];

const STEPS = [
    {
        num: "01",
        title: "Вакансия",
        desc: "Укажите стек, грейд и вилку. Получите прямую ссылку на тест для кандидатов.",
    },
    {
        num: "02",
        title: "ИИ-интервью",
        desc: "12 вопросов, запись экрана и камеры, трекинг фокуса. Без участия человека.",
    },
    {
        num: "03",
        title: "Модерация",
        desc: "Модератор проверяет только помеченные античитом тайм-коды с аномалиями.",
    },
    {
        num: "04",
        title: "Шортлист",
        desc: "Готовые профили с объективным баллом, подтвержденным грейдом и контактами.",
    },
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
        <div className="w-full bg-[#f5f5f3] text-[#111] font-sans selection:bg-[#111] selection:text-white min-h-screen overflow-x-hidden">
            
            {/* Фоновая сетка (техно-стиль, убирает ощущение пустого шаблона) */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-24">
                
                {/* HERO SECTION (Асимметричный) */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center mb-32 pt-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: EASE }}
                        className="lg:col-span-7 flex flex-col items-start text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-black/10 rounded-full text-[12px] font-mono tracking-tight text-black/60 mb-6 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Система верификации v2.0
                        </div>
                        
                        <h1 className="font-heading font-extrabold text-[clamp(40px,6vw,80px)] leading-[0.95] tracking-tighter text-[#111] mb-6 uppercase">
                            Нанимайте тех,<br />
                            кто <span className="text-transparent" style={{ WebkitTextStroke: "2px #111" }}>реально</span><br />
                            пишет код.
                        </h1>
                        
                        <p className="text-[16px] md:text-[18px] text-black/60 max-w-[540px] leading-relaxed mb-10">
                            Автоматический скрининг инженеров через ИИ-интервью с жестким античитом. Проверяем хард-скиллы и отдаем только тех, кто умеет думать.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <button onClick={goCompany} className="h-[52px] px-8 rounded-none bg-[#111] text-white font-medium text-[15px] hover:bg-black transition-colors flex items-center justify-center gap-2 group">
                                Найти инженеров <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={goDev} className="h-[52px] px-8 rounded-none bg-transparent border border-[#111] text-[#111] font-medium text-[15px] hover:bg-black/5 transition-colors flex items-center justify-center gap-2 group">
                                Пройти тест <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.div>

                    {/* Правая часть Hero: Имитация интерфейса / терминала */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                        className="lg:col-span-5 relative hidden lg:block"
                    >
                        <div className="bg-white border border-black/10 rounded-xl shadow-2xl overflow-hidden">
                            <div className="bg-[#fafafa] border-b border-black/10 px-4 py-3 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="ml-2 text-[11px] font-mono text-black/40">verum / interview_log.txt</span>
                            </div>
                            <div className="p-5 font-mono text-[12px] leading-relaxed text-black/70">
                                <p className="text-green-600 mb-2">[INIT] Interview started for Middle Frontend</p>
                                <p className="mb-1"><span className="text-blue-600 font-bold">Q1:</span> Как работает Event Loop в JS?</p>
                                <p className="mb-3 text-black/50">A: Call stack, Web APIs, Task Queue, Microtasks...</p>
                                <p className="mb-1"><span className="text-blue-600 font-bold">Q2:</span> Найдите утечку памяти в коде...</p>
                                <p className="mb-3 text-black/50">A: Замыкание хранит ссылку на DOM-элемент...</p>
                                <p className="text-red-500 mb-1">[WARN] Focus lost for 800ms (Tab switching)</p>
                                <p className="mb-3 text-black/40">Action: Flagged for moderation</p>
                                <p className="text-green-600">[DONE] Score: 84/100 (Middle+)</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* METRICS (Широкая полоса) */}
                <section className="border-y border-black/10 py-12 mb-32 bg-white/50 backdrop-blur-sm">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {METRICS.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="flex flex-col border-l-2 border-[#111] pl-4"
                            >
                                <div className="text-[32px] md:text-[40px] font-heading font-bold text-[#111] leading-none mb-2">
                                    {m.value}
                                </div>
                                <div className="text-[13px] text-black/50 uppercase tracking-wide font-medium leading-tight">
                                    {m.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* STEPS (Как это работает - без скучных карточек) */}
                <section className="mb-32">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <h2 className="font-heading text-[clamp(32px,4vw,48px)] font-bold text-[#111] leading-none tracking-tight uppercase max-w-[600px]">
                            От вакансии до<br />оффера за 3 дня
                        </h2>
                        <p className="text-black/50 max-w-[300px] mt-4 md:mt-0 text-[14px]">
                            Полностью автоматизированный пайплайн. Вы только смотрите финальные результаты.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-black/10 bg-white">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                className={`p-8 flex flex-col justify-between min-h-[250px] ${i !== 3 ? 'border-b md:border-b-0 md:border-r border-black/10' : ''}`}
                            >
                                <div className="text-[14px] font-mono text-black/30 mb-8">{step.num}</div>
                                <div>
                                    <h3 className="text-[20px] font-heading font-bold text-[#111] mb-3 uppercase">
                                        {step.title}
                                    </h3>
                                    <p className="text-[13px] text-black/60 leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* COMPARISON (Строгое сравнение, без стандартных иконок) */}
                <section className="mb-32 max-w-[1200px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-[clamp(28px,3vw,40px)] font-bold text-[#111] uppercase tracking-tight">
                            Разница в подходе
                        </h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-black/10 bg-white">
                        {/* Левая колонка - Обычный найм */}
                        <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-black/10 bg-[#fafafa]">
                            <h3 className="text-[14px] font-mono uppercase tracking-widest text-black/40 mb-8">Традиционный HR</h3>
                            <ul className="space-y-6">
                                {[
                                    "Резюме накручиваются и содержат ложь",
                                    "2–3 недели на первичный скрининг",
                                    "Тимлид тратит 20+ часов на собеседования",
                                    "Субъективное мнение и предвзятость"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <XCircle size={18} className="text-black/30 shrink-0 mt-0.5" />
                                        <span className="text-[15px] text-black/60">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Правая колонка - Верум */}
                        <div className="p-8 md:p-12 bg-white">
                            <h3 className="text-[14px] font-mono uppercase tracking-widest text-[#111] mb-8 flex items-center gap-2">
                                <Activity size={16} /> Платформа Верум
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    "Метрики + запись экрана и веб-камеры",
                                    "3 дня до финального шортлиста",
                                    "Тимлид только на финальных встречах",
                                    "100-балльная шкала по 5 осям"
                                ].map((text, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <Check size={18} className="text-green-600 shrink-0 mt-0.5" />
                                        <span className="text-[15px] text-[#111] font-medium">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* FINAL CTA (Без градиентов, строгий блок) */}
                <section className="relative border border-black/10 bg-[#111] text-white p-10 md:p-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="max-w-[600px]">
                            <h2 className="font-heading text-[clamp(32px,4vw,56px)] font-bold leading-[0.95] uppercase mb-6">
                                Перестаньте тратить время на плохих кандидатов
                            </h2>
                            <p className="text-[16px] text-white/60">
                                Подключите компанию и получите доступ к базе верифицированных инженеров. Первый тест — бесплатно.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">
                            <button onClick={goCompany} className="h-[56px] px-10 bg-white text-[#111] font-medium text-[16px] hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                                Подключить компанию <ArrowRight size={18} />
                            </button>
                            <button onClick={goDev} className="h-[56px] px-10 bg-transparent border border-white/20 text-white font-medium text-[16px] hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                Я разработчик <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
