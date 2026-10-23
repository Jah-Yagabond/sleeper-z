# Sleeper-Z Expansion — Paused State

Paused at the user's request on 2026-10-16 before application integration.

## Saved research artifacts

Eight new structured research banks are present under `research/`, each with 5 units and 15 questions per unit (75 questions):

- `dbz.json`
- `solo.json`
- `deathnote.json`
- `haikyuu.json`
- `demonslayer.json`
- `bluelock.json`
- `onepiece.json` — 10 source records are marked `review` for episode-number spot checks.
- `drstone.json`

Together with the existing `client/src/lib/hxh2011Pilot.json`, this is 675 researched new questions plus the 75-question Hunter × Hunter pilot. These banks are **not yet wired into the application**.

## Still incomplete

- `Attack on Titan Requiem` has no research artifact. It must remain explicitly separate from official canon, and no questions should be fabricated if released fan-project material cannot be verified.
- The current application still uses the prior catalog and picker. Show-first navigation (show card → five-unit view → unit quiz → back to catalog) remains to be implemented for all series.
- The existing Hunter × Hunter pilot has not been rebuilt or altered.

## Next implementation steps

1. Validate all eight JSON banks against a shared validator, including `answerIndex`/`answer` compatibility and source metadata.
2. Normalize/import the banks in `client/src/lib/` without replacing the Hunter × Hunter pilot.
3. Refactor the catalog and quiz picker into show-first navigation with exactly five units per show.
4. Add the verified series banks to the existing quiz runner and preserve XP, streaks, achievements, animations, and routes.
5. Handle Attack on Titan Requiem honestly as incomplete unless a verifiable 75-question fan-continuity bank can be produced.
6. Run validation, type checks, production build, diff checks, and desktop/mobile navigation tests.

No deployment or publication was performed. No remote push was performed for this paused expansion.
