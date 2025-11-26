// @ts-nocheck
/**
 * health-check - Vérification de santé du système
 *
 * 🔒 SÉCURISÉ: Public (monitoring) + Rate limit IP 30/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const SUPABASE_LATENCY_SLO_MS = 1200;

type ProviderQuota = {
  configured: boolean;
  remaining: number | null;
  limit: number | null;
  resetAt: string | null;
};

const parseNumber = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildQuota = (prefix: string): ProviderQuota => ({
  configured: Boolean(Deno.env.get(`${prefix}_API_KEY`)),
  remaining: parseNumber(Deno.env.get(`${prefix}_QUOTA_REMAINING`)),
  limit: parseNumber(Deno.env.get(`${prefix}_QUOTA_LIMIT`)),
  resetAt: Deno.env.get(`${prefix}_QUOTA_RESET_AT`) ?? null,
});

const resolveRelease = () =>
  Deno.env.get('SENTRY_RELEASE') ??
  Deno.env.get('VITE_APP_VERSION') ??
  Deno.env.get('VITE_COMMIT_SHA') ??
  Deno.env.get('GITHUB_SHA') ??
  Deno.env.get('VERCEL_GIT_COMMIT_SHA') ??
  'unversioned';

const resolveEnvironment = () =>
  Deno.env.get('SENTRY_ENVIRONMENT') ??
  Deno.env.get('ENVIRONMENT') ??
  Deno.env.get('NODE_ENV') ??
  'development';

const resolveRegion = () =>
  Deno.env.get('SUPABASE_REGION') ??
  Deno.env.get('FLY_REGION') ??
  Deno.env.get('VERCEL_REGION') ??
  'unknown';

serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Cache-Control': 'no-store, max-age=0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  // IP-based rate limiting for public health check
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   req.headers.get('cf-connecting-ip') ||
                   req.headers.get('x-real-ip') ||
                   'unknown';

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'health-check',
    userId: `ip:${clientIP}`,
    limit: 30,
    windowMs: 60_000,
    description: 'Health check - IP based rate limit',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Too many requests. Retry after ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  const timestamp = new Date().toISOString();
  const release = resolveRelease();
  const environment = resolveEnvironment();
  const region = resolveRegion();

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    let supabaseStatus: 'ok' | 'degraded' | 'error' | 'skipped' = 'skipped';
    let supabaseLatency: number | null = null;
    let supabaseError: string | null = null;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const start = performance.now();

      try {
        const { error } = await supabase.from('profiles').select('id', { head: true, count: 'exact' });
        supabaseLatency = Math.round(performance.now() - start);

        if (error) {
          supabaseStatus = 'error';
          supabaseError = (error.message ?? 'supabase_error').slice(0, 120);
        } else if (supabaseLatency > SUPABASE_LATENCY_SLO_MS) {
          supabaseStatus = 'degraded';
        } else {
          supabaseStatus = 'ok';
        }
      } catch (connectionError) {
        supabaseStatus = 'error';
        supabaseLatency = Math.round(performance.now() - start);
        if (connectionError instanceof Error) {
          supabaseError = connectionError.message.slice(0, 120);
        } else {
          supabaseError = 'unknown_error';
        }
      }
    }

    const providers = {
      openai: buildQuota('OPENAI'),
      hume: buildQuota('HUME'),
      music: {
        configured: Boolean(Deno.env.get('MUSIC_API_KEY')),
        remaining: parseNumber(Deno.env.get('MUSIC_API_QUOTA_REMAINING')),
        limit: parseNumber(Deno.env.get('MUSIC_API_QUOTA_LIMIT')),
        resetAt: Deno.env.get('MUSIC_API_QUOTA_RESET_AT') ?? null,
      },
      fal: {
        configured: Boolean(Deno.env.get('FAL_AI_API_KEY')),
        remaining: parseNumber(Deno.env.get('FAL_AI_QUOTA_REMAINING')),
        limit: parseNumber(Deno.env.get('FAL_AI_QUOTA_LIMIT')),
        resetAt: Deno.env.get('FAL_AI_QUOTA_RESET_AT') ?? null,
      },
    };

    const essentialProviders: Array<keyof typeof providers> = ['openai'];
    const missingEssentialProvider = essentialProviders.some((provider) => !providers[provider].configured);

    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    if (supabaseStatus === 'error' || missingEssentialProvider) {
      overallStatus = 'unhealthy';
    } else if (supabaseStatus === 'degraded') {
      overallStatus = 'degraded';
    }

    const body = {
      status: overallStatus,
      timestamp,
      release,
      environment,
      region,
      checks: {
        supabase: {
          status: supabaseStatus,
          latencyMs: supabaseLatency,
          error: supabaseError,
        },
      },
      providers,
      meta: {
        uptimeSeconds: parseNumber(Deno.env.get('RUNTIME_UPTIME_SECONDS')),
      },
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 206 : 503;

    if (overallStatus !== 'healthy') {
      console.warn('health-check degraded', {
        status: overallStatus,
        supabaseStatus,
        missingEssentialProvider,
      });
    }

    return new Response(JSON.stringify(body), {
      status: statusCode,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Health-Status': overallStatus,
        'X-Health-Region': region,
        'X-Health-Release': release,
      },
    });
  } catch (error) {
    const sanitizedError = error instanceof Error ? error.message : 'unknown_error';
    console.error('health-check failure', sanitizedError);

    return new Response(
      JSON.stringify({
        status: 'unhealthy',
        timestamp,
        release,
        environment,
        region,
        error: sanitizedError,
      }),
      {
        status: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Health-Status': 'unhealthy',
          'X-Health-Region': region,
          'X-Health-Release': release,
        },
      },
    );
  }
});
