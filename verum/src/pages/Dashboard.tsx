import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";
import { DeveloperDashboard } from "@/pages/dashboard/DeveloperDashboard";
import { CompanyDashboard } from "@/pages/dashboard/CompanyDashboard";

export function Dashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Если не авторизован — на страницу входа
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  // Рендерим нужный кабинет в зависимости от роли
  if (user.role === "company") {
    return <CompanyDashboard />;
  }

  return <DeveloperDashboard />;
}
