import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PRODUCT_CATALOG,
  computeTrustedCartTotalCents,
  escapeHtml,
  escapeHtmlMultiline,
  isUsableTurnstileSecret,
  oneLine,
  parseAllowedOrigins,
  resolveChargeCents,
  safeCreovaUrl,
  turnstileGate,
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
    turnstileGate({ secretConfigured: false, environment: "", token: "token" }),
    { action: "reject", status: 503, error: "Security verification is not configured" },
  );
  assert.deepEqual(
    turnstileGate({ secretConfigured: false, environment: "production", token: "token" }),
    { action: "reject", status: 503, error: "Security verification is not configured" },
  );
  assert.equal(
    turnstileGate({ secretConfigured: false, environment: "development", token: null }).action,
    "skip",
  );
});

test("turnstile requires a token when the secret is configured, and dummy secrets do not count", () => {
  assert.deepEqual(
    turnstileGate({ secretConfigured: true, environment: "production", token: "  " }),
    { action: "reject", status: 400, error: "Security verification required" },
  );
  assert.equal(
    turnstileGate({ secretConfigured: true, environment: "", token: "real-token" }).action,
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
});
