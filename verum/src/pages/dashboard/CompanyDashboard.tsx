import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    Plus,
    Pencil,
    Briefcase,
    Users,
    Globe,
    ShieldCheck,
    Scale,
    CheckSquare,
    Square,
    Star,
    Search,
    ChevronDown,
    Check,
    Layers,
    X,
} from "lucide-react";
import { EditCompanyModal } from "@/components/modals/EditCompanyModal";
import { CreateJobModal } from "@/components/modals/CreateJobModal";
import { CreateCaseModal } from "@/components/modals/CreateCaseModal";
import { CompareCandidatesModal } from "@/components/modals/CompareCandidatesModal";
import { HireConfirmModal } from "@/components/modals/HireConfirmModal";
import { authApi, companyApi } from "@/api";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = [
    "Mobile (iOS)", "Mobile (Android)", "Frontend", "Backend", "GameDev", "DevOps / SRE", "Data / ML",
];

export function CompanyDashboard({
    backendUser,
    onRefresh,
}: {
    backendUser: any;
    onRefresh: () => void;
}) {
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isJobOpen, setIsJobOpen] = useState(false);
    const [isCaseOpen, setIsCaseOpen] = useState(false);
    const [activeWorkType, setActiveWorkType] = useState<"vacancies" | "cases">("vacancies");
    const [editingJob, setEditingJob] = useState<any>(null);
    const [isCompareOpen, setIsCompareOpen] = useState(false);
    const [hireCandidate, setHireCandidate] = useState<any>(null);
    const [isHiring, setIsHiring] = useState(false);

    const [activeTab, setActiveTab] = useState<"jobs" | "candidates">("jobs");

    const [candidates, setCandidates] = useState<any[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(true);

    // Фильтры (языки убраны)
    const [filterGrade, setFilterGrade] = useState("");
    const [filterStack, setFilterStack] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string>("");

    // Дропдауны
    const [openGrade, setOpenGrade] = useState(false);
    const [openStack, setOpenStack] = useState(false);
    const [openJob, setOpenJob] = useState(false);

    const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

    const backendUserStore = useAppStore((s) => s.backendUser);
    const plan = backendUser?.plan ?? backendUserStore?.plan;
    const verificationsLeft = backendUser?.verifications_left ?? backendUserStore?.verifications_left;
    const isEnterprise = plan === "enterprise";

    const allJobs = backendUser?.job_postings || [];
    const jobs = allJobs.filter((j: any) => j.type !== "case");
    const cases = allJobs.filter((j: any) => j.type === "case");
    const currentList = activeWorkType === "vacancies" ? jobs : cases;

    const fetchCandidates = () => {
        setLoadingCandidates(true);
        authApi
            .searchCandidates({
                grade: filterGrade,
                stack: filterStack,
                job_id: selectedJobId,
            })
            .then((res) => {
                setCandidates(res.data || []);
                setLoadingCandidates(false);
            })
            .catch((err) => {
                console.error("Ошибка загрузки кандидатов:", err);
                setCandidates([]);
                setLoadingCandidates(false);
            });
    };

    useEffect(() => {
        if (activeTab === "candidates") {
            fetchCandidates();
        }
    }, [filterGrade, filterStack, selectedJobId, activeTab]);

    const handleJobClick = (job: any) => {
        setSelectedJobId(job.id);
        setFilterStack(job.stack || "");
        setFilterGrade(job.level || "");
        setActiveTab("candidates");
    };

    const resetFilters = () => {
        setFilterStack("");
        setFilterGrade("");
        setSelectedJobId("");
    };

    const toggleSelect = (id: number) => {
        if (selectedCandidates.includes(id)) {
            setSelectedCandidates((prev) => prev.filter((c) => c !== id));
        } else {
            if (selectedCandidates.length >= 3) {
                toast("Можно сравнивать не более 3-х кандидатов");
                return;
            }
            setSelectedCandidates((prev) => [...prev, id]);
        }
    };

    const candidatesToCompare = candidates.filter((c) => selectedCandidates.includes(c.id));

    const handleHireClick = (cand: any) => {
        setHireCandidate(cand);
    };

    const confirmHire = async () => {
        if (!hireCandidate) return;
        setIsHiring(true);
        try {
            const res = await companyApi.hire(hireCandidate.id);
            navigate(`/messages?chat=${res.data.conversation_id}`);
        } catch (e) {
            toast("Ошибка при создании чата");
        } finally {
            setIsHiring(false);
            setHireCandidate(null);
        }
    };

    const handleJobCreated = () => {
        setIsJobOpen(false);
        onRefresh();
        if (activeWorkType === "cases") {
            // Остаемся
        } else {
            setActiveTab("candidates");
        }
    };

    const selectedJobTitle = jobs.find((j: any) => j.id === selectedJobId)?.title || "Все вакансии";

    const formatSalary = (val: string) => {
        if (!val) return "";
        if (val.toLowerCase().includes("договоренности")) return val;
        const numbers = val.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            return `от ${parseInt(numbers[0]).toLocaleString('ru-RU')} до ${parseInt(numbers[1]).toLocaleString('ru-RU')} ₽`;
        } else if (numbers && numbers.length === 1) {
            return `от ${parseInt(numbers[0]).toLocaleString('ru-RU')} ₽`;
        }
        return val;
    };

    const CustomSelect = ({ value, options, onChange, open, setOpen, placeholder, icon: Icon }: any) => (
        <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-surface-2 border border-line text-sm text-ink rounded-lg px-3 py-2 outline-none flex items-center justify-between gap-2 hover:bg-surface-3 transition-colors min-w-[130px]"
            >
                <span className="flex items-center gap-1.5 truncate">
                    {Icon && <Icon size={14} className="text-ink-3" />}
                    {value || placeholder}
                </span>
                <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-1.5 w-full min-w-[140px] bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden max-h-60 overflow-y-auto">
                    <button
                        onClick={() => { onChange(""); setOpen(false); }}
                        className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                    >
                        Все {placeholder.toLowerCase().replace("все ", "")}
                        {value === "" && <Check size={14} className="text-accent" />}
                    </button>
                    {options.map((opt: any) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                        >
                            {opt.label}
                            {value === opt.value && <Check size={14} className="text-accent shrink-0" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="max-w-[1280px] w-full overflow-hidden mx-auto px-3 md:px-8 py-4 md:py-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">Кабинет компании</h1>
                    <p className="text-ink-2 text-[13px] md:text-[15px]">Управление вакансиями и поиск талантов</p>
                </div>
                {/* План и счётчики (Строгий стиль) */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center bg-surface border border-line rounded-xl px-4 py-2 divide-x divide-line w-full sm:w-auto justify-between sm:justify-start">
                        <div className="pr-4">
                            <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-0.5">Тесты</div>
                            <div className="text-[15px] font-bold text-ink leading-none">{isEnterprise ? "∞" : (verificationsLeft ?? 0)}</div>
                        </div>
                        <div className="pl-4">
                            <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-0.5">Токены</div>
                            <div className="text-[15px] font-bold text-accent leading-none">{backendUser?.tokens === null ? "∞" : (backendUser?.tokens ?? 0)}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate("/pricing")}
                        className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-[13px] font-medium transition-colors whitespace-nowrap border ${plan ? "bg-surface border-line text-ink hover:bg-surface-2" : "bg-accent border-accent text-white hover:bg-accent-2"}`}
                    >
                        {plan ? "Сменить тариф" : "Выбрать тариф"}
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-6 min-w-0">
                    <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm relative group">
                        <button
                            onClick={() => setIsEditOpen(true)}
                            className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-ink-3 hover:text-accent transition-all z-10"
                        >
                            <Pencil size={12} />
                        </button>
                        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-base md:text-xl text-white shadow-md overflow-hidden bg-blue-500">
                                {backendUser?.avatar_url ? (
                                    <img src={backendUser.avatar_url} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <Building2 size={24} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">{backendUser?.full_name}</h2>
                                <p className="text-[12px] md:text-sm text-ink-3">{backendUser?.email}</p>
                            </div>
                        </div>
                        <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed break-words [overflow-wrap:anywhere] mb-4 md:mb-6">
                            {backendUser?.bio || "Добавьте описание вашей компании."}
                        </p>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex justify-between text-[12px] md:text-sm items-center">
                                <span className="text-ink-3">Сайт</span>
                                {backendUser?.website ? (
                                    <a href={backendUser.website} target="_blank" rel="noreferrer" className="font-medium text-accent flex items-center gap-1">
                                        <Globe size={12} /> Перейти
                                    </a>
                                ) : (
                                    <span className="text-ink-3">Не указан</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6 min-w-0">
                    <div className="flex bg-surface-2 border border-line rounded-xl p-1">
                        <button onClick={() => setActiveTab("jobs")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "jobs" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}>
                            <Briefcase size={16} /> Мои проекты
                        </button>
                        <button onClick={() => setActiveTab("candidates")} className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "candidates" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}>
                            <Users size={16} /> Поиск кандидатов
                        </button>
                    </div>

                    {activeTab === "jobs" && (
                        <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm min-h-[300px]">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                <div className="flex bg-surface-2 border border-line rounded-xl p-1 w-full sm:w-auto">
                                    <button onClick={() => setActiveWorkType("vacancies")} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeWorkType === "vacancies" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}>Вакансии</button>
                                    <button onClick={() => setActiveWorkType("cases")} className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeWorkType === "cases" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}>Кейсы</button>
                                </div>
                                <button
                                    onClick={() => { if (activeWorkType === "vacancies") { setEditingJob(null); setIsJobOpen(true); } else { setIsCaseOpen(true); } }}
                                    className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-accent-2 transition-colors w-full sm:w-auto justify-center"
                                >
                                    <Plus size={16} /> Создать {activeWorkType === "vacancies" ? "вакансию" : "кейс"}
                                </button>
                            </div>

                            {currentList.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {currentList.map((job: any) => (
                                        <div key={job.id} onClick={() => handleJobClick(job)} className="relative p-4 border border-line rounded-xl bg-surface-2 flex flex-col justify-between">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setEditingJob(job); if (job.type === "case") setIsCaseOpen(true); else setIsJobOpen(true); }}
                                                className="absolute top-3 right-3 p-1.5 text-ink-3 hover:text-accent hover:bg-accent/10 rounded transition-colors z-10"
                                                title="Редактировать"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            
                                            <div>
                                                <div className="flex justify-between items-start mb-1 gap-2 pr-8">
                                                    <h4 className="font-semibold text-[15px] text-ink">{job.title}</h4>
                                                    {job.type === "case" && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full ml-2">Кейс</span>}
                                                </div>
                                                <p className="text-[12px] text-ink-3 line-clamp-2 mb-3">{job.description}</p>
                                            </div>
                                            
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[11px] text-ink-3 flex-wrap">
                                                    <span className="px-2 py-1 bg-surface border border-line rounded">{job.stack}</span>
                                                    {job.languages && <span className="px-2 py-1 bg-surface border border-line rounded max-w-[200px] truncate" title={job.languages}>{job.languages}</span>}
                                                    <span className="px-2 py-1 bg-surface border border-line rounded">{job.level}</span>
                                                    {job.format && <span className="px-2 py-1 bg-surface border border-line rounded">{job.format}</span>}
                                                </div>
                                                {job.salary && <div className="text-[13px] font-bold text-accent whitespace-nowrap">{formatSalary(job.salary)}</div>}
                                            </div>
                                            
                                            {job.is_external && (
                                                <div className="mt-3 pt-3 border-t border-line w-full">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/vacancy/${job.id}`, { state: { title: job.title } }); }}
                                                        className="w-full py-1.5 bg-surface border border-line rounded text-[12px] font-medium text-ink-2 hover:text-accent hover:border-accent transition-colors"
                                                    >
                                                        Посмотреть отклики
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                                    <Briefcase size={32} className="mx-auto text-ink-4 mb-3" />
                                    <div className="text-[15px] font-medium mb-1">{activeWorkType === "vacancies" ? "Пока нет вакансий" : "Пока нет кейсов"}</div>
                                    <button onClick={() => { setEditingJob(null); setIsJobOpen(true); }} className="text-[13px] text-accent font-medium hover:underline">
                                        Создать {activeWorkType === "vacancies" ? "первую вакансию" : "первый кейс"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "candidates" && (
                        <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm animate-in fade-in duration-200">
                            <div className="flex flex-col gap-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <h3 className="font-semibold text-lg flex items-center gap-2"><Search size={18} className="text-accent" /> Подходящие кандидаты</h3>
                                    </div>
                                    {(filterGrade || filterStack || selectedJobId) && (
                                        <button onClick={resetFilters} className="text-[12px] text-ink-3 hover:text-red-400 flex items-center gap-1 transition-colors">
                                            <X size={12} /> Сбросить фильтры
                                        </button>
                                    )}
                                </div>

                                {/* ПАНЕЛЬ ФИЛЬТРОВ (без языков) */}
                                <div className="flex flex-wrap items-center gap-2 w-full">
                                    {jobs.length > 0 && (
                                        <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                                            <button
                                                onClick={() => { setOpenJob(!openJob); setOpenGrade(false); setOpenStack(false); }}
                                                className="w-full bg-surface-2 border border-line text-sm text-ink rounded-lg px-3 py-2 outline-none flex items-center justify-between gap-2 hover:bg-surface-3 transition-colors min-w-[160px]"
                                            >
                                                <span className="truncate max-w-[130px]">Вакансия: <b>{selectedJobTitle}</b></span>
                                                <ChevronDown size={14} className={`transition-transform duration-200 ${openJob ? "rotate-180" : ""}`} />
                                            </button>

                                            {openJob && (
                                                <div className="absolute top-full left-0 mt-1.5 w-[220px] bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                                                    <button onClick={() => { resetFilters(); setOpenJob(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2">
                                                        Все вакансии
                                                        {!selectedJobId && <Check size={14} className="text-accent shrink-0" />}
                                                    </button>
                                                    {jobs.filter((j: any) => !j.is_external).map((j: any) => (
                                                        <button key={j.id} onClick={() => { handleJobClick(j); setOpenJob(false); }} className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2">
                                                            <span className="truncate pr-2">{j.title}</span>
                                                            {selectedJobId === j.id && <Check size={14} className="text-accent shrink-0" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <CustomSelect value={filterStack} options={STACKS.map((s) => ({ value: s, label: s }))} onChange={setFilterStack} open={openStack} setOpen={(v: boolean) => { setOpenStack(v); setOpenJob(false); setOpenGrade(false); }} placeholder="Все стеки" icon={Layers} />
                                    <CustomSelect value={filterGrade} options={["Junior", "Middle", "Senior"].map((g) => ({ value: g, label: g }))} onChange={setFilterGrade} open={openGrade} setOpen={(v: boolean) => { setOpenGrade(v); setOpenJob(false); setOpenStack(false); }} placeholder="Все грейды" />

                                    {selectedCandidates.length > 0 && (
                                        <button onClick={() => setIsCompareOpen(true)} className="w-full sm:w-auto px-4 py-2 bg-surface-2 text-accent rounded-lg text-sm font-medium hover:bg-surface-3 hover:border-accent transition-colors flex items-center justify-center gap-2 active:scale-95">
                                            <Scale size={16} /> Сравнить ({selectedCandidates.length})
                                        </button>
                                    )}
                                </div>
                            </div>

                            {loadingCandidates ? (
                                <div className="text-center py-10 text-ink-3">Загрузка базы талантов...</div>
                            ) : candidates.length > 0 ? (
                                <div className="space-y-3">
                                    {candidates.slice(0, 10).map((cand: any) => {
                                        const isSelected = selectedCandidates.includes(cand.id);
                                        return (
                                            <div key={cand.id} className={`flex items-start gap-3 p-3.5 border rounded-xl transition-colors ${isSelected ? "border-accent bg-accent/5" : "border-line bg-surface-2 hover:border-line-2"}`}>
                                                <button onClick={() => toggleSelect(cand.id)} className="mt-1 text-ink-3 hover:text-accent transition-colors focus:outline-none">
                                                    {isSelected ? <CheckSquare size={20} className="text-accent" /> : <Square size={20} />}
                                                </button>

                                                <div className="flex-1 min-w-0 overflow-hidden">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div onClick={() => navigate(`/profile/${cand.id}`)} className="font-semibold text-[15px] text-ink truncate flex items-center gap-2 hover:text-accent cursor-pointer transition-colors">
                                                            {cand.full_name}
                                                            <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                <ShieldCheck size={10} /> {cand.final_grade}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm font-bold text-accent whitespace-nowrap ml-2">~ {cand.estimated_salary.toLocaleString("ru-RU")} ₽</div>
                                                    </div>

                                                    <div className="flex items-center gap-4 mt-2">
                                                        <div className="text-[12px] font-medium text-ink-2">Совпадение: {cand.match_score}%</div>
                                                        <div className="text-[11px] text-ink-3">Балл: {cand.total_score}/100</div>
                                                    </div>

                                                    <div className="text-[12px] text-ink-3 flex items-center gap-3 flex-wrap">
                                                        <span className="capitalize">{cand.stack} • {cand.language}</span>
                                                        <span className="flex items-center gap-1 text-ink-4">
                                                            <Star size={12} /> <span className="text-ink-2 font-medium">{cand.github_stars}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => { 
                                                        e.stopPropagation(); 
                                                        handleHireClick({ ...cand, token_cost: cand.final_grade === "Senior" ? 350 : cand.final_grade === "Middle" ? 200 : 100 }); 
                                                    }}
                                                    className="self-center px-4 py-1.5 bg-accent text-white text-[12px] font-medium rounded-lg hover:bg-accent-2 transition-colors whitespace-nowrap"
                                                >
                                                    Нанять
                                                </button>
                                            </div>
                                        );
                                    })}
                                    
                                    {candidates.length > 10 && (
                                        <button
                                            onClick={() => navigate(`/search?type=candidates${selectedJobId ? `&job_id=${selectedJobId}` : ''}`)}
                                            className="w-full mt-4 py-2.5 bg-surface-2 border border-line rounded-xl text-sm font-medium text-ink hover:bg-surface-3 transition-colors"
                                        >
                                            Показать всех ({candidates.length})
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                                    <Users size={32} className="mx-auto text-ink-4 mb-3" />
                                    <div className="text-[15px] font-medium mb-1">Кандидаты не найдены</div>
                                    <p className="text-[13px] text-ink-3">Попробуйте изменить фильтры.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {isEditOpen && <EditCompanyModal onClose={() => setIsEditOpen(false)} backendUser={backendUser} onRefresh={onRefresh} />}
            {isCaseOpen && <CreateCaseModal onClose={() => setIsCaseOpen(false)} backendUser={backendUser} onRefresh={onRefresh} />}
            {isJobOpen && <CreateJobModal onClose={() => setIsJobOpen(false)} backendUser={backendUser} onRefresh={handleJobCreated} jobToEdit={editingJob} />}
            {isCompareOpen && <CompareCandidatesModal candidates={candidatesToCompare} onClose={() => setIsCompareOpen(false)} />}
            {hireCandidate && <HireConfirmModal candidate={hireCandidate} onClose={() => setHireCandidate(null)} onConfirm={confirmHire} loading={isHiring} />}
        </div>
    );
}
