// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface WebhookEvent {
  id: string;
  event_type: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  event_data: any;
}

interface WebhookEndpoint {
  webhook_id: string;
  webhook_url: string;
  webhook_secret: string;
  webhook_headers: Record<string, string>;
  retry_config: {
    max_attempts: number;
    backoff_seconds: number[];
  };
}

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

  const { user, status } = await authorizeRole(req, ['admin']);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'webhook-processor',
    userId: user.id,
    limit: 30,
    windowMs: 60_000,
    description: 'Webhook processor admin API',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      error: 'Too many requests',
      retryAfter: rateLimit.retryAfter,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const url = new URL(req.url);
    const action = url.pathname.split('/').filter(Boolean).pop();

    // POST /webhook-processor/process - Traiter les événements en attente
    if (req.method === 'POST' && action === 'process') {
      console.log('[Webhook] Starting event processing...');

      // Récupérer les événements non traités
      const { data: events, error: eventsError } = await supabaseClient
        .from('webhook_events')
        .select('*')
        .eq('processed', false)
        .order('created_at', { ascending: true })
        .limit(50);

      if (eventsError) {
        console.error('[Webhook] Error fetching events:', eventsError);
        throw eventsError;
      }

      console.log(`[Webhook] Found ${events?.length || 0} events to process`);

      let processedCount = 0;
      let failedCount = 0;

      for (const event of events || []) {
        try {
          await processWebhookEvent(supabaseClient, event);
          processedCount++;
        } catch (error) {
          console.error(`[Webhook] Failed to process event ${event.id}:`, error);
          failedCount++;
        }
      }

      return new Response(JSON.stringify({ 
        success: true,
        processed: processedCount,
        failed: failedCount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /webhook-processor/retry - Réessayer les webhooks en échec
    if (req.method === 'POST' && action === 'retry') {
      console.log('[Webhook] Starting retry processing...');

      const now = new Date().toISOString();

      // Récupérer les deliveries à réessayer
      const { data: deliveries, error: deliveriesError } = await supabaseClient
        .from('webhook_deliveries')
        .select('*')
        .eq('status', 'retrying')
        .lte('next_retry_at', now)
        .limit(20);

      if (deliveriesError) {
        console.error('[Webhook] Error fetching retries:', deliveriesError);
        throw deliveriesError;
      }

      console.log(`[Webhook] Found ${deliveries?.length || 0} deliveries to retry`);

      let retriedCount = 0;

      for (const delivery of deliveries || []) {
        try {
          await retryWebhookDelivery(supabaseClient, delivery);
          retriedCount++;
        } catch (error) {
          console.error(`[Webhook] Failed to retry delivery ${delivery.id}:`, error);
        }
      }

      return new Response(JSON.stringify({ 
        success: true,
        retried: retriedCount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /webhook-processor/stats - Statistiques
    if (req.method === 'GET' && action === 'stats') {
      const { data: stats, error: statsError } = await supabaseClient
        .rpc('get_webhook_statistics');

      if (statsError) throw statsError;

      return new Response(JSON.stringify({ stats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[Webhook] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processWebhookEvent(supabase: any, event: WebhookEvent) {
  console.log(`[Webhook] Processing event ${event.id} of type ${event.event_type}`);

  // Récupérer les webhooks configurés pour cet événement
  const { data: webhooks, error: webhooksError } = await supabase
    .rpc('get_webhooks_for_event', { p_event_type: event.event_type });

  if (webhooksError) {
    console.error('[Webhook] Error fetching webhooks:', webhooksError);
    throw webhooksError;
  }

  if (!webhooks || webhooks.length === 0) {
    console.log(`[Webhook] No webhooks configured for event type ${event.event_type}`);
    // Marquer comme traité même si aucun webhook
    await supabase
      .from('webhook_events')
      .update({ processed: true })
      .eq('id', event.id);
    return;
  }

  console.log(`[Webhook] Found ${webhooks.length} webhooks to notify`);

  // Créer les deliveries pour chaque webhook
  for (const webhook of webhooks) {
    await createWebhookDelivery(supabase, webhook, event);
  }

  // Marquer l'événement comme traité
  await supabase
    .from('webhook_events')
    .update({ processed: true })
    .eq('id', event.id);
}

async function createWebhookDelivery(supabase: any, webhook: WebhookEndpoint, event: WebhookEvent) {
  const payload = {
    event_id: event.id,
    event_type: event.event_type,
    entity_type: event.entity_type,
    entity_id: event.entity_id,
    user_id: event.user_id,
    data: event.event_data,
    timestamp: new Date().toISOString(),
  };

  // Créer la delivery
  const { data: delivery, error: deliveryError } = await supabase
    .from('webhook_deliveries')
    .insert({
      webhook_id: webhook.webhook_id,
      event_type: event.event_type,
      payload,
      status: 'pending',
      max_attempts: webhook.retry_config.max_attempts,
    })
    .select()
    .single();

  if (deliveryError) {
    console.error('[Webhook] Error creating delivery:', deliveryError);
    throw deliveryError;
  }

  // Envoyer immédiatement
  await sendWebhook(supabase, delivery.id, webhook, payload);
}

async function sendWebhook(supabase: any, deliveryId: string, webhook: WebhookEndpoint, payload: any) {
  console.log(`[Webhook] Sending to ${webhook.webhook_url}`);

  const signature = generateSignature(payload, webhook.webhook_secret);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Event': payload.event_type,
    'User-Agent': 'EmotionsCare-Webhook/1.0',
    ...webhook.webhook_headers,
  };

  try {
    const startTime = Date.now();
    
    const response = await fetch(webhook.webhook_url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    const duration = Date.now() - startTime;
    const responseBody = await response.text();

    console.log(`[Webhook] Response ${response.status} in ${duration}ms`);

    if (response.ok) {
      // Succès
      await supabase
        .from('webhook_deliveries')
        .update({
          status: 'success',
          attempts: supabase.sql`attempts + 1`,
          http_status: response.status,
          response_body: responseBody.substring(0, 1000),
          delivered_at: new Date().toISOString(),
        })
        .eq('id', deliveryId);
    } else {
      // Échec, planifier retry
      await scheduleRetry(supabase, deliveryId, response.status, responseBody, webhook.retry_config);
    }
  } catch (error) {
    console.error('[Webhook] Send error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await scheduleRetry(supabase, deliveryId, 0, errorMessage, webhook.retry_config);
  }
}

async function scheduleRetry(supabase: any, deliveryId: string, httpStatus: number, errorMessage: string, retryConfig: any) {
  // Récupérer la delivery actuelle
  const { data: delivery } = await supabase
    .from('webhook_deliveries')
    .select('attempts, max_attempts')
    .eq('id', deliveryId)
    .single();

  const attempts = (delivery?.attempts || 0) + 1;

  if (attempts >= (delivery?.max_attempts || 3)) {
    // Max attempts atteint, échec définitif
    await supabase
      .from('webhook_deliveries')
      .update({
        status: 'failed',
        attempts,
        http_status: httpStatus,
        error_message: errorMessage.substring(0, 1000),
      })
      .eq('id', deliveryId);
  } else {
    // Planifier un retry
    const backoffSeconds = retryConfig.backoff_seconds[attempts - 1] || 3600;
    const nextRetryAt = new Date(Date.now() + backoffSeconds * 1000).toISOString();

    await supabase
      .from('webhook_deliveries')
      .update({
        status: 'retrying',
        attempts,
        next_retry_at: nextRetryAt,
        http_status: httpStatus,
        error_message: errorMessage.substring(0, 1000),
      })
      .eq('id', deliveryId);
  }
}

async function retryWebhookDelivery(supabase: any, delivery: any) {
  console.log(`[Webhook] Retrying delivery ${delivery.id} (attempt ${delivery.attempts + 1})`);

  // Récupérer le webhook
  const { data: webhook, error: webhookError } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .eq('id', delivery.webhook_id)
    .single();

  if (webhookError || !webhook) {
    console.error('[Webhook] Webhook not found for retry');
    return;
  }

  const webhookData: WebhookEndpoint = {
    webhook_id: webhook.id,
    webhook_url: webhook.url,
    webhook_secret: webhook.secret_key,
    webhook_headers: webhook.headers || {},
    retry_config: webhook.retry_config || { max_attempts: 3, backoff_seconds: [30, 300, 3600] },
  };

  await sendWebhook(supabase, delivery.id, webhookData, delivery.payload);
}

function generateSignature(payload: any, secret: string): string {
  const hmac = createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  return `sha256=${hmac.digest('hex')}`;
}
