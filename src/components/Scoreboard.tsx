import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronUp, Trophy, BarChart3 } from "lucide-react";
import { useI18n, tpl } from "../i18n";
import { Avatar } from "./ui";
import { fmtNum } from "../game";
import type { Player } from "../game";
import { sfx, haptic } from "../sound";

export default function Scoreboard({
  players,
  round,
  target,
}: {
  players: Player[];
  round: number;
  target: number;
}) {
  const { s } = useI18n();
  const [open, setOpen] = useState(false);
  const sorted = [...players].sort((a, b) => b.score - a.score);
  const leader = sorted[0];

  return (
    <motion.div
      layout
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md"
      initial={false}
    >
      <motion.div
        layout
        className="overflow-hidden rounded-t-[1.8rem] border border-b-0 border-white/10 bg-[#0e0c18]/95 shadow-[0_-18px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
      >
        {/* handle / header */}
        <button
          onClick={() => {
            setOpen((o) => !o);
            sfx.tap();
            haptic(8);
          }}
          className="flex w-full flex-col px-5"
          aria-expanded={open}
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/20" />
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={14} className="text-amber-300" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                {tpl(s.roundShort, { n: round })} · {tpl(s.targetShort, { n: fmtNum(target) })}
              </span>
            </div>
            {!open && leader && leader.score > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                <Trophy size={11} />
                {leader.name} · {fmtNum(leader.score)}
              </span>
            ) : (
              <motion.span
                animate={{ rotate: open ? 180 : 0 }}
                className="text-zinc-500"
              >
                <ChevronUp size={17} />
              </motion.span>
            )}
          </div>
        </button>

        {/* expanded standings */}
        <motion.div
          initial={false}
          animate={{ height: open ? 272 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          className="overflow-hidden"
        >
          <div className={`no-scrollbar h-[272px] space-y-2 overflow-y-auto px-5 pb-2 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}>
              {sorted.map((p, rank) => {
                const globalIdx = players.findIndex((x) => x.id === p.id);
                const pct = Math.min(100, (p.score / target) * 100);
                return (
                  <div
                    key={p.id}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] p-2.5"
                  >
                    {/* progress to target */}
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-400/10 to-transparent"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="relative flex items-center gap-3">
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold tabular-nums ${
                          rank === 0
                            ? "bg-amber-400/20 text-amber-300"
                            : "bg-white/[0.06] text-zinc-500"
                        }`}
                      >
                        {rank + 1}
                      </span>
                      <Avatar name={p.name} index={globalIdx} size="sm" />
                      <span className="min-w-0 flex-1 truncate font-display font-bold text-zinc-100">
                        {p.name}
                        {rank === 0 && p.score > 0 && (
                          <span className="ml-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-300/80">
                            {s.leading}
                          </span>
                        )}
                      </span>
                      <span className="font-display text-lg font-extrabold tabular-nums text-white">
                        {fmtNum(p.score)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
        <div className="pb-safe" />
      </motion.div>
    </motion.div>
  );
}
