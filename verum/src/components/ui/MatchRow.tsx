import type { Specialist } from "@/types";
import { initials } from "@/lib/utils";
import { toast } from "@/components/layout/ToastContainer";

export function MatchRow({ m }: { m: Specialist }) {
  return (
    <div
      onClick={() => toast(`Открываем профиль: ${m.name}`)}
      className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3.5 border border-line rounded mb-2 hover:border-accent-line hover:bg-surface-2 transition-all cursor-pointer min-w-0 w-full"
    >
      <div className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] rounded-full bg-accent-soft text-accent flex items-center justify-center font-semibold text-[11px] md:text-[12.5px] shrink-0">
        {initials(m.name)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] md:text-sm font-medium mb-0.5 truncate">{m.name}</div>
        <div className="text-[11px] md:text-[12.5px] text-ink-3 truncate">{m.why}</div>
      </div>
      <div className="font-mono text-[12px] md:text-[13px] font-medium text-accent tabular-nums shrink-0">{m.match}%</div>
    </div>
  );
}
