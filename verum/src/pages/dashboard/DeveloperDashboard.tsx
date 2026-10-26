import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ScoreRow } from "@/components/ui/ScoreRow";
import { ShieldCheck, Github, Plus, Pencil, Trash2, Image as ImageIcon, Star, GitFork, GitCommit, AlertCircle, Banknote, Brain, CheckCircle2, RefreshCw, Layers, Code2, Monitor, Server, Smartphone, Cloud, Database, Atom, Hexagon, Braces, Palette, Terminal, Rabbit, Coffee, Hash, AlignLeft, FileCode2 } from "lucide-react";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { InterviewModal } from "@/components/modals/InterviewModal";
import { authApi } from "@/api";
import { toast } from "@/components/layout/ToastContainer";

const LANG_COLORS = ["bg-[#3178c6]", "bg-[#e34c26]", "bg-[#178600]", "bg-[#3572A5]", "bg-[#f1e05a]", "bg-[#89e051]"];

export function DeveloperDashboard({ backendUser, onRefresh }: { backendUser: any, onRefresh: () => void }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [showAllRepos, setShowAllRepos] = useState(false);
  
  const initials = backendUser?.full_name?.substring(0, 2).toUpperCase() || "??";
  const skills = backendUser?.skills;
  const isPending = backendUser?.test_status === "pending";
  const isRejected = backendUser?.test_status === "rejected";
  const isTested = !!skills && skills.final_grade && skills.final_grade !== "Reject";
  const githubData = backendUser?.github_stats;
  const projects = backendUser?.projects || [];

  const lastTestDate = backendUser?.last_test_at ? new Date(backendUser.last_test_at) : null;
  const sixMonthsMs = 180 * 24 * 60 * 60 * 1000;
  const canRetake = !lastTestDate || (new Date().getTime() - lastTestDate.getTime() > sixMonthsMs);
  const nextRetakeDate = lastTestDate ? new Date(lastTestDate.getTime() + sixMonthsMs).toLocaleDateString('ru-RU') : null;

  const handleRetakeClick = () => {
    if (!canRetake) {
      toast(`⏳ Перепройти тест можно будет с ${nextRetakeDate}. (Сейчас режим тестирования: блокировка не работает)`);
      // return;  // <-- Раскомментируй эту строку, чтобы включить блокировку
    }
    setIsInterviewOpen(true); 
  };

  const getLangColor = (langName: string) => {
    if (!githubData?.languages) return "bg-accent/60";
    const index = githubData.languages.findIndex((l: any) => l.name === langName);
    return index !== -1 ? LANG_COLORS[index % LANG_COLORS.length] : "bg-accent/60";
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Вы уверены, что хотите удалить проект?")) return;
    try {
      const updatedProjects = projects.filter((p: any) => p.id !== projectId);
      await authApi.updateProfile({ projects: updatedProjects });
      onRefresh();
    } catch (e) { console.error("Ошибка удаления", e); }
  };

  const calculateSalary = () => {
    if (!skills || skills.final_grade === "Reject") return 0;
    const score = skills.total_score_100 || 0;
    const grade = skills.final_grade;
    const baseSalaries: Record<string, number> = { "Junior": 60000, "Middle": 150000, "Senior": 250000 };
    const baseSalary = baseSalaries[grade] || 0;
    const scoreModifier = 0.8 + (score / 100) * 0.5;
    const testSalary = baseSalary * scoreModifier;
    const stars = githubData?.total_stars || 0;
    const githubBonus = Math.min(stars * 1000, 30000);
    return Math.round(testSalary + githubBonus);
  };
  const estimatedSalary = calculateSalary();


  const STACK_ICONS: Record<string, any> = {
    "frontend": Monitor,
    "backend": Server,
    "fullstack": Layers,
    "mobile": Smartphone,
    "devops": Cloud,
    "data / ml": Database,
  };

  const LANG_ICONS: Record<string, any> = {
    "html": FileCode2,
    "css": Palette,
    "js": Braces,
    "ts": FileCode2,
    "react": Atom,
    "vue": Hexagon,
    "python": Terminal,
    "go": Rabbit,
    "java": Coffee,
    "csharp": Hash,
    "kotlin": Code2,
    "swift": Code2,
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">Личный кабинет</h1>
          <p className="text-ink-2 text-[13px] md:text-[15px]">Добро пожаловать, <span className="font-medium text-ink">{backendUser?.full_name || "Разработчик"}</span></p>
        </div>
        {isPending ? (
              <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-line-2">
                <ShieldCheck size={32} className="mx-auto text-accent mb-2 opacity-80" />
                <div className="text-[15px] font-medium text-ink mb-1">Собеседование на проверке</div>
                <p className="text-[13px] text-ink-3">Модератор проверяет ваше видео. Результаты появятся позже.</p>
              </div>
            ) : isRejected ? (
              <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-warn/40">
                <AlertCircle size={32} className="mx-auto text-warn mb-2 opacity-80" />
                <div className="text-[15px] font-medium text-ink mb-1">Собеседование отклонено</div>
                <p className="text-[13px] text-ink-3">Модератор отклонил результаты. Попробуйте еще раз позже.</p>
              </div>
            ) : isTested ? (
          <div className="flex items-center gap-2 md:gap-3 bg-surface border border-line rounded-xl px-3 md:px-4 py-2">
            <ShieldCheck className="text-accent" size={18} />
            <div>
              <div className="text-[12px] md:text-[13px] font-medium">Профиль проверен</div>
              <div className="text-[10px] md:text-[11.5px] text-ink-3">Уровень {skills.final_grade} подтверждён</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-3 bg-surface border border-line rounded-xl px-3 md:px-4 py-2">
            <AlertCircle className="text-warn" size={18} />
            <div>
              <div className="text-[12px] md:text-[13px] font-medium">Профиль не проверен</div>
              <div className="text-[10px] md:text-[11.5px] text-ink-3">Пройдите собеседование</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-4 md:gap-6">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm relative group">
            <button onClick={() => setIsEditOpen(true)} className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-ink-3 hover:text-accent transition-all z-10">
              <Pencil size={12} className="md:w-3.5 md:h-3.5" />
            </button>
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-base md:text-xl text-white shadow-md overflow-hidden bg-accent">
                {backendUser?.avatar_url ? <img src={backendUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : initials}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{backendUser?.full_name || "Разработчик"}</h2>
                <p className="text-[12px] md:text-sm text-ink-3">{backendUser?.github_username ? `@${backendUser.github_username}` : "@username"}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1.5 flex items-center gap-1.5">
                <AlignLeft size={12} /> О себе
              </div>
              <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed">
                {backendUser?.bio || "Добавьте описание своего опыта в настройках профиля."}
              </p>
            </div>

            {/* ЕДИНАЯ КРАСИВАЯ КАРТОЧКА НАВЫКОВ */}
            {isTested && (
              <div className="bg-surface-2 border border-line rounded-xl overflow-hidden shadow-sm mb-6">
                <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
                  <div className="p-4 flex flex-col justify-center">
                    <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-accent" /> Уровень
                    </div>
                    <div className="text-2xl font-bold text-accent">{skills.final_grade}</div>
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1.5">
                      <Banknote size={14} className="text-accent" /> Доход
                    </div>
                    <div className="text-xl font-bold text-ink">~ {estimatedSalary.toLocaleString('ru-RU')} <span className="text-[13px] text-ink-3 font-normal">₽</span></div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {skills.stack_id && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1.5 flex items-center gap-1.5">
                        <Layers size={14} /> Стек
                      </div>
                      <div className="inline-flex px-2.5 py-1 bg-surface border border-line rounded-md text-[13px] font-medium text-ink capitalize">
                        {skills.stack_id}
                      </div>
                    </div>
                  )}
                  {skills.language_id && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1.5 flex items-center gap-1.5">
                        <Code2 size={14} /> Языки
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.language_id.split(',').map((lang: string) => (
                          <span key={lang} className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface border border-line rounded text-[11px] font-medium text-ink-2 uppercase">
                            {(() => {
                              const LIcon = LANG_ICONS[lang.trim().toLowerCase()] || Code2;
                              return <LIcon size={12} className="text-ink-3" />;
                            })()}
                            {lang.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* КНОПКА ПЕРЕПРОЙТИ */}
            {isTested && (
              <div className="pt-4 border-t border-line">
                <button 
                  onClick={handleRetakeClick} 
                  className="w-full py-2.5 bg-surface-2 border border-line-2 hover:border-accent hover:text-accent rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Перепройти собеседование
                </button>
                {!canRetake && (
                  <p className="text-[11px] text-ink-3 text-center mt-2">
                    По правилам платформы следующая попытка доступна с {nextRetakeDate}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="space-y-4 md:space-y-6">
          {/* НАВЫКИ И АНАЛИЗ ИИ */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Навыки и ИИ-Анализ</h3>
            </div>

            {isPending ? (
              <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-line-2">
                <ShieldCheck size={32} className="mx-auto text-accent mb-2 opacity-80" />
                <div className="text-[15px] font-medium text-ink mb-1">Собеседование на проверке</div>
                <p className="text-[13px] text-ink-3">Модератор проверяет ваше видео. Результаты появятся позже.</p>
              </div>
            ) : isRejected ? (
              <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-warn/40">
                <AlertCircle size={32} className="mx-auto text-warn mb-2 opacity-80" />
                <div className="text-[15px] font-medium text-ink mb-1">Собеседование отклонено</div>
                <p className="text-[13px] text-ink-3">Модератор отклонил результаты. Попробуйте еще раз позже.</p>
              </div>
            ) : isTested ? (
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-2">
                  <ScoreRow label="Архитектурное мышление" value={skills.competency_architecture || 0} delay={0} />
                  <ScoreRow label="Ревью кода ИИ" value={skills.competency_code_understanding || 0} delay={1} />
                  <ScoreRow label="Работа с ИИ" value={skills.competency_prompting || 0} delay={2} />
                  <ScoreRow label="Адаптация" value={skills.competency_adaptability || 0} warn={(skills.competency_adaptability || 0) < 80} delay={3} />
                  <ScoreRow label="Soft Skills" value={skills.competency_soft_skills || 0} delay={4} />
                </div>

                {skills.summary && (
                  <div className="bg-surface-2 border border-line p-4 rounded-xl space-y-4">
                    <div>
                      <h4 className="text-[13px] font-bold uppercase tracking-wider text-ink-3 mb-2 flex items-center gap-2"><Brain size={16}/> Вердикт ИИ</h4>
                      <p className="text-[14px] leading-relaxed text-ink-2">{skills.summary}</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-line">
                      <div>
                        <h4 className="text-[12px] font-bold text-accent mb-2 flex items-center gap-1"><CheckCircle2 size={14}/> Сильные стороны</h4>
                        <ul className="list-disc pl-4 text-[13px] text-ink-2 space-y-1">
                          {skills.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-warn mb-2 flex items-center gap-1"><AlertCircle size={14}/> Зоны роста</h4>
                        <ul className="list-disc pl-4 text-[13px] text-ink-2 space-y-1">
                          {skills.gaps?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 md:py-6">
                <ShieldCheck size={32} className="mx-auto text-ink-4 mb-2 md:mb-3 opacity-30 md:w-10 md:h-10" />
                <div className="text-[14px] md:text-[15px] font-medium mb-1">Навыки не проверены</div>
                <p className="text-[12px] md:text-[13px] text-ink-3 mb-3 md:mb-4">Пройдите собеседование, чтобы подтвердить уровень и получить ИИ-анализ</p>
                <button onClick={() => setIsInterviewOpen(true)} className="px-4 md:px-5 py-2 bg-accent text-white rounded-lg text-[13px] md:text-sm font-medium hover:bg-accent-2 transition-colors">
                  Начать собеседование
                </button>
              </div>
            )}
          </div>

          {/* МОИ ПРОЕКТЫ (ПЕРЕМЕЩЕНО ВЫШЕ GITHUB) */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><ImageIcon size={16} className="text-accent" /> Мои проекты</h3>
              <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="h-7 md:h-8 px-2 md:px-3 rounded-lg bg-surface-2 border border-line text-[11px] md:text-[13px] font-medium flex items-center gap-1 hover:bg-surface-3 transition-colors"><Plus size={12} /> Добавить</button>
            </div>
            {projects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                {projects.map((project: any) => (
                  <div key={project.id} className="group relative border border-line rounded-xl overflow-hidden bg-surface flex flex-col">
                    <div className="aspect-video bg-surface-2 relative overflow-hidden">
                      {(project.cover || project.image) ? <img src={project.cover || project.image} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ink-4"><ImageIcon size={24} /></div>}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.preventDefault(); setEditingProject(project); setIsProjectModalOpen(true); }} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 text-ink-2 hover:text-accent flex items-center justify-center transition-colors"><Pencil size={12} /></button>
                        <button onClick={(e) => { e.preventDefault(); handleDeleteProject(project.id); }} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 text-red-600 hover:text-red-700 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col">
                      <h4 className="font-medium text-[13px] md:text-[14px] mb-1">{project.title}</h4>
                      <p className="text-[11px] md:text-[12.5px] text-ink-3 line-clamp-2 mb-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 border border-dashed border-line-2 rounded-xl bg-surface-2">
                <div className="text-[13px] md:text-[14px] font-medium mb-1">Пока нет проектов</div>
                <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }} className="text-[12px] md:text-[13px] text-accent font-medium hover:underline">Создать первый проект</button>
              </div>
            )}
          </div>

          {/* GITHUB (ПЕРЕМЕЩЕНО НИЖЕ ПРОЕКТОВ) */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2"><Github size={16} className="text-accent" /> GitHub</h3>
              {githubData && <span className="text-[11px] md:text-xs text-ink-3">@{githubData.username}</span>}
            </div>
            {githubData ? (
              <>
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{githubData.public_repos}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">репозиториев</div>
                  </div>
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{githubData.total_stars}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">звёзд</div>
                  </div>
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{githubData.followers}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">подписчиков</div>
                  </div>
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Языки</div>
                  </div>
                  <div className="flex w-full h-2.5 rounded-full overflow-hidden mb-3 bg-surface-2">
                    {githubData.languages?.map((lang: any, i: number) => (
                      <div key={lang.name} className={LANG_COLORS[i % LANG_COLORS.length]} style={{ flexGrow: lang.percent, flexBasis: 0 }} title={`${lang.name}: ${lang.percent}%`} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {githubData.languages?.map((lang: any, i: number) => (
                      <span key={lang.name} className="inline-flex items-center gap-1.5 text-[11px] md:text-[12px] text-ink-2">
                        <span className={`w-2 h-2 rounded-full ${LANG_COLORS[i % LANG_COLORS.length]}`} />
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-ink-3">{lang.percent}%</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-2">Репозитории</div>
                  <div className="space-y-2 pr-1">
                    {githubData.projects?.slice(0, showAllRepos ? undefined : 3).map((p: any) => (
                      <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="block p-3 border border-line rounded-xl hover:border-accent/40 hover:bg-surface-2 transition-colors">
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="font-medium text-[13px] md:text-[14px] text-accent truncate">{p.name}</div>
                          <div className="flex items-center gap-3 text-[11px] md:text-[12px] text-ink-3 shrink-0">
                            <span className="flex items-center gap-1"><Star size={12} /> {p.stars}</span>
                            <span className="flex items-center gap-1"><GitFork size={12} /> {p.forks}</span>
                            <span className="flex items-center gap-1"><GitCommit size={12} /> {p.commits || 0}</span>
                          </div>
                        </div>
                        <div className="text-[11px] md:text-[12px] text-ink-3 truncate mb-1.5">{p.description || "Без описания"}</div>
                      </a>
                    ))}
                    {githubData.projects?.length > 3 && (
                      <button onClick={() => setShowAllRepos(!showAllRepos)} className="mt-3 w-full py-2 bg-surface-2 border border-line rounded-xl text-[13px] font-medium text-ink-2 hover:bg-surface-3 transition-colors">
                        {showAllRepos ? "Скрыть" : `Показать все (${githubData.projects.length})`}
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 md:py-6">
                <div className="text-[14px] md:text-[15px] font-medium mb-1">GitHub не подключён</div>
                <a href="http://localhost:8000/api/auth/github" className="mt-3 px-4 md:px-5 py-2 bg-surface-2 border border-line-2 text-ink rounded-lg text-[13px] md:text-sm font-medium hover:bg-surface-3 transition-colors inline-block">Подключить</a>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} backendUser={backendUser} onRefresh={onRefresh} />}
        {isProjectModalOpen && <AddProjectModal onClose={() => setIsProjectModalOpen(false)} backendUser={backendUser} onRefresh={onRefresh} projectToEdit={editingProject} />}
        {isInterviewOpen && <InterviewModal onClose={() => setIsInterviewOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
