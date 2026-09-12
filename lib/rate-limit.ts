/**
 * In-memory rate limiter with exponential back-off.
 *
 * ⚠️  PRODUCTION WARNING: This store is process-local.
 * On multi-instance / serverless deployments (e.g. Vercel) limits are NOT
 * shared across instances.  Replace the `store` Map with an atomic shared
 * store (e.g. Upstash Redis) before going to production.
 */

interface Entry {
  count: number;
  reset: number;
  /** How many times this key has blown through the window limit (persists). */
  strikes: number;
  /** Unix-ms timestamp until which ALL requests are blocked (penalty period). */
  penaltyUntil: number;
}

const store = new Map<string, Entry>();

/** Cap exponential penalty at 24 hours. */
const MAX_PENALTY_MS = 24 * 60 * 60_000;

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const prev = store.get(key);

  // Still inside a penalty window — refuse immediately.
  if (prev && prev.penaltyUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((prev.penaltyUntil - now) / 1000) };
  }

  // Start a fresh window or continue the existing one, preserving strike count.
  const entry: Entry =
    !prev || prev.reset <= now
      ? { count: 0, reset: now + windowMs, strikes: prev?.strikes ?? 0, penaltyUntil: 0 }
      : { ...prev };

  entry.count += 1;

  if (entry.count > max) {
    // Exponential back-off: 2^strikes minutes, capped at MAX_PENALTY_MS.
    entry.strikes += 1;
    const penaltyMs = Math.min(Math.pow(2, entry.strikes) * 60_000, MAX_PENALTY_MS);
    entry.penaltyUntil = now + penaltyMs;
    store.set(key, entry);
    return { allowed: false, retryAfter: Math.ceil(penaltyMs / 1000) };
  }

  store.set(key, entry);
  return { allowed: true, retryAfter: 0 };
}

/**
 * Clear all rate-limit state for a key.
 * Call after a successful login to lift any remaining window pressure.
 */
export function resetRateLimit(key: string) {
  store.delete(key);
}
