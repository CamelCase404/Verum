export function confetti(x: number, y: number) {
  const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;

  const colors = ["#1e4d3a", "#2a6a4f", "#3d8a68", "#8a6516", "#2a4f7a", "#b8451f", "#4a3a8a"];
  const count = innerWidth < 640 ? 40 : 70;
  const parts: any[] = [];
  for (let i = 0; i < count; i++) {
    parts.push({
      x: x * devicePixelRatio,
      y: y * devicePixelRatio,
      vx: (Math.random() - 0.5) * 14 * devicePixelRatio,
      vy: (Math.random() - 1.2) * 12 * devicePixelRatio,
      r: Math.random() * 4 + 2,
      color: colors[i % colors.length],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      life: 1,
    });
  }

  const draw = () => {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    parts.forEach((p) => {
      if (p.life <= 0) return;
      alive = true;
      p.vy += 0.5 * devicePixelRatio;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.007;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    });
    ctx.globalAlpha = 1;
    if (alive) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  draw();
}
