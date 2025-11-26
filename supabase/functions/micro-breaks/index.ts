// @ts-nocheck
/**
 * micro-breaks - Sessions de micro-pauses bien-être
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 30/min + CORS restrictif
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.4';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
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

  const { user, status } = await authorizeRole(req, ['b2c', 'b2b_user', 'b2b_admin', 'admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'micro-breaks',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Micro-breaks sessions',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const payload = await req.json();
    const { action } = payload;

    if (action === 'start') {
      console.log('Screen-Silk session started:', payload);
      
      return new Response(
        JSON.stringify({ ok: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'stop') {
      const { pattern, duration_sec, events, hrv, self_report } = payload;
      
      let hrv_summary = null;
      if (hrv?.rr_during_ms?.length > 1) {
        const rr_intervals = hrv.rr_during_ms;
        const differences = [];
        for (let i = 1; i < rr_intervals.length; i++) {
          differences.push(Math.pow(rr_intervals[i] - rr_intervals[i-1], 2));
        }
        const rmssd = Math.sqrt(differences.reduce((a, b) => a + b, 0) / differences.length);
        
        hrv_summary = {
          rmssd: rmssd,
          sample_count: rr_intervals.length,
          quality: rr_intervals.length >= 30 ? 'good' : 'fair'
        };
      }

      const { error } = await supabase
        .from('analytics_events')
        .insert({
          event_type: 'silk.session.complete',
          event_data: {
            pattern,
            duration_sec,
            events_count: events.length,
            hrv_summary,
            self_report,
            timestamp: Date.now()
          }
        });

      return new Response(
        JSON.stringify({ 
          ok: true, 
          badge_id: 'silk_break',
          message: 'Beau reset ✨'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in micro-breaks function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});