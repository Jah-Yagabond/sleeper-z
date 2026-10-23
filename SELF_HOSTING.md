# Sleeper-Z self-hosting guide

This package contains the complete Sleeper-Z source code, including the React interface, original quiz catalog, local progression logic, supplied Jordan Watkins text-animation clips, logo, styles, and the optional Express server.

## Recommended free deployment: Cloudflare Pages

The current Sleeper-Z game is **local-first**. Quiz answers, XP, levels, streaks, achievements, display name, and the local leaderboard are stored in each visitor's browser using `localStorage`. Because the core experience does not require the server or a database, deploy the static build to Cloudflare Pages.

Cloudflare Pages supports React/Vite builds and custom domains on the Pages project. Its free plan has usage limits, so check Cloudflare's current limits before launch.

### 1. Put the code in GitHub

1. Create a new GitHub repository, for example `sleeper-z`.
2. Upload this package's contents to the repository root. Do not upload `node_modules`, `dist`, `.env`, or `.manus-logs`.
3. Keep `package.json`, `pnpm-lock.yaml`, `client/`, `server/`, `shared/`, and `vite.config.ts` at the repository root.

### 2. Create the Pages project

1. Sign in to Cloudflare and open **Workers & Pages**.
2. Choose **Create application → Pages → Connect to Git**.
3. Select the GitHub repository.
4. Use these build settings:
   - **Framework preset:** Vite, if offered
   - **Build command:** `pnpm install --frozen-lockfile && pnpm build:static`
   - **Build output directory:** `dist/public`
   - **Root directory:** `/`
   - **Node version:** `22` (set an environment variable named `NODE_VERSION` to `22` if Cloudflare asks for it)
5. Deploy.

The build produces a static SPA. The included `client/public/_redirects` file keeps direct visits to `/quizzes`, `/leaderboard`, and `/support` inside the React app.

### 3. Attach your custom domain

1. Open the Pages project in Cloudflare.
2. Open **Custom domains** and choose **Set up a custom domain**.
3. Enter your domain or subdomain.
4. If the domain is already managed by Cloudflare, accept the DNS record it offers.
5. If it is registered elsewhere, add the CNAME record Cloudflare gives you at your DNS provider.
6. Wait for DNS and SSL activation, then open the custom URL and test `/`, `/quizzes`, `/leaderboard`, and `/support`.

A custom domain requires that you own or control the domain. Hosting may be free, but domain registration itself is normally not free.

## Optional full-server deployment

The repository also includes the Express production server and Dockerfile. Use this only if you later add account-backed progress, a shared leaderboard, or other server features.

Build and run locally:

```bash
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm build
PORT=3000 NODE_ENV=production pnpm start
```

For a database-backed deployment, configure a MySQL-compatible `DATABASE_URL` and run the checked-in migrations with `pnpm db:migrate`. The current game does not use a shared progress database; moving progress and leaderboard data to a database requires application changes and an account/identity model.

The server reads optional platform variables from `.env.example`. Never commit real secrets. `MANUS_*` variables are not needed for the static Cloudflare Pages deployment.

## What persists today

- **Per browser:** XP, level, streak, achievements, display name, daily completion, and completed challenges.
- **Not shared globally:** the leaderboard is a local demo leaderboard and is not a real cross-user ranking.
- **Donations:** the configured BTC address is displayed as an optional support method; no payment processor or transaction tracking is included.

## Local verification

```bash
pnpm check
pnpm build:static
```

To preview the static build, serve `dist/public` with any static file server that supports SPA fallback, or run the full production server with `pnpm build && pnpm start`.
