import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Plus, Pencil, Briefcase, Users, Globe, ShieldCheck, Scale, CheckSquare, Square, Star } from "lucide-react";
import { EditCompanyModal } from "@/components/modals/EditCompanyModal";
import { CreateJobModal } from "@/components/modals/CreateJobModal";
import { CompareCandidatesModal } from "@/components/modals/CompareCandidatesModal";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

export function CompanyDashboard({ backendUser, onRefresh }: { backendUser: any, onRefresh: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isJobOpen, setIsJobOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [filterGrade, setFilterGrade] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  
  // Состояние для выбора кандидатов (макс 3)
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);

  const fetchCandidates = () => {
    setLoadingCandidates(true);
    authApi.searchCandidates({ grade: filterGrade }).then(res => {
      setCandidates(res.data || []);
      setLoadingCandidates(false);
    }).catch((err) => {
      console.error("Ошибка загрузки кандидатов:", err);
      setCandidates([]);
      setLoadingCandidates(false);
    });
  };

  useEffect(() => {
    fetchCandidates();
  }, [filterGrade]);

  const toggleSelect = (id: number) => {
    if (selectedCandidates.includes(id)) {
      setSelectedCandidates(prev => prev.filter(c => c !== id));
    } else {
      if (selectedCandidates.length >= 3) {
        toast("Можно сравнивать не более 3-х кандидатов");
        return;
      }
      setSelectedCandidates(prev => [...prev, id]);
    }
  };

  const jobs = backendUser?.job_postings || [];
  const candidatesToCompare = candidates.filter(c => selectedCandidates.includes(c.id));

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">Кабинет компании</h1>
          <p className="text-ink-2 text-[13px] md:text-[15px]">Управление вакансиями и поиск талантов</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
        {/* ЛЕВАЯ КОЛОНКА: ПРОФИЛЬ */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm relative group">
            <button onClick={() => setIsEditOpen(true)} className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-ink-3 hover:text-accent transition-all z-10">
              <Pencil size={12} />
            </button>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-base md:text-xl text-white shadow-md overflow-hidden bg-blue-500">
                {backendUser?.avatar_url ? <img src={backendUser.avatar_url} alt="Logo" className="w-full h-full object-cover" /> : <Building2 size={24} />}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{backendUser?.full_name}</h2>
                <p className="text-[12px] md:text-sm text-ink-3">{backendUser?.email}</p>
              </div>
            </div>
            <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed mb-4 md:mb-6">
              {backendUser?.bio || "Добавьте описание вашей компании."}
            </p>
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-[12px] md:text-sm items-center">
                <span className="text-ink-3">Сайт</span>
                {backendUser?.website ? (
                  <a href={backendUser.website} target="_blank" rel="noreferrer" className="font-medium text-accent flex items-center gap-1"><Globe size={12} /> Перейти</a>
                ) : <span className="text-ink-3">Не указан</span>}
              </div>
            </div>
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА: ВАКАНСИИ И КАНДИДАТЫ */}
        <div className="space-y-4 md:space-y-6">
          
          {/* ВАКАНСИИ */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><Briefcase size={16} className="text-accent" /> Мои вакансии</h3>
              <button onClick={() => setIsJobOpen(true)} className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium flex items-center gap-1 hover:bg-accent-2 transition-colors"><Plus size={16} /> Создать</button>
            </div>
            
            {jobs.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {jobs.map((job: any) => (
                  <div key={job.id} className="p-4 border border-line rounded-xl bg-surface-2 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-[15px] text-ink mb-1">{job.title}</h4>
                      <p className="text-[12px] text-ink-3 line-clamp-2 mb-3">{job.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-ink-3">
                      <span className="px-2 py-1 bg-surface border border-line rounded">{job.stack}</span>
                      <span className="px-2 py-1 bg-surface border border-line rounded">{job.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-line-2 rounded-xl bg-surface-2">
                <div className="text-[14px] font-medium mb-1">Пока нет вакансий</div>
                <button onClick={() => setIsJobOpen(true)} className="text-[13px] text-accent font-medium hover:underline">Создать первую вакансию</button>
              </div>
            )}
          </div>

          {/* КАНДИДАТЫ */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
              <div>
                <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><Users size={16} className="text-accent" /> Подходящие кандидаты</h3>
                {jobs.length > 0 && (
                  <select 
                    value={selectedJobId} 
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="mt-1 text-xs bg-surface-2 border border-line rounded-md px-2 py-1 text-ink-3 outline-none"
                  >
                    <option value="">Сравнить со всеми</option>
                    {jobs.map((j: any) => (
                      <option key={j.id} value={j.id}>Под вакансию: {j.title}</option>
                    ))}
                  </select>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                {selectedCandidates.length > 0 && (
                  <button 
                    onClick={() => setIsCompareOpen(true)}
                    className="flex-1 sm:flex-none px-3 py-2 bg-accent/10 text-accent border border-accent/20 rounded-lg text-sm font-medium hover:bg-accent/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <Scale size={16} /> Сравнить ({selectedCandidates.length})
                  </button>
                )}
                
                <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value)} className="bg-surface-2 border border-line text-sm rounded-lg px-3 py-2 outline-none">
                  <option value="">Все грейды</option>
                  <option value="Junior">Junior</option>
                  <option value="Middle">Middle</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
            </div>

            {loadingCandidates ? (
              <div className="text-center py-4 text-ink-3">Загрузка...</div>
            ) : candidates.length > 0 ? (
              <div className="space-y-3">
                {candidates.map((cand: any) => {
                  const isSelected = selectedCandidates.includes(cand.id);
                  return (
                    <div key={cand.id} className={`flex items-start gap-3 p-3 border rounded-xl transition-colors ${isSelected ? "border-accent bg-accent/5" : "border-line bg-surface-2"}`}>
                      
                      {/* Чекбокс */}
                      <button onClick={() => toggleSelect(cand.id)} className="mt-1 text-ink-3 hover:text-accent transition-colors">
                        {isSelected ? <CheckSquare size={20} className="text-accent" /> : <Square size={20} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-semibold text-[15px] text-ink truncate flex items-center gap-2">
                            {cand.full_name}
                            <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck size={10} /> {cand.final_grade}</span>
                          </div>
                          <div className="text-sm font-bold text-accent whitespace-nowrap ml-2">
                            ~ {cand.estimated_salary.toLocaleString('ru-RU')} ₽
                          </div>
                        </div>
                        
                        <div className="text-[12px] text-ink-3 flex items-center gap-3 flex-wrap">
                          <span>{cand.stack} • {cand.language}</span>
                          <span className="flex items-center gap-1"><Star size={12} className="text-amber-500"/> {cand.github_stars} звезд</span>
                        </div>

                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-[11px] font-medium text-ink-2">Совпадение: {cand.match_score}%</div>
                          <div className="text-[11px] text-ink-3">Тест: {cand.total_score}/100</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-line-2 rounded-xl bg-surface-2">
                <div className="text-[14px] font-medium mb-1">Кандидаты не найдены</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && <EditCompanyModal onClose={() => setIsEditOpen(false)} backendUser={backendUser} onRefresh={onRefresh} />}
        {isJobOpen && <CreateJobModal onClose={() => setIsJobOpen(false)} backendUser={backendUser} onRefresh={onRefresh} />}
        {isCompareOpen && <CompareCandidatesModal candidates={candidatesToCompare} onClose={() => setIsCompareOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
