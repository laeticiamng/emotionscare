// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
