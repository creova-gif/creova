// Page views and custom events go to Workers Analytics Engine, which is included
// on the Workers Free plan (100,000 data points written per day, 10,000 read
// queries per day):
// https://developers.cloudflare.com/analytics/analytics-engine/pricing/
// They are not written to D1, so a tracking flood cannot spend the D1 write budget
// that form submissions share.

import { optionalText, requiredText } from "./guards.ts";

export const ANALYTICS_DATASET = "creova_analytics";
export const TRACK_BODY_MAX = 8_192;
export const TRACK_PER_MINUTE = 20;
export const TRACK_WRITES_PER_IP_PER_DAY = 200;
export const ANALYTICS_MAX_DAYS = 90;
export const SIGNUP_BODY_MAX = 8_192;
export const SIGNUP_WRITES_PER_IP_PER_DAY = 20;

const TRACK_ID = /^(visitor|session)_\d{10,16}_[a-z0-9]{8,12}$/;

export interface AnalyticsPoint {
  indexes: string[];
  blobs: string[];
  doubles: number[];
}

export interface AnalyticsPayload {
  status: "success";
  period: { days: number; startDate: string; endDate: string };
  summary: {
    totalPageviews: number;
    uniqueVisitors: number;
    totalSessions: number;
    avgPageviewsPerSession: string;
    totalEvents: number;
  };
  topPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  devices: Array<{ device: string; count: number }>;
  browsers: Array<{ browser: string; count: number }>;
  dailyViews: Array<{ date: string; views: number }>;
  topEvents: Array<{ event: string; count: number }>;
  recentPageviews: Array<{
    page: string;
    referrer: string;
    timestamp: string;
    userAgent: string;
  }>;
}

type DailySlot = { day: string; count: number };

export function isTrackId(value: unknown, kind: "visitor" | "session"): value is string {
  return typeof value === "string" && value.startsWith(`${kind}_`) && TRACK_ID.test(value);
}

export function trackPage(value: unknown): string | null {
  const page = requiredText(value, 200);
  if (!page || !page.startsWith("/") || page.includes("://") || /\s/.test(page)) return null;
  return page;
}

/** Hostname only. A bad referrer is "other", never a throw. */
export function referrerHost(value: unknown): string {
  if (typeof value !== "string") return "direct";
  const trimmed = value.trim();
  if (!trimmed) return "direct";
  try {
    const host = new URL(trimmed.slice(0, 500)).hostname.toLowerCase();
    if (!host || host.length > 253) return "other";
    return host;
  } catch {
    return "other";
  }
}

export function deviceFromUserAgent(userAgent: string): "mobile" | "tablet" | "desktop" {
  const ua = userAgent.toLowerCase();
  if (/tablet|ipad/.test(ua)) return "tablet";
  if (/mobile|android|iphone/.test(ua)) return "mobile";
  return "desktop";
}

export function browserFromUserAgent(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("chrome")) return "Chrome";
  if (ua.includes("safari")) return "Safari";
  if (ua.includes("firefox")) return "Firefox";
  return "Other";
}

function cappedUserAgent(value: unknown): string {
  const parsed = optionalText(value, 300);
  if (!parsed.ok) return "";
  return parsed.value ?? "";
}

/**
 * One accepted write per IP per UTC day, up to `max`. Over the cap the caller
 * still returns 204 and does not write. The map is per isolate.
 */
export function consumeDailyWrite(
  slots: Map<string, DailySlot>,
  ip: string,
  now: number,
  max: number,
): boolean {
  const day = new Date(now).toISOString().slice(0, 10);
  const slot = slots.get(ip);
  if (!slot || slot.day !== day) {
    slots.set(ip, { day, count: 1 });
    if (slots.size > 10000) {
      for (const [key, value] of slots) {
        if (value.day !== day) slots.delete(key);
      }
    }
    return true;
  }
  if (slot.count >= max) return false;
  slot.count += 1;
  return true;
}

export function pageviewPoint(body: unknown): AnalyticsPoint | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (!isTrackId(record.visitorId, "visitor")) return null;
  if (!isTrackId(record.sessionId, "session")) return null;
  const page = trackPage(record.page);
  if (!page) return null;
  const userAgent = cappedUserAgent(record.userAgent);
  return {
    indexes: [record.sessionId],
    doubles: [1],
    blobs: [
      "pageview",
      page,
      referrerHost(record.referrer),
      deviceFromUserAgent(userAgent),
      browserFromUserAgent(userAgent),
      "",
      record.visitorId,
      userAgent,
    ],
  };
}

