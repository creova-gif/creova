import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import {
  bookingReceivedHtml,
  COMMERCE_GONE_BODY,
  COMMERCE_GONE_STATUS,
  COMMERCE_ROUTES,
  consumeRateLimit,
  collaborationAdminSubject,
  contactAdminSubject,
  contactReceivedHtml,
  isUsableTurnstileSecret,
  oneLine,
  optionalText,
  parseAllowedOrigins,
  parseEmailAddress,
  rateLimitClientIp,
  requiredText,
  TEXT_LIMITS,
  turnstileGate,
  turnstileVerificationOk,
} from "./guards.ts";

const app = new Hono();

// Airtable sync — mirrors website form submissions into the unified
// "CREOVA Website Data" base (appHQkjX7B97NQPbi) so the team has one place
// to view sign-ups without touching Supabase directly. Fire-and-forget and
// silently no-ops until AIRTABLE_API_KEY is set as a Supabase secret, so it
// never blocks or fails the actual form submission.
const AIRTABLE_BASE_ID = "appHQkjX7B97NQPbi";
function syncToAirtable(tableId: string, fields: Record<string, unknown>) {
  const apiKey = Deno.env.get("AIRTABLE_API_KEY");
  if (!apiKey) return;
  fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records: [{ fields }] }),
  }).catch((e) => console.error(`Airtable sync failed for ${tableId}:`, e));
}

