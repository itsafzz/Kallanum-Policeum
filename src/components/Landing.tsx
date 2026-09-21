import { motion } from "framer-motion";
import {
  Play,
  HelpCircle,
  Siren,
  VenetianMask,
  Crown,
  Users,
  WifiOff,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../i18n";
import { Btn, Chip, LangToggle, SoundToggle } from "./ui";
import { sfx } from "../sound";

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, type: "spring" as const, stiffness: 120, damping: 16 },
  }),
};

export default function Landing({
  onStart,
  onHowTo,
  soundOn,
  onToggleSound,
}: {
  onStart: () => void;
  onHowTo: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  const { s } = useI18n();

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-safe">
      {/* top bar */}
      <div className="flex items-center justify-between pt-5">
        <div className="flex items-center gap-2">
          <div className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-blue-600 shadow-lg">
            <VenetianMask size={18} className="absolute -translate-x-1.5 text-white" />
            <Siren size={13} className="absolute translate-x-2.5 translate-y-2 text-white/90" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-[13px] font-bold text-white">കൾ · പോ ലീഗ്സ്</p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Kerala Party Club
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <SoundToggle on={soundOn} onToggle={onToggleSound} />
        </div>
      </div>

      {/* hero */}
      <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
        {/* floating character chips */}
        <motion.div variants={rise} initial="hidden" animate="show" custom={0} className="mb-7 flex items-end justify-center">
          <div className="relative">
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(59,99,246,0.28),transparent_65%)] blur-xl" />
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [-8, -4, -8] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative -mr-3 grid h-16 w-16 place-items-center rounded-[1.4rem] border border-sky-300/30 bg-gradient-to-br from-sky-500/25 to-blue-600/25 shadow-[0_14px_44px_-10px_rgba(59,99,246,0.7)] backdrop-blur-md"
            >
              <Siren size={30} className="text-sky-300" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="relative z-10 grid h-24 w-24 place-items-center rounded-[1.8rem] border border-amber-200/30 bg-gradient-to-br from-amber-400/25 to-orange-500/25 shadow-[0_18px_54px_-10px_rgba(255,176,32,0.55)] backdrop-blur-md"
            >
              <Crown size={42} className="text-amber-300" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -9, 0], rotate: [8, 4, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="relative -ml-3 grid h-16 w-16 place-items-center rounded-[1.4rem] border border-rose-300/30 bg-gradient-to-br from-rose-500/25 to-red-600/25 shadow-[0_14px_44px_-10px_rgba(244,63,94,0.7)] backdrop-blur-md"
            >
              <VenetianMask size={30} className="text-rose-300" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          variants={rise}
          initial="hidden"
          animate="show"
          custom={1}
          className="font-display text-[3.4rem] font-extrabold leading-[1.02] tracking-tight sm:text-7xl"
        >
          <span className="bg-gradient-to-b from-white via-sky-200 to-sky-500 bg-clip-text text-transparent">
            കള്ളനും
          </span>{" "}
          <span className="bg-gradient-to-b from-white via-rose-200 to-rose-500 bg-clip-text text-transparent">
            പോലീസും
          </span>
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-3 text-[11px] font-bold uppercase tracking-[0.42em] text-zinc-500"
        >
          Kallanum Policeum
        </motion.p>

        <motion.div variants={rise} initial="hidden" animate="show" custom={3} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-4 py-2 font-display text-base font-bold text-amber-200">
            <Sparkles size={15} className="text-amber-300" />
            {s.tagline}
          </span>
        </motion.div>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-5 max-w-[19rem] text-sm leading-relaxed text-zinc-400"
        >
          {s.subTag}
        </motion.p>

        <motion.div variants={rise} initial="hidden" animate="show" custom={5} className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Chip>
            <Users size={13} className="text-sky-300" />
            {s.passParty}
          </Chip>
          <Chip>
            <WifiOff size={13} className="text-emerald-300" />
            {s.offlineReady}
          </Chip>
        </motion.div>
      </div>

      {/* actions */}
      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        custom={6}
        className="pb-safe flex flex-col gap-3 pb-8"
      >
        <Btn
          big
          variant="gold"
          className="w-full"
          icon={<Play size={22} strokeWidth={2.6} />}
          onClick={() => {
            sfx.unlock();
            onStart();
          }}
        >
          {s.startGame}
        </Btn>
        <Btn big variant="ghost" className="w-full" icon={<HelpCircle size={20} />} onClick={onHowTo}>
          {s.howToPlay}
        </Btn>
        <footer className="pt-2 text-center text-[11px] text-zinc-600">
          Made with <span aria-label="love">❤️</span> by{" "}
          <a
            href="https://www.afsalseoexpert.in"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-zinc-400 underline decoration-zinc-700 underline-offset-2 transition-colors hover:text-amber-300"
          >
            Afz
          </a>
        </footer>
      </motion.div>
    </div>
  );
}
