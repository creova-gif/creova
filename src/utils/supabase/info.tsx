/**
 * Legacy Supabase client configuration.
 * Loaded from Vite environment variables so no project identifiers or JWTs are hardcoded in source.
 */
const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const projectId: string = env.VITE_SUPABASE_PROJECT_ID ?? "";
export const publicAnonKey: string = env.VITE_SUPABASE_ANON_KEY ?? "";
