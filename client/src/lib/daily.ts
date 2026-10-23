
import { seriesCatalog } from "./seriesBanks";
import type { Question } from "./game";

export type DailyDojoState = {
  date: string;
  questionIds: string[];
  answers: Record<string, number>;
  currentIndex: number;
  score: number;
  completed: boolean;
  rewarded: boolean;
  earnedXp: number;
};

export type WhatsThatAnimePuzzle = {
  id: string;
  image: string;
  alt: string;
  canonicalAnswer: string;
  aliases: string[];
  category: "anime-character" | "anime-object" | "anime-location" | "video-game";
  interestingFact: string;
  sourceUrl: string;
  sourceTitle: string;
  license: string;
};

export const DAILY_DOJO_STORAGE_KEY = "sleeper-z-daily-dojo-v2";
export const WHATS_THAT_ANIME_STORAGE_KEY = "sleeper-z-whats-that-anime-v1";
export const WHATS_THAT_ANIME_DAILY_STORAGE_KEY =
  "sleeper-z-whats-that-anime-daily-v2";

const dailyDate = () => new Date().toISOString().slice(0, 10);
export const getDailyDate = dailyDate;
export const getTodayKey = dailyDate;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle<T>(items: T[], seed: number) {
  const result = [...items];
  let state = seed || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [
      result[swapIndex],
      result[index],
    ];
  }

  return result;
}

const eligibleDailyQuestions = (): Question[] =>
  seriesCatalog
    .filter(
      (series) =>
        series.units.length === 5 && series.sourceStatus !== "unavailable",
    )
    .flatMap((series) => series.questions)
    .filter((question) => question.source?.status !== "review")
    .map((question) => ({
      id: question.id,
      prompt: question.prompt,
      options: [...question.options],
      answer: question.answerIndex,
      explanation: question.explanation,
      series: question.series,
      unit: question.unit,
      difficulty: question.difficulty,
      spoilerLevel: question.spoilerLevel,
      source: {
        ...question.source,
        episode: String(question.source.episode),
      },
    }));

export function getDailyDojoQuestions(date = dailyDate()) {
  return seededShuffle(
    eligibleDailyQuestions(),
    hashSeed(`sleeper-z-daily-dojo:${date}`),
  ).slice(0, 15);
}

export function createDailyDojoState(date = dailyDate()): DailyDojoState {
  return {
    date,
    questionIds: getDailyDojoQuestions(date).map((question) => question.id),
    answers: {},
    currentIndex: 0,
    score: 0,
    completed: false,
    rewarded: false,
    earnedXp: 0,
  };
}

function validState(value: unknown, date: string): value is DailyDojoState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<DailyDojoState>;

  return (
    state.date === date &&
    Array.isArray(state.questionIds) &&
    state.questionIds.length === 15 &&
    new Set(state.questionIds).size === 15 &&
    typeof state.answers === "object" &&
    state.answers !== null &&
    typeof state.currentIndex === "number" &&
    typeof state.score === "number" &&
    typeof state.completed === "boolean" &&
    typeof state.rewarded === "boolean" &&
    typeof state.earnedXp === "number"
  );
}

export function readDailyDojoState(date = dailyDate()): DailyDojoState | null {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(DAILY_DOJO_STORAGE_KEY) ?? "null",
    );

    return validState(parsed, date) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveDailyDojoState(state: DailyDojoState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(DAILY_DOJO_STORAGE_KEY, JSON.stringify(state));
  }
}

type PuzzleEntry = [
  id: string,
  answer: string,
  category: WhatsThatAnimePuzzle["category"],
  aliases?: string[],
];

