import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
export function ChatPanel() {
  const { chatOpen, toggleChat } = useAppStore();
  return (
    <aside className={cn("fixed bottom-6 right-6 z-[230] w-[min(380px,calc(100vw-32px))] h-[min(500px,calc(100vh-100px))] bg-surface border border-line rounded-2xl shadow-2xl flex flex-col transition-all", chatOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none")}>
      <div className="p-3.5 border-b border-line flex items-center justify-between">
        <span className="font-semibold text-sm">Диалог</span>
        <button onClick={toggleChat} className="w-9 h-9 rounded-lg text-xl text-ink-3 hover:bg-surface-2">×</button>
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2.5">
        <div className="max-w-[85%] px-3 py-2 rounded-[14px] bg-surface-2 border border-line text-[13.5px]">Здравствуйте!</div>
        <div className="max-w-[85%] px-3 py-2 rounded-[14px] bg-accent text-white text-[13.5px] self-end">Привет!</div>
      </div>
    </aside>
  );
}
