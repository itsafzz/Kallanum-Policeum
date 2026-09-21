import { motion } from "framer-motion";
import { X, Siren, VenetianMask, Users, Hand, Target, Trophy } from "lucide-react";
import { useI18n } from "../i18n";
import { ROLES, CITIZEN_ORDER, fmtNum } from "../game";
import { sfx, haptic } from "../sound";

const STEP_ICONS = [Users, Hand, VenetianMask, Siren, Target, Trophy];

export default function HowToPlay({ onClose }: { onClose: () => void }) {
  const { s } = useI18n();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
        className="relative flex max-h-[88dvh] w-full max-w-md flex-col overflow-hidden rounded-t-[2.2rem] border border-white/10 bg-[#0d0b16] shadow-2xl sm:rounded-[2.2rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-amber-400/10 blur-2xl" />
        <header className="flex items-center justify-between px-6 pb-2 pt-6">
          <h2 className="font-display text-2xl font-extrabold">{s.howtoTitle}</h2>
          <button
            onClick={() => {
              sfx.back();
              haptic(8);
              onClose();
            }}
            aria-label={s.closeBtn}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-zinc-400"
          >
            <X size={18} />
          </button>
        </header>

        <div className="no-scrollbar flex-1 overflow-y-auto px-6 pb-8 pt-2">
          <ol className="flex flex-col gap-3">
            {s.howtoSteps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4"
                >
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-300/20 to-orange-500/20 text-amber-300">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p className="mt-0.5 text-sm leading-snug text-zinc-200">{step}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>

          <h3 className="mt-7 mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
            {s.payouts}
          </h3>
          <div className="overflow-hidden rounded-2xl border border-white/[0.07]">
            {CITIZEN_ORDER.map((id, i) => {
              const role = ROLES[id];
              const Icon = role.icon;
              return (
                <div
                  key={id}
                  className={`flex items-center gap-3 px-4 py-2.5 ${i % 2 ? "bg-white/[0.03]" : "bg-transparent"}`}
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{ backgroundColor: `${role.hue}22`, color: role.hue }}
                  >
                    <Icon size={15} />
                  </span>
                  <span className="flex-1 font-display font-bold text-zinc-200">
                    {s.roleWord[id].name}
                  </span>
                  <span className="font-display text-sm font-bold text-amber-300">
                    {fmtNum(role.points)}
                    <span className="ml-1 text-[10px] font-medium text-zinc-500">
                      / {s.perRound}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-sky-400/15 bg-sky-500/[0.07] p-4">
              <Siren size={18} className="text-sky-300" />
              <p className="mt-2 font-display font-bold text-sky-200">
                {s.roleWord.police.name}
              </p>
              <p className="text-xs text-zinc-400">{s.catchChip}</p>
            </div>
            <div className="rounded-2xl border border-rose-400/15 bg-rose-500/[0.07] p-4">
              <VenetianMask size={18} className="text-rose-300" />
              <p className="mt-2 font-display font-bold text-rose-200">
                {s.roleWord.kallan.name}
              </p>
              <p className="text-xs text-zinc-400">{s.escapeChip}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
