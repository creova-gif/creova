# CREOVA Intake Worker

Durable project-intake receipt and delivery pipeline.

## Guarantees

- A `202` receipt is returned only after D1 contains the intake and delivery job.
- The same request ID and normalized business fields return the original receipt.
- Reusing a request ID with changed business fields returns `409 REQUEST_CONFLICT`.
- CAPTCHA, locale, timestamps, request IDs, and transport metadata are excluded
  from the business fingerprint.
- Airtable is the authoritative private operating record; D1 is a retry and
  receipt ledger. Payloads are redacted 24 hours after sync or after a 30-day
  unresolved ceiling unless `legal_hold=1`.
- The scheduled Worker retries Airtable delivery with exponential backoff and
  jitter and alerts on overdue responses when Resend is configured.

## Required secrets

Set `TURNSTILE_SECRET_KEY`, `AIRTABLE_API_KEY`, and optionally
`RESEND_API_KEY` with `wrangler secret put`. Never store them in Git.

Replace both D1 placeholder IDs in `wrangler.toml`, apply migrations, validate
staging, and only then set `VITE_API_BASE_URL` for the public site.
