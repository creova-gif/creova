import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import {
  SIGNUP_BODY_MAX,
  SIGNUP_WRITES_PER_IP_PER_DAY,
  TRACK_BODY_MAX,
  TRACK_PER_MINUTE,
  TRACK_WRITES_PER_IP_PER_DAY,
  clampAnalyticsDays,
  consumeDailyWrite,
  emptyAnalytics,
  eventPoint,
  pageviewPoint,
  queryAnalyticsEngine,
  type AnalyticsPoint,
} from "./analytics";
import { createKv, type KvStore } from "./kv";
import {
  bookingReceivedHtml,
  COMMERCE_GONE_BODY,
  COMMERCE_GONE_STATUS,
  COMMERCE_ROUTES,
  consumeRateLimit,
  collaborationAdminSubject,
  contactAdminSubject,
  contactReceivedHtml,
  escapeHtml,
  isUsableTurnstileSecret,
  oneLine,
  optionalText,
  parseAllowedOrigins,
  parseEmailAddress,
  passwordsMatch,
  rateLimitClientIp,
  requiredText,
  safeKeyPart,
  TEXT_LIMITS,
  turnstileGate,
  turnstileVerificationOk,
} from "./guards";
import {
  getBookingConfirmationTemplate,
  adminBookingNotification,
  adminContactNotification,
  adminCollaborationNotification,
  type BookingEmailData,
  type ContactEmailData,
  type CollaborationEmailData,
} from "./email-templates";

export interface Env {
  DB: D1Database;
  /** Workers Analytics Engine. Free on the Workers Free plan. Optional in tests. */
  ANALYTICS?: AnalyticsEngineDataset;
  TURNSTILE_SECRET_KEY?: string;
  ADMIN_PASSWORD?: string;
  ADMIN_SESSION_SECRET?: string;
  EMAIL_SERVICE_API_KEY?: string;
  AIRTABLE_API_KEY?: string;
  ALLOWED_ORIGINS?: string;
  /** Exact local values only (development, dev, local, test). Leave unset when deployed. */
  CREOVA_ENV?: string;
  /** Account id for the Analytics Engine SQL API. Not a substitute for the write binding. */
  CLOUDFLARE_ACCOUNT_ID?: string;
  /** Account Analytics Read token. Dashboard stays empty until this is set. */
  ANALYTICS_API_TOKEN?: string;
}

type AppContext = Context<{ Bindings: Env }>;

/** Outbound HTTP. Tests replace this; production calls the Worker fetch. */
export const outbound = {
  fetch: (...args: Parameters<typeof fetch>) => globalThis.fetch(...args),
};

const app = new Hono<{ Bindings: Env }>();

function store(c: { env: Env }): KvStore {
  return createKv(c.env.DB);
}

const dailyWriteSlots = new Map<string, { day: string; count: number }>();

function allowDailyWrite(ip: string, kind: string, max: number): boolean {
  return consumeDailyWrite(dailyWriteSlots, `${kind}:${ip}`, Date.now(), max);
}

/** D1 is best-effort. A quota error must not skip email or Airtable. */
async function persistLead(c: AppContext, key: string, value: unknown): Promise<boolean> {
  try {
    await store(c).set(key, value);
    return true;
  } catch (error) {
    console.error("Lead store failed", key, error instanceof Error ? error.name : "error");
    return false;
  }
}

function leadStatus(stored: boolean): 200 | 202 {
  return stored ? 200 : 202;
}

const FORM_BODY_MAX = 32_768;

function errorLabel(error: unknown): string {
  return error instanceof Error ? error.name : "error";
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

async function readBoundedJson(
  c: AppContext,
  maxBytes: number,
): Promise<{ ok: true; body: Record<string, unknown> } | { ok: false; status: 400 | 413 }> {
  const declared = Number(c.req.header("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413 };
  let raw: string;
  try {
    raw = await c.req.text();
  } catch {
    return { ok: false, status: 400 };
  }
  if (raw.length > maxBytes) return { ok: false, status: 413 };
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ok: false, status: 400 };
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, status: 400 };
  }
}

function writeAnalyticsPoint(c: AppContext, point: AnalyticsPoint): void {
  try {
    c.env.ANALYTICS?.writeDataPoint({
      indexes: point.indexes,
      blobs: point.blobs,
      doubles: point.doubles,
    });
  } catch (error) {
    console.error("Analytics write failed", error instanceof Error ? error.name : "error");
  }
}

function defer(c: AppContext, work: Promise<unknown>) {
  const run = work.catch((error) => {
    console.error("background task failed", error instanceof Error ? error.name : "error");
  });
  c.executionCtx.waitUntil(run);
}

// Airtable sync — mirrors website form submissions into the unified
// "CREOVA Website Data" base (appHQkjX7B97NQPbi) so the team has one place
// to view sign-ups without touching Supabase directly. Fire-and-forget and
// silently no-ops until AIRTABLE_API_KEY is set as a Worker secret, so it
// never blocks or fails the actual form submission.
const AIRTABLE_BASE_ID = "appHQkjX7B97NQPbi";
function syncToAirtable(apiKey: string | undefined, tableId: string, fields: Record<string, unknown>) {
  if (!apiKey) return Promise.resolve();
  return outbound.fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  }).then((res) => {
    if (!res.ok) console.error(`Airtable sync failed for ${tableId}: HTTP ${res.status}`);
    return res.body?.cancel();
  }).catch((error) => {
    console.error(`Airtable sync failed for ${tableId}:`, error instanceof Error ? error.name : "error");
  });
}

