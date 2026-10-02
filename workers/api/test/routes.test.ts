import { env } from "cloudflare:workers";
import { describe, expect, it } from "vitest";
import { COMMERCE_ROUTES } from "../src/guards";
import { call, postJson } from "./helpers";

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
  it("health is ok", async () => {
    const res = await call("/make-server-feacf0d8/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok" });
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

  it("track-pageview writes a pageview row and coalesces the session counter", async () => {
    const body = { visitorId: "visitor_test", sessionId: "session_test", page: "/work" };
    const first = await postJson("/make-server-feacf0d8/track-pageview", body, "203.0.113.50");
    expect(first.status).toBe(200);
    const second = await postJson("/make-server-feacf0d8/track-pageview", body, "203.0.113.50");
    expect(second.status).toBe(200);

    const pageviews = await env.DB.prepare(
      "SELECT key, value FROM kv WHERE key LIKE ?1 ESCAPE '\\'",
    )
      .bind("pageview\\_%")
      .all<{ key: string; value: string }>();
    expect(pageviews.results.length).toBeGreaterThanOrEqual(2);

    const session = await env.DB.prepare("SELECT value FROM kv WHERE key = ?")
      .bind("session_session_test")
      .first<{ value: string }>();
    expect(session).toBeTruthy();
    const parsed = JSON.parse(session!.value) as { pageCount?: number };
    expect(parsed.pageCount).toBe(1);
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
});
