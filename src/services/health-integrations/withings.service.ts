/**
 * Service d'intégration Withings
 * Phase 3 - Excellence
 * API v2: https://developer.withings.com/api-reference
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
 * Initier la connexion Withings (OAuth 2.0) via Edge Function
 */
export async function initiateWithingsConnection(userId: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('health-withings-init', {
    body: { 
      userId,
      redirectUri: `${window.location.origin}/app/health/callback/withings`
    }
  });

  if (error) throw new Error(`Failed to initiate Withings connection: ${error.message}`);
  return data.authUrl;
}

/**
 * Échanger le code OAuth contre des tokens
 */
export async function exchangeWithingsCode(
  code: string,
  userId: string
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-withings-exchange', {
    body: { 
      code, 
      userId, 
      redirectUri: `${window.location.origin}/app/health/callback/withings` 
    },
  });

  if (error) throw new Error(`Failed to exchange Withings code: ${error.message}`);
  return data.connection;
}

/**
 * Synchroniser les données Withings
 */
export async function syncWithingsData(
  userId: string,
  dataTypes?: HealthDataType[]
): Promise<HealthSyncResult> {
  const { data, error } = await supabase.functions.invoke('health-withings-sync', {
    body: { userId, dataTypes },
  });

  if (error) throw new Error(`Failed to sync Withings data: ${error.message}`);
  return data.syncResult;
}

/**
 * Récupérer les mesures corporelles via Edge Function
 */
export async function getWithingsMeasures(
  userId: string,
  startTime: Date,
  endTime: Date,
  measureTypes?: number[]
): Promise<HealthMetric[]> {
  const { data, error } = await supabase.functions.invoke('health-withings-measures', {
    body: {
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      measureTypes
    }
  });

  if (error) throw new Error(`Failed to get Withings measures: ${error.message}`);
  return data.metrics || [];
}

/**
 * Récupérer les données d'activité via Edge Function
 */
export async function getWithingsActivity(
  userId: string,
  startDate: Date,
  endDate: Date
): Promise<HealthMetric[]> {
  const { data, error } = await supabase.functions.invoke('health-withings-activity', {
    body: {
      userId,
      startDate: formatDateYMD(startDate),
      endDate: formatDateYMD(endDate)
    }
  });

  if (error) throw new Error(`Failed to get Withings activity: ${error.message}`);
  return data.metrics || [];
}

/**
 * Récupérer les données de sommeil via Edge Function
 */
export async function getWithingsSleep(
  userId: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const { data, error } = await supabase.functions.invoke('health-withings-sleep', {
    body: {
      userId,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    }
  });

  if (error) throw new Error(`Failed to get Withings sleep: ${error.message}`);
  return data.metrics || [];
}

/**
 * Déconnecter Withings
 */
export async function disconnectWithings(userId: string): Promise<void> {
  const { error } = await supabase
    .from('health_connections')
    .update({ is_connected: false, access_token: null, refresh_token: null })
    .eq('user_id', userId)
    .eq('provider', 'withings');

  if (error) throw new Error(`Failed to disconnect Withings: ${error.message}`);
}

/**
 * Rafraîchir le token d'accès Withings
 */
export async function refreshWithingsToken(
  connection: HealthConnection
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-withings-refresh', {
    body: { refreshToken: connection.refresh_token, userId: connection.user_id },
  });

  if (error) throw new Error(`Failed to refresh Withings token: ${error.message}`);
  return data.connection;
}

// Helpers

function formatDateYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
