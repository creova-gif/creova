// Pure checks shared by the edge function. No Deno or network calls, so
// node:test can exercise them without booting the function.

export const HST_RATE = 0.13;
export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 15;
export const MAX_ITEM_QUANTITY = 99;

export const TEXT_LIMITS = {
  name: 120,
  email: 254,
  phone: 40,
  service: 160,
  message: 5000,
  short: 200,
} as const;

export const TURNSTILE_HOSTS = new Set(["creova.one", "www.creova.one"]);

export const COMMERCE_GONE_STATUS = 410;

export const COMMERCE_GONE_BODY = {
  error: "This service is no longer available",
} as const;

/** Shop, checkout, tickets, memberships, subscriptions, and refunds. */
export const COMMERCE_ROUTES = [
  "/make-server-feacf0d8/create-ticket",
  "/make-server-feacf0d8/create-payment-intent",
  "/make-server-feacf0d8/stripe-webhook",
  "/make-server-feacf0d8/create-preorder",
  "/make-server-feacf0d8/purchase-digital-product",
  "/make-server-feacf0d8/purchase-event-ticket",
  "/make-server-feacf0d8/create-membership",
  "/make-server-feacf0d8/create-subscription-checkout",
  "/make-server-feacf0d8/payments",
  "/make-server-feacf0d8/create-refund",
  "/make-server-feacf0d8/refunds",
] as const;

export const DEFAULT_ALLOWED_ORIGINS = [
  "https://www.creova.one",
  "https://creova.one",
] as const;

// Shop + digital SKUs. Prices are CAD dollars and must match the pages.
// social-media-templates is $32 on DigitalProductsPage (the catalog used to say $42).
export const PRODUCT_CATALOG: Record<string, number> = {
  "graphic-tee-soft-power": 55,
  "graphic-tee-visibility": 55,
  "graphic-tee-resistance": 55,
  "graphic-tee-diaspora": 55,
  "graphic-tee-archive": 58,
  "graphic-tee-community": 55,
  "longsleeve-archive": 60,
  "longsleeve-heritage": 60,
  "oversized-hoodie-earth": 85,
  "crewneck-visibility": 78,
  "hoodie-soft-power": 85,
  "crewneck-archive": 78,
  "varsity-jacket-premium": 175,
  "windbreaker-light": 120,
  "bomber-jacket": 165,
  "cargo-pants-utility": 95,
  "jogger-pants-comfort": 85,
  "tracksuit-set-archive": 135,
  "tracksuit-set-heritage": 145,
  "bucket-hat-seen": 38,
  "dad-hat-logo": 32,
  "beanie-winter": 28,
  "canvas-tote-archive": 45,
  "fanny-pack-utility": 48,
  "crew-socks-archive": 18,
  "ankle-socks-essential": 15,
  "phone-case-leather": 35,
  "ipad-case-sleeve": 52,
  "laptop-sleeve-13": 65,
  "laptop-sleeve-15": 72,
  "keychain-metal": 22,
  "keychain-leather": 28,
  "brand-kit-template": 69,
  "social-media-templates": 32,
  "content-calendar": 28,
  "pricing-guide-template": 55,
  "lightroom-presets": 48,
  "video-intro-templates": 65,
  "client-onboarding-kit": 82,
  "brand-strategy-workbook": 35,
  "email-marketing-templates": 52,
};

// Cloudflare's published dummy secrets. The always-pass one would make
// siteverify succeed for every token, so it does not count as configured.
const DUMMY_TURNSTILE_SECRETS = new Set([
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
]);

// Exact CREOVA_ENV values only. Not trimmed and not case-folded, so
// " Dev " and "DEVELOPMENT" do not match.
const DEV_ENVIRONMENTS = new Set(["development", "dev", "local", "test"]);

export type ChargeResult =
  | { ok: true; totalCents: number }
  | { ok: false; error: string };

export type TurnstileGate =
  | { action: "verify" }
  | { action: "skip" }
  | { action: "reject"; status: 400 | 503; error: string };

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Text that may contain newlines. Tags are escaped before breaks are inserted. */
export function escapeHtmlMultiline(value: unknown): string {
  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");
}

/** Header-safe single line. Strips control characters so a name cannot inject extra headers. */
export function oneLine(value: unknown, max = 200): string {
  let out = "";
  for (const ch of String(value ?? "")) {
    const code = ch.codePointAt(0) ?? 0;
    out += code <= 31 || code === 127 ? " " : ch;
  }
  return out.replace(/ +/g, " ").trim().slice(0, max);
}

export function escapeHtmlAttr(value: unknown): string {
  return escapeHtml(oneLine(value, 500));
}

/**
 * HTTPS URL on creova.one only, already HTML-escaped for an href attribute.
 * Anything else (javascript:, other hosts, credentials in the URL) is dropped.
 */
