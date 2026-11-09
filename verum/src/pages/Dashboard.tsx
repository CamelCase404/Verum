import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authApi, getToken } from "@/api";
import { useAppStore } from "@/store/useAppStore";
import { DeveloperDashboard } from "./dashboard/DeveloperDashboard";
import { CompanyDashboard } from "./dashboard/CompanyDashboard";

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


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {content}
    </motion.div>
  );
}
