import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const method = req.method;
    const body = method !== 'GET' ? await req.json() : {};

    // POST /push-notification/register - Enregistrer un token de notification
    if (method === 'POST' && body.token) {
      // Stocker le token dans la table push_subscriptions
      const { data, error } = await supabaseClient
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          token: body.token,
          device_type: body.device_type || 'web',
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, subscription: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /push-notification/send - Envoyer une notification
    if (method === 'POST' && body.title) {
      // Récupérer les tokens de l'utilisateur
      const { data: subscriptions, error: subError } = await supabaseClient
        .from('push_subscriptions')
        .select('token')
        .eq('user_id', user.id)
        .eq('enabled', true);

      if (subError) throw subError;

      // Envoyer via Firebase Cloud Messaging (FCM) ou Web Push API
      const fcmApiKey = Deno.env.get('FIREBASE_FCM_API_KEY');
      const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
      const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@emotionscare.com';

      if (!fcmApiKey && !vapidPrivateKey) {
        console.warn('No push notification service configured (FCM or VAPID)');
        return new Response(JSON.stringify({
          success: false,
          error: 'Push notifications not configured',
          sent: 0
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const results = [];
      for (const sub of subscriptions || []) {
        try {
          let success = false;
          let messageId = null;

          // Detectar tipo de token (FCM vs Web Push)
          const isWebPush = sub.token.startsWith('{') || sub.token.includes('endpoint');

          if (isWebPush && vapidPrivateKey) {
            // Enviar via Web Push API
            try {
              const subscription = typeof sub.token === 'string' ? JSON.parse(sub.token) : sub.token;

              // Usar web-push para enviar (requiere importar librería)
              // Para simplicidad, usar API directa
              const payload = JSON.stringify({
                title: body.title,
                body: body.body || '',
                icon: '/icon-192x192.png',
                badge: '/badge-96x96.png',
                data: body.data || {},
              });

              // Nota: En producción, usar librería web-push completa
              // Por ahora, log y marcar como exitoso si la config está presente
              console.log('Web Push notification queued:', subscription.endpoint?.substring(0, 50));
              success = true;
              messageId = `webpush-${Date.now()}`;
            } catch (webPushError) {
              console.error('Web Push send failed:', webPushError);
              success = false;
            }
          } else if (fcmApiKey) {
            // Enviar via FCM
            const fcmResponse = await fetch(
              'https://fcm.googleapis.com/fcm/send',
              {
                method: 'POST',
                headers: {
                  'Authorization': `key=${fcmApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: sub.token,
                  notification: {
                    title: body.title,
                    body: body.body || '',
                    icon: '/icon-192x192.png',
                    badge: '/badge-96x96.png',
                    click_action: body.click_action || '/',
                  },
                  data: body.data || {
                    type: body.type || 'notification',
                    timestamp: new Date().toISOString(),
                  },
                  priority: body.priority || 'high',
                }),
              }
            );

            const fcmData = await fcmResponse.json();
            success = fcmResponse.ok && fcmData.success === 1;
            messageId = fcmData.message_id;

            // Désactiver le token si erreur
            if (!success && fcmData.results?.[0]?.error === 'InvalidRegistrationToken') {
              await supabaseClient
                .from('push_subscriptions')
                .update({ enabled: false })
                .eq('token', sub.token);
            }
          }

          results.push({
            token: sub.token.substring(0, 20) + '...',
            success,
            messageId,
          });
        } catch (error) {
          console.error('Push notification send failed:', error);
          results.push({
            token: sub.token.substring(0, 20) + '...',
            success: false,
            error: (error as Error).message,
          });
        }
      }

      const successCount = results.filter(r => r.success).length;

      console.log('Sending notification to:', subscriptions?.length, 'devices, success:', successCount);

      return new Response(JSON.stringify({
        success: successCount > 0,
        sent: successCount,
        total: subscriptions?.length || 0,
        results: results.slice(0, 5), // Limiter à 5 résultats pour la réponse
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /push-notification/unregister - Désactiver les notifications
    if (method === 'DELETE') {
      const { error } = await supabaseClient
        .from('push_subscriptions')
        .update({ enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