export function safeCreovaUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "";
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return "";
  }
  if (url.protocol !== "https:") return "";
  if (url.username || url.password) return "";
  const host = url.hostname.toLowerCase();
  if (host !== "creova.one" && host !== "www.creova.one") return "";
  return escapeHtml(url.toString());
}

function normalizeOrigin(part: string): string | null {
  const stripped = part.trim().replace(/\/+$/, "");
  if (!stripped || stripped === "*") return null;
  if (!/^https?:\/\/[^\s/]+$/i.test(stripped)) return null;
  let url: URL;
  try {
    url = new URL(stripped);
  } catch {
    return null;
  }
  if (url.username || url.password || url.search || url.hash) return null;
  if (url.pathname !== "/" && url.pathname !== "") return null;
  return `${url.protocol}//${url.host}`.toLowerCase();
}

export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return [...DEFAULT_ALLOWED_ORIGINS];
  const parsed = raw
    .split(",")
    .map((part) => normalizeOrigin(part))
    .filter((part): part is string => part !== null);
  return parsed.length > 0 ? parsed : [...DEFAULT_ALLOWED_ORIGINS];
}

export function isUsableTurnstileSecret(secret: string | undefined): boolean {
  const trimmed = secret?.trim() ?? "";
  return trimmed.length > 0 && !DUMMY_TURNSTILE_SECRETS.has(trimmed);
}

/**
 * Skip captcha only for an explicit local CREOVA_ENV.
 * ENVIRONMENT is not consulted. Hosted *.supabase.co never skips, so setting
 * CREOVA_ENV on the deployed function does not turn verification off.
 */
export function captchaDevSkip(
  creovaEnv: string | undefined,
  supabaseUrl: string | undefined,
): boolean {
  if (!creovaEnv || !DEV_ENVIRONMENTS.has(creovaEnv)) return false;
  if ((supabaseUrl ?? "").toLowerCase().includes(".supabase.co")) return false;
  return true;
}

/**
 * Fail closed when the secret is missing or is Cloudflare's dummy secret,
 * unless captchaDevSkip allows a local skip.
 */
export function turnstileGate(input: {
  secretConfigured: boolean;
  creovaEnv: string | undefined;
  supabaseUrl?: string | undefined;
  token: unknown;
}): TurnstileGate {
  if (!input.secretConfigured) {
    if (captchaDevSkip(input.creovaEnv, input.supabaseUrl)) return { action: "skip" };
    return {
      action: "reject",
      status: 503,
      error: "Security verification is not configured",
    };
  }
  if (typeof input.token !== "string" || input.token.trim().length === 0) {
    return { action: "reject", status: 400, error: "Security verification required" };
  }
  return { action: "verify" };
}

/**
 * siteverify must succeed for this widget action on creova.one.
 * A bare `{ success: true }` (dummy secret, or a token minted elsewhere) is not enough.
 */
export function turnstileVerificationOk(data: unknown, expectedAction: string): boolean {
  if (!data || typeof data !== "object") return false;
  const body = data as { success?: unknown; hostname?: unknown; action?: unknown };
  if (body.success !== true) return false;
  if (typeof body.hostname !== "string") return false;
  if (!TURNSTILE_HOSTS.has(body.hostname.toLowerCase())) return false;
  if (typeof expectedAction !== "string" || expectedAction.length === 0) return false;
  if (body.action !== expectedAction) return false;
  return true;
}

function isIpv4(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d{1,3}$/.test(part)) return false;
    if (part.length > 1 && part.startsWith("0")) return false;
    const n = Number(part);
    return n >= 0 && n <= 255;
  });
}

function isIpv6(value: string): boolean {
  if (!value.includes(":") || value.length > 45) return false;
  if (!/^[0-9a-f:]+$/i.test(value)) return false;
  return value.split("::").length <= 2;
}

function singleIp(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.includes(",")) return null;
  const withPort = trimmed.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  const candidate = withPort ? withPort[1] : trimmed;
  if (isIpv4(candidate)) return candidate;
  if (isIpv6(candidate)) return candidate.toLowerCase();
  return null;
}

/**
 * Address to rate-limit on.
 *
 * Cloudflare, in front of *.supabase.co, appends the connecting IP to
 * X-Forwarded-For and overwrites CF-Connecting-IP. Supabase's own function
 * examples read the leftmost XFF hop, which is the attacker-controlled prefix
 * when a proxy appends. The rightmost valid hop is the nearest proxy's
 * observation. CF-Connecting-IP is preferred when it is a single IP because
 * that is the visitor address Cloudflare sets. A raw header string is never
 * the key.
 *
 * Without those platform headers (local `deno serve`), the only hop is
 * whoever wrote the header. Missing addresses share `unknown`.
 */