// Best-effort limiter for this isolate only. Supabase Edge isolates do not
// share memory, so a fresh isolate starts with an empty map. kv_store upsert
// is a read-then-write, not an atomic counter, and is not a rate-limit
// control. Clients with no platform-supplied address share one "unknown" bucket.
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function clientIp(c: { req: { header: (name: string) => string | undefined } }): string {
  return rateLimitClientIp({
    forwardedFor: c.req.header("x-forwarded-for"),
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
      console.log(`Rate limit exceeded for ${ip} on ${c.req.path}`);
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

// Turnstile. Missing secret fails closed unless CREOVA_ENV is exactly a local
// value and SUPABASE_URL is not a hosted project. ENVIRONMENT is ignored.
async function requireTurnstile(
  c: { req: { header: (name: string) => string | undefined } },
  token: unknown,
  action: string,
): Promise<{ ok: true } | { ok: false; status: 400 | 503; error: string }> {
  const rawSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
  const gate = turnstileGate({
    secretConfigured: isUsableTurnstileSecret(rawSecret),
    creovaEnv: Deno.env.get("CREOVA_ENV"),
    supabaseUrl: Deno.env.get("SUPABASE_URL"),
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
    const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
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
    console.error("Turnstile siteverify request failed:", error);
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

async function issueAdminToken(): Promise<string> {
  const secret = Deno.env.get("ADMIN_SESSION_SECRET");
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not configured");
  const payloadB64 = toBase64Url(
    new TextEncoder().encode(JSON.stringify({ role: "admin", iat: Date.now(), exp: Date.now() + ADMIN_SESSION_TTL_MS }))
  );
  const sig = await hmacSha256B64Url(payloadB64, secret);
  return `${payloadB64}.${sig}`;
}

async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const secret = Deno.env.get("ADMIN_SESSION_SECRET");
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
  if (!(await verifyAdminToken(token))) {
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
  
  // Content Security Policy (CSP)
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://*.supabase.co https://www.google.com https://www.gstatic.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://*.stripe.com https://*.supabase.co https://www.google.com; " +
    "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com; " +
    "base-uri 'self'; " +
    "form-action 'self' https://checkout.stripe.com;"
  );
});

// Enable logger
app.use('*', logger(console.log));

// Browser callers are limited to the production site. Override with
// ALLOWED_ORIGINS (comma-separated) on the function. A wildcard is ignored.
app.use(
  "/*",
  cors({
    origin: (origin) => {
      const allowed = parseAllowedOrigins(Deno.env.get("ALLOWED_ORIGINS"));
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
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword) {
      console.error("ADMIN_PASSWORD not configured");
      return c.json({ error: "Admin login is not configured" }, 500);
    }
    const { password } = await c.req.json();
    if (typeof password !== "string" || !timingSafeEqual(password, adminPassword)) {
      return c.json({ error: "Incorrect password" }, 401);
    }
    const token = await issueAdminToken();
    return c.json({ status: "success", token, expiresIn: ADMIN_SESSION_TTL_MS });
  } catch (error) {
    console.error("Admin login error:", error);
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
    
    await kv.set(logId, {
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
      console.warn(`🚨 [${severity.toUpperCase()}] ${eventType}:`, {
        timestamp,
        userId,
        email,
        details
      });
    }

    return c.json({ status: 'success', logId });
  } catch (error) {
    console.error("Error storing audit log:", error);
    return c.json({ error: "Failed to store audit log" }, 500);
  }
});

// Security alert endpoint - Handle critical security events
app.post("/make-server-feacf0d8/security-alert", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { alert, log } = body;

    console.error(`🚨🚨🚨 CRITICAL SECURITY ALERT: ${alert}`, {
      eventType: log.eventType,
      timestamp: log.timestamp,
      ip: log.ip,
      details: log.details
    });

    // Store alert
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(alertId, {
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
    console.error("Error handling security alert:", error);
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
    const logs = await kv.getByPrefix('audit_');
    
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
    console.error("Error exporting audit logs:", error);
    return c.json({ error: "Failed to export audit logs" }, 500);
  }
});

// Email notification signup (for product launches, memberships, etc.)
app.post("/make-server-feacf0d8/notify-me", rateLimit(10, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { email, type, item_id, captchaToken } = body; // type: 'membership', 'product', 'event', etc.

    const parsedEmail = parseEmailAddress(email);
    const parsedType = requiredText(type, TEXT_LIMITS.short);
    if (!parsedEmail || !parsedType) {
      return c.json({ error: "Email and type are required" }, 400);
    }

    // No storefront caller. Turnstile fail-closes the anonymous write.
    const captcha = await requireTurnstile(c, captchaToken, "notify");
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const notificationId = `notification_${parsedType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(notificationId, {
      email: parsedEmail,
      type: parsedType,
      item_id,
      status: 'subscribed',
      created_at: new Date().toISOString()
    });

    console.log(`Email notification signup: ${parsedEmail} for ${parsedType}`);

    return c.json({
      status: 'success',
      message: 'Successfully subscribed to notifications'
    });
  } catch (error) {
    console.error("Error saving notification signup:", error);
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});


// Subscribe to lead magnet
app.post("/make-server-feacf0d8/subscribe-lead-magnet", rateLimit(3, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { email, name, leadMagnetId, leadMagnetTitle, subscribedAt } = body;

    if (!email || !name || !leadMagnetId) {
      return c.json({ error: "Email, name, and lead magnet ID are required" }, 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    const subscriptionId = `lead_magnet_${leadMagnetId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(subscriptionId, {
      email,
      name,
      leadMagnetId,
      leadMagnetTitle,
      subscribedAt: subscribedAt || new Date().toISOString(),
      status: 'subscribed'
    });

    console.log(`Lead magnet subscription: ${email} for ${leadMagnetTitle}`);

    syncToAirtable("tblfiwUQFIQMo89Ya", {
      Email: email, Name: name, "Lead Magnet": leadMagnetTitle || leadMagnetId,
      "Subscribed At": subscribedAt || new Date().toISOString(),
      "Supabase Record ID": subscriptionId,
    });

    // TODO: Send email with download link using your email service
    // Example: await sendLeadMagnetEmail(email, name, leadMagnetTitle);

    return c.json({
      status: 'success',
      message: 'Successfully subscribed! Check your email for the download link.',
      subscriptionId
    });
  } catch (error) {
    console.error("Error subscribing to lead magnet:", error);
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});

// Subscribe to event interest (teaser events page — /experience). Full
// event details are gated behind this signup instead of being sold, since
// upcoming events aren't confirmed yet.
app.post("/make-server-feacf0d8/subscribe-event-interest", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { email, eventId, eventName } = body;
    const name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : email?.split("@")[0];

    if (!email) {
      return c.json({ error: "Email is required" }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: "Invalid email format" }, 400);
    }

    const interestId = `event_interest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(interestId, {
      email,
      name,
      eventId,
      eventName,
      status: 'subscribed',
      created_at: new Date().toISOString()
    });

    console.log(`Event interest signup: ${email} for ${eventName || eventId || 'general'}`);

    syncToAirtable("tblEotZPSIfKErLHO", {
      Email: email, Name: name, Event: eventName || eventId || "General",
      "Submitted At": new Date().toISOString(), Source: "experience-page",
      "Supabase Record ID": interestId,
    });

    return c.json({
      status: 'success',
      message: "You're on the list! We'll email you the full details as soon as they're confirmed.",
      interestId
    });
  } catch (error) {
    console.error("Error subscribing to event interest:", error);
    return c.json({ error: "Failed to subscribe" }, 500);
  }
});


// Submit contact form
app.post("/make-server-feacf0d8/submit-contact", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
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

    await kv.set(contactId, {
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

    console.log(`Contact form submitted: ${contactId} from ${email}`);

    syncToAirtable("tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Phone: phone.value, Message: message,
      Service: service.value, Budget: budget.value, Timeline: timeline.value,
      Type: "contact", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": contactId,
    });

    // Customer copy is a fixed receipt. The admin copy keeps the submission.
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
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
      (async () => {
        try {
          await Promise.all([
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: [oneLine(email)],
                subject: "We've received your message — CREOVA",
                html: contactReceivedHtml(),
              })
            }),
            fetch('https://api.resend.com/emails', {
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
        } catch (e) {
          console.error('Failed to send contact emails:', e);
        }
      })();
    }

    return c.json({
      contactId,
      status: 'success',
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return c.json({ error: "Failed to submit contact form" }, 500);
  }
});

// Submit collaboration form
app.post("/make-server-feacf0d8/submit-collaboration", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
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
    
    await kv.set(collaborationId, {
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

    console.log(`Collaboration form submitted: ${collaborationId} from ${email}`);

    syncToAirtable("tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Message: projectDescription,
      Service: collaborationType.value, Budget: budget.value, Timeline: timeline.value,
      Type: "collaboration", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": collaborationId,
    });

    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
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
      (async () => {
        try {
          await fetch('https://api.resend.com/emails', {
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
        } catch (e) {
          console.error('Failed to send collaboration email:', e);
        }
      })();
    }

    return c.json({
      collaborationId,
      status: 'success',
      message: 'Collaboration request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting collaboration form:", error);
    return c.json({ error: "Failed to submit collaboration form" }, 500);
  }
});

// Submit booking form
app.post("/make-server-feacf0d8/submit-booking", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
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
    
    await kv.set(bookingId, {
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

    console.log(`Booking submitted: ${bookingId} by ${name} (${email}) for ${service}`);

    // Customer copy is a fixed receipt. The admin copy keeps the booking fields.
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
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
      (async () => {
        try {
          await Promise.all([
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA Bookings <bookings@creova.one>',
                to: [oneLine(email)],
                subject: 'Booking Request Received — CREOVA',
                html: bookingReceivedHtml(),
              })
            }),
            fetch('https://api.resend.com/emails', {
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
        } catch (e) {
          console.error('Failed to send booking emails:', e);
        }
      })();
    }

    return c.json({
      bookingId,
      status: 'success',
      message: 'Booking request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting booking:", error);
    return c.json({ error: "Failed to submit booking" }, 500);
  }
});

// Submit rental form
app.post("/make-server-feacf0d8/submit-rental", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
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
    
    await kv.set(rentalId, {
      equipment: equipmentNames,
      name,
      email,
      phone,
      startDate,
      endDate,
      rentalDays: body.rentalDays,
      dailyRate: body.dailyRate,
      totalCost: body.totalCost,
      depositAmount: body.depositAmount,
      pickupLocation: pickupLocation.value,
      purpose: purpose.value,
      specialRequests: specialRequests.value,
      hasInsurance: body.hasInsurance === true,
      status: 'pending',
      submitted_at: submittedAt.value || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Rental submitted: ${rentalId} by ${name} (${email})`);

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting rental:", error);
    return c.json({ error: "Failed to submit rental" }, 500);
  }
});

// Get all contact and collaboration submissions (admin endpoint)
app.get("/make-server-feacf0d8/submissions", requireAdmin, async (c) => {
  try {
    const contacts = await kv.getByPrefix("contact_");
    const collaborations = await kv.getByPrefix("collaboration_");

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
    console.error("Error retrieving submissions:", error);
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

    const submission = await kv.get(submissionId);
    
    if (!submission) {
      return c.json({ error: "Submission not found" }, 404);
    }

    await kv.set(submissionId, {
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
    console.error("Error updating submission status:", error);
    return c.json({ error: "Failed to update submission status" }, 500);
  }
});

// Track page view
app.post("/make-server-feacf0d8/track-pageview", rateLimit(120, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { 
      visitorId, 
      sessionId, 
      page, 
      referrer, 
      userAgent, 
      screenWidth, 
      screenHeight,
      language,
      timezone,
      utmSource,
      utmMedium,
      utmCampaign
    } = body;

    const pageviewId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(pageviewId, {
      visitorId,
      sessionId,
      page,
      referrer,
      userAgent,
      screenWidth,
      screenHeight,
      language,
      timezone,
      utmSource,
      utmMedium,
      utmCampaign,
      timestamp: new Date().toISOString()
    });

    // Update session with latest activity
    const sessionKey = `session_${sessionId}`;
    const existingSession = await kv.get(sessionKey);
    
    if (existingSession) {
      await kv.set(sessionKey, {
        ...existingSession,
        lastActivity: new Date().toISOString(),
        pageCount: (existingSession.pageCount || 1) + 1
      });
    } else {
      await kv.set(sessionKey, {
        visitorId,
        sessionId,
        startTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        pageCount: 1,
        referrer,
        userAgent,
        language,
        timezone
      });
    }

    // Track unique visitor
    const visitorKey = `visitor_${visitorId}`;
    const existingVisitor = await kv.get(visitorKey);
    
    if (existingVisitor) {
      await kv.set(visitorKey, {
        ...existingVisitor,
        lastVisit: new Date().toISOString(),
        visitCount: (existingVisitor.visitCount || 1) + 1
      });
    } else {
      await kv.set(visitorKey, {
        visitorId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        visitCount: 1,
        userAgent,
        language,
        timezone
      });
    }

    return c.json({ status: 'success' });
  } catch (error) {
    console.error("Error tracking pageview:", error);
    return c.json({ error: "Failed to track pageview" }, 500);
  }
});

// Track event (button clicks, form submissions, etc.)
app.post("/make-server-feacf0d8/track-event", rateLimit(120, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { visitorId, sessionId, eventName, eventData, page } = body;

    const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(eventId, {
      visitorId,
      sessionId,
      eventName,
      eventData,
      page,
      timestamp: new Date().toISOString()
    });

    console.log(`Event tracked: ${eventName} on ${page}`);

    return c.json({ status: 'success' });
  } catch (error) {
    console.error("Error tracking event:", error);
    return c.json({ error: "Failed to track event" }, 500);
  }
});

// Get analytics data (admin endpoint)
app.get("/make-server-feacf0d8/analytics", requireAdmin, async (c) => {
  try {
    const { searchParams } = new URL(c.req.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

    // Fetch all data
    const [pageviews, sessions, visitors, events] = await Promise.all([
      kv.getByPrefix("pageview_"),
      kv.getByPrefix("session_"),
      kv.getByPrefix("visitor_"),
      kv.getByPrefix("event_")
    ]);

    // Filter by date range
    const filteredPageviews = pageviews.filter(pv => 
      new Date(pv.timestamp) >= startDate
    );

    const filteredSessions = sessions.filter(s => 
      new Date(s.startTime) >= startDate
    );

    const filteredEvents = events.filter(e => 
      new Date(e.timestamp) >= startDate
    );

    // Calculate statistics
    const uniqueVisitors = new Set(filteredPageviews.map(pv => pv.visitorId)).size;
    const totalPageviews = filteredPageviews.length;
    const totalSessions = filteredSessions.length;
    const avgPageviewsPerSession = totalSessions > 0 ? (totalPageviews / totalSessions).toFixed(2) : 0;

    // Page popularity
    const pageCount = {};
    filteredPageviews.forEach(pv => {
      pageCount[pv.page] = (pageCount[pv.page] || 0) + 1;
    });
    const topPages = Object.entries(pageCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Referrer sources
    const referrerCount = {};
    filteredPageviews.forEach(pv => {
      if (pv.referrer && pv.referrer !== '') {
        const referrerDomain = new URL(pv.referrer).hostname || 'direct';
        referrerCount[referrerDomain] = (referrerCount[referrerDomain] || 0) + 1;
      } else {
        referrerCount['direct'] = (referrerCount['direct'] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }));

    // Device types (based on user agent)
    const deviceCount = { mobile: 0, tablet: 0, desktop: 0 };
    filteredPageviews.forEach(pv => {
      const ua = (pv.userAgent || '').toLowerCase();
      if (/mobile|android|iphone/.test(ua)) {
        deviceCount.mobile++;
      } else if (/tablet|ipad/.test(ua)) {
        deviceCount.tablet++;
      } else {
        deviceCount.desktop++;
      }
    });

    // Browser distribution
    const browserCount = {};
    filteredPageviews.forEach(pv => {
      const ua = (pv.userAgent || '').toLowerCase();
      let browser = 'Other';
      if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
      else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
      else if (ua.includes('firefox')) browser = 'Firefox';
      else if (ua.includes('edg')) browser = 'Edge';
      browserCount[browser] = (browserCount[browser] || 0) + 1;
    });

    // Daily pageviews for chart
    const dailyViews = {};
    filteredPageviews.forEach(pv => {
      const date = new Date(pv.timestamp).toISOString().split('T')[0];
      dailyViews[date] = (dailyViews[date] || 0) + 1;
    });
    const dailyViewsArray = Object.entries(dailyViews)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, views: count }));

    // Event statistics
    const eventStats = {};
    filteredEvents.forEach(e => {
      eventStats[e.eventName] = (eventStats[e.eventName] || 0) + 1;
    });
    const topEvents = Object.entries(eventStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }));

    console.log(`Analytics retrieved: ${totalPageviews} pageviews, ${uniqueVisitors} unique visitors`);

    return c.json({
      status: 'success',
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: now.toISOString()
      },
      summary: {
        totalPageviews,
        uniqueVisitors,
        totalSessions,
        avgPageviewsPerSession,
        totalEvents: filteredEvents.length
      },
      topPages,
      topReferrers,
      devices: Object.entries(deviceCount).map(([device, count]) => ({ device, count })),
      browsers: Object.entries(browserCount).map(([browser, count]) => ({ browser, count })),
      dailyViews: dailyViewsArray,
      topEvents,
      recentPageviews: filteredPageviews.slice(0, 50).map(pv => ({
        page: pv.page,
        referrer: pv.referrer,
        timestamp: pv.timestamp,
        userAgent: pv.userAgent
      }))
    });
  } catch (error) {
    console.error("Error retrieving analytics:", error);
    return c.json({ error: "Failed to retrieve analytics" }, 500);
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
    const galleries = await kv.getByPrefix("gallery_");
    const sorted = galleries.sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
    return c.json({ status: "success", galleries: sorted });
  } catch (error) {
    console.error("Error retrieving galleries:", error);
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
    await kv.set(id, gallery);

    console.log(`Created gallery: ${id}`);
    return c.json({ status: "success", gallery });
  } catch (error) {
    console.error("Error creating gallery:", error);
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

    const existing = await kv.get(id);
    if (!existing) return c.json({ error: "Gallery not found" }, 404);

    const updated = { ...existing, ...updates, id, updated_at: new Date().toISOString() };
    await kv.set(id, updated);

    console.log(`Updated gallery: ${id}`);
    return c.json({ status: "success", gallery: updated });
  } catch (error) {
    console.error("Error updating gallery:", error);
    return c.json({ error: "Failed to update gallery" }, 500);
  }
});

