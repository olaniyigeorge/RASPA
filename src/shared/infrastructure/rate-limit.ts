import { TooManyRequestsError } from "../kernel/errors";

/**
 * Fixed-window rate limiting.
 *
 * The default store is in memory, so limits are per instance: on serverless they reset on a
 * cold start and are not shared across instances or regions. It still blunts single-client
 * abuse; swap in a shared store (Upstash/Redis) behind `RateLimitStore` for hard guarantees.
 */
export interface RateLimitStore {
  /** Count one hit against `key` in the current window; returns the hits so far and when it resets. */
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

export interface RateLimitOptions {
  /** Names the limited action, so different endpoints keep separate counters. */
  key: string;
  limit: number;
  windowMs: number;
}

function memoryStore(): RateLimitStore {
  const buckets = new Map<string, { count: number; resetAt: number }>();
  let lastPrune = Date.now();

  return {
    async hit(key, windowMs) {
      const now = Date.now();
      if (now - lastPrune > 60_000) {
        for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
        lastPrune = now;
      }
      const b = buckets.get(key);
      if (!b || b.resetAt <= now) {
        const fresh = { count: 1, resetAt: now + windowMs };
        buckets.set(key, fresh);
        return { ...fresh };
      }
      b.count += 1;
      return { ...b };
    },
  };
}

let store: RateLimitStore = memoryStore();

export const setRateLimitStore = (s: RateLimitStore) => {
  store = s;
};

/** First address in x-forwarded-for (set by the platform proxy); a shared bucket otherwise. */
export function clientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
}

/** Throws TooManyRequestsError once `id` exceeds the limit for this window. */
export async function rateLimitByKey(id: string, { key, limit, windowMs }: RateLimitOptions) {
  const { count, resetAt } = await store.hit(`${key}:${id}`, windowMs);
  if (count > limit) throw new TooManyRequestsError(Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)));
}

/** Route-handler form: limits by client IP. */
export const rateLimit = (req: Request, opts: RateLimitOptions) => rateLimitByKey(clientIp(req.headers), opts);
