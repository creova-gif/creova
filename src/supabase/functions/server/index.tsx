import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import {
  catalogUnitCents,
  escapeHtml,
  isUsableTurnstileSecret,
  oneLine,
  parseAllowedOrigins,
  resolveChargeCents,
  turnstileGate,
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

// Security: Rate limiting map (in-memory, simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Security: Rate limiting middleware
const rateLimit = (maxRequests: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${c.req.path}`;
    
    const record = rateLimitMap.get(key);
    
    if (record && now < record.resetTime) {
      if (record.count >= maxRequests) {
        console.log(`Rate limit exceeded for ${ip} on ${c.req.path}`);
        return c.json({ error: 'Too many requests. Please try again later.' }, 429);
      }
      record.count++;
    } else {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }
    
    // Clean up old entries
    if (rateLimitMap.size > 10000) {
      for (const [k, v] of rateLimitMap.entries()) {
        if (now > v.resetTime) rateLimitMap.delete(k);
      }
    }
    
    await next();
  };
};

// Turnstile: verify the token with the secret. Missing secret fails closed
// unless CREOVA_ENV / ENVIRONMENT is an explicit local/dev value.
async function requireTurnstile(token: unknown): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const rawSecret = Deno.env.get("TURNSTILE_SECRET_KEY") ?? "";
  const environment = Deno.env.get("CREOVA_ENV") || Deno.env.get("ENVIRONMENT") || "";
  const gate = turnstileGate({
    secretConfigured: isUsableTurnstileSecret(rawSecret),
    environment,
    token,
  });
  if (gate.action === "reject") {
    console.error(gate.error);
    return { ok: false, status: gate.status, error: gate.error };
  }
  if (gate.action === "skip") return { ok: true };

  const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: rawSecret.trim(),
      response: String(token),
    }),
  });
  const verifyData = await verifyResponse.json().catch(() => ({ success: false }));
  if (!verifyData.success) {
    console.log("Turnstile verification failed:", verifyData);
    return { ok: false, status: 400, error: "Security verification failed. Please try again." };
  }
  return { ok: true };
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

async function hmacSha256Hex(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
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

// ---------------------------------------------------------------------------
// Security: Stripe webhook signature verification
//
// The handler used to JSON.parse the request body directly with a comment
// admitting the signature was never checked. That meant anyone who knew (or
// guessed) a real payment_intent_id — trivially obtainable by calling
// create-payment-intent themselves — could POST a forged
// "payment_intent.succeeded" event and flip any order to completed with no
// money ever moving. This implements Stripe's documented signature scheme
// (https://stripe.com/docs/webhooks#verify-manually) by hand, using Web
// Crypto, so it works in Deno without pulling in the full Stripe SDK.
// ---------------------------------------------------------------------------
async function verifyStripeWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined | null,
  secret: string,
  toleranceSeconds = 300
): Promise<boolean> {
  if (!signatureHeader) return false;
  const parts = signatureHeader.split(",").reduce((acc: Record<string, string>, part) => {
    const [k, v] = part.split("=");
    if (k && v) acc[k] = v;
    return acc;
  }, {});
  const timestamp = parts["t"];
  const expectedSigHex = parts["v1"];
  if (!timestamp || !expectedSigHex) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > toleranceSeconds) return false;

  const actualSigHex = await hmacSha256Hex(`${timestamp}.${rawBody}`, secret);
  return timingSafeEqual(actualSigHex, expectedSigHex);
}

// ---------------------------------------------------------------------------
// Security: server-side payment confirmation
//
// purchase-digital-product, create-membership, and purchase-event-ticket used
// to take a client-asserted payment_intent_id and unconditionally issue a
// real download token / member number / ticket code — no check that any
// money had actually moved. This confirms the Payment Intent actually
// succeeded (and, where a trusted price is known, that the right amount was
// charged) before any of those routes grant anything.
// ---------------------------------------------------------------------------
async function verifyStripePaymentSucceeded(
  paymentIntentId: unknown,
  expectedAmountCents?: number
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!paymentIntentId || typeof paymentIntentId !== "string") {
    return { ok: false, error: "Missing payment_intent_id" };
  }
  const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecretKey) {
    console.error("STRIPE_SECRET_KEY not configured");
    return { ok: false, error: "Payment configuration error" };
  }
  const resp = await fetch(
    `https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntentId)}`,
    { headers: { Authorization: `Bearer ${stripeSecretKey}` } }
  );
  if (!resp.ok) {
    return { ok: false, error: "Unable to verify payment with Stripe" };
  }
  const intent = await resp.json();
  if (intent.status !== "succeeded") {
    return { ok: false, error: `Payment has not succeeded (status: ${intent.status})` };
  }
  if (typeof expectedAmountCents === "number" && intent.amount !== expectedAmountCents) {
    return { ok: false, error: "Payment amount does not match the expected price" };
  }
  return { ok: true };
}

// Single source of truth for membership pricing — both create-membership and
// create-subscription-checkout key off this instead of each hardcoding their
// own copy (they used to disagree in structure, which is exactly how price
// drift between two "sources of truth" happens).
const MEMBERSHIP_PRICING: Record<string, { price: number; name: string }> = {
  creator: { price: 19900, name: "CREOVA Creator Membership" }, // $199 CAD in cents
  legacy: { price: 49900, name: "CREOVA Legacy Membership" }, // $499 CAD in cents
};

// Cart prices live in ./guards.ts (PRODUCT_CATALOG). create-payment-intent
// charges that total only. Unrecognized items are rejected — client `amount`
// and client `price` are never forwarded to Stripe.

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

// Create booking for services
app.post("/make-server-feacf0d8/create-booking", async (c) => {
  try {
    const body = await c.req.json();
    const { service, customer_info, booking_details, amount, currency = 'cad' } = body;

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(bookingId, {
      service,
      customer_info,
      booking_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created booking: ${bookingId}`);

    return c.json({
      bookingId,
      status: 'success',
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return c.json({ error: "Failed to create booking: " + error.message }, 500);
  }
});

