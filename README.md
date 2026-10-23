# Sleeper-Z — Complete Source Export

This ZIP is the complete Sleeper-Z project source, including the React/Vite frontend, optional Express server, quiz banks, source/research data, progression logic, Daily Dojo, WHAT'S THAT ANIME?, local leaderboard, support page, supplied animation/video assets, SVG artwork, database schema/migrations, and build configuration.

The project is **local-first**: the playable quiz experience works without an account or database. XP, levels, streaks, achievements, display name, daily completion, completed challenges, and the demo leaderboard are stored in the visitor's browser with `localStorage`. The leaderboard is therefore not a shared global ranking.

## Requirements on Windows

Install these first:

- **Node.js 22 LTS** from <https://nodejs.org/>. Confirm with `node --version`.
- **Git** from <https://git-scm.com/download/win> (optional but recommended).
- **pnpm 10.18.0**, installed through Corepack.

Open PowerShell in the extracted project folder and run:

```powershell
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm --version
pnpm install --frozen-lockfile
```

If PowerShell blocks Corepack, reopen PowerShell as an administrator once, or install pnpm using the official instructions at <https://pnpm.io/installation>.

## Run the frontend locally on Windows

The simplest local preview uses Vite's static frontend server and does not require a database or API credentials:

```powershell
pnpm exec vite --host 0.0.0.0 --port 3000 --strictPort
```

Open <http://localhost:3000>.

This mode includes the complete quiz catalog and browser-persisted progression. The included `_redirects` file is for static hosting; Vite's local server handles the SPA routes during development.

## Run the full Express development server

The repository also includes the optional Express/tRPC server. In PowerShell, set the environment variables for the current terminal and start the server:

```powershell
$env:NODE_ENV = "development"
$env:PORT = "3000"
pnpm exec tsx watch server/_core/index.ts
```

Open <http://localhost:3000>.

The package script named `dev` is intended for POSIX shells because it uses `NODE_ENV=development` inline syntax. The PowerShell command above is the Windows equivalent.

## Production build and local run

```powershell
pnpm check
pnpm build
$env:NODE_ENV = "production"
$env:PORT = "3000"
pnpm start
```

Then open <http://localhost:3000>. The build outputs the frontend to `dist/public` and the bundled server to `dist/index.js`.

For a static production build only:

```powershell
pnpm build:static
```

The static output is `dist/public`. Serve it with a static host that supports SPA fallback, or use the full Express server above.

## Tests and quiz-bank validation

```powershell
pnpm test
pnpm validate:questions
pnpm validate:series
```

The validation scripts check the structured question banks, counts, required fields, duplicate IDs/questions, answer integrity, and source references.

## Environment variables and backend dependencies

Copy the provided template before using server/database features:

```powershell
Copy-Item .env.example .env
```

The `.env.example` file contains variable names and empty placeholders only. Do not put real values in the ZIP or commit them to Git.

### Needed for the core local-first game

None. The frontend quiz, progression, Daily Dojo, WHAT'S THAT ANIME?, local leaderboard, and support page do not require an account, database, API key, or external service.

### Optional Express/database/platform features

- `DATABASE_URL`: required only for Drizzle migrations and any database-backed features you add. The checked-in schema is MySQL-compatible. Run `pnpm db:migrate` only after setting a valid private connection string.
- `MANUS_PROJECT_ID`, `MANUS_JWT_SECRET`, `MANUS_OAUTH_API_URL`, `MANUS_API_URL`, `MANUS_API_KEY`, and `OWNER_OPEN_ID`: optional platform/server integration variables used by the included server helper modules. They are not needed for the local-first quiz or static deployment.
- `MANUS_API_KEY`, JWT secrets, database URLs, OAuth credentials, and other private values must remain server-side and must never be exposed in client code.
- `PORT` and `NODE_ENV` control the local server process. Windows PowerShell examples are provided above.

The current app does **not** implement account-backed global progress or a shared cross-user leaderboard. Adding that requires an identity model, server routes, database tables, and application changes.

## Project contents

- `client/`: React app, routes, components, styles, public assets, supplied Jordan Watkins animation clips, daily-game images, and logo artwork.
- `server/`: Express/tRPC server and optional platform/database helpers.
- `shared/`: shared types and server/client constants.
- `drizzle/`: schema, relations, and checked-in migrations.
- `research/` and `repairs/`: question-source research and review records.
- `scripts/`: question-bank validation scripts.
- `package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `tsconfig.json`, `vitest.config.ts`, `Dockerfile`, and related configuration.

## Export hygiene

This export intentionally excludes `node_modules`, generated `dist`, Git history, Manus session logs, Manus starter metadata, and any real `.env` files. Those are generated, machine-specific, private, or potentially sensitive. All authored source, assets, quiz data, migrations, configuration, and lockfiles are included.

## Support page

The support page displays the configured informational BTC donation address already present in the project. It does not process payments or record transactions.
