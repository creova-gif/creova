// Pure checks shared by the edge function. No Deno or network calls, so
// node:test can exercise them without booting the function.

export const HST_RATE = 0.13;
export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING = 15;
export const MAX_ITEM_QUANTITY = 99;

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

export function parseAllowedOrigins(raw: string | undefined): string[] {
  if (!raw || !raw.trim()) return [...DEFAULT_ALLOWED_ORIGINS];
  const parsed = raw
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part !== "*" && /^https?:\/\/[^\s/]+$/i.test(part));
  return parsed.length > 0 ? parsed : [...DEFAULT_ALLOWED_ORIGINS];
}

export function isUsableTurnstileSecret(secret: string | undefined): boolean {
  const trimmed = secret?.trim() ?? "";
  return trimmed.length > 0 && !DUMMY_TURNSTILE_SECRETS.has(trimmed);
}

/**
 * Fail closed when the secret is missing or is Cloudflare's dummy secret,
 * unless the process is explicitly marked as a local/dev environment.
 */
export function turnstileGate(input: {
  secretConfigured: boolean;
  environment: string | undefined;
  token: unknown;
}): TurnstileGate {
  const environment = (input.environment || "").trim().toLowerCase();
  if (!input.secretConfigured) {
    if (DEV_ENVIRONMENTS.has(environment)) return { action: "skip" };
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
