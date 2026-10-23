import fs from "node:fs";
import path from "node:path";

const bankPath = path.resolve("client/src/lib/hxh2011Pilot.json");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const failures = [];
const questions = bank.questions ?? [];
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

if (bank.series !== "Hunter × Hunter (2011)") failures.push("series must be Hunter × Hunter (2011)");
if (questions.length !== 75) failures.push(`expected exactly 75 questions, found ${questions.length}`);
if (!Array.isArray(bank.units) || bank.units.length !== 5) failures.push("expected exactly 5 units");

const ids = new Set();
const prompts = new Set();
const counts = new Map();
for (const question of questions) {
  for (const field of ["id", "series", "unit", "difficulty", "prompt", "options", "answer", "explanation", "spoilerLevel", "source"]) {
    if (question[field] === undefined || question[field] === null || question[field] === "") failures.push(`${question.id ?? "unknown"}: missing ${field}`);
  }
  if (ids.has(question.id)) failures.push(`duplicate question id: ${question.id}`);
  ids.add(question.id);
  const promptKey = normalize(question.prompt ?? "");
  if (prompts.has(promptKey)) failures.push(`duplicate question prompt: ${question.id}`);
  prompts.add(promptKey);
  counts.set(question.unit, (counts.get(question.unit) ?? 0) + 1);
  if (!Array.isArray(question.options) || question.options.length !== 4) failures.push(`${question.id}: options must contain exactly four choices`);
  const optionKeys = new Set((question.options ?? []).map(normalize));
  if (optionKeys.size !== 4) failures.push(`${question.id}: duplicate or empty option text`);
  if (!Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3) failures.push(`${question.id}: answer must be an index from 0 to 3`);
  if (!question.source?.episode || !question.source?.arc || !question.source?.url || !/^https?:\/\//.test(question.source.url)) failures.push(`${question.id}: incomplete source reference`);
  if (!question.source?.title || !question.source?.status) failures.push(`${question.id}: incomplete source metadata`);
}
for (let unit = 1; unit <= 5; unit += 1) {
  if (counts.get(unit) !== 15) failures.push(`unit ${unit}: expected 15 questions, found ${counts.get(unit) ?? 0}`);
}

const review = questions.filter((question) => question.source.status === "review").map((question) => question.id);
console.log(JSON.stringify({ total: questions.length, units: Object.fromEntries(counts), review, failures }, null, 2));
if (failures.length) process.exit(1);
