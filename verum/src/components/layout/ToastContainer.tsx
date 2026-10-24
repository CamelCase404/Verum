export function ToastContainer() {
  return <div id="toasts" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 items-center pointer-events-none" />;
}
export function toast(text: string, ms = 2800) {
  const wrap = document.getElementById("toasts");
  if (!wrap) return;
  const el = document.createElement("div");
  el.className = "bg-ink text-bg px-[18px] py-[11px] rounded-[10px] text-[13.5px] shadow-2xl flex items-center gap-2 pointer-events-auto";
  el.innerHTML = `<span>✦</span><span>${text}</span>`;
  wrap.appendChild(el);
  setTimeout(() => { el.style.transition = "opacity 0.3s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, ms);
}
