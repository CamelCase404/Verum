const SOUND_KEY = "verum_sound";

export const Sound = {
  enabled: (() => {
    try { return localStorage.getItem(SOUND_KEY) !== "off"; } catch { return true; }
  })(),
  ctx: null as AudioContext | null,
  ensure() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch {}
    }
  },
  play(freq = 600, dur = 60, type: OscillatorType = "sine", vol = 0.04) {
    if (!this.enabled) return;
    this.ensure();
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur / 1000);
    o.connect(g);
    g.connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + dur / 1000);
  },
  click() { this.play(520, 40, "sine", 0.03); },
  success() {
    this.play(660, 80, "sine", 0.05);
    setTimeout(() => this.play(880, 100, "sine", 0.05), 80);
  },
  error() { this.play(280, 100, "triangle", 0.04); },
  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem(SOUND_KEY, this.enabled ? "on" : "off"); } catch {}
    if (this.enabled) this.success();
  },
};
