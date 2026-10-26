import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, PlayCircle, XCircle, CheckCircle2, User } from "lucide-react";
import { getToken, authApi } from "@/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/layout/ToastContainer";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    authApi.getMe().then(res => {
      if (res.data.role !== "admin") {
        navigate("/dashboard");
      } else {
        fetchPending();
      }
    }).catch(() => navigate("/login"));
  }, [navigate]);

  const fetchPending = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/admin/pending", {
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


  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      const res = await fetch(`http://localhost:8000/api/admin/${action}/${id}`, {
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
    <div className="max-w-[1280px] mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
        <ShieldCheck className="text-accent" /> Панель модератора
      </h1>

      {pending.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-line rounded-2xl">
          Нет собеседований на проверке
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pending.map(p => (
            <div key={p.id} className="bg-surface border border-line rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{p.full_name}</h3>
                  <p className="text-sm text-ink-3">{p.email}</p>
                </div>
                <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold">
                  {p.skills?.final_grade || "Reject"}
                </div>
              </div>

              <div className="bg-surface-2 p-4 rounded-xl text-sm text-ink-2">
                {p.skills?.summary || "Нет резюме"}
              </div>

              {activeVideo === p.id.toString() ? (
                <video src={`http://localhost:8000${p.video_url}`} controls className="w-full rounded-xl bg-black aspect-video" />
              ) : (
                <button
                  onClick={() => setActiveVideo(p.id.toString())}
                  className="w-full py-3 bg-surface-2 border border-line rounded-xl flex items-center justify-center gap-2 hover:bg-surface-3 transition"
                >
                  <PlayCircle size={20} /> Смотреть видео
                </button>
              )}

              <div className="flex gap-2 mt-auto pt-4 border-t border-line">
                <button
                  onClick={() => handleAction(p.id, "approve")}
                  className="flex-1 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-2 flex justify-center items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Одобрить
                </button>
                <button
                  onClick={() => handleAction(p.id, "reject")}
                  className="flex-1 py-2.5 bg-warn-soft text-warn border border-warn/20 rounded-lg font-medium hover:bg-warn/10 flex justify-center items-center gap-2"
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
