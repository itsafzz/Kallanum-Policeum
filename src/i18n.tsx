import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { RoleId } from "./game";

export type Lang = "en" | "ml";

export interface RoleText {
  name: string;
  tag: string;
}

export interface Strings {
  tagline: string;
  subTag: string;
  startGame: string;
  howToPlay: string;
  passParty: string;
  offlineReady: string;
  madeWith: string;

  setupTitle: string;
  numberOfPlayers: string;
  playersUnit: string;
  whoIsPlaying: string;
  namesHint: string;
  playerPh: string; // "Player {n}"
  targetTitle: string;
  targetHint: string;
  custom: string;
  customLabel: string;
  customErr: string;
  back: string;
  continueBtn: string;
  startTheGame: string;

  passThePhone: string;
  tapNameHint: string;
  readyCount: string; // "{done} of {total} ready"
  allLocked: string;
  allLockedSub: string;
  beginHunt: string;

  eyesOnly: string; // "{name} — your eyes only"
  nobodyWatching: string;
  revealMyRole: string;
  notYou: string;

  youAre: string;
  earnChip: string; // "+{pts} every round"
  catchChip: string;
  escapeChip: string;
  gotIt: string;

  policeGateTitle: string;
  policeGateSub: string;
  imThePolice: string;
  whoIsTheKallan: string;
  pickHint: string;
  yourBadge: string;
  accuseName: string; // "Accuse {name}?"
  confirm: string;
  change: string;

  caught: string;
  escaped: string;
  wasTheKallan: string; // "{name} was the Kallan!"
  kallanWas: string; // "The Kallan was {name}!"
  roundPoints: string;
  nextRound: string;
  crownWinner: string;

  scoreboard: string;
  roundShort: string; // "Round {n}"
  targetShort: string; // "Target {n}"
  leading: string;

  gameOver: string;
  winnerWord: string;
  finalScores: string;
  playAgain: string;
  newGame: string;
  itsATie: string;
  tieSub: string;
  tiebreaker: string;
  endAsDraw: string;
  sharedGlory: string;
  drawSub: string;

  howtoTitle: string;
  howtoSteps: string[];
  payouts: string;
  perRound: string;
  popular: string;
  closeBtn: string;
  roleWord: Record<RoleId, RoleText>;
}

const en: Strings = {
  tagline: "Who is the Kallan?",
  subTag: "The classic Kerala chit-game of cops & robbers — one phone, a room full of suspects, zero mercy.",
  startGame: "Start Game",
  howToPlay: "How to Play",
  passParty: "3–8 players · pass-the-phone",
  offlineReady: "100% offline · zero signup",
  madeWith: "A Malayali childhood classic, reborn for game night",

  setupTitle: "Game Setup",
  numberOfPlayers: "Number of Players",
  playersUnit: "players",
  whoIsPlaying: "Who's playing?",
  namesHint: "Tap a name to make it yours.",
  playerPh: "Player {n}",
  targetTitle: "Winning Score",
  targetHint: "First to hit the target takes the crown.",
  custom: "Custom",
  customLabel: "Enter a target score",
  customErr: "Minimum 500 points",
  back: "Back",
  continueBtn: "Continue",
  startTheGame: "Start the Game",

  passThePhone: "Pass the Phone",
  tapNameHint: "Tap your own name to secretly reveal your role. No peeking over shoulders!",
  readyCount: "{done} of {total} ready",
  allLocked: "Everyone's locked in!",
  allLockedSub: "The Kallan is among you. The badge is ready.",
  beginHunt: "Begin the Hunt",

  eyesOnly: "{name} — your eyes only",
  nobodyWatching: "Make sure nobody else is looking",
  revealMyRole: "Reveal My Role",
  notYou: "Not you? Go back",

  youAre: "YOU ARE THE",
  earnChip: "+{pts} every round",
  catchChip: "Catch the Kallan → +100",
  escapeChip: "Escape the accusation → +50",
  gotIt: "Got It",

  policeGateTitle: "Pass the phone to the Police",
  policeGateSub: "One of you is holding the badge. They know who they are.",
  imThePolice: "I'm the Police — Begin",
  whoIsTheKallan: "WHO IS THE KALLAN?",
  pickHint: "Trust your gut. Point at the sneakiest one.",
  yourBadge: "you — nice try",
  accuseName: "Accuse {name}?",
  confirm: "Confirm",
  change: "Change",

  caught: "CAUGHT!",
  escaped: "THE KALLAN ESCAPED!",
  wasTheKallan: "{name} was the Kallan!",
  kallanWas: "The Kallan was {name}!",
  roundPoints: "Round Points",
  nextRound: "Next Round",
  crownWinner: "Crown the Winner",

  scoreboard: "Scoreboard",
  roundShort: "Round {n}",
  targetShort: "Target {n}",
  leading: "leading",

  gameOver: "GAME OVER",
  winnerWord: "WINNER",
  finalScores: "Final Scores",
  playAgain: "Play Again",
  newGame: "New Game",
  itsATie: "IT'S A TIE!",
  tieSub: "Dead even at the top. One more round will settle it.",
  tiebreaker: "Tiebreaker Round",
  endAsDraw: "End as Draw",
  sharedGlory: "SHARED GLORY",
  drawSub: "No single thief-catcher tonight. Legends, all of you.",

  howtoTitle: "How to Play",
  howtoSteps: [
    "Gather 3–8 friends around one phone.",
    "Each player secretly taps their own name to see their role — no peeking!",
    "One Kallan. One Police. Everyone else is a royal citizen collecting points every round.",
    "The Police takes the phone and points at a suspect.",
    "Caught? Police +100. Escaped? Kallan +50. Citizens bank their role points either way.",
    "First to the target score takes the crown.",
  ],
  payouts: "Role Payouts",
  perRound: "per round",
  popular: "Popular",
  closeBtn: "Close",
  roleWord: {
    police: { name: "Police", tag: "Find the Kallan." },
    kallan: { name: "Kallan", tag: "Don't get caught." },
    king: { name: "King", tag: "Rich is the crown." },
    queen: { name: "Queen", tag: "Grace pays the most." },
    soldier: { name: "Soldier", tag: "Steady points, steady hands." },
    guard: { name: "Guard", tag: "Quiet duty, honest pay." },
    detective: { name: "Detective", tag: "Trust no one." },
    archer: { name: "Archer", tag: "Small points. Sharp aim." },
  },
};

