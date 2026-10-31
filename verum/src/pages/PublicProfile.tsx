import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi, chatApi } from "@/api";
import { ArrowLeft, Github, ShieldCheck, Star, GitFork, GitCommit, Image as ImageIcon, Globe, Briefcase, AlertCircle, X, MessageSquare, Brain, CheckCircle2, Banknote, Layers, Code2, Monitor, Server, Smartphone, Cloud, Database, Atom, Hexagon, Braces, Palette, Terminal, Rabbit, Coffee, Hash, AlignLeft, FileCode2 } from "lucide-react";
import { ViewJobModal } from "@/components/modals/ViewJobModal";
import { Modal } from "@/components/ui/Modal";

const LANG_COLORS = ["bg-[#3178c6]", "bg-[#e34c26]", "bg-[#178600]", "bg-[#3572A5]", "bg-[#f1e05a]", "bg-[#89e051]"];

export function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const formatSalaryText = (val: string) => {
      if (!val) return "";
      if (val.toLowerCase().includes("договоренности")) return val;
      
      const numbers = val.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
          return `${parseInt(numbers[0]).toLocaleString('ru-RU')} — ${parseInt(numbers[1]).toLocaleString('ru-RU')} ₽`;
      } else if (numbers && numbers.length === 1) {
          return `${parseInt(numbers[0]).toLocaleString('ru-RU')} ₽`;
      }
      return val;
  };

  useEffect(() => {
    if (!id || id.trim() === "") {
      setLoading(false);
      setUser(null);
      return;
    }
    authApi.getPublicUser(id as string)
      .then(res => { setUser(res.data); setLoading(false); })
      .catch(() => {
        setLoading(false);
        setUser(null);
      });
  }, [id]);

  if (loading) return <div className="p-10 text-center text-ink">Загрузка профиля...</div>;
  if (!user) return <div className="p-10 text-center text-ink">Пользователь не найден</div>;

  const initials = user?.full_name?.substring(0, 2).toUpperCase() || "??";
  const skills = user?.skills;
  const isTested = !!skills && skills.final_grade && skills.final_grade !== "Reject";
  const githubData = user?.github_stats;

  const handleStartChat = async () => {
    try {
      const res = await chatApi.startChat(user.id);
      window.location.href = `/messages?chat=${res.data.conversation_id}`;
    } catch (e) { console.error("Ошибка создания чата", e); }
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

  const SkillBar = ({ label, score }: { label: string, score: number }) => (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span className="text-ink-2">{label}</span>
        <span className="font-bold text-ink">{score}/100</span>
      </div>
      <div className="h-2 w-full bg-surface-2 rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${score}%` }} />
      </div>
    </div>
  );

  const STACK_ICONS: Record<string, any> = {
    "frontend": Monitor, "backend": Server, "fullstack": Layers,
    "mobile": Smartphone, "devops": Cloud, "data / ml": Database,
  };

  const LANG_ICONS: Record<string, any> = {
    "html": FileCode2, "css": Palette, "js": Braces, "ts": FileCode2,
    "react": Atom, "vue": Hexagon, "python": Terminal, "go": Rabbit,
    "java": Coffee, "csharp": Hash, "kotlin": Code2, "swift": Code2,
  };

  return (
    <div className="max-w-[1000px] w-full mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-2 hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* ЛЕВАЯ КОЛОНКА */}
        <div className="bg-surface border border-line rounded-2xl p-6 h-fit shadow-sm">
          <div className="w-24 h-24 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-bold overflow-hidden mx-auto mb-4 shadow-lg">
            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : initials}
          </div>
          <h1 className="text-xl font-bold text-center mb-1">{user.full_name}</h1>
          <p className="text-sm text-center text-ink-3 mb-4">{user.role === "company" ? "Компания" : "Разработчик"}</p>

          {user.bio && (
            <div className="mb-6 text-center">
              <div className="text-[11px] uppercase tracking-wider text-ink-3 font-semibold mb-1.5 flex items-center justify-center gap-1.5">
                <AlignLeft size={12} /> О себе
              </div>
              <p className="text-sm text-ink-2 leading-relaxed break-words [overflow-wrap:anywhere]">{user.bio}</p>
            </div>
          )}

          {user.website && (
            <a href={user.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm text-accent hover:underline mb-2">
              <Globe size={14} /> {user.website}
            </a>
          )}
          {user.github_username && (
            <a href={`https://github.com/${user.github_username}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm text-ink-2 hover:text-ink mb-4">
              <Github size={14} /> @{user.github_username}
            </a>
          )}

          {isTested && (
            <div className="bg-surface-2 border border-line rounded-xl overflow-hidden shadow-sm mb-6">
              <div className="grid grid-cols-2 divide-x divide-line border-b border-line">
                <div className="p-3 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-accent" /> Уровень
                  </div>
                  <div className="text-xl font-bold text-accent">{skills.final_grade}</div>
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1">
                    <Banknote size={12} className="text-accent" /> Доход
                  </div>
                  <div className="text-lg font-bold text-ink">~ {estimatedSalary.toLocaleString('ru-RU')} <span className="text-[11px] text-ink-3 font-normal">₽</span></div>
                </div>
              </div>
              <div className="p-3 space-y-3">
                {skills.stack_id && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1">
                      <Layers size={12} /> Стек
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface border border-line rounded text-[12px] font-medium text-ink capitalize">
                      {(() => { const Icon = STACK_ICONS[skills.stack_id.toLowerCase()] || Layers; return <Icon size={12} className="text-accent" />; })()}
                      {skills.stack_id}
                    </div>
                  </div>
                )}
                {skills.language_id && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-ink-3 font-semibold mb-1 flex items-center gap-1">
                      <Code2 size={12} /> Языки
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {skills.language_id.split(',').map((lang: string) => (
                        <span key={lang} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-surface border border-line rounded text-[10px] font-medium text-ink-2 uppercase">
                          {(() => { const LIcon = LANG_ICONS[lang.trim().toLowerCase()] || Code2; return <LIcon size={10} className="text-ink-3" />; })()}
                          {lang.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <button onClick={handleStartChat} className="w-full mt-2 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-2 transition-colors flex items-center justify-center gap-2">
            <MessageSquare size={16} /> Написать сообщение
          </button>
        </div>

        {/* ПРАВАЯ КОЛОНКА */}
        <div className="space-y-6">
          {user.role === "developer" && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-accent" /> Навыки и ИИ-Анализ
                </h2>
              </div>

              {isTested ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    <SkillBar label="Архитектурное мышление" score={skills.competency_architecture || 0} />
                    <SkillBar label="Ревью кода ИИ" score={skills.competency_code_understanding || 0} />
                    <SkillBar label="Работа с ИИ" score={skills.competency_prompting || 0} />
                    <SkillBar label="Адаптация" score={skills.competency_adaptability || 0} />
                    <SkillBar label="Soft Skills" score={skills.competency_soft_skills || 0} />
                  </div>

                  {skills.summary && (
                    <div className="bg-surface-2 border border-line p-4 rounded-xl space-y-4 mt-6">
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
                <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-line-2">
                  <AlertCircle size={32} className="mx-auto text-amber-500 mb-2 opacity-80" />
                  <div className="text-[15px] font-medium text-ink mb-1">Навыки не проверены</div>
                  <p className="text-[13px] text-ink-3">Пользователь еще не проходил собеседование.</p>
                </div>
              )}
            </div>
          )}

          {user.role === "company" && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold flex items-center gap-2 mb-4">
                <Briefcase size={18} className="text-accent" /> Вакансии компании
              </h2>
              {user.job_postings && user.job_postings.length > 0 ? (
                <div className="grid gap-3">
                  {user.job_postings.map((job: any) => (
                    <div key={job.id} onClick={() => setSelectedJob(job)} className="p-4 border border-line rounded-xl bg-surface-2 flex flex-col gap-2 hover:border-accent cursor-pointer transition-colors group">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[15px] text-ink group-hover:text-accent transition-colors">{job.title}</h3>
                        {job.salary && (
                          <span className="text-[13px] font-bold text-accent whitespace-nowrap ml-2">{formatSalaryText(job.salary)}</span>
                        )}
                      </div>
                      <p className="text-[13px] text-ink-3 line-clamp-2">{job.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {job.stack && <span className="px-2 py-1 bg-surface border border-line rounded text-[11px]">{job.stack}</span>}
                        {job.level && <span className="px-2 py-1 bg-surface border border-line rounded text-[11px]">{job.level}</span>}
                        {job.format && <span className="px-2 py-1 bg-surface border border-line rounded text-[11px]">{job.format}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-line-2 rounded-xl bg-surface-2">
                  <p className="text-[13px] text-ink-3">У компании пока нет активных вакансий.</p>
                </div>
              )}
            </div>
          )}

          <ChatHistoryBlock messages={skills?.chat_history || []} />

          {user.projects && user.projects.length > 0 && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><ImageIcon size={18} className="text-accent" /> Портфолио</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.projects.map((proj: any) => (
                  <div key={proj.id} onClick={() => setSelectedProject(proj)} className="border border-line rounded-xl overflow-hidden bg-surface-2 flex flex-col cursor-pointer hover:border-accent/50 transition-colors group">
                    <div className="h-32 bg-surface-3">
                      {proj.cover ? <img src={proj.cover} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ink-4"><ImageIcon size={24}/></div>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm mb-1">{proj.title}</h3>
                      <p className="text-xs text-ink-3 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {githubData && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2"><Github size={18} className="text-accent" /> GitHub Статистика</h2>
                <span className="text-[13px] text-ink-3">@{githubData.username}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-surface-2 p-3 rounded-xl text-center border border-line">
                  <div className="text-xl font-bold">{githubData.public_repos}</div>
                  <div className="text-[11px] text-ink-3">репозиториев</div>
                </div>
                <div className="bg-surface-2 p-3 rounded-xl text-center border border-line">
                  <div className="text-xl font-bold">{githubData.total_stars}</div>
                  <div className="text-[11px] text-ink-3">звезд</div>
                </div>
                <div className="bg-surface-2 p-3 rounded-xl text-center border border-line">
                  <div className="text-xl font-bold">{githubData.followers}</div>
                  <div className="text-[11px] text-ink-3">подписчиков</div>
                </div>
              </div>

              {githubData.languages && githubData.languages.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Языки</div>
                  </div>
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-3 bg-surface-2">
                    {githubData.languages.map((lang: any, i: number) => (
                      <div key={lang.name} className={LANG_COLORS[i % LANG_COLORS.length]} style={{ flexGrow: lang.percent, flexBasis: 0 }} title={`${lang.name}: ${lang.percent}%`} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {githubData.languages.map((lang: any, i: number) => (
                      <span key={lang.name} className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
                        <span className={`w-2 h-2 rounded-full ${LANG_COLORS[i % LANG_COLORS.length]}`} />
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-ink-3">{lang.percent}%</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-2">Репозитории</div>
                <div className="space-y-2">
                  {githubData.projects.slice(0, showAllRepos ? undefined : 4).map((p: any) => (
                    <a key={p.name} href={p.url} target="_blank" rel="noreferrer" className="block p-3 border border-line rounded-xl hover:bg-surface-2 transition-colors">
                      <div className="flex justify-between items-center mb-1 gap-2">
                        <span className="font-medium text-[14px] text-accent truncate">{p.name}</span>
                        <div className="flex gap-3 text-[12px] text-ink-3 shrink-0">
                          <span className="flex items-center gap-1"><Star size={12}/> {p.stars}</span>
                          <span className="flex items-center gap-1"><GitFork size={12}/> {p.forks}</span>
                          <span className="flex items-center gap-1"><GitCommit size={12}/> {p.commits || 0}</span>
                        </div>
                      </div>
                      <div className="text-[12px] text-ink-3 truncate mb-1.5">{p.description || "Без описания"}</div>
                    </a>
                  ))}
                </div>
                {githubData.projects.length > 4 && (
                  <button onClick={() => setShowAllRepos(!showAllRepos)} className="mt-3 w-full py-2 bg-surface-2 border border-line rounded-xl text-[13px] font-medium text-ink-2 hover:bg-surface-3 transition-colors">
                    {showAllRepos ? "Скрыть" : `Показать все (${githubData.projects.length})`}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* МОДАЛКА ПРОСМОТРА ВАКАНСИИ */}
      {selectedJob && (
        <ViewJobModal job={selectedJob} companyName={user.full_name} onClose={() => setSelectedJob(null)} />
      )}

      {/* МОДАЛКА ПРОСМОТРА ПРОЕКТА (через Modal — с правильным scroll-lock) */}
      {selectedProject && (
        <Modal onClose={() => setSelectedProject(null)} size="lg">
          <div className="flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-line bg-surface-2 rounded-t-2xl">
              <h2 className="font-bold text-lg pr-8">{selectedProject.title}</h2>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
              <p className="text-ink-2 text-sm whitespace-pre-line [overflow-wrap:anywhere]">{selectedProject.description}</p>
              {selectedProject.cover && (
                <div className="rounded-xl overflow-hidden border border-line bg-bg-2">
                  <img src={selectedProject.cover} alt="Cover" className="w-full h-auto max-h-[400px] object-contain" />
                </div>
              )}
              {selectedProject.images && selectedProject.images.length > 1 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Дополнительные фото</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProject.images.slice(1).map((img: string, idx: number) => (
                      <a href={img} target="_blank" rel="noreferrer" key={idx} className="rounded-lg overflow-hidden border border-line hover:opacity-80 transition-opacity aspect-video">
                        <img src={img} alt={`Фото ${idx+1}`} className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ChatHistoryBlock({ messages }: { messages: Array<{ role: string; content: string }> }) {
  const [open, setOpen] = useState(false);
  if (!messages || messages.length === 0) return null;

  return (
    <div className="bg-surface border border-line rounded-2xl p-4 sm:p-6 shadow-sm mt-6 w-full max-w-full overflow-hidden">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between text-left">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare size={18} className="text-accent" />
          История собеседования
          <span className="text-[11px] font-normal text-ink-3">({messages.length} сообщ.)</span>
        </h2>
        <span className="text-[13px] text-accent font-medium">{open ? "Свернуть ▲" : "Развернуть ▼"}</span>
      </button>

      {open && (
        <div className="mt-4 space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((m, i) => {
            const isUser = m.role === "user";
            const codeMatch = m.content.match(/\n\nКод:\n([\s\S]*)$/);
            const textPart = codeMatch ? m.content.slice(0, codeMatch.index) : m.content;
            const codePart = codeMatch ? codeMatch[1] : "";
            return (
              <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed min-w-0 ${isUser ? "bg-accent text-white" : "bg-surface-2 border border-line text-ink-2"}`}>
                  <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{textPart}</div>
                  {codePart && (
                    <pre className="mt-2 bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto text-[11px] font-mono whitespace-pre max-w-full custom-scrollbar">
                      <code>{codePart}</code>
                    </pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