// Best-effort limiter for this isolate only. Worker isolates do not share
// memory, so a fresh isolate starts with an empty map. A D1 or KV counter
// would burn the free-tier write budget (KV free is 1,000 writes/day; every
// page view would be a write). Keyed on cf-connecting-ip, which Workers sets
// on every request. Clients with no platform-supplied address share "unknown".
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function clientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  return rateLimitClientIp({
    connectingIp: c.req.header("cf-connecting-ip"),
  });
}

const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const ip = clientIp(c);
    const now = Date.now();
    const key = `${ip}:${c.req.path}`;
    const allowed = consumeRateLimit(rateLimitMap, key, now, maxRequests, windowMs);
    if (!allowed) {
      console.log(`Rate limit exceeded on ${c.req.path}`);
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }

    if (rateLimitMap.size > 10000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) rateLimitMap.delete(k);
      }
    }

    await next();
  };
};

function commerceUnavailable(c: { json: (body: unknown, status?: number) => Response }) {
  return c.json(COMMERCE_GONE_BODY, COMMERCE_GONE_STATUS);
}

const TURNSTILE_TIMEOUT_MS = 5000;

function requestHost(c: AppContext): string {
  try {
    return new URL(c.req.url).hostname;
  } catch {
    return "";
  }
}

// Turnstile. Missing secret fails closed unless CREOVA_ENV is exactly a local
// value AND the request host is loopback. A deployed hostname never skips.
// ENVIRONMENT is ignored. There is no SUPABASE_URL backstop on this Worker.
async function requireTurnstile(
  c: AppContext,
  token: unknown,
  action: string,
): Promise<{ ok: true } | { ok: false; status: 400 | 503; error: string }> {
  const rawSecret = c.env.TURNSTILE_SECRET_KEY ?? "";
  const gate = turnstileGate({
    secretConfigured: isUsableTurnstileSecret(rawSecret),
    creovaEnv: c.env.CREOVA_ENV,
    requestHost: requestHost(c),
    token,
  });
  if (gate.action === "reject") {
    console.error(gate.error);
    return { ok: false, status: gate.status, error: gate.error };
  }
  if (gate.action === "skip") return { ok: true };

  const ip = clientIp(c);
  const params = new URLSearchParams({
    secret: rawSecret.trim(),
    response: String(token),
  });
  if (ip !== "unknown") params.set("remoteip", ip);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);
  try {
    const verifyResponse = await outbound.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      signal: controller.signal,
    });
    if (!verifyResponse.ok) {
      console.error("Turnstile siteverify HTTP", verifyResponse.status);
      return { ok: false, status: 503, error: "Security verification is unavailable" };
    }
    const verifyData = await verifyResponse.json().catch(() => null);
    if (!turnstileVerificationOk(verifyData, action)) {
      console.log("Turnstile verification failed");
      return { ok: false, status: 400, error: "Security verification failed. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("Turnstile siteverify request failed:", errorLabel(error));
    return { ok: false, status: 503, error: "Security verification is unavailable" };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Security: Admin session tokens
//
// AdminAuth.tsx used to compare the password client-side against a value
// baked into the public JS bundle — anyone could read it out of the bundle,
// or just skip it entirely by writing the "authenticated" flag straight into
// sessionStorage from devtools. None of that touched the server, so every
// route below was reachable by anyone regardless of the password.
//
// Real fix: the password is checked once, server-side, in /admin-login. On
// success we issue a short-lived HMAC-signed token. Every admin-only route
// verifies that token itself before doing anything — the client's "logged
// in" state is UX only, not a security boundary.
// ---------------------------------------------------------------------------

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + pad);
}

async function hmacSha256B64Url(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toBase64Url(new Uint8Array(sig));
}

const ADMIN_SESSION_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours, matches the old client-side expiry

async function issueAdminToken(secret: string | undefined): Promise<string> {
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not configured");
  const payloadB64 = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ role: "admin", iat: Date.now(), exp: Date.now() + ADMIN_SESSION_TTL_MS }))
  );
  const sig = await hmacSha256B64Url(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

async function verifyAdminToken(token: string | undefined | null, secret: string | undefined): Promise<boolean> {
  if (!token) return false;
  if (!secret) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payloadB64, sig] = parts;
  const expectedSig = await hmacSha256B64Url(payloadB64, secret);
  if (!timingSafeEqual(sig, expectedSig)) return false;
  try {
    const payload = JSON.parse(fromBase64Url(payloadB64));
    return payload.role === "admin" && typeof payload.exp === "number" && Date.now() < payload.exp;
  } catch {
    return false;
  }
}

// Middleware: apply to every route that reads or mutates customer/financial data.
const requireAdmin = async (c: any, next: any) => {
  const token = c.req.header("x-admin-session");
  if (!(await verifyAdminToken(token, c.env.ADMIN_SESSION_SECRET))) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
};


// Security: Add security headers middleware
app.use('*', async (c, next) => {
  await next();
  
  // Security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict-Transport-Security (HSTS) - Force HTTPS for 1 year
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // JSON API. No third-party script, connect, or frame origins.
  c.header(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  );
});

