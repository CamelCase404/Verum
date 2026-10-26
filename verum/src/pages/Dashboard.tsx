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
  const setStoreRole = useAppStore((s) => s.setRole);

  const fetchUser = useCallback(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }
    authApi.getMe().then((res) => {
      setBackendUser(res.data);
      if (setStoreUser) setStoreUser({ name: res.data.full_name, email: res.data.email, role: res.data.role });
      if (setStoreRole) setStoreRole(res.data.role);
      setLoading(false);
    }).catch(() => navigate("/login"));
  }, [navigate, setStoreUser, setStoreRole]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-ink text-xl">Загрузка профиля...</div>;

  // Роутинг по ролям
  const content = backendUser?.role === "company" 
    ? <CompanyDashboard backendUser={backendUser} onRefresh={fetchUser} />
    : <DeveloperDashboard backendUser={backendUser} onRefresh={fetchUser} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {content}
    </motion.div>
  );
}