const puzzleEntries: PuzzleEntry[] = [
  // Dragon Ball Z
  ["goku", "Goku", "anime-character", ["Son Goku"]],
  ["vegeta", "Vegeta", "anime-character", ["Prince Vegeta"]],
  ["gohan", "Gohan", "anime-character", ["Son Gohan"]],
  ["piccolo", "Piccolo", "anime-character"],
  ["future-trunks", "Future Trunks", "anime-character", ["Trunks"]],
  ["krillin", "Krillin", "anime-character"],
  ["bulma", "Bulma", "anime-character"],
  ["frieza", "Frieza", "anime-character", ["Freeza"]],
  ["cell", "Cell", "anime-character"],
  ["majin-buu", "Majin Buu", "anime-character", ["Buu"]],
  ["android-18", "Android 18", "anime-character"],
  ["android-17", "Android 17", "anime-character"],
  ["yamcha", "Yamcha", "anime-character"],
  ["dragon-radar", "Dragon Radar", "anime-object"],

  // Hunter x Hunter
  ["gon-freecss", "Gon Freecss", "anime-character", ["Gon"]],
  ["killua-zoldyck", "Killua Zoldyck", "anime-character", ["Killua"]],
  ["kurapika", "Kurapika", "anime-character"],
  ["leorio", "Leorio", "anime-character", ["Leorio Paradinight"]],
  ["hisoka", "Hisoka", "anime-character"],
  ["chrollo-lucilfer", "Chrollo Lucilfer", "anime-character", ["Chrollo"]],
  ["biscuit-krueger", "Biscuit Krueger", "anime-character", ["Bisky"]],
  ["kite-hxh", "Kite", "anime-character"],
  ["meruem", "Meruem", "anime-character"],
  ["komugi", "Komugi", "anime-character"],
  ["neferpitou", "Neferpitou", "anime-character", ["Pitou"]],
  ["isaac-netero", "Isaac Netero", "anime-character", ["Netero"]],
  ["knuckle-bine", "Knuckle Bine", "anime-character", ["Knuckle"]],
  ["hunter-license", "Hunter License", "anime-object"],

  // Solo Leveling
  ["sung-jinwoo", "Sung Jinwoo", "anime-character", ["Jinwoo", "Sung Jin-Woo"]],
  ["cha-haein", "Cha Hae-In", "anime-character", ["Cha Hae In"]],
  ["yoo-jinho", "Yoo Jinho", "anime-character", ["Jinho"]],
  ["go-gunhee", "Go Gunhee", "anime-character"],
  ["lee-joohee", "Lee Joohee", "anime-character"],
  ["igris", "Igris", "anime-character"],
  ["beru", "Beru", "anime-character"],
  ["iron-shadow", "Iron", "anime-character"],
  ["tusk-shadow", "Tusk", "anime-character"],
  ["shadow-soldier", "Shadow Soldier", "anime-character"],
  ["solo-leveling-system", "System Window", "anime-object", ["System"]],
  ["demon-castle-key", "Demon Castle Key", "anime-object"],

  // Death Note
  ["light-yagami", "Light Yagami", "anime-character", ["Light"]],
  ["l-lawliet", "L", "anime-character", ["L Lawliet", "Lawliet"]],
  ["misa-amane", "Misa Amane", "anime-character", ["Misa"]],
  ["ryuk", "Ryuk", "anime-character"],
  ["rem-death-note", "Rem", "anime-character"],
  ["near-death-note", "Near", "anime-character"],
  ["mello-death-note", "Mello", "anime-character"],
  ["teru-mikami", "Teru Mikami", "anime-character"],
  ["soichiro-yagami", "Soichiro Yagami", "anime-character"],
  ["watari", "Watari", "anime-character"],
  ["death-note-book", "Death Note", "anime-object", ["The Death Note"]],
  ["shinigami-eyes", "Shinigami Eyes", "anime-object"],

  // Haikyuu!!
  ["shoyo-hinata", "Shoyo Hinata", "anime-character", ["Hinata"]],
  ["tobio-kageyama", "Tobio Kageyama", "anime-character", ["Kageyama"]],
  ["kei-tsukishima", "Kei Tsukishima", "anime-character", ["Tsukishima"]],
  ["yu-nishinoya", "Yu Nishinoya", "anime-character", ["Nishinoya"]],
  ["daichi-sawamura", "Daichi Sawamura", "anime-character"],
  ["toru-oikawa", "Toru Oikawa", "anime-character", ["Oikawa"]],
  ["kotaro-bokuto", "Kotaro Bokuto", "anime-character", ["Bokuto"]],
  ["kenma-kozume", "Kenma Kozume", "anime-character", ["Kenma"]],
  ["tetsuro-kuroo", "Tetsuro Kuroo", "anime-character", ["Kuroo"]],
  ["kei-tsukishima-glasses", "Tsukishima's Glasses", "anime-object"],
  ["haikyuu-volleyball", "Volleyball", "anime-object"],
  ["karasuno-banner", "Karasuno Banner", "anime-object"],

  // Demon Slayer
  ["tanjiro-kamado", "Tanjiro Kamado", "anime-character", ["Tanjiro"]],
  ["nezuko-kamado", "Nezuko Kamado", "anime-character", ["Nezuko"]],
  ["zenitsu-agatsuma", "Zenitsu Agatsuma", "anime-character", ["Zenitsu"]],
  ["inosuke-hashibira", "Inosuke Hashibira", "anime-character", ["Inosuke"]],
  ["kyojuro-rengoku", "Kyojuro Rengoku", "anime-character", ["Rengoku"]],
  ["giyu-tomioka", "Giyu Tomioka", "anime-character", ["Giyu"]],
  ["shinobu-kocho", "Shinobu Kocho", "anime-character", ["Shinobu"]],
  ["mitsuri-kanroji", "Mitsuri Kanroji", "anime-character", ["Mitsuri"]],
  ["muichiro-tokito", "Muichiro Tokito", "anime-character", ["Muichiro"]],
  ["tengen-uzui", "Tengen Uzui", "anime-character", ["Tengen"]],
  ["sanemi-shinazugawa", "Sanemi Shinazugawa", "anime-character", ["Sanemi"]],
  ["gyomei-himejima", "Gyomei Himejima", "anime-character", ["Gyomei"]],
  ["muzan-kibutsuji", "Muzan Kibutsuji", "anime-character", ["Muzan"]],
  ["nichirin-sword", "Nichirin Sword", "anime-object"],

  // Blue Lock
  ["yoichi-isagi", "Yoichi Isagi", "anime-character", ["Isagi"]],
  ["meguru-bachira", "Meguru Bachira", "anime-character", ["Bachira"]],
  ["rin-itoshi", "Rin Itoshi", "anime-character", ["Rin"]],
  ["seishiro-nagi", "Seishiro Nagi", "anime-character", ["Nagi"]],
  ["reo-mikage", "Reo Mikage", "anime-character", ["Reo"]],
  ["shohei-barou", "Shoei Barou", "anime-character", ["Barou"]],
  ["hyoma-chigiri", "Hyoma Chigiri", "anime-character", ["Chigiri"]],
  ["tabito-karasu", "Tabito Karasu", "anime-character", ["Karasu"]],
  ["sae-itoshi", "Sae Itoshi", "anime-character", ["Sae"]],
  ["jyubei-aryu", "Jyubei Aryu", "anime-character", ["Aryu"]],
  ["blue-lock-ball", "Blue Lock Football", "anime-object", ["Football", "Soccer Ball"]],
  ["blue-lock-emblem", "Blue Lock Emblem", "anime-object"],

  // One Piece
  ["monkey-d-luffy", "Monkey D. Luffy", "anime-character", ["Luffy"]],
  ["roronoa-zoro", "Roronoa Zoro", "anime-character", ["Zoro"]],
  ["nami-one-piece", "Nami", "anime-character"],
  ["usopp", "Usopp", "anime-character"],
  ["sanji", "Sanji", "anime-character"],
  ["tony-tony-chopper", "Tony Tony Chopper", "anime-character", ["Chopper"]],
  ["nico-robin", "Nico Robin", "anime-character", ["Robin"]],
  ["franky", "Franky", "anime-character"],
  ["brook", "Brook", "anime-character"],
  ["jinbe", "Jinbe", "anime-character", ["Jimbei"]],
  ["shanks", "Shanks", "anime-character"],
  ["portgas-d-ace", "Portgas D. Ace", "anime-character", ["Ace"]],
  ["trafalgar-law", "Trafalgar D. Water Law", "anime-character", ["Law"]],
  ["boa-hancock", "Boa Hancock", "anime-character"],
  ["blackbeard", "Blackbeard", "anime-character", ["Marshall D Teach"]],
  ["buggy-one-piece", "Buggy", "anime-character"],
  ["thousand-sunny", "Thousand Sunny", "anime-object"],
  ["going-merry", "Going Merry", "anime-object"],

  // Attack on Titan
  ["eren-yeager", "Eren Yeager", "anime-character", ["Eren Jaeger"]],
  ["mikasa-ackerman", "Mikasa Ackerman", "anime-character", ["Mikasa"]],
  ["armin-arlert", "Armin Arlert", "anime-character", ["Armin"]],
  ["levi-ackerman", "Levi Ackerman", "anime-character", ["Levi"]],
  ["hange-zoe", "Hange Zoe", "anime-character", ["Hange"]],
  ["erwin-smith", "Erwin Smith", "anime-character", ["Erwin"]],
  ["reiner-braun", "Reiner Braun", "anime-character", ["Reiner"]],
  ["annie-leonhart", "Annie Leonhart", "anime-character", ["Annie"]],
  ["colossal-titan", "Colossal Titan", "anime-character"],
  ["armored-titan", "Armored Titan", "anime-character"],
  ["scouting-legion-emblem", "Scout Regiment Emblem", "anime-object"],
  ["omnidirectional-gear", "Omnidirectional Mobility Gear", "anime-object"],

  // Naruto
  ["naruto-uzumaki", "Naruto Uzumaki", "anime-character", ["Naruto"]],
  ["sasuke-uchiha", "Sasuke Uchiha", "anime-character", ["Sasuke"]],
  ["sakura-haruno", "Sakura Haruno", "anime-character", ["Sakura"]],
  ["kakashi-hatake", "Kakashi Hatake", "anime-character", ["Kakashi"]],
  ["itachi-uchiha", "Itachi Uchiha", "anime-character", ["Itachi"]],
  ["jiraiya", "Jiraiya", "anime-character"],
  ["tsunade", "Tsunade", "anime-character"],
  ["gaara", "Gaara", "anime-character"],
  ["rock-lee", "Rock Lee", "anime-character"],
  ["shikamaru-nara", "Shikamaru Nara", "anime-character", ["Shikamaru"]],
  ["hinata-hyuga", "Hinata Hyuga", "anime-character", ["Hinata"]],
  ["madara-uchiha", "Madara Uchiha", "anime-character", ["Madara"]],
  ["kurama-naruto", "Kurama", "anime-character", ["Nine Tails"]],
  ["kunai", "Kunai", "anime-object"],

  // Dr. Stone
  ["senku-ishigami", "Senku Ishigami", "anime-character", ["Senku"]],
  ["taiju-oki", "Taiju Oki", "anime-character", ["Taiju"]],
  ["yuzuriha-ogawa", "Yuzuriha Ogawa", "anime-character", ["Yuzuriha"]],
  ["tsukasa-shishio", "Tsukasa Shishio", "anime-character", ["Tsukasa"]],
  ["gen-asagiri", "Gen Asagiri", "anime-character", ["Gen"]],
  ["kohaku-dr-stone", "Kohaku", "anime-character"],
  ["chrome-dr-stone", "Chrome", "anime-character"],
  ["suika-dr-stone", "Suika", "anime-character"],
  ["petrification-device", "Petrification Device", "anime-object"],
  ["stone-world-lab", "Stone World Laboratory", "anime-location"],

  // Sleeper-Z and bonus gaming subjects
  ["sleeper-z-blade", "Sleeper-Z Blade", "anime-object", ["Training Blade"]],
  ["sleeper-z-gate", "Sleeper-Z Training Gate", "anime-location", ["Training Gate"]],
  ["game-boy", "Nintendo Game Boy", "video-game", ["Game Boy", "Gameboy"]],
  ["gamecube", "Nintendo GameCube", "video-game", ["Game Cube"]],
  ["madeline", "Madeline from Celeste", "video-game", ["Madeline", "Celeste"]],
  ["wikipe-tan", "Wikipe-tan", "anime-character", ["Wikipe Tan", "Wikipetan"]],
  ["dragon-ball-object", "Four-Star Dragon Ball", "anime-object", ["Four Star Dragon Ball"]],
  ["straw-hat-jolly-roger", "Straw Hat Pirates Jolly Roger", "anime-object", ["Straw Hat Flag"]],
  ["hidden-leaf-symbol", "Hidden Leaf Village Symbol", "anime-object", ["Leaf Village Symbol"]],
  ["hunter-license-bonus", "Hunter License", "anime-object"],
  ["senzu-bean", "Senzu Bean", "anime-object"],
  ["capsule-corporation-capsule", "Capsule Corporation Capsule", "anime-object"],
];

