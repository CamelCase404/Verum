import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    Banknote,
    Layers,
    Code2,
    X,
} from "lucide-react";
import { EditCompanyModal } from "@/components/modals/EditCompanyModal";
import { CreateJobModal } from "@/components/modals/CreateJobModal";
import { CompareCandidatesModal } from "@/components/modals/CompareCandidatesModal";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

const STACKS = [
    "Frontend",
    "Backend",
    "Fullstack",
    "Mobile",
    "DevOps",
    "Data / ML",
];
const LANGS = [
    "html",
    "css",
    "js",
    "ts",
    "react",
    "vue",
    "python",
    "go",
    "java",
    "csharp",
    "kotlin",
    "swift",
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
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<"jobs" | "candidates">("jobs");

    const [candidates, setCandidates] = useState<any[]>([]);
    const [loadingCandidates, setLoadingCandidates] = useState(true);

    // Фильтры
    const [filterGrade, setFilterGrade] = useState("");
    const [filterStack, setFilterStack] = useState("");
    const [filterLang, setFilterLang] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string>("");

    // Состояния открытия дропдаунов
    const [openGrade, setOpenGrade] = useState(false);
    const [openStack, setOpenStack] = useState(false);
    const [openLang, setOpenLang] = useState(false);
    const [openJob, setOpenJob] = useState(false);

    const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

    const jobs = backendUser?.job_postings || [];

    const fetchCandidates = () => {
        setLoadingCandidates(true);
        authApi
            .searchCandidates({
                grade: filterGrade,
                stack: filterStack,
                language: filterLang,
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
    }, [filterGrade, filterStack, filterLang, selectedJobId, activeTab]);

    // При клике на вакансию - подставляем её стек и уровень
    const handleJobClick = (job: any) => {
        setSelectedJobId(job.id);
        setFilterStack(job.stack || "");
        setFilterGrade(job.level || "");
        setFilterLang(""); // Язык оставляем пустым, чтобы компания сама выбрала
        setActiveTab("candidates");
    };

    // Сброс фильтров
    const resetFilters = () => {
        setFilterStack("");
        setFilterGrade("");
        setFilterLang("");
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

    const candidatesToCompare = candidates.filter((c) =>
        selectedCandidates.includes(c.id),
    );

    const handleJobCreated = () => {
        setIsJobOpen(false);
        onRefresh();
        setActiveTab("candidates");
    };

    const selectedJobTitle =
        jobs.find((j: any) => j.id === selectedJobId)?.title || "Все вакансии";

    const formatSalary = (val: string) => {
        if (!val) return "";
        const num = parseInt(val.replace(/\D/g, ""));
        if (isNaN(num)) return val;
        return num.toLocaleString("ru-RU") + " ₽";
    };

    // Компонент выпадающего списка
    const CustomSelect = ({
        value,
        options,
        onChange,
        open,
        setOpen,
        placeholder,
        icon: Icon,
    }: any) => (
        <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full bg-surface-2 border border-line text-sm text-ink rounded-lg px-3 py-2 outline-none flex items-center justify-between gap-2 hover:bg-surface-3 transition-colors min-w-[130px]"
            >
                <span className="flex items-center gap-1.5 truncate">
                    {Icon && <Icon size={14} className="text-ink-3" />}
                    {value || placeholder}
                </span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-1.5 w-full min-w-[140px] bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden max-h-60 overflow-y-auto"
                    >
                        <button
                            onClick={() => {
                                onChange("");
                                setOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                        >
                            Все {placeholder.toLowerCase().replace("все ", "")}
                            {value === "" && (
                                <Check size={14} className="text-accent" />
                            )}
                        </button>
                        {options.map((opt: any) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                            >
                                {opt.label}
                                {value === opt.value && (
                                    <Check
                                        size={14}
                                        className="text-accent shrink-0"
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="max-w-[1280px] w-full overflow-hidden mx-auto px-3 md:px-8 py-4 md:py-10 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
                <div>
                    <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">
                        Кабинет компании
                    </h1>
                    <p className="text-ink-2 text-[13px] md:text-[15px]">
                        Управление вакансиями и поиск талантов
                    </p>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
                <div className="space-y-4 md:space-y-6">
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
                                    <img
                                        src={backendUser.avatar_url}
                                        alt="Logo"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Building2 size={24} />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold">
                                    {backendUser?.full_name}
                                </h2>
                                <p className="text-[12px] md:text-sm text-ink-3">
                                    {backendUser?.email}
                                </p>
                            </div>
                        </div>
                        <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed break-words mb-4 md:mb-6">
                            {backendUser?.bio ||
                                "Добавьте описание вашей компании."}
                        </p>
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex justify-between text-[12px] md:text-sm items-center">
                                <span className="text-ink-3">Сайт</span>
                                {backendUser?.website ? (
                                    <a
                                        href={backendUser.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium text-accent flex items-center gap-1"
                                    >
                                        <Globe size={12} /> Перейти
                                    </a>
                                ) : (
                                    <span className="text-ink-3">
                                        Не указан
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-6">
                    <div className="flex bg-surface-2 border border-line rounded-xl p-1">
                        <button
                            onClick={() => setActiveTab("jobs")}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "jobs" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}
                        >
                            <Briefcase size={16} /> Мои вакансии
                        </button>
                        <button
                            onClick={() => setActiveTab("candidates")}
                            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "candidates" ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"}`}
                        >
                            <Users size={16} /> Поиск кандидатов
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "jobs" && (
                            <motion.div
                                key="jobs"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        Активные вакансии
                                    </h3>
                                    <button
                                        onClick={() => setIsJobOpen(true)}
                                        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-accent-2 transition-colors"
                                    >
                                        <Plus size={16} /> Создать
                                    </button>
                                </div>

                                {jobs.length > 0 ? (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {jobs.map((job: any) => (
                                            <div
                                                key={job.id}
                                                onClick={() =>
                                                    handleJobClick(job)
                                                }
                                                className="p-4 border border-line rounded-xl bg-surface-2 hover:border-accent cursor-pointer transition-colors group flex flex-col justify-between"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-1 gap-2">
                                                        <h4 className="font-semibold text-[15px] text-ink group-hover:text-accent transition-colors">
                                                            {job.title}
                                                        </h4>
                                                    </div>
                                                    <p className="text-[12px] text-ink-3 line-clamp-2 mb-3">
                                                        {job.description}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-[11px] text-ink-3">
                                                        <span className="px-2 py-1 bg-surface border border-line rounded">
                                                            {job.stack}
                                                        </span>
                                                        <span className="px-2 py-1 bg-surface border border-line rounded">
                                                            {job.level}
                                                        </span>
                                                    </div>
                                                    {job.salary && (
                                                        <div className="text-[13px] font-bold text-accent flex items-center gap-1">
                                                            <Banknote
                                                                size={14}
                                                            />{" "}
                                                            {formatSalary(
                                                                job.salary,
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                                        <Briefcase
                                            size={32}
                                            className="mx-auto text-ink-4 mb-3"
                                        />
                                        <div className="text-[15px] font-medium mb-1">
                                            Пока нет вакансий
                                        </div>
                                        <button
                                            onClick={() => setIsJobOpen(true)}
                                            className="text-[13px] text-accent font-medium hover:underline"
                                        >
                                            Создать первую вакансию
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "candidates" && (
                            <motion.div
                                key="candidates"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm"
                            >
                                <div className="flex flex-col gap-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <Search
                                                size={18}
                                                className="text-accent"
                                            />{" "}
                                            Подходящие кандидаты
                                        </h3>
                                        {(filterGrade ||
                                            filterStack ||
                                            filterLang ||
                                            selectedJobId) && (
                                            <button
                                                onClick={resetFilters}
                                                className="text-[12px] text-ink-3 hover:text-red-400 flex items-center gap-1 transition-colors"
                                            >
                                                <X size={12} /> Сбросить фильтры
                                            </button>
                                        )}
                                    </div>

                                    {/* ПАНЕЛЬ ФИЛЬТРОВ */}
                                    <div className="flex flex-wrap items-center gap-2 w-full">
                                        {/* ВЫБОР ВАКАНСИИ */}
                                        {jobs.length > 0 && (
                                            <div className="relative w-full sm:w-auto flex-1 sm:flex-none">
                                                <button
                                                    onClick={() => {
                                                        setOpenJob(!openJob);
                                                        setOpenGrade(false);
                                                        setOpenStack(false);
                                                        setOpenLang(false);
                                                    }}
                                                    className="w-full bg-surface-2 border border-line text-sm text-ink rounded-lg px-3 py-2 outline-none flex items-center justify-between gap-2 hover:bg-surface-3 transition-colors min-w-[160px]"
                                                >
                                                    <span className="truncate max-w-[130px]">
                                                        Вакансия:{" "}
                                                        <b>
                                                            {selectedJobTitle}
                                                        </b>
                                                    </span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`transition-transform duration-200 ${openJob ? "rotate-180" : ""}`}
                                                    />
                                                </button>

                                                <AnimatePresence>
                                                    {openJob && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                y: -5,
                                                                scale: 0.95,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                y: -5,
                                                                scale: 0.95,
                                                            }}
                                                            transition={{
                                                                duration: 0.15,
                                                            }}
                                                            className="absolute top-full left-0 mt-1.5 w-[220px] bg-surface border border-line rounded-xl shadow-xl z-50 py-1 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    resetFilters();
                                                                    setOpenJob(
                                                                        false,
                                                                    );
                                                                }}
                                                                className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                                                            >
                                                                Все вакансии
                                                                {!selectedJobId && (
                                                                    <Check
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-accent shrink-0"
                                                                    />
                                                                )}
                                                            </button>
                                                            {jobs.map(
                                                                (j: any) => (
                                                                    <button
                                                                        key={
                                                                            j.id
                                                                        }
                                                                        onClick={() => {
                                                                            handleJobClick(
                                                                                j,
                                                                            );
                                                                            setOpenJob(
                                                                                false,
                                                                            );
                                                                        }}
                                                                        className="w-full text-left px-3.5 py-2 text-[13px] hover:bg-surface-2 flex items-center justify-between transition-colors text-ink-2"
                                                                    >
                                                                        <span className="truncate pr-2">
                                                                            {
                                                                                j.title
                                                                            }
                                                                        </span>
                                                                        {selectedJobId ===
                                                                            j.id && (
                                                                            <Check
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-accent shrink-0"
                                                                            />
                                                                        )}
                                                                    </button>
                                                                ),
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        <CustomSelect
                                            value={filterStack}
                                            options={STACKS.map((s) => ({
                                                value: s,
                                                label: s,
                                            }))}
                                            onChange={setFilterStack}
                                            open={openStack}
                                            setOpen={(v: boolean) => {
                                                setOpenStack(v);
                                                setOpenJob(false);
                                                setOpenGrade(false);
                                                setOpenLang(false);
                                            }}
                                            placeholder="Все стеки"
                                            icon={Layers}
                                        />

                                        <CustomSelect
                                            value={filterLang}
                                            options={LANGS.map((l) => ({
                                                value: l,
                                                label: l.toUpperCase(),
                                            }))}
                                            onChange={setFilterLang}
                                            open={openLang}
                                            setOpen={(v: boolean) => {
                                                setOpenLang(v);
                                                setOpenJob(false);
                                                setOpenGrade(false);
                                                setOpenStack(false);
                                            }}
                                            placeholder="Все языки"
                                            icon={Code2}
                                        />

                                        <CustomSelect
                                            value={filterGrade}
                                            options={[
                                                "Junior",
                                                "Middle",
                                                "Senior",
                                            ].map((g) => ({
                                                value: g,
                                                label: g,
                                            }))}
                                            onChange={setFilterGrade}
                                            open={openGrade}
                                            setOpen={(v: boolean) => {
                                                setOpenGrade(v);
                                                setOpenJob(false);
                                                setOpenStack(false);
                                                setOpenLang(false);
                                            }}
                                            placeholder="Все грейды"
                                        />

                                        {selectedCandidates.length > 0 && (
                                            <button
                                                onClick={() =>
                                                    setIsCompareOpen(true)
                                                }
                                                style={{
                                                    outline: "none",
                                                    boxShadow: "none",
                                                    borderColor:
                                                        "var(--line-2)",
                                                }}
                                                className="w-full sm:w-auto px-4 py-2 bg-surface-2 text-accent rounded-lg text-sm font-medium hover:bg-surface-3 hover:border-accent transition-colors flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <Scale size={16} /> Сравнить (
                                                {selectedCandidates.length})
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {loadingCandidates ? (
                                    <div className="text-center py-10 text-ink-3">
                                        Загрузка базы талантов...
                                    </div>
                                ) : candidates.length > 0 ? (
                                    <div className="space-y-3">
                                        {candidates.map((cand: any) => {
                                            const isSelected =
                                                selectedCandidates.includes(
                                                    cand.id,
                                                );
                                            return (
                                                <div
                                                    key={cand.id}
                                                    className={`flex items-start gap-3 p-3.5 border rounded-xl transition-colors ${isSelected ? "border-accent bg-accent/5" : "border-line bg-surface-2 hover:border-line-2"}`}
                                                >
                                                    <button
                                                        onClick={() =>
                                                            toggleSelect(
                                                                cand.id,
                                                            )
                                                        }
                                                        className="mt-1 text-ink-3 hover:text-accent transition-colors focus:outline-none"
                                                    >
                                                        {isSelected ? (
                                                            <CheckSquare
                                                                size={20}
                                                                className="text-accent"
                                                            />
                                                        ) : (
                                                            <Square size={20} />
                                                        )}
                                                    </button>

                                                    <div className="flex-1 min-w-0 overflow-hidden">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/profile/${cand.id}`,
                                                                    )
                                                                }
                                                                className="font-semibold text-[15px] text-ink truncate flex items-center gap-2 hover:text-accent cursor-pointer transition-colors"
                                                            >
                                                                {cand.full_name}
                                                                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                    <ShieldCheck
                                                                        size={
                                                                            10
                                                                        }
                                                                    />{" "}
                                                                    {
                                                                        cand.final_grade
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="text-sm font-bold text-accent whitespace-nowrap ml-2">
                                                                ~{" "}
                                                                {cand.estimated_salary.toLocaleString(
                                                                    "ru-RU",
                                                                )}{" "}
                                                                ₽
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 mt-2">
                                                            <div className="text-[12px] font-medium text-ink-2">
                                                                Совпадение:{" "}
                                                                {
                                                                    cand.match_score
                                                                }
                                                                %
                                                            </div>
                                                            <div className="text-[11px] text-ink-3">
                                                                Тест:{" "}
                                                                {
                                                                    cand.total_score
                                                                }
                                                                /100
                                                            </div>
                                                        </div>

                                                        <div className="text-[12px] text-ink-3 flex items-center gap-3 flex-wrap">
                                                            <span className="capitalize">
                                                                {cand.stack} •{" "}
                                                                {cand.language}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Star
                                                                    size={12}
                                                                    className="text-amber-500"
                                                                />{" "}
                                                                {
                                                                    cand.github_stars
                                                                }{" "}
                                                                звезд
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 border border-dashed border-line-2 rounded-xl bg-surface-2">
                                        <Users
                                            size={32}
                                            className="mx-auto text-ink-4 mb-3"
                                        />
                                        <div className="text-[15px] font-medium mb-1">
                                            Кандидаты не найдены
                                        </div>
                                        <p className="text-[13px] text-ink-3">
                                            Попробуйте изменить фильтры.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {isEditOpen && (
                    <EditCompanyModal
                        onClose={() => setIsEditOpen(false)}
                        backendUser={backendUser}
                        onRefresh={onRefresh}
                    />
                )}
                {isJobOpen && (
                    <CreateJobModal
                        onClose={() => setIsJobOpen(false)}
                        backendUser={backendUser}
                        onRefresh={handleJobCreated}
                    />
                )}
                {isCompareOpen && (
                    <CompareCandidatesModal
                        candidates={candidatesToCompare}
                        onClose={() => setIsCompareOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
