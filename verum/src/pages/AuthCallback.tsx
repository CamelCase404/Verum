import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setToken } from "@/api";

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    
    if (token) {
      setToken(token);
      navigate("/dashboard", { replace: true });
    } else {
      console.error("❌ Токен не найден в URL!");
      navigate("/login", { replace: true });
    }
  }, [params, navigate]);

  return <div className="min-h-screen flex items-center justify-center text-xl text-ink">Авторизация...</div>;
}
