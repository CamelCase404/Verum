import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, Code2, X, ChevronDown } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const STACKS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];

// Умный словарь языков под каждый стек
const STACK_LANGS: Record<string, string[]> = {
    "Frontend": ["html", "css", "js", "ts", "react", "vue"],
    "Backend": ["python", "go", "java", "csharp", "node"],
    "Fullstack": ["html", "css", "js", "ts", "react", "vue", "python", "go", "java", "csharp", "node"],
    "Mobile": ["kotlin", "swift", "java", "ts"],
    "DevOps": ["bash", "python", "go"],
    "Data / ML": ["python", "sql", "go"]
};
const ALL_LANGS = ["html", "css", "js", "ts", "react", "vue", "python", "go", "java", "csharp", "kotlin", "swift", "bash", "sql", "node"];

export function UniversalSearch() {
    const user = useAppStore((s) => s.user);
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchRole, setSearchRole] = useState<"developer" | "company">("developer");
    
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

    // Доступные языки зависят от выбранного стека
    const availableLangs = stack ? (STACK_LANGS[stack] || ALL_LANGS) : ALL_LANGS;

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

    const handleOpen = () => setIsOpen(true);

    const handleStackSelect = (s: string) => {
        setStack(s);
        setOpenStack(false);
        // Сбрасываем язык, если он не подходит под новый стек
        if (s && STACK_LANGS[s] && !STACK_LANGS[s].includes(lang)) {
            setLang("");
        }
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
            <div className="w-full flex justify-center relative z-20">
                <button 
                    onClick={handleOpen}
                    className="w-full h-[60px] bg-surface border border-line rounded-2xl shadow-xl flex items-center px-6 gap-4 hover:border-accent transition-colors group"
                >
                    <Search size={20} className="text-ink-3 group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-ink-2 text-[14px] sm:text-[16px] truncate text-left font-medium">Умный поиск вакансий или специалистов...</span>
                    <div className="ml-auto bg-accent/10 text-accent text-[11px] sm:text-[12px] font-semibold px-3 py-1.5 rounded-lg uppercase tracking-wider shrink-0">Поиск</div>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface border border-line rounded-[22px] p-6 sm:p-8 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                            <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-ink-3 hover:text-ink"><X size={20} /></button>
                            
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold mb-4">Умный поиск</h2>
                                <div className="flex bg-bg-2 p-1 rounded-xl">
                                    <button
                                        onClick={() => setSearchRole("developer")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all ${searchRole === "developer" ? "bg-surface text-accent shadow-sm" : "text-ink-3 hover:text-ink"}`}
                                    >
                                        <Code2 size={16} /> Ищу работу
                                    </button>
                                    <button
                                        onClick={() => setSearchRole("company")}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[14px] font-medium transition-all ${searchRole === "company" ? "bg-surface text-accent shadow-sm" : "text-ink-3 hover:text-ink"}`}
                                    >
                                        <Building2 size={16} /> Ищу сотрудника
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {/* Стек */}
                                <div className="relative">
                                    <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Стек</label>
                                    <button onClick={() => { setOpenStack(!openStack); setOpenLevel(false); setOpenLang(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center border border-transparent hover:border-line-2 transition-colors">
                                        {stack || "Любой"} <ChevronDown size={16} className="text-ink-3" />
                                    </button>
                                    <AnimatePresence>
                                        {openStack && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                <button onClick={() => handleStackSelect("")} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">Любой</button>
                                                {STACKS.map(s => (
                                                    <button key={s} onClick={() => handleStackSelect(s)} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">{s}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Уровень */}
                                <div className="relative">
                                    <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Уровень</label>
                                    <button onClick={() => { setOpenLevel(!openLevel); setOpenStack(false); setOpenLang(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center border border-transparent hover:border-line-2 transition-colors">
                                        {level || "Любой"} <ChevronDown size={16} className="text-ink-3" />
                                    </button>
                                    <AnimatePresence>
                                        {openLevel && (
                                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1">
                                                <button onClick={() => { setLevel(""); setOpenLevel(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">Любой</button>
                                                {LEVELS.map(l => (
                                                    <button key={l} onClick={() => { setLevel(l); setOpenLevel(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">{l}</button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Формат / Язык */}
                                {isJobsSearch ? (
                                    <div className="relative">
                                        <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Формат</label>
                                        <button onClick={() => { setOpenFormat(!openFormat); setOpenStack(false); setOpenLevel(false); setOpenLang(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center border border-transparent hover:border-line-2 transition-colors">
                                            {format || "Любой"} <ChevronDown size={16} className="text-ink-3" />
                                        </button>
                                        <AnimatePresence>
                                            {openFormat && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1">
                                                    <button onClick={() => { setFormat(""); setOpenFormat(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">Любой</button>
                                                    {FORMATS.map(f => (
                                                        <button key={f} onClick={() => { setFormat(f); setOpenFormat(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">{f}</button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Язык</label>
                                        <button onClick={() => { setOpenLang(!openLang); setOpenStack(false); setOpenLevel(false); setOpenFormat(false); }} className="w-full bg-bg-2 rounded-xl p-3 text-sm text-left flex justify-between items-center border border-transparent hover:border-line-2 transition-colors">
                                            {lang ? lang.toUpperCase() : "Любой"} <ChevronDown size={16} className="text-ink-3" />
                                        </button>
                                        <AnimatePresence>
                                            {openLang && (
                                                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                                                    <button onClick={() => { setLang(""); setOpenLang(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">Любой</button>
                                                    {availableLangs.map(l => (
                                                        <button key={l} onClick={() => { setLang(l); setOpenLang(false); }} className="w-full text-left px-4 py-2.5 text-[13px] hover:bg-surface-2">{l.toUpperCase()}</button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}

                                {/* Зарплата */}
                                <div>
                                    <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Зарплата от (₽)</label>
                                    <input 
                                        value={minSalary} 
                                        onChange={(e) => {
                                            const rawValue = e.target.value.replace(/\D/g, "");
                                            if (rawValue) {
                                                setMinSalary(parseInt(rawValue).toLocaleString("ru-RU"));
                                            } else {
                                                setMinSalary("");
                                            }
                                        }} 
                                        className="w-full bg-bg-2 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-accent/20 border border-transparent hover:border-line-2 focus:border-accent transition-colors"  
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={() => setIsOpen(false)} className="px-6 py-2.5 rounded-xl font-medium hover:bg-surface-2 transition-colors">Отмена</button>
                                <button onClick={handleSearch} className="px-8 py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center gap-2 shadow-lg shadow-accent/20">
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
