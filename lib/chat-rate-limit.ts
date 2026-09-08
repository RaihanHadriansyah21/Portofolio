import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Chat rate limiter defaults (5 minutes, 12 messages)
const CHAT_WINDOW_SECONDS = 5 * 60;
const CHAT_REQUEST_LIMIT = 12;

// Lead/Contact form rate limiter defaults (1 hour window, 5 submissions)
// Recruiter rationale: A legitimate recruiter or collaborator sends 1 message, or occasionally 2.
// 5 submissions per hour is a safe upper bound that stops automated form spam while protecting Resend and Supabase.
const LEAD_WINDOW_SECONDS = Number(process.env.LEAD_RATE_LIMIT_WINDOW_SECONDS || 3600);
const LEAD_REQUEST_LIMIT = Number(process.env.LEAD_RATE_LIMIT_MAX_REQUESTS || 5);

type RateEntry = { count: number; resetAt: number };
type RateStore = Map<string, RateEntry>;

const localStoreHost = globalThis as typeof globalThis & {
  __reyyPortfolioChatRateStore?: RateStore;
  __reyyPortfolioLeadRateStore?: RateStore;
};

const localChatRateStore = localStoreHost.__reyyPortfolioChatRateStore ?? new Map<string, RateEntry>();
localStoreHost.__reyyPortfolioChatRateStore = localChatRateStore;

const localLeadRateStore = localStoreHost.__reyyPortfolioLeadRateStore ?? new Map<string, RateEntry>();
localStoreHost.__reyyPortfolioLeadRateStore = localLeadRateStore;

let distributedChatRateLimiter: Ratelimit | null | undefined;
let distributedLeadRateLimiter: Ratelimit | null | undefined;

function getRedisCredentials() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token || !process.env.CHAT_RATE_LIMIT_SALT) return null;
  return { url, token };
}

function getDistributedChatRateLimiter() {
  if (distributedChatRateLimiter !== undefined) return distributedChatRateLimiter;

  const credentials = getRedisCredentials();
  if (!credentials) {
    distributedChatRateLimiter = null;
    return distributedChatRateLimiter;
  }

  distributedChatRateLimiter = new Ratelimit({
    redis: new Redis(credentials),
    limiter: Ratelimit.slidingWindow(CHAT_REQUEST_LIMIT, `${CHAT_WINDOW_SECONDS} s`),
    prefix: "reyy-portfolio-chat",
    analytics: false,
  });
  return distributedChatRateLimiter;
}

function getDistributedLeadRateLimiter() {
  if (distributedLeadRateLimiter !== undefined) return distributedLeadRateLimiter;

  const credentials = getRedisCredentials();
  if (!credentials) {
    distributedLeadRateLimiter = null;
    return distributedLeadRateLimiter;
  }

  distributedLeadRateLimiter = new Ratelimit({
    redis: new Redis(credentials),
    limiter: Ratelimit.slidingWindow(LEAD_REQUEST_LIMIT, `${LEAD_WINDOW_SECONDS} s`),
    prefix: "reyy-portfolio-lead",
    analytics: false,
  });
  return distributedLeadRateLimiter;
}

function checkLocalChatRateLimit(identifier: string) {
  const now = Date.now();

  if (localChatRateStore.size > 500) {
    for (const [key, entry] of localChatRateStore) {
      if (entry.resetAt <= now) localChatRateStore.delete(key);
    }
  }

  const existing = localChatRateStore.get(identifier);
  if (!existing || existing.resetAt <= now) {
    localChatRateStore.set(identifier, { count: 1, resetAt: now + CHAT_WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= CHAT_REQUEST_LIMIT) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function checkLocalLeadRateLimit(identifier: string) {
  const now = Date.now();

  if (localLeadRateStore.size > 500) {
    for (const [key, entry] of localLeadRateStore) {
      if (entry.resetAt <= now) localLeadRateStore.delete(key);
    }
  }

  const existing = localLeadRateStore.get(identifier);
  if (!existing || existing.resetAt <= now) {
    localLeadRateStore.set(identifier, { count: 1, resetAt: now + LEAD_WINDOW_SECONDS * 1000 });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= LEAD_REQUEST_LIMIT) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "127.0.0.1";
}

export async function getClientRateLimitIdentifier(request: Request): Promise<string> {
  const ip = extractClientIp(request);
  const salt = process.env.CHAT_RATE_LIMIT_SALT || process.env.SUPABASE_URL || "reyy-portfolio-salt";
  const data = new TextEncoder().encode(ip + ":" + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function checkChatRateLimit(identifier: string) {
  const limiter = getDistributedChatRateLimiter();
  if (!limiter) return checkLocalChatRateLimit(identifier);

  try {
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[chat-rate-limit] Falling back to local limiter.", error instanceof Error ? error.message : error);
    return checkLocalChatRateLimit(identifier);
  }
}

export async function checkLeadRateLimit(identifier: string) {
  const limiter = getDistributedLeadRateLimiter();
  if (!limiter) return checkLocalLeadRateLimit(identifier);

  try {
    const result = await limiter.limit(identifier);
    return {
      allowed: result.success,
      retryAfter: result.success ? 0 : Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)),
    };
  } catch (error) {
    console.error("[lead-rate-limit] Falling back to local limiter.", error instanceof Error ? error.message : error);
    return checkLocalLeadRateLimit(identifier);
  }
}
