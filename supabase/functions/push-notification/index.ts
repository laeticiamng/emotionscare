import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushPayload {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  click_action?: string;
  data?: Record<string, unknown>;
  type?: string;
  priority?: 'high' | 'normal';
}

interface WebPushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Utilitaire pour encoder en base64url
function base64UrlEncode(data: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Utilitaire pour décoder base64url
function base64UrlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  const binary = atob(base64 + padding);
  return new Uint8Array([...binary].map(c => c.charCodeAt(0)));
}

// Générer les headers VAPID pour Web Push
async function generateVapidHeaders(
  audience: string,
  subject: string,
  publicKey: string,
  privateKey: string
): Promise<{ authorization: string; cryptoKey: string }> {
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 heures
    sub: subject,
  };

  const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  // Importer la clé privée
  const privateKeyData = base64UrlDecode(privateKey);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  // Signer le token
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const jwt = `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;

  return {
    authorization: `vapid t=${jwt}, k=${publicKey}`,
    cryptoKey: publicKey,
  };
}

// Envoyer une notification Web Push
async function sendWebPush(
  subscription: WebPushSubscription,
  payload: PushPayload,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const url = new URL(subscription.endpoint);
    const audience = `${url.protocol}//${url.host}`;

    const vapidHeaders = await generateVapidHeaders(
      audience,
      vapidSubject,
      vapidPublicKey,
      vapidPrivateKey
    );

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body || '',
      icon: payload.icon || '/icon-192x192.png',
      badge: payload.badge || '/badge-96x96.png',
      data: {
        ...payload.data,
        click_action: payload.click_action || '/',
        timestamp: new Date().toISOString(),
      },
    });

    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400',
        'Urgency': payload.priority === 'high' ? 'high' : 'normal',
        'Authorization': vapidHeaders.authorization,
      },
      body: new TextEncoder().encode(notificationPayload),
    });

    if (response.ok || response.status === 201) {
      return { success: true, messageId: `webpush-${Date.now()}` };
    }

    const errorText = await response.text();
    return { success: false, error: `HTTP ${response.status}: ${errorText}` };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Envoyer une notification FCM
