import { env } from "cloudflare:workers";
import { beforeAll, describe, expect, it } from "vitest";
import { outbound } from "../src/index";
import { postJson } from "./helpers";

const CONTACT = {
  requestId: "8ec8ea88-cf48-46b5-992a-e43ecb2af234",
  name: "Ada Lovelace",
  email: "ada@creova.one",
  organization: "Analytical Engine Society",
  projectType: "event-story",
  eventDate: "2026-12-10",
  dateNotSet: false,
  description: "Hello from the local test env",
  context: "Document the community impact for the annual report.",
};

const BOOKING = {
  service: "Photography",
  name: "Ada Lovelace",
  email: "ada@creova.one",
  phone: "555-0100",
};

const LOOPBACK = "http://127.0.0.1";

const calls: string[] = [];

beforeAll(() => {
  outbound.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    calls.push(url);
    if (url.startsWith("https://api.resend.com") || url.startsWith("https://api.airtable.com")) {
      return new Response(JSON.stringify({ id: "email_test" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    return fetch(input, init);
  };
});

describe("local captcha skip", () => {
  it("accepts contact and booking on loopback when CREOVA_ENV=test", async () => {
    const contact = await postJson(
      "/make-server-feacf0d8/submit-contact",
      CONTACT,
      "203.0.113.61",
      undefined,
      LOOPBACK,
    );
    expect(contact.status).toBe(200);
    const contactBody = (await contact.json()) as {
      status?: string;
      contactId?: string;
      requestId?: string;
      receivedAt?: string;
      responseDueAt?: string;
    };
    expect(contactBody.status).toBe("received");
    expect(contactBody.contactId).toBe(`contact_${CONTACT.requestId}`);
    expect(contactBody.requestId).toBe(CONTACT.requestId);
    expect(Date.parse(contactBody.receivedAt ?? "")).not.toBeNaN();
    expect(Date.parse(contactBody.responseDueAt ?? "")).not.toBeNaN();

    const row = await env.DB.prepare("SELECT value FROM kv WHERE key = ?")
      .bind(`contact_${CONTACT.requestId}`)
      .first<{ value: string }>();
    const stored = JSON.parse(row?.value ?? "{}") as Record<string, unknown>;
    expect(stored).toMatchObject({
      requestId: CONTACT.requestId,
      organization: CONTACT.organization,
      projectType: CONTACT.projectType,
      eventDate: CONTACT.eventDate,
      dateNotSet: false,
      description: CONTACT.description,
      context: CONTACT.context,
    });
    expect(stored.response_due_at).toBe(contactBody.responseDueAt);

    const booking = await postJson(
      "/make-server-feacf0d8/submit-booking",
      BOOKING,
      "203.0.113.62",
      undefined,
      LOOPBACK,
    );
    expect(booking.status).toBe(200);
    const bookingBody = (await booking.json()) as { status?: string; bookingId?: string };
    expect(bookingBody.status).toBe("success");
    expect(bookingBody.bookingId?.startsWith("booking_")).toBe(true);
  });

  it("does not skip captcha on a non-loopback host even when CREOVA_ENV=test", async () => {
    const contact = await postJson(
      "/make-server-feacf0d8/submit-contact",
      CONTACT,
      "203.0.113.63",
    );
    expect(contact.status).toBe(503);
    expect(await contact.json()).toEqual({ error: "Security verification is not configured" });
  });

  it("stores event interest in Airtable and does not email", async () => {
    const before = calls.length;
    const res = await postJson(
      "/make-server-feacf0d8/subscribe-event-interest",
      { email: "ada@creova.one", eventId: "fall-brand-photography", eventName: "Workshop" },
      "203.0.113.66",
    );
    expect(res.status).toBe(200);
    const sent = calls.slice(before);
    expect(sent.some((url) => url.startsWith("https://api.airtable.com"))).toBe(true);
    expect(sent.some((url) => url.startsWith("https://api.resend.com"))).toBe(false);
  });

  it("still emails and syncs Airtable when the D1 write fails", async () => {
    await env.DB.prepare("DROP TABLE kv").run();
    const before = calls.length;
    const contact = await postJson(
      "/make-server-feacf0d8/submit-contact",
      CONTACT,
      "203.0.113.64",
      undefined,
      LOOPBACK,
    );
    expect(contact.status).toBe(503);
    const body = (await contact.json()) as {
      status?: string;
      requestId?: string;
      receivedAt?: string;
      stored?: boolean;
    };
    expect(body.status).toBeUndefined();
    expect(body.receivedAt).toBeUndefined();
    expect(body.stored).toBe(false);
    expect(body.requestId).toBe(CONTACT.requestId);
    const sent = calls.slice(before);
    expect(sent.some((url) => url.startsWith("https://api.resend.com"))).toBe(true);
    expect(sent.some((url) => url.startsWith("https://api.airtable.com"))).toBe(true);
  });
});
