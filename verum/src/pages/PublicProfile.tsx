import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApi, chatApi } from "@/api";
import { ArrowLeft, Github, ShieldCheck, Star, GitFork, GitCommit, Image as ImageIcon, Globe, Briefcase, AlertCircle, X, MessageSquare } from "lucide-react";

const LANG_COLORS = ["bg-[#3178c6]", "bg-[#e34c26]", "bg-[#178600]", "bg-[#3572A5]", "bg-[#f1e05a]", "bg-[#89e051]"];

export function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllRepos, setShowAllRepos] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/auth/user/${id}`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => { setLoading(false); navigate("/"); });
  }, [id, navigate]);

  if (loading) return <div className="p-10 text-center text-ink">Загрузка профиля...</div>;
  if (!user) return <div className="p-10 text-center text-ink">Пользователь не найден</div>;

  const initials = user?.full_name?.substring(0, 2).toUpperCase() || "??";
  const skills = user?.skills;
  const isTested = !!skills && skills.final_grade && skills.final_grade !== "Reject";
  const githubData = user?.github_stats;

  const getLangColor = (langName: string) => {
    if (!githubData?.languages) return "bg-accent/60";
    const index = githubData.languages.findIndex((l: any) => l.name === langName);
    return index !== -1 ? LANG_COLORS[index % LANG_COLORS.length] : "bg-accent/60";
  };


  const handleStartChat = async () => {
    try {
      const res = await chatApi.startChat(user.id);
      window.location.href = `/messages?chat=${res.data.conversation_id}`;
    } catch (e) {
      console.error("Ошибка создания чата", e);
    }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-ink-2 hover:text-accent mb-6 transition-colors">
        <ArrowLeft size={18} /> Назад
      </button>

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* ЛЕВАЯ КОЛОНКА: Карточка пользователя */}
        <div className="bg-surface border border-line rounded-2xl p-6 h-fit shadow-sm">
          <div className="w-24 h-24 rounded-full bg-accent text-white flex items-center justify-center text-3xl font-bold overflow-hidden mx-auto mb-4 shadow-lg">
            {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : initials}
          </div>
          <h1 className="text-xl font-bold text-center mb-1">{user.full_name}</h1>
          <p className="text-sm text-center text-ink-3 mb-4">{user.role === "company" ? "Компания" : "Разработчик"}</p>
          
          {user.bio && <p className="text-sm text-ink-2 text-center mb-6">{user.bio}</p>}

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

          {/* Кнопка "Написать" (видна всем, кроме владельца профиля) */}
          <button 
            onClick={handleStartChat}
            className="w-full mt-2 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} /> Написать сообщение
          </button>
        </div>

        {/* ПРАВАЯ КОЛОНКА: Навыки и Статистика */}
        <div className="space-y-6">
          
          {/* НАВЫКИ (только для разработчиков) */}
          {user.role === "developer" && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-accent" /> Навыки
            </h2>
            
            {isTested ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm"><span className="text-ink-3">Архитектура:</span> <b>{skills.competency_architecture}/100</b></div>
                <div className="text-sm"><span className="text-ink-3">Код-ревью:</span> <b>{skills.competency_code_understanding}/100</b></div>
                <div className="text-sm"><span className="text-ink-3">Работа с ИИ:</span> <b>{skills.competency_prompting}/100</b></div>
                <div className="text-sm"><span className="text-ink-3">Адаптация:</span> <b>{skills.competency_adaptability}/100</b></div>
                <div className="col-span-2 mt-2 pt-4 border-t border-line flex justify-between items-center">
                  <span className="text-sm text-ink-3">Итоговый уровень:</span>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">{skills.final_grade}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 bg-surface-2 rounded-xl border border-dashed border-line-2">
                <AlertCircle size={32} className="mx-auto text-amber-500 mb-2 opacity-80" />
                <div className="text-[15px] font-medium text-ink mb-1">Навыки не проверены</div>
                <p className="text-[13px] text-ink-3">Пользователь еще не проходил собеседование на платформе.</p>
              </div>
            )}
          </div>
          )}

          {/* GITHUB СТАТИСТИКА (Подробная) */}
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

              {/* Языки */}
              {githubData.languages && githubData.languages.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Языки</div>
                    <div className="text-[11px] text-ink-3">{githubData.languages.length} языков</div>
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

              {/* Репозитории */}
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
                      {p.language && (
                        <div className="flex items-center gap-1.5 text-[11px] text-ink-3 mt-1">
                          <span className={`w-2 h-2 rounded-full ${getLangColor(p.language)}`} />
                          {p.language}
                        </div>
                      )}
                    </a>
                  ))}
                </div>
                {/* Кнопка Показать все */}
                {githubData.projects.length > 4 && (
                  <button 
                    onClick={() => setShowAllRepos(!showAllRepos)} 
                    className="mt-3 w-full py-2 bg-surface-2 border border-line rounded-xl text-[13px] font-medium text-ink-2 hover:bg-surface-3 transition-colors"
                  >
                    {showAllRepos ? "Скрыть" : `Показать все (${githubData.projects.length})`}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Портфолио */}
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

          {/* Вакансии (если компания) */}
          {user.role === "company" && user.job_postings && user.job_postings.length > 0 && (
            <div className="bg-surface border border-line rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold flex items-center gap-2 mb-4"><Briefcase size={18} className="text-accent" /> Открытые вакансии</h2>
              <div className="space-y-3">
                {user.job_postings.map((job: any) => (
                  <div key={job.id} className="p-4 border border-line rounded-xl bg-surface-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{job.title}</h3>
                      <span className="text-xs font-semibold text-accent">{job.salary}</span>
                    </div>
                    <p className="text-xs text-ink-3 mb-2">{job.description}</p>
                    <div className="flex gap-2 text-[10px]">
                      <span className="px-2 py-1 bg-surface border border-line rounded">{job.stack}</span>
                      <span className="px-2 py-1 bg-surface border border-line rounded">{job.level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    
      {/* МОДАЛКА ПРОСМОТРА ПРОЕКТА */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-line rounded-2xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Шапка модалки */}
            <div className="p-4 border-b border-line flex justify-between items-center bg-surface-2">
              <h2 className="font-bold text-lg">{selectedProject.title}</h2>
              <button onClick={() => setSelectedProject(null)} className="text-ink-3 hover:text-ink p-1"><X size={20} /></button>
            </div>
            
            {/* Контент */}
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="text-ink-2 text-sm whitespace-pre-line">{selectedProject.description}</p>
              
              {/* Обложка */}
              {selectedProject.cover && (
                <div className="rounded-xl overflow-hidden border border-line bg-bg-2">
                  <img src={selectedProject.cover} alt="Cover" className="w-full h-auto max-h-[400px] object-contain" />
                </div>
              )}
              
              {/* Дополнительные фото */}
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
        </div>
      )}
</div>
  );
}
