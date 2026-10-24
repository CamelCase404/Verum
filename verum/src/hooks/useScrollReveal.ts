import { useEffect } from "react";
export function useScrollReveal(dep: unknown = null) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => { (el as HTMLElement).classList.remove("revealed"); io.observe(el); });
    return () => io.disconnect();
  }, [dep]);
}
