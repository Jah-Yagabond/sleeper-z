import fs from "node:fs";
import path from "node:path";
const root = path.resolve(".");
const files = ["client/src/lib/banks/hxh2011Pilot.json", "client/src/lib/banks/dbz.json", "client/src/lib/banks/solo.json", "client/src/lib/banks/deathnote.json", "client/src/lib/banks/haikyuu.json", "client/src/lib/banks/demonslayer.json", "client/src/lib/banks/bluelock.json", "client/src/lib/banks/onepiece.json", "client/src/lib/banks/drstone.json", "client/src/lib/banks/aotrequiem.json"];
const failures = [];
const report = [];
const normalize = (value) => String(value ?? "").normalize("NFKC").toLowerCase().trim().replace(/\s+/g, " ");
for (const file of files) {
  const bank = JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const questions = bank.questions ?? [];
  const units = bank.units ?? [];
  const expected = file.includes("hxh") ? "Hunter × Hunter (2011)" : bank.series;
  if (questions.length !== 75) failures.push(`${file}: expected 75 questions, found ${questions.length}`);
  if (units.length !== 5) failures.push(`${file}: expected 5 units, found ${units.length}`);
  const ids = new Set(); const prompts = new Set(); const counts = new Map();
  for (const q of questions) {
    for (const field of ["id", "series", "unit", "difficulty", "prompt", "options", "explanation", "spoilerLevel", "source"]) if (q[field] === undefined || q[field] === null || q[field] === "") failures.push(`${file}/${q.id ?? "unknown"}: missing ${field}`);
    if (q.series !== expected) failures.push(`${file}/${q.id}: series mismatch`);
    if (ids.has(q.id)) failures.push(`${file}: duplicate id ${q.id}`); ids.add(q.id);
    const promptKey = normalize(q.prompt); if (prompts.has(promptKey)) failures.push(`${file}: duplicate prompt ${q.id}`); prompts.add(promptKey);
    counts.set(q.unit, (counts.get(q.unit) ?? 0) + 1);
    if (!Array.isArray(q.options) || q.options.length !== 4) failures.push(`${file}/${q.id}: expected four options`);
    if (new Set((q.options ?? []).map(normalize)).size !== 4) failures.push(`${file}/${q.id}: duplicate/empty options`);
    const answer = Number.isInteger(q.answerIndex) ? q.answerIndex : q.answer;
    if (!Number.isInteger(answer) || answer < 0 || answer > 3) failures.push(`${file}/${q.id}: invalid answer index`);
    if (!(q.source?.episode || q.source?.chapter) || !q.source?.arc || !q.source?.url || !/^https?:\/\//.test(q.source.url) || !q.source?.title || !q.source?.status) failures.push(`${file}/${q.id}: incomplete source`);
  }
  for (let unit = 1; unit <= 5; unit += 1) if (counts.get(unit) !== 15) failures.push(`${file}: unit ${unit} has ${counts.get(unit) ?? 0} questions`);
  const review = questions.filter((q) => q.source?.status === "review").map((q) => q.id);
  const secondary = questions.filter((q) => q.source?.status === "verified_secondary").map((q) => q.id);
  report.push({ file, series: bank.series, total: questions.length, units: Object.fromEntries(counts), reviewCount: review.length, review, secondaryCount: secondary.length, secondary });
}
console.log(JSON.stringify({ total: report.reduce((sum, item) => sum + item.total, 0), banks: report, failures }, null, 2));
if (failures.length) process.exit(1);
