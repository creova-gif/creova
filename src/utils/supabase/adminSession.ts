import { apiUrl } from '../api';

const TOKEN_KEY = 'creova_admin_session_token';

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
  const url = apiUrl('/admin-login');
  if (!url) return { ok: false, error: 'API is not configured' };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  const url = apiUrl(path);
  if (!url) {
    return new Response(JSON.stringify({ error: 'API is not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  if (token) headers.set('X-Admin-Session', token);

  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    // Stale/expired/invalid token — drop it so the next page load re-prompts login.
    clearAdminToken();
  }
  return res;
}
