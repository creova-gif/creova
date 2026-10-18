import { afterEach, describe, expect, it, vi } from 'vitest';
import { app } from '../src/index';
import { fingerprintIntake, parseIntake } from '../src/intake';

const body = {
  requestId: 'req_1234567890abcdef',
  name: 'Justin Mafie',
  email: 'justin@example.com',
  organization: 'CREOVA',
  projectType: 'event-story',
  eventDate: null,
  dateNotSet: true,
  description: 'Document our event',
  captchaToken: 'verified-token',
};

function statement() {
  const value = { bind: vi.fn() } as unknown as D1PreparedStatement;
  (value.bind as unknown as ReturnType<typeof vi.fn>).mockReturnValue(value);
  return value;
}

function envWithBatch(batch: (...args: unknown[]) => Promise<unknown>) {
  return {
    DB: { prepare: vi.fn(statement), batch } as unknown as D1Database,
    CREOVA_ENV: 'test',
    ALLOWED_ORIGINS: 'https://www.creova.one',
    TURNSTILE_SECRET_KEY: 'secret',
    AIRTABLE_API_KEY: 'key',
    AIRTABLE_BASE_ID: 'base',
    AIRTABLE_TABLE_ID: 'table',
  };
}

afterEach(() => vi.unstubAllGlobals());

describe('POST /v1/intakes', () => {
  it('never returns success when D1 persistence fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, action: 'contact' }), { status: 200 })));
    const response = await app.request('https://api.creova.one/v1/intakes', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.creova.one' }, body: JSON.stringify(body),
    }, envWithBatch(async () => { throw new Error('D1 unavailable'); }));
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ code: 'PERSISTENCE_FAILED' });
  });

  it('returns the persisted receipt for an idempotent retry', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, action: 'contact' }), { status: 200 })));
    const fingerprint = await fingerprintIntake(parseIntake(body)!);
    const batch = vi.fn().mockResolvedValue([
      { success: true },
      { success: true },
      { success: true, results: [{ request_id: body.requestId, fingerprint, received_at: '2026-10-16T15:00:00.000Z', response_due_at: '2026-10-20T21:00:00.000Z' }] },
    ]);
    const response = await app.request('https://api.creova.one/v1/intakes', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.creova.one' }, body: JSON.stringify(body),
    }, envWithBatch(batch));
    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({ requestId: body.requestId, status: 'received' });
  });

  it('rejects the same request ID with changed business fields', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true, action: 'contact' }), { status: 200 })));
    const batch = vi.fn().mockResolvedValue([
      { success: true }, { success: true },
      { success: true, results: [{ request_id: body.requestId, fingerprint: 'different', received_at: '2026-10-16T15:00:00.000Z', response_due_at: '2026-10-20T21:00:00.000Z' }] },
    ]);
    const response = await app.request('https://api.creova.one/v1/intakes', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.creova.one' }, body: JSON.stringify(body),
    }, envWithBatch(batch));
    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ code: 'REQUEST_CONFLICT' });
  });
});
