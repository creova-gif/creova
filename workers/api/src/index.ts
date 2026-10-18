import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { fingerprintIntake, parseIntake, responseDueAt, validRequestId } from './intake';

interface Env {
  DB: D1Database;
  CREOVA_ENV: string;
  ALLOWED_ORIGINS: string;
  TURNSTILE_SECRET_KEY: string;
  AIRTABLE_API_KEY: string;
  AIRTABLE_BASE_ID: string;
  AIRTABLE_TABLE_ID: string;
  RESEND_API_KEY?: string;
}

export const app = new Hono<{ Bindings: Env }>();

function allowedOrigins(env: Env) {
  return env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean);
}

app.use('*', async (c, next) => cors({
  origin: (origin) => allowedOrigins(c.env).includes(origin) ? origin : '',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
})(c, next));

app.get('/health', (c) => c.json({ status: 'ok' }));

async function verifyTurnstile(secret: string, token: unknown): Promise<boolean> {
  if (!secret || typeof token !== 'string' || !token) return false;
  const form = new FormData();
  form.set('secret', secret);
  form.set('response', token);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!response.ok) return false;
  const result = await response.json<{ success?: boolean; action?: string }>();
  return result.success === true && result.action === 'contact';
}

app.post('/v1/intakes', async (c) => {
  let body: Record<string, unknown>;
  try {
    body = await c.req.json<Record<string, unknown>>();
  } catch {
    return c.json({ code: 'INVALID_REQUEST' }, 400);
  }
  if (!validRequestId(body.requestId)) return c.json({ code: 'INVALID_REQUEST' }, 400);
  const intake = parseIntake(body);
  if (!intake) return c.json({ code: 'INVALID_REQUEST' }, 400);
  if (!body.captchaToken) return c.json({ code: 'CAPTCHA_REQUIRED' }, 400);
  if (!(await verifyTurnstile(c.env.TURNSTILE_SECRET_KEY, body.captchaToken))) {
    return c.json({ code: 'CAPTCHA_FAILED' }, 400);
  }

  const fingerprint = await fingerprintIntake(intake);
  const receivedAt = new Date().toISOString();
  const dueAt = responseDueAt(new Date());
  try {
    const results = await c.env.DB.batch([
      c.env.DB.prepare(`
        INSERT INTO intakes (request_id, fingerprint, payload_json, received_at, response_due_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(request_id) DO NOTHING
      `).bind(body.requestId, fingerprint, JSON.stringify(intake), receivedAt, dueAt),
      c.env.DB.prepare(`
        INSERT INTO delivery_attempts (request_id, destination, next_attempt_at)
        SELECT request_id, 'airtable', received_at FROM intakes
        WHERE request_id = ? AND fingerprint = ?
        ON CONFLICT(request_id, destination) DO NOTHING
      `).bind(body.requestId, fingerprint),
      c.env.DB.prepare(`
        SELECT request_id, fingerprint, received_at, response_due_at
        FROM intakes WHERE request_id = ?
      `).bind(body.requestId),
    ]);
    const persisted = results[2].results?.[0] as Record<string, string> | undefined;
    if (!persisted) return c.json({ code: 'PERSISTENCE_FAILED' }, 503);
    if (persisted.fingerprint !== fingerprint) return c.json({ code: 'REQUEST_CONFLICT' }, 409);
    return c.json({
      requestId: persisted.request_id,
      status: 'received',
      receivedAt: persisted.received_at,
      responseDueAt: persisted.response_due_at,
    }, 202);
  } catch (error) {
    console.error('intake persistence failed', error instanceof Error ? error.message : 'unknown');
    return c.json({ code: 'PERSISTENCE_FAILED' }, 503);
  }
});

async function deliverPending(env: Env, now: string) {
  const pending = await env.DB.prepare(`
    SELECT d.id, d.request_id, d.attempt_count, i.payload_json
    FROM delivery_attempts d JOIN intakes i ON i.request_id = d.request_id
    WHERE d.status = 'pending' AND d.next_attempt_at <= ? AND i.payload_json IS NOT NULL
    ORDER BY d.next_attempt_at LIMIT 25
  `).bind(now).all<{ id: number; request_id: string; attempt_count: number; payload_json: string }>();

  for (const row of pending.results) {
    try {
      const payload = JSON.parse(row.payload_json) as Record<string, unknown>;
      const response = await fetch(`https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${env.AIRTABLE_TABLE_ID}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.AIRTABLE_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: [{ fields: {
          Name: payload.name, Email: payload.email, Organization: payload.organization,
          Service: payload.projectType, Message: payload.description, Phone: payload.phone ?? '',
          Budget: payload.budget ?? '', Timeline: payload.eventDate ?? 'Not set',
          Context: payload.context ?? '', Type: 'project-intake', 'Submitted At': now,
          'Supabase Record ID': row.request_id,
        } }] }),
      });
      if (!response.ok) throw new Error(`Airtable ${response.status}`);
      await env.DB.batch([
        env.DB.prepare(`UPDATE delivery_attempts SET status='delivered', delivered_at=?, attempt_count=attempt_count+1, last_error=NULL WHERE id=?`).bind(now, row.id),
        env.DB.prepare(`UPDATE intakes SET synced_at=?, status='synced' WHERE request_id=?`).bind(now, row.request_id),
      ]);
    } catch (error) {
      const attempts = row.attempt_count + 1;
      const delayMinutes = Math.min(360, 2 ** Math.min(attempts, 8));
      const jitter = Math.floor(Math.random() * 60_000);
      const next = new Date(Date.now() + delayMinutes * 60_000 + jitter).toISOString();
      await env.DB.prepare(`UPDATE delivery_attempts SET attempt_count=?, next_attempt_at=?, last_error=? WHERE id=?`)
        .bind(attempts, next, String(error instanceof Error ? error.message : error).slice(0, 500), row.id).run();
    }
  }
}

async function enforceRetention(env: Env, now: string) {
  await env.DB.batch([
    env.DB.prepare(`
      UPDATE intakes SET payload_json=NULL, redacted_at=?, status='redacted'
      WHERE legal_hold=0 AND payload_json IS NOT NULL AND synced_at IS NOT NULL
        AND datetime(synced_at) <= datetime(?, '-24 hours')
    `).bind(now, now),
    env.DB.prepare(`
      UPDATE intakes SET payload_json=NULL, redacted_at=?, status='expired'
      WHERE legal_hold=0 AND payload_json IS NOT NULL
        AND datetime(received_at) <= datetime(?, '-30 days')
    `).bind(now, now),
  ]);
}

async function alertOverdue(env: Env, now: string) {
  if (!env.RESEND_API_KEY) return;
  const overdue = await env.DB.prepare(`
    SELECT request_id, response_due_at FROM intakes
    WHERE response_alerted_at IS NULL AND datetime(response_due_at) <= datetime(?)
      AND status NOT IN ('responded', 'expired') LIMIT 25
  `).bind(now).all<{ request_id: string; response_due_at: string }>();
  for (const row of overdue.results) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'CREOVA Intake <support@creova.one>', to: ['support@creova.one'],
        subject: `Response due: ${row.request_id}`,
        text: `Project intake ${row.request_id} reached its response due time (${row.response_due_at}).`,
      }),
    });
    if (response.ok) await env.DB.prepare('UPDATE intakes SET response_alerted_at=? WHERE request_id=?').bind(now, row.request_id).run();
  }
}

export default {
  fetch: app.fetch,
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const now = new Date().toISOString();
    ctx.waitUntil(Promise.all([deliverPending(env, now), enforceRetention(env, now), alertOverdue(env, now)]).then(() => undefined));
  },
};