/** `page_exit` is accepted and dropped. It is one request per SPA navigation and is not stored. */
export function eventPoint(body: unknown): { drop: true } | { drop: false; point: AnalyticsPoint | null } {
  if (!body || typeof body !== "object") return { drop: false, point: null };
  const record = body as Record<string, unknown>;
  const name = requiredText(record.eventName, 64);
  if (!name || !/^[A-Za-z0-9_-]+$/.test(name)) return { drop: false, point: null };
  if (name === "page_exit") return { drop: true };
  if (!isTrackId(record.visitorId, "visitor")) return { drop: false, point: null };
  if (!isTrackId(record.sessionId, "session")) return { drop: false, point: null };
  const page = trackPage(record.page) ?? "/";
  let data = "";
  if (record.eventData !== undefined && record.eventData !== null) {
    try {
      const encoded = JSON.stringify(record.eventData);
      data = encoded.length <= 500 ? encoded : "";
    } catch {
      data = "";
    }
  }
  return {
    drop: false,
    point: {
      indexes: [record.sessionId],
      doubles: [1],
      blobs: ["event", page, "", "", "", name, record.visitorId, data],
    },
  };
}

export function clampAnalyticsDays(value: string | null | undefined): number {
  const parsed = Number.parseInt(value ?? "30", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 30;
  return Math.min(parsed, ANALYTICS_MAX_DAYS);
}

export function emptyAnalytics(days: number, now = new Date()): AnalyticsPayload {
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return {
    status: "success",
    period: { days, startDate: start.toISOString(), endDate: now.toISOString() },
    summary: {
      totalPageviews: 0,
      uniqueVisitors: 0,
      totalSessions: 0,
      avgPageviewsPerSession: "0",
      totalEvents: 0,
    },
    topPages: [],
    topReferrers: [],
    devices: [
      { device: "mobile", count: 0 },
      { device: "tablet", count: 0 },
      { device: "desktop", count: 0 },
    ],
    browsers: [],
    dailyViews: [],
    topEvents: [],
    recentPageviews: [],
  };
}

function asCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

function asText(value: unknown, max = 300): string {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

export function timeMillis(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1e12 ? value * 1000 : value;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) return parsed;
    const asNum = Number(value);
    if (Number.isFinite(asNum)) return asNum < 1e12 ? asNum * 1000 : asNum;
  }
  return 0;
}

interface SqlRow {
  [key: string]: unknown;
}

export function rowsFromSql(payload: unknown): SqlRow[] {
  if (Array.isArray(payload)) return payload.filter((row) => row && typeof row === "object") as SqlRow[];
  if (!payload || typeof payload !== "object") return [];
  const data = (payload as { data?: unknown }).data;
  if (!Array.isArray(data)) return [];
  return data.filter((row) => row && typeof row === "object") as SqlRow[];
}