if (puzzleEntries.length < 150) {
  throw new Error(
    `Expected at least 150 daily puzzles, found ${puzzleEntries.length}.`,
  );
}

const puzzleIds = puzzleEntries.map(([id]) => id);
if (new Set(puzzleIds).size !== puzzleIds.length) {
  throw new Error("What's That Anime? puzzle IDs must all be unique.");
}

export const whatsThatAnimeBank: WhatsThatAnimePuzzle[] = puzzleEntries.map(
  ([id, canonicalAnswer, category, aliases = []]) => ({
    id,
    image: "",
    alt: `Black-background line-art puzzle for ${canonicalAnswer}`,
    canonicalAnswer,
    aliases,
    category,
    interestingFact: `Puzzle subject: ${canonicalAnswer}. Add a fact verified against a reliable source before publishing.`,
    sourceUrl: "",
    sourceTitle: "Source verification pending",
    license: "Verify source and artwork rights before public release.",
  }),
);

export function getWhatsThatAnimePuzzle(date = dailyDate()) {
  return whatsThatAnimeBank[
    hashSeed(`sleeper-z-whats-that-anime:${date}`) % whatsThatAnimeBank.length
  ];
}

export type WhatsThatAnimeState = {
  date: string;
  puzzleId: string;
  submitted: boolean;
  guess: string;
  correct: boolean;
  rewarded: boolean;
  earnedXp: number;
};

