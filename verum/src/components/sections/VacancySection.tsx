import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { Layers, MapPin, FileText, ScanLine, Banknote } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

const MOCK_JOBS = [
    {
        role: "Frontend-разработчика",
        stack: "React + TypeScript",
        fullText:
            "Ищем Frontend-разработчика в продуктовую команду. Стек — React + TypeScript.",
        salary: "от 180 000 ₽",
        level: "Middle",
        format: "Удалённо",
        candidates: [
            {
                n: "Марина Ковалёва",
                i: "МК",
                match: "94%",
                r: "Совпадение по стеку 6 из 7 · опыт с ИИ",
            },
            {
                n: "Данила Ершов",
                i: "ДЕ",
                match: "89%",
                r: "Архитектурный профиль · интеграция LLM",
            },
            {
                n: "Алина Ткачук",
                i: "АТ",
                match: "81%",
                r: "Гибкий стек · скорость прототипирования",
            },
        ],
    },
    {
        role: "ML-инженера",
        stack: "Python + PyTorch",
        fullText: "Нужен ML-инженер в проект. Стек — Python + PyTorch.",
        salary: "от 250 000 ₽",
        level: "Senior",
        format: "Гибрид",
        candidates: [
            {
                n: "Ксения Морозова",
                i: "КМ",
                match: "98%",
                r: "Глубокий опыт с LLM и RAG",
            },
            {
                n: "Игорь Соловьёв",
                i: "ИС",
                match: "85%",
                r: "Сильная математическая база",
            },
            {
                n: "Екатерина Смирнова",
                i: "ЕС",
                match: "79%",
                r: "Опыт деплоя моделей · MLOps",
            },
        ],
    },
    {
        role: "Backend-разработчика",
        stack: "Go + PostgreSQL",
        fullText:
            "Ищем Backend-разработчика для высоконагруженного сервиса. Стек — Go + PostgreSQL.",
        salary: "от 220 000 ₽",
        level: "Middle+",
        format: "Удалённо",
        candidates: [
            {
                n: "Данила Ершов",
                i: "ДЕ",
                match: "95%",
                r: "Опыт построения микросервисов",
            },
            {
                n: "Владислав Орлов",
                i: "ВО",
                match: "88%",
                r: "Знание алгоритмов и структур данных",
            },
            {
                n: "Артём Лебедев",
                i: "АЛ",
                match: "75%",
                r: "Смежный опыт, понимание CI/CD",
            },
        ],
    },
    {
        role: "iOS-разработчика",
        stack: "Swift + SwiftUI",
        fullText: "Требуется iOS-разработчик в финтех. Стек — Swift + SwiftUI.",
        salary: "от 230 000 ₽",
        level: "Middle",
        format: "Гибрид (Москва)",
        candidates: [
            {
                n: "Максим Ветров",
                i: "МВ",
                match: "96%",
                r: "5 приложений в App Store · SwiftUI",
            },
            {
                n: "Алина Ткачук",
                i: "АТ",
                match: "82%",
                r: "Опыт миграции с UIKit",
            },
            {
                n: "Екатерина Смирнова",
                i: "ЕС",
                match: "77%",
                r: "Опыт написания UI-тестов",
            },
        ],
    },
    {
        role: "DevOps-инженера",
        stack: "Kubernetes + Terraform",
        fullText:
            "Ищем DevOps-инженера для настройки инфраструктуры. Стек — Kubernetes + Terraform.",
        salary: "от 210 000 ₽",
        level: "Senior",
        format: "Удалённо",
        candidates: [
            {
                n: "Артём Лебедев",
                i: "АЛ",
                match: "93%",
                r: "Опыт отказоустойчивых кластеров",
            },
            {
                n: "Максим Ветров",
                i: "МВ",
                match: "86%",
                r: "Глубокое знание Linux и сетей",
            },
            {
                n: "Ольга Никитина",
                i: "ОН",
                match: "78%",
                r: "Автоматизация CI/CD пайплайнов",
            },
        ],
    },
    {
        role: "QA Automation инженера",
        stack: "Playwright + TypeScript",
        fullText:
            "Приглашаем QA Automation инженера. Стек — Playwright + TypeScript.",
        salary: "от 160 000 ₽",
        level: "Middle",
        format: "Удалённо",
        candidates: [
            {
                n: "Екатерина Смирнова",
                i: "ЕС",
                match: "95%",
                r: "Автоматизация тестирования с нуля",
            },
            {
                n: "Игорь Соловьёв",
                i: "ИС",
                match: "81%",
                r: "Знание JS/TS · написание E2E",
            },
            {
                n: "Алина Ткачук",
                i: "АТ",
                match: "75%",
                r: "Понимание полного цикла разработки",
            },
        ],
    },
];

