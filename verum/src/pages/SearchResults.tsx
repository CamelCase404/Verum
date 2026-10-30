import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Building2, Code2, ShieldCheck, ChevronDown, SlidersHorizontal, X, Check } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { motion, AnimatePresence } from "framer-motion";

const STACKS = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "Data / ML"];
const LEVELS = ["Junior", "Middle", "Senior"];
const FORMATS = ["Удалённо", "Гибрид", "Офис"];
const STACK_LANGS: Record<string, string[]> = {
    "Frontend": ["html", "css", "js", "ts", "react", "vue"],
    "Backend": ["python", "go", "java", "csharp", "node"],
    "Fullstack": ["html", "css", "js", "ts", "react", "vue", "python", "go", "java", "csharp", "node"],
    "Mobile": ["kotlin", "swift", "java", "ts"],
    "DevOps": ["bash", "python", "go"],
    "Data / ML": ["python", "sql", "go"]
};
const ALL_LANGS = ["html", "css", "js", "ts", "react", "vue", "python", "go", "java", "csharp", "kotlin", "swift", "bash", "sql", "node"];

export function SearchResults() {
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    
    const type = params.get("type");
    const isJobsSearch = type === "jobs";
    
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const formatSalary = (val: string | number) => {
        if (!val) return "";
        const strVal = String(val);
        if (strVal.toLowerCase().includes("договоренности")) return strVal;
        
        const numbers = strVal.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            return `${parseInt(numbers[0]).toLocaleString('ru-RU')} — ${parseInt(numbers[1]).toLocaleString('ru-RU')} ₽`;
        } else if (numbers && numbers.length === 1) {
            return `от ${parseInt(numbers[0]).toLocaleString('ru-RU')} ₽`;
        }
        return strVal;
    };
    
    // Состояния фильтров
    const [stack, setStack] = useState(params.get("stack") || "");
    const [level, setLevel] = useState(params.get("level") || "");
    const [format, setFormat] = useState(params.get("format") || "");
    const [lang, setLang] = useState(params.get("lang") || "");
    const [minSalary, setMinSalary] = useState(params.get("salary") || "");
    
    // UI состояния
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [openStack, setOpenStack] = useState(false);
    const [openLevel, setOpenLevel] = useState(false);
    const [openFormat, setOpenFormat] = useState(false);
    const [openLang, setOpenLang] = useState(false);

    const availableLangs = stack ? (STACK_LANGS[stack] || ALL_LANGS) : ALL_LANGS;

    // Синхронизация стейта при изменении URL
    useEffect(() => {
        setStack(params.get("stack") || "");
        setLevel(params.get("level") || "");
        setFormat(params.get("format") || "");
        setLang(params.get("lang") || "");
        setMinSalary(params.get("salary") || "");
    }, [params]);

    // Загрузка данных
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const filters = {
                    stack: params.get("stack") || undefined,
                    level: params.get("level") || undefined,
                    format: params.get("format") || undefined,
                    language: params.get("lang") || undefined,
                    min_salary: params.get("salary") ? parseInt(params.get("salary")!) : undefined,
                };

                if (isJobsSearch) {
                    const res = await authApi.searchJobs(filters);
                    setResults(res.data);
                } else {
                    const res = await authApi.searchCandidates(filters);
                    setResults(res.data);
                }
            } catch (e) {
                toast("Ошибка загрузки результатов");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [params, isJobsSearch]);

    // Применение фильтров (обновление URL)
    const applyFilters = () => {
        const newParams = new URLSearchParams();
        newParams.set("type", type || "");
        if (stack) newParams.set("stack", stack);
        if (level) newParams.set("level", level);
        if (format) newParams.set("format", format);
        if (lang) newParams.set("lang", lang);
        if (minSalary) newParams.set("salary", minSalary.replace(/\D/g, ""));
        
        setParams(newParams);
        setIsMobileFiltersOpen(false);
    };

    const resetFilters = () => {
        setStack(""); setLevel(""); setFormat(""); setLang(""); setMinSalary("");
        setParams({ type: type || "" });
        setIsMobileFiltersOpen(false);
    };

    const handleStackSelect = (s: string) => {
        setStack(s);
        setOpenStack(false);
        if (s && STACK_LANGS[s] && !STACK_LANGS[s].includes(lang)) setLang("");
    };

    // Компонент выпадающего списка для сайдбара
    const FilterSelect = ({ label, value, options, open, setOpen, onChange, placeholder = "Любой" }: any) => (
        <div className="relative mb-4">
            <label className="text-[13px] font-medium mb-1.5 block text-ink-2">{label}</label>
            <button onClick={() => setOpen(!open)} className="w-full bg-surface border border-line rounded-xl p-2.5 text-sm text-left flex justify-between items-center hover:border-line-2 transition-colors">
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown size={16} className={`text-ink-3 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-xl z-50 py-1 max-h-48 overflow-y-auto custom-scrollbar">
                        <button onClick={() => { onChange(""); setOpen(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex justify-between items-center">
                            {placeholder}
                            {value === "" && <Check size={14} className="text-accent" />}
                        </button>
                        {options.map((opt: string) => (
                            <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex justify-between items-center">
                                {opt}
                                {value === opt && <Check size={14} className="text-accent" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg py-8 px-4 sm:px-6">
            <div className="max-w-[1200px] mx-auto">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-ink-2 hover:text-accent mb-6 transition-colors">
                    <ArrowLeft size={18} /> На главную
                </button>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* ЛЕВАЯ ПАНЕЛЬ ФИЛЬТРОВ (Сайдбар) */}
                    <aside className={`w-full lg:w-[280px] shrink-0 lg:sticky lg:top-24 bg-surface border border-line rounded-2xl p-5 shadow-sm ${isMobileFiltersOpen ? "block" : "hidden lg:block"}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <SlidersHorizontal size={18} className="text-accent" /> Фильтры
                            </h2>
                            <button onClick={resetFilters} className="text-[12px] text-ink-3 hover:text-red-400 transition-colors">Сбросить</button>
                        </div>

                        <FilterSelect 
                            label="Стек" value={stack} options={STACKS} 
                            open={openStack} setOpen={setOpenStack} onChange={handleStackSelect} 
                        />
                        <FilterSelect 
                            label="Уровень" value={level} options={LEVELS} 
                            open={openLevel} setOpen={setOpenLevel} onChange={setLevel} 
                        />

                        {isJobsSearch ? (
                            <FilterSelect 
                                label="Формат" value={format} options={FORMATS} 
                                open={openFormat} setOpen={setOpenFormat} onChange={setFormat} 
                            />
                        ) : (
                            <FilterSelect 
                                label="Язык" value={lang ? lang.toUpperCase() : ""} options={availableLangs.map(l => l.toUpperCase())} 
                                open={openLang} setOpen={setOpenLang} onChange={(v: string) => setLang(v.toLowerCase())} 
                            />
                        )}

                        <div className="mb-6">
                            <label className="text-[13px] font-medium mb-1.5 block text-ink-2">Зарплата от (₽)</label>
                            <input 
                                value={minSalary} 
                                onChange={(e) => setMinSalary(e.target.value.replace(/\D/g, ""))} 
                                className="w-full bg-bg-2 border border-line rounded-xl p-2.5 text-sm outline-none focus:border-accent transition-colors" 
                                placeholder="Например: 150000" 
                            />
                        </div>

                        <button onClick={applyFilters} className="w-full py-2.5 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors shadow-lg shadow-accent/20">
                            Применить
                        </button>
                    </aside>

                    {/* ПРАВАЯ ПАНЕЛЬ (Результаты) */}
                    <main className="flex-1 w-full min-w-0">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isJobsSearch ? "bg-accent/10 text-accent" : "bg-blue/10 text-blue"}`}>
                                {isJobsSearch ? <Code2 size={20} /> : <Building2 size={20} />}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">{isJobsSearch ? "Найденные вакансии" : "Найденные специалисты"}</h1>
                                <p className="text-[13px] text-ink-3">Найдено: {results.length}</p>
                            </div>
                            {/* Кнопка открытия фильтров на мобилках */}
                            <button onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="ml-auto lg:hidden px-4 py-2 bg-surface border border-line rounded-xl text-sm font-medium flex items-center gap-2">
                                <SlidersHorizontal size={16} /> Фильтры
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-20 text-ink-3">Загрузка...</div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-20 bg-surface border border-line rounded-2xl">
                                <Search size={48} className="mx-auto text-ink-4 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium mb-1">Ничего не найдено</h3>
                                <p className="text-ink-3 text-sm">Попробуйте изменить фильтры поиска</p>
                            </div>
                        ) : isJobsSearch ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {results.map((job: any, i: number) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} 
                                        key={job.id} onClick={() => navigate(`/profile/${job.company_id}`)}
                                        className="p-5 border border-line rounded-2xl bg-surface hover:border-accent cursor-pointer transition-colors flex flex-col group"
                                    >
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <h3 className="font-semibold text-[17px] leading-tight group-hover:text-accent transition-colors">{job.title}</h3>
                                            {job.salary && <span className="text-sm font-bold text-accent whitespace-nowrap bg-accent/5 px-2.5 py-1 rounded-lg">{formatSalary(job.salary)}</span>}
                                        </div>
                                        <p className="text-[13px] text-ink-3 line-clamp-2 mb-4 flex-1">{job.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="text-[11px] bg-bg-2 border border-line px-2 py-1 rounded-md">{job.level}</span>
                                            <span className="text-[11px] bg-bg-2 border border-line px-2 py-1 rounded-md">{job.format}</span>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 border-t border-line mt-auto">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold">
                                                {job.company_avatar ? <img src={job.company_avatar} alt="Logo" className="w-full h-full object-cover" /> : <Building2 size={16} />}
                                            </div>
                                            <span className="text-[13px] font-medium text-ink-2 truncate">{job.company_name}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {results.map((cand: any, i: number) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} 
                                        key={cand.id} onClick={() => navigate(`/profile/${cand.id}`)}
                                        className="p-4 border border-line rounded-2xl bg-surface flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-accent cursor-pointer transition-colors group"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-lg font-bold shrink-0 group-hover:scale-105 transition-transform">
                                            {cand.avatar_url ? <img src={cand.avatar_url} className="w-full h-full object-cover rounded-full" /> : cand.full_name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-[16px] group-hover:text-accent transition-colors truncate">{cand.full_name}</h3>
                                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                                    <ShieldCheck size={10} /> {cand.final_grade}
                                                </span>
                                            </div>
                                            <div className="text-[13px] text-ink-3 mb-2 truncate">{cand.stack} • {cand.language}</div>
                                            <div className="flex items-center gap-4 text-[12px]">
                                                <span className="text-ink-2">Совпадение: <b className="text-accent">{cand.match_score}%</b></span>
                                                <span className="text-ink-3">Тест: {cand.total_score}/100</span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-[15px] font-bold text-accent">~ {cand.estimated_salary.toLocaleString('ru-RU')} ₽</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
