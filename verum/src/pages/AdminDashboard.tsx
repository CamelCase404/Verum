import { useState, useEffect } from "react";
import { ShieldCheck, PlayCircle, XCircle, CheckCircle2 } from "lucide-react";
import { getToken, authApi } from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/layout/ToastContainer";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "https://api.verumskills.ru"}/api/admin/pending`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Ошибка доступа");
      const data = await res.json();
      setPending(data);
    } catch (e: any) {
      toast(e.message || "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    authApi.getMe().then(res => {
      if (res.data.role !== "admin") {
        navigate("/dashboard");
      } else {
        fetchPending();
      }
    }).catch(() => navigate("/login"));
  }, [navigate]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "https://api.verumskills.ru"}/api/admin/${action}/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (res.ok) {
        toast(action === "approve" ? "Кандидат одобрен" : "Кандидат отклонен", "success");
        setPending(prev => prev.filter(p => p.id !== id));
        setActiveVideo(null);
      }
    } catch (e) {
      toast("Ошибка действия");
    }
  };

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <div className="max-w-4xl w-full overflow-hidden mx-auto px-3 md:px-4 py-6 md:py-10">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
        <ShieldCheck className="text-accent" /> Панель модератора
      </h1>

      {pending.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-line rounded-2xl">
          Нет собеседований на проверке
        </div>
      ) : (
        /* Используем flex-col, чтобы карточки шли друг за другом по центру */
        <div className="flex flex-col gap-6">
          {pending.map(p => (
            <div key={p.id} className="bg-surface border border-line rounded-2xl p-4 md:p-6 flex flex-col gap-3 md:gap-4 shadow-sm w-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{p.full_name}</h3>
                  <p className="text-sm text-ink-3">{p.email}</p>
                </div>
                <div className="px-3 py-1 bg-surface-2 text-accent rounded-full text-sm font-semibold">
                  {p.skills?.final_grade || "Reject"}
                </div>
              </div>

              <div className="bg-surface-2 p-4 rounded-xl text-sm text-ink-2">
                {p.skills?.summary || "Нет резюме"}
              </div>

              {activeVideo === p.id.toString() ? (
                p.video_url ? (
                  <video src={`${import.meta.env.VITE_API_URL || "https://api.verumskills.ru"}${p.video_url}`} controls className="w-full rounded-xl bg-black aspect-video" />
                ) : (
                  <div className="w-full rounded-xl bg-surface-2 border border-dashed border-line-2 aspect-video flex flex-col items-center justify-center text-ink-3">
                    <XCircle size={32} className="mb-2 opacity-50" />
                    <span>Видео не загружено или не привязано</span>
                  </div>
                )
              ) : (
                <button
                  onClick={() => setActiveVideo(p.id.toString())}
                  className="w-full py-3 bg-surface-2 border border-line rounded-xl flex items-center justify-center gap-2 hover:bg-surface-3 transition"
                >
                  <PlayCircle size={20} /> Смотреть видео
                </button>
              )}

              {/* ИСТОРИЯ ЧАТА */}
              {p.chat_history && p.chat_history.length > 0 && (
                <div className="bg-surface-2 border border-line rounded-xl overflow-hidden flex flex-col max-h-[250px] md:max-h-[400px]">
                  {/* Заголовок ВНЕ зоны скролла */}
                  <div className="px-4 py-3 text-[11px] font-semibold text-ink-3 uppercase tracking-wider border-b border-line bg-surface-2 shrink-0">
                    История диалога
                  </div>
                  {/* Прокручиваемое содержимое */}
                  <div className="p-4 overflow-y-auto space-y-4">
                    {p.chat_history.map((msg: any, i: number) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        {/* whitespace-pre-wrap сохраняет переносы строк и код */}
                        <div className={`max-w-[90%] rounded-lg px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-accent text-white" : "bg-surface border border-line text-ink-2"}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-4 border-t border-line">
                <button
                  onClick={() => handleAction(p.id, "approve")}
                  className="flex-1 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-2 flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Одобрить
                </button>
                <button
                  onClick={() => handleAction(p.id, "reject")}
                  className="flex-1 py-2.5 bg-warn-soft text-warn border border-line rounded-lg font-medium hover:bg-warn/10 flex justify-center items-center gap-2"
                >
                  <XCircle size={18} /> Отклонить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