export function VacancySection() {
    const navigate = useNavigate();
    const user = useAppStore((s) => s.user);

    const [jobIndex, setJobIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const currentJob = MOCK_JOBS[jobIndex];

    // Логика печатной машинки
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (!isDeleting && displayedText === currentJob.fullText) {
            timer = setTimeout(() => setIsDeleting(true), 3000);
        } else if (isDeleting && displayedText === "") {
            setIsDeleting(false);
            setJobIndex((prev) => (prev + 1) % MOCK_JOBS.length);
        } else {
            const speed = isDeleting ? 15 : 35;
            const nextText = isDeleting
                ? currentJob.fullText.substring(0, displayedText.length - 1)
                : currentJob.fullText.substring(0, displayedText.length + 1);

            timer = setTimeout(() => setDisplayedText(nextText), speed);
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentJob.fullText]);

    const handlePostJob = () => {
        if (!user) {
            toast("Пожалуйста, войдите или зарегистрируйтесь как компания");
            navigate("/register?role=company");
        } else if (user.role === "company") {
            navigate("/dashboard");
        } else {
            toast("Размещать вакансии могут только компании");
        }
    };

    return (
        <section className="py-8 md:py-16 relative w-full overflow-hidden">
            <div className="wrap">
                {/*
          flex-col-reverse: на мобилках переворачивает порядок (текст сверху, карточка снизу).
          lg:grid: на ПК выстраивает в 2 колонки (карточка слева, текст справа).
          gap-12 lg:gap-[100px]: делает большой отступ между колонками.
        */}
                <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-[100px] items-center w-full min-w-0">
                    {/* ПЕРВЫЙ БЛОК В DOM: На ПК встанет СЛЕВА, на мобилках (из-за reverse) уйдет ВНИЗ */}
                    <Reveal delay={0.2} className="w-full max-w-full min-w-0">
                        <div className="bg-surface border border-line rounded-2xl shadow-xl overflow-hidden relative w-full">
                            <div className="px-4 md:px-5 py-3 md:py-4 border-b border-line bg-surface-2 flex items-center justify-between relative">
                                <span className="text-[14px] md:text-[15px] font-semibold flex items-center gap-2">
                                    <FileText
                                        size={16}
                                        className="text-ink-3"
                                    />{" "}
                                    Описание вакансии
                                </span>
                            </div>

                            <div className="p-4 md:p-5 w-full min-w-0">
                                {/* Текст с эффектом печатной машинки */}
                                <div className="font-mono text-[11px] md:text-xs leading-relaxed text-ink-2 bg-bg border border-line rounded-lg p-3 md:p-3.5 mb-4 relative overflow-hidden break-words w-full min-h-[64px]">
                                    {displayedText}
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 0.8,
                                        }}
                                        className="inline-block w-1.5 h-3.5 bg-accent ml-1 align-middle"
                                    />
                                </div>

                                <div className="flex flex-col gap-2 md:gap-3 mb-4 md:mb-5 w-full">
                                    <div className="flex justify-between text-[12px] md:text-sm items-center">
                                        <span className="text-ink-3 flex items-center gap-2">
                                            <Banknote size={14} /> Зарплата
                                        </span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={currentJob.salary}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="font-medium text-right"
                                            >
                                                {currentJob.salary}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex justify-between text-[12px] md:text-sm items-center">
                                        <span className="text-ink-3 flex items-center gap-2">
                                            <Layers size={14} /> Уровень
                                        </span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={currentJob.level}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="font-medium text-right"
                                            >
                                                {currentJob.level}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex justify-between text-[12px] md:text-sm items-center">
                                        <span className="text-ink-3 flex items-center gap-2">
                                            <MapPin size={14} /> Формат
                                        </span>
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={currentJob.format}
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 5 }}
                                                className="font-medium text-right"
                                            >
                                                {currentJob.format}
                                            </motion.span>
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <div className="text-[11px] md:text-[11.5px] font-semibold uppercase tracking-wider text-ink-3 mb-2.5 flex items-center gap-2">
                                    <ScanLine
                                        size={14}
                                        className="animate-pulse text-accent"
                                    />{" "}
                                    Кандидаты
                                </div>

                                <Stagger className="w-full">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={jobIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.4 }}
                                            className="w-full"
                                        >
                                            {currentJob.candidates.map(
                                                (c, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 border border-line rounded mb-2 hover:border-accent-line hover:bg-surface-2 transition-all cursor-pointer min-w-0 w-full"
                                                    >
                                                        <div className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-[11px] md:text-[12.5px] shrink-0">
                                                            {c.i}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-[13px] md:text-sm font-medium mb-0.5 truncate">
                                                                {c.n}
                                                            </div>
                                                            <div className="text-[11px] md:text-[12.5px] text-ink-3 truncate">
                                                                {c.r}
                                                            </div>
                                                        </div>
                                                        <div className="font-mono text-[12px] md:text-[13px] font-medium text-accent tabular-nums shrink-0">
                                                            {c.match}
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </Stagger>
                            </div>
                        </div>
                    </Reveal>

                    {/* ВТОРОЙ БЛОК В DOM: На ПК встанет СПРАВА, на мобилках (из-за reverse) уйдет НАВЕРХ */}
                    <Reveal>
                        <span className="block text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold text-ink-3 mb-2 md:mb-4 flex items-center justify-center lg:justify-end gap-2">
                            <span className="w-4 md:w-6 h-px bg-accent inline-block" />{" "}
                            Для компаний
                        </span>
                        <h2 className="font-semibold tracking-[-0.038em] leading-[1.04] text-[clamp(22px,4.4vw,40px)] mb-3 md:mb-4 text-center lg:text-right break-words">
                            Опишите вакансию - получите шортлист
                        </h2>
                        <p className="text-[13px] md:text-[15px] text-ink-3 leading-relaxed max-w-[400px] mb-5 md:mb-8 mx-auto lg:ml-auto lg:mr-0 text-center lg:text-right">
                            Вам не нужно вручную перебирать сотни резюме.
                            Напишите, кто вам нужен, а система сама выделит
                            требования и подберёт кандидатов.
                        </p>

                        <div className="flex justify-center lg:justify-end">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handlePostJob}
                                className="h-[46px] md:h-[50px] px-6 md:px-8 rounded-xl bg-accent text-white font-medium text-[14px] md:text-[15px] shadow-lg shadow-accent/20 hover:bg-accent-2 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                            >
                                Разместить вакансию →
                            </motion.button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