export function analyticsFromQueries(
  days: number,
  now: Date,
  parts: {
    summary: SqlRow[];
    pages: SqlRow[];
    referrers: SqlRow[];
    devices: SqlRow[];
    browsers: SqlRow[];
    daily: SqlRow[];
    events: SqlRow[];
    recent: SqlRow[];
  },
): AnalyticsPayload {
  const base = emptyAnalytics(days, now);
  const summary = parts.summary[0] ?? {};
  const totalPageviews = asCount(summary.views);
  const totalSessions = asCount(summary.sessions);
  const totalEvents = asCount(summary.events);
  base.summary = {
    totalPageviews,
    uniqueVisitors: asCount(summary.visitors),
    totalSessions,
    avgPageviewsPerSession: totalSessions > 0 ? (totalPageviews / totalSessions).toFixed(2) : "0",
    totalEvents,
  };
  base.topPages = parts.pages.slice(0, 10).map((row) => ({
    page: asText(row.page, 200) || "/",
    count: asCount(row.count),
  }));
  base.topReferrers = parts.referrers.slice(0, 10).map((row) => ({
    referrer: asText(row.referrer, 253) || "direct",
    count: asCount(row.count),
  }));
  const deviceMap = new Map(base.devices.map((item) => [item.device, 0]));
  for (const row of parts.devices) {
    const name = asText(row.device, 16);
    if (deviceMap.has(name)) deviceMap.set(name, asCount(row.count));
  }
  base.devices = [...deviceMap.entries()].map(([device, count]) => ({ device, count }));
  base.browsers = parts.browsers.slice(0, 10).map((row) => ({
    browser: asText(row.browser, 32) || "Other",
    count: asCount(row.count),
  }));
  base.dailyViews = parts.daily
    .map((row) => ({ date: asText(row.date, 10), views: asCount(row.views) }))
    .filter((row) => row.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  base.topEvents = parts.events.slice(0, 10).map((row) => ({
    event: asText(row.event, 64),
    count: asCount(row.count),
  }));
  const recent = parts.recent.map((row) => {
    const ms = timeMillis(row.timestamp);
    return {
      ms,
      page: asText(row.page, 200) || "/",
      referrer: asText(row.referrer, 253),
      timestamp: new Date(ms || now.getTime()).toISOString(),
      userAgent: asText(row.userAgent, 300),
    };
  });
  recent.sort((a, b) => b.ms - a.ms);
  base.recentPageviews = recent.slice(0, 50).map((row) => ({
    page: row.page,
    referrer: row.referrer,
    timestamp: row.timestamp,
    userAgent: row.userAgent,
  }));
  return base;
}

export function analyticsSql(days: number): Record<string, string> {
  const window = `timestamp >= NOW() - INTERVAL '${days}' DAY`;
  const from = ANALYTICS_DATASET;
  return {
    summary: `SELECT SUM(_sample_interval) AS views, COUNT(DISTINCT blob7) AS visitors, COUNT(DISTINCT index1) AS sessions FROM ${from} WHERE blob1 = 'pageview' AND ${window}`,
    events: `SELECT SUM(_sample_interval) AS events FROM ${from} WHERE blob1 = 'event' AND ${window}`,
    pages: `SELECT blob2 AS page, SUM(_sample_interval) AS count FROM ${from} WHERE blob1 = 'pageview' AND ${window} GROUP BY page ORDER BY count DESC LIMIT 10`,
    referrers: `SELECT blob3 AS referrer, SUM(_sample_interval) AS count FROM ${from} WHERE blob1 = 'pageview' AND ${window} GROUP BY referrer ORDER BY count DESC LIMIT 10`,
    devices: `SELECT blob4 AS device, SUM(_sample_interval) AS count FROM ${from} WHERE blob1 = 'pageview' AND ${window} GROUP BY device`,
    browsers: `SELECT blob5 AS browser, SUM(_sample_interval) AS count FROM ${from} WHERE blob1 = 'pageview' AND ${window} GROUP BY browser ORDER BY count DESC LIMIT 10`,
    daily: `SELECT formatDateTime(timestamp, '%Y-%m-%d', 'Etc/UTC') AS date, SUM(_sample_interval) AS views FROM ${from} WHERE blob1 = 'pageview' AND ${window} GROUP BY date ORDER BY date ASC LIMIT 90`,
    recent: `SELECT blob2 AS page, blob3 AS referrer, blob8 AS userAgent, timestamp FROM ${from} WHERE blob1 = 'pageview' AND ${window} ORDER BY timestamp DESC LIMIT 50`,
    topEvents: `SELECT blob6 AS event, SUM(_sample_interval) AS count FROM ${from} WHERE blob1 = 'event' AND ${window} GROUP BY event ORDER BY count DESC LIMIT 10`,
  };
}

const ACCOUNT_ID = /^[a-f0-9]{32}$/i;

export async function queryAnalyticsEngine(input: {
  accountId: string | undefined;
  token: string | undefined;
  days: number;
  now?: Date;
  fetchImpl?: typeof fetch;
}): Promise<AnalyticsPayload> {
  const now = input.now ?? new Date();
  const empty = emptyAnalytics(input.days, now);
  const accountId = input.accountId?.trim() ?? "";
  const token = input.token?.trim() ?? "";
  if (!ACCOUNT_ID.test(accountId) || !token) return empty;

  const fetchImpl = input.fetchImpl ?? fetch;
  const sql = analyticsSql(input.days);
  const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/analytics_engine/sql`;

  async function run(query: string): Promise<SqlRow[]> {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: query,
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return [];
    const payload = await response.json().catch(() => null);
    return rowsFromSql(payload);
  }

  const [summary, eventCount, pages, referrers, devices, browsers, daily, recent, topEvents] =
    await Promise.all([
      run(sql.summary).catch(() => [] as SqlRow[]),
      run(sql.events).catch(() => [] as SqlRow[]),
      run(sql.pages).catch(() => [] as SqlRow[]),
      run(sql.referrers).catch(() => [] as SqlRow[]),
      run(sql.devices).catch(() => [] as SqlRow[]),
      run(sql.browsers).catch(() => [] as SqlRow[]),
      run(sql.daily).catch(() => [] as SqlRow[]),
      run(sql.recent).catch(() => [] as SqlRow[]),
      run(sql.topEvents).catch(() => [] as SqlRow[]),
    ]);

  const summaryRow = summary[0] ?? {};
  summaryRow.events = eventCount[0]?.events ?? 0;
  return analyticsFromQueries(input.days, now, {
    summary: [summaryRow],
    pages,
    referrers,
    devices,
    browsers,
    daily,
    events: topEvents,
    recent,
  });
}
