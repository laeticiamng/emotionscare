// @ts-nocheck
/**
 * notifications-send - Envoi de notifications via templates
 *
 * 🔒 SÉCURISÉ: Auth admin + Rate limit 20/min + CORS restrictif
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authorizeRole } from '../_shared/auth.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const supabase = createClient(supabaseUrl, serviceKey);

serve(async (req) => {
  // 1. CORS check
  const corsResult = cors(req);
  const corsHeaders = {
    ...corsResult.headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };

  if (req.method === 'OPTIONS') {
    return preflightResponse(corsResult);
  }

  // Vérification CORS stricte
  if (!corsResult.allowed) {
    console.warn('[notifications-send] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  // 2. Auth admin
  const { user, status } = await authorizeRole(req, ['b2b_admin', 'admin']);
  if (!user) {
    console.warn('[notifications-send] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // 3. 🛡️ Rate limiting
  const rateLimit = await enforceEdgeRateLimit(req, {
    route: 'notifications-send',
    userId: user.id,
    limit: 20,
    windowMs: 60_000,
    description: 'Notifications send - Admin only',
  });

  if (!rateLimit.allowed) {
    console.warn('[notifications-send] Rate limit exceeded', { userId: user.id });
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  console.log(`[notifications-send] Processing for admin: ${user.id}`);

  try {
    const { template, userId, variables } = await req.json();
    if (!template || !userId) {
      return new Response(JSON.stringify({ error: 'template and userId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await supabase.rpc('create_notification_from_template', {
      template_name: template,
      target_user_id: userId,
      template_variables: variables || {},
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ success: true, id: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('notifications-send error:', error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
