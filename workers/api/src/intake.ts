export interface IntakeFields {
  name: string;
  email: string;
  organization: string;
  projectType: string;
  eventDate: string | null;
  dateNotSet: boolean;
  description: string;
  phone?: string;
  budget?: string;
  context?: string;
}

const LIMITS = {
  name: 120,
  email: 254,
  organization: 200,
  projectType: 100,
  description: 5000,
  phone: 40,
  budget: 100,
  context: 3000,
} as const;

function normalizedText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, max) : '';
}

export function parseIntake(value: unknown): IntakeFields | null {
  if (!value || typeof value !== 'object') return null;
  const body = value as Record<string, unknown>;
  const intake: IntakeFields = {
    name: normalizedText(body.name, LIMITS.name),
    email: normalizedText(body.email, LIMITS.email).toLowerCase(),
    organization: normalizedText(body.organization, LIMITS.organization),
    projectType: normalizedText(body.projectType, LIMITS.projectType),
    eventDate: body.eventDate === null ? null : normalizedText(body.eventDate, 10),
    dateNotSet: body.dateNotSet === true,
    description: normalizedText(body.description, LIMITS.description),
    phone: normalizedText(body.phone, LIMITS.phone) || undefined,
    budget: normalizedText(body.budget, LIMITS.budget) || undefined,
    context: normalizedText(body.context, LIMITS.context) || undefined,
  };
  if (!intake.name || !/^\S+@\S+\.\S+$/.test(intake.email) || !intake.organization || !intake.projectType || !intake.description) return null;
  if (intake.dateNotSet === Boolean(intake.eventDate)) return null;
  if (intake.eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(intake.eventDate)) return null;
  return intake;
}

export function canonicalBusinessFields(intake: IntakeFields): string {
  return JSON.stringify({
    name: intake.name,
    email: intake.email,
    organization: intake.organization,
    projectType: intake.projectType,
    eventDate: intake.eventDate,
    dateNotSet: intake.dateNotSet,
    description: intake.description,
    phone: intake.phone ?? '',
    budget: intake.budget ?? '',
    context: intake.context ?? '',
  });
}

export async function fingerprintIntake(intake: IntakeFields): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalBusinessFields(intake));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function torontoDateParts(now: Date): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get('year'), month: get('month'), day: get('day') };
}

function torontoOffsetMinutes(year: number, month: number, day: number): number {
  const sample = new Date(Date.UTC(year, month - 1, day, 17));
  const name = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto', timeZoneName: 'longOffset',
  }).formatToParts(sample).find((part) => part.type === 'timeZoneName')?.value ?? 'GMT-05:00';
  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) throw new Error('Unable to resolve Toronto UTC offset');
  const magnitude = Number(match[2]) * 60 + Number(match[3]);
  return match[1] === '+' ? magnitude : -magnitude;
}

export function responseDueAt(now: Date): string {
  const local = torontoDateParts(now);
  let cursor = new Date(Date.UTC(local.year, local.month - 1, local.day, 12));
  let businessDays = 0;
  while (businessDays < 2) {
    cursor = new Date(cursor.getTime() + 86_400_000);
    const weekday = cursor.getUTCDay();
    if (weekday !== 0 && weekday !== 6) businessDays += 1;
  }
  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth() + 1;
  const day = cursor.getUTCDate();
  const offset = torontoOffsetMinutes(year, month, day);
  return new Date(Date.UTC(year, month - 1, day, 17) - offset * 60_000).toISOString();
}

export function validRequestId(value: unknown): value is string {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{16,80}$/.test(value);
}
