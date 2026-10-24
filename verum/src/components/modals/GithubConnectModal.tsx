import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Github, Loader2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "@/components/layout/ToastContainer";

export function GithubConnectModal({ onClose }: { onClose: () => void }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const handleConnect = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      // Обращаемся к локальному бэкенду (порт 8000)
      const res = await fetch("http://localhost:8000/api/github/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || "Не удалось найти пользователя");
      }

      const data = await res.json();
      updateProfile({ githubData: data });
      toast("GitHub успешно подключён");
      onClose();
    } catch (e: any) {
      toast(e.message || "Ошибка подключения");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Github size={22} /> Подключить GitHub
        </h2>
        <p className="text-sm text-ink-3 mb-6">
          Введите ваш никнейм на GitHub (например, CamelCase404). Мы проанализируем ваши публичные репозитории, языки и звёзды.
        </p>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ваш GitHub username..."
          className="w-full border border-line-2 rounded-xl px-4 py-3 bg-surface outline-none focus:border-accent mb-6"
        />
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="accent" onClick={handleConnect} disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Анализируем...</> : "Анализировать"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
