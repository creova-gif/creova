/** Honest copy for a public form when the edge function rate-limits or is down. */
export function publicFormStatusMessage(status: number, french: boolean): string | null {
  if (status === 429) {
    return french
      ? "Trop de tentatives, réessayez bientôt"
      : "Too many attempts, try again shortly";
  }
  if (status === 503) {
    return french
      ? "Service temporairement indisponible"
      : "Service temporarily unavailable";
  }
  return null;
}
