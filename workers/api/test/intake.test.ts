import { describe, expect, it } from 'vitest';
import { canonicalBusinessFields, fingerprintIntake, parseIntake, responseDueAt } from '../src/intake';

const valid = {
  name: ' Justin  Mafie ',
  email: 'JUSTIN@example.com',
  organization: 'CREOVA',
  projectType: 'event-story',
  eventDate: null,
  dateNotSet: true,
  description: 'Document our event',
  phone: '',
  budget: '$1,000',
  context: 'Public brief',
};

describe('project intake contract', () => {
  it('normalizes business fields and requires date or not-set', () => {
    expect(parseIntake(valid)).toMatchObject({ name: 'Justin Mafie', email: 'justin@example.com', dateNotSet: true });
    expect(parseIntake({ ...valid, dateNotSet: false })).toBeNull();
    expect(parseIntake({ ...valid, dateNotSet: true, eventDate: '2026-12-10' })).toBeNull();
  });

  it('excludes transport metadata from the canonical fingerprint input', async () => {
    const parsed = parseIntake(valid)!;
    const first = await fingerprintIntake(parsed);
    const second = await fingerprintIntake(parseIntake({ ...valid, locale: 'fr', captchaToken: 'different', requestId: 'another-id' })!);
    expect(first).toBe(second);
    expect(canonicalBusinessFields(parsed)).not.toContain('captcha');
  });

  it('sets 5pm Toronto on the second following weekday', () => {
    expect(responseDueAt(new Date('2026-10-16T20:00:00Z'))).toBe('2026-10-20T21:00:00.000Z');
    expect(responseDueAt(new Date('2026-01-14T14:00:00Z'))).toBe('2026-01-16T22:00:00.000Z');
  });
});
