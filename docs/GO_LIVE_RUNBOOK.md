# creova.one API go-live runbook (Worker + D1, CRE-106)

This is for Justin, the Cloudflare account owner. Run the commands from `workers/api/` with Node 22. Everything here is on the Workers Free plan. Nothing in this runbook changes DNS: the API stays on `*.workers.dev` until Rex approves `api.creova.one`. Sources: `workers/api/wrangler.toml`, `workers/api/README.md`, `.github/workflows/deploy-worker.yml`, `.github/workflows/deploy.yml`.

## 1. Create the D1 database and the Worker

```bash
cd workers/api && npm ci
npx wrangler login
npx wrangler d1 create creova      # prints a database_id
```

In `wrangler.toml`, under `[[d1_databases]]` (binding `DB`, database_name `creova`), replace `database_id = "00000000-0000-0000-0000-000000000000"` with the printed id. Commit that change, because `deploy-worker.yml` refuses to run while the placeholder is present. The id is not a secret. The Worker is called `creova` (`name` in `wrangler.toml`) and gets created by its first deploy. On a new account, that first deploy also asks you to register a `*.workers.dev` subdomain. The Analytics Engine dataset `creova_analytics` doesn't need any setup.

## 2. D1 migrations

There is one migration, `migrations/0001_create_kv.sql` (the `kv` table, `WITHOUT ROWID`).

```bash
npx wrangler d1 migrations list  creova --remote
npx wrangler d1 migrations apply creova --remote
```

The manual workflow (section 4) also runs `apply --remote` before every deploy.

## 3. Secrets

The code (`Env` in `src/index.ts`) requires **5** secrets. A few others are optional.

| Secret | Where it comes from |
|---|---|
| `TURNSTILE_SECRET_KEY` | Cloudflare dashboard → Turnstile → the creova widget. It must be the same widget as `VITE_TURNSTILE_SITE_KEY`, with hostnames `creova.one` and `www.creova.one` |
| `ADMIN_PASSWORD` | Choose a new admin password |
| `ADMIN_SESSION_SECRET` | Generate with `openssl rand -base64 32` |
| `EMAIL_SERVICE_API_KEY` | The existing Resend API key (the provider is unchanged) |
| `AIRTABLE_API_KEY` | The existing Airtable token |
| *Optional:* `CLOUDFLARE_ACCOUNT_ID`, `ANALYTICS_API_TOKEN` | Your account id, plus a token with Account Analytics: Read. The admin analytics page stays empty without them |
| *Optional:* `ALLOWED_ORIGINS` | Leave it unset. The default is `https://creova.one,https://www.creova.one` |
| **Never set:** `CREOVA_ENV` | Check with `npx wrangler secret list` |

Each `npx wrangler secret put <NAME>` publishes a new Worker version right away, and on a Worker that doesn't exist yet it creates one. For the first deploy, ship the code and secrets together with `npx wrangler deploy --secrets-file .secrets.json`. That file is a JSON map of the five names to their values, and it's gitignored. Delete it after the deploy. Use `secret put` only for later rotations. If a secret is missing, the Worker fails closed: forms return 503 and admin login returns 500.

The GitHub deploy workflow needs two **repo Actions secrets**, which aren't set today: `CLOUDFLARE_API_TOKEN` (a token with Workers Scripts: Edit and D1: Edit) and `CLOUDFLARE_ACCOUNT_ID`.

## 4. Deploy

- **Manual workflow:** `.github/workflows/deploy-worker.yml` ("Deploy API Worker"). It runs only on `workflow_dispatch`, and only when the `confirm` input is exactly `deploy`. In order, it: refuses the placeholder `database_id`, runs `wrangler d1 migrations apply creova --remote`, then runs `wrangler deploy`. It doesn't upload secrets, so do the first deploy locally (section 3).
- **Local:** `npx wrangler deploy`. CI (`ci.yml`) never deploys the Worker.
- **Frontend:** merging to `main` triggers `.github/workflows/deploy.yml`, the GitHub Pages deploy. Before merging, set the repo Actions **variable** `VITE_API_BASE_URL=https://creova.<subdomain>.workers.dev/make-server-feacf0d8`. If it's unset, the site's forms show "API is not configured".

## 5. Smoke tests

```bash
HOST=https://creova.<subdomain>.workers.dev/make-server-feacf0d8
curl -sS "$HOST/health"                                              # {"status":"ok"}
curl -sS -D- -o /dev/null -H 'Origin: https://creova.one' "$HOST/health"   # access-control-allow-origin: https://creova.one
curl -sS -D- -o /dev/null -H 'Origin: https://evil.example' "$HOST/health" # no allow-origin for evil.example
curl -sS -X POST "$HOST/create-payment-intent" -H 'content-type: application/json' -d '{'   # 410
curl -sS -X POST "$HOST/submit-contact" -H 'content-type: application/json' \
  -d '{"name":"Ada","email":"ada@creova.one","message":"hello"}'     # 400 (no captcha token); 503 = Turnstile secret missing
curl -sS -X POST "$HOST/admin-login" -H 'content-type: application/json' -d '{"password":"wrong"}'  # 401
curl -sS "$HOST/galleries"                                           # {"status":"success","galleries":[]}
curl -sS -o /dev/null -w '%{http_code}\n' -X POST "$HOST/track-pageview" -H 'content-type: application/json' \
  -d '{"visitorId":"visitor_1710000000000_abcdefgh","sessionId":"session_1710000000000_abcdefgh","page":"/"}'  # 204
```

After that, send one real contact form from https://creova.one. Check that the email reaches support@creova.one, and that a row exists in D1: `npx wrangler d1 execute creova --remote --command "SELECT key FROM kv WHERE key >= 'contact_' AND key < 'contact\`' LIMIT 5;"`.

## 6. Rollback

- **Worker:** `npx wrangler deployments list`, then `npx wrangler rollback <version-id> -m "reason"`. A rollback restores that version's code, bindings and secret values; Wrangler warns if secrets have changed since that version. It does not touch D1 data or schema.
- **D1:** before applying a new migration, record a bookmark with `npx wrangler d1 time-travel info creova`. To undo bad data or a bad migration, run `npx wrangler d1 time-travel restore creova --timestamp=<ISO-8601>` (or `--bookmark=<id>`). Time Travel keeps 7 days on Free. A restore overwrites everything written after that point, including new leads, so export them first: `npx wrangler d1 export creova --remote --output=backup.sql`. Migrations are forward-only, so a rolled-back Worker has to work with the current schema.
- **Frontend:** unset `VITE_API_BASE_URL` (or revert the merge on `main`) and re-run "Deploy to GitHub Pages". Don't change DNS as part of a rollback.
