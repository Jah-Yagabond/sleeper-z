import dbz from "./banks/dbz.json";
import solo from "./banks/solo.json";
import deathnote from "./banks/deathnote.json";
import haikyuu from "./banks/haikyuu.json";
import demonslayer from "./banks/demonslayer.json";
import bluelock from "./banks/bluelock.json";
import onepiece from "./banks/onepiece.json";
import drstone from "./banks/drstone.json";
import hxh from "./banks/hxh2011Pilot.json";
import aotrequiem from "./banks/aotrequiem.json";

export type Accent = "cyan" | "orange" | "violet";
export type BankSource = { episode: string | number; episodeTitle?: string; arc: string; url: string; title: string; status: string; panel?: string };
export type BankQuestion = {
  id: string;
  series: string;
  unit: number;
  difficulty: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  spoilerLevel: string;
  source: BankSource;
};
export type SeriesUnit = { unit: number; title: string; spoilerLevel: string; questionIds: string[]; challengeId: string };
export type SeriesInfo = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  accent: Accent;
  adaptationBoundary: string;
  units: SeriesUnit[];
  questions: BankQuestion[];
  sourceStatus: "verified" | "partial" | "unavailable";
  reviewCount: number;
  unavailableReason?: string;
};

type RawQuestion = Omit<BankQuestion, "answerIndex" | "spoilerLevel" | "source"> & { answer?: number; answerIndex?: number; spoilerLevel: string | number; source: Omit<BankSource, "episode"> & { episode?: string | number; chapter?: string } };
type RawBank = { series: string; adaptationBoundary?: string; units: Array<{ unit: number; title: string; spoilerLevel: string | number; questionIds: string[] }>; questions: RawQuestion[]; notes?: string[] | string };
const normalizeBank = (bank: RawBank, id: string, title: string, subtitle: string, category: string, accent: Accent, reviewCount = 0): SeriesInfo => ({
  id, title, subtitle, category, accent,
  adaptationBoundary: bank.adaptationBoundary ?? "Released anime continuity only; source notes are attached to each question.",
  units: bank.units.map((unit) => ({ ...unit, spoilerLevel: String(unit.spoilerLevel), challengeId: `${id}-u${unit.unit}` })),
  questions: bank.questions.map((question) => ({ ...question, answerIndex: question.answerIndex ?? question.answer ?? 0, spoilerLevel: String(question.spoilerLevel), options: [...question.options], source: { ...question.source, episode: String(question.source.episode ?? question.source.chapter ?? "source") } })),
  sourceStatus: reviewCount ? "partial" : "verified",
  reviewCount,
});

export const seriesCatalog: SeriesInfo[] = [
  normalizeBank(dbz as RawBank, "dbz", "Dragon Ball Z", "Saiyan strategy, transformations, and the cost of escalation.", "DBZ", "orange"),
  normalizeBank(hxh as RawBank, "hunter", "Hunter × Hunter", "Nen conditions, character choices, and cause-and-effect across the 2011 anime.", "H×H", "cyan"),
  normalizeBank(solo as RawBank, "solo", "Solo Leveling", "System quests, shadow tactics, and the responsibility of power.", "SOLO", "violet"),
  normalizeBank(deathnote as RawBank, "deathnote", "Death Note", "Rules, identity, and the logic duel between Kira and L.", "NOTE", "orange"),
  normalizeBank(haikyuu as RawBank, "haikyuu", "Haikyuu!!", "Rotations, timing, and the trust behind a winning rally.", "VOLLEY", "cyan"),
  normalizeBank(demonslayer as RawBank, "demonslayer", "Demon Slayer", "Breathing styles, resolve, and the human cost of the hunt.", "BLADE", "orange"),
  normalizeBank(bluelock as RawBank, "bluelock", "Blue Lock", "Ego, spatial awareness, and the striker's next move.", "STRIKER", "violet"),
  normalizeBank(onepiece as RawBank, "onepiece", "One Piece", "Grand Line history, crew bonds, and the will to keep moving.", "GRAND LINE", "cyan"),
    normalizeBank(drstone as RawBank, "drstone", "Dr. STONE", "Science, invention, and the consequences of rebuilding civilization.", "SCIENCE", "violet"),
    normalizeBank(aotrequiem as RawBank, "aotrequiem", "Attack on Titan Requiem", "A fan-created alternate continuity: Paths, choices, and consequences beyond the original ending.", "REQUIEM", "orange"),
];

export const verifiedSeries = seriesCatalog.filter((series) => series.units.length === 5);
export const getSeries = (id: string) => seriesCatalog.find((series) => series.id === id);
export const getUnitQuestions = (seriesId: string, unit: number) => getSeries(seriesId)?.questions.filter((question) => question.unit === unit) ?? [];
