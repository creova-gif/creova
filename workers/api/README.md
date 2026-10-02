# creova API Worker

Cloudflare Worker + D1 replacement for the paused Supabase edge function (`src/supabase/functions/server`). The old function stays in the repo until a later cleanup. This Worker is not deployed by CI.

The public URL is the workers.dev hostname from `wrangler deploy`. There is no custom domain and no route in `wrangler.toml`. After deploy, set the frontend `VITE_API_BASE_URL` (a GitHub Actions **variable**, not a secret) to:

```text
https://<worker>.workers.dev/make-server-feacf0d8
```

Paths are unchanged (`/submit-contact`, `/galleries`, `/admin-login`, and the rest).

`database_id` in `wrangler.toml` is a placeholder. It is not a secret. After `wrangler d1 create creova`, commit the printed id. The manual deploy workflow refuses to run while the placeholder is still there. Do not commit a database id from a different account.

## Owner runbook

From `workers/api/`, with Node 22:

```bash
npx wrangler login
npx wrangler d1 create creova
```

Copy the printed `database_id` into `wrangler.toml` (`[[d1_databases]]`, binding `DB`) and commit it.

The first `npx wrangler deploy` on a new account asks you to register a `*.workers.dev` subdomain. That registration is an account prompt in Wrangler. Do it once, as the account owner. This repo does not change DNS.

```bash
openssl rand -base64 32
```

Use that output as `ADMIN_SESSION_SECRET`. Then:

```bash
npx wrangler d1 migrations apply creova --remote
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put ADMIN_SESSION_SECRET
npx wrangler secret put EMAIL_SERVICE_API_KEY
npx wrangler secret put AIRTABLE_API_KEY
```

`wrangler secret put` on a Worker that does not exist yet creates the Worker (Wrangler prompts). Each `secret put` publishes a new version. Set the secrets, then deploy, and expect a new version per secret. Confirm the Turnstile widget hostnames are `creova.one` and `www.creova.one`, and that `VITE_TURNSTILE_SITE_KEY` belongs to the same widget as `TURNSTILE_SECRET_KEY`. Those hostnames are hard-coded. `ALLOWED_ORIGINS` does not extend them.

`ALLOWED_ORIGINS` is optional. If you set it, comma-separate full origins (`https://www.creova.one,https://creova.one`). A `*` entry is ignored. If the variable is unset, the allowlist is `https://www.creova.one` and `https://creova.one`.

Leave `CREOVA_ENV` unset. Production is the default: `wrangler.toml` has no `[vars]` entry for it. The captcha skip runs only when `CREOVA_ENV` is exactly `development`, `dev`, `local`, or `test` **and** the request hostname is `localhost`, `127.0.0.1`, or `::1` (`wrangler dev`). Setting `CREOVA_ENV` on a deployed Worker does not turn Turnstile off. Check after setting secrets:

```bash
npx wrangler secret list
```

`CREOVA_ENV` must not appear there, and it must not be a dashboard variable either.

`EMAIL_SERVICE_API_KEY` is the existing Resend key. `AIRTABLE_API_KEY` is the existing Airtable key. Neither provider changed.

Optional, for the admin analytics page (reads only; tracking writes do not need them):

```bash
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
npx wrangler secret put ANALYTICS_API_TOKEN
```

`ANALYTICS_API_TOKEN` is a custom token with **Account → Account Analytics → Read**. Until both are set, `GET /analytics` returns an empty success payload. It does not scan D1.

```bash
npx wrangler deploy
```

