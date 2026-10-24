import { cn } from "@/lib/utils";

type ChipVariant = "default" | "accent" | "line" | "warn" | "blue" | "violet";

const styles: Record<ChipVariant, string> = {
  default: "bg-bg-2 text-ink-2",
  accent: "bg-accent-soft text-accent",
  line: "bg-transparent border border-line-2",
  warn: "bg-warn-soft text-warn",
  blue: "bg-blue-soft text-blue",
  violet: "bg-violet-soft text-violet",
};

export function Chip({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center h-[26px] px-2.5 rounded-md text-[12.5px] font-medium whitespace-nowrap",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
