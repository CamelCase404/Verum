import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
type Variant = "primary" | "accent" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; size?: Size; block?: boolean; }
const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg shadow-sm hover:opacity-90",
  accent: "bg-accent text-white shadow-sm hover:bg-accent-2",
  ghost: "border border-line-2 bg-surface text-ink hover:border-ink-4 hover:bg-surface-2",
  quiet: "text-ink-2 hover:text-ink hover:bg-black/5",
};
const sizes: Record<Size, string> = { sm: "h-[34px] px-[14px] text-[13px]", md: "h-[42px] px-[20px] text-[14px]", lg: "h-[50px] px-[26px] text-[15px] rounded-xl" };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "ghost", size = "md", block, ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center gap-2 rounded border border-transparent font-medium transition-all duration-200 hover:-translate-y-px active:scale-[0.98] disabled:opacity-45", variants[variant], sizes[size], block && "w-full", className)} {...props} />
));
Button.displayName = "Button";