async function sendFCM(
  token: string,
  payload: PushPayload,
  fcmApiKey: string
): Promise<{ success: boolean; messageId?: string; error?: string; invalidToken?: boolean }> {
  try {
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Authorization': `key=${fcmApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: payload.title,
          body: payload.body || '',
          icon: payload.icon || '/icon-192x192.png',
          badge: payload.badge || '/badge-96x96.png',
          click_action: payload.click_action || '/',
        },
        data: {
          ...payload.data,
          type: payload.type || 'notification',
          timestamp: new Date().toISOString(),
        },
        priority: payload.priority || 'high',
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success === 1) {
      return { success: true, messageId: data.message_id };
    }

    const errorCode = data.results?.[0]?.error;
    const invalidToken = ['InvalidRegistration', 'NotRegistered', 'InvalidRegistrationToken'].includes(errorCode);
    
    return { 
      success: false, 
      error: errorCode || 'Unknown FCM error',
      invalidToken 
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// Envoyer une notification APNs (Apple)
async function sendAPNs(
  deviceToken: string,
  payload: PushPayload,
  apnsKeyId: string,
  apnsTeamId: string,
  apnsPrivateKey: string,
  bundleId: string,
  production = true
): Promise<{ success: boolean; messageId?: string; error?: string; invalidToken?: boolean }> {
  try {
    const host = production 
      ? 'api.push.apple.com' 
      : 'api.sandbox.push.apple.com';

    // Générer JWT pour APNs
    const header = { alg: 'ES256', kid: apnsKeyId };
    const claims = {
      iss: apnsTeamId,
      iat: Math.floor(Date.now() / 1000),
    };

    const encodedHeader = base64UrlEncode(new TextEncoder().encode(JSON.stringify(header)));
    const encodedClaims = base64UrlEncode(new TextEncoder().encode(JSON.stringify(claims)));
    const unsignedToken = `${encodedHeader}.${encodedClaims}`;

    const privateKeyData = base64UrlDecode(apnsPrivateKey);
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyData,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      cryptoKey,
      new TextEncoder().encode(unsignedToken)
    );

    const jwt = `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;

    const apnsPayload = {
      aps: {
        alert: {
          title: payload.title,
          body: payload.body || '',
        },
        badge: 1,
        sound: 'default',
      },
      ...payload.data,
    };

    const response = await fetch(`https://${host}/3/device/${deviceToken}`, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${jwt}`,
        'apns-topic': bundleId,
        'apns-push-type': 'alert',
        'apns-priority': payload.priority === 'high' ? '10' : '5',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apnsPayload),
    });

    if (response.ok) {
      const apnsId = response.headers.get('apns-id');
      return { success: true, messageId: apnsId || `apns-${Date.now()}` };
    }

    const error = await response.json();
    const invalidToken = ['BadDeviceToken', 'Unregistered', 'ExpiredToken'].includes(error.reason);
    
    return { 
      success: false, 
      error: error.reason || 'Unknown APNs error',
      invalidToken 
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

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

    // Configuration des services
    const fcmApiKey = Deno.env.get('FIREBASE_FCM_API_KEY');
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@emotionscare.com';
    const apnsKeyId = Deno.env.get('APNS_KEY_ID');
    const apnsTeamId = Deno.env.get('APNS_TEAM_ID');
    const apnsPrivateKey = Deno.env.get('APNS_PRIVATE_KEY');
    const apnsBundleId = Deno.env.get('APNS_BUNDLE_ID') || 'com.emotionscare.app';
    const apnsProduction = Deno.env.get('APNS_PRODUCTION') !== 'false';

    // POST /push-notification/register - Enregistrer un token de notification
    if (method === 'POST' && body.token) {
      const { data, error } = await supabaseClient
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          token: body.token,
          device_type: body.device_type || 'web',
          platform: body.platform || 'unknown',
          updated_at: new Date().toISOString(),
          enabled: true,
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
      const targetUserId = body.userId || user.id;
      
      // Récupérer les tokens de l'utilisateur cible
      const { data: subscriptions, error: subError } = await supabaseClient
        .from('push_subscriptions')
        .select('token, device_type, platform')
        .eq('user_id', targetUserId)
        .eq('enabled', true);

      if (subError) throw subError;

      if (!subscriptions || subscriptions.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: 'No active push subscriptions found',
          sent: 0,
          total: 0,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const payload: PushPayload = {
        title: body.title,
        body: body.body,
        icon: body.icon,
        badge: body.badge,
        click_action: body.click_action,
        data: body.data,
        type: body.type,
        priority: body.priority,
      };

      const results = [];
      const tokensToDisable: string[] = [];

      for (const sub of subscriptions) {
        let result: { success: boolean; messageId?: string; error?: string; invalidToken?: boolean };

        // Détecter le type de token et envoyer via le bon service
        const isWebPush = sub.token.startsWith('{') || sub.token.includes('endpoint');
        const isAPNs = sub.platform === 'ios' || sub.device_type === 'ios';

        if (isWebPush && vapidPublicKey && vapidPrivateKey) {
          // Web Push
          try {
            const subscription: WebPushSubscription = typeof sub.token === 'string' 
              ? JSON.parse(sub.token) 
              : sub.token;
            result = await sendWebPush(subscription, payload, vapidPublicKey, vapidPrivateKey, vapidSubject);
          } catch {
            result = { success: false, error: 'Invalid Web Push subscription format' };
          }
        } else if (isAPNs && apnsKeyId && apnsTeamId && apnsPrivateKey) {
          // Apple Push Notification Service
          result = await sendAPNs(
            sub.token, 
            payload, 
            apnsKeyId, 
            apnsTeamId, 
            apnsPrivateKey, 
            apnsBundleId, 
            apnsProduction
          );
        } else if (fcmApiKey) {
          // Firebase Cloud Messaging
          result = await sendFCM(sub.token, payload, fcmApiKey);
        } else {
          result = { success: false, error: 'No push notification service configured' };
        }

        if (result.invalidToken) {
          tokensToDisable.push(sub.token);
        }

        results.push({
          token: sub.token.substring(0, 20) + '...',
          platform: sub.platform || sub.device_type,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        });
      }

      // Désactiver les tokens invalides
      if (tokensToDisable.length > 0) {
        await supabaseClient
          .from('push_subscriptions')
          .update({ enabled: false })
          .in('token', tokensToDisable);
      }

      const successCount = results.filter(r => r.success).length;

      // Logger l'envoi
      console.log(`[Push] Sent to ${successCount}/${subscriptions.length} devices for user ${targetUserId}`);

      return new Response(JSON.stringify({
        success: successCount > 0,
        sent: successCount,
        total: subscriptions.length,
        disabled: tokensToDisable.length,
        results: results.slice(0, 10),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /push-notification/broadcast - Envoyer à plusieurs utilisateurs
    if (method === 'POST' && body.userIds && Array.isArray(body.userIds)) {
      const { userIds, title, ...rest } = body;

      const { data: subscriptions, error: subError } = await supabaseClient
        .from('push_subscriptions')
        .select('user_id, token, device_type, platform')
        .in('user_id', userIds)
        .eq('enabled', true);

      if (subError) throw subError;

      const payload: PushPayload = {
        title,
        body: rest.body,
        icon: rest.icon,
        badge: rest.badge,
        click_action: rest.click_action,
        data: rest.data,
        type: rest.type,
        priority: rest.priority,
      };

      let successCount = 0;
      const userResults: Record<string, { sent: number; total: number }> = {};

      for (const sub of subscriptions || []) {
        if (!userResults[sub.user_id]) {
          userResults[sub.user_id] = { sent: 0, total: 0 };
        }
        userResults[sub.user_id].total++;

        let success = false;
        const isWebPush = sub.token.startsWith('{') || sub.token.includes('endpoint');

        if (isWebPush && vapidPublicKey && vapidPrivateKey) {
          try {
            const subscription: WebPushSubscription = JSON.parse(sub.token);
            const result = await sendWebPush(subscription, payload, vapidPublicKey, vapidPrivateKey, vapidSubject);
            success = result.success;
          } catch {
            success = false;
          }
        } else if (fcmApiKey) {
          const result = await sendFCM(sub.token, payload, fcmApiKey);
          success = result.success;
        }

        if (success) {
          successCount++;
          userResults[sub.user_id].sent++;
        }
      }

      console.log(`[Push] Broadcast to ${Object.keys(userResults).length} users, ${successCount} total sent`);

      return new Response(JSON.stringify({
        success: successCount > 0,
        totalSent: successCount,
        totalDevices: subscriptions?.length || 0,
        usersReached: Object.keys(userResults).length,
        userResults,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /push-notification/status - Obtenir le statut des notifications
    if (method === 'GET') {
      const { data: subscriptions } = await supabaseClient
        .from('push_subscriptions')
        .select('device_type, platform, enabled, updated_at')
        .eq('user_id', user.id);

      const hasWebPush = !!(vapidPublicKey && vapidPrivateKey);
      const hasFCM = !!fcmApiKey;
      const hasAPNs = !!(apnsKeyId && apnsTeamId && apnsPrivateKey);

      return new Response(JSON.stringify({
        enabled: (subscriptions || []).some(s => s.enabled),
        subscriptions: subscriptions || [],
        services: {
          webPush: hasWebPush,
          fcm: hasFCM,
          apns: hasAPNs,
        },
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
    console.error('[Push] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
