import { cn } from "@/lib/utils";
type V = "junior" | "mid" | "senior" | "live" | "blue" | "violet";
const styles: Record<V, string> = { junior: "bg-bg-2 text-ink-2", mid: "bg-accent-soft text-accent", senior: "bg-amber-soft text-amber", live: "bg-warn-soft text-warn", blue: "bg-blue-soft text-blue", violet: "bg-violet-soft text-violet" };
export function Badge({ variant, children, className }: { variant: V; children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-[11.5px] font-semibold tracking-wider uppercase whitespace-nowrap", styles[variant], className)}>{children}</span>;
}
