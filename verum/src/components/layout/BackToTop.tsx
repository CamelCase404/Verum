import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className={cn("fixed right-6 bottom-6 z-[80] w-11 h-11 rounded-full bg-ink text-bg shadow-lg flex items-center justify-center transition-all", show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none")} aria-label="Наверх">↑</button>
  );
}
