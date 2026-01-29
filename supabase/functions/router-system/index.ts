// @ts-nocheck
/**
 * ROUTER SYSTEM - Super-routeur Système consolidé
 * Regroupe: health-check, monitoring, notifications, webhooks, etc.
 * 
 * Actions disponibles:
 * - health: Health check
 * - metrics: Métriques système
 * - notify: Envoyer notification
 * - push: Push notification
 * - email: Envoyer email
 * - webhook: Déclencher webhook
 * - quota: Vérifier quotas
 * - rate-limit: Statut rate limit
 * - logs: Logs système
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RouterRequest {
  action: string;
  payload: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: RouterRequest = await req.json();
    const { action, payload = {} } = body;

    if (!action) {
      return errorResponse('Action is required', 400);
    }

    // Actions publiques (sans auth)
    if (action === 'health') {
      return handleHealth();
    }

    // Auth pour les autres actions
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return errorResponse('Authorization required', 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return errorResponse('Invalid token', 401);
    }

    console.log(`[router-system] Action: ${action}, User: ${user.id}`);

    switch (action) {
      case 'metrics':
        return await handleMetrics(payload, supabase);
      
      case 'notify':
        return await handleNotify(payload, user, supabase);
      
      case 'push':
        return await handlePush(payload, user, supabase);
      
      case 'email':
        return await handleEmail(payload, user, supabase);
      
      case 'webhook':
        return await handleWebhook(payload, user);
      
      case 'quota':
        return await handleQuota(user, supabase);
      
      case 'rate-limit':
        return await handleRateLimit(payload, user);
      
      case 'logs':
        return await handleLogs(payload, user, supabase);
      
      case 'session-create':
        return await handleSessionCreate(payload, user, supabase);
      
      case 'session-update':
        return await handleSessionUpdate(payload, user, supabase);

      default:
        return errorResponse(`Unknown action: ${action}`, 400);
    }

  } catch (error) {
    console.error('[router-system] Error:', error);
    return errorResponse(error.message ?? 'Internal error', 500);
  }
});

// ============ HANDLERS ============

function handleHealth(): Response {
  return successResponse({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: Deno.env.get('ENVIRONMENT') || 'production',
  });
}

async function handleMetrics(payload: any, supabase: any): Promise<Response> {
  const { type = 'general' } = payload;

  // Collecter des métriques basiques
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: sessionCount } = await supabase
    .from('activity_sessions')
    .select('*', { count: 'exact', head: true });

  return successResponse({
    metrics: {
      totalUsers: userCount || 0,
      totalSessions: sessionCount || 0,
      timestamp: new Date().toISOString(),
    },
    type,
  });
}

async function handleNotify(payload: any, user: any, supabase: any): Promise<Response> {
  const { title, message, type = 'info', targetUserId } = payload;

  if (!title || !message) {
    return errorResponse('Title and message are required', 400);
  }

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: targetUserId || user.id,
      title,
      message,
      type,
      read: false,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create notification', 500);
  }

  return successResponse({ notification: data });
}

async function handlePush(payload: any, user: any, supabase: any): Promise<Response> {
  const { title, body, data = {} } = payload;

  if (!title || !body) {
    return errorResponse('Title and body are required', 400);
  }

  // Récupérer les subscriptions de l'utilisateur
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', user.id);

  if (!subscriptions || subscriptions.length === 0) {
    return successResponse({ sent: false, reason: 'No subscriptions found' });
  }

  // En production, on enverrait via Web Push API
  // Pour l'instant, on simule le succès
  console.log(`[router-system] Would send push to ${subscriptions.length} devices`);

  return successResponse({
    sent: true,
    deviceCount: subscriptions.length,
  });
}

async function handleEmail(payload: any, user: any, supabase: any): Promise<Response> {
  const { to, subject, body, template } = payload;

  if (!to || !subject) {
    return errorResponse('To and subject are required', 400);
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

  if (!RESEND_API_KEY) {
    return errorResponse('Email service not configured', 503);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EmotionsCare <noreply@emotionscare.com>',
        to: [to],
        subject,
        html: body || `<p>${template || 'Message'}</p>`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[router-system] Email error:', error);
      return errorResponse('Failed to send email', 500);
    }

    const data = await response.json();
    return successResponse({ sent: true, emailId: data.id });

  } catch (error) {
    console.error('[router-system] Email error:', error);
    return errorResponse('Email service error', 500);
  }
}

async function handleWebhook(payload: any, user: any): Promise<Response> {
  const { url, data, method = 'POST' } = payload;

  if (!url) {
    return errorResponse('URL is required', 400);
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return successResponse({
      status: response.status,
      ok: response.ok,
    });

  } catch (error) {
    console.error('[router-system] Webhook error:', error);
    return errorResponse('Webhook failed', 500);
  }
}

async function handleQuota(user: any, supabase: any): Promise<Response> {
  // Vérifier les quotas de l'utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, ai_credits_remaining')
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier || 'free';
  const limits = {
    free: { aiCalls: 10, musicGen: 3, storage: 100 },
    pro: { aiCalls: 100, musicGen: 30, storage: 1000 },
    enterprise: { aiCalls: -1, musicGen: -1, storage: -1 },
  };

  return successResponse({
    tier,
    limits: limits[tier as keyof typeof limits] || limits.free,
    remaining: {
      aiCredits: profile?.ai_credits_remaining ?? 10,
    },
  });
}

async function handleRateLimit(payload: any, user: any): Promise<Response> {
  const { route } = payload;

  // Simulation du statut rate limit
  return successResponse({
    route: route || 'default',
    remaining: 100,
    reset: new Date(Date.now() + 60000).toISOString(),
  });
}

async function handleLogs(payload: any, user: any, supabase: any): Promise<Response> {
  const { level = 'info', message, context } = payload;

  // Logger l'événement
  const { error } = await supabase
    .from('application_logs')
    .insert({
      user_id: user.id,
      level,
      message,
      context,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error('[router-system] Log error:', error);
  }

  return successResponse({ logged: true });
}

async function handleSessionCreate(payload: any, user: any, supabase: any): Promise<Response> {
  const { type, metadata = {} } = payload;

  if (!type) {
    return errorResponse('Session type is required', 400);
  }

  const { data: session, error } = await supabase
    .from('user_sessions')
    .insert({
      user_id: user.id,
      session_type: type,
      started_at: new Date().toISOString(),
      metadata,
    })
    .select()
    .single();

  if (error) {
    return errorResponse('Failed to create session', 500);
  }

  return successResponse({ session });
}

async function handleSessionUpdate(payload: any, user: any, supabase: any): Promise<Response> {
  const { sessionId, completed = false, metrics = {} } = payload;

  if (!sessionId) {
    return errorResponse('Session ID is required', 400);
  }

  const updates: any = { metadata: metrics };
  if (completed) {
    updates.ended_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('user_sessions')
    .update(updates)
    .eq('id', sessionId)
    .eq('user_id', user.id);

  if (error) {
    return errorResponse('Failed to update session', 500);
  }

  return successResponse({ updated: true });
}

// ============ HELPERS ============

function successResponse(data: any): Response {
  return new Response(JSON.stringify({ success: true, ...data }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
