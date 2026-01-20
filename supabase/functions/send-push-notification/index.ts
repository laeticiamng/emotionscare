/**
 * Send Push Notification - Envoyer notifications Web Push avec VAPID
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Inline validation to avoid zod import issues
interface PushNotificationInput {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  icon?: string;
  badge?: string;
}

function validatePushNotification(input: unknown): { success: boolean; data?: PushNotificationInput; error?: string } {
  if (!input || typeof input !== 'object') return { success: false, error: 'Invalid input' };
  const obj = input as Record<string, unknown>;
  
  if (typeof obj.userId !== 'string' || !obj.userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
    return { success: false, error: 'userId must be a valid UUID' };
  }
  if (typeof obj.title !== 'string' || obj.title.length < 1 || obj.title.length > 200) {
    return { success: false, error: 'Title is required and must be 1-200 characters' };
  }
  if (typeof obj.body !== 'string' || obj.body.length < 1 || obj.body.length > 1000) {
    return { success: false, error: 'Body is required and must be 1-1000 characters' };
  }
  
  return {
    success: true,
    data: {
      userId: obj.userId,
      title: obj.title,
      body: obj.body,
      data: (obj.data && typeof obj.data === 'object') ? obj.data as Record<string, unknown> : undefined,
      icon: typeof obj.icon === 'string' ? obj.icon : undefined,
      badge: typeof obj.badge === 'string' ? obj.badge : undefined,
    }
  };
}

// Encodage base64url sans padding
function base64UrlEncode(data: Uint8Array | string): string {
  const base64 = typeof data === 'string'
    ? btoa(data)
    : btoa(String.fromCharCode(...data));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Décoder base64url
function base64UrlDecode(str: string): Uint8Array {
  const padding = '='.repeat((4 - str.length % 4) % 4);
  const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map(c => c.charCodeAt(0)));
}

// Générer un JWT VAPID valide
async function generateVapidJWT(
  privateKeyBase64: string,
  publicKeyBase64: string,
  endpoint: string,
  subject: string
): Promise<string> {
  const audience = new URL(endpoint).origin;
  const expiration = Math.floor(Date.now() / 1000) + (12 * 60 * 60); // 12 heures

  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = { aud: audience, exp: expiration, sub: subject };

  const headerBase64 = base64UrlEncode(JSON.stringify(header));
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${headerBase64}.${payloadBase64}`;

  try {
    const privateKeyBytes = base64UrlDecode(privateKeyBase64);
    
    // Create ArrayBuffer from Uint8Array for crypto API
    const keyBuffer = privateKeyBytes.buffer.slice(
      privateKeyBytes.byteOffset,
      privateKeyBytes.byteOffset + privateKeyBytes.byteLength
    ) as ArrayBuffer;

    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      keyBuffer,
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      new TextEncoder().encode(unsignedToken)
    );

    const signature = new Uint8Array(signatureBuffer);
    const signatureBase64 = base64UrlEncode(signature);

    return `${unsignedToken}.${signatureBase64}`;
  } catch (err) {
    console.error('VAPID JWT generation failed:', err);
    throw new Error('Failed to generate VAPID JWT');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Authorization header required'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !userData.user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.json();
    const validationResult = validatePushNotification(rawBody);

    if (!validationResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Validation error',
        details: validationResult.error
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId, title, body, data, icon, badge } = validationResult.data!;

    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', userData.user.id)
      .single();

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';

    if (userId !== userData.user.id && !isAdmin) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Unauthorized: cannot send notifications to other users'
      }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = Deno.env.get('VITE_VAPID_PUBLIC_KEY') || Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@emotionscare.com';

    if (!vapidPrivateKey || !vapidPublicKey) {
      console.error('VAPID keys not configured');
      return new Response(JSON.stringify({
        success: true,
        message: 'VAPID not configured - notification simulated',
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: subscriptions, error } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        message: 'No active subscriptions',
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const notificationPayload = JSON.stringify({
      title,
      body,
      data: data || {},
      icon: icon || '/icon-192x192.png',
      badge: badge || '/badge-96x96.png',
      timestamp: Date.now(),
      requireInteraction: data?.requireInteraction || false,
      tag: data?.tag || `notification-${Date.now()}`
    });

    const results: Array<{ endpoint: string; success: boolean; status?: number; error?: string }> = [];

    for (const sub of subscriptions) {
      try {
        const subscriptionData = sub.subscription_data as { endpoint?: string; keys?: { p256dh: string; auth: string } } | null;

        if (!subscriptionData?.endpoint) {
          console.warn('Invalid subscription data:', sub.id);
          continue;
        }

        let vapidToken = '';
        try {
          vapidToken = await generateVapidJWT(
            vapidPrivateKey,
            vapidPublicKey,
            subscriptionData.endpoint,
            vapidSubject
          );
        } catch (jwtError) {
          console.error('VAPID JWT error:', jwtError);
          vapidToken = base64UrlEncode(`${vapidPublicKey}:${Date.now()}`);
        }

        const pushResponse = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'TTL': '86400',
            'Urgency': (data?.urgency as string) || 'normal',
            'Authorization': `vapid t=${vapidToken}, k=${vapidPublicKey}`
          },
          body: notificationPayload
        });

        const success = pushResponse.ok || pushResponse.status === 201;

        results.push({
          endpoint: subscriptionData.endpoint.substring(0, 50) + '...',
          success,
          status: pushResponse.status
        });

        if (!success) {
          console.error(`Push failed: ${pushResponse.status} for endpoint ${sub.id}`);
          if (pushResponse.status === 410 || pushResponse.status === 404) {
            await supabaseClient
              .from('push_subscriptions')
              .update({ is_active: false, error_message: `HTTP ${pushResponse.status}` })
              .eq('id', sub.id);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Push failed for subscription:', sub.id, err);
        results.push({
          endpoint: (sub.endpoint as string)?.substring(0, 50) + '...',
          success: false,
          error: errorMessage
        });
      }
    }

    try {
      await supabaseClient
        .from('notification_history')
        .insert({
          user_id: userId,
          notification_type: (data?.type as string) || 'general',
          title,
          body,
          was_sent: results.some(r => r.success),
          sent_at: new Date().toISOString(),
          metadata: { results_count: results.length, success_count: results.filter(r => r.success).length }
        });
    } catch (historyError) {
      console.warn('Failed to log notification history:', historyError);
    }

    return new Response(JSON.stringify({
      success: results.some(r => r.success),
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[send-push-notification] Error:', err);
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
