/* Tiny WebAudio synth — no assets, everything synthesized on the fly */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface ToneOpts {
  f: number;
  t?: number; // start offset seconds
  d?: number; // duration
  type?: OscillatorType;
  v?: number; // volume
  slide?: number; // slide-to frequency
}

function tone({ f, t = 0, d = 0.12, type = "sine", v = 0.25, slide }: ToneOpts) {
  const c = ac();
  if (!c || !master || !enabled) return;
  try {
    const osc = c.createOscillator();
    const g = c.createGain();
    const start = c.currentTime + t;
    osc.type = type;
    osc.frequency.setValueAtTime(f, start);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(1, slide), start + d);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(v, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + d);
    osc.connect(g);
    g.connect(master);
    osc.start(start);
    osc.stop(start + d + 0.05);
  } catch {
    /* noop */
  }
}

export const sfx = {
  setEnabled(v: boolean) {
    enabled = v;
    if (v) ac();
  },
  isEnabled: () => enabled,
  /** call inside a user gesture to warm the AudioContext */
  unlock() {
    ac();
  },

  tap() {
    tone({ f: 620, d: 0.06, type: "triangle", v: 0.18 });
    tone({ f: 930, t: 0.02, d: 0.05, type: "sine", v: 0.1 });
  },
  back() {
    tone({ f: 440, d: 0.07, type: "triangle", v: 0.14, slide: 330 });
  },
  error() {
    tone({ f: 160, d: 0.18, type: "sawtooth", v: 0.16, slide: 110 });
  },
  reveal() {
    tone({ f: 220, d: 0.35, type: "sine", v: 0.2, slide: 880 });
    tone({ f: 440, t: 0.08, d: 0.3, type: "triangle", v: 0.14, slide: 1320 });
    tone({ f: 1760, t: 0.22, d: 0.22, type: "sine", v: 0.12 });
  },
  hide() {
    tone({ f: 720, d: 0.16, type: "triangle", v: 0.16, slide: 240 });
  },
  select() {
    tone({ f: 520, d: 0.07, type: "square", v: 0.1 });
    tone({ f: 780, t: 0.05, d: 0.09, type: "square", v: 0.08 });
  },
  suspense() {
    tone({ f: 98, d: 0.32, type: "sine", v: 0.34 });
    tone({ f: 98, t: 0.18, d: 0.3, type: "sine", v: 0.3, slide: 140 });
  },
  caught() {
    for (let i = 0; i < 3; i++) {
      tone({ f: 740, t: i * 0.24, d: 0.13, type: "square", v: 0.12 });
      tone({ f: 560, t: i * 0.24 + 0.12, d: 0.13, type: "square", v: 0.12 });
    }
    tone({ f: 1180, t: 0.72, d: 0.3, type: "triangle", v: 0.16, slide: 1560 });
  },
  escaped() {
    tone({ f: 880, d: 0.16, type: "triangle", v: 0.16, slide: 660 });
    tone({ f: 660, t: 0.16, d: 0.16, type: "triangle", v: 0.16, slide: 495 });
    tone({ f: 495, t: 0.32, d: 0.3, type: "triangle", v: 0.18, slide: 330 });
    tone({ f: 1320, t: 0.5, d: 0.14, type: "sine", v: 0.1, slide: 1760 });
  },
  coin() {
    tone({ f: 990, d: 0.07, type: "square", v: 0.09 });
    tone({ f: 1320, t: 0.06, d: 0.12, type: "square", v: 0.08 });
  },
  win() {
    const seq = [523, 659, 784, 1047, 784, 1047, 1319];
    seq.forEach((f, i) =>
      tone({ f, t: i * 0.13, d: 0.22, type: "triangle", v: 0.18 })
    );
    tone({ f: 1568, t: seq.length * 0.13, d: 0.5, type: "sine", v: 0.14 });
  },
};

/** haptic feedback — silently degrades on unsupported devices */
export function haptic(pattern: number | number[] = 10) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* noop */
  }
}
