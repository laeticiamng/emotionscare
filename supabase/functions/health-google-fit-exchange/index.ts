// Edge Function: Échanger le code OAuth Google Fit contre des tokens
// Phase 3 - Excellence

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '../_shared/supabase.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { code, userId, redirectUri } = await req.json();

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
