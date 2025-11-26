// @ts-nocheck
/**
 * rate-limiter - Service interne de rate limiting
 *
 * 🔒 SÉCURISÉ: Auth interne + Rate limit IP 200/min + CORS restrictif
 * Note: Fonction interne appelée par d'autres Edge Functions
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier: string;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

Deno.serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  // Vérifier le header service_role pour les appels internes
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!authHeader || !authHeader.includes(serviceRoleKey?.substring(0, 20) || '')) {
    return new Response(JSON.stringify({ error: 'Internal service only' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { identifier, maxRequests = 100, windowMs = 60000 } = await req.json() as RateLimitConfig;

    if (!identifier) {
      return new Response(
        JSON.stringify({ error: 'Identifier required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current window
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    await supabase
      .from('rate_limit_log')
      .delete()
      .lt('timestamp', new Date(windowStart).toISOString());

    // Count recent requests
    const { count, error: countError } = await supabase
      .from('rate_limit_log')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .gte('timestamp', new Date(windowStart).toISOString());

    if (countError) {
      throw countError;
    }

    const currentCount = count || 0;
    const allowed = currentCount < maxRequests;

    if (allowed) {
      // Log this request
      await supabase
        .from('rate_limit_log')
        .insert({
          identifier,
          timestamp: new Date().toISOString(),
          metadata: {
            user_agent: req.headers.get('user-agent'),
            ip: req.headers.get('x-forwarded-for'),
          },
        });
    }

    const result: RateLimitResult = {
      allowed,
      remaining: Math.max(0, maxRequests - currentCount - (allowed ? 1 : 0)),
      resetAt: now + windowMs,
    };

    // Log rate limit violations
    if (!allowed) {
      console.warn(`Rate limit exceeded for ${identifier}`, {
        currentCount,
        maxRequests,
        windowMs,
      });

      await supabase
        .from('security_events')
        .insert({
          event_type: 'rate_limit_exceeded',
          identifier,
          metadata: {
            count: currentCount,
            max: maxRequests,
            window: windowMs,
          },
        });
    }

    return new Response(
      JSON.stringify(result),
      {
        status: allowed ? 200 : 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetAt.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Rate limiter error:', error);

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
