import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { enforceEdgeRateLimit } from '../_shared/rate-limit.ts';

const baseHeaders = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...baseHeaders,
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
        'access-control-allow-methods': 'POST,OPTIONS',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: baseHeaders,
    });
  }

  // IP-based rate limiting for health check
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                   req.headers.get('x-real-ip') || 'unknown';
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'health-edge',
    userId: `ip:${clientIp}`,
    limit: 60,
    windowMs: 60_000,
    description: 'Health check endpoint',
  });

  if (!rateLimit.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: baseHeaders,
    });
  }

  return new Response(
    JSON.stringify({ ok: true, ts: new Date().toISOString() }),
    {
      status: 200,
      headers: baseHeaders,
    },
  );
});
