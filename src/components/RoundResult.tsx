import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Siren, VenetianMask, ArrowRight, Trophy } from "lucide-react";
import { useI18n, tpl } from "../i18n";
import { Btn, Avatar } from "./ui";
import { ROLES, fmtNum } from "../game";
import type { Player, RolesByPlayer } from "../game";
import { sfx, haptic } from "../sound";

export default function RoundResult({
  players,
  roles,
  policeId,
  kallanId,
  accusedId,
  points,
  isEnding,
  onNext,
}: {
  players: Player[];
  roles: RolesByPlayer;
  policeId: string;
  kallanId: string;
  accusedId: string;
  /** cumulative scores BEFORE this round — we display +delta */
  points: Record<string, number>;
  isEnding: boolean;
  onNext: () => void;
}) {
  const { s, lang } = useI18n();
  const caught = accusedId === kallanId;
  const kallan = players.find((p) => p.id === kallanId)!;

  const rows = useMemo(
    () =>
      [...players]
        .sort((a, b) => (points[b.id] ?? 0) - (points[a.id] ?? 0))
        .map((p) => ({
          player: p,
          role: ROLES[roles[p.id]],
          delta: points[p.id] ?? 0,
        })),
    [players, roles, points]
  );

  // staggered coin ticks in sync with the point pops
  useEffect(() => {
    haptic(caught ? [30, 60, 30, 60, 30, 60, 220] : [240]);
    const timers = rows.map((r, i) =>
      setTimeout(() => {
        if (r.delta > 0) sfx.coin();
      }, 650 + i * 150)
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe ${
        caught ? "siren-flash" : ""
      }`}
    >
      {/* hero */}
      <div className="pt-8 text-center">
        <motion.div
          initial={{ scale: 0, rotate: caught ? 0 : -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative mx-auto w-fit"
        >
          <div
            className={`absolute -inset-8 rounded-full blur-2xl ${
              caught ? "bg-rose-500/25" : "bg-violet-500/25"
            }`}
          />
          <div
            className={`relative grid h-28 w-28 place-items-center rounded-[2.4rem] border backdrop-blur-md ${
              caught
                ? "border-rose-300/40 bg-gradient-to-br from-rose-500/30 to-red-700/20 shadow-[0_24px_80px_-14px_rgba(244,63,94,0.8)]"
                : "border-violet-300/40 bg-gradient-to-br from-violet-500/30 to-indigo-700/20 shadow-[0_24px_80px_-14px_rgba(139,92,246,0.8)]"
            }`}
          >
            {caught ? (
              <Siren size={52} className="text-rose-300" strokeWidth={1.6} />
            ) : (
              <VenetianMask size={52} className="text-violet-300" strokeWidth={1.6} />
            )}
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 150, damping: 15 }}
          className={`mt-8 font-display font-extrabold leading-[1.02] tracking-tight ${
            caught
              ? "bg-gradient-to-b from-white via-rose-100 to-rose-500 bg-clip-text text-transparent text-5xl"
              : "bg-gradient-to-b from-white via-violet-100 to-violet-500 bg-clip-text text-transparent text-[2.4rem]"
          }`}
        >
          {caught ? s.caught : s.escaped}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mt-3 font-display text-lg font-bold text-zinc-300"
        >
          {tpl(caught ? s.wasTheKallan : s.kallanWas, { name: kallan.name })}
        </motion.p>
      </div>

      {/* points */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-9 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500"
      >
        {s.roundPoints}
      </motion.p>

      <div className="mt-3 flex-1 space-y-2 pb-56">
        {rows.map(({ player, role, delta }, i) => {
          const Icon = role.icon;
          const globalIdx = players.findIndex((x) => x.id === player.id);
          const isPolice = player.id === policeId;
          const isKallan = player.id === kallanId;
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 220, damping: 22 }}
              className="flex items-center gap-3 rounded-3xl border border-white/[0.08] bg-white/[0.04] p-3 backdrop-blur-md"
            >
              <Avatar name={player.name} index={globalIdx} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-bold text-zinc-100">
                  {player.name}
                </p>
                <p className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: role.hue }}>
                  <Icon size={11} />
                  {s.roleWord[role.id].name}
                  {isPolice && (
                    <span className="rounded bg-white/10 px-1 text-[8px] font-bold uppercase tracking-wider text-zinc-400">
                      {lang === "en" ? "guessed" : "തിരഞ്ഞെടുത്തു"}
                    </span>
                  )}
                  {isKallan && (
                    <span className="rounded bg-white/10 px-1 text-[8px] font-bold uppercase tracking-wider text-zinc-400">
                      {caught ? (lang === "en" ? "busted" : "പിടിയിൽ") : lang === "en" ? "free" : "രക്ഷപ്പെട്ടു"}
                    </span>
                  )}
                </p>
              </div>
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.65 + i * 0.12,
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                }}
                className={`font-display text-2xl font-extrabold tabular-nums ${
                  delta > 0 ? "text-emerald-300" : "text-zinc-600"
                }`}
              >
                +{fmtNum(delta)}
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {/* next CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 + rows.length * 0.12 }}
        className="pb-safe fixed inset-x-0 bottom-[72px] z-30 mx-auto w-full max-w-md px-6"
      >
        <Btn
          big
          variant={isEnding ? "gold" : "primary"}
          className="w-full"
          icon={isEnding ? <Trophy size={21} /> : <ArrowRight size={21} />}
          onClick={onNext}
        >
          {isEnding ? s.crownWinner : s.nextRound}
        </Btn>
      </motion.div>
    </div>
  );
}