// Create equipment rental
app.post("/make-server-feacf0d8/create-rental", async (c) => {
  try {
    const body = await c.req.json();
    const { equipment, customer_info, rental_details, amount, currency = 'cad' } = body;

    const rentalId = `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(rentalId, {
      equipment,
      customer_info,
      rental_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created rental: ${rentalId}`);

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental created successfully'
    });
  } catch (error) {
    console.error("Error creating rental:", error);
    return c.json({ error: "Failed to create rental: " + error.message }, 500);
  }
});

// Create event ticket purchase
app.post("/make-server-feacf0d8/create-ticket", async (c) => {
  try {
    const body = await c.req.json();
    const { event_id, customer_info, ticket_details, amount, currency = 'cad' } = body;

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(ticketId, {
      event_id,
      customer_info,
      ticket_details,
      amount,
      currency,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created ticket: ${ticketId}`);

    return c.json({
      ticketId,
      status: 'success',
      message: 'Ticket purchased successfully'
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return c.json({ error: "Failed to create ticket: " + error.message }, 500);
  }
});

// Create Payment Intent endpoint
app.post("/make-server-feacf0d8/create-payment-intent", rateLimit(10, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { amount, customer_info, items } = body;

    // Charge the catalog total. Client `amount` and per-item `price` are not
    // used. Anything the catalog cannot price is rejected.
    const priced = resolveChargeCents(amount, items);
    if (!priced.ok) {
      console.warn(`Rejected payment intent: ${priced.error}`);
      return c.json({ error: priced.error }, 400);
    }
    const chargeCents = priced.totalCents;
    const customer = customer_info && typeof customer_info === "object" ? customer_info : {};
    const customerName = typeof customer.name === "string" ? oneLine(customer.name) : "";
    const customerEmail = typeof customer.email === "string" ? oneLine(customer.email) : "";
    if (!customerName || !customerEmail) {
      return c.json({ error: "Customer name and email are required" }, 400);
    }

    // Get Stripe secret key from environment
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return c.json({ error: "Payment configuration error" }, 500);
    }

    // Create payment intent with Stripe
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        amount: String(chargeCents),
        currency: "cad",
        "automatic_payment_methods[enabled]": "true",
        "metadata[customer_name]": customerName,
        "metadata[customer_email]": customerEmail,
        "metadata[order_items]": JSON.stringify(
          Array.isArray(items)
            ? items.map((item: { id?: unknown; quantity?: unknown }) => ({
                id: typeof item?.id === "string" ? item.id : "",
                quantity: typeof item?.quantity === "number" ? item.quantity : 1,
              }))
            : []
        ),
      }),
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", paymentIntent);
      return c.json({ error: "Failed to create payment intent" }, 500);
    }

    // Store order in key-value store
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(orderId, {
      payment_intent_id: paymentIntent.id,
      amount: chargeCents,
      currency: "cad",
      customer_info,
      items: Array.isArray(items)
        ? items.map((item: { id?: unknown; quantity?: unknown }) => ({
            id: typeof item?.id === "string" ? item.id : "",
            quantity: typeof item?.quantity === "number" ? item.quantity : 1,
            unitPriceCents: typeof item?.id === "string" ? catalogUnitCents(item.id) : null,
          }))
        : [],
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created payment intent: ${paymentIntent.id} for order: ${orderId}`);

    return c.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
});

// Webhook endpoint for Stripe events (optional but recommended)
app.post("/make-server-feacf0d8/stripe-webhook", async (c) => {
  try {
    const signature = c.req.header("stripe-signature");
    const body = await c.req.text();
    
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return c.json({ error: "Webhook not configured" }, 500);
    }

    // Verify webhook signature — reject anything that isn't genuinely from Stripe.
    const signatureValid = await verifyStripeWebhookSignature(body, signature, webhookSecret);
    if (!signatureValid) {
      console.error("Rejected webhook: invalid or missing Stripe signature");
      return c.json({ error: "Invalid signature" }, 400);
    }
    const event = JSON.parse(body);

    console.log("Received Stripe webhook:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        
        // Update order status
        const orders = await kv.getByPrefix("order_");
        for (const order of orders) {
          if (order.payment_intent_id === paymentIntent.id) {
            await kv.set(order.key, {
              ...order,
              status: 'completed',
              completed_at: new Date().toISOString()
            });
            console.log(`Updated order ${order.key} to completed`);
          }
        }
        break;

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object;
        console.log(`Payment failed: ${failedPayment.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ error: "Webhook processing error" }, 400);
  }
});

// Email notification signup (for product launches, memberships, etc.)
app.post("/make-server-feacf0d8/notify-me", async (c) => {
  try {
    const body = await c.req.json();
    const { email, type, item_id } = body; // type: 'membership', 'product', 'event', etc.

    if (!email || !type) {
      return c.json({ error: "Email and type are required" }, 400);
    }

    const notificationId = `notification_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(notificationId, {
      email,
      type,
      item_id,
      status: 'subscribed',
      created_at: new Date().toISOString()
    });

    console.log(`Email notification signup: ${email} for ${type}`);

    return c.json({
      status: 'success',
      message: 'Successfully subscribed to notifications'
    });
  } catch (error) {
    console.error("Error saving notification signup:", error);
    return c.json({ error: "Failed to subscribe: " + error.message }, 500);
  }
});

// Create pre-order
app.post("/make-server-feacf0d8/create-preorder", async (c) => {
  try {
    const body = await c.req.json();
    const { product_id, customer_info, quantity, total_amount } = body;

    const preorderId = `preorder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(preorderId, {
      product_id,
      customer_info,
      quantity,
      total_amount,
      status: 'pending_payment',
      created_at: new Date().toISOString()
    });

    console.log(`Created pre-order: ${preorderId}`);

    return c.json({
      preorderId,
      status: 'success',
      message: 'Pre-order created successfully'
    });
  } catch (error) {
    console.error("Error creating pre-order:", error);
    return c.json({ error: "Failed to create pre-order: " + error.message }, 500);
  }
});

// Purchase digital product
app.post("/make-server-feacf0d8/purchase-digital-product", async (c) => {
  try {
    const body = await c.req.json();
    const { product_id, customer_info, amount, payment_intent_id } = body;

    // The download token requires a succeeded PaymentIntent for this SKU's
    // catalog unit price in cents. Checkout charges tax and shipping on top,
    // so a cart PaymentIntent will not satisfy this route — that is intentional.
    const expectedCents = catalogUnitCents(product_id);
    if (expectedCents === null) {
      return c.json({ error: "Unknown product" }, 400);
    }
    const paymentCheck = await verifyStripePaymentSucceeded(payment_intent_id, expectedCents);
    if (!paymentCheck.ok) {
      return c.json({ error: paymentCheck.error }, 402);
    }

    const purchaseId = `digital_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const downloadToken = `token_${Math.random().toString(36).substr(2, 16)}`;

    await kv.set(purchaseId, {
      product_id,
      customer_info,
      amount,
      payment_intent_id,
      status: 'completed',
      download_token: downloadToken,
      created_at: new Date().toISOString()
    });

    console.log(`Digital product purchased: ${purchaseId}`);

    return c.json({
      purchaseId,
      download_token: downloadToken,
      status: 'success',
      message: 'Digital product purchased successfully'
    });
  } catch (error) {
    console.error("Error purchasing digital product:", error);
    return c.json({ error: "Failed to purchase digital product: " + error.message }, 500);
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
    return c.json({ error: "Failed to subscribe: " + error.message }, 500);
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
    return c.json({ error: "Failed to subscribe: " + error.message }, 500);
  }
});

// Purchase event ticket with payment
app.post("/make-server-feacf0d8/purchase-event-ticket", async (c) => {
  try {
    const body = await c.req.json();
    const { event_id, customer_info, quantity, total_amount, payment_intent_id } = body;

    // No trusted per-event price catalog exists yet, so — same as digital
    // products — we can confirm the payment succeeded but not that the
    // amount was correct for this event/quantity.
    const paymentCheck = await verifyStripePaymentSucceeded(payment_intent_id);
    if (!paymentCheck.ok) {
      return c.json({ error: paymentCheck.error }, 402);
    }

    const ticketId = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ticketCode = `CREOVA-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

    await kv.set(ticketId, {
      event_id,
      customer_info,
      quantity,
      total_amount,
      payment_intent_id,
      status: 'confirmed',
      ticket_code: ticketCode,
      created_at: new Date().toISOString()
    });

    console.log(`Event ticket purchased: ${ticketId}`);

    return c.json({
      ticketId,
      ticket_code: ticketCode,
      status: 'success',
      message: 'Event ticket purchased successfully'
    });
  } catch (error) {
    console.error("Error purchasing event ticket:", error);
    return c.json({ error: "Failed to purchase event ticket: " + error.message }, 500);
  }
});

// Create membership subscription
app.post("/make-server-feacf0d8/create-membership", async (c) => {
  try {
    const body = await c.req.json();
    const { membership_type, customer_info, payment_intent_id } = body; // 'creator' or 'legacy'

    const tier = MEMBERSHIP_PRICING[membership_type];
    if (!tier) {
      return c.json({ error: "Invalid membership type" }, 400);
    }

    // Confirm the payment actually succeeded AND paid the real price for
    // this tier — unlike digital products/tickets, membership pricing is
    // a known, trusted catalog, so we can check the amount too.
    const paymentCheck = await verifyStripePaymentSucceeded(payment_intent_id, tier.price);
    if (!paymentCheck.ok) {
      return c.json({ error: paymentCheck.error }, 402);
    }

    const membershipId = `membership_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const memberNumber = `CM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    await kv.set(membershipId, {
      membership_type,
      customer_info,
      payment_intent_id,
      status: 'active',
      member_number: memberNumber,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
    });

    console.log(`Membership created: ${membershipId}`);

    return c.json({
      membershipId,
      member_number: memberNumber,
      status: 'success',
      message: 'Membership created successfully'
    });
  } catch (error) {
    console.error("Error creating membership:", error);
    return c.json({ error: "Failed to create membership: " + error.message }, 500);
  }
});

// Create Stripe Subscription Checkout Session for Memberships
app.post("/make-server-feacf0d8/create-subscription-checkout", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { membership_type, customer_email, customer_name } = body; // 'creator' or 'legacy'

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return c.json({ error: "Payment configuration error" }, 500);
    }

    const membership = MEMBERSHIP_PRICING[membership_type];

    if (!membership) {
      return c.json({ error: "Invalid membership type" }, 400);
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams({
      'payment_method_types[0]': 'card',
      'mode': 'subscription',
      'customer_email': customer_email,
      'success_url': `${c.req.header('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&membership=${membership_type}`,
      'cancel_url': `${c.req.header('origin')}/memberships`,
      'line_items[0][price_data][currency]': 'cad',
      'line_items[0][price_data][product_data][name]': membership.name,
      'line_items[0][price_data][product_data][description]': `Annual ${membership_type === 'creator' ? 'Creator' : 'Legacy'} membership with exclusive benefits`,
      'line_items[0][price_data][unit_amount]': membership.price.toString(),
      'line_items[0][price_data][recurring][interval]': 'year',
      'line_items[0][quantity]': '1',
      'metadata[membership_type]': membership_type,
      'metadata[customer_name]': customer_name,
      'subscription_data[metadata][membership_type]': membership_type,
      'subscription_data[metadata][customer_name]': customer_name
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString()
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", session);
      return c.json({ error: "Failed to create checkout session", details: session }, 500);
    }

    // Store pending membership signup
    const signupId = `membership_signup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(signupId, {
      membership_type,
      customer_email,
      customer_name,
      session_id: session.id,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    console.log(`Created subscription checkout session: ${session.id} for ${membership_type} membership`);

    return c.json({
      sessionId: session.id,
      url: session.url,
      status: 'success'
    });
  } catch (error) {
    console.error("Error creating subscription checkout:", error);
    return c.json({ error: "Internal server error: " + error.message }, 500);
  }
});

// Submit contact form
app.post("/make-server-feacf0d8/submit-contact", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, service, message, budget, timeline, captchaToken } = body;

    if (!name || !email || !message) {
      return c.json({ error: "Name, email, and message are required" }, 400);
    }

    const captcha = await requireTurnstile(captchaToken);
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(contactId, {
      name,
      email,
      phone,
      service,
      message,
      budget,
      timeline,
      status: 'new',
      type: 'contact',
      created_at: new Date().toISOString()
    });

    console.log(`Contact form submitted: ${contactId} from ${email}`);

    syncToAirtable("tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Phone: phone, Message: message,
      Service: service, Budget: budget, Timeline: timeline,
      Type: "contact", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": contactId,
    });

    // Fire-and-forget confirmation emails
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    if (emailApiKey) {
      const contactEmailData: ContactEmailData = { name, email, phone, service, message, budget, timeline };
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
                html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#121212"><h2 style="color:#D4A843">Thanks for reaching out, ${escapeHtml(name)}!</h2><p>We've received your message and will get back to you within 1–2 business days.</p><p style="color:#777777;font-size:14px">In the meantime, follow us on Instagram <a href="https://www.instagram.com/creativeinnovation__" style="color:#D4A843">@creativeinnovation__</a></p><p>— The CREOVA Team</p></div>`
              })
            }),
            fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: 'CREOVA <support@creova.one>',
                to: ['support@creova.one'],
                subject: `📧 New Contact: ${oneLine(service || 'General Inquiry')} — ${oneLine(name)}`,
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
    return c.json({ error: "Failed to submit contact form: " + error.message }, 500);
  }
});