There is also a manual GitHub Actions workflow, **Deploy API Worker**. It runs only on `workflow_dispatch`, and only if the confirm input is exactly `deploy`. It refuses the placeholder `database_id`, applies D1 migrations, then deploys. It reads `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, which are not in the repo yet. Push and pull request CI does not deploy.

Local D1 (does not touch the Cloudflare account):

```bash
npx wrangler d1 migrations apply creova --local
npx wrangler dev --local
```

Put local secrets in `workers/api/.dev.vars` (gitignored). Do not commit that file. For local forms without a real Turnstile secret, `CREOVA_ENV=test` in `.dev.vars` skips captcha only because `wrangler dev` is loopback.

## Free-tier limits

Cited from Cloudflare's docs:

- Workers Free is **100,000 requests/day**, resetting at midnight UTC. CPU time is **10 ms per HTTP request**. Memory is **128 MB per isolate**. Subrequests are **50 per invocation**. Source: [Workers limits](https://developers.cloudflare.com/workers/platform/limits/) (page updated 5 Sep 2026).
- D1 on Workers Free: **5 million rows read/day**, **100,000 rows written/day**, **5 GB** stored across the account. When either daily limit is hit, **every D1 query fails until 00:00 UTC**. Source: [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/) (page updated 21 Apr 2026).
- D1 Free also allows **10 databases**, **500 MB per database**, **50 queries per Worker invocation**, and **7 days** of Time Travel. Source: [D1 limits](https://developers.cloudflare.com/d1/platform/limits/) (page updated 21 Apr 2026).
- An index update counts as an extra row written. This schema is `WITHOUT ROWID` with no secondary index, so one insert or update is one row written. Source: D1 pricing, definition 6.
- Workers Analytics Engine on the Workers Free plan: **100,000 data points written per day**, **10,000 read queries per day**. Source: [Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/).

Nothing here needs Workers Paid, KV, Durable Objects, R2, Queues, or a custom domain.

Page views and custom events are Analytics Engine points, not D1 rows. `page_exit` is accepted and not stored. Each IP can cause at most 200 tracking points per UTC day per isolate, and at most 20 tracking requests per minute per path. A D1 failure on a Turnstile-gated form still sends the Resend mail and the Airtable sync and returns 202. Event-interest signups have no captcha, so they write D1 and Airtable only and do not email.

Public forms that email `support@creova.one` all require Turnstile: contact, collaboration, booking, rental, notify-me, and lead magnet. Contact and booking also send the customer a receipt. Admin `send-*` routes email only with an admin session.

Check usage in the dashboard: Workers → the `creova` Worker, and D1 → `creova` → Metrics → Row metrics.

## Rate limit

In-memory, one map per isolate, same `consumeRateLimit` step as PR #64. The key is `cf-connecting-ip` only. There is no `X-Forwarded-For` fallback. Clients with no platform-supplied address share `unknown`.

Not KV. Workers KV on the free plan allows 1,000 writes per day.

Not D1. A counter write on every request would spend the rows-written budget.

## Analytics writes

`track-pageview` writes one Analytics Engine data point and no D1 row. `track-event` writes one point, except `page_exit`, which is dropped. Session and visitor counters are not stored.

At portfolio volume that stays inside 100,000 data points per day. The Workers request cap binds first. D1 reads on `/galleries` are the gallery rows only (a primary-key range). D1 writes on a page view are zero.

A home or `/work` view, measured against the browser calls and a local Worker:

- `GET /galleries` is a simple GET (no custom headers). It does not send a CORS preflight.
- `POST /track-pageview` and `POST /track-event` use `Content-Type: application/json`, so each sends an `OPTIONS` preflight. The Worker answers with `Access-Control-Max-Age: 600`, and the browser caches that preflight for 600 seconds. A preflight is a Worker request and counts toward the 100,000/day cap.

While the client still sends `page_exit` (one extra POST per view after more than 2 seconds on the page):

| Cache | Worker requests per view | Views per day at 100,000 requests |
|---|---|---|
| Cold (both preflights) | 5 = GET + POST pageview + POST page_exit + 2 OPTIONS | 20,000 |
| Warm (preflights cached) | 3 = GET + two POSTs | 33,333 |

After the client stops sending `page_exit` (the server still returns 204 if an old client does):

| Cache | Worker requests per view | Views per day at 100,000 requests |
|---|---|---|
| Cold (one preflight) | 3 = GET + OPTIONS + POST pageview | 33,333 |
| Warm (preflight cached) | 2 = GET + POST pageview | 50,000 |

The safe ceiling while any client still sends `page_exit` is about **20,000–33,000** home or `/work` views a day. After that POST is gone, the same cap is about **33,000–50,000**. One Analytics Engine data point per view either way (`page_exit` is not stored). Pages that do not call `/galleries` are one request cheaper.

## Galleries

The Pixieset gallery rows lived in the paused Supabase database and cannot be exported. This repo does not contain a static gallery catalog. `scripts/fix-galleries.mjs` only has URL and cover corrections for rows that already existed. `src/data/caseStudies.ts` is a different list. D1 is not seeded. `GET /make-server-feacf0d8/galleries` returns `{ "status": "success", "galleries": [] }` until an admin session creates rows.

## Rollback

Worker version:

```bash
npx wrangler deployments list
npx wrangler rollback <version-id>
```

D1 data (7 days of Time Travel on the Free plan):

```bash
npx wrangler d1 time-travel restore creova --timestamp=<ISO-8601>
```

Frontend: unset the `VITE_API_BASE_URL` Actions variable and re-run the Pages deploy. The site then has no API base URL. Do not change DNS as part of a rollback.

## Later: api.creova.one

Owner instructions only. Do this after Rex approves a custom domain. Do not change DNS from this repo.

1. Add the custom domain `api.creova.one` on the Worker.
2. Set `workers_dev = false` in `wrangler.toml` and deploy again.
3. Leave `ALLOWED_ORIGINS` as it is (`https://creova.one` and `https://www.creova.one`).
4. Set the `VITE_API_BASE_URL` Actions variable to `https://api.creova.one/make-server-feacf0d8` and redeploy Pages.

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

curl -sS -o /dev/null -w '%{http_code}\n' -X POST "$HOST/make-server-feacf0d8/track-pageview" \
  -H 'content-type: application/json' \
  -d '{"visitorId":"visitor_1710000000000_abcdefgh","sessionId":"session_1710000000000_abcdefgh","page":"/"}'
# 204
```

Page views are not in D1. Confirm a contact row after a real submission:

```bash
npx wrangler d1 execute creova --remote --command "SELECT key FROM kv WHERE key >= 'contact_' AND key < 'contact\`' LIMIT 5;"
```
