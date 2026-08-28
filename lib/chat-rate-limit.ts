import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 5 * 60;
const REQUEST_LIMIT = 12;

type RateEntry = { count: number; resetAt: number };
type RateStore = Map<string, RateEntry>;

const localStoreHost = globalThis as typeof globalThis & {
  __reyyPortfolioChatRateStore?: RateStore;
};

const localRateStore = localStoreHost.__reyyPortfolioChatRateStore ?? new Map<string, RateEntry>();
localStoreHost.__reyyPortfolioChatRateStore = localRateStore;

let distributedRateLimiter: Ratelimit | null | undefined;

function getDistributedRateLimiter() {
  if (distributedRateLimiter !== undefined) return distributedRateLimiter;

  const hasConfiguration = Boolean(
    process.env.UPSTASH_REDIS_REST_URL
    && process.env.UPSTASH_REDIS_REST_TOKEN
    && process.env.CHAT_RATE_LIMIT_SALT,
  );
  if (!hasConfiguration) {
    distributedRateLimiter = null;
    return distributedRateLimiter;
  }

  distributedRateLimiter = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(REQUEST_LIMIT, `${WINDOW_SECONDS} s`),
    prefix: "reyy-portfolio-chat",
    analytics: false,
  });
  return distributedRateLimiter;
}

function checkLocalRateLimit(identifier: string) {
  const now = Date.now();

  if (localRateStore.size > 500) {
    for (const [key, entry] of localRateStore) {
      if (entry.resetAt <= now) localRateStore.delete(key);
    }
  }

  const existing = localRateStore.get(identifier);
  if (!existing || existing.resetAt <= now) {
    localRateStore.set(identifier, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= REQUEST_LIMIT) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export async function checkChatRateLimit(identifier: string) {
  const limiter = getDistributedRateLimiter();
  if (!limiter) return checkLocalRateLimit(identifier);

  try {
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[chat-rate-limit] Falling back to the local limiter.", error instanceof Error ? error.message : error);
    return checkLocalRateLimit(identifier);
  }
}
