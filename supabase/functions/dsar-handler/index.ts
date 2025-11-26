// @ts-nocheck
/**
 * dsar-handler - Gestion des demandes DSAR (RGPD)
 *
 * 🔒 SÉCURISÉ: Auth + Rate limit 5/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { withMonitoring } from '../_shared/monitoring-wrapper.ts';
import { cors, preflightResponse, rejectCors } from '../_shared/cors.ts';
import { enforceEdgeRateLimit, buildRateLimitResponse } from '../_shared/rate-limit.ts';

const handler = withMonitoring('dsar-handler', async (req) => {
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
    console.warn('[dsar-handler] CORS rejected - origin not allowed');
    return rejectCors(corsResult);
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: { user } } = await supabase.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '')
    );

    if (!user) {
      console.warn('[dsar-handler] Unauthorized access attempt');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. 🛡️ Rate limiting strict (GDPR sensible)
    const rateLimit = await enforceEdgeRateLimit(req, {
      route: 'dsar-handler',
      userId: user.id,
      limit: 5,
      windowMs: 60_000,
      description: 'DSAR request handling',
    });

    if (!rateLimit.allowed) {
      console.warn('[dsar-handler] Rate limit exceeded', { userId: user.id });
      return buildRateLimitResponse(rateLimit, corsHeaders, {
        errorCode: 'rate_limit_exceeded',
        message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
      });
    }

    console.log(`[dsar-handler] Processing for user: ${user.id}`);

    const url = new URL(req.url);
    const action = url.pathname.split('/').filter(Boolean).pop();

    // POST /dsar-handler/generate-package - Générer le package de données
    if (req.method === 'POST' && action === 'generate-package') {
      const { requestId } = await req.json();

      const { data: request } = await supabase
        .from('dsar_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) throw new Error('Request not found');

      // Collecter toutes les données utilisateur
      const userData: any = {
        profile: {},
        consents: [],
        exports: [],
        preferences: [],
      };

      // Récupérer les consentements
      const { data: consents } = await supabase
        .from('user_consent_preferences')
        .select('*')
        .eq('user_id', request.user_id);
      userData.consents = consents || [];

      // Récupérer les exports précédents
      const { data: exports } = await supabase
        .from('export_jobs')
        .select('*')
        .eq('user_id', request.user_id);
      userData.exports = exports || [];

      // Générer le JSON
      const packageData = JSON.stringify(userData, null, 2);

      // Uploader sur Supabase Storage
      const fileName = `dsar-${request.user_id}-${requestId}-${Date.now()}.json`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('gdpr-exports')
        .upload(fileName, packageData, {
          contentType: 'application/json',
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }

      // Générer une URL signée valide 7 jours (GDPR compliance)
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('gdpr-exports')
        .createSignedUrl(fileName, 7 * 24 * 60 * 60); // 7 days

      if (signedUrlError) {
        throw new Error(`Signed URL generation failed: ${signedUrlError.message}`);
      }

      const packageUrl = signedUrlData.signedUrl;

      await supabase
        .from('dsar_requests')
        .update({
          status: 'completed',
          package_url: packageUrl,
          storage_path: fileName,
          completed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      return new Response(JSON.stringify({ 
        success: true,
        package_url: packageUrl 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[DSAR] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

serve(handler);
