import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Siren, ShieldCheck, VenetianMask, X } from "lucide-react";
import { useI18n, tpl } from "../i18n";
import { Btn, Avatar } from "./ui";
import type { Player } from "../game";
import { sfx, haptic } from "../sound";

export default function PolicePhase({
  players,
  policeId,
  onResolve,
}: {
  players: Player[];
  policeId: string;
  onResolve: (accusedId: string) => void;
}) {
  const { s, lang } = useI18n();
  const [hunting, setHunting] = useState(false);
  const [pickedId, setPickedId] = useState<string | null>(null);
  const suspects = players.filter((p) => p.id !== policeId);
  const picked = players.find((p) => p.id === pickedId) ?? null;

  /* ---------- gate: hand phone to police ---------- */
  if (!hunting) {
    return (
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 15 }}
            className="relative"
          >
            <span className="absolute -inset-6 rounded-full bg-sky-500/20 animate-ping-soft" />
            <span
              className="absolute -inset-6 rounded-full bg-rose-500/20 animate-ping-soft"
              style={{ animationDelay: "0.6s" }}
            />
            <div className="relative grid h-28 w-28 place-items-center rounded-[2.4rem] border border-sky-300/30 bg-gradient-to-br from-sky-500/25 to-blue-700/25 shadow-[0_24px_70px_-14px_rgba(59,99,246,0.8)]">
              <Siren size={50} className="text-sky-300" strokeWidth={1.6} />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 font-display text-4xl font-extrabold leading-tight"
          >
            {s.policeGateTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="mt-3 max-w-[17rem] text-sm leading-relaxed text-zinc-400"
          >
            {s.policeGateSub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-600"
          >
            <VenetianMask size={13} />
            {s.tagline}
          </motion.div>
        </div>

        <div className="pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
          <Btn
            big
            className="w-full"
            icon={<ShieldCheck size={22} />}
            onClick={() => {
              sfx.suspense();
              haptic([16, 40, 16]);
              setHunting(true);
            }}
          >
            {s.imThePolice}
          </Btn>
        </div>
      </div>
    );
  }

  /* ---------- pick the kallan ---------- */
  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      <div className="pt-5 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-400/25 bg-sky-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-sky-300"
        >
          <Siren size={13} />
          {s.roleWord.police.name}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 font-display text-4xl font-extrabold leading-tight ${lang === "en" ? "tracking-tight" : ""}`}
        >
          <span className="bg-gradient-to-b from-white via-rose-100 to-rose-400 bg-clip-text text-transparent">
            {s.whoIsTheKallan}
          </span>
        </motion.h2>
        <p className="mx-auto mt-2 max-w-[18rem] text-sm text-zinc-500">{s.pickHint}</p>
      </div>

      <div className="no-scrollbar mt-7 flex-1 space-y-2.5 overflow-y-auto pb-40">
        {suspects.map((p, i) => {
          const realIdx = players.findIndex((x) => x.id === p.id);
          return (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                sfx.select();
                haptic(14);
                setPickedId(p.id);
              }}
              className="flex w-full items-center gap-3.5 rounded-3xl border border-white/[0.09] bg-white/[0.05] p-3.5 text-left backdrop-blur-md transition-colors active:border-rose-400/50"
            >
              <Avatar name={p.name} index={realIdx} />
              <span className="flex-1 truncate font-display text-xl font-bold text-zinc-100">
                {p.name}
              </span>
              <VenetianMask size={19} className="text-zinc-600" />
            </motion.button>
          );
        })}
      </div>

      {/* accusation confirm modal */}
      <AnimatePresence>
        {picked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/75 backdrop-blur-sm"
            onClick={() => setPickedId(null)}
          >
            <motion.div
              initial={{ y: 120, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 120, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="w-full max-w-md rounded-t-[2.4rem] border border-white/10 bg-[#100d1c] px-6 pb-[calc(6rem+env(safe-area-inset-bottom,0px))] pt-7"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-x-0 -top-20 mx-auto h-40 w-40 rounded-full bg-rose-500/15 blur-2xl" />
              <div className="mb-5 flex items-start justify-between">
                <Avatar name={picked.name} index={players.findIndex((x) => x.id === picked.id)} size="lg" />
                <button
                  aria-label="close"
                  onClick={() => {
                    sfx.back();
                    setPickedId(null);
                  }}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-zinc-400"
                >
                  <X size={17} />
                </button>
              </div>
              <h3 className="font-display text-3xl font-extrabold leading-tight">
                {tpl(s.accuseName, { name: picked.name })}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500">
                {lang === "en" ? "No going back after this." : "ഇനി മാറ്റാൻ കഴിയില്ല."}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Btn
                  big
                  variant="ghost"
                  onClick={() => {
                    sfx.back();
                    setPickedId(null);
                  }}
                >
                  {s.change}
                </Btn>
                <Btn
                  big
                  variant="danger"
                  icon={<VenetianMask size={20} />}
                  onClick={() => {
                    haptic([20, 60, 20, 60, 140]);
                    onResolve(picked.id);
                  }}
                >
                  {s.confirm}
                </Btn>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
