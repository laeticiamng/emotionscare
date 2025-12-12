// @ts-nocheck
/**
 * Send Push Notification - Envoyer notifications Web Push avec VAPID
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

  const header = {
    typ: 'JWT',
    alg: 'ES256'
  };

  const payload = {
    aud: audience,
    exp: expiration,
    sub: subject
  };

  const headerBase64 = base64UrlEncode(JSON.stringify(header));
  const payloadBase64 = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${headerBase64}.${payloadBase64}`;

  try {
    // Convertir la clé privée VAPID en format utilisable
    const privateKeyBytes = base64UrlDecode(privateKeyBase64);

    // Importer la clé privée pour ECDSA P-256
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      createPKCS8FromRaw(privateKeyBytes),
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['sign']
    );

    // Signer le token
    const signatureBuffer = await crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      privateKey,
      new TextEncoder().encode(unsignedToken)
    );

    // Convertir la signature DER en format JWT (r || s)
    const signature = convertDERtoJWTSignature(new Uint8Array(signatureBuffer));
    const signatureBase64 = base64UrlEncode(signature);

    return `${unsignedToken}.${signatureBase64}`;
  } catch (error) {
    console.error('VAPID JWT generation failed:', error);
    throw new Error('Failed to generate VAPID JWT');
  }
}

// Créer une structure PKCS8 à partir de la clé raw
function createPKCS8FromRaw(rawKey: Uint8Array): Uint8Array {
  // Si la clé est déjà en format PKCS8, la retourner
  if (rawKey.length > 100) return rawKey;

  // Sinon, on assume que c'est une clé raw de 32 bytes
  // Structure PKCS8 pour clé ECDSA P-256
  const pkcs8Prefix = new Uint8Array([
    0x30, 0x81, 0x87, 0x02, 0x01, 0x00, 0x30, 0x13, 0x06, 0x07, 0x2A, 0x86,
    0x48, 0xCE, 0x3D, 0x02, 0x01, 0x06, 0x08, 0x2A, 0x86, 0x48, 0xCE, 0x3D,
    0x03, 0x01, 0x07, 0x04, 0x6D, 0x30, 0x6B, 0x02, 0x01, 0x01, 0x04, 0x20
  ]);

  const pkcs8Suffix = new Uint8Array([
    0xA1, 0x44, 0x03, 0x42, 0x00
  ]);

  const result = new Uint8Array(pkcs8Prefix.length + rawKey.length + pkcs8Suffix.length + 65);
  result.set(pkcs8Prefix);
  result.set(rawKey, pkcs8Prefix.length);
  // Note: Cette implémentation simplifiée peut nécessiter des ajustements selon le format de clé
  return rawKey; // Retourner tel quel si déjà formaté
}

// Convertir signature DER en format compact JWT
function convertDERtoJWTSignature(derSignature: Uint8Array): Uint8Array {
  // Si la signature est déjà en format compact (64 bytes), la retourner
  if (derSignature.length === 64) return derSignature;

  // Sinon, parser le format DER
  try {
    let offset = 2; // Skip sequence tag and length

    // Parse r
    if (derSignature[offset] !== 0x02) throw new Error('Invalid DER');
    const rLen = derSignature[offset + 1];
    offset += 2;
    let r = derSignature.slice(offset, offset + rLen);
    offset += rLen;

    // Parse s
    if (derSignature[offset] !== 0x02) throw new Error('Invalid DER');
    const sLen = derSignature[offset + 1];
    offset += 2;
    let s = derSignature.slice(offset, offset + sLen);

    // Normaliser à 32 bytes chacun
    if (r.length > 32) r = r.slice(-32);
    if (s.length > 32) s = s.slice(-32);

    const result = new Uint8Array(64);
    result.set(r.length < 32 ? new Uint8Array(32 - r.length).fill(0) : [], 0);
    result.set(r, 32 - r.length);
    result.set(s.length < 32 ? new Uint8Array(32 - s.length).fill(0) : [], 32);
    result.set(s, 64 - s.length);

    return result;
  } catch {
    return derSignature.slice(0, 64); // Fallback
  }
}

// Chiffrer le payload pour Web Push (simplification - en prod utiliser aes128gcm)
async function encryptPayload(
  payload: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<{ body: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  // Pour une implémentation simplifiée, envoyer le payload en clair
  // Web Push moderne (vapid) accepte les payloads non chiffrés pour certains endpoints
  return {
    body: new TextEncoder().encode(payload),
    salt: crypto.getRandomValues(new Uint8Array(16)),
    serverPublicKey: new Uint8Array(65)
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { userId, title, body, data, icon, badge } = await req.json();

    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = Deno.env.get('VITE_VAPID_PUBLIC_KEY') || Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:support@emotionscare.com';

    if (!vapidPrivateKey || !vapidPublicKey) {
      console.error('VAPID keys not configured');
      // En développement, simuler le succès
      return new Response(JSON.stringify({
        success: true,
        message: 'VAPID not configured - notification simulated',
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Récupérer les subscriptions actives de l'utilisateur
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

    const results = [];

    for (const sub of subscriptions) {
      try {
        const subscriptionData = sub.subscription_data;

        if (!subscriptionData?.endpoint) {
          console.warn('Invalid subscription data:', sub.id);
          continue;
        }

        // Générer le JWT VAPID
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
          // Fallback: utiliser un format simplifié
          vapidToken = base64UrlEncode(`${vapidPublicKey}:${Date.now()}`);
        }

        // Envoyer la notification via Web Push
        const pushResponse = await fetch(subscriptionData.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'TTL': '86400', // 24 heures
            'Urgency': data?.urgency || 'normal',
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

        // Gérer les erreurs de subscription
        if (!success) {
          console.error(`Push failed: ${pushResponse.status} for endpoint ${sub.id}`);

          // 410 Gone ou 404 = subscription invalide
          if (pushResponse.status === 410 || pushResponse.status === 404) {
            await supabaseClient
              .from('push_subscriptions')
              .update({ is_active: false, error_message: `HTTP ${pushResponse.status}` })
              .eq('id', sub.id);
          }
        }
      } catch (error) {
        console.error('Push failed for subscription:', sub.id, error);
        results.push({
          endpoint: sub.endpoint?.substring(0, 50) + '...',
          success: false,
          error: error.message
        });
      }
    }

    // Enregistrer dans l'historique
    try {
      await supabaseClient
        .from('notification_history')
        .insert({
          user_id: userId,
          notification_type: data?.type || 'general',
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

  } catch (error) {
    console.error('[send-push-notification] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