// Browser callers are limited to the production site. Override with
// ALLOWED_ORIGINS (comma-separated) on the function. A wildcard is ignored.
app.use(
  "/*",
  cors({
    origin: (origin, c) => {
      const allowed = parseAllowedOrigins(c.env.ALLOWED_ORIGINS);
      return origin && allowed.includes(origin) ? origin : "";
    },
    allowHeaders: ["Content-Type", "Authorization", "X-Admin-Session"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-feacf0d8/health", (c) => {
  return c.json({ status: "ok" });
});

// Commerce is off. One handler, no Stripe calls and no store writes.
for (const path of COMMERCE_ROUTES) {
  app.all(path, commerceUnavailable);
}

// Admin login - the ONLY place the admin password is ever checked, and it
// only ever happens server-side. Rate-limited to slow down brute force.
app.post("/make-server-feacf0d8/admin-login", rateLimit(5, 60000), async (c) => {
  try {
    const adminPassword = c.env.ADMIN_PASSWORD;
    const sessionSecret = c.env.ADMIN_SESSION_SECRET;
    // Fail closed before the password compare. A missing session secret must
    // not answer 401 for the right password and 401 for the wrong one in a
    // way that confirms the password, and it must not issue a token. #64
    // treats missing admin config as "not configured" (500), not as a bad password.
    if (!adminPassword || !sessionSecret) {
      console.error("Admin login is not configured");
      return c.json({ error: "Admin login is not configured" }, 500);
    }
    const { password } = await c.req.json();
    if (typeof password !== "string" || !(await passwordsMatch(password, adminPassword))) {
      return c.json({ error: "Incorrect password" }, 401);
    }
    const token = await issueAdminToken(sessionSecret);
    return c.json({ status: "success", token, expiresIn: ADMIN_SESSION_TTL_MS });
  } catch (error) {
    console.error("Admin login error:", error instanceof Error ? error.name : "error");
    return c.json({ error: "Login failed" }, 500);
  }
});

// Audit log endpoint - Store security audit logs
app.post("/make-server-feacf0d8/audit-log", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { timestamp, eventType, userId, email, ip, userAgent, details, severity, endpoint, statusCode } = body;

    // Store audit log in key-value store
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await store(c).set(logId, {
      timestamp,
      eventType,
      userId,
      email,
      ip,
      userAgent,
      details,
      severity,
      endpoint,
      statusCode,
      created_at: new Date().toISOString()
    });

    // Log critical events to console immediately
    if (severity === 'critical' || severity === 'high') {
      console.warn(`Audit ${severity} ${eventType} ${logId}`);
    }

    return c.json({ status: 'success', logId });
  } catch (error) {
    console.error("Error storing audit log:", errorLabel(error));
    return c.json({ error: "Failed to store audit log" }, 500);
  }
});

// Security alert endpoint - Handle critical security events
app.post("/make-server-feacf0d8/security-alert", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { alert, log } = body;

    // Store alert
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error(`Security alert ${alertId}`);
    await store(c).set(alertId, {
      alert,
      log,
      created_at: new Date().toISOString(),
      status: 'new'
    });

    // In production, you would:
    // 1. Send email to security team
    // 2. Send SMS/push notification
    // 3. Create incident ticket
    // 4. Trigger automated response

    return c.json({ status: 'alert_received', alertId });
  } catch (error) {
    console.error("Error handling security alert:", errorLabel(error));
    return c.json({ error: "Failed to process security alert" }, 500);
  }
});

// Export audit logs endpoint (admin only - add auth in production)
app.get("/make-server-feacf0d8/audit-logs/export", requireAdmin, async (c) => {
  try {
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const eventTypes = c.req.query('eventTypes')?.split(',');

    // Get all audit logs
    const logs = await store(c).getByPrefix('audit_');
    
    // Filter by date range and event types
    const filtered = logs.filter((log: any) => {
      const logDate = new Date(log.timestamp);
      const inRange = (!startDate || logDate >= new Date(startDate)) &&
                      (!endDate || logDate <= new Date(endDate));
      const matchesType = !eventTypes || eventTypes.includes(log.eventType);
      return inRange && matchesType;
    });

    console.log(`Exporting ${filtered.length} audit logs`);

    return c.json({
      logs: filtered,
      exportDate: new Date().toISOString(),
      count: filtered.length
    });
  } catch (error) {
    console.error("Error exporting audit logs:", errorLabel(error));
    return c.json({ error: "Failed to export audit logs" }, 500);
  }
});

function deferAdminNotice(c: AppContext, subject: string, html: string) {
  const emailApiKey = c.env.EMAIL_SERVICE_API_KEY;
  if (!emailApiKey) return;
  defer(c, (async () => {
    const response = await outbound.fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${emailApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "CREOVA <support@creova.one>",
        to: ["support@creova.one"],
        subject,
        html,
      }),
    });
    if (!response.ok) console.error("Admin notice failed", response.status);
  })());
}

