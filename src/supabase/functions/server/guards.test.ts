import assert from "node:assert/strict";
import { test } from "node:test";
import {
  COMMERCE_GONE_BODY,
  COMMERCE_GONE_STATUS,
  COMMERCE_ROUTES,
  PRODUCT_CATALOG,
  bookingReceivedHtml,
  captchaDevSkip,
  collaborationAdminSubject,
  computeTrustedCartTotalCents,
  consumeRateLimit,
  contactAdminSubject,
  contactReceivedHtml,
  escapeHtml,
  escapeHtmlMultiline,
  isUsableTurnstileSecret,
  oneLine,
  optionalText,
  parseAllowedOrigins,
  parseEmailAddress,
  rateLimitClientIp,
  resolveChargeCents,
  safeCreovaUrl,
  turnstileGate,
  turnstileVerificationOk,
} from "./guards.ts";

test("escapeHtml encodes characters that break HTML text and attributes", () => {
  assert.equal(
    escapeHtml(`<script>alert("x")</script> & 'ok'`),
    "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;ok&#39;",
  );
  assert.equal(escapeHtml(null), "");
});

test("oneLine strips header breaks", () => {
  assert.equal(oneLine("Ann\r\nBcc: evil@example.com"), "Ann Bcc: evil@example.com");
});

test("escapeHtmlMultiline escapes markup before inserting breaks", () => {
  assert.equal(
    escapeHtmlMultiline("hello\n<img src=x onerror=alert(1)>"),
    "hello<br>&lt;img src=x onerror=alert(1)&gt;",
  );
});

test("safeCreovaUrl keeps creova https links and drops everything else", () => {
  assert.equal(
    safeCreovaUrl("https://www.creova.one/checkout?ok=1"),
    "https://www.creova.one/checkout?ok=1",
  );
  assert.equal(safeCreovaUrl("https://creova.one/checkout"), "https://creova.one/checkout");
  assert.equal(safeCreovaUrl("javascript:alert(1)"), "");
  assert.equal(safeCreovaUrl("https://evil.example/checkout"), "");
  assert.equal(safeCreovaUrl("https://user:pass@www.creova.one/"), "");
  assert.equal(safeCreovaUrl("http://www.creova.one/checkout"), "");
});

test("catalog price ignores the client price field", () => {
  const result = resolveChargeCents(undefined, [
    { id: "graphic-tee-soft-power", price: 0.01, quantity: 1 },
  ]);
  assert.equal(result.ok, true);
  if (result.ok) {
    const expected = Math.round((55 + 55 * 0.13 + 15) * 100);
    assert.equal(result.totalCents, expected);
    assert.notEqual(result.totalCents, 1);
  }
});

test("a client-supplied amount that does not match the catalog is rejected", () => {
  const result = resolveChargeCents(100, [
    { id: "graphic-tee-soft-power", price: 1, quantity: 1 },
  ]);
  assert.deepEqual(result, {
    ok: false,
    error: "Order total does not match the current prices",
  });
});

test("a matching client amount is not what gets charged — the catalog total is", () => {
  const trusted = computeTrustedCartTotalCents([
    { id: "ankle-socks-essential", quantity: 2 },
  ]);
  assert.equal(trusted.ok, true);
  if (!trusted.ok) return;
  const result = resolveChargeCents(trusted.totalCents, [
    { id: "ankle-socks-essential", price: 1, quantity: 2 },
  ]);
  assert.deepEqual(result, { ok: true, totalCents: trusted.totalCents });
});

test("non-catalog and mixed carts are rejected", () => {
  assert.equal(
    resolveChargeCents(100, [{ id: "custom-service", price: 1, quantity: 1 }]).ok,
    false,
  );
  assert.equal(
    resolveChargeCents(100, [
      { id: "ankle-socks-essential", quantity: 1 },
      { id: "custom-service", price: 1, quantity: 1 },
    ]).ok,
    false,
  );
  assert.equal(resolveChargeCents(100, []).ok, false);
});

test("quantity must be a positive integer within the cap", () => {
  assert.equal(
    computeTrustedCartTotalCents([{ id: "dad-hat-logo", quantity: 0 }]).ok,
    false,
  );
  assert.equal(
    computeTrustedCartTotalCents([{ id: "dad-hat-logo", quantity: 1.5 }]).ok,
    false,
  );
  assert.equal(
    computeTrustedCartTotalCents([{ id: "dad-hat-logo", quantity: 100 }]).ok,
    false,
  );
});

