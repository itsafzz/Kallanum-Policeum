import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home, Handshake, Medal } from "lucide-react";
import { useI18n } from "../i18n";
import { Btn, Avatar } from "./ui";
import Confetti from "./Confetti";
import { fmtNum } from "../game";
import type { Player } from "../game";
import { sfx, haptic } from "../sound";

export type EndMode = "win" | "tie" | "draw";

export default function GameOver({
  mode,
  players,
  winnerId,
  tiedIds,
  onReplay,
  onNewGame,
  onTiebreaker,
  onAcceptDraw,
}: {
  mode: EndMode;
  players: Player[];
  winnerId: string | null;
  tiedIds: string[];
  onReplay: () => void;
  onNewGame: () => void;
  onTiebreaker: () => void;
  onAcceptDraw: () => void;
}) {
  const { s } = useI18n();
  const sorted = useMemo(
    () => [...players].sort((a, b) => b.score - a.score),
    [players]
  );
  const winner = players.find((p) => p.id === winnerId) ?? null;

  useEffect(() => {
    if (mode === "win") {
      sfx.win();
      haptic([25, 50, 25, 50, 25, 50, 300]);
    } else if (mode === "tie") {
      sfx.suspense();
      haptic([60, 80, 60]);
    }
  }, [mode]);

  const headline =
    mode === "win" ? s.gameOver : mode === "tie" ? s.itsATie : s.sharedGlory;

  const sub =
    mode === "win"
      ? ""
      : mode === "tie"
        ? s.tieSub
        : s.drawSub;

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      {mode === "win" && <Confetti />}
      {mode === "draw" && <Confetti count={80} colors={["#a78bfa", "#4d7cfe", "#f5f5f4"]} />}

      {/* hero */}
      <div className="pt-9 text-center">
        <motion.div
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 13 }}
          className="relative mx-auto w-fit"
        >
          <div className="absolute -inset-10 rounded-full bg-amber-400/20 blur-2xl" />
          <motion.div
            animate={{ rotate: [0, -4, 4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative grid h-28 w-28 place-items-center rounded-full border border-amber-200/50 bg-gradient-to-b from-amber-300/30 to-orange-500/20 shadow-[0_30px_90px_-16px_rgba(255,176,32,0.8)]"
          >
            {mode === "win" ? (
              <Trophy size={54} className="text-amber-300" strokeWidth={1.6} />
            ) : (
              <Handshake size={50} className="text-violet-300" strokeWidth={1.6} />
            )}
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-7 bg-gradient-to-b from-white via-amber-100 to-amber-500 bg-clip-text font-display text-5xl font-extrabold tracking-tight text-transparent"
        >
          {headline}
        </motion.h2>

        {mode === "win" && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 160, damping: 14 }}
            className="mt-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-zinc-500">
              {s.winnerWord}
            </p>
            <p className="mt-1 font-display text-4xl font-extrabold text-white">
              {winner.name}
            </p>
            <p className="mt-1 font-display text-lg font-bold tabular-nums text-amber-300">
              {fmtNum(winner.score)} pts
            </p>
          </motion.div>
        )}

        {mode !== "win" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mx-auto mt-3 max-w-[17rem] text-sm text-zinc-400"
          >
            {sub}
          </motion.p>
        )}
      </div>

      {/* final scores */}
      <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
        {s.finalScores}
      </p>
      <div className="mt-3 flex-1 space-y-2 pb-44">
        {sorted.map((p, rank) => {
          const globalIdx = players.findIndex((x) => x.id === p.id);
          const isWinner = mode !== "tie" && winner && p.id === winner.id;
          const isTiedTop = mode === "tie" && tiedIds.includes(p.id);
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + rank * 0.08 }}
              className={`flex items-center gap-3 rounded-3xl border p-3 backdrop-blur-md ${
                isWinner
                  ? "border-amber-300/50 bg-gradient-to-r from-amber-400/15 to-orange-500/5 shadow-[0_14px_44px_-14px_rgba(255,176,32,0.55)]"
                  : isTiedTop
                    ? "border-violet-300/40 bg-violet-500/[0.08]"
                    : "border-white/[0.08] bg-white/[0.04]"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-extrabold tabular-nums ${
                  rank === 0 ? "bg-amber-400/25 text-amber-300" : "bg-white/[0.06] text-zinc-500"
                }`}
              >
                {rank + 1}
              </span>
              <Avatar name={p.name} index={globalIdx} size="sm" />
              <span className="min-w-0 flex-1 truncate font-display text-base font-bold text-zinc-100">
                {p.name}
              </span>
              {isWinner && <Medal size={16} className="text-amber-300" />}
              <span className="font-display text-xl font-extrabold tabular-nums text-white">
                {fmtNum(p.score)}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* actions */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="pb-safe fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-md bg-gradient-to-t from-[#07060c] via-[#07060c]/95 to-transparent px-6 pb-7 pt-12"
      >
        {mode === "tie" ? (
          <div className="grid grid-cols-1 gap-3">
            <Btn big variant="gold" className="w-full" icon={<Trophy size={20} />} onClick={onTiebreaker}>
              {s.tiebreaker}
            </Btn>
            <Btn variant="ghost" className="w-full" icon={<Handshake size={18} />} onClick={onAcceptDraw}>
              {s.endAsDraw}
            </Btn>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Btn big variant="gold" icon={<RotateCcw size={20} />} onClick={onReplay}>
              {s.playAgain}
            </Btn>
            <Btn big variant="ghost" icon={<Home size={20} />} onClick={onNewGame}>
              {s.newGame}
            </Btn>
          </div>
        )}
      </motion.div>
    </div>
  );
}