const ml: Strings = {
  tagline: "ആരാണ് ഈ കള്ളൻ?",
  subTag: "കേരളത്തിന്റെ സ്വന്തം കള്ളൻ–പോലീസ് കളി — ഒരു ഫോൺ, ചുറ്റും സംശയം, കളി ഫുൾ രസം.",
  startGame: "കളി തുടങ്ങാം",
  howToPlay: "എങ്ങനെ കളിക്കാം",
  passParty: "3–8 പേർ · ഫോൺ കൈമാറി കളിക്കൂ",
  offlineReady: "ഓഫ്‌ലൈൻ · സൈൻ-അപ്പ് വേണ്ട",
  madeWith: "മലയാളി കുട്ടിക്കാലത്തിലെ ക്ലാസിക് കളി, പുതിയ രൂപത്തിൽ",

  setupTitle: "സെറ്റപ്പ്",
  numberOfPlayers: "കളിക്കാരുടെ എണ്ണം",
  playersUnit: "പേർ",
  whoIsPlaying: "ആരൊക്കെ കളിക്കുന്നു?",
  namesHint: "പേരിൽ ടാപ്പ് ചെയ്ത് നിങ്ങളുടെ പേര് നൽകൂ.",
  playerPh: "കളിക്കാരൻ {n}",
  targetTitle: "വിജയ സ്കോർ",
  targetHint: "ലക്ഷ്യ സ്കോറിലെത്തുന്ന ആദ്യയാൾ വിജയി!",
  custom: "മറ്റൊന്ന്",
  customLabel: "ലക്ഷ്യ സ്കോർ നൽകൂ",
  customErr: "കുറഞ്ഞത് 500 പോയിന്റ്",
  back: "തിരികെ",
  continueBtn: "തുടരുക",
  startTheGame: "കളി തുടങ്ങാം",

  passThePhone: "ഫോൺ കൈമാറൂ",
  tapNameHint: "സ്വന്തം പേരിൽ ടാപ്പ് ചെയ്ത് റോൾ രഹസ്യമായി കാണൂ. മറ്റാരും ഒളിഞ്ഞുനോക്കരുത്!",
  readyCount: "ആകെ {total} പേരിൽ {done} പേർ റെഡി",
  allLocked: "എല്ലാവരും റെഡി!",
  allLockedSub: "കള്ളൻ നിങ്ങളിൽ ഒരാളാണ്. ബാഡ്ജ് തയ്യാറാണ്.",
  beginHunt: "വേട്ട തുടങ്ങാം",

  eyesOnly: "{name} — നിങ്ങൾക്ക് മാത്രം",
  nobodyWatching: "മറ്റാരും നോക്കുന്നില്ലെന്ന് ഉറപ്പാക്കൂ",
  revealMyRole: "എന്റെ റോൾ കാണിക്കൂ",
  notYou: "നിങ്ങളല്ലെങ്കിൽ തിരികെ പോകൂ",

  youAre: "നിന്്റെ റോൾ",
  earnChip: "ഓരോ റൗണ്ടിനും +{pts}",
  catchChip: "കള്ളനെ പിടിച്ചാൽ → +100",
  escapeChip: "രക്ഷപ്പെട്ടാൽ → +50",
  gotIt: "മനസ്സിലായി",

  policeGateTitle: "ഫോൺ പോലീസിന് കൈമാറൂ",
  policeGateSub: "നിങ്ങളിലൊരാൾ പോലീസാണ്. കള്ളൻ നിങ്ങളിൽ തന്നെയുണ്ട്.",
  imThePolice: "ഞാനാണ് പോലീസ് — തുടങ്ങാം",
  whoIsTheKallan: "ആരാണ് കള്ളൻ?",
  pickHint: "ഏറ്റവും സംശയമുള്ള ആളെ തിരഞ്ഞെടുക്കൂ.",
  yourBadge: "നീ തന്നെ — കിട്ടില്ല",
  accuseName: "{name} ആണോ കള്ളൻ?",
  confirm: "ഉറപ്പാക്കൂ",
  change: "മാറ്റാം",

  caught: "പിടിയിലായി!",
  escaped: "കള്ളൻ രക്ഷപ്പെട്ടു!",
  wasTheKallan: "കള്ളൻ {name} ആയിരുന്നു!",
  kallanWas: "കള്ളൻ {name} ആയിരുന്നു!",
  roundPoints: "ഈ റൗണ്ടിലെ പോയിന്റുകൾ",
  nextRound: "അടുത്ത റൗണ്ട്",
  crownWinner: "വിജയിയെ പ്രഖ്യാപിക്കൂ",

  scoreboard: "സ്കോർബോർഡ്",
  roundShort: "റൗണ്ട് {n}",
  targetShort: "ലക്ഷ്യം {n}",
  leading: "മുന്നിൽ",

  gameOver: "കളി അവസാനിച്ചു",
  winnerWord: "വിജയി",
  finalScores: "അവസാന സ്കോറുകൾ",
  playAgain: "വീണ്ടും കളിക്കാം",
  newGame: "പുതിയ കളി",
  itsATie: "സമനില!",
  tieSub: "മുകളിൽ സമനിലയാണ്. ഇനി ഒരു റൗണ്ട് കൂടി കളിക്കാം.",
  tiebreaker: "ടൈബ്രേക്കർ റൗണ്ട്",
  endAsDraw: "സമനിലയായി അവസാനിപ്പിക്കൂ",
  sharedGlory: "പങ്കിട്ട വിജയം",
  drawSub: "ഇന്ന് ഒരൊറ്റ വിജയിയില്ല — നിങ്ങൾ എല്ലാവരും ലെജൻഡുകളാണ്.",

  howtoTitle: "എങ്ങനെ കളിക്കാം",
  howtoSteps: [
    "3–8 പേർ ഒരു ഫോണിന് ചുറ്റും ഇരിക്കൂ.",
    "ഓരോരുത്തരും സ്വന്തം പേരിൽ ടാപ്പ് ചെയ്ത് റോൾ രഹസ്യമായി കാണൂ — ആരും നോക്കരുത്!",
    "ഒരു കള്ളൻ, ഒരു പോലീസ്. ബാക്കിയുള്ളവർ ഓരോ റൗണ്ടിലും പോയിന്റ് നേടുന്ന പൗരന്മാർ.",
    "പോലീസ് ഫോൺ കൈപ്പറ്റി കള്ളനെന്ന് തോന്നുന്ന ആളെ തിരഞ്ഞെടുക്കും.",
    "പിടിച്ചാൽ പോലീസിന് +100. കള്ളൻ രക്ഷപ്പെട്ടാൽ +50. മറ്റുള്ളവർക്ക് അവരുടെ റോളിന്റെ പോയിന്റുകൾ.",
    "ലക്ഷ്യ സ്കോറിലെത്തുന്ന ആദ്യയാൾ കിരീടം ചൂടും.",
  ],
  payouts: "റോൾ പോയിന്റുകൾ",
  perRound: "റൗണ്ടിന്",
  popular: "ജനപ്രിയം",
  closeBtn: "അടയ്ക്കൂ",
  roleWord: {
    police: { name: "പോലീസ്", tag: "കള്ളനെ കണ്ടെത്തൂ." },
    kallan: { name: "കള്ളൻ", tag: "പിടിക്കപ്പെടരുത്." },
    king: { name: "രാജാവ്", tag: "രാജകീയ പ്രതിഫലം." },
    queen: { name: "രാണി", tag: "ഏറ്റവും വലിയ പ്രതിഫലം." },
    soldier: { name: "സൈനികൻ", tag: "ധൈര്യത്തിന് പോയിന്റ്." },
    guard: { name: "കാവൽക്കാരൻ", tag: "കാവലിന് പ്രതിഫലം." },
    detective: { name: "ഡിറ്റക്ടീവ്", tag: "ആരെയും പെട്ടെന്ന് വിശ്വസിക്കരുത്." },
    archer: { name: "അമ്പെയ്ത്തുകാരൻ", tag: "ലക്ഷ്യം തെറ്റിക്കരുത്." },
  },
};

export const STRINGS: Record<Lang, Strings> = { en, ml };

export function tpl(
  str: string,
  vars: Record<string, string | number> = {}
): string {
  return str.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : ""
  );
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  s: Strings;
}

export const I18nContext = createContext<I18nValue>({
  lang: "en",
  setLang: () => undefined,
  s: en,
});

export function I18nProvider({
  lang,
  setLang,
  children,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, setLang, s: STRINGS[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