// Email notification signup (for product launches, memberships, etc.)
app.post("/make-server-feacf0d8/notify-me", rateLimit(10, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, SIGNUP_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Email and type are required" }, parsedBody.status === 413 ? 413 : 400);
    const body = parsedBody.body;
    const parsedEmail = parseEmailAddress(body.email);
    const parsedType = requiredText(body.type, TEXT_LIMITS.short);
    const itemId = optionalText(body.item_id, TEXT_LIMITS.short);
    if (!parsedEmail || !parsedType || !itemId.ok) {
      return c.json({ error: "Email and type are required" }, 400);
    }

    // No storefront caller. Turnstile fail-closes the anonymous write.
    const captcha = await requireTurnstile(c, body.captchaToken, "notify");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }
    if (!allowDailyWrite(clientIp(c), "signup", SIGNUP_WRITES_PER_IP_PER_DAY)) {
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }

    const notificationId = `notification_${parsedType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stored = await persistLead(c, notificationId, {
      email: parsedEmail,
      type: parsedType,
      item_id: itemId.value,
      status: "subscribed",
      created_at: new Date().toISOString(),
    });

    console.log(`Email notification signup: ${notificationId}`);
    deferAdminNotice(
      c,
      `Notification signup: ${oneLine(parsedType)}`,
      `<p>Notification signup ${escapeHtml(notificationId)}</p><p>${escapeHtml(parsedEmail)} · ${escapeHtml(parsedType)}</p>`,
    );

    return c.json({
      status: "success",
      message: "Successfully subscribed to notifications",
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error saving notification signup:", error instanceof Error ? error.name : "error");
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});


// Subscribe to lead magnet. Turnstile matches the other public forms.
// Name is optional: the exit-intent and drop waitlist send an email only.
app.post("/make-server-feacf0d8/subscribe-lead-magnet", rateLimit(3, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, SIGNUP_BODY_MAX);
    if (!parsedBody.ok) {
      return c.json({ error: "Email and lead magnet ID are required" }, parsedBody.status === 413 ? 413 : 400);
    }
    const body = parsedBody.body;
    const email = parseEmailAddress(body.email);
    const name = optionalText(body.name, TEXT_LIMITS.name);
    const leadMagnetId = safeKeyPart(body.leadMagnetId, 64);
    const title = optionalText(body.leadMagnetTitle, TEXT_LIMITS.short);
    const subscribedAt = optionalText(body.subscribedAt, TEXT_LIMITS.short);
    if (!email || !name.ok || !leadMagnetId || !title.ok || !subscribedAt.ok) {
      return c.json({ error: "Email and lead magnet ID are required" }, 400);
    }

    const captcha = await requireTurnstile(c, body.captchaToken, "lead-magnet");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }
    if (!allowDailyWrite(clientIp(c), "signup", SIGNUP_WRITES_PER_IP_PER_DAY)) {
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }

    const subscriptionId = `lead_magnet_${leadMagnetId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const when = subscribedAt.value || new Date().toISOString();
    const stored = await persistLead(c, subscriptionId, {
      email,
      name: name.value,
      leadMagnetId,
      leadMagnetTitle: title.value,
      subscribedAt: when,
      status: "subscribed",
    });

    console.log(`Lead magnet subscription: ${subscriptionId}`);

    defer(c, syncToAirtable(c.env.AIRTABLE_API_KEY, "tblfiwUQFIQMo89Ya", {
      Email: email, Name: name.value, "Lead Magnet": title.value || leadMagnetId,
      "Subscribed At": when,
      "Supabase Record ID": subscriptionId,
    }));
    deferAdminNotice(
      c,
      `Lead magnet: ${oneLine(title.value || leadMagnetId)}`,
      `<p>Lead magnet ${escapeHtml(subscriptionId)}</p><p>${escapeHtml(email)}</p><p>${escapeHtml(title.value || leadMagnetId)}</p>`,
    );

    return c.json({
      status: "success",
      message: "Successfully subscribed! Check your email for the download link.",
      subscriptionId,
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error subscribing to lead magnet:", error instanceof Error ? error.name : "error");
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});

// Subscribe to event interest (teaser events page — /experience). Twelve
// cards share this route, so it uses length caps and a per-IP daily cap
// instead of a Turnstile widget on every card. It does not send email:
// Resend's free quota is reserved for Turnstile-gated forms.
app.post("/make-server-feacf0d8/subscribe-event-interest", rateLimit(5, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, SIGNUP_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Email is required" }, parsedBody.status === 413 ? 413 : 400);
    const body = parsedBody.body;
    const email = parseEmailAddress(body.email);
    const name = optionalText(body.name, TEXT_LIMITS.name);
    const eventId = optionalText(body.eventId, 64);
    const eventName = optionalText(body.eventName, TEXT_LIMITS.short);
    if (!email || !name.ok || !eventId.ok || !eventName.ok) {
      return c.json({ error: "Email is required" }, 400);
    }
    if (eventId.value && !safeKeyPart(eventId.value, 64)) {
      return c.json({ error: "Invalid event" }, 400);
    }
    if (!allowDailyWrite(clientIp(c), "signup", SIGNUP_WRITES_PER_IP_PER_DAY)) {
      return c.json({ error: "Too many requests. Please try again later." }, 429);
    }

    const displayName = name.value || email.split("@")[0];
    const interestId = `event_interest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const stored = await persistLead(c, interestId, {
      email,
      name: displayName,
      eventId: eventId.value,
      eventName: eventName.value,
      status: "subscribed",
      created_at: new Date().toISOString(),
    });

    console.log(`Event interest signup: ${interestId}`);

    defer(c, syncToAirtable(c.env.AIRTABLE_API_KEY, "tblEotZPSIfKErLHO", {
      Email: email, Name: displayName, Event: eventName.value || eventId.value || "General",
      "Submitted At": new Date().toISOString(), Source: "experience-page",
      "Supabase Record ID": interestId,
    }));

    return c.json({
      status: "success",
      message: "You're on the list! We'll email you the full details as soon as they're confirmed.",
      interestId,
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error subscribing to event interest:", error instanceof Error ? error.name : "error");
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});


// Submit contact form
app.post("/make-server-feacf0d8/submit-contact", rateLimit(5, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, FORM_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Name, email, and message are required" }, 400);
    const body = parsedBody.body;
    const name = requiredText(body.name, TEXT_LIMITS.name);
    const email = parseEmailAddress(body.email);
    const message = requiredText(body.message, TEXT_LIMITS.message);
    const phone = optionalText(body.phone, TEXT_LIMITS.phone);
    const service = optionalText(body.service, TEXT_LIMITS.service);
    const budget = optionalText(body.budget, TEXT_LIMITS.short);
    const timeline = optionalText(body.timeline, TEXT_LIMITS.short);

    if (!name || !email || !message || !phone.ok || !service.ok || !budget.ok || !timeline.ok) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    const captcha = await requireTurnstile(c, body.captchaToken, "contact");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const stored = await persistLead(c, contactId, {
      name,
      email,
      phone: phone.value,
      service: service.value,
      message,
      budget: budget.value,
      timeline: timeline.value,
      status: 'new',
      type: 'contact',
      created_at: new Date().toISOString()
    });

    console.log(`Contact form submitted: ${contactId}`);

    defer(c, syncToAirtable(c.env.AIRTABLE_API_KEY, "tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Phone: phone.value, Message: message,
      Service: service.value, Budget: budget.value, Timeline: timeline.value,
      Type: "contact", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": contactId,
    }));

    // Customer copy is a fixed receipt. The admin copy keeps the submission.
    const emailApiKey = c.env.EMAIL_SERVICE_API_KEY;
    if (emailApiKey) {
      const contactEmailData: ContactEmailData = {
        name,
        email,
        phone: phone.value,
        service: service.value,
        message,
        budget: budget.value,
        timeline: timeline.value,
      };
      defer(c, (async () => {
        try {
          await Promise.all([
            outbound.fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: [oneLine(email)],
                subject: "We've received your message — CREOVA",
                html: contactReceivedHtml(),
              })
            }),
            outbound.fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: ['support@creova.one'],
                subject: contactAdminSubject(service.value, name),
                html: adminContactNotification(contactEmailData),
                reply_to: oneLine(email)
              })
            })
          ]);
        } catch (error) {
          console.error('Failed to send contact emails:', error instanceof Error ? error.name : "error");
        }
      })());
    }

    return c.json({
      contactId,
      status: 'success',
      message: 'Contact form submitted successfully',
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error submitting contact form:", errorLabel(error));
    return c.json({ error: "Failed to submit contact form" }, 500);
  }
});

// Submit collaboration form
app.post("/make-server-feacf0d8/submit-collaboration", rateLimit(5, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, FORM_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Name, email, and project description are required" }, 400);
    const body = parsedBody.body;
    const name = requiredText(body.name, TEXT_LIMITS.name);
    const email = parseEmailAddress(body.email);
    const projectDescription = requiredText(body.projectDescription, TEXT_LIMITS.message);
    const organization = optionalText(body.organization, TEXT_LIMITS.service);
    const collaborationType = optionalText(body.collaborationType, TEXT_LIMITS.service);
    const timeline = optionalText(body.timeline, TEXT_LIMITS.short);
    const budget = optionalText(body.budget, TEXT_LIMITS.short);

    if (!name || !email || !projectDescription || !organization.ok || !collaborationType.ok || !timeline.ok || !budget.ok) {
      return c.json({ error: "Name, email, and project description are required" }, 400);
    }

    const captcha = await requireTurnstile(c, body.captchaToken, "collaboration");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const collaborationId = `collaboration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stored = await persistLead(c, collaborationId, {
      name,
      email,
      organization: organization.value,
      collaborationType: collaborationType.value,
      projectDescription,
      timeline: timeline.value,
      budget: budget.value,
      status: 'new',
      type: 'collaboration',
      created_at: new Date().toISOString()
    });

    console.log(`Collaboration form submitted: ${collaborationId}`);

    defer(c, syncToAirtable(c.env.AIRTABLE_API_KEY, "tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Message: projectDescription,
      Service: collaborationType.value, Budget: budget.value, Timeline: timeline.value,
      Type: "collaboration", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": collaborationId,
    }));

    const emailApiKey = c.env.EMAIL_SERVICE_API_KEY;
    if (emailApiKey) {
      const collaborationEmailData: CollaborationEmailData = {
        name,
        email,
        organization: organization.value,
        collaborationType: collaborationType.value,
        projectDescription,
        timeline: timeline.value,
        budget: budget.value,
      };
      defer(c, (async () => {
        try {
          await outbound.fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'CREOVA <support@creova.one>',
              to: ['support@creova.one'],
              subject: collaborationAdminSubject(organization.value, name),
              html: adminCollaborationNotification(collaborationEmailData),
              reply_to: oneLine(email),
            }),
          });
        } catch (error) {
          console.error('Failed to send collaboration email:', error instanceof Error ? error.name : "error");
        }
      })());
    }

    return c.json({
      collaborationId,
      status: 'success',
      message: 'Collaboration request submitted successfully',
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error submitting collaboration form:", errorLabel(error));
    return c.json({ error: "Failed to submit collaboration form" }, 500);
  }
});

