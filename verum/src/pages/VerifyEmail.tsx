import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authApi } from "@/api";
import { useAppStore } from "@/store/useAppStore";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const { setBackendUser, backendUser } = useAppStore();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Токен не найден в ссылке.");
      return;
    }

    authApi.verifyEmail(token).then(() => {
      setStatus("success");
      setMessage("Почта успешно подтверждена! Обновляем профиль...");
      if (backendUser) {
        setBackendUser({ ...backendUser, is_verified: true });
      }
      setTimeout(() => navigate("/dashboard"), 2000);
    }).catch(err => {
      setStatus("error");
      setMessage(err.message || "Ошибка подтверждения почты.");
    });
  }, [searchParams, navigate, backendUser, setBackendUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="bg-surface border border-line rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        {status === "loading" && (
          <>
            <Loader2 className="animate-spin text-accent mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2">Проверяем токен...</h2>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle2 className="text-accent mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2 text-ink">Успешно!</h2>
            <p className="text-ink-2">{message}</p>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-xl font-bold mb-2 text-ink">Ошибка</h2>
            <p className="text-ink-2">{message}</p>
            <button onClick={() => navigate("/dashboard")} className="mt-6 px-6 py-2 bg-accent text-white rounded-xl font-medium">
              Вернуться в кабинет
            </button>
          </>
        )}
      </div>
    </div>
  );
}