export function readWhatsThatAnimeState(
  date = dailyDate(),
): WhatsThatAnimeState | null {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(WHATS_THAT_ANIME_STORAGE_KEY) ?? "null",
    ) as Partial<WhatsThatAnimeState> | null;

    const puzzle = getWhatsThatAnimePuzzle(date);

    if (
      !parsed ||
      parsed.date !== date ||
      parsed.puzzleId !== puzzle.id ||
      typeof parsed.submitted !== "boolean" ||
      typeof parsed.guess !== "string" ||
      typeof parsed.correct !== "boolean" ||
      typeof parsed.rewarded !== "boolean" ||
      typeof parsed.earnedXp !== "number"
    ) {
      return null;
    }

    return parsed as WhatsThatAnimeState;
  } catch {
    return null;
  }
}

export function saveWhatsThatAnimeState(state: WhatsThatAnimeState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      WHATS_THAT_ANIME_STORAGE_KEY,
      JSON.stringify(state),
    );
  }
}

export function normalizeGuess(value: string) {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ");
}

export function matchesWhatsThatAnimeAnswer(
  guess: string,
  puzzle: WhatsThatAnimePuzzle,
) {
  const normalized = normalizeGuess(guess);

  return [puzzle.canonicalAnswer, ...puzzle.aliases].some(
    (answer) => normalizeGuess(answer) === normalized,
  );
}

