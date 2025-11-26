// @ts-nocheck
/**
 * health-google-fit-exchange - Échange du code OAuth Google Fit
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 5/min + CORS restrictif
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';
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
    route: 'health-google-fit-exchange',
    userId: user.id,
    limit: 5,
    windowMs: 60_000,
    description: 'Google Fit OAuth exchange',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { code, redirectUri } = await req.json();
    const userId = user.id; // Use authenticated user's ID

    if (!code || !userId || !redirectUri) {
      throw new Error('Missing required parameters: code, userId, redirectUri');
    }

    // Échanger le code contre un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: Deno.env.get('GOOGLE_FIT_CLIENT_ID') || '',
        client_secret: Deno.env.get('GOOGLE_FIT_CLIENT_SECRET') || '',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Google OAuth error: ${error}`);
    }

    const tokens = await tokenResponse.json();

    // Calculer l'expiration du token
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Sauvegarder la connexion dans Supabase
    const { data: connection, error } = await supabaseClient
      .from('health_connections')
      .upsert({
        user_id: userId,
        provider: 'google_fit',
        is_connected: true,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: expiresAt.toISOString(),
        enabled_data_types: ['heart_rate', 'steps', 'sleep', 'activity'],
        sync_frequency: 'hourly',
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save connection: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        connection: {
          ...connection,
          access_token: undefined, // Ne pas renvoyer le token au client
          refresh_token: undefined,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    const err = error as Error;
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