// Submit booking form
app.post("/make-server-feacf0d8/submit-booking", rateLimit(5, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, FORM_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Service, name, email, and phone are required" }, 400);
    const body = parsedBody.body;
    const service = requiredText(body.service, TEXT_LIMITS.service);
    const packageName = optionalText(body.package, TEXT_LIMITS.service);
    const name = requiredText(body.name, TEXT_LIMITS.name);
    const email = parseEmailAddress(body.email);
    const phone = requiredText(body.phone, TEXT_LIMITS.phone);
    const preferredDate = optionalText(body.preferredDate, TEXT_LIMITS.short);
    const preferredTime = optionalText(body.preferredTime, TEXT_LIMITS.short);
    const location = optionalText(body.location, TEXT_LIMITS.short);
    const numberOfPeople = optionalText(body.numberOfPeople, TEXT_LIMITS.short);
    const specialRequests = optionalText(body.specialRequests, TEXT_LIMITS.message);
    const budget = optionalText(body.budget, TEXT_LIMITS.short);
    const hearAboutUs = optionalText(body.hearAboutUs, TEXT_LIMITS.short);
    const submittedAt = optionalText(body.submittedAt, TEXT_LIMITS.short);

    if (
      !service || !name || !email || !phone ||
      !packageName.ok || !preferredDate.ok || !preferredTime.ok || !location.ok ||
      !numberOfPeople.ok || !specialRequests.ok || !budget.ok || !hearAboutUs.ok || !submittedAt.ok
    ) {
      return c.json({ error: "Service, name, email, and phone are required" }, 400);
    }

    const captcha = await requireTurnstile(c, body.captchaToken, "booking");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const stored = await persistLead(c, bookingId, {
      service,
      package: packageName.value,
      name,
      email,
      phone,
      preferredDate: preferredDate.value,
      preferredTime: preferredTime.value,
      location: location.value,
      numberOfPeople: numberOfPeople.value,
      specialRequests: specialRequests.value,
      budget: budget.value,
      hearAboutUs: hearAboutUs.value,
      status: 'pending',
      submitted_at: submittedAt.value || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Booking submitted: ${bookingId}`);

    // Customer copy is a fixed receipt. The admin copy keeps the booking fields.
    const emailApiKey = c.env.EMAIL_SERVICE_API_KEY;
    if (emailApiKey) {
      const emailData: BookingEmailData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        service,
        package: packageName.value || 'Standard',
        preferredDate: preferredDate.value || '',
        preferredTime: preferredTime.value || '',
        location: location.value || '',
        numberOfPeople: numberOfPeople.value,
        specialRequests: specialRequests.value,
        amount: 0
      };
      defer(c, (async () => {
        try {
          await Promise.all([
            outbound.fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA Bookings <bookings@creova.one>',
                to: [oneLine(email)],
                subject: 'Booking Request Received — CREOVA',
                html: bookingReceivedHtml(),
              })
            }),
            outbound.fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: ['support@creova.one'],
                subject: `🎬 New Booking: ${oneLine(service)} — ${oneLine(name)}`,
                html: adminBookingNotification(emailData),
                reply_to: oneLine(email)
              })
            })
          ]);
        } catch (error) {
          console.error('Failed to send booking emails:', error instanceof Error ? error.name : "error");
        }
      })());
    }

    return c.json({
      bookingId,
      status: 'success',
      message: 'Booking request submitted successfully',
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error submitting booking:", errorLabel(error));
    return c.json({ error: "Failed to submit booking" }, 500);
  }
});

// Submit rental form
app.post("/make-server-feacf0d8/submit-rental", rateLimit(5, 60000), async (c) => {
  try {
    const parsedBody = await readBoundedJson(c, FORM_BODY_MAX);
    if (!parsedBody.ok) return c.json({ error: "Equipment, name, email, phone, and rental dates are required" }, 400);
    const body = parsedBody.body;
    const name = requiredText(body.name, TEXT_LIMITS.name);
    const email = parseEmailAddress(body.email);
    const phone = requiredText(body.phone, TEXT_LIMITS.phone);
    const startDate = requiredText(body.startDate, TEXT_LIMITS.short);
    const endDate = requiredText(body.endDate, TEXT_LIMITS.short);
    const pickupLocation = optionalText(body.pickupLocation, TEXT_LIMITS.short);
    const purpose = optionalText(body.purpose, TEXT_LIMITS.message);
    const specialRequests = optionalText(body.specialRequests, TEXT_LIMITS.message);
    const submittedAt = optionalText(body.submittedAt, TEXT_LIMITS.short);
    const equipment: Array<string | null> | null = Array.isArray(body.equipment)
      ? body.equipment.map((item: unknown) => requiredText(item, TEXT_LIMITS.service))
      : null;
    const equipmentOk = !!equipment && equipment.length > 0 && equipment.length <= 20 && equipment.every((item: string | null) => item !== null);

    if (!equipment || !equipmentOk || !name || !email || !phone || !startDate || !endDate || !pickupLocation.ok || !purpose.ok || !specialRequests.ok || !submittedAt.ok) {
      return c.json({ error: "Equipment, name, email, phone, and rental dates are required" }, 400);
    }

    const captcha = await requireTurnstile(c, body.captchaToken, "rental");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const rentalId = `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const equipmentNames = equipment.filter((item: string | null): item is string => item !== null);
    
    const stored = await persistLead(c, rentalId, {
      equipment: equipmentNames,
      name,
      email,
      phone,
      startDate,
      endDate,
      rentalDays: finiteNumber(body.rentalDays),
      dailyRate: finiteNumber(body.dailyRate),
      totalCost: finiteNumber(body.totalCost),
      depositAmount: finiteNumber(body.depositAmount),
      pickupLocation: pickupLocation.value,
      purpose: purpose.value,
      specialRequests: specialRequests.value,
      hasInsurance: body.hasInsurance === true,
      status: 'pending',
      submitted_at: submittedAt.value || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Rental submitted: ${rentalId}`);
    deferAdminNotice(
      c,
      `New rental: ${oneLine(name)}`,
      `<p>Rental ${escapeHtml(rentalId)}</p><p>${escapeHtml(name)} · ${escapeHtml(email)} · ${escapeHtml(phone)}</p><p>${escapeHtml(startDate)} – ${escapeHtml(endDate)}</p><p>${escapeHtml(equipmentNames.join(", "))}</p>`,
    );

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental request submitted successfully',
      stored,
    }, leadStatus(stored));
  } catch (error) {
    console.error("Error submitting rental:", errorLabel(error));
    return c.json({ error: "Failed to submit rental" }, 500);
  }
});

// Get all contact and collaboration submissions (admin endpoint)
app.get("/make-server-feacf0d8/submissions", requireAdmin, async (c) => {
  try {
    const contacts = await store(c).getByPrefix("contact_");
    const collaborations = await store(c).getByPrefix("collaboration_");

    // Combine and sort by date (newest first)
    const allSubmissions = [...contacts, ...collaborations].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    console.log(`Retrieved ${allSubmissions.length} submissions`);

    return c.json({
      status: 'success',
      count: allSubmissions.length,
      submissions: allSubmissions
    });
  } catch (error) {
    console.error("Error retrieving submissions:", errorLabel(error));
    return c.json({ error: "Failed to retrieve submissions" }, 500);
  }
});

// Update submission status (admin endpoint)
app.post("/make-server-feacf0d8/update-submission-status", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { submissionId, status } = body;

    if (!submissionId || !status) {
      return c.json({ error: "Submission ID and status are required" }, 400);
    }

    const submission = await store(c).get(submissionId);
    
    if (!submission) {
      return c.json({ error: "Submission not found" }, 404);
    }

    await store(c).set(submissionId, {
      ...submission,
      status,
      updated_at: new Date().toISOString()
    });

    console.log(`Updated submission ${submissionId} to status: ${status}`);

    return c.json({
      status: 'success',
      message: 'Submission status updated successfully'
    });
  } catch (error) {
    console.error("Error updating submission status:", errorLabel(error));
    return c.json({ error: "Failed to update submission status" }, 500);
  }
});

// Track page view. Writes one Analytics Engine point. Never writes D1.
// Invalid input is 400. Over the per-IP daily cap, or a write error, is 204.
app.post("/make-server-feacf0d8/track-pageview", rateLimit(TRACK_PER_MINUTE, 60000), async (c) => {
  try {
    const parsed = await readBoundedJson(c, TRACK_BODY_MAX);
    if (!parsed.ok) return c.body(null, parsed.status === 413 ? 204 : 400);
    const point = pageviewPoint(parsed.body);
    if (!point) return c.body(null, 400);
    if (!allowDailyWrite(clientIp(c), "track", TRACK_WRITES_PER_IP_PER_DAY)) {
      return c.body(null, 204);
    }
    writeAnalyticsPoint(c, point);
    return c.body(null, 204);
  } catch (error) {
    console.error("Error tracking pageview:", error instanceof Error ? error.name : "error");
    return c.body(null, 204);
  }
});

// Track event. page_exit is accepted and not stored (one extra request per SPA hop).
app.post("/make-server-feacf0d8/track-event", rateLimit(TRACK_PER_MINUTE, 60000), async (c) => {
  try {
    const parsed = await readBoundedJson(c, TRACK_BODY_MAX);
    if (!parsed.ok) return c.body(null, parsed.status === 413 ? 204 : 400);
    const event = eventPoint(parsed.body);
    if (event.drop) return c.body(null, 204);
    if (!event.point) return c.body(null, 400);
    if (!allowDailyWrite(clientIp(c), "track", TRACK_WRITES_PER_IP_PER_DAY)) {
      return c.body(null, 204);
    }
    writeAnalyticsPoint(c, event.point);
    return c.body(null, 204);
  } catch (error) {
    console.error("Error tracking event:", error instanceof Error ? error.name : "error");
    return c.body(null, 204);
  }
});

// Admin analytics. Reads Workers Analytics Engine (a few aggregated SQL queries),
// not D1. A bad referrer cannot throw: hosts are stored at write time, and the
// read path only copies strings. Unconfigured or failed queries return an empty
// success payload so the dashboard does not 500.
app.get("/make-server-feacf0d8/analytics", requireAdmin, async (c) => {
  try {
    const days = clampAnalyticsDays(c.req.query("days"));
    const payload = await queryAnalyticsEngine({
      accountId: c.env.CLOUDFLARE_ACCOUNT_ID,
      token: c.env.ANALYTICS_API_TOKEN,
      days,
    });
    console.log(`Analytics retrieved: ${payload.summary.totalPageviews} pageviews`);
    return c.json(payload);
  } catch (error) {
    console.error("Error retrieving analytics:", errorLabel(error));
    return c.json(emptyAnalytics(clampAnalyticsDays(c.req.query("days"))));
  }
});


// ============================================================================
// GALLERY MANAGEMENT (Work portfolio — public read, admin-managed writes)
//
// WorkPage.tsx and HomePage.tsx used to hardcode the entire gallery list
// (title, cover image, Pixieset link) directly in the React source, so
// adding a new shoot meant editing and redeploying code. This moves that
// data into the KV store: publicly readable so the storefront can render
// it, but only mutable through requireAdmin routes.
// ============================================================================

const GALLERY_CATEGORIES = ["events", "sports", "brand", "conference"] as const;

app.get("/make-server-feacf0d8/galleries", async (c) => {
  try {
    const galleries = await store(c).getByPrefix("gallery_");
    const sorted = galleries.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    return c.json({ status: "success", galleries: sorted });
  } catch (error) {
    console.error("Error retrieving galleries:", errorLabel(error));
    return c.json({ error: "Failed to retrieve galleries" }, 500);
  }
});

app.post("/make-server-feacf0d8/admin/galleries", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { title, subtitle, category, org, year, date, itemCount, locked, image, objectPosition, url, accent, featured, order } = body;

    if (!title || !image || !url) {
      return c.json({ error: "Title, image, and url are required" }, 400);
    }
    if (category && !GALLERY_CATEGORIES.includes(category)) {
      return c.json({ error: "Invalid category" }, 400);
    }

    const id = `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const gallery = {
      id,
      title,
      subtitle: subtitle || "",
      category: category || "events",
      org: org || "",
      year: year || String(new Date().getFullYear()),
      date: typeof date === "string" ? date : undefined,
      itemCount: typeof itemCount === "number" ? itemCount : undefined,
      locked: !!locked,
      image,
      objectPosition: objectPosition || "center",
      url,
      accent: accent || "#D4A843",
      featured: !!featured,
      order: typeof order === "number" ? order : Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await store(c).set(id, gallery);

    console.log(`Created gallery: ${id}`);
    return c.json({ status: "success", gallery });
  } catch (error) {
    console.error("Error creating gallery:", errorLabel(error));
    return c.json({ error: "Failed to create gallery" }, 500);
  }
});

app.post("/make-server-feacf0d8/admin/galleries/update", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { id, ...updates } = body;
    if (!id) return c.json({ error: "Gallery id is required" }, 400);
    if (updates.category && !GALLERY_CATEGORIES.includes(updates.category)) {
      return c.json({ error: "Invalid category" }, 400);
    }

    const existing = await store(c).get(id);
    if (!existing) return c.json({ error: "Gallery not found" }, 404);

    const updated = { ...existing, ...updates, id, updated_at: new Date().toISOString() };
    await store(c).set(id, updated);

    console.log(`Updated gallery: ${id}`);
    return c.json({ status: "success", gallery: updated });
  } catch (error) {
    console.error("Error updating gallery:", errorLabel(error));
    return c.json({ error: "Failed to update gallery" }, 500);
  }
});

app.post("/make-server-feacf0d8/admin/galleries/delete", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    if (!id) return c.json({ error: "Gallery id is required" }, 400);

    await store(c).del(id);
    console.log(`Deleted gallery: ${id}`);
    return c.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting gallery:", errorLabel(error));
    return c.json({ error: "Failed to delete gallery" }, 500);
  }
});

