/**
 * Service d'intégration Google Fit
 * Phase 3 - Excellence
 */

import { supabase } from '@/lib/supabase';
import type {
  HealthConnection,
  HealthMetric,
  HealthSyncResult,
  HealthDataType,
} from '@/types/health-integrations';

const GOOGLE_FIT_CONFIG = {
  client_id: import.meta.env.VITE_GOOGLE_FIT_CLIENT_ID || '',
  redirect_uri: `${window.location.origin}/app/health/callback/google`,
  scopes: [
    'https://www.googleapis.com/auth/fitness.activity.read',
    'https://www.googleapis.com/auth/fitness.heart_rate.read',
    'https://www.googleapis.com/auth/fitness.sleep.read',
    'https://www.googleapis.com/auth/fitness.body.read',
  ],
  auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
  token_url: 'https://oauth2.googleapis.com/token',
  api_base_url: 'https://www.googleapis.com/fitness/v1',
};

/**
 * Initier la connexion Google Fit (OAuth 2.0)
 */
export async function initiateGoogleFitConnection(userId: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: GOOGLE_FIT_CONFIG.client_id,
    redirect_uri: GOOGLE_FIT_CONFIG.redirect_uri,
    response_type: 'code',
    scope: GOOGLE_FIT_CONFIG.scopes.join(' '),
    access_type: 'offline',
    state: userId, // Pour vérification après redirect
    prompt: 'consent',
  });

  return `${GOOGLE_FIT_CONFIG.auth_url}?${params.toString()}`;
}

/**
 * Échanger le code OAuth contre des tokens
 */
export async function exchangeGoogleFitCode(
  code: string,
  userId: string
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-exchange', {
    body: { code, userId, redirectUri: GOOGLE_FIT_CONFIG.redirect_uri },
  });

  if (error) throw new Error(`Failed to exchange Google Fit code: ${error.message}`);
  return data.connection;
}

/**
 * Synchroniser les données Google Fit
 */
export async function syncGoogleFitData(
  userId: string,
  dataTypes?: HealthDataType[]
): Promise<HealthSyncResult> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-sync', {
    body: { userId, dataTypes },
  });

  if (error) throw new Error(`Failed to sync Google Fit data: ${error.message}`);
  return data.syncResult;
}

/**
 * Récupérer les données de fréquence cardiaque
 */
export async function getGoogleFitHeartRate(
  accessToken: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const response = await fetch(
    `${GOOGLE_FIT_CONFIG.api_base_url}/users/me/dataset:aggregate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.heart_rate.bpm',
          },
        ],
        bucketByTime: { durationMillis: 3600000 }, // 1 heure
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Fit API error: ${response.statusText}`);
  }

  const data = await response.json();

  // Transform to HealthMetric format
  const metrics: HealthMetric[] = [];
  for (const bucket of data.bucket || []) {
    for (const dataset of bucket.dataset || []) {
      for (const point of dataset.point || []) {
        const value = point.value?.[0]?.fpVal || point.value?.[0]?.intVal;
        if (value) {
          metrics.push({
            id: crypto.randomUUID(),
            user_id: '',
            provider: 'google_fit',
            data_type: 'heart_rate',
            value,
            unit: 'bpm',
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000).toISOString(),
            synced_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      }
    }
  }

  return metrics;
}

/**
 * Récupérer les données de pas
 */
export async function getGoogleFitSteps(
  accessToken: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const response = await fetch(
    `${GOOGLE_FIT_CONFIG.api_base_url}/users/me/dataset:aggregate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [
          {
            dataTypeName: 'com.google.step_count.delta',
            dataSourceId:
              'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1 jour
        startTimeMillis: startTime.getTime(),
        endTimeMillis: endTime.getTime(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Google Fit API error: ${response.statusText}`);
  }

  const data = await response.json();
  const metrics: HealthMetric[] = [];

  for (const bucket of data.bucket || []) {
    for (const dataset of bucket.dataset || []) {
      for (const point of dataset.point || []) {
        const value = point.value?.[0]?.intVal;
        if (value) {
          metrics.push({
            id: crypto.randomUUID(),
            user_id: '',
            provider: 'google_fit',
            data_type: 'steps',
            value,
            unit: 'steps',
            timestamp: new Date(parseInt(point.startTimeNanos) / 1000000).toISOString(),
            synced_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          });
        }
      }
    }
  }

  return metrics;
}

/**
 * Déconnecter Google Fit
 */
export async function disconnectGoogleFit(userId: string): Promise<void> {
  const { error } = await supabase
    .from('health_connections')
    .update({ is_connected: false, access_token: null, refresh_token: null })
    .eq('user_id', userId)
    .eq('provider', 'google_fit');

  if (error) throw new Error(`Failed to disconnect Google Fit: ${error.message}`);
}

/**
 * Vérifier si l'accès token est valide
 */
export async function isGoogleFitTokenValid(connection: HealthConnection): Promise<boolean> {
  if (!connection.token_expires_at) return false;

  const expiresAt = new Date(connection.token_expires_at);
  const now = new Date();

  // Vérifier si le token expire dans moins de 5 minutes
  return expiresAt.getTime() - now.getTime() > 5 * 60 * 1000;
}

/**
 * Rafraîchir le token d'accès
 */
export async function refreshGoogleFitToken(
  connection: HealthConnection
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-refresh', {
    body: { refreshToken: connection.refresh_token, userId: connection.user_id },
  });

  if (error) throw new Error(`Failed to refresh Google Fit token: ${error.message}`);
  return data.connection;
}
