import assert from "node:assert/strict";
import { test } from "node:test";
import {
  analyticsFromQueries,
  consumeDailyWrite,
  eventPoint,
  pageviewPoint,
  referrerHost,
  TRACK_WRITES_PER_IP_PER_DAY,
} from "./analytics.ts";
import { prefixBounds } from "./kv.ts";

const visitor = "visitor_1710000000000_abcdefgh";
const session = "session_1710000000000_abcdefgh";

test("prefix bound is the next code point, so gallery_ does not include contact_", () => {
  const gallery = prefixBounds("gallery_");
  assert.equal(gallery.start, "gallery_");
  assert.equal(gallery.end, "gallery`");
  assert.equal("gallery_one" >= gallery.start && "gallery_one" < gallery.end, true);
  assert.equal("contact_1" >= gallery.start && "contact_1" < gallery.end, false);
});

test("a bad referrer does not throw", () => {
  assert.equal(referrerHost("not a url"), "other");
  assert.equal(referrerHost("http://["), "other");
  assert.equal(referrerHost(""), "direct");
  assert.equal(referrerHost("https://www.creova.one/work"), "www.creova.one");
});

test("page_exit is dropped and a valid page view is one point", () => {
  assert.deepEqual(
    eventPoint({ visitorId: visitor, sessionId: session, eventName: "page_exit", page: "/work" }),
    { drop: true },
  );
  const point = pageviewPoint({
    visitorId: visitor,
    sessionId: session,
    page: "/work",
    referrer: "notaurl",
  });
  assert.ok(point);
  assert.equal(point.blobs[0], "pageview");
  assert.equal(point.blobs[2], "other");
  assert.equal(pageviewPoint({ visitorId: "nope", sessionId: session, page: "/work" }), null);
});

test("one client cannot take the daily tracking write budget", () => {
  const slots = new Map();
  for (let i = 0; i < TRACK_WRITES_PER_IP_PER_DAY; i++) {
    assert.equal(consumeDailyWrite(slots, "203.0.113.10", Date.UTC(2026, 9, 2, 12), TRACK_WRITES_PER_IP_PER_DAY), true);
  }
  assert.equal(consumeDailyWrite(slots, "203.0.113.10", Date.UTC(2026, 9, 2, 18), TRACK_WRITES_PER_IP_PER_DAY), false);
  assert.equal(consumeDailyWrite(slots, "203.0.113.11", Date.UTC(2026, 9, 2, 18), TRACK_WRITES_PER_IP_PER_DAY), true);
});

test("recent page views are returned newest first", () => {
  const payload = analyticsFromQueries(7, new Date("2026-10-02T00:00:00.000Z"), {
    summary: [{ views: 2, visitors: 1, sessions: 1, events: 0 }],
    pages: [],
    referrers: [{ referrer: "not a url", count: 1 }],
    devices: [],
    browsers: [],
    daily: [],
    events: [],
    recent: [
      { page: "/old", referrer: "direct", timestamp: "2026-10-01T00:00:00.000Z", userAgent: "x" },
      { page: "/new", referrer: "direct", timestamp: "2026-10-02T00:00:00.000Z", userAgent: "y" },
    ],
  });
  assert.equal(payload.recentPageviews[0]?.page, "/new");
  assert.equal(payload.recentPageviews[1]?.page, "/old");
  assert.equal(payload.topReferrers[0]?.referrer, "not a url");
});
