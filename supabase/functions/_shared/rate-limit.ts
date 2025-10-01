// @ts-nocheck
import { logAccess } from './logging.ts';
import { hash } from './hash_user.ts';

interface RateBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitOptions {
  route: string;
  userId?: string | null;
  /** Default requests allowed within the window */
  limit?: number;
  /** Window length in milliseconds */
  windowMs?: number;
  /** Additional context stored alongside the audit log entry */
  description?: string;
}

export interface RateLimitDecision {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
  identifier: string;
  hashedUserId: string | null;
  hashedIp: string | null;
}

const buckets = new Map<string, RateBucket>();

const RATE_LIMIT_PREFIX = 'EDGE_RATE_LIMIT_';
const RATE_WINDOW_PREFIX = 'EDGE_RATE_WINDOW_';

const DEFAULT_LIMIT = 30;
const DEFAULT_WINDOW = 60_000;

function toEnvKey(route: string): string {
  return route
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '') || 'DEFAULT';
}

function coercePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function resolveLimit(routeKey: string, fallback: number): number {
  const envKey = `${RATE_LIMIT_PREFIX}${toEnvKey(routeKey)}`;
  return coercePositiveInt(Deno.env.get(envKey), fallback);
}

function resolveWindow(routeKey: string, fallback: number): number {
  const envKey = `${RATE_WINDOW_PREFIX}${toEnvKey(routeKey)}`;
  return coercePositiveInt(Deno.env.get(envKey), fallback);
}

function extractClientIp(req: Request): string | null {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const candidate = forwarded.split(',')[0]?.trim();
    if (candidate) {
      return candidate;
    }
  }

  const cfConnecting = req.headers.get('cf-connecting-ip');
  if (cfConnecting) {
    return cfConnecting.trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return null;
}

async function logRateLimitDenial(route: string, hashedUserId: string | null, hashedIp: string | null, description?: string) {
  try {
    await logAccess({
      user_id: hashedUserId,
      route,
      action: 'rate_limit',
      result: 'denied',
      ip_address: hashedIp,
      user_agent: 'redacted',
      details: description ?? null,
    });
  } catch (error) {
    console.warn('[rate-limit] failed to persist audit log', error);
  }
}

export async function enforceEdgeRateLimit(
  req: Request,
  options: RateLimitOptions,
): Promise<RateLimitDecision> {
  const routeKey = options.route.trim().toLowerCase() || 'unnamed-route';
  const limit = resolveLimit(routeKey, options.limit ?? DEFAULT_LIMIT);
  const windowMs = resolveWindow(routeKey, options.windowMs ?? DEFAULT_WINDOW);
  const now = Date.now();

  const ip = extractClientIp(req);
  const hashedIp = ip ? hash(ip) : null;
  const hashedUserId = options.userId ? hash(options.userId) : null;
  const identifier = hashedUserId ?? hashedIp ?? 'anonymous';
  const bucketKey = `${routeKey}:${identifier}`;

  const retrySecondsFromNow = (resetAt: number) => Math.max(1, Math.ceil((resetAt - now) / 1000));
  const toDecision = (
    allowed: boolean,
    bucket: RateBucket,
    remaining: number,
  ): RateLimitDecision => ({
    allowed,
    limit,
    remaining: Math.max(0, remaining),
    resetAt: Math.floor(bucket.resetAt / 1000),
    retryAfterSeconds: retrySecondsFromNow(bucket.resetAt),
    identifier,
    hashedUserId,
    hashedIp,
  });

  const existing = buckets.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    const bucket = { count: 1, resetAt };
    buckets.set(bucketKey, bucket);
    return toDecision(true, bucket, limit - 1);
  }

  if (existing.count >= limit) {
    await logRateLimitDenial(routeKey, hashedUserId, hashedIp, options.description);
    console.warn('[rate-limit] request denied', {
      route: routeKey,
      identifier,
      limit,
      windowMs,
    });
    return toDecision(false, existing, 0);
  }

  existing.count += 1;
  buckets.set(bucketKey, existing);
  return toDecision(true, existing, limit - existing.count);
}

export function buildRateLimitResponse(
  decision: RateLimitDecision,
  baseHeaders: Record<string, string>,
  overrides?: {
    errorCode?: string;
    message?: string;
    additionalHeaders?: Record<string, string>;
  },
): Response {
  const payload = {
    error: overrides?.errorCode ?? 'rate_limited',
    message: overrides?.message ?? 'Too many requests',
    retry_after: decision.retryAfterSeconds,
  };

  return new Response(JSON.stringify(payload), {
    status: 429,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
      'Retry-After': String(decision.retryAfterSeconds),
      'RateLimit-Limit': String(decision.limit),
      'RateLimit-Remaining': String(Math.max(0, decision.remaining)),
      'RateLimit-Reset': String(decision.resetAt),
      ...(overrides?.additionalHeaders ?? {}),
    },
  });
}

export function resetEdgeRateLimits() {
  buckets.clear();
}

export type { RateLimitDecision as EdgeRateLimitDecision };