app.post("/make-server-feacf0d8/admin/galleries/delete", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    if (!id) return c.json({ error: "Gallery id is required" }, 400);

    await kv.del(id);
    console.log(`Deleted gallery: ${id}`);
    return c.json({ status: "success" });
  } catch (error) {
    console.error("Error deleting gallery:", error);
    return c.json({ error: "Failed to delete gallery" }, 500);
  }
});

// ============================================================================
// EMAIL SENDING ENDPOINTS
// ============================================================================

import {
  getBookingConfirmationTemplate,
  adminBookingNotification,
  adminContactNotification,
  adminCollaborationNotification,
  type BookingEmailData,
  type ContactEmailData,
  type CollaborationEmailData
} from "./email-templates.tsx";

// Send booking confirmation email
app.post("/make-server-feacf0d8/send-booking-confirmation", requireAdmin, rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { to, bookingDetails, amount, language, checkoutUrl } = body;

    // Check if email service is configured
    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
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
    const customerEmailResponse = await fetch('https://api.resend.com/emails', {
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
      const errorText = await customerEmailResponse.text();
      console.error('Failed to send customer confirmation email:', errorText);
      throw new Error('Customer email failed');
    }

    const customerResult = await customerEmailResponse.json();
    console.log(`Booking confirmation sent to ${to}: ${customerResult.id}`);

    // Send notification to admin
    const adminEmailHtml = adminBookingNotification(emailData);
    
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
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
      const errorText = await adminEmailResponse.text();
      console.error('Failed to send admin notification email:', errorText);
      // Don't throw - customer email succeeded
    } else {
      const adminResult = await adminEmailResponse.json();
      console.log(`Admin notification sent: ${adminResult.id}`);
    }

    return c.json({ 
      status: 'success', 
      message: 'Booking confirmation emails sent successfully',
      customerEmailId: customerResult.id
    });

  } catch (error) {
    console.error('Error sending booking confirmation emails:', error);
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

    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminContactNotification(contactData);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
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
      const errorText = await emailResponse.text();
      console.error('Failed to send contact notification:', errorText);
      throw new Error('Email send failed');
    }

    const result = await emailResponse.json();
    console.log(`Contact form notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error('Error sending contact notification:', error);
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

    const emailServiceApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    
    if (!emailServiceApiKey) {
      console.warn('EMAIL_SERVICE_API_KEY not configured - skipping admin notification');
      return c.json({ status: 'warning', message: 'Email service not configured' }, 200);
    }

    const adminEmailHtml = adminCollaborationNotification(collaborationData);
    
    const emailResponse = await fetch('https://api.resend.com/emails', {
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
      const errorText = await emailResponse.text();
      console.error('Failed to send collaboration notification:', errorText);
      throw new Error('Email send failed');
    }

    const result = await emailResponse.json();
    console.log(`Collaboration notification sent: ${result.id}`);

    return c.json({ 
      status: 'success', 
      message: 'Admin notification sent',
      emailId: result.id
    });

  } catch (error) {
    console.error('Error sending collaboration notification:', error);
    return c.json({ 
      error: 'Failed to send notification',
    }, 500);
  }
});

// ============================================================================

const port = Number(Deno.env.get("PORT"));
if (Number.isInteger(port) && port > 0 && port < 65536) {
  Deno.serve({ port }, app.fetch);
} else {
  Deno.serve(app.fetch);
}