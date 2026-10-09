import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { prefixBounds } from "../src/kv";
import { COMMERCE_ROUTES } from "../src/guards";
import { call, postJson } from "./helpers";

const VISITOR = "visitor_1710000000000_abcdefgh";
const SESSION = "session_1710000000000_abcdefgh";

const CONTACT = {
  name: "Ada Lovelace",
  email: "ada@creova.one",
  message: "Hello from the worker test",
};

const BOOKING = {
  service: "Photography",
  name: "Ada Lovelace",
  email: "ada@creova.one",
  phone: "555-0100",
};

describe("worker routes", () => {
  it("health is ok and the API CSP does not name Stripe or Supabase", async () => {
    const res = await call("/make-server-feacf0d8/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
    const csp = res.headers.get("content-security-policy") ?? "";
    expect(csp).toContain("default-src 'none'");
    expect(csp.toLowerCase()).not.toContain("stripe");
    expect(csp.toLowerCase()).not.toContain("supabase");
  });

  it("returns 410 for every commerce route before reading the body", async () => {
    expect(COMMERCE_ROUTES.length).toBe(13);
    for (const path of COMMERCE_ROUTES) {
      const res = await call(path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{",
      });
      expect(res.status).toBe(410);
      expect(await res.json()).toEqual({ error: "This service is no longer available" });
    }
  });

  it("contact and booking fail closed without a Turnstile secret", async () => {
    const contact = await postJson("/make-server-feacf0d8/submit-contact", CONTACT, "203.0.113.21");
    expect(contact.status).toBe(503);
    expect(await contact.json()).toEqual({ error: "Security verification is not configured" });

    const booking = await postJson("/make-server-feacf0d8/submit-booking", BOOKING, "203.0.113.22");
    expect(booking.status).toBe(503);
    expect(await booking.json()).toEqual({ error: "Security verification is not configured" });
  });

  it("admin login is 401 then 200, and submissions require the token", async () => {
    const denied = await postJson(
      "/make-server-feacf0d8/admin-login",
      { password: "wrong-password" },
      "203.0.113.30",
    );
    expect(denied.status).toBe(401);
    expect(await denied.json()).toEqual({ error: "Incorrect password" });

    const authed = await postJson(
      "/make-server-feacf0d8/admin-login",
      { password: "test-admin-password" },
      "203.0.113.30",
    );
    expect(authed.status).toBe(200);
    const body = (await authed.json()) as { token?: string; status?: string };
    expect(body.status).toBe("success");
    expect(typeof body.token).toBe("string");

    const noToken = await call("/make-server-feacf0d8/submissions", {}, "203.0.113.31");
    expect(noToken.status).toBe(401);

    const withToken = await call(
      "/make-server-feacf0d8/submissions",
      { headers: { "x-admin-session": body.token! } },
      "203.0.113.31",
    );
    expect(withToken.status).toBe(200);
    const submissions = (await withToken.json()) as { status?: string; submissions?: unknown[] };
    expect(submissions.status).toBe("success");
    expect(Array.isArray(submissions.submissions)).toBe(true);
  });

  it("requireAdmin runs before the rate limit on admin mail routes", async () => {
    const ip = "203.0.113.40";
    for (let i = 0; i < 6; i++) {
      const res = await postJson(
        "/make-server-feacf0d8/send-booking-confirmation",
        {},
        ip,
      );
      expect(res.status).toBe(401);
      await res.json();
    }
  });

  it("rejects an unlisted origin and reflects the production origin", async () => {
    const evil = await call("/make-server-feacf0d8/health", {
      headers: { origin: "https://evil.example" },
    });
    expect(evil.headers.get("access-control-allow-origin")).not.toBe("https://evil.example");

    const ok = await call("/make-server-feacf0d8/health", {
      headers: { origin: "https://creova.one" },
    });
    expect(ok.headers.get("access-control-allow-origin")).toBe("https://creova.one");
  });

  it("galleries are an empty list when D1 has no gallery rows", async () => {
    const res = await call("/make-server-feacf0d8/galleries");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "success", galleries: [] });
  });

  it("gallery reads are a prefix range, not a full-table scan", async () => {
    const now = "2026-01-01T00:00:00.000Z";
    for (let i = 0; i < 40; i++) {
      await env.DB.prepare("INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3)")
        .bind(`contact_filler_${i}`, "{}", now)
        .run();
    }
    await env.DB.prepare("INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3)")
      .bind("gallery_one", JSON.stringify({ id: "gallery_one", order: 1 }), now)
      .run();
    await env.DB.prepare("INSERT INTO kv (key, value, updated_at) VALUES (?1, ?2, ?3)")
      .bind("gallery_two", JSON.stringify({ id: "gallery_two", order: 2 }), now)
      .run();

    const res = await call("/make-server-feacf0d8/galleries");
    expect(res.status).toBe(200);
    const body = (await res.json()) as { galleries: Array<{ id: string }> };
    expect(body.galleries.map((gallery) => gallery.id).sort()).toEqual(["gallery_one", "gallery_two"]);

    const { start, end } = prefixBounds("gallery_");
    const scanned = await env.DB.prepare(
      "SELECT key FROM kv WHERE key >= ?1 AND key < ?2",
    )
      .bind(start, end)
      .all();
    expect(scanned.results).toHaveLength(2);
    expect(scanned.meta.rows_read).toBeLessThan(10);

    await env.DB.prepare("DELETE FROM kv WHERE key >= ? AND key < ?").bind("contact_filler_", "contact_filler`").run();
    await env.DB.prepare("DELETE FROM kv WHERE key >= ? AND key < ?").bind(start, end).run();
  });

  it("track-pageview does not write D1 and rejects an unbounded body", async () => {
    const body = { visitorId: VISITOR, sessionId: SESSION, page: "/work", referrer: "not a url" };
    const first = await postJson("/make-server-feacf0d8/track-pageview", body, "203.0.113.50");
    expect(first.status).toBe(204);
    const bad = await postJson(
      "/make-server-feacf0d8/track-pageview",
      { visitorId: "visitor_test", sessionId: "s", page: "/work" },
      "203.0.113.51",
    );
    expect(bad.status).toBe(400);
    const huge = await call(
      "/make-server-feacf0d8/track-pageview",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "x".repeat(9000),
      },
      "203.0.113.52",
    );
    expect(huge.status).toBe(204);

    const pageviews = await env.DB.prepare("SELECT key FROM kv WHERE key >= ? AND key < ?")
      .bind("pageview_", "pageview`")
      .all();
    expect(pageviews.results).toHaveLength(0);
  });

  it("drops page_exit and rate-limits tracking before one client can write without bound", async () => {
    const ip = "203.0.113.53";
    const exit = await postJson(
      "/make-server-feacf0d8/track-event",
      { visitorId: VISITOR, sessionId: SESSION, eventName: "page_exit", page: "/work", eventData: { timeSpent: 9 } },
      ip,
    );
    expect(exit.status).toBe(204);

    let limited = 0;
    for (let i = 0; i < 25; i++) {
      const res = await postJson(
        "/make-server-feacf0d8/track-pageview",
        { visitorId: VISITOR, sessionId: SESSION, page: "/work" },
        ip,
      );
      if (res.status === 429) limited += 1;
      else expect(res.status).toBe(204);
    }
    expect(limited).toBeGreaterThan(0);
    const events = await env.DB.prepare("SELECT key FROM kv WHERE key >= ? AND key < ?")
      .bind("event_", "event`")
      .all();
    expect(events.results).toHaveLength(0);
  });

  it("event interest rejects a non-string email and accepts a capped signup", async () => {
    const bad = await postJson(
      "/make-server-feacf0d8/subscribe-event-interest",
      { email: 12 },
      "203.0.113.91",
    );
    expect(bad.status).toBe(400);
    const wide = await postJson(
      "/make-server-feacf0d8/subscribe-event-interest",
      { email: "ada@creova.one", eventId: "not a safe id" },
      "203.0.113.92",
    );
    expect(wide.status).toBe(400);
    const ok = await postJson(
      "/make-server-feacf0d8/subscribe-event-interest",
      { email: "ada@creova.one", eventId: "fall-brand-photography", eventName: "Workshop" },
      "203.0.113.93",
    );
    expect(ok.status).toBe(200);
    const saved = (await ok.json()) as { interestId?: string };
    expect(saved.interestId?.startsWith("event_interest_")).toBe(true);
  });

  it("lead magnet fails closed without Turnstile", async () => {
    const res = await postJson(
      "/make-server-feacf0d8/subscribe-lead-magnet",
      { email: "ada@creova.one", leadMagnetId: "fw2026_waitlist" },
      "203.0.113.94",
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "Security verification is not configured" });
  });

  it("analytics returns an empty success payload and the newest rows first when queried", async () => {
    const denied = await call("/make-server-feacf0d8/analytics");
    expect(denied.status).toBe(401);

    const authed = await postJson(
      "/make-server-feacf0d8/admin-login",
      { password: "test-admin-password" },
      "203.0.113.95",
    );
    const token = ((await authed.json()) as { token: string }).token;
    const res = await call(
      "/make-server-feacf0d8/analytics?days=30",
      { headers: { "x-admin-session": token } },
      "203.0.113.95",
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { recentPageviews?: unknown; summary?: { totalPageviews?: number } };
    expect(Array.isArray(body.recentPageviews)).toBe(true);
    expect(body.summary?.totalPageviews).toBe(0);
  });

  it("rate limits on cf-connecting-ip, not a spoofed X-Forwarded-For prefix", async () => {
    const ip = "198.51.100.10";
    for (let i = 0; i < 5; i++) {
      const res = await postJson("/make-server-feacf0d8/submit-contact", CONTACT, ip);
      expect(res.status).toBe(503);
      await res.json();
    }
    const blocked = await postJson("/make-server-feacf0d8/submit-contact", CONTACT, ip);
    expect(blocked.status).toBe(429);

    const other = await call(
      "/make-server-feacf0d8/submit-contact",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "cf-connecting-ip": "198.51.100.11",
          "x-forwarded-for": ip,
        },
        body: JSON.stringify(CONTACT),
      },
    );
    expect(other.status).toBe(503);
  });

  it("x-forwarded-for alone is not a rate-limit key", async () => {
    const path = "/make-server-feacf0d8/submit-contact";
    for (let i = 0; i < 5; i++) {
      const res = await call(
        path,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-forwarded-for": "198.51.100.77",
          },
          body: JSON.stringify(CONTACT),
        },
        null,
      );
      expect(res.status).toBe(503);
      await res.json();
    }
    const blocked = await call(
      path,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "203.0.113.88",
        },
        body: JSON.stringify(CONTACT),
      },
      null,
    );
    expect(blocked.status).toBe(429);
  });
});
