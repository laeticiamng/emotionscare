// @ts-nocheck
/**
 * Send Push Notification - Envoyer notifications Web Push
 *
 * 🔒 SÉCURISÉ: Auth user + Rate limit 30/min + CORS restrictif
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

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
    route: 'send-push-notification',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Push notification sending',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { userId, title, body, data } = await req.json();
    const vapidKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublic = Deno.env.get('VAPID_PUBLIC_KEY');

    if (!vapidKey || !vapidPublic) {
      throw new Error('VAPID keys not configured');
    }

    // Récupérer les subscriptions actives de l'utilisateur
    const { data: subscriptions, error } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    const results = [];
    for (const sub of subscriptions || []) {
      try {
        const subscriptionData = sub.subscription_data;
        
        // Envoyer via Web Push Protocol
        const response = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `vapid t=${generateVapidToken(vapidKey, vapidPublic, subscriptionData.endpoint)}, k=${vapidPublic}`
          },
          body: JSON.stringify({
            title,
            body,
            data,
            icon: '/icon-192x192.png',
            badge: '/badge-96x96.png'
          })
        });

        results.push({
          endpoint: sub.endpoint,
          success: response.ok,
          status: response.status
        });

        if (!response.ok) {
          // Désactiver subscription si erreur 410 (Gone)
          if (response.status === 410) {
            await supabaseClient
              .from('push_subscriptions')
              .update({ is_active: false })
              .eq('id', sub.id);
          }
        }
      } catch (error) {
        console.error('Push failed for endpoint:', sub.endpoint, error);
        results.push({
          endpoint: sub.endpoint,
          success: false,
          error: error.message
        });
      }
    }

    // Enregistrer dans l'historique
    await supabaseClient
      .from('notification_history')
      .insert({
        user_id: userId,
        notification_type: data?.type || 'general',
        title,
        body,
        was_sent: results.some(r => r.success),
        sent_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({
      success: true,
      results,
      totalSent: results.filter(r => r.success).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[send-push-notification]', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateVapidToken(privateKey: string, publicKey: string, endpoint: string): string {
  // Implémentation simplifiée - en production utiliser une lib VAPID complète
  return btoa(`${publicKey}:${endpoint}:${Date.now()}`);
}
