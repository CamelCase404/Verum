import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, updateProfile } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      const username = searchParams.get("username");
      const name = searchParams.get("name");

      if (username) {
        // 1. Авторизуем пользователя в системе
        setUser({ name: name || username, email: `${username}@users.noreply.github.com`, role: "developer" });
        
        // 2. Сразу запрашиваем анализ GitHub
        try {
          const res = await fetch("http://localhost:8000/api/github/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username }),
          });
          
          if (res.ok) {
            const ghData = await res.json();
            updateProfile({ github: username, githubData: ghData, tested: false }); // Сбрасываем тест, так как зашел новый человек
          } else {
            updateProfile({ github: username, tested: false });
          }
        } catch (e) {
          updateProfile({ github: username, tested: false });
        }
        
        navigate("/dashboard");
      } else {
        navigate("/login?error=github");
      }
      setLoading(false);
    };

    handleAuth();
  }, [searchParams, navigate, setUser, updateProfile]);

  if (!loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-lg font-medium">Синхронизация с GitHub...</div>
      </div>
    </div>
  );
}
