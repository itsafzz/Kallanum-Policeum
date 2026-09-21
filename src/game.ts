import type { LucideIcon } from "lucide-react";
import {
  Siren,
  VenetianMask,
  Crown,
  Gem,
  Swords,
  Shield,
  ScanSearch,
  Crosshair,
} from "lucide-react";

export type RoleId =
  | "police"
  | "kallan"
  | "king"
  | "queen"
  | "soldier"
  | "guard"
  | "detective"
  | "archer";

export interface RoleDef {
  id: RoleId;
  /** fixed points earned every round (citizens only) */
  points: number;
  icon: LucideIcon;
  /** hex accent used for glows / gradients */
  hue: string;
  /** tailwind gradient for text / buttons */
  grad: string;
  /** tailwind text color */
  text: string;
  /** soft chip background */
  chip: string;
}

export const ROLES: Record<RoleId, RoleDef> = {
  police: {
    id: "police",
    points: 0,
    icon: Siren,
    hue: "#3b82f6",
    grad: "from-sky-400 via-blue-500 to-indigo-600",
    text: "text-sky-300",
    chip: "bg-sky-500/10 border-sky-400/20",
  },
  kallan: {
    id: "kallan",
    points: 0,
    icon: VenetianMask,
    hue: "#fb4d6d",
    grad: "from-rose-400 via-red-500 to-rose-700",
    text: "text-rose-300",
    chip: "bg-rose-500/10 border-rose-400/20",
  },
  king: {
    id: "king",
    points: 1500,
    icon: Crown,
    hue: "#f59e0b",
    grad: "from-amber-300 via-amber-500 to-yellow-600",
    text: "text-amber-300",
    chip: "bg-amber-500/10 border-amber-400/20",
  },
  queen: {
    id: "queen",
    points: 2000,
    icon: Gem,
    hue: "#e879f9",
    grad: "from-fuchsia-300 via-fuchsia-500 to-purple-600",
    text: "text-fuchsia-300",
    chip: "bg-fuchsia-500/10 border-fuchsia-400/20",
  },
  soldier: {
    id: "soldier",
    points: 500,
    icon: Swords,
    hue: "#34d399",
    grad: "from-emerald-300 via-emerald-500 to-teal-600",
    text: "text-emerald-300",
    chip: "bg-emerald-500/10 border-emerald-400/20",
  },
  guard: {
    id: "guard",
    points: 400,
    icon: Shield,
    hue: "#2dd4bf",
    grad: "from-teal-300 via-cyan-500 to-sky-600",
    text: "text-teal-300",
    chip: "bg-teal-500/10 border-teal-400/20",
  },
  detective: {
    id: "detective",
    points: 750,
    icon: ScanSearch,
    hue: "#a78bfa",
    grad: "from-violet-300 via-violet-500 to-indigo-600",
    text: "text-violet-300",
    chip: "bg-violet-500/10 border-violet-400/20",
  },
  archer: {
    id: "archer",
    points: 300,
    icon: Crosshair,
    hue: "#a3e635",
    grad: "from-lime-300 via-lime-500 to-green-600",
    text: "text-lime-300",
    chip: "bg-lime-500/10 border-lime-400/20",
  },
};

/** citizens are dealt in this order as the table grows (3P → +king, 4P → +queen …) */
export const CITIZEN_ORDER: RoleId[] = [
  "king",
  "queen",
  "soldier",
  "guard",
  "detective",
  "archer",
];

export interface Player {
  id: string;
  name: string;
  score: number;
}

export type RolesByPlayer = Record<string, RoleId>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** exactly 1 police + 1 kallan, citizens filled by table size, fully random */
export function assignRoles(players: Player[]): RolesByPlayer {
  const deck: RoleId[] = [
    "police",
    "kallan",
    ...CITIZEN_ORDER.slice(0, players.length - 2),
  ];
  const shuffledRoles = shuffle(deck);
  const out: RolesByPlayer = {};
  players.forEach((p, i) => {
    out[p.id] = shuffledRoles[i];
  });
  return out;
}

export interface RoundOutcome {
  caught: boolean;
  byId: Record<string, number>;
}

export function computeRoundPoints(
  roles: RolesByPlayer,
  policeId: string,
  kallanId: string,
  accusedId: string
): RoundOutcome {
  const caught = accusedId === kallanId;
  const byId: Record<string, number> = {};
  for (const [pid, role] of Object.entries(roles)) {
    if (pid === policeId) byId[pid] = caught ? 100 : 0;
    else if (pid === kallanId) byId[pid] = caught ? 0 : 50;
    else byId[pid] = ROLES[role].points;
  }
  return { caught, byId };
}

export interface EndCheck {
  done: boolean;
  winnerId: string | null;
  tiedIds: string[];
}

/** someone crossed the target? unique leader wins, tie → offer tiebreaker */
export function checkEnd(players: Player[], target: number): EndCheck {
  const crossed = players.filter((p) => p.score >= target);
  if (crossed.length === 0) return { done: false, winnerId: null, tiedIds: [] };
  const top = Math.max(...players.map((p) => p.score));
  const leaders = players.filter((p) => p.score === top);
  if (leaders.length === 1)
    return { done: true, winnerId: leaders[0].id, tiedIds: [] };
  return { done: true, winnerId: null, tiedIds: leaders.map((p) => p.id) };
}

export const fmtNum = (n: number) => n.toLocaleString("en-IN");

export const AVATAR_GRADS = [
  "from-sky-400 to-blue-600",
  "from-rose-400 to-red-600",
  "from-amber-300 to-orange-500",
  "from-fuchsia-400 to-purple-600",
  "from-emerald-300 to-teal-500",
  "from-violet-400 to-indigo-600",
  "from-lime-300 to-green-500",
  "from-cyan-300 to-sky-500",
];

export const NAME_POOL_EN = [
  "Afsal",
  "Anu",
  "Rahul",
  "Shreya",
  "Arjun",
  "Meera",
  "Vishnu",
  "Lakshmi",
];

export const NAME_POOL_ML = [
  "അഫ്സൽ",
  "അനു",
  "രാഹുൽ",
  "ശ്രേയ",
  "അർജുൻ",
  "മീര",
  "വിഷ്ണു",
  "ലക്ഷ്മി",
];

export const TARGET_OPTIONS = [5000, 10000, 15000, 20000];
export const DEFAULT_TARGET = 10000;
export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 8;