test("social media template price matches the storefront", () => {
  assert.equal(PRODUCT_CATALOG["social-media-templates"], 32);
});

test("turnstile fails closed when the secret is missing outside local dev", () => {
  assert.deepEqual(
    turnstileGate({ secretConfigured: false, creovaEnv: "", token: "token" }),
    { action: "reject", status: 503, error: "Security verification is not configured" },
  );
  assert.deepEqual(
    turnstileGate({ secretConfigured: false, creovaEnv: "production", token: "token" }),
    { action: "reject", status: 503, error: "Security verification is not configured" },
  );
  assert.equal(
    turnstileGate({ secretConfigured: false, creovaEnv: "development", token: null }).action,
    "skip",
  );
});

test("captcha skip is exact CREOVA_ENV only and never on a hosted project", () => {
  assert.equal(captchaDevSkip("development", undefined), true);
  assert.equal(captchaDevSkip("test", "http://127.0.0.1:54321"), true);
  assert.equal(captchaDevSkip(" Dev ", undefined), false);
  assert.equal(captchaDevSkip("development ", undefined), false);
  assert.equal(captchaDevSkip("DEVELOPMENT", undefined), false);
  assert.equal(captchaDevSkip("dev ", undefined), false);
  assert.equal(
    captchaDevSkip("development", "https://vwestumjbrpwlbsewupz.supabase.co"),
    false,
  );
  assert.equal(
    turnstileGate({
      secretConfigured: false,
      creovaEnv: "development",
      supabaseUrl: "https://vwestumjbrpwlbsewupz.supabase.co",
      token: null,
    }).action,
    "reject",
  );
});

test("turnstile requires a token when the secret is configured, and dummy secrets do not count", () => {
  assert.deepEqual(
    turnstileGate({ secretConfigured: true, creovaEnv: "production", token: "  " }),
    { action: "reject", status: 400, error: "Security verification required" },
  );
  assert.equal(
    turnstileGate({ secretConfigured: true, creovaEnv: "", token: "real-token" }).action,
    "verify",
  );
  assert.equal(isUsableTurnstileSecret(undefined), false);
  assert.equal(isUsableTurnstileSecret("   "), false);
  assert.equal(isUsableTurnstileSecret("1x0000000000000000000000000000000AA"), false);
  assert.equal(isUsableTurnstileSecret("real-secret"), true);
});

test("CORS allowlist defaults to the production origins and refuses a wildcard", () => {
  assert.deepEqual(parseAllowedOrigins(undefined), [
    "https://www.creova.one",
    "https://creova.one",
  ]);
  assert.deepEqual(parseAllowedOrigins("*"), [
    "https://www.creova.one",
    "https://creova.one",
  ]);
  assert.deepEqual(
    parseAllowedOrigins("https://www.creova.one, http://localhost:5173"),
    ["https://www.creova.one", "http://localhost:5173"],
  );
  assert.deepEqual(
    parseAllowedOrigins("HTTPS://WWW.CREOVA.ONE/, http://LocalHost:5173/"),
    ["https://www.creova.one", "http://localhost:5173"],
  );
});

test("rate limit key uses the appended hop, not a spoofed XFF prefix", () => {
  const suffix = "203.0.113.10";
  const first = rateLimitClientIp({ forwardedFor: `1.1.1.1, ${suffix}` });
  const rotated = rateLimitClientIp({ forwardedFor: `8.8.8.8, ${suffix}` });
  assert.equal(first, suffix);
  assert.equal(rotated, suffix);
  assert.equal(rateLimitClientIp({ forwardedFor: null }), "unknown");
  assert.equal(
    rateLimitClientIp({ forwardedFor: `9.9.9.9, ${suffix}`, connectingIp: "198.51.100.20" }),
    "198.51.100.20",
  );
  assert.equal(
    rateLimitClientIp({ forwardedFor: suffix, connectingIp: "not-an-ip, 1.2.3.4" }),
    suffix,
  );
});