// Submit collaboration form
app.post("/make-server-feacf0d8/submit-collaboration", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, organization, collaborationType, projectDescription, timeline, budget, captchaToken } = body;

    if (!name || !email || !projectDescription) {
      return c.json({ error: "Name, email, and project description are required" }, 400);
    }

    const captcha = await requireTurnstile(captchaToken);
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const collaborationId = `collaboration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(collaborationId, {
      name,
      email,
      organization,
      collaborationType,
      projectDescription,
      timeline,
      budget,
      status: 'new',
      type: 'collaboration',
      created_at: new Date().toISOString()
    });

    console.log(`Collaboration form submitted: ${collaborationId} from ${email}`);

    syncToAirtable("tblgMShO3Sa6ynJyb", {
      Name: name, Email: email, Message: projectDescription,
      Service: collaborationType, Budget: budget, Timeline: timeline,
      Type: "collaboration", "Submitted At": new Date().toISOString(),
      "Supabase Record ID": collaborationId,
    });

    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    if (emailApiKey) {
      const collaborationEmailData: CollaborationEmailData = {
        name, email, organization, collaborationType, projectDescription, timeline, budget,
      };
      (async () => {
        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${emailApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'CREOVA <support@creova.one>',
              to: ['support@creova.one'],
              subject: `🤝 New Collaboration Request: ${oneLine(organization || name)}`,
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
    return c.json({ error: "Failed to submit collaboration form: " + error.message }, 500);
  }
});

// Submit booking form
app.post("/make-server-feacf0d8/submit-booking", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { 
      service, 
      package: packageName, 
      name, 
      email, 
      phone, 
      preferredDate, 
      preferredTime, 
      location,
      numberOfPeople,
      specialRequests,
      budget,
      hearAboutUs,
      submittedAt,
      captchaToken
    } = body;

    if (!service || !name || !email || !phone) {
      return c.json({ error: "Service, name, email, and phone are required" }, 400);
    }

    const captcha = await requireTurnstile(captchaToken);
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(bookingId, {
      service,
      package: packageName,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      location,
      numberOfPeople,
      specialRequests,
      budget,
      hearAboutUs,
      status: 'pending',
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Booking submitted: ${bookingId} by ${name} (${email}) for ${service}`);

    // Fire-and-forget confirmation emails
    const emailApiKey = Deno.env.get('EMAIL_SERVICE_API_KEY');
    if (emailApiKey) {
      const emailData: BookingEmailData = {
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        service,
        package: packageName || 'Standard',
        preferredDate: preferredDate || '',
        preferredTime: preferredTime || '',
        location: location || '',
        numberOfPeople,
        specialRequests,
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
                html: getBookingConfirmationTemplate('en', emailData)
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
    return c.json({ error: "Failed to submit booking: " + error.message }, 500);
  }
});

