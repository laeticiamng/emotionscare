// @ts-nocheck
/**
 * health-google-fit-sync - Synchronisation des données Google Fit
 *
 * 🔒 SÉCURISÉ: Auth multi-rôle + Rate limit 10/min + CORS restrictif
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
    route: 'health-google-fit-sync',
    userId: user.id,
    limit: 10,
    windowMs: 60_000,
    description: 'Google Fit data sync',
  });

  if (!rateLimit.allowed) {
    return buildRateLimitResponse(rateLimit, corsHeaders, {
      errorCode: 'rate_limit_exceeded',
      message: `Trop de requêtes. Réessayez dans ${rateLimit.retryAfterSeconds}s.`,
    });
  }

  try {
    const { dataTypes } = await req.json();
    const userId = user.id; // Use authenticated user's ID

    if (!userId) {
      throw new Error('Missing required parameter: userId');
    }

    // Créer le client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer la connexion
    const { data: connection, error: connectionError } = await supabaseClient
      .from('health_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('provider', 'google_fit')
      .single();

    if (connectionError || !connection) {
      throw new Error('Google Fit connection not found');
    }

    if (!connection.is_connected) {
      throw new Error('Google Fit is not connected');
    }

    let accessToken = connection.access_token;

    // Vérifier si le token est expiré
    const expiresAt = new Date(connection.token_expires_at);
    const now = new Date();

    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      // Token expire dans moins de 5 minutes, le rafraîchir
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: connection.refresh_token,
          client_id: Deno.env.get('GOOGLE_FIT_CLIENT_ID') || '',
          client_secret: Deno.env.get('GOOGLE_FIT_CLIENT_SECRET') || '',
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh Google Fit token');
      }

      const tokens = await refreshResponse.json();
      accessToken = tokens.access_token;

      const newExpiresAt = new Date();
      newExpiresAt.setSeconds(newExpiresAt.getSeconds() + tokens.expires_in);

      // Mettre à jour le token
      await supabaseClient
        .from('health_connections')
        .update({
          access_token: accessToken,
          token_expires_at: newExpiresAt.toISOString(),
        })
        .eq('user_id', userId)
        .eq('provider', 'google_fit');
    }

    const syncStarted = new Date();
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - 7); // 7 derniers jours

    const metrics: any[] = [];
    const typesToSync = dataTypes || connection.enabled_data_types || ['heart_rate', 'steps'];

    // Synchroniser chaque type de données
    for (const dataType of typesToSync) {
      try {
        let dataTypeName = '';
        let bucketDuration = 3600000; // 1 heure par défaut

        switch (dataType) {
          case 'heart_rate':
            dataTypeName = 'com.google.heart_rate.bpm';
            break;
          case 'steps':
            dataTypeName = 'com.google.step_count.delta';
            bucketDuration = 86400000; // 1 jour
            break;
          case 'activity':
            dataTypeName = 'com.google.activity.segment';
            break;
          case 'sleep':
            dataTypeName = 'com.google.sleep.segment';
            break;
          default:
            continue;
        }

        const response = await fetch(
          'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              aggregateBy: [{ dataTypeName }],
              bucketByTime: { durationMillis: bucketDuration },
              startTimeMillis: startTime.getTime(),
              endTimeMillis: endTime.getTime(),
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();

          for (const bucket of data.bucket || []) {
            for (const dataset of bucket.dataset || []) {
              for (const point of dataset.point || []) {
                const value = point.value?.[0]?.fpVal || point.value?.[0]?.intVal;
                if (value) {
                  metrics.push({
                    user_id: userId,
                    provider: 'google_fit',
                    data_type: dataType,
                    value,
                    unit: dataType === 'steps' ? 'steps' : dataType === 'heart_rate' ? 'bpm' : '',
                    timestamp: new Date(parseInt(point.startTimeNanos) / 1000000).toISOString(),
                    synced_at: new Date().toISOString(),
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Failed to sync ${dataType}:`, error);
      }
    }

    // Sauvegarder les métriques
    if (metrics.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('health_metrics')
        .insert(metrics);

      if (insertError) {
        console.error('Failed to insert metrics:', insertError);
      }
    }

    // Mettre à jour last_sync_at
    await supabaseClient
      .from('health_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('provider', 'google_fit');

    return new Response(
      JSON.stringify({
        success: true,
        syncResult: {
          provider: 'google_fit',
          success: true,
          metrics_synced: metrics.length,
          data_types: typesToSync,
          sync_started_at: syncStarted.toISOString(),
          sync_completed_at: new Date().toISOString(),
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
