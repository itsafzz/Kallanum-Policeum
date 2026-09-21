import type { MouseEventHandler, ReactNode } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { sfx, haptic } from "../sound";
import { useI18n } from "../i18n";
import type { Lang } from "../i18n";
import { AVATAR_GRADS } from "../game";

type BtnVariant = "primary" | "gold" | "danger" | "ghost" | "success";

const VARIANTS: Record<BtnVariant, string> = {
  primary:
    "bg-gradient-to-b from-sky-400 to-blue-600 text-white shadow-[0_10px_36px_-8px_rgba(59,99,246,0.65)] border border-sky-300/40",
  gold: "bg-gradient-to-b from-amber-300 to-orange-500 text-amber-950 shadow-[0_10px_36px_-8px_rgba(255,176,32,0.55)] border border-amber-200/60",
  danger:
    "bg-gradient-to-b from-rose-400 to-red-600 text-white shadow-[0_10px_36px_-8px_rgba(244,63,94,0.6)] border border-rose-300/40",
  ghost:
    "bg-white/[0.06] text-zinc-100 border border-white/10 backdrop-blur-md",
  success:
    "bg-gradient-to-b from-emerald-300 to-teal-500 text-emerald-950 shadow-[0_10px_36px_-8px_rgba(52,211,153,0.55)] border border-emerald-200/50",
};

interface BtnProps {
  variant?: BtnVariant;
  big?: boolean;
  silent?: boolean;
  icon?: ReactNode;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Btn({
  variant = "primary",
  big = false,
  silent = false,
  icon,
  className = "",
  children,
  onClick,
  ...rest
}: BtnProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`relative inline-flex items-center justify-center gap-2.5 rounded-3xl font-display font-bold transition-colors disabled:opacity-40 disabled:saturate-50 ${
        big ? "h-16 px-8 text-xl" : "h-13 px-6 text-base"
      } ${VARIANTS[variant]} ${className}`}
      onClick={(e) => {
        if (!silent) {
          sfx.tap();
          haptic(12);
        }
        onClick?.(e);
      }}
      {...rest}
    >
      {icon}
      {children}
    </motion.button>
  );
}

export function Avatar({
  name,
  index,
  size = "md",
  dim = false,
}: {
  name: string;
  index: number;
  size?: "sm" | "md" | "lg";
  dim?: boolean;
}) {
  const grad = AVATAR_GRADS[index % AVATAR_GRADS.length];
  const sz =
    size === "sm"
      ? "h-9 w-9 text-sm"
      : size === "lg"
        ? "h-16 w-16 text-2xl"
        : "h-12 w-12 text-lg";
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display font-bold text-white shadow-inner ${grad} ${sz} ${dim ? "opacity-50 saturate-50" : ""}`}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
}

export function SoundToggle({
  on,
  onToggle,
  className = "",
}: {
  on: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label="toggle sound"
      className={`grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-zinc-300 backdrop-blur-md ${className}`}
      onClick={() => {
        onToggle();
        haptic(8);
        if (!on) sfx.tap();
      }}
    >
      {on ? <Volume2 size={19} /> : <VolumeX size={19} />}
    </motion.button>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const pick = (l: Lang) => {
    setLang(l);
    sfx.tap();
    haptic(8);
  };
  return (
    <div
      className={`flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] p-1 backdrop-blur-md ${className}`}
    >
      {(["en", "ml"] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => pick(l)}
          className={`h-9 rounded-xl px-3 text-sm font-semibold transition-all ${
            lang === l
              ? "bg-gradient-to-b from-amber-300 to-orange-500 text-amber-950"
              : "text-zinc-400"
          }`}
        >
          {l === "en" ? "EN" : "മ"}
        </button>
      ))}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-zinc-300 backdrop-blur-md">
      {children}
    </span>
  );
}
