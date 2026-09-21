import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Minus,
  Plus,
  Users,
  PencilLine,
  Target,
  Wand2,
  ArrowRight,
  Play,
} from "lucide-react";
import { useI18n, tpl } from "../i18n";
import { Btn, Avatar, SoundToggle } from "./ui";
import {
  MIN_PLAYERS,
  MAX_PLAYERS,
  TARGET_OPTIONS,
  DEFAULT_TARGET,
  NAME_POOL_EN,
  NAME_POOL_ML,
  CITIZEN_ORDER,
  fmtNum,
  AVATAR_GRADS,
} from "../game";
import { sfx, haptic } from "../sound";

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: 60 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -60 * dir }),
};

function loadSavedNames(): string[] {
  try {
    const raw = localStorage.getItem("kp_names");
    if (raw) {
      const arr = JSON.parse(raw) as string[];
      if (Array.isArray(arr) && arr.every((n) => typeof n === "string")) return arr;
    }
  } catch {
    /* noop */
  }
  return [];
}

function loadSavedTarget(): number {
  try {
    const n = Number(localStorage.getItem("kp_target"));
    if (n >= 500) return n;
  } catch {
    /* noop */
  }
  return DEFAULT_TARGET;
}

export default function Setup({
  onBack,
  onStart,
  soundOn,
  onToggleSound,
  lang,
}: {
  onBack: () => void;
  onStart: (names: string[], target: number) => void;
  soundOn: boolean;
  onToggleSound: () => void;
  lang: "en" | "ml";
}) {
  const { s } = useI18n();
  const [step, setStep] = useState(0);
  const dir = useRef(1);
  const [count, setCount] = useState(() =>
    Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, loadSavedNames().length || 4))
  );
  const [names, setNames] = useState<string[]>(() => {
    const saved = loadSavedNames();
    const pool = lang === "ml" ? NAME_POOL_ML : NAME_POOL_EN;
    return Array.from(
      { length: MAX_PLAYERS },
      (_, i) => saved[i] ?? pool[i % pool.length]
    );
  });
  const [target, setTarget] = useState<number>(loadSavedTarget);
  const [customMode, setCustomMode] = useState(
    () => !TARGET_OPTIONS.includes(loadSavedTarget())
  );
  const [customVal, setCustomVal] = useState(() => String(loadSavedTarget()));
  const [customErr, setCustomErr] = useState(false);

  const go = (next: number) => {
    dir.current = next > step ? 1 : -1;
    setStep(next);
  };

  const bumpCount = (delta: number) => {
    const next = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count + delta));
    if (next === count) {
      sfx.error();
      haptic([30, 40, 30]);
      return;
    }
    sfx.select();
    haptic(10);
    setCount(next);
  };

  const finalNames = useMemo(() => {
    const pool = lang === "ml" ? NAME_POOL_ML : NAME_POOL_EN;
    const seen = new Map<string, number>();
    return names.slice(0, count).map((n, i) => {
      let name = n.trim() || pool[i % pool.length];
      const times = seen.get(name) ?? 0;
      seen.set(name, times + 1);
      if (times > 0) name = `${name} ${times + 1}`;
      return name;
    });
  }, [names, count, lang]);

  const startGame = () => {
    const t = customMode ? Math.round(Number(customVal)) : target;
    if (!t || t < 500) {
      setCustomErr(true);
      sfx.error();
      haptic([30, 40, 30]);
      return;
    }
    try {
      localStorage.setItem("kp_names", JSON.stringify(finalNames));
      localStorage.setItem("kp_target", String(t));
    } catch {
      /* noop */
    }
    onStart(finalNames, t);
  };

  const HEADERS = [s.numberOfPlayers, s.whoIsPlaying, s.targetTitle];
  const HINTS = [null, s.namesHint, s.targetHint];

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      {/* header */}
      <div className="flex items-center justify-between pt-5">
        <button
          onClick={() => {
            sfx.back();
            if (step === 0) onBack();
            else go(step - 1);
          }}
          className="flex h-11 items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] pl-2.5 pr-4 text-sm font-semibold text-zinc-300 backdrop-blur-md"
        >
          <ChevronLeft size={17} />
          {s.back}
        </button>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? "w-7 bg-amber-400" : i < step ? "w-3 bg-amber-400/50" : "w-3 bg-white/15"
              }`}
            />
          ))}
        </div>
        <SoundToggle on={soundOn} onToggle={onToggleSound} />
      </div>

      <AnimatePresence mode="wait" custom={dir.current}>
        <motion.div
          key={step}
          custom={dir.current}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          <div className="mb-1 mt-7 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-300/80">
            {step === 0 && <Users size={13} />}
            {step === 1 && <PencilLine size={13} />}
            {step === 2 && <Target size={13} />}
            {s.setupTitle} · {step + 1}/3
          </div>
          <h2 className="font-display text-3xl font-extrabold leading-tight">
            {HEADERS[step]}
          </h2>
          {HINTS[step] && <p className="mt-1.5 text-sm text-zinc-500">{HINTS[step]}</p>}

          {/* STEP 0 — count */}
          {step === 0 && (
            <div className="flex flex-1 flex-col justify-center pb-10">
              <div className="mt-2 flex items-center justify-center gap-5">
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => bumpCount(-1)}
                  className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.06] text-zinc-200 backdrop-blur-md"
                >
                  <Minus size={24} />
                </motion.button>
                <div className="relative grid h-36 w-36 place-items-center">
                  <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-amber-400/35 animate-slowspin" />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.07] to-transparent" />
                  <div className="absolute inset-0 rounded-full bg-[#0c0a15]/60" />
                  <div className="relative text-center">
                    <motion.span
                      key={count}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-6xl font-extrabold tabular-nums"
                    >
                      {count}
                    </motion.span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {s.playersUnit}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => bumpCount(1)}
                  className="grid h-16 w-16 place-items-center rounded-3xl border border-white/10 bg-white/[0.06] text-zinc-200 backdrop-blur-md"
                >
                  <Plus size={24} />
                </motion.button>
              </div>

              {/* quick pills */}
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: MAX_PLAYERS - MIN_PLAYERS + 1 }, (_, i) => MIN_PLAYERS + i).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setCount(n);
                        sfx.select();
                        haptic(8);
                      }}
                      className={`h-11 w-11 rounded-2xl font-display text-lg font-bold transition-all ${
                        n === count
                          ? "bg-gradient-to-b from-amber-300 to-orange-500 text-amber-950 shadow-[0_8px_28px_-6px_rgba(255,176,32,0.6)]"
                          : "border border-white/10 bg-white/[0.05] text-zinc-400"
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              </div>

              {/* seat dots */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
                {Array.from({ length: count }).map((_, i) => (
                  <motion.div
                    key={`${count}-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 15, delay: i * 0.04 }}
                    className={`h-4 w-4 rounded-full bg-gradient-to-br ${AVATAR_GRADS[i % AVATAR_GRADS.length]} shadow-md`}
                  />
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                {s.roleWord.police.name} ×1 · {s.roleWord.kallan.name} ×1 · {CITIZEN_ORDER.slice(0, count - 2)
                  .map((r) => s.roleWord[r].name)
                  .join(" · ")}
              </p>
            </div>
          )}

          {/* STEP 1 — names */}
          {step === 1 && (
            <div className="no-scrollbar mt-6 flex-1 space-y-3 overflow-y-auto pb-36">
              {Array.from({ length: count }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.04] p-2.5 pl-2.5 backdrop-blur-md focus-within:border-amber-300/50 focus-within:bg-white/[0.07]"
                >
                  <Avatar name={names[i]} index={i} />
                  <input
                    value={names[i]}
                    maxLength={18}
                    placeholder={tpl(s.playerPh, { n: i + 1 })}
                    onChange={(e) =>
                      setNames((prev) => prev.map((n, j) => (j === i ? e.target.value : n)))
                    }
                    className="h-12 w-full min-w-0 bg-transparent font-display text-lg font-bold text-white placeholder-zinc-600 outline-none"
                  />
                  <PencilLine size={16} className="mr-3 shrink-0 text-zinc-600" />
                </motion.div>
              ))}
            </div>
          )}

          {/* STEP 2 — target */}
          {step === 2 && (
            <div className="mt-6 flex-1 pb-36">
              <div className="grid grid-cols-2 gap-3">
                {TARGET_OPTIONS.map((opt, i) => {
                  const active = !customMode && target === opt;
                  return (
                    <motion.button
                      key={opt}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCustomMode(false);
                        setTarget(opt);
                        sfx.select();
                        haptic(10);
                      }}
                      className={`relative flex h-24 flex-col items-center justify-center rounded-3xl border backdrop-blur-md transition-all ${
                        active
                          ? "border-amber-300/60 bg-gradient-to-b from-amber-400/20 to-orange-500/10 shadow-[0_12px_40px_-10px_rgba(255,176,32,0.45)]"
                          : "border-white/[0.08] bg-white/[0.04]"
                      }`}
                    >
                      {opt === DEFAULT_TARGET && (
                        <span className="absolute -top-2.5 rounded-full bg-gradient-to-b from-amber-300 to-orange-500 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-950">
                          {s.popular}
                        </span>
                      )}
                      <span
                        className={`font-display text-2xl font-extrabold tabular-nums ${active ? "text-amber-200" : "text-zinc-200"}`}
                      >
                        {fmtNum(opt)}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        pts
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setCustomMode(true);
                  sfx.select();
                  haptic(10);
                }}
                className={`mt-3 flex h-16 w-full items-center justify-center gap-2 rounded-3xl border backdrop-blur-md transition-all ${
                  customMode
                    ? "border-amber-300/60 bg-gradient-to-b from-amber-400/20 to-orange-500/10"
                    : "border-white/[0.08] bg-white/[0.04]"
                }`}
              >
                <Wand2 size={18} className={customMode ? "text-amber-300" : "text-zinc-400"} />
                <span className={`font-display text-lg font-bold ${customMode ? "text-amber-200" : "text-zinc-300"}`}>
                  {s.custom}
                  {customMode && Number(customVal) >= 500
                    ? ` · ${fmtNum(Math.round(Number(customVal)))}`
                    : ""}
                </span>
              </motion.button>

              <AnimatePresence>
                {customMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      {s.customLabel}
                    </label>
                    <motion.input
                      key={String(customErr)}
                      initial={customErr ? { x: 0 } : false}
                      animate={customErr ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
                      onChange={(e) => {
                        setCustomErr(false);
                        setCustomVal(e.target.value.replace(/[^0-9]/g, "").slice(0, 7));
                      }}
                      value={customVal}
                      inputMode="numeric"
                      className={`mt-2 h-16 w-full rounded-3xl border bg-white/[0.05] px-6 text-center font-display text-2xl font-extrabold tabular-nums text-amber-200 outline-none backdrop-blur-md ${
                        customErr ? "border-rose-400/60" : "border-white/10 focus:border-amber-300/50"
                      }`}
                    />
                    {customErr && (
                      <p className="mt-2 text-center text-xs font-semibold text-rose-300">{s.customErr}</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* sticky CTA */}
      <div className="pb-safe pointer-events-none fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md bg-gradient-to-t from-[#07060c] via-[#07060c]/90 to-transparent px-6 pb-6 pt-14">
        {step < 2 ? (
          <Btn big className="pointer-events-auto w-full" icon={<ArrowRight size={20} />} onClick={() => go(step + 1)}>
            {s.continueBtn}
          </Btn>
        ) : (
          <Btn big variant="gold" className="pointer-events-auto w-full" icon={<Play size={21} strokeWidth={2.6} />} onClick={startGame}>
            {s.startTheGame}
          </Btn>
        )}
      </div>

    </div>
  );
}
