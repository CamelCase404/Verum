import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreRow } from "@/components/ui/ScoreRow";
import { Chip } from "@/components/ui/Chip";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Code, Terminal, Cpu, Clock } from "lucide-react";
import { Particles } from "@/components/ui/Particles";
import { MOCK_SPECIALISTS } from "@/data/specialists";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

const EASE = [0.16, 0.84, 0.44, 1] as const;

export function Hero() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleStartInterview = () => {
        if (!user) {
            toast("Войдите или зарегистрируйтесь как разработчик");
            navigate("/register");
        } else if (user.role === "developer") {
            navigate("/dashboard");
        } else {
            toast("❌ Собеседование доступно только для разработчиков");
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % MOCK_SPECIALISTS.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const spec = MOCK_SPECIALISTS[currentIndex];
    const levelText =
        spec.level === "mid"
            ? "Middle"
            : spec.level === "senior"
              ? "Senior"
              : "Junior";

    return (
        <section className="pt-8 md:pt-24 pb-8 md:pb-20 relative overflow-hidden">
            <Particles />

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    rotate: [0, 45, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute -top-40 -right-40 w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-accent-soft/50 blur-[100px] md:blur-[120px] pointer-events-none -z-10"
            />

            <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_460px] gap-4 md:gap-12 lg:gap-[72px] items-center">
                    <div className="text-center lg:text-left px-2 md:px-0">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: 0.1,
                                ease: EASE,
                            }}
                            className="flex flex-wrap justify-center lg:justify-start items-center gap-2 mb-4 md:mb-8"
                        >
                            <div className="inline-flex items-center gap-1.5 bg-accent text-white shadow-md shadow-black/20 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-[12.5px] font-medium tracking-wide">
                                <Clock
                                    size={12}
                                    className="md:w-3.5 md:h-3.5"
                                />{" "}
                                Подбор за 24 часа
                            </div>
                            <div className="inline-flex items-center gap-1.5 bg-surface-2 border border-line text-ink-2 rounded-lg px-2.5 py-1 md:px-3 md:py-1.5 text-[10px] md:text-[12.5px] font-medium tracking-wide">
                                <ShieldCheck
                                    size={12}
                                    className="md:w-3.5 md:h-3.5 text-accent"
                                />{" "}
                                Реальные навыки
                            </div>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.9,
                                delay: 0.2,
                                ease: EASE,
                            }}
                            className="font-semibold tracking-[-0.042em] leading-[1.04] text-[clamp(26px,6vw,64px)] relative"
                        >
                            Платформа <br className="hidden sm:block" />
                            <span className="text-accent">проверенных</span>
                            <br /> IT-специалистов
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-3 md:mt-6 text-[13px] md:text-[18px] text-ink-2 max-w-[500px] mx-auto lg:mx-0 leading-relaxed"
                        >
                            Мы не проверяем резюме на словах. Наш алгоритм
                            тестирует архитектурное мышление и способность
                            находить ошибки в коде, сгенерированном ИИ.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                            className="mt-6 md:mt-8 flex flex-col items-center lg:items-start gap-2.5"
                        >
                            <button
                                onClick={handleStartInterview}
                                className="h-[46px] md:h-[50px] px-6 md:px-8 rounded-xl bg-accent text-white font-medium text-[14px] md:text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                            >
                                Пройти собеседование
                            </button>
                            
                        </motion.div>
                    </div>

                    {/* Внешний контейнер для стартовой анимации (выезд справа + прозрачность) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                        className="relative min-w-0 max-w-full mx-auto w-full lg:w-auto mt-8 lg:mt-0 px-2 md:px-0"
                    >
                        {/* Внутренний контейнер для бесконечной левитации */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="relative"
                        >
                            {/* Возвращаем летающие иконки */}
                            <motion.div
                                animate={{ y: [-10, 10, -10] }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -top-6 -left-6 z-20 text-accent bg-surface p-3 rounded-xl shadow-lg shadow-black/20 border border-line hidden md:block"
                            >
                                <Code size={24} />
                            </motion.div>
                            <motion.div
                                animate={{ y: [10, -10, 10] }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute -bottom-6 -right-6 z-20 text-accent bg-surface p-3 rounded-xl shadow-lg shadow-black/20 border border-line hidden md:block"
                            >
                                <Terminal size={24} />
                            </motion.div>
                            <motion.div
                                animate={{ x: [-10, 10, -10], y: [0, 5, 0] }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="absolute top-1/2 -right-10 z-20 text-accent bg-surface p-2.5 rounded-xl shadow-lg shadow-black/20 border border-line hidden lg:block"
                            >
                                <Cpu size={20} />
                            </motion.div>

                            <div className="bg-surface rounded-2xl md:rounded-[22px] shadow-2xl shadow-black/20 border-none overflow-hidden relative min-h-[280px] sm:min-h-[340px] flex flex-col">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={spec.id}
                                        initial={{
                                            opacity: 0,
                                            filter: "blur(4px)",
                                            y: 10,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            filter: "blur(0px)",
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            filter: "blur(4px)",
                                            y: -10,
                                        }}
                                        transition={{
                                            duration: 0.5,
                                            ease: "easeInOut",
                                        }}
                                        className="flex-1 flex flex-col"
                                    >
                                        <div className="p-4 md:p-5 border-b border-line flex items-center gap-3 relative overflow-hidden">
                                            <div className="w-[44px] h-[44px] md:w-[56px] md:h-[56px] rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-sm md:text-lg shrink-0">
                                                {spec.name
                                                    .substring(0, 2)
                                                    .toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] md:text-[15.5px] font-semibold mb-0.5 truncate flex items-center gap-1.5 max-w-[200px]">
                                                    {spec.name}
                                                </div>
                                                <div className="text-[11px] md:text-[12.5px] text-ink-3 truncate max-w-[220px]">
                                                    {spec.handle} · {spec.role}
                                                </div>
                                            </div>
                                            <Badge variant={spec.level} className="min-w-[64px] justify-center">
                                                {levelText}
                                            </Badge>
                                        </div>

                                        <div className="p-4 md:p-5 pb-2 flex-1">
                                            <ScoreRow
                                                label="Архитектурное мышление"
                                                value={spec.scores.arch}
                                                delay={0}
                                            />
                                            <ScoreRow
                                                label="Ревью кода ИИ"
                                                value={spec.scores.code}
                                                delay={1}
                                            />
                                            <ScoreRow
                                                label="Работа с ИИ"
                                                value={spec.scores.ai}
                                                delay={2}
                                            />
                                            <ScoreRow
                                                label="Адаптация"
                                                value={spec.scores.adapt}
                                                warn={spec.scores.adapt < 80}
                                                delay={3}
                                            />
                                        </div>

                                        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 flex flex-wrap gap-1.5">
                                            {spec.skills
                                                .slice(0, 4)
                                                .map((skill, idx) => (
                                                    <Chip
                                                        key={idx}
                                                        variant={
                                                            idx < 3
                                                                ? "accent"
                                                                : "default"
                                                        }
                                                    >
                                                        {skill}
                                                    </Chip>
                                                ))}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
