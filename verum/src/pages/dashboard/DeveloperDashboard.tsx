import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScoreRow } from "@/components/ui/ScoreRow";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, Github, Plus, Pencil, Trash2, Image as ImageIcon, Star, GitFork, Play, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { InterviewModal } from "@/components/modals/InterviewModal";

const COLORS: Record<string, string> = {
  accent: "bg-accent", blue: "bg-blue-500", violet: "bg-violet-500", amber: "bg-amber-500", rose: "bg-rose-500"
};

// Палитра для языков
const LANG_COLORS = [
  "bg-[#3178c6]", // TypeScript (синий)
  "bg-[#e34c26]", // HTML (оранжевый)
  "bg-[#178600]", // C# (зеленый)
  "bg-[#3572A5]", // Python (синий)
  "bg-[#f1e05a]", // JavaScript (желтый)
  "bg-[#89e051]", // Shell (салатовый)
  "bg-[#563d7c]", // CSS (фиолетовый)
  "bg-[#b07219]", // Java (коричневый)
  "bg-[#dea584]", // Rust (розовый)
  "bg-[#a97bff]", // Kotlin (сиреневый)
];

export function DeveloperDashboard() {
  const { user, profile, removeProject } = useAppStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProjectOpen, setIsProjectOpen] = useState(false);
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  const initials = user?.name?.substring(0, 2).toUpperCase() || "МК";
  const avatarBg = COLORS[profile.avatarColor] || "bg-accent";
  const isTested = profile.tested && profile.scores;

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-6 mb-6 md:mb-10">
        <div>
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight mb-1 md:mb-2">Личный кабинет</h1>
          <p className="text-ink-2 text-[13px] md:text-[15px]">Добро пожаловать, <span className="font-medium text-ink">{user?.name || "Разработчик"}</span></p>
        </div>
        
        {isTested ? (
          <div className="flex items-center gap-2 md:gap-3 bg-surface border border-line rounded-xl px-3 md:px-4 py-2">
            <ShieldCheck className="text-accent" size={18} />
            <div>
              <div className="text-[12px] md:text-[13px] font-medium">Профиль проверен</div>
              <div className="text-[10px] md:text-[11.5px] text-ink-3">Уровень Middle подтверждён</div>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 md:space-y-6">
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm relative group">
            <button onClick={() => setIsEditOpen(true)} className="absolute top-3 right-3 md:top-4 md:right-4 w-7 h-7 md:w-8 md:h-8 rounded-full bg-surface-2 border border-line flex items-center justify-center text-ink-3 hover:text-accent transition-all z-10">
              <Pencil size={12} className="md:w-3.5 md:h-3.5" />
            </button>

            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-5">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-semibold text-base md:text-xl text-white shadow-md overflow-hidden ${avatarBg}`}>
                {profile.avatarImage ? <img src={profile.avatarImage} alt="Avatar" className="w-full h-full object-cover" /> : initials}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold">{user?.name || "Разработчик"}</h2>
                <p className="text-[12px] md:text-sm text-ink-3">{profile.github ? `@${profile.github}` : "@username"}</p>
              </div>
            </div>
            
            <p className="text-[13px] md:text-[14px] text-ink-2 leading-relaxed mb-4 md:mb-6">
              {profile.bio || "Добавьте описание своего опыта в настройках профиля."}
            </p>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between text-[12px] md:text-sm">
                <span className="text-ink-3">Специализация</span>
                <span className="font-medium">Frontend</span>
              </div>
              <div className="flex justify-between text-[12px] md:text-sm items-center">
                <span className="text-ink-3">GitHub</span>
                {profile.githubData ? (
                  <span className="font-medium flex items-center gap-1 text-accent"><Github size={12} className="md:w-3.5 md:h-3.5" /> {profile.githubData.username}</span>
                ) : (
                  <a href="http://localhost:8000/api/auth/github" className="text-[11px] md:text-[13px] bg-accent text-white px-2 md:px-3 py-1 rounded-lg">Подключить</a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ПРАВАЯ КОЛОНКА */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4 md:space-y-6">
          
          {/* НАВЫКИ */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                <ShieldCheck size={16} className="md:w-4.5 md:h-4.5 text-accent" /> Навыки
              </h3>
            </div>
            
            {isTested ? (
              <div className="grid sm:grid-cols-2 gap-x-6 md:gap-x-8 gap-y-2">
                <ScoreRow label="Архитектурное мышление" value={profile.scores!.arch} delay={0} />
                <ScoreRow label="Ревью кода ИИ" value={profile.scores!.code} delay={1} />
                <ScoreRow label="Работа с ИИ" value={profile.scores!.ai} delay={2} />
                <ScoreRow label="Адаптация" value={profile.scores!.adapt} warn={profile.scores!.adapt < 80} delay={3} />
              </div>
            ) : (
              <div className="text-center py-4 md:py-6">
                <ShieldCheck size={32} className="mx-auto text-ink-4 mb-2 md:mb-3 opacity-30 md:w-10 md:h-10" />
                <div className="text-[14px] md:text-[15px] font-medium mb-1">Навыки не проверены</div>
                <p className="text-[12px] md:text-[13px] text-ink-3 mb-3 md:mb-4">Пройдите собеседование, чтобы подтвердить уровень</p>
                <button onClick={() => setIsInterviewOpen(true)} className="px-4 md:px-5 py-2 bg-accent text-white rounded-lg text-[13px] md:text-sm font-medium hover:bg-accent-2 transition-colors">
                  Начать собеседование
                </button>
              </div>
            )}
          </div>

          {/* GITHUB */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                <Github size={16} className="md:w-4.5 md:h-4.5 text-accent" /> GitHub
              </h3>
              {profile.githubData && (
                <span className="text-[11px] md:text-xs text-ink-3">@{profile.githubData.username}</span>
              )}
            </div>

            {profile.githubData ? (
              <>
                {/* Метрики */}
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{profile.githubData.public_repos}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">репозиториев</div>
                  </div>
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{profile.githubData.total_stars}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">звёзд</div>
                  </div>
                  <div className="bg-surface-2 rounded-xl p-2 md:p-3 text-center border border-line">
                    <div className="text-lg md:text-xl font-semibold">{profile.githubData.followers}</div>
                    <div className="text-[10px] md:text-[11px] text-ink-3">подписчиков</div>
                  </div>
                </div>

                {/* Языки */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Языки</div>
                    <div className="text-[11px] text-ink-3">{profile.githubData.languages.length} языков</div>
                  </div>
                  
                  {/* Полоска прогресса - используем flex-grow вместо width, чтобы точно заполнить 100% */}
                  <div className="flex h-2.5 rounded-full overflow-hidden mb-3 bg-surface-2">
                    {profile.githubData.languages.map((lang, i) => (
                      <div
                        key={lang.name}
                        className={LANG_COLORS[i % LANG_COLORS.length]}
                        style={{ flexGrow: lang.percent, flexBasis: 0 }}
                        title={`${lang.name}: ${lang.percent}%`}
                      />
                    ))}
                  </div>
                  
                  {/* Легенда */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {profile.githubData.languages.map((lang, i) => (
                      <span key={lang.name} className="inline-flex items-center gap-1.5 text-[11px] md:text-[12px] text-ink-2">
                        <span className={`w-2 h-2 rounded-full ${LANG_COLORS[i % LANG_COLORS.length]}`} />
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-ink-3">{lang.percent}%</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Репозитории */}
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-3 mb-2">
                    Репозитории
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {profile.githubData.projects.map((p) => (
                      <a
                        key={p.name}
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 border border-line rounded-xl hover:border-accent/40 hover:bg-surface-2 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="font-medium text-[13px] md:text-[14px] text-accent truncate">
                            {p.name}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] md:text-[12px] text-ink-3 shrink-0">
                            <span className="flex items-center gap-0.5"><Star size={11} /> {p.stars}</span>
                            <span className="flex items-center gap-0.5"><GitFork size={11} /> {p.forks}</span>
                          </div>
                        </div>
                        
                        <div className="text-[11px] md:text-[12px] text-ink-3 truncate mb-1.5">
                          {p.description || "Без описания"}
                        </div>
                        
                        <div className="flex items-center gap-3 text-[10px] md:text-[11px] text-ink-3">
                          {p.language && (
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                              {p.language}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor"><path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5h-3.32ZM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>
                            {p.commits} {p.commits === 1 ? "коммит" : p.commits < 5 ? "коммита" : "коммитов"}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4 md:py-6">
                <Github size={32} className="mx-auto text-ink-4 mb-2 md:mb-3 opacity-30 md:w-10 md:h-10" />
                <div className="text-[14px] md:text-[15px] font-medium mb-1">GitHub не подключён</div>
                <p className="text-[12px] md:text-[13px] text-ink-3 mb-3 md:mb-4">Авторизуйтесь, чтобы загрузить проекты</p>
                <a href="http://localhost:8000/api/auth/github" className="px-4 md:px-5 py-2 bg-surface-2 border border-line-2 text-ink rounded-lg text-[13px] md:text-sm font-medium hover:bg-surface-3 transition-colors inline-block">
                  Подключить GitHub
                </a>
              </div>
            )}
          </div>

          {/* РУЧНОЕ ПОРТФОЛИО */}
          <div className="bg-surface border border-line rounded-2xl p-4 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="font-semibold text-base md:text-lg flex items-center gap-2">
                <ImageIcon size={16} className="md:w-4.5 md:h-4.5 text-accent" /> Мои проекты
              </h3>
              <button onClick={() => setIsProjectOpen(true)} className="h-7 md:h-8 px-2 md:px-3 rounded-lg bg-surface-2 border border-line text-[11px] md:text-[13px] font-medium flex items-center gap-1 hover:bg-surface-3 transition-colors">
                <Plus size={12} className="md:w-3.5 md:h-3.5" /> Добавить
              </button>
            </div>
            
            {profile.projects.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
                {profile.projects.map(project => (
                  <div key={project.id} className="group relative border border-line rounded-xl overflow-hidden bg-surface flex flex-col">
                    <div className="aspect-video bg-surface-2 relative overflow-hidden">
                      {project.image ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ink-4"><ImageIcon size={24} className="md:w-8 md:h-8" /></div>}
                      <button onClick={(e) => { e.preventDefault(); removeProject(project.id); }} className="absolute top-2 right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 text-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} className="md:w-3.5 md:h-3.5" /></button>
                    </div>
                    <div className="p-3 md:p-4 flex-1 flex flex-col">
                      <h4 className="font-medium text-[13px] md:text-[14px] mb-1">{project.title}</h4>
                      <p className="text-[11px] md:text-[12.5px] text-ink-3 line-clamp-2">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 border border-dashed border-line-2 rounded-xl bg-surface-2">
                <div className="text-[13px] md:text-[14px] font-medium mb-1">Пока нет проектов</div>
                <button onClick={() => setIsProjectOpen(true)} className="text-[12px] md:text-[13px] text-accent font-medium hover:underline">Создать первый проект</button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isEditOpen && <EditProfileModal onClose={() => setIsEditOpen(false)} />}
        {isProjectOpen && <AddProjectModal onClose={() => setIsProjectOpen(false)} />}
        {isInterviewOpen && <InterviewModal onClose={() => setIsInterviewOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
