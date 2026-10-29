import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { confetti } from "@/lib/confetti";
import { toast } from "@/components/layout/ToastContainer";
import { authApi, setToken } from "@/api";

export function Auth() {
  const { setUser, setRole, setView } = useAppStore();
  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRoleLocal] = useState<"specialist" | "client">("specialist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (mode === "register" && !name.trim()) { toast("Введите имя"); return; }
    if (!email.includes("@") || pass.length < 8) { toast("Проверьте email и пароль (мин. 8 символов)"); return; }
    
    setLoading(true);
    try {
      const backendRole = role === "specialist" ? "developer" : "company";
      let res;

      if (mode === "register") {
        res = await authApi.register({
          full_name: name.trim(),
          email: email.trim(),
          password: pass,
          role: backendRole
        });
      } else {
        res = await authApi.login(email.trim(), pass);
      }

      // Сохраняем токен!
      setToken(res.data.access_token);
      
      // Получаем профиль с бэкенда
      const me = await authApi.getMe();
      
      setUser({ name: me.data.full_name, email: me.data.email });
      setRole(role);
      confetti(innerWidth / 2, innerHeight / 2);
      toast(mode === "register" ? "Аккаунт создан" : "Вход выполнен");
      setView("dashboard");
    } catch (e: any) {
      toast(e.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-line"><div className="wrap py-5 flex justify-between"><button onClick={() => setView("landing")} className="font-bold text-xl">Верум<span className="text-accent">.</span></button></div></div>
      <div className="flex-1 flex justify-center px-6 py-14">
        <div className="w-full max-w-[520px] bg-surface border border-line rounded-[22px] shadow-2xl p-10">
          
          <div className="flex gap-4 mb-6 border-b border-line pb-4">
            <button onClick={() => setMode("register")} className={`text-xl font-semibold ${mode === "register" ? "text-ink" : "text-muted"}`}>Регистрация</button>
            <button onClick={() => setMode("login")} className={`text-xl font-semibold ${mode === "login" ? "text-ink" : "text-muted"}`}>Вход</button>
          </div>

          {mode === "register" && (
            <>
              <p className="text-[14.5px] text-ink-2 mb-4">Выберите роль.</p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {(["specialist", "client"] as const).map((r) => (
                  <button key={r} onClick={() => setRoleLocal(r)} className={`border rounded p-4 text-left ${role === r ? "border-accent bg-accent-soft" : "border-line-2"}`}>
                    <div className="text-sm font-semibold">{r === "specialist" ? "Специалист" : "Заказчик"}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="space-y-4 mb-6">
            {mode === "register" && (
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Пароль (мин. 8 символов)" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
          </div>
          
          <Button variant="accent" size="lg" block onClick={submit} disabled={loading}>
            {loading ? "Загрузка..." : mode === "register" ? "Создать аккаунт" : "Войти"}
          </Button>

          <div className="mt-6 text-center">
            <a href="https://api.verumskills.ru/api/auth/github" className="text-sm text-accent hover:underline">Войти через GitHub</a>
          </div>

        </div>
      </div>
    </div>
  );
}
