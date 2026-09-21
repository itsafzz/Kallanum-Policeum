import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Check,
  Smartphone,
  Siren,
  ChevronLeft,
} from "lucide-react";
import { useI18n, tpl } from "../i18n";
import { Btn, Avatar } from "./ui";
import { ROLES, fmtNum } from "../game";
import type { Player, RolesByPlayer, RoleId } from "../game";
import { sfx, haptic } from "../sound";

type Mode = "list" | "warn" | "card";

export default function RevealHub({
  players,
  roles,
  onComplete,
}: {
  players: Player[];
  roles: RolesByPlayer;
  onComplete: () => void;
}) {
  const { s, lang } = useI18n();
  const [mode, setMode] = useState<Mode>("list");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const done = revealed.size;
  const allDone = done === players.length;
  const active = activeIdx !== null ? players[activeIdx] : null;
  const activeRole: RoleId | null = active ? roles[active.id] : null;
  const roleDef = activeRole ? ROLES[activeRole] : null;

  const openWarn = (idx: number) => {
    sfx.select();
    haptic(10);
    setActiveIdx(idx);
    setMode("warn");
  };

  const reveal = () => {
    sfx.reveal();
    haptic([14, 40, 14]);
    setMode("card");
  };

  const gotIt = () => {
    if (active) {
      const next = new Set(revealed);
      next.add(active.id);
      setRevealed(next);
      if (next.size === players.length) sfx.coin();
    }
    sfx.hide();
    haptic(20);
    setMode("list");
    setActiveIdx(null);
  };

  /* ============ SECRET ROLE CARD ============ */
  if (mode === "card" && active && activeRole && roleDef) {
    const Icon = roleDef.icon;
    const chip =
      activeRole === "police"
        ? s.catchChip
        : activeRole === "kallan"
          ? s.escapeChip
          : tpl(s.earnChip, { pts: fmtNum(roleDef.points) });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex flex-col overflow-hidden"
        style={{
          background: `radial-gradient(120% 100% at 50% 0%, ${roleDef.hue}26 0%, #07060c 58%), #07060c`,
        }}
      >
        {/* rays + glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[130vw] w-[130vw] -translate-x-1/2 -translate-y-1/2 animate-slowspin rays opacity-70"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-[38%] h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: `${roleDef.hue}30` }}
        />

        {/* privacy label */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-safe relative z-10 mx-auto mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400 backdrop-blur-md"
        >
          <EyeOff size={13} />
          {active.name}
        </motion.div>

        {/* card content */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.12 }}
            className="relative grid h-36 w-36 place-items-center rounded-[2.6rem] border"
            style={{
              background: `linear-gradient(160deg, ${roleDef.hue}40, ${roleDef.hue}14)`,
              borderColor: `${roleDef.hue}55`,
              boxShadow: `0 30px 90px -18px ${roleDef.hue}90`,
            }}
          >
            <Icon size={64} style={{ color: roleDef.hue }} strokeWidth={1.6} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-10 text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500"
          >
            {s.youAre}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 22, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.42, type: "spring", stiffness: 160, damping: 16 }}
            className={`mt-2 bg-gradient-to-b bg-clip-text font-display text-6xl font-extrabold leading-none text-transparent ${roleDef.grad} ${lang === "en" ? "uppercase" : ""}`}
          >
            {s.roleWord[activeRole].name}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.62 }}
            className="mt-4 font-display text-xl font-semibold text-zinc-300"
          >
            “{s.roleWord[activeRole].tag}”
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78 }}
            className={`mt-7 rounded-full border px-5 py-2.5 font-display text-sm font-bold ${roleDef.chip}`}
            style={{ color: roleDef.hue }}
          >
            {chip}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="pb-safe relative z-10 px-6 pb-8"
        >
          <Btn
            big
            variant="ghost"
            className="w-full border-white/25 bg-white/10"
            icon={<Check size={22} strokeWidth={3} />}
            onClick={gotIt}
          >
            {s.gotIt}
          </Btn>
        </motion.div>
      </motion.div>
    );
  }

  /* ============ PRIVACY WARNING ============ */
  if (mode === "warn" && active) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[60] flex flex-col bg-[#07060c]"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_30%,rgba(255,176,32,0.09),transparent_65%)]" />
        <div className="pt-safe relative z-10 px-6 pt-6">
          <button
            onClick={() => {
              sfx.back();
              setMode("list");
              setActiveIdx(null);
            }}
            className="flex h-11 items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.06] pl-2.5 pr-4 text-sm font-semibold text-zinc-300 backdrop-blur-md"
          >
            <ChevronLeft size={17} />
            {s.notYou}
          </button>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="relative"
          >
            <span className="absolute inset-0 rounded-full bg-amber-400/25 animate-ping-soft" />
            <div className="relative grid h-24 w-24 place-items-center rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-400/20 to-orange-500/10">
              <EyeOff size={42} className="text-amber-300" strokeWidth={1.7} />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-9 font-display text-3xl font-extrabold leading-tight"
          >
            {tpl(s.eyesOnly, { name: active.name })}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-3 max-w-[17rem] text-base leading-relaxed text-zinc-400"
          >
            {s.nobodyWatching}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pb-safe relative z-10 px-6 pb-8"
        >
          <Btn
            big
            variant="gold"
            className={`w-full ${lang === "en" ? "uppercase tracking-wide" : ""}`}
            icon={<Eye size={22} />}
            onClick={reveal}
          >
            {s.revealMyRole}
          </Btn>
        </motion.div>
      </motion.div>
    );
  }

  /* ============ PLAYER LIST ============ */
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      {/* header */}
      <div className="pt-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400 backdrop-blur-md"
        >
          <Smartphone size={13} className="text-amber-300" />
          {s.passThePhone}
        </motion.div>
        <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">
          {allDone ? s.allLocked : s.passThePhone}
        </h2>
        <p className="mx-auto mt-2 max-w-[19rem] text-sm leading-relaxed text-zinc-500">
          {allDone ? s.allLockedSub : s.tapNameHint}
        </p>

        {/* progress */}
        <div className="mx-auto mt-5 flex max-w-[240px] items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-500"
              animate={{ width: `${(done / players.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums text-zinc-400">
            {tpl(s.readyCount, { done, total: players.length })}
          </span>
        </div>
      </div>

      {/* list */}
      <div className="mt-7 flex-1 space-y-2.5 pb-40">
        <AnimatePresence>
          {players.map((p, i) => {
            const isDone = revealed.has(p.id);
            return (
              <motion.button
                key={p.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={isDone ? undefined : { scale: 0.97 }}
                disabled={isDone}
                onClick={() => openWarn(i)}
                className={`flex w-full items-center gap-3.5 rounded-3xl border p-3 text-left backdrop-blur-md transition-colors ${
                  isDone
                    ? "border-emerald-400/20 bg-emerald-500/[0.06]"
                    : "border-white/[0.09] bg-white/[0.05] active:border-amber-300/40"
                }`}
              >
                <Avatar name={p.name} index={i} dim={isDone} />
                <div className="min-w-0 flex-1">
                  <p className={`truncate font-display text-lg font-bold ${isDone ? "text-zinc-500 line-through decoration-emerald-400/40" : ""}`}>
                    {p.name}
                  </p>
                </div>
                {isDone ? (
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-400/15 text-emerald-300">
                    <Check size={17} strokeWidth={3} />
                  </span>
                ) : (
                  <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-zinc-400">
                    <span className="absolute inset-0 rounded-xl bg-amber-300/20 animate-ping-soft" />
                    <Eye size={16} />
                  </span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* all done CTA */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
            className="pb-safe fixed inset-x-0 bottom-[72px] z-30 mx-auto w-full max-w-md px-6"
          >
            <Btn
              big
              variant="gold"
              className="w-full"
              icon={<Siren size={22} />}
              onClick={() => {
                sfx.suspense();
                haptic([20, 50, 20]);
                onComplete();
              }}
            >
              {s.beginHunt}
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