// ============================================================================
// EMAIL SENDING ENDPOINTS
// ============================================================================

// Send booking confirmation email
app.post("/make-server-feacf0d8/send-booking-confirmation", requireAdmin, rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { to, bookingDetails, amount, language, checkoutUrl } = body;

    // Check if email service is configured
    const emailServiceApiKey = c.env.EMAIL_SERVICE_API_KEY;
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping email send');
      return c.json({ 
        status: 'warning', 
        message: 'Email service not configured. Booking saved but confirmation not sent.' 
      }, 200);
    }

    const emailData: BookingEmailData = {
      customerName: bookingDetails.name,
      customerEmail: to,
      customerPhone: bookingDetails.phone,
      service: bookingDetails.service,
      package: bookingDetails.package || bookingDetails.packageName || 'Standard',
      preferredDate: bookingDetails.preferredDate || bookingDetails.date,
      preferredTime: bookingDetails.preferredTime || bookingDetails.time,
      location: bookingDetails.location,
      numberOfPeople: bookingDetails.numberOfPeople,
      specialRequests: bookingDetails.specialRequests,
      amount: amount,
      checkoutUrl: checkoutUrl
    };

    // Get customer email template in correct language
    const customerEmailHtml = getBookingConfirmationTemplate(language || 'en', emailData);
    const customerSubject = language === 'fr' 
      ? 'Confirmation de Réservation - CREOVA'
      : 'Booking Confirmation - CREOVA';

    // Send confirmation to customer
    const customerEmailResponse = await outbound.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA Bookings <bookings@creova.one>',
        to: [oneLine(to)],
        subject: customerSubject,
        html: customerEmailHtml
      })
    });

    if (!customerEmailResponse.ok) {
      console.error("Failed to send customer confirmation email", customerEmailResponse.status);
      await customerEmailResponse.body?.cancel();
      throw new Error("Customer email failed");
    }

    const customerResult = (await customerEmailResponse.json()) as { id?: string };
    console.log(`Booking confirmation sent: ${customerResult.id ?? "ok"}`);

    // Send notification to admin
    const adminEmailHtml = adminBookingNotification(emailData);
    
    const adminEmailResponse = await outbound.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: `🎬 New Booking: ${oneLine(bookingDetails.service)} - ${oneLine(bookingDetails.name)}`,
        html: adminEmailHtml,
        reply_to: oneLine(to)
      })
    });

    if (!adminEmailResponse.ok) {
      console.error("Failed to send admin notification email", adminEmailResponse.status);
      await adminEmailResponse.body?.cancel();
    } else {
      const adminResult = (await adminEmailResponse.json()) as { id?: string };
      console.log(`Admin notification sent: ${adminResult.id}`);
    }

    return c.json({ 
      status: 'success', 
      message: 'Booking confirmation emails sent successfully',
      customerEmailId: customerResult.id
    });

  } catch (error) {
    console.error("Error sending booking confirmation emails:", errorLabel(error));
    return c.json({ 
      error: 'Failed to send confirmation email',
    }, 500);
  }
});

