import { projectId, publicAnonKey } from './info';

const TOKEN_KEY = 'creova_admin_session_token';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-feacf0d8`;

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setAdminToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.token) {
      return { ok: false, error: data.error || 'Login failed' };
    }
    setAdminToken(data.token);
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not reach the server' };
  }
}

/**
 * Fetch wrapper for admin-only endpoints. Attaches the signed admin session
 * token issued by /admin-login. The server verifies this token on every
 * request — the client-side "logged in" state is UX only, not a security
 * boundary.
 */
export async function adminFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${publicAnonKey}`);
  if (token) headers.set('X-Admin-Session', token);

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    // Stale/expired/invalid token — drop it so the next page load re-prompts login.
    clearAdminToken();
  }
  return res;
}
