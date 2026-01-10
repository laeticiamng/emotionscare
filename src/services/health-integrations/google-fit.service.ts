/**
 * Service d'intégration Google Fit
 * Phase 3 - Excellence
 * Uses Edge Functions for OAuth - no client secrets exposed
 */

import { supabase } from '@/integrations/supabase/client';
import type {
  HealthConnection,
  HealthMetric,
  HealthSyncResult,
  HealthDataType,
} from '@/types/health-integrations';

/**
 * Initier la connexion Google Fit (OAuth 2.0) via Edge Function
 */
export async function initiateGoogleFitConnection(userId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-init', {
    body: { 
      userId,
      redirectUri: `${window.location.origin}/app/health/callback/google`
    }
  });

  if (error) throw new Error(`Failed to initiate Google Fit connection: ${error.message}`);
  return data.authUrl;
}

/**
 * Échanger le code OAuth contre des tokens
 */
export async function exchangeGoogleFitCode(
  code: string,
  userId: string
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-exchange', {
    body: { 
      code, 
      userId, 
      redirectUri: `${window.location.origin}/app/health/callback/google` 
    },
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
 * Récupérer les données de fréquence cardiaque via Edge Function
 */
export async function getGoogleFitHeartRate(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-heart-rate', {
    body: {
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }
  });

  if (error) throw new Error(`Failed to get Google Fit heart rate: ${error.message}`);
  return data.metrics || [];
}

/**
 * Récupérer les données de pas via Edge Function
 */
export async function getGoogleFitSteps(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const { data, error } = await supabase.functions.invoke('health-google-fit-steps', {
    body: {
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }
  });

  if (error) throw new Error(`Failed to get Google Fit steps: ${error.message}`);
  return data.metrics || [];
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
