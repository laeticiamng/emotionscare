/**
 * consent-manager - Gestion des consentements RGPD
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 30/min + CORS restrictif
 */

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

interface ConsentUpdate {
  channelId: string;
  purposeId: string;
  consentGiven: boolean;
  source?: string;
}

Deno.serve(async (req) => {
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
    console.warn('[consent-manager] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    // 2. Authentification via Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.warn('[consent-manager] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'consent-manager',
      userId: user.id,
      limit: 30,
      windowMs: 60_000,
      description: 'Consent management operations',
    });

    if (!rateLimit.allowed) {
      console.warn('[consent-manager] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[consent-manager] Processing for user: ${user.id}`);

    const url = new URL(req.url);
    const path = url.pathname.split('/').filter(Boolean);
    const action = path[path.length - 1];

    // GET /consent-manager/status - Obtenir le statut de consentement
    if (req.method === 'GET' && action === 'status') {
      const { data, error } = await supabaseClient.rpc('get_user_consent_status', {
        p_user_id: user.id,
      });

      if (error) throw error;

      return new Response(JSON.stringify({ consents: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /consent-manager/update - Mettre à jour les préférences
    if (req.method === 'POST' && action === 'update') {
      const body: ConsentUpdate = await req.json();

      const clientIp = req.headers.get('x-forwarded-for') || 
                       req.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      const consentData = {
        user_id: user.id,
        channel_id: body.channelId,
        purpose_id: body.purposeId,
        consent_given: body.consentGiven,
        consent_date: body.consentGiven ? new Date().toISOString() : null,
        withdrawal_date: !body.consentGiven ? new Date().toISOString() : null,
        source: body.source || 'web',
        ip_address: clientIp,
        user_agent: userAgent,
      };

      const { data, error } = await supabaseClient
        .from('user_consent_preferences')
        .upsert(consentData, {
          onConflict: 'user_id,channel_id,purpose_id',
        })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        preference: data,
        message: body.consentGiven ? 'Consentement accordé' : 'Consentement retiré'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /consent-manager/bulk-update - Mise à jour en masse
    if (req.method === 'POST' && action === 'bulk-update') {
      const { updates }: { updates: ConsentUpdate[] } = await req.json();

      const clientIp = req.headers.get('x-forwarded-for') || 'unknown';
      const userAgent = req.headers.get('user-agent') || 'unknown';

      const consentData = updates.map(update => ({
        user_id: user.id,
        channel_id: update.channelId,
        purpose_id: update.purposeId,
        consent_given: update.consentGiven,
        consent_date: update.consentGiven ? new Date().toISOString() : null,
        withdrawal_date: !update.consentGiven ? new Date().toISOString() : null,
        source: update.source || 'web',
        ip_address: clientIp,
        user_agent: userAgent,
      }));

      const { data, error } = await supabaseClient
        .from('user_consent_preferences')
        .upsert(consentData, {
          onConflict: 'user_id,channel_id,purpose_id',
        })
        .select();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        updated: data.length,
        message: `${data.length} préférences mises à jour`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /consent-manager/history - Historique des changements
    if (req.method === 'GET' && action === 'history') {
      const limit = parseInt(url.searchParams.get('limit') || '50');

      const { data, error } = await supabaseClient
        .from('consent_history')
        .select(`
          *,
          channel:consent_channels(channel_code, channel_name),
          purpose:consent_purposes(purpose_code, purpose_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return new Response(JSON.stringify({ history: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /consent-manager/validate-campaign - Valider les consentements pour une campagne
    if (req.method === 'POST' && action === 'validate-campaign') {
      const { campaignId } = await req.json();

      const { data, error } = await supabaseClient.rpc('validate_campaign_consents', {
        p_campaign_id: campaignId,
      });

      if (error) throw error;

      const eligibleUsers = data.filter((u: any) => u.can_contact);

      // Enregistrer les validations
      const validations = eligibleUsers.map((u: any) => ({
        campaign_id: campaignId,
        user_id: u.user_id,
        can_contact: true,
      }));

      if (validations.length > 0) {
        await supabaseClient
          .from('campaign_consents')
          .upsert(validations, {
            onConflict: 'campaign_id,user_id',
          });
      }

      return new Response(JSON.stringify({ 
        totalUsers: data.length,
        eligibleUsers: eligibleUsers.length,
        blockedUsers: data.length - eligibleUsers.length,
        details: data
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in consent-manager:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
