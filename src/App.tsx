import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background";
import Landing from "./components/Landing";
import HowToPlay from "./components/HowToPlay";
import Setup from "./components/Setup";
import RevealHub from "./components/RevealHub";
import PolicePhase from "./components/PolicePhase";
import RoundResult from "./components/RoundResult";
import Scoreboard from "./components/Scoreboard";
import GameOver, { type EndMode } from "./components/GameOver";
import { I18nProvider, type Lang } from "./i18n";
import {
  assignRoles,
  computeRoundPoints,
  checkEnd,
  type Player,
  type RolesByPlayer,
} from "./game";
import { sfx } from "./sound";

type Phase = "landing" | "setup" | "hub" | "police" | "result" | "end";

interface RoundSnap {
  roles: RolesByPlayer;
  policeId: string;
  kallanId: string;
  accusedId: string;
  points: Record<string, number>;
}

function loadPref<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => loadPref<Lang>("kp_lang", "en"));
  const [soundOn, setSoundOn] = useState<boolean>(() =>
    loadPref<boolean>("kp_sound", true)
  );
  const [phase, setPhase] = useState<Phase>("landing");
  const [showHowTo, setShowHowTo] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [target, setTarget] = useState(10000);
  const [round, setRound] = useState(1);
  const [roles, setRoles] = useState<RolesByPlayer>({});
  const [snap, setSnap] = useState<RoundSnap | null>(null);
  const [endMode, setEndMode] = useState<EndMode>("win");
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [tiedIds, setTiedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem("kp_lang", JSON.stringify(lang));
    } catch { /* noop */ }
  }, [lang]);

  useEffect(() => {
    sfx.setEnabled(soundOn);
    try {
      localStorage.setItem("kp_sound", JSON.stringify(soundOn));
    } catch { /* noop */ }
  }, [soundOn]);

  const policeId = useMemo(
    () => Object.entries(roles).find(([, r]) => r === "police")?.[0] ?? "",
    [roles]
  );
  const kallanId = useMemo(
    () => Object.entries(roles).find(([, r]) => r === "kallan")?.[0] ?? "",
    [roles]
  );

  const beginRound = (roster: Player[], roundNo: number) => {
    setRoles(assignRoles(roster));
    setRound(roundNo);
    setSnap(null);
    setPhase("hub");
  };

  const handleSetupStart = (names: string[], targetScore: number) => {
    const roster: Player[] = names.map((name, i) => ({
      id: `p${i}-${Date.now().toString(36)}`,
      name,
      score: 0,
    }));
    setPlayers(roster);
    setTarget(targetScore);
    setWinnerId(null);
    setTiedIds([]);
    beginRound(roster, 1);
  };

  const handleAccuse = (accusedId: string) => {
    const outcome = computeRoundPoints(roles, policeId, kallanId, accusedId);
    if (outcome.caught) sfx.caught();
    else sfx.escaped();

    const next = players.map((p) => ({
      ...p,
      score: p.score + (outcome.byId[p.id] ?? 0),
    }));
    const end = checkEnd(next, target);
    if (end.done) {
      if (end.winnerId) {
        setEndMode("win");
        setWinnerId(end.winnerId);
        setTiedIds([]);
      } else {
        setEndMode("tie");
        setWinnerId(null);
        setTiedIds(end.tiedIds);
      }
    } else {
      setWinnerId(null);
      setTiedIds([]);
    }
    setPlayers(next);
    setSnap({
      roles,
      policeId,
      kallanId,
      accusedId,
      points: outcome.byId,
    });
    setPhase("result");
  };

  const handleResultNext = () => {
    const end = checkEnd(players, target);
    if (end.done) {
      setPhase("end");
      return;
    }
    beginRound(players, round + 1);
  };

  const handleReplay = () => {
    const fresh = players.map((p) => ({ ...p, score: 0 }));
    setPlayers(fresh);
    setWinnerId(null);
    setTiedIds([]);
    beginRound(fresh, 1);
  };

  const inGame = phase === "hub" || phase === "police" || phase === "result";
  const ending = snap !== null && checkEnd(players, target).done;

  return (
    <I18nProvider lang={lang} setLang={setLang}>
      <div className="relative min-h-dvh overflow-x-hidden">
        <Background />

        <AnimatePresence mode="wait">
          {phase === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Landing
                onStart={() => setPhase("setup")}
                onHowTo={() => {
                  sfx.unlock();
                  setShowHowTo(true);
                }}
                soundOn={soundOn}
                onToggleSound={() => setSoundOn((v) => !v)}
              />
            </motion.div>
          )}

          {phase === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
            >
              <Setup
                onBack={() => setPhase("landing")}
                onStart={handleSetupStart}
                soundOn={soundOn}
                onToggleSound={() => setSoundOn((v) => !v)}
                lang={lang}
              />
            </motion.div>
          )}

          {phase === "hub" && (
            <motion.div key={`hub-${round}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RevealHub
                players={players}
                roles={roles}
                onComplete={() => setPhase("police")}
              />
            </motion.div>
          )}

          {phase === "police" && (
            <motion.div key={`police-${round}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PolicePhase players={players} policeId={policeId} onResolve={handleAccuse} />
            </motion.div>
          )}

          {phase === "result" && snap && (
            <motion.div key={`result-${round}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RoundResult
                players={players}
                roles={snap.roles}
                policeId={snap.policeId}
                kallanId={snap.kallanId}
                accusedId={snap.accusedId}
                points={snap.points}
                isEnding={ending}
                onNext={handleResultNext}
              />
            </motion.div>
          )}

          {phase === "end" && (
            <motion.div key="end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <GameOver
                mode={endMode}
                players={players}
                winnerId={winnerId}
                tiedIds={tiedIds}
                onReplay={handleReplay}
                onNewGame={() => setPhase("setup")}
                onTiebreaker={() => beginRound(players, round + 1)}
                onAcceptDraw={() => {
                  setEndMode("draw");
                  sfx.coin();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* live scoreboard bottom sheet — only inside the game, never during secret reveals */}
        {inGame && (
          <Scoreboard players={players} round={round} target={target} />
        )}

        <AnimatePresence>
          {showHowTo && <HowToPlay onClose={() => setShowHowTo(false)} />}
        </AnimatePresence>
      </div>
    </I18nProvider>
  );
}