// Submit rental form
app.post("/make-server-feacf0d8/submit-rental", rateLimit(5, 60000), async (c) => {
  try {
    const body = await c.req.json();
    const { 
      equipment,
      name, 
      email, 
      phone, 
      startDate,
      endDate,
      rentalDays,
      dailyRate,
      totalCost,
      depositAmount,
      pickupLocation,
      purpose,
      specialRequests,
      hasInsurance,
      submittedAt,
      captchaToken
    } = body;

    if (!equipment || equipment.length === 0 || !name || !email || !phone || !startDate || !endDate) {
      return c.json({ error: "Equipment, name, email, phone, and rental dates are required" }, 400);
    }

    const captcha = await requireTurnstile(captchaToken);
    if (!captcha.ok) {
      return c.json({ error: captcha.error }, captcha.status);
    }

    const rentalId = `rental_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await kv.set(rentalId, {
      equipment,
      name,
      email,
      phone,
      startDate,
      endDate,
      rentalDays,
      dailyRate,
      totalCost,
      depositAmount,
      pickupLocation,
      purpose,
      specialRequests,
      hasInsurance,
      status: 'pending',
      submitted_at: submittedAt || new Date().toISOString(),
      created_at: new Date().toISOString()
    });

    console.log(`Rental submitted: ${rentalId} by ${name} (${email}) for equipment: ${equipment.join(', ')}`);

    return c.json({
      rentalId,
      status: 'success',
      message: 'Rental request submitted successfully'
    });
  } catch (error) {
    console.error("Error submitting rental:", error);
    return c.json({ error: "Failed to submit rental: " + error.message }, 500);
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
    return c.json({ error: "Failed to retrieve submissions: " + error.message }, 500);
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
    return c.json({ error: "Failed to update submission status: " + error.message }, 500);
  }
});

// Track page view
app.post("/make-server-feacf0d8/track-pageview", async (c) => {
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
    return c.json({ error: "Failed to track pageview: " + error.message }, 500);
  }
});

// Track event (button clicks, form submissions, etc.)
app.post("/make-server-feacf0d8/track-event", async (c) => {
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
    return c.json({ error: "Failed to track event: " + error.message }, 500);
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
    return c.json({ error: "Failed to retrieve analytics: " + error.message }, 500);
  }
});

// Get all payments for refund management
app.get("/make-server-feacf0d8/payments", requireAdmin, async (c) => {
  try {
    const payments = await kv.getByPrefix("payment_");
    
    // Sort by date (newest first)
    const sortedPayments = payments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log(`Retrieved ${payments.length} payments`);

    return c.json({
      status: 'success',
      payments: sortedPayments
    });
  } catch (error) {
    console.error("Error retrieving payments:", error);
    return c.json({ error: "Failed to retrieve payments: " + error.message }, 500);
  }
});

// Create refund
app.post("/make-server-feacf0d8/create-refund", requireAdmin, async (c) => {
  try {
    const body = await c.req.json();
    const { paymentIntentId, amount, reason } = body;

    if (!paymentIntentId) {
      return c.json({ error: "Payment Intent ID is required" }, 400);
    }

    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not found");
      return c.json({ error: "Stripe not configured" }, 500);
    }

    // Create refund with Stripe
    const refundData: any = {
      payment_intent: paymentIntentId,
      reason: reason || 'requested_by_customer'
    };

    // If partial refund, add amount
    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to cents
    }

    const refundResponse = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(refundData).toString()
    });

    const refund = await refundResponse.json();

    if (!refundResponse.ok) {
      console.error("Stripe refund error:", refund);
      return c.json({ 
        error: refund.error?.message || "Failed to create refund",
        details: refund 
      }, 400);
    }

    // Store refund record
    const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await kv.set(refundId, {
      refundId,
      stripeRefundId: refund.id,
      paymentIntentId,
      amount: refund.amount / 100, // Convert from cents
      currency: refund.currency,
      reason: reason || 'requested_by_customer',
      status: refund.status,
      created_at: new Date().toISOString(),
      stripe_data: refund
    });

    // Update payment record with refund status
    const payments = await kv.getByPrefix("payment_");
    const payment = payments.find(p => p.stripe_payment_intent_id === paymentIntentId);
    
    if (payment) {
      await kv.set(payment.paymentId, {
        ...payment,
        refund_status: refund.status,
        refund_id: refund.id,
        refund_amount: refund.amount / 100,
        refunded_at: new Date().toISOString()
      });
    }

    console.log(`Refund created: ${refund.id} for payment ${paymentIntentId}`);

    return c.json({
      status: 'success',
      message: 'Refund created successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status
      }
    });
  } catch (error) {
    console.error("Error creating refund:", error);
    return c.json({ error: "Failed to create refund: " + error.message }, 500);
  }
});

// Get refund history
app.get("/make-server-feacf0d8/refunds", requireAdmin, async (c) => {
  try {
    const refunds = await kv.getByPrefix("refund_");
    
    // Sort by date (newest first)
    const sortedRefunds = refunds.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    console.log(`Retrieved ${refunds.length} refunds`);

    return c.json({
      status: 'success',
      refunds: sortedRefunds
    });
  } catch (error) {
    console.error("Error retrieving refunds:", error);
    return c.json({ error: "Failed to retrieve refunds: " + error.message }, 500);
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
    return c.json({ error: "Failed to retrieve galleries: " + error.message }, 500);
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
    return c.json({ error: "Failed to create gallery: " + error.message }, 500);
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
    return c.json({ error: "Failed to update gallery: " + error.message }, 500);
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
    return c.json({ error: "Failed to delete gallery: " + error.message }, 500);
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
app.post("/make-server-feacf0d8/send-booking-confirmation", rateLimit(5, 60000), requireAdmin, async (c) => {
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
        to: [to],
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
        reply_to: to
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
      details: error.message 
    }, 500);
  }
});

// Send contact form notification email (admin only)
app.post("/make-server-feacf0d8/send-contact-notification", rateLimit(5, 60000), requireAdmin, async (c) => {
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
        subject: `📧 New Contact: ${oneLine(contactData.service || 'General Inquiry')} - ${oneLine(contactData.name)}`,
        html: adminEmailHtml,
        reply_to: contactData.email
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
      details: error.message 
    }, 500);
  }
});

// Send collaboration form notification email (admin only)
app.post("/make-server-feacf0d8/send-collaboration-notification", rateLimit(5, 60000), requireAdmin, async (c) => {
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
        subject: `🤝 New Collaboration Request: ${oneLine(collaborationData.organization || collaborationData.name)}`,
        html: adminEmailHtml,
        reply_to: collaborationData.email
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
      details: error.message 
    }, 500);
  }
});

// ============================================================================

Deno.serve(app.fetch);