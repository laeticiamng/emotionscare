// @ts-ignore
/**
 * trigger-webhooks - Déclenchement de webhooks RGPD
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

serve(async (req: Request) => {
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

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'trigger-webhooks',
    userId: user.id,
    limit: 20,
    windowMs: 60_000,
    description: 'Webhook triggering - Admin only',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { eventType, data } = await req.json();
    console.log('Triggering webhooks for event:', eventType);

    // Récupérer tous les webhooks actifs pour cet événement
    const { data: webhooks, error: webhooksError } = await supabase
      .from('gdpr_webhooks')
      .select('*')
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (webhooksError) throw webhooksError;

    if (!webhooks || webhooks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, triggered: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Déclencher tous les webhooks en parallèle
    for (const webhook of webhooks) {
      try {
        const payload = {
          event: eventType,
          timestamp: new Date().toISOString(),
          data,
          webhook_id: webhook.id,
        };

        const webhookResponse = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': await generateSignature(webhook.secret, payload),
            'X-Event-Type': eventType,
          },
          body: JSON.stringify(payload),
        });

        const success = webhookResponse.ok;
        const statusCode = webhookResponse.status;

        // Logger le résultat
        await supabase.from('webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload,
          status_code: statusCode,
          success,
          response_body: success ? null : await webhookResponse.text(),
        });

        // Mettre à jour le compteur
        await supabase
          .from('gdpr_webhooks')
          .update({
            last_triggered_at: new Date().toISOString(),
            trigger_count: webhook.trigger_count + 1,
          })
          .eq('id', webhook.id);

        results.push({ webhook_id: webhook.id, success, statusCode });
      } catch (error: any) {
        console.error(`Webhook ${webhook.id} failed:`, error);
        
        await supabase.from('webhook_logs').insert({
          webhook_id: webhook.id,
          event_type: eventType,
          payload: data,
          success: false,
          error_message: error.message,
        });

        results.push({ webhook_id: webhook.id, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        triggered: webhooks.length,
        results,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in trigger-webhooks:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateSignature(secret: string, payload: any): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload) + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