export function rateLimitClientIp(input: {
  forwardedFor?: string | null;
  connectingIp?: string | null;
}): string {
  const connecting = singleIp(input.connectingIp);
  if (connecting) return connecting;
  const hops = String(input.forwardedFor ?? "")
    .split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  for (let i = hops.length - 1; i >= 0; i--) {
    const ip = singleIp(hops[i]);
    if (ip) return ip;
  }
  return "unknown";
}

export function requiredText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

export function optionalText(
  value: unknown,
  max: number,
): { ok: true; value?: string } | { ok: false } {
  if (value === undefined || value === null || value === "") return { ok: true };
  if (typeof value !== "string") return { ok: false };
  const trimmed = value.trim();
  if (!trimmed) return { ok: true };
  if (trimmed.length > max) return { ok: false };
  return { ok: true, value: trimmed };
}

/** Customer receipts. No submitter text: the address is chosen by the sender. */
export function contactReceivedHtml(): string {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#121212"><h2 style="color:#D4A843">Thanks for reaching out</h2><p>We've received your message and will get back to you within 1–2 business days.</p><p style="color:#777777;font-size:14px">In the meantime, follow us on Instagram <a href="https://www.instagram.com/creativeinnovation__" style="color:#D4A843">@creativeinnovation__</a></p><p>— The CREOVA Team</p></div>`;
}

export function bookingReceivedHtml(): string {
  return `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#121212"><h2 style="color:#D4A843">We received your booking request</h2><p>Thanks for contacting CREOVA. We'll reply to this email address within 1–2 business days.</p><p>— The CREOVA Team</p></div>`;
}

export function parseEmailAddress(value: unknown): string | null {
  const email = requiredText(value, TEXT_LIMITS.email);
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (/[<>"'(),;:\\]/.test(email)) return null;
  return email;
}

export type RateBucket = { count: number; resetTime: number };

/**
 * In-memory bucket step. Not an atomic store and not shared across isolates.
 * The edge function keeps one Map per isolate and calls this.
 */
export function consumeRateLimit(
  buckets: Map<string, RateBucket>,
  key: string,
  now: number,
  maxRequests: number,
  windowMs: number,
): boolean {
  const record = buckets.get(key);
  if (record && now < record.resetTime) {
    if (record.count >= maxRequests) return false;
    record.count += 1;
    return true;
  }
  buckets.set(key, { count: 1, resetTime: now + windowMs });
  return true;
}

export function catalogUnitCents(
  productId: unknown,
  catalog: Readonly<Record<string, number>> = PRODUCT_CATALOG,
): number | null {
  if (typeof productId !== "string") return null;
  const dollars = catalog[productId];
  if (typeof dollars !== "number" || !Number.isFinite(dollars) || dollars <= 0) return null;
  return Math.round(dollars * 100);
}

/**
 * Recompute a cart from the catalog. Client `price` fields are ignored.
 * A single unrecognized id rejects the whole cart — there is no client-amount fallback.
 */
export function computeTrustedCartTotalCents(
  items: unknown,
  catalog: Readonly<Record<string, number>> = PRODUCT_CATALOG,
): ChargeResult {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, error: "Order must contain catalog items" };
  }

  let subtotal = 0;
  for (const item of items) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "Unrecognized item in order" };
    }
    const record = item as { id?: unknown; quantity?: unknown };
    const unit = catalogUnitCents(record.id, catalog);
    if (unit === null) {
      return { ok: false, error: "Unrecognized item in order" };
    }
    const quantity = record.quantity === undefined ? 1 : record.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_ITEM_QUANTITY
    ) {
      return { ok: false, error: "Invalid item quantity" };
    }
    subtotal += (unit / 100) * quantity;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const totalCents = Math.round((subtotal + subtotal * HST_RATE + shipping) * 100);
  if (!Number.isFinite(totalCents) || totalCents <= 0) {
    return { ok: false, error: "Invalid order total" };
  }
  return { ok: true, totalCents };
}

/**
 * The amount charged is always the catalog total. A client-supplied amount
 * is accepted only as a confirmation that it matches; any other value is rejected.
 */
export function resolveChargeCents(
  clientAmount: unknown,
  items: unknown,
  catalog: Readonly<Record<string, number>> = PRODUCT_CATALOG,
): ChargeResult {
  const priced = computeTrustedCartTotalCents(items, catalog);
  if (!priced.ok) return priced;
  if (clientAmount !== undefined && clientAmount !== null) {
    if (typeof clientAmount !== "number" || !Number.isFinite(clientAmount)) {
      return { ok: false, error: "Invalid amount" };
    }
    if (Math.abs(priced.totalCents - Math.round(clientAmount)) > 1) {
      return { ok: false, error: "Order total does not match the current prices" };
    }
  }
  return { ok: true, totalCents: priced.totalCents };
}