test("rateLimit counts inside one isolate and then rejects", () => {
  const buckets = new Map();
  const key = "203.0.113.10:/submit-contact";
  for (let i = 0; i < 5; i++) {
    assert.equal(consumeRateLimit(buckets, key, 1_000, 5, 60_000), true);
  }
  assert.equal(consumeRateLimit(buckets, key, 1_000, 5, 60_000), false);
  assert.equal(consumeRateLimit(buckets, key, 61_000, 5, 60_000), true);
  assert.equal(consumeRateLimit(buckets, "unknown:/submit-contact", 1_000, 5, 60_000), true);
});

test("admin email subjects use the text value, not the optionalText object", () => {
  const service = optionalText("Brand film", 160);
  assert.equal(service.ok, true);
  if (!service.ok) return;
  assert.equal(contactAdminSubject(service.value, "Ada\nLovelace"), "📧 New Contact: Brand film — Ada Lovelace");
  assert.equal(contactAdminSubject(undefined, "Ada"), "📧 New Contact: General Inquiry — Ada");
  assert.equal(oneLine(service).includes("[object Object]"), true);
  assert.equal(contactAdminSubject(service.value, "Ada").includes("[object Object]"), false);

  const organization = optionalText("Studio", 160);
  assert.equal(organization.ok, true);
  if (!organization.ok) return;
  assert.equal(
    collaborationAdminSubject(organization.value, "Ada"),
    "🤝 New Collaboration Request: Studio",
  );
  assert.equal(collaborationAdminSubject(undefined, "Ada"), "🤝 New Collaboration Request: Ada");
  assert.equal(collaborationAdminSubject(organization.value, "Ada").includes("[object Object]"), false);
});

test("commerce routes share one gone response", () => {
  assert.equal(COMMERCE_GONE_STATUS, 410);
  assert.deepEqual(COMMERCE_GONE_BODY, { error: "This service is no longer available" });
  assert.equal(new Set(COMMERCE_ROUTES).size, COMMERCE_ROUTES.length);
  for (const path of [
    "/make-server-feacf0d8/create-payment-intent",
    "/make-server-feacf0d8/stripe-webhook",
    "/make-server-feacf0d8/purchase-digital-product",
    "/make-server-feacf0d8/purchase-event-ticket",
    "/make-server-feacf0d8/create-membership",
    "/make-server-feacf0d8/create-subscription-checkout",
    "/make-server-feacf0d8/create-ticket",
    "/make-server-feacf0d8/create-preorder",
    "/make-server-feacf0d8/payments",
    "/make-server-feacf0d8/create-refund",
    "/make-server-feacf0d8/refunds",
    "/make-server-feacf0d8/create-booking",
    "/make-server-feacf0d8/create-rental",
  ]) {
    assert.equal(COMMERCE_ROUTES.includes(path as (typeof COMMERCE_ROUTES)[number]), true);
  }
});

test("CORS allowlist rejects an origin that is not listed", () => {
  const allowed = parseAllowedOrigins(undefined);
  assert.equal(allowed.includes("https://evil.example"), false);
  assert.equal(allowed.includes("https://creova.one.evil.example"), false);
});

test("turnstile siteverify checks hostname and action", () => {
  assert.equal(
    turnstileVerificationOk(
      { success: true, hostname: "creova.one", action: "contact" },
      "contact",
    ),
    true,
  );
  assert.equal(
    turnstileVerificationOk(
      { success: true, hostname: "WWW.CREOVA.ONE", action: "booking" },
      "booking",
    ),
    true,
  );
  assert.equal(
    turnstileVerificationOk({ success: true, hostname: "evil.example", action: "contact" }, "contact"),
    false,
  );
  assert.equal(
    turnstileVerificationOk({ success: true, hostname: "creova.one", action: "contact" }, "booking"),
    false,
  );
  assert.equal(turnstileVerificationOk({ success: true }, "contact"), false);
});

test("customer mail is a fixed receipt and addresses are checked", () => {
  const contact = contactReceivedHtml();
  const booking = bookingReceivedHtml();
  assert.equal(contact.includes("${"), false);
  assert.equal(booking.includes("${"), false);
  assert.equal(contact.includes("Thanks for reaching out, "), false);
  assert.match(contact, /We've received your message/);
  assert.match(booking, /We received your booking request/);
  assert.equal(parseEmailAddress("person@creova.one"), "person@creova.one");
  assert.equal(parseEmailAddress("not an email"), null);
  assert.equal(parseEmailAddress("a\r\nb@creova.one"), null);
  assert.equal(parseEmailAddress(`${"a".repeat(250)}@creova.one`), null);
});
