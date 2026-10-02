# creova API Worker

Cloudflare Worker + D1 replacement for the paused Supabase edge function (`src/supabase/functions/server`). The old function stays in the repo until a later cleanup. This Worker is not deployed by CI.

The public URL is the workers.dev hostname from `wrangler deploy`. There is no custom domain and no route in `wrangler.toml`. After deploy, set the frontend `VITE_API_BASE_URL` to:

```text
https://<worker>.workers.dev/make-server-feacf0d8
```

Paths are unchanged (`/submit-contact`, `/galleries`, `/admin-login`, and the rest).

`database_id` in `wrangler.toml` is a placeholder. Replace it after creating the database. Do not commit a database id from a different account.

## Owner runbook

From `workers/api/`, with Node 22:

```bash
npx wrangler login
npx wrangler d1 create creova
```

Copy the printed `database_id` into `wrangler.toml` (`[[d1_databases]]`, binding `DB`).

```bash
npx wrangler d1 migrations apply creova --remote
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put EMAIL_SERVICE_API_KEY
npx wrangler secret put AIRTABLE_API_KEY
```

`ALLOWED_ORIGINS` is optional. If you set it, comma-separate full origins (`https://www.creova.one,https://creova.one`). A `*` entry is ignored. If the variable is unset, the allowlist is `https://www.creova.one` and `https://creova.one`.

Leave `CREOVA_ENV` unset on the deployed worker. The captcha skip still accepts only the exact strings `development`, `dev`, `local`, and `test`. On Supabase, a `SUPABASE_URL` containing `.supabase.co` blocked that skip. This Worker has no Supabase URL, so setting `CREOVA_ENV` to one of those four values turns Turnstile off.

`EMAIL_SERVICE_API_KEY` is the existing Resend key. `AIRTABLE_API_KEY` is the existing Airtable key. Neither provider changed.

```bash
npx wrangler deploy
```

There is also a manual GitHub Actions workflow, **Deploy API Worker**. It runs only on `workflow_dispatch`, and only if the confirm input is exactly `deploy`. It reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, which are not in the repo yet. Push and pull request CI does not deploy.

Local D1 (does not touch the Cloudflare account):

```bash
npx wrangler d1 migrations apply creova --local
npx wrangler dev --local
```

Put local secrets in `workers/api/.dev.vars` (gitignored). Do not commit that file.

## Free-tier limits

Cited from Cloudflare's docs, not estimated:

- Workers Free is **100,000 requests/day**, resetting at midnight UTC. CPU time is **10 ms per HTTP request**. Memory is **128 MB per isolate**. Subrequests are **50 per invocation**. Source: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) (page updated 5 Sep 2026).
- D1 on Workers Free: **5 million rows read/day**, **100,000 rows written/day**, **5 GB** stored across the account. Source: [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) (page updated 21 Apr 2026).
- D1 Free also allows **10 databases**, **500 MB per database**, **50 queries per Worker invocation**, and **7 days** of Time Travel. Source: [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) (page updated 21 Apr 2026).
- An index update counts as an extra row written. Source: D1 pricing, definition 6.

Nothing here needs Workers Paid, KV, Durable Objects, R2, Queues, or a custom domain. The 10 ms CPU budget is enough for the form handlers (Cloudflare's own note on that page: the average Worker uses about 2.2 ms). The admin analytics route loads prefix scans into the isolate; if that later exceeds 10 ms of CPU or the 100k write cap, that is the moment to look at Workers Paid. It is not required to deploy or to run the site.

## Rate limit

In-memory, one map per isolate, same `consumeRateLimit` step as PR #64. The key is `cf-connecting-ip` (Workers sets it on every request), then the path. That closes open item N3: the visitor address is the platform header, not a spoofed `X-Forwarded-For` prefix.

Not KV. Workers KV on the free plan allows 1,000 writes per day, and a counter write on each request would exhaust that immediately.

Not D1. A counter write on every request, including page views, would spend the 100,000 rows-written/day budget on rate-limit bookkeeping. Isolates do not share the map, which is the same limit the Supabase function already had.

## Analytics writes

`track-pageview` always inserts the pageview row. Session and visitor counters flush at most once a minute per key per isolate, so a multi-page visit does not write those two rows on every hit. `track-event` is one row. Each of those writes also updates `idx_kv_key_prefix`, so D1 counts two rows written per kv write.

At portfolio volume (well under 10,000 page views a day) that stays inside 100,000 rows written/day. Pageview rows are not sampled. If traffic ever sat on the Workers cap of 100,000 requests/day and every request were a page view, the index-doubled pageview writes alone would pass 100,000 rows written. That is the upgrade point. The primary key already serves `LIKE 'prefix%'`; dropping `idx_kv_key_prefix` would halve that write cost without a paid plan.

## Galleries

The Pixieset gallery rows lived in the paused Supabase database and cannot be exported. This repo does not contain a static gallery catalog. `scripts/fix-galleries.mjs` only has URL and cover corrections for rows that already existed. `src/data/caseStudies.ts` is a different list. D1 is not seeded. `GET /make-server-feacf0d8/galleries` returns `{ "status": "success", "galleries": [] }` until an admin session creates rows.

## Post-deploy smoke test

Replace `HOST` with the workers.dev hostname.

```bash
HOST=https://<worker>.workers.dev

curl -sS "$HOST/make-server-feacf0d8/health"
# {"status":"ok"}

curl -sS -D- -o /dev/null -H 'Origin: https://evil.example' "$HOST/make-server-feacf0d8/health"
# access-control-allow-origin is not https://evil.example

curl -sS -D- -o /dev/null -H 'Origin: https://creova.one' "$HOST/make-server-feacf0d8/health"
# access-control-allow-origin: https://creova.one

curl -sS -X POST "$HOST/make-server-feacf0d8/create-payment-intent" \
  -H 'content-type: application/json' -d '{'
# 410 {"error":"This service is no longer available"}

curl -sS -X POST "$HOST/make-server-feacf0d8/submit-contact" \
  -H 'content-type: application/json' \
  -d '{"name":"Ada","email":"ada@creova.one","message":"hello"}'
# 503 until TURNSTILE_SECRET_KEY is a real secret, then 400 without a token

curl -sS -X POST "$HOST/make-server-feacf0d8/admin-login" \
  -H 'content-type: application/json' -d '{"password":"wrong"}'
# 401

curl -sS "$HOST/make-server-feacf0d8/galleries"
# {"status":"success","galleries":[]}

curl -sS -X POST "$HOST/make-server-feacf0d8/track-pageview" \
  -H 'content-type: application/json' \
  -d '{"visitorId":"v","sessionId":"s","page":"/"}'
# {"status":"success"}
```

Confirm the pageview landed:

```bash
npx wrangler d1 execute creova --remote --command "SELECT key FROM kv WHERE key LIKE 'pageview\\_%' ESCAPE '\\' LIMIT 5;"
```
