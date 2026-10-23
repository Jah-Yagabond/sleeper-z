import { seriesCatalog, type BankQuestion, type SeriesInfo } from "./seriesBanks";

export type ChallengeId = string;
export type QuestionSource = { episode: string; episodeTitle?: string; arc: string; url: string; title: string; status: string; panel?: string };
export type Question = { id: string; prompt: string; options: string[]; answer: number; explanation: string; series?: string; unit?: number; difficulty?: string; spoilerLevel?: string; source?: QuestionSource };
export type Challenge = { id: ChallengeId; title: string; subtitle: string; category: string; duration: string; xp: number; accent: "cyan" | "orange" | "violet"; questions: Question[]; spoilerLevel?: string; seriesId?: string; unit?: number; sourceStatus?: string };
export type Progress = { xp: number; level: number; streak: number; displayName: string; lastPlayed: string | null; dailyCompletedDate: string | null; achievements: string[]; completedChallenges: string[] };
export type CompletionPayload = { challengeId: ChallengeId; score: number; total: number; earnedXp: number };
export type CompletionResult = { earnedXp: number; newLevel: number; leveledUp: boolean; unlocked: string[] };
export const XP_PER_LEVEL = 250;
export const initialProgress: Progress = { xp: 240, level: 1, streak: 2, displayName: "KAI", lastPlayed: null, dailyCompletedDate: null, achievements: [], completedChallenges: [] };
export function getLevelFromXp(xp: number) { return Math.floor(xp / XP_PER_LEVEL) + 1; }
export function getLevelPercent(xp: number) { return Math.round(((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100); }
export function getTodayKey() { return new Date().toISOString().slice(0, 10); }

const quickChallenge = (id: string, title: string, subtitle: string, category: string, accent: Challenge["accent"], xp: number, questions: Question[]): Challenge => ({ id, title, subtitle, category, duration: "5 min", xp, accent, questions });
const quickChallenges: Challenge[] = [
  quickChallenge("daily", "Daily Dojo", "Five clean reads. Keep the chain alive.", "DAILY", "orange", 90, [
    { id: "daily-1", prompt: "In anime production, what does a storyboard primarily map out?", options: ["The episode's shot-by-shot visual plan", "The final sound mix", "The merchandising budget", "The voice actor schedule"], answer: 0, explanation: "A storyboard turns the script into a shot-by-shot visual plan, guiding camera, staging, and rhythm." },
    { id: "daily-2", prompt: "What is a seiyū in Japanese anime culture?", options: ["A manga editor", "A voice actor", "A background painter", "A theme-song composer"], answer: 1, explanation: "Seiyū is the Japanese term commonly used for a voice actor, especially in animation and games." },
    { id: "daily-3", prompt: "Which production choice most directly changes a scene's perceived tempo?", options: ["Editing rhythm", "Character shoe color", "The studio logo", "Merchandise packaging"], answer: 0, explanation: "Cut length and editing rhythm can make the same action feel frantic, calm, or suspenseful." },
    { id: "daily-4", prompt: "In a tournament arc, a fair rival usually exists to do what?", options: ["Reveal the hero's next area of growth", "End the story immediately", "Replace every supporting character", "Remove all uncertainty"], answer: 0, explanation: "A strong rival creates a readable growth target: the hero has to change, not only try harder." },
    { id: "daily-5", prompt: "What is the healthiest way to use a daily streak?", options: ["Treat it as a gentle return cue", "Never take a rest day", "Hide mistakes to protect it", "Play until exhaustion"], answer: 0, explanation: "Streaks should invite a small return, not demand burnout. Rest is part of a sustainable training loop." },
  ]),
  quickChallenge("canon", "Story Sense", "Read the craft behind the impossible moments.", "FOUNDATIONS", "cyan", 75, [
    { id: "canon-1", prompt: "What makes a power system feel readable to an audience?", options: ["Clear rules and meaningful trade-offs", "Unlimited new powers every scene", "No visible consequences", "Only longer attack names"], answer: 0, explanation: "Rules give the audience a way to predict, understand, and celebrate a clever choice." },
    { id: "canon-2", prompt: "Why do training sequences work best when they show a specific obstacle?", options: ["Progress becomes observable", "The hero never has to change", "It removes the need for stakes", "It guarantees a shorter episode"], answer: 0, explanation: "A specific obstacle lets viewers see technique, discipline, and change instead of only hearing that someone trained." },
    { id: "canon-3", prompt: "A visual motif is most useful when it…", options: ["Returns with changed meaning", "Appears once without context", "Only fills empty space", "Hides the main action"], answer: 0, explanation: "A recurring image can carry emotional memory when each return adds a new layer of meaning." },
    { id: "canon-4", prompt: "What is a strong reason to give a protagonist a limitation?", options: ["Choices become more dramatic", "Every conflict becomes effortless", "The audience loses the rules", "The supporting cast becomes irrelevant"], answer: 0, explanation: "Limits turn a flashy ability into a decision: the protagonist has to spend, risk, or sacrifice something." },
    { id: "canon-5", prompt: "A satisfying cliffhanger should primarily create…", options: ["A focused question the next beat can answer", "Random confusion", "A promise of no consequences", "A complete resolution"], answer: 0, explanation: "A good cliffhanger sharpens one question. It creates momentum without making the audience feel cheated." },
  ]),
  quickChallenge("power", "Power Read", "Spot the strategy hiding inside the spectacle.", "ADVANCED", "violet", 110, [
    { id: "power-1", prompt: "If an ability gets stronger when its user accepts a risk, what is the design principle?", options: ["Power paired with cost", "Power without a rule", "A purely cosmetic upgrade", "A reset of the story"], answer: 0, explanation: "A cost creates tension. The audience can understand why the move matters because something is genuinely at stake." },
    { id: "power-2", prompt: "Which matchup creates the clearest tactical contrast?", options: ["A patient planner versus an impulsive improviser", "Two identical strategies", "A fight with no objective", "A winner chosen off-screen"], answer: 0, explanation: "Contrasting approaches make each decision legible and let the fight evolve through adaptation." },
    { id: "power-3", prompt: "What is foreshadowing supposed to reward on a rewatch?", options: ["Pattern recognition", "A lack of context", "A random twist", "A missing conclusion"], answer: 0, explanation: "Foreshadowing feels fair when earlier details become meaningful after the later reveal." },
    { id: "power-4", prompt: "When a character wins by changing the question, the scene emphasizes…", options: ["Adaptation over brute force", "A rule that never mattered", "The end of all strategy", "Only visual noise"], answer: 0, explanation: "Reframing the problem is a classic strategic turn: the character stops playing on the opponent's terms." },
    { id: "power-5", prompt: "What keeps a final-form reveal from feeling empty?", options: ["Earlier setup and a meaningful consequence", "No setup at all", "A longer title card", "An instant reset afterward"], answer: 0, explanation: "The reveal lands when the story planted the possibility and the new form changes what the character must do next." },
  ]),
];

const toQuestion = (question: BankQuestion): Question => ({ id: question.id, prompt: question.prompt, options: [...question.options], answer: question.answerIndex, explanation: question.explanation, series: question.series, unit: question.unit, difficulty: question.difficulty, spoilerLevel: question.spoilerLevel, source: { ...question.source, episode: String(question.source.episode) } });
const seriesChallenges = (series: SeriesInfo): Challenge[] => series.units.map((unit) => ({ id: unit.challengeId, title: `${series.title} — Unit ${unit.unit}`, subtitle: unit.title, category: `${series.category} / UNIT ${unit.unit}`, duration: "8 min", xp: 120 + (unit.unit - 1) * 20, accent: series.accent, questions: series.questions.filter((question) => question.unit === unit.unit).map(toQuestion), spoilerLevel: unit.spoilerLevel, seriesId: series.id, unit: unit.unit, sourceStatus: series.sourceStatus }));
export const seriesChallengeCatalog = seriesCatalog.flatMap(seriesChallenges);
export const challengeCatalog: Challenge[] = [...quickChallenges, ...seriesChallengeCatalog];
export const verifiedSeriesCatalog = seriesCatalog.filter((series) => series.units.length === 5);
export function getChallenge(id: ChallengeId) { return challengeCatalog.find((challenge) => challenge.id === (id === "hunter" ? "hunter-u1" : id)) ?? challengeCatalog[0]; }
