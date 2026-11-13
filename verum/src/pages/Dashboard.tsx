import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, LogOut, Loader2 } from "lucide-react";
import { toast } from "@/components/layout/ToastContainer";
import { authApi, getToken } from "@/api";
import { useAppStore } from "@/store/useAppStore";
import { DeveloperDashboard } from "./dashboard/DeveloperDashboard";
import { CompanyDashboard } from "./dashboard/CompanyDashboard";


function VerifyBlocker({ email, onLogout, onRefresh }: { email: string, onLogout: () => void, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  
  const resend = async () => {
    setLoading(true);
    try {
      await authApi.sendVerifyEmail();
      toast("Письмо отправлено заново!", "success");
    } catch (e: any) {
      toast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="bg-surface border border-line rounded-[22px] p-8 md:p-12 max-w-lg w-full text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20" />
        
        <div className="w-20 h-20 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail size={36} />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">Проверьте вашу почту</h1>
        <p className="text-ink-3 text-[15px] leading-relaxed mb-8">
          Мы отправили ссылку для активации профиля на <br/><b className="text-ink">{email}</b>.<br/> 
          Перейдите по ней, чтобы получить доступ к кабинету.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={resend} 
            disabled={loading}
            className="w-full py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent-2 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Отправить письмо еще раз"}
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full py-3 bg-surface-2 border border-line text-ink-2 rounded-xl font-medium hover:bg-surface-3 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [backendUser, setBackendUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const setStoreUser = useAppStore((s) => s.setUser);
  const setStoreBackendUser = useAppStore((s) => s.setBackendUser);

  const fetchUser = useCallback(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    authApi.getMe().then((res) => {
      setBackendUser(res.data);
      if (setStoreBackendUser) setStoreBackendUser(res.data);
      if (setStoreUser) setStoreUser({ name: res.data.full_name, email: res.data.email, role: res.data.role });
      setLoading(false);
    }).catch(() => navigate("/login"));
  }, [navigate, setStoreUser, setStoreBackendUser]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Обработка авто-запуска интервью, если пришли по ссылке на вакансию 
  useEffect(() => {
    if (backendUser?.role === "developer") {
        const pendingJobStr = localStorage.getItem("verum.pending_job");
        if (pendingJobStr) {
            // Очищаем, чтобы не запустилось при следующем обновлении страницы
            localStorage.removeItem("verum.pending_job");
            window.dispatchEvent(new CustomEvent("verum-open-interview", { detail: JSON.parse(pendingJobStr) }));
        }
    }
  }, [backendUser]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ink text-xl">Загрузка профиля...</div>;

  // Роутинг по ролям
  const isCompany = backendUser?.role === "company";
  const content = isCompany
    ? <CompanyDashboard backendUser={backendUser} onRefresh={fetchUser} />
    : (backendUser?.role === "developer" ? <DeveloperDashboard backendUser={backendUser} onRefresh={fetchUser} /> : <div className="text-center py-20">Неизвестная роль</div>);


  if (backendUser && backendUser.is_verified === false) {
    const handleLogout = () => {
        localStorage.removeItem("verum_token");
        localStorage.removeItem("verum_state_v9");
        navigate("/");
    };
    return <VerifyBlocker email={backendUser.email} onLogout={handleLogout} onRefresh={fetchUser} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {content}
    </motion.div>
  );
}
