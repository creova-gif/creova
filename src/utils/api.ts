import { projectId } from './supabase/info';

const configuredBase = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '');

export const usesDurableIntakeApi = Boolean(configuredBase);

export function publicApiUrl(workerPath: string, legacyPath: string): string {
  if (configuredBase) return `${configuredBase}${workerPath}`;
  return `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8${legacyPath}`;
}
