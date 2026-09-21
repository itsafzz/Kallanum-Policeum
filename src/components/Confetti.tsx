import { useEffect, useRef } from "react";

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  color: string;
  delay: number;
  life: number;
}

const DEFAULT_COLORS = ["#ffb020", "#4d7cfe", "#ff3b5c", "#34d399", "#f5f5f4"];

export default function Confetti({
  colors = DEFAULT_COLORS,
  count = 130,
}: {
  colors?: string[];
  count?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const c = canvas.getContext("2d");
    if (!c) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    c.scale(dpr, dpr);

    const spawn = (): Piece => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.5,
      y: H + 20,
      vx: (Math.random() - 0.5) * 9,
      vy: -(10 + Math.random() * 11),
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 7,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 36,
      life: 0,
    });

    const pieces: Piece[] = Array.from({ length: count }, spawn);
    let raf = 0;
    let frame = 0;
    const MAX = 330;

    const tick = () => {
      frame++;
      c.clearRect(0, 0, W, H);
      for (const p of pieces) {
        if (frame < p.delay) continue;
        p.life++;
        p.vy += 0.16;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        const flutter = Math.sin((p.life + p.rot * 40) / 9);
        const alpha = Math.max(0, 1 - p.life / (MAX + 30));
        c.save();
        c.globalAlpha = alpha;
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.scale(1, 0.4 + 0.6 * Math.abs(flutter));
        c.fillStyle = p.color;
        c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        c.restore();
      }
      if (frame < MAX) raf = requestAnimationFrame(tick);
      else c.clearRect(0, 0, W, H);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [colors, count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90]"
    />
  );
}
