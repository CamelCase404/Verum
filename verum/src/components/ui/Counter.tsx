import { useEffect, useRef } from "react";
import { Anim } from "@/lib/anim";
export function Counter({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { Anim.countUp(el, to, { prefix, suffix, decimals, dur: 1600 }); io.unobserve(el); }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [to, prefix, suffix, decimals]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}
