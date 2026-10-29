export const Anim = {
  ease: {
    outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
    outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    outBack: (t: number) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
  },
  tween(
    from: number,
    to: number,
    dur: number,
    cb: (v: number, t: number) => void,
    easeFn: keyof typeof Anim.ease = "outCubic"
  ) {
    const ease = Anim.ease[easeFn];
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      cb(from + (to - from) * ease(t), t);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
  countUp(
    el: HTMLElement,
    to: number,
    opts: { dur?: number; start?: number; prefix?: string; suffix?: string; decimals?: number } = {}
  ) {
    const { dur = 1500, start = 0, prefix = "", suffix = "", decimals = 0 } = opts;
    Anim.tween(start, to, dur, (v) => {
      el.textContent = prefix + v.toFixed(decimals) + suffix;
    }, "outExpo");
  },
};
