# World Cup Sweepstake HQ

A small family World Cup 2026 sweepstake app. It fetches fixtures/results from ESPN, stores them in PostgreSQL, calculates the owner league table, and produces WhatsApp-ready text.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS v4
- Prisma and PostgreSQL
- Railway web service, Railway Postgres, and Railway cron
- ESPN public FIFA World Cup scoreboard endpoint

## Local setup

Requirements: Node.js 20.19+, 22.13+, or 24+ and a PostgreSQL database.

```bash
cp .env.example .env
npm install
npm run db:push
npm run db:seed
npm run sync:results
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CRON_SECRET` | No | Protects `GET /api/sync-results` with `Authorization: Bearer <secret>` |

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:push
npm run db:seed
npm run sync:results
```

The sync script fetches the complete tournament range, June 11 through July 19, 2026, in one ESPN request by default. This stores all 104 results and upcoming fixtures, including early-morning UK fixtures that ESPN groups under the previous US scoreboard date. Match upserts make repeated full refreshes safe. It also supports an exact date or range:

```bash
npm run sync:results -- --from 2026-06-11
npm run sync:results -- --from 2026-06-11 --to 2026-06-27
```

The process always disconnects Prisma before exiting, so it can run as an independent cron worker.

## API routes

- `GET /api/sync-results` - sync the full tournament, optionally using `?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/table` - calculated owner standings
- `GET /api/fixtures` - stored fixtures/results with sweepstake owners
- `GET /api/whatsapp/table` - plain text league table
- `GET /api/whatsapp/today` - plain text today's fixtures/results

## Railway deployment via GitHub

1. Push this project to GitHub.
2. In Railway, choose **New Project → Deploy from GitHub repo** and select the repository.
3. Add a PostgreSQL service with **New → Database → PostgreSQL**.
4. In the web service's **Variables** tab, add a reference variable:

   ```text
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

   Use the actual name of your Postgres service if it is not `Postgres`.

5. Optionally add `CRON_SECRET` to protect `GET /api/sync-results`.
6. In the web service settings, configure:

   ```text
   Build command: npm run build
   Pre-deploy command: npm run db:push
   Start command: npm run start
   ```

7. Deploy the web service, then use its Railway shell or a one-off command to run:

   ```bash
   npm run db:seed
   npm run sync:results
   ```

8. In the web service's **Settings → Networking**, generate a public domain.
9. Add a second service from the same GitHub repository and name it `Results Cron`.
10. Give the cron service the same `DATABASE_URL` reference variable.
11. Set the cron service's start command to `npm run sync:results`.
12. In **Settings → Cron Schedule**, set `*/15 * * * *` to run every 15 minutes. Railway cron schedules use UTC and have a minimum frequency of five minutes.
13. Verify `/`, `/fixtures`, and `/admin` on the generated domain.

The cron service does not call the web app. It starts, fetches ESPN, updates PostgreSQL, disconnects, and exits.

## Data notes

- ESPN event IDs are unique and matches are upserted, so repeated syncs are safe.
- Team aliases are centralized in `lib/sweepstake.ts`.
- Only completed matches with numeric scores affect standings.
- Owner sorting is points, goal difference, goals scored, then owner name.

## Known limitations

- ESPN's endpoint is public but undocumented, so defensive parsing is included and field changes may require updates.
- Dates and fixture times use the server's configured timezone.
- There is no authentication in v1. Set `CRON_SECRET` if exposing the sync endpoint publicly.
