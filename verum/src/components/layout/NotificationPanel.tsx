import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
export function NotificationPanel() {
  const { notifOpen, toggleNotif, notifications, markAllRead } = useAppStore();
  return (
    <>
      <div onClick={toggleNotif} className={cn("fixed inset-0 z-[220] bg-ink/30 transition-opacity", notifOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")} />
      <aside className={cn("fixed top-20 right-6 z-[221] w-[min(400px,calc(100vw-32px))] bg-surface border border-line rounded-2xl shadow-2xl flex flex-col transition-all", notifOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none")}>
        <div className="p-4 border-b border-line flex items-center justify-between">
          <h4 className="text-sm font-semibold">Уведомления</h4>
          <button onClick={markAllRead} className="text-xs text-accent hover:underline">Прочитать все</button>
        </div>
        <div className="p-2">
          {notifications.map((n) => (
            <div key={n.id} className="flex gap-3 p-3 rounded-[9px] hover:bg-surface-2">
              <div className="w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center text-[13px] shrink-0">{n.ico}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium">{n.t}</div>
                <div className="text-[12px] text-ink-3">{n.d}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
