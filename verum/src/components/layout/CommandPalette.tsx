import { useEffect, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
const ACTIONS = [
  { id: "landing", t: "Главная", d: "На главную", ico: "⌂" },
  { id: "about", t: "О проекте", d: "Миссия", ico: "ℹ" },
  { id: "how", t: "Как работает", d: "Этапы", ico: "⚙" },
  { id: "pricing", t: "Тарифы", d: "Цены", ico: "₽" },
  { id: "dashboard", t: "Кабинет", d: "Профиль", ico: "◫" },
];
export function CommandPalette() {
  const { paletteOpen, togglePalette, setView } = useAppStore();
  const [q, setQ] = useState("");
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); togglePalette(); }
      if (e.key === "Escape" && paletteOpen) togglePalette();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [paletteOpen, togglePalette]);
  const items = ACTIONS.filter((a) => !q || a.t.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div onClick={togglePalette} className={cn("fixed inset-0 z-[240] bg-ink/50 backdrop-blur-sm transition-opacity", paletteOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} />
      <div className={cn("fixed top-[18vh] left-1/2 -translate-x-1/2 z-[241] w-[min(560px,calc(100vw-32px))] bg-surface border border-line rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all", paletteOpen ? "opacity-100" : "opacity-0 -translate-y-2 pointer-events-none")}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск..." className="border-none px-5 py-4 text-base bg-transparent outline-none border-b border-line" />
        <div className="p-2">
          {items.map((a) => (
            <button key={a.id} onClick={() => { setView(a.id as any); togglePalette(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-2 w-full text-left">
              <span className="w-7 h-7 rounded-md bg-surface-3 flex items-center justify-center text-xs">{a.ico}</span>
              <div><div className="text-[13.5px] font-medium">{a.t}</div><div className="text-[11.5px] text-ink-3">{a.d}</div></div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