/* What's That Anime? — 15 puzzles per UTC day */

export type WhatsThatAnimeDailyState = {
  date: string;
  puzzleIds: string[];
  answers: Record<string, string>;
  results: Record<string, boolean>;
  currentIndex: number;
  completed: boolean;
  rewarded: boolean;
  earnedXp: number;
};

export function getWhatsThatAnimePuzzles(date = dailyDate()) {
  return seededShuffle(
    whatsThatAnimeBank,
    hashSeed(`sleeper-z-whats-that-anime-daily:${date}`),
  ).slice(0, 15);
}

export function createWhatsThatAnimeDailyState(
  date = dailyDate(),
): WhatsThatAnimeDailyState {
  return {
    date,
    puzzleIds: getWhatsThatAnimePuzzles(date).map((puzzle) => puzzle.id),
    answers: {},
    results: {},
    currentIndex: 0,
    completed: false,
    rewarded: false,
    earnedXp: 0,
  };
}

function isValidWhatsThatAnimeDailyState(
  value: unknown,
  date: string,
): value is WhatsThatAnimeDailyState {
  if (!value || typeof value !== "object") return false;

  const state = value as Partial<WhatsThatAnimeDailyState>;
  const bankIds = new Set(whatsThatAnimeBank.map((puzzle) => puzzle.id));

  return (
    state.date === date &&
    Array.isArray(state.puzzleIds) &&
    state.puzzleIds.length === 15 &&
    new Set(state.puzzleIds).size === 15 &&
    state.puzzleIds.every(
      (id) => typeof id === "string" && bankIds.has(id),
    ) &&
    !!state.answers &&
    typeof state.answers === "object" &&
    !Array.isArray(state.answers) &&
    !!state.results &&
    typeof state.results === "object" &&
    !Array.isArray(state.results) &&
    typeof state.currentIndex === "number" &&
    Number.isInteger(state.currentIndex) &&
    state.currentIndex >= 0 &&
    state.currentIndex <= 15 &&
    typeof state.completed === "boolean" &&
    typeof state.rewarded === "boolean" &&
    typeof state.earnedXp === "number" &&
    Number.isFinite(state.earnedXp) &&
    Object.values(state.answers).every(
      (answer) => typeof answer === "string",
    ) &&
    Object.values(state.results).every(
      (result) => typeof result === "boolean",
    )
  );
}

export function readWhatsThatAnimeDailyState(
  date = dailyDate(),
): WhatsThatAnimeDailyState | null {
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(WHATS_THAT_ANIME_DAILY_STORAGE_KEY) ??
        "null",
    );

    return isValidWhatsThatAnimeDailyState(parsed, date) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveWhatsThatAnimeDailyState(
  state: WhatsThatAnimeDailyState,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    WHATS_THAT_ANIME_DAILY_STORAGE_KEY,
    JSON.stringify(state),
  );
}