// Send contact form notification email (admin only)
app.post("/make-server-feacf0d8/send-contact-notification", requireAdmin, rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const contactData: ContactEmailData = body;

    const emailServiceApiKey = c.env.EMAIL_SERVICE_API_KEY;
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminContactNotification(contactData);
    
    const emailResponse = await outbound.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: contactAdminSubject(contactData.service, contactData.name),
        html: adminEmailHtml,
        reply_to: oneLine(contactData.email)
      })
    });

    if (!emailResponse.ok) {
      console.error("Failed to send contact notification", emailResponse.status);
      await emailResponse.body?.cancel();
      throw new Error("Email send failed");
    }

    const result = (await emailResponse.json()) as { id?: string };
    console.log(`Contact form notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error("Error sending contact notification:", errorLabel(error));
    return c.json({ 
      error: 'Failed to send notification',
    }, 500);
  }
});

// Send collaboration form notification email (admin only)
app.post("/make-server-feacf0d8/send-collaboration-notification", requireAdmin, rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const collaborationData: CollaborationEmailData = body;

    const emailServiceApiKey = c.env.EMAIL_SERVICE_API_KEY;
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminCollaborationNotification(collaborationData);
    
    const emailResponse = await outbound.fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailServiceApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'CREOVA <support@creova.one>',
        to: ['support@creova.one'],
        subject: collaborationAdminSubject(collaborationData.organization, collaborationData.name),
        html: adminEmailHtml,
        reply_to: oneLine(collaborationData.email)
      })
    });

    if (!emailResponse.ok) {
      console.error("Failed to send collaboration notification", emailResponse.status);
      await emailResponse.body?.cancel();
      throw new Error("Email send failed");
    }

    const result = (await emailResponse.json()) as { id?: string };
    console.log(`Collaboration notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error("Error sending collaboration notification:", errorLabel(error));
    return c.json({ 
      error: 'Failed to send notification',
    }, 500);
  }
});

// ============================================================================

export default app;
