# Sleeper-Z Implementation Plan

## Scope and material constraints

Sleeper-Z is a quiz-first, shōnen-inspired anime trivia platform adapted from the supplied Webdev starter. The original public Sleeper-AI space was inspected, but its editable project binding was unavailable to this task identity, so this workspace is a recoverable managed implementation of the requested redesign. The attached `TEXTANIMATIONS.zip` contains Jordan Watkins text-animation MP4s; no Grudge Overlay files were present. Supplied text animations will be integrated as videos without re-encoding or replacing them. Grudge overlays remain a launch dependency and are not fabricated.

## Design direction

- **Design movement:** cinematic tournament HUD / cyber-shōnen training room.
- **Core principles:** gameplay-first clarity, high-contrast intensity, disciplined motion, and healthy repeat play.
- **Color philosophy:** near-black graphite keeps the quiz legible; an electric cyan signature color signals progress and focus; ember orange marks competitive heat and correct momentum; violet is reserved for rare achievement states.
- **Layout paradigm:** a split command deck rather than a centered marketing grid: persistent left rail on desktop, stacked cards on mobile, and an asymmetric hero/quiz console pairing.
- **Signature elements:** corner brackets and scan lines, slanted challenge ribbons, and controlled video-text reveals from the user's supplied assets.
- **Interaction philosophy:** every click gives a clear state change; answers lock after selection; immediate feedback teaches before the next question; streaks encourage consistency without punishing missed days.
- **Animation:** supplied text videos enter only at section/challenge/score moments; CSS transitions stay short and purposeful; `prefers-reduced-motion` disables nonessential motion. No looping effect overlays the question text.
- **Typography system:** `Space Grotesk` for readable UI and stats, `Barlow Condensed` for compact competitive labels, and italic serif accents only for editorial support copy. The implementation loads these from Google Fonts with system fallbacks.
- **Brand essence:** a focused arena for anime fans who want to sharpen recall through short competitive rounds; personality: electric, disciplined, encouraging.
- **Brand voice:** headlines sound like calls to action, microcopy sounds like a coach. Examples: “Prove your recall.” and “One clean answer is still progress.”
- **Wordmark & logo:** `SLEEPER-Z` wordmark with a diagonal slash through the Z and a small four-point “ki” spark, built in CSS rather than a generic logo image.
- **Signature brand color:** electric cyan `#52f3d0`.

## Product behavior

- Routes: `/` home, `/quizzes` challenge selection and active quiz, `/leaderboard` ranked local/server-ready standings, `/support` donation explanation and configuration checklist.
- Core loop: choose a series → choose one of five isolated units → answer fifteen source-linked questions → receive immediate feedback and explanations → earn XP and streak credit → see level/achievement result → inspect leaderboard. The catalog now includes verified five-unit banks for Dragon Ball Z, Hunter × Hunter, Solo Leveling, Death Note, Haikyuu!!, Demon Slayer, Blue Lock, One Piece, Dr. STONE, and Attack on Titan Requiem. Requiem is explicitly labeled as a fan-created alternate continuity, not official Attack on Titan canon. One Piece's ten former episode-mapping flags are resolved; Hunter × Hunter question `hunter-2011-u5-q12` is verified with secondary episode/scene sources.
- Local progress works immediately with `localStorage`, including XP, level, streak, daily completion, achievements, and display name. This makes the prototype fully playable without account setup.
- Server/database capability is enabled for future persistence. The current implementation keeps progress and the local leaderboard functional with `localStorage`; shared multi-user competition still requires Manus OAuth identity, server procedures, persistence tables, migrations, and score-validation rules before launch.
- Donation support is informational only. No wallet address, chain, QR code, payment flow, or transaction is invented.

## Project structure

- `client/src/App.tsx`: route shell, app state, navigation, responsive layout.
- `client/src/pages/Home.tsx`: home dashboard and challenge entry.
- `client/src/pages/Quizzes.tsx`: show-first series selection, five-unit selection, question runner, result state, and direct quiz routes.
- `client/src/lib/seriesBanks.ts` and `client/src/lib/banks/`: normalized source-verified question banks and series/unit metadata.
- `scripts/validate-series-banks.mjs`: deterministic count, duplicate, answer-integrity, and source-reference validation across all nine playable banks.
- `client/src/pages/Leaderboard.tsx`: ranked standings and local player entry.
- `client/src/pages/Support.tsx`: transparent crypto-support copy and configuration checklist.
- `client/src/components/SleeperVideo.tsx`: reusable wrapper for supplied text-animation MP4s.
- `client/src/index.css`: visual system, responsive layout, motion, HUD details.
- `server/routers.ts` and `server/db.ts`: server-ready contracts and future persistence hooks.
- `client/public/manus-routes.json`: route manifest for the four pages and fallback.
- `client/public/assets/`: supplied Jordan Watkins animation files copied into the site bundle.

## Asset integration

Use supplied clips for `CRAZY` (hero title accent), `IMPACT` (challenge announcements), `GREATNESS` (result/achievement reveal), and `NEW` (daily challenge). The video element preserves the original clip timing, transparency, and loop behavior where the source supports it; CSS uses `mix-blend-screen` only as a compositing aid. The missing Grudge Overlays are called out in Support and the final handoff.
