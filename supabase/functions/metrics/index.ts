// @ts-nocheck
/**
 * metrics - Collecte de métriques anonymisées
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 60/min + CORS restrictif
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
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
    route: 'metrics',
    userId: user.id,
    limit: 60,
    windowMs: 60_000,
    description: 'Metrics collection',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();

    switch (endpoint) {
      case 'face_filter': {
        const { emotion, confidence, source, ts } = await req.json();
        
        // Store anonymized metrics
        const { error } = await supabase
          .from('analytics_events')
          .insert({
            event_type: 'ar.face.emotion',
            event_data: {
              emotion,
              confidence: confidence || null,
              source,
              timestamp: ts || Date.now()
            },
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Metrics storage error:', error);
          // Don't fail the request for metrics errors
        }

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'hr_ping': {
        const { source, bpm_avg, duration_sec } = await req.json();
        
        // Store anonymized HR metrics
        const { error } = await supabase
          .from('analytics_events')
          .insert({
            event_type: 'hr.widget.session',
            event_data: {
              source,
              bpm_avg: bpm_avg || null,
              duration_sec: duration_sec || null,
              timestamp: Date.now()
            },
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('HR metrics storage error:', error);
        }

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'general': {
        const { event_type, event_data } = await req.json();
        
        // Store general analytics event
        const { error } = await supabase
          .from('analytics_events')
          .insert({
            event_type,
            event_data: event_data || {},
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('General metrics storage error:', error);
        }

        return new Response(
          JSON.stringify({ ok: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid metrics endpoint' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error in metrics function:', error)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});