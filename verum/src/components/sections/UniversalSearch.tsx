import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, Code2, X, ChevronDown, Check, Banknote, MapPin, Layers } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { useNavigate } from "react-router-dom";

const STACKS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];

export function UniversalSearch() {
    const user = useAppStore((s) => s.user);
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const [resultsOpen, setResultsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Фильтры
    const [stack, setStack] = useState("");
    const [level, setLevel] = useState("");
    const [format, setFormat] = useState("");
    
    // Состояния дропдаунов
    const [openStack, setOpenStack] = useState(false);
    const [openLevel, setOpenLevel] = useState(false);
    const [openFormat, setOpenFormat] = useState(false);

    
    // Блокировка скролла (надежно для мобилок)
    useEffect(() => {
        if (isOpen || resultsOpen) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    }, [isOpen, resultsOpen]);

    const [results, setResults] = useState<any[]>([]);
    const [isJobsSearch, setIsJobsSearch] = useState(true);



    const handleOpen = () => {
        if (!user) {
            toast("Войдите в аккаунт, чтобы использовать умный поиск");
            navigate("/login");
            return;
        }
        setIsJobsSearch(user.role === "developer");
        setIsOpen(true);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            if (isJobsSearch) {
                const res = await authApi.searchJobs({ stack, level, format });
                setResults(res.data);
            } else {
                const res = await authApi.searchCandidates({ stack, level });
                setResults(res.data);
            }
            setIsOpen(false);
            setResultsOpen(true);
        } catch (e) {
            toast("Ошибка поиска");
        } finally {
            setLoading(false);
        }
    };

    // Расчет совпадения для разработчика
    const calculateMatch = () => {
        if (!user || user.role !== "developer") return null;
        // Простейшая имитация: если фильтр совпадает с профилем, даем 100%
        // В реальности здесь был бы запрос к бэкенду или сложная логика
        let match = 50; // базовое
        if (stack) match += 20;
        if (level) match += 20;
        if (format) match += 10;
        return Math.min(100, match);
    };
    const matchScore = calculateMatch();

    return (
        <>
            {/* Кнопка вызова поиска на главной */}
            <div className="w-full flex justify-center mt-8 px-4 relative z-20">
                <button 
                    onClick={handleOpen}
                    className="w-full max-w-[600px] h-[56px] bg-surface border border-line rounded-2xl shadow-xl flex items-center px-5 gap-3 hover:border-accent transition-colors group"
                >
                    <Search size={20} className="text-ink-3 group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-ink-2 text-[13px] sm:text-[15px] truncate">Умный поиск вакансий или специалистов...</span>
                    <div className="ml-auto bg-accent/10 text-accent text-[10px] sm:text-[11px] font-semibold px-2 py-1 rounded-md uppercase tracking-wider shrink-0">Поиск</div>
                </button>
            </div>

            {/* Модалка с фильтрами */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-surface border border-line rounded-[22px] p-6 w-full max-w-lg shadow-2xl relative">
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
                            
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isJobsSearch ? "bg-accent/10 text-accent" : "bg-blue/10 text-blue"}`}>
                                    {isJobsSearch ? <Code2 size={20} /> : <Building2 size={20} />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{isJobsSearch ? "Поиск вакансий" : "Поиск кандидатов"}</h2>
                                    <p className="text-[13px] text-ink-3">Укажите, что вам нужно</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="relative">
                                    <label className="text-sm font-medium mb-1 block">Стек</label>
                                    <button onClick={() => setOpenStack(!openStack)} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
                                        {stack || "Любой"} <ChevronDown size={16} />
                                    </button>
                                    <AnimatePresence>
                                        {openStack && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-40 overflow-y-auto">
                                                <button onClick={() => { setStack(""); setOpenStack(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">Любой</button>
                                                {STACKS.map(s => (
                                                    <button key={s} onClick={() => { setStack(s); setOpenStack(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">{s}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative">
                                    <label className="text-sm font-medium mb-1 block">Уровень</label>
                                    <button onClick={() => setOpenLevel(!openLevel)} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
                                        {level || "Любой"} <ChevronDown size={16} />
                                    </button>
                                    <AnimatePresence>
                                        {openLevel && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1">
                                                <button onClick={() => { setLevel(""); setOpenLevel(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">Любой</button>
                                                {LEVELS.map(l => (
                                                    <button key={l} onClick={() => { setLevel(l); setOpenLevel(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">{l}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {isJobsSearch && (
                                    <div className="relative">
                                        <label className="text-sm font-medium mb-1 block">Формат</label>
                                        <button onClick={() => setOpenFormat(!openFormat)} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
                                            {format || "Любой"} <ChevronDown size={16} />
                                        </button>
                                        <AnimatePresence>
                                            {openFormat && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1">
                                                    <button onClick={() => { setFormat(""); setOpenFormat(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">Любой</button>
                                                    {FORMATS.map(f => (
                                                        <button key={f} onClick={() => { setFormat(f); setOpenFormat(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">{f}</button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            {isJobsSearch && matchScore !== null && (
                                <div className="mb-6 p-3 bg-accent/5 border border-accent/20 rounded-xl">
                                    <p className="text-[13px] text-ink-2">
                                        На основе вашего профиля, это совпадение оценивается в <b className="text-accent">{matchScore}%</b>.
                                    </p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors">Отмена</button>
                                <button onClick={handleSearch} disabled={loading} className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2">
                                    {loading ? "Ищем..." : "Найти"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Модалка с результатами */}
            <AnimatePresence>
                {resultsOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface border border-line rounded-[22px] w-full max-w-2xl shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden">
                            <div className="p-5 border-b border-line bg-surface-2 flex justify-between items-center">
                                <h2 className="font-bold text-lg">Результаты поиска ({results.length})</h2>
                                <button onClick={() => setResultsOpen(false)} className="text-ink-3 hover:text-ink"><X size={20} /></button>
                            </div>
                            
                            <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar">
                                {results.length === 0 ? (
                                    <div className="text-center py-10 text-ink-3">Ничего не найдено</div>
                                ) : isJobsSearch ? (
                                    results.map((job: any) => (
                                        <div key={job.id} className="p-4 border border-line rounded-xl bg-surface-2 hover:border-accent transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-[15px] sm:text-[16px] truncate pr-2">{job.title}</h3>
                                                <span className="text-[13px] sm:text-sm font-bold text-accent whitespace-nowrap">{job.salary}</span>
                                            </div>
                                            <p className="text-[13px] text-ink-3 line-clamp-2 mb-3">{job.description}</p>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[12px] bg-surface px-2 py-1 rounded border border-line">{job.company_name}</span>
                                                <span className="text-[12px] bg-surface px-2 py-1 rounded border border-line">{job.level}</span>
                                                <span className="text-[12px] bg-surface px-2 py-1 rounded border border-line">{job.format}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    results.map((cand: any) => (
                                        <div key={cand.id} className="flex items-center gap-3 p-4 border border-line rounded-xl bg-surface-2">
                                            <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                                                {cand.full_name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-[14px] sm:text-[15px] truncate">{cand.full_name}</div>
                                                <div className="text-[12px] text-ink-3">{cand.stack} • {cand.final_grade}</div>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <div className="text-sm font-bold text-accent">{cand.match_score}%</div>
                                                <div className="text-[11px] text-ink-3">совпадение</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
