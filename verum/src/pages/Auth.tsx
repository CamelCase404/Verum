import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { confetti } from "@/lib/confetti";
import { toast } from "@/components/layout/ToastContainer";
export function Auth() {
  const { setUser, setRole, setView } = useAppStore();
  const [role, setRoleLocal] = useState<"specialist" | "client">("specialist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const submit = () => {
    if (!name.trim() || !email.includes("@") || pass.length < 8) { toast("Проверьте поля"); return; }
    setUser({ name: name.trim(), email: email.trim() });
    setRole(role);
    confetti(innerWidth / 2, innerHeight / 2);
    setView("dashboard");
    toast("Аккаунт создан");
  };
  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b border-line"><div className="wrap py-5 flex justify-between"><button onClick={() => setView("landing")} className="font-bold text-xl">Верум<span className="text-accent">.</span></button></div></div>
      <div className="flex-1 flex justify-center px-6 py-14">
        <div className="w-full max-w-[520px] bg-surface border border-line rounded-[22px] shadow-2xl p-10">
          <h2 className="text-[27px] font-semibold mb-2">Создать аккаунт</h2>
          <p className="text-[14.5px] text-ink-2 mb-8">Выберите роль.</p>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {(["specialist", "client"] as const).map((r) => (
              <button key={r} onClick={() => setRoleLocal(r)} className={`border rounded p-4 text-left ${role === r ? "border-accent bg-accent-soft" : "border-line-2"}`}>
                <div className="text-sm font-semibold">{r === "specialist" ? "Специалист" : "Заказчик"}</div>
              </button>
            ))}
          </div>
          <div className="space-y-4 mb-6">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Пароль" className="w-full border border-line-2 rounded px-3.5 py-3 outline-none focus:border-accent" />
          </div>
          <Button variant="accent" size="lg" block onClick={submit}>Создать аккаунт</Button>
        </div>
      </div>
    </div>
  );
}
