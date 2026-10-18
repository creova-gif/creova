export const INTAKE_ERROR_CODES = [
  'INVALID_REQUEST',
  'CAPTCHA_REQUIRED',
  'CAPTCHA_FAILED',
  'REQUEST_CONFLICT',
  'PERSISTENCE_FAILED',
  'SERVICE_UNAVAILABLE',
] as const;

export type IntakeErrorCode = (typeof INTAKE_ERROR_CODES)[number];

export interface ProjectIntakePayload {
  requestId: string;
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
  captchaToken: string;
}

export interface IntakeReceipt {
  requestId: string;
  status: 'received';
  receivedAt: string;
  responseDueAt: string;
}

export function createRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 12)}`;
}

export function isIntakeReceipt(value: unknown): value is IntakeReceipt {
  if (!value || typeof value !== 'object') return false;
  const receipt = value as Partial<IntakeReceipt>;
  return (
    typeof receipt.requestId === 'string' &&
    receipt.requestId.length > 0 &&
    receipt.status === 'received' &&
    typeof receipt.receivedAt === 'string' &&
    typeof receipt.responseDueAt === 'string'
  );
}
