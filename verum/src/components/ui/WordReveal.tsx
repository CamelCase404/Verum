import { useEffect, useRef } from "react";
export function WordReveal({ children, as: Tag = "span", className = "" }: { children: React.ReactNode; as?: any; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.querySelectorAll(".word-reveal").forEach((w) => w.classList.add("revealed")); io.unobserve(el); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const text = typeof children === "string" ? children : "";
  if (!text) return <Tag ref={ref} className={className}>{children}</Tag>;
  let wi = 0;
  const parts = text.split(/(\s+)/);
  return <Tag ref={ref} className={className}>{parts.map((t, i) => { if (!t.trim()) return t; const idx = wi++; return <span key={i} className="inline-block overflow-hidden align-top" style={{ "--wi": idx } as any}><span className="word-reveal"><span className="word-inner">{t}</span></span></span>; })}</Tag>;
}
