type Entry = { count: number; reset: number };
const entries = new Map<string, Entry>();
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now(); const old = entries.get(key);
  const entry = !old || old.reset <= now ? { count: 0, reset: now + windowMs } : old;
  entry.count++; entries.set(key, entry);
  return { allowed: entry.count <= max, retryAfter: Math.ceil((entry.reset - now) / 1000) };
}
