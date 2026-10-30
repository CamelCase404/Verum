import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, Code2, X, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];
const LANGS = ["html", "css", "js", "ts", "react", "vue", "python", "go", "java", "csharp", "kotlin", "swift"];

export function UniversalSearch() {
    const user = useAppStore((s) => s.user);
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchRole, setSearchRole] = useState<"developer" | "company">("developer");
    
    // Фильтры
    const [stack, setStack] = useState("");
    const [level, setLevel] = useState("");
    const [format, setFormat] = useState("");
    const [lang, setLang] = useState("");
    const [minSalary, setMinSalary] = useState("");
    
    const [openStack, setOpenStack] = useState(false);
    const [openLevel, setOpenLevel] = useState(false);
    const [openFormat, setOpenFormat] = useState(false);
    const [openLang, setOpenLang] = useState(false);

    const isJobsSearch = searchRole === "developer";

    useEffect(() => {
        if (user && isOpen) setSearchRole(user.role as any);
    }, [user, isOpen]);

    useEffect(() => {
        if (isOpen) {
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
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (stack) params.append("stack", stack);
        if (level) params.append("level", level);
        if (format) params.append("format", format);
        if (lang) params.append("lang", lang);
        if (minSalary) params.append("salary", minSalary.replace(/\D/g, ""));
        
        setIsOpen(false);
        navigate(`/search?type=${isJobsSearch ? "jobs" : "candidates"}&${params.toString()}`);
    };

    return (
        <>
            {/* Кнопка вызова поиска */}
            <div className="w-full flex justify-center mt-6 relative z-20">
                <button 
                    onClick={handleOpen}
                    className="w-full h-[56px] bg-surface border border-line rounded-2xl shadow-xl flex items-center px-5 gap-3 hover:border-accent transition-colors group"
                >
                    <Search size={20} className="text-ink-3 group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-ink-2 text-[14px] sm:text-[15px] truncate text-left">Умный поиск вакансий или специалистов...</span>
                    <div className="ml-auto bg-accent/10 text-accent text-[10px] sm:text-[11px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shrink-0">Поиск</div>
                </button>
            </div>

            {/* Модалка с фильтрами */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface border border-line rounded-[22px] p-5 sm:p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
                            
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-4">Умный поиск</h2>
                                {/* Переключатель ролей */}
                                <div className="flex bg-bg-2 p-1 rounded-xl">
                                    <button
                                        onClick={() => setSearchRole("developer")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${searchRole === "developer" ? "bg-surface text-accent shadow-sm" : "text-ink-3 hover:text-ink"}`}
                                    >
                                        <Code2 size={16} /> Ищу работу
                                    </button>
                                    <button
                                        onClick={() => setSearchRole("company")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${searchRole === "company" ? "bg-surface text-accent shadow-sm" : "text-ink-3 hover:text-ink"}`}
                                    >
                                        <Building2 size={16} /> Ищу сотрудника
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <label className="text-sm font-medium mb-1 block">Стек</label>
                                        <button onClick={() => { setOpenStack(!openStack); setOpenLevel(false); setOpenLang(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
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
                                        <button onClick={() => { setOpenLevel(!openLevel); setOpenStack(false); setOpenLang(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
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
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {isJobsSearch ? (
                                        <div className="relative">
                                            <label className="text-sm font-medium mb-1 block">Формат</label>
                                            <button onClick={() => { setOpenFormat(!openFormat); setOpenStack(false); setOpenLevel(false); setOpenLang(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
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
                                    ) : (
                                        <div className="relative">
                                            <label className="text-sm font-medium mb-1 block">Язык</label>
                                            <button onClick={() => { setOpenLang(!openLang); setOpenStack(false); setOpenLevel(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center">
                                                {lang ? lang.toUpperCase() : "Любой"} <ChevronDown size={16} />
                                            </button>
                                            <AnimatePresence>
                                                {openLang && (
                                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-40 overflow-y-auto">
                                                        <button onClick={() => { setLang(""); setOpenLang(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">Любой</button>
                                                        {LANGS.map(l => (
                                                            <button key={l} onClick={() => { setLang(l); setOpenLang(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2">{l.toUpperCase()}</button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm font-medium mb-1 block">Зарплата от (₽)</label>
                                        <input 
                                            value={minSalary} 
                                            onChange={(e) => setMinSalary(e.target.value.replace(/\D/g, ""))} 
                                            className="w-full bg-bg-2 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-accent" 
                                            placeholder="Например: 150000" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setIsOpen(false)} className="px-5 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors">Отмена</button>
                                <button onClick={handleSearch} className="px-6 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2">
                                    Найти
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
