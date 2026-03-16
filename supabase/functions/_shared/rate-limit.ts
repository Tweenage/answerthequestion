// In-memory sliding-window rate limiter for Supabase Edge Functions (Deno).
// Tracks request timestamps per IP and rejects bursts that exceed the limit.
//
// NOTE: State resets on cold start, but this still protects against burst attacks
// within a single function instance.

/** Per-IP record: array of request timestamps (ms) within the current window. */
const store = new Map<string, number[]>();

/** Interval handle for periodic cleanup (created lazily on first call). */
let cleanupScheduled = false;

const CLEANUP_INTERVAL_MS = 60_000; // run cleanup every 60 s

/**
 * Remove entries whose timestamps are entirely outside any reasonable window.
 * Called periodically to prevent unbounded memory growth.
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [ip, timestamps] of store) {
    // Keep only timestamps from the last 10 minutes (covers the largest
    // window we expect to use). Individual checks filter more tightly.
    const cutoff = now - 10 * 60_000;
    const fresh = timestamps.filter((t) => t > cutoff);
    if (fresh.length === 0) {
      store.delete(ip);
    } else {
      store.set(ip, fresh);
    }
  }
}

function ensureCleanup(): void {
  if (!cleanupScheduled) {
    cleanupScheduled = true;
    setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS);
  }
}

/**
 * Extract the client IP from standard proxy headers.
 * Falls back to `'unknown'` when no header is present.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; first entry is the client
    const first = forwarded.split(',')[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

export interface RateLimitResult {
  allowed: boolean;
  /** Milliseconds the caller should wait before retrying (present when blocked). */
  retryAfterMs?: number;
}

/**
 * Sliding-window rate limit check.
 *
 * @param ip      - Client identifier (typically an IP address).
 * @param limit   - Maximum number of requests allowed within `windowMs`.
 * @param windowMs - Length of the sliding window in milliseconds.
 */
export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  ensureCleanup();

  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing timestamps and filter to current window
  const timestamps = (store.get(ip) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= limit) {
    // Find when the oldest request in the window expires
    const oldest = timestamps[0];
    const retryAfterMs = oldest + windowMs - now;
    // Update store with filtered list (no new entry added)
    store.set(ip, timestamps);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1) };
  }

  // Allow the request — record its timestamp
  timestamps.push(now);
  store.set(ip, timestamps);
  return { allowed: true };
}
