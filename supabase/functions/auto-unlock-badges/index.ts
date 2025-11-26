// @ts-nocheck
/**
 * auto-unlock-badges - Déverrouillage automatique des badges via webhook
 *
 * 🔒 SÉCURISÉ: Webhook signature validation + Rate limit 30/min + CORS restrictif
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record: any;
}

Deno.serve(async (req) => {
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  console.log('[auto-unlock-badges] Request received', {
    timestamp: new Date().toISOString(),
    method: req.method,
  });

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  if (!corsResult.allowed) {
    return rejectCors(corsResult);
  }

  // Validate webhook secret for internal calls
  const webhookSecret = req.headers.get('x-webhook-secret');
  const expectedSecret = Deno.env.get('WEBHOOK_SECRET');
  if (!expectedSecret || webhookSecret !== expectedSecret) {
    console.warn('[auto-unlock-badges] Invalid webhook secret');
    return new Response(JSON.stringify({ error: 'Invalid webhook secret' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // IP-based rate limiting for webhooks
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'auto-unlock-badges',
    userId: `webhook:${clientIp}`,
    limit: 30,
    windowMs: 60_000,
    description: 'Auto unlock badges webhook',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: WebhookPayload = await req.json();
    console.log('[auto-unlock-badges] Webhook payload received', {
      type: payload.type,
      table: payload.table,
      record_id: payload.record?.id,
    });

    // Get user_id from the record
    const userId = payload.record?.user_id;
    if (!userId) {
      console.error('[auto-unlock-badges] No user_id in record');
      return new Response(
        JSON.stringify({ error: 'No user_id found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call the check_badge_unlock function
    console.log('[auto-unlock-badges] Checking badge unlock for user', { userId });
    const { error: functionError } = await supabase.rpc('check_badge_unlock', {
      p_user_id: userId,
    });

    if (functionError) {
      console.error('[auto-unlock-badges] Error checking badge unlock', {
        error: functionError,
        userId,
      });
      throw functionError;
    }

    // Check for near-completion challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', false);

    if (!challengesError && challenges) {
      for (const challenge of challenges) {
        const progress = (challenge.current_value / challenge.target_value) * 100;
        
        // If challenge is 80%+ complete, send notification
        if (progress >= 80 && progress < 100) {
          const { error: notifError } = await supabase
            .from('in_app_notifications')
            .insert({
              user_id: userId,
              type: 'challenge_near_completion',
              title: 'Presque terminé ! 🎯',
              message: `Encore ${challenge.target_value - challenge.current_value} pour terminer "${challenge.title}"`,
              data: { challenge_id: challenge.id, progress },
            });

          if (notifError) {
            console.error('[auto-unlock-badges] Error creating near-completion notification', notifError);
          }
        }
      }
    }

    console.log('[auto-unlock-badges] Badge check completed successfully', {
      userId,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[auto-unlock-badges] Fatal error', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});