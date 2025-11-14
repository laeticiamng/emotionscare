/**
 * Service principal pour les intégrations santé
 * Phase 3 - Excellence
 * Orchestre Google Fit, Apple Health, et Withings
 */

import { supabase } from '@/lib/supabase';
import type {
  HealthProvider,
  HealthConnection,
  HealthMetric,
  HealthSyncResult,
  HealthInsight,
  AggregatedHealthData,
  HealthIntegrationPreferences,
  HealthDataType,
} from '@/types/health-integrations';

import * as googleFit from './google-fit.service';
import * as appleHealth from './apple-health.service';
import * as withings from './withings.service';

/**
 * Récupérer toutes les connexions santé d'un utilisateur
 */
export async function getHealthConnections(userId: string): Promise<HealthConnection[]> {
  const { data, error } = await supabase
    .from('health_connections')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch health connections: ${error.message}`);
  return data || [];
}

/**
 * Récupérer une connexion spécifique
 */
export async function getHealthConnection(
  userId: string,
  provider: HealthProvider
): Promise<HealthConnection | null> {
  const { data, error } = await supabase
    .from('health_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch health connection: ${error.message}`);
  }

  return data;
}

/**
 * Connecter un provider
 */
export async function connectProvider(
  userId: string,
  provider: HealthProvider
): Promise<string | HealthConnection> {
  switch (provider) {
    case 'google_fit':
      return googleFit.initiateGoogleFitConnection(userId);

    case 'apple_health':
      return appleHealth.requestAppleHealthAuthorization(userId, [
        'heart_rate',
        'steps',
        'sleep',
        'activity',
      ]);

    case 'withings':
      return withings.initiateWithingsConnection(userId);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Déconnecter un provider
 */
export async function disconnectProvider(
  userId: string,
  provider: HealthProvider
): Promise<void> {
  switch (provider) {
    case 'google_fit':
      return googleFit.disconnectGoogleFit(userId);

    case 'apple_health':
      return appleHealth.disconnectAppleHealth(userId);

    case 'withings':
      return withings.disconnectWithings(userId);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Synchroniser les données d'un provider
 */
export async function syncProvider(
  userId: string,
  provider: HealthProvider,
  dataTypes?: HealthDataType[]
): Promise<HealthSyncResult> {
  switch (provider) {
    case 'google_fit':
      return googleFit.syncGoogleFitData(userId, dataTypes);

    case 'apple_health':
      return appleHealth.syncAppleHealthData(userId, dataTypes);

    case 'withings':
      return withings.syncWithingsData(userId, dataTypes);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Synchroniser tous les providers connectés
 */
export async function syncAllProviders(userId: string): Promise<HealthSyncResult[]> {
  const connections = await getHealthConnections(userId);
  const activeConnections = connections.filter((c) => c.is_connected);

  const results: HealthSyncResult[] = [];

  for (const connection of activeConnections) {
    try {
      const result = await syncProvider(userId, connection.provider, connection.enabled_data_types);
      results.push(result);
    } catch (error) {
      console.error(`Failed to sync ${connection.provider}:`, error);
      results.push({
        provider: connection.provider,
        success: false,
        metrics_synced: 0,
        data_types: connection.enabled_data_types,
        sync_started_at: new Date().toISOString(),
        sync_completed_at: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

/**
 * Récupérer les métriques santé d'un utilisateur
 */
export async function getHealthMetrics(
  userId: string,
  options?: {
    provider?: HealthProvider;
    dataType?: HealthDataType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): Promise<HealthMetric[]> {
  let query = supabase
    .from('health_metrics')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false });

  if (options?.provider) {
    query = query.eq('provider', options.provider);
  }

  if (options?.dataType) {
    query = query.eq('data_type', options.dataType);
  }

  if (options?.startDate) {
    query = query.gte('timestamp', options.startDate.toISOString());
  }

  if (options?.endDate) {
    query = query.lte('timestamp', options.endDate.toISOString());
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch health metrics: ${error.message}`);
  return data || [];
}

/**
 * Récupérer les données agrégées (moyenne sur plusieurs providers)
 */
export async function getAggregatedHealthData(
  userId: string,
  dataType: HealthDataType,
  startDate: Date,
  endDate: Date,
  groupBy: 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<AggregatedHealthData[]> {
  const { data, error } = await supabase.functions.invoke('health-aggregate', {
    body: {
      userId,
      dataType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      groupBy,
    },
  });

  if (error) throw new Error(`Failed to aggregate health data: ${error.message}`);
  return data.aggregated || [];
}

/**
 * Générer des insights basés sur les données santé
 */
export async function generateHealthInsights(userId: string): Promise<HealthInsight[]> {
  const { data, error } = await supabase.functions.invoke('health-generate-insights', {
    body: { userId },
  });

  if (error) throw new Error(`Failed to generate health insights: ${error.message}`);
  return data.insights || [];
}

/**
 * Récupérer les insights d'un utilisateur
 */
export async function getHealthInsights(
  userId: string,
  unreadOnly = false
): Promise<HealthInsight[]> {
  let query = supabase
    .from('health_insights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (unreadOnly) {
    query = query.is('read_at', null);
  }

  const { data, error } = await query;

  if (error) throw new Error(`Failed to fetch health insights: ${error.message}`);
  return data || [];
}

/**
 * Marquer un insight comme lu
 */
export async function markInsightAsRead(insightId: string): Promise<void> {
  const { error } = await supabase
    .from('health_insights')
    .update({ read_at: new Date().toISOString() })
    .eq('id', insightId);

  if (error) throw new Error(`Failed to mark insight as read: ${error.message}`);
}

/**
 * Récupérer les préférences d'intégration
 */
export async function getIntegrationPreferences(
  userId: string
): Promise<HealthIntegrationPreferences | null> {
  const { data, error } = await supabase
    .from('health_integration_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch integration preferences: ${error.message}`);
  }

  return data;
}

/**
 * Mettre à jour les préférences d'intégration
 */
export async function updateIntegrationPreferences(
  userId: string,
  preferences: Partial<HealthIntegrationPreferences>
): Promise<HealthIntegrationPreferences> {
  const { data, error } = await supabase
    .from('health_integration_preferences')
    .upsert({ user_id: userId, ...preferences })
    .select()
    .single();

  if (error) throw new Error(`Failed to update integration preferences: ${error.message}`);
  return data;
}

/**
 * Supprimer toutes les données santé d'un utilisateur (RGPD)
 */
export async function deleteAllHealthData(userId: string): Promise<void> {
  // Supprimer les métriques
  const { error: metricsError } = await supabase
    .from('health_metrics')
    .delete()
    .eq('user_id', userId);

  if (metricsError) throw new Error(`Failed to delete health metrics: ${metricsError.message}`);

  // Supprimer les insights
  const { error: insightsError } = await supabase
    .from('health_insights')
    .delete()
    .eq('user_id', userId);

  if (insightsError) throw new Error(`Failed to delete health insights: ${insightsError.message}`);

  // Supprimer les connexions
  const { error: connectionsError } = await supabase
    .from('health_connections')
    .delete()
    .eq('user_id', userId);

  if (connectionsError) {
    throw new Error(`Failed to delete health connections: ${connectionsError.message}`);
  }

  // Supprimer les préférences
  const { error: preferencesError } = await supabase
    .from('health_integration_preferences')
    .delete()
    .eq('user_id', userId);

  if (preferencesError) {
    throw new Error(`Failed to delete integration preferences: ${preferencesError.message}`);
  }
}

/**
 * Exporter les données santé (RGPD)
 */
export async function exportHealthData(userId: string): Promise<{
  connections: HealthConnection[];
  metrics: HealthMetric[];
  insights: HealthInsight[];
  preferences: HealthIntegrationPreferences | null;
}> {
  const [connections, metrics, insights, preferences] = await Promise.all([
    getHealthConnections(userId),
    getHealthMetrics(userId),
    getHealthInsights(userId),
    getIntegrationPreferences(userId),
  ]);

  return {
    connections: connections.map((c) => ({
      ...c,
      access_token: '[REDACTED]',
      refresh_token: '[REDACTED]',
    })),
    metrics,
    insights,
    preferences,
  };
}

/**
 * Obtenir les statistiques de synchronisation
 */
export async function getSyncStatistics(userId: string): Promise<{
  total_metrics: number;
  metrics_by_provider: Record<HealthProvider, number>;
  metrics_by_type: Record<HealthDataType, number>;
  last_sync_by_provider: Record<HealthProvider, string | null>;
  sync_health: {
    provider: HealthProvider;
    status: 'healthy' | 'warning' | 'error';
    message: string;
  }[];
}> {
  const { data, error } = await supabase.functions.invoke('health-sync-statistics', {
    body: { userId },
  });

  if (error) throw new Error(`Failed to fetch sync statistics: ${error.message}`);
  return data.statistics;
}
