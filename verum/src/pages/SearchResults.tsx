import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Building2, Code2, ShieldCheck } from "lucide-react";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";
import { motion } from "framer-motion";

export function SearchResults() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    
    const type = params.get("type");
    const isJobsSearch = type === "jobs";
    
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-bg py-10 px-4">
            <div className="max-w-[1000px] mx-auto">
                <button onClick={() => navigate("/")} className="flex items-center gap-2 text-ink-2 hover:text-accent mb-6 transition-colors">
                    <ArrowLeft size={18} /> На главную
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isJobsSearch ? "bg-accent/10 text-accent" : "bg-blue/10 text-blue"}`}>
                        {isJobsSearch ? <Code2 size={24} /> : <Building2 size={24} />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{isJobsSearch ? "Найденные вакансии" : "Найденные специалисты"}</h1>
                        <p className="text-[14px] text-ink-3">Найдено результатов: {results.length}</p>
                    </div>
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
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: i * 0.05 }} 
                                key={job.id} 
                                onClick={() => navigate(`/profile/${job.company_id}`)}
                                className="p-5 border border-line rounded-2xl bg-surface hover:border-accent cursor-pointer transition-colors flex flex-col group"
                            >
                                <div className="flex justify-between items-start mb-3 gap-2">
                                    <h3 className="font-semibold text-[17px] leading-tight group-hover:text-accent transition-colors">{job.title}</h3>
                                    {job.salary && <span className="text-sm font-bold text-accent whitespace-nowrap bg-accent/5 px-2.5 py-1 rounded-lg">{job.salary}</span>}
                                </div>
                                <p className="text-[13px] text-ink-3 line-clamp-2 mb-4 flex-1">{job.description}</p>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="text-[11px] bg-bg-2 border border-line px-2 py-1 rounded-md">{job.level}</span>
                                    <span className="text-[11px] bg-bg-2 border border-line px-2 py-1 rounded-md">{job.format}</span>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-line mt-auto">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center overflow-hidden shrink-0 text-xs font-bold">
                                        {job.company_avatar ? (
                                            <img src={job.company_avatar} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 size={16} />
                                        )}
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
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: i * 0.05 }} 
                                key={cand.id} 
                                onClick={() => navigate(`/profile/${cand.id}`)}
                                className="p-4 border border-line rounded-2xl bg-surface flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-accent cursor-pointer transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center text-lg font-bold shrink-0 group-hover:scale-105 transition-transform">
                                    {cand.avatar_url ? (
                                        <img src={cand.avatar_url} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        cand.full_name.substring(0, 2).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-[16px] group-hover:text-accent transition-colors">{cand.full_name}</h3>
                                        <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <ShieldCheck size={10} /> {cand.final_grade}
                                        </span>
                                    </div>
                                    <div className="text-[13px] text-ink-3 mb-2">{cand.stack} • {cand.language}</div>
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
            </div>
        </div>
    );
}
