/**
 * Feature: Health Integrations
 * Intégrations avec wearables et apps santé (Apple Health, Google Fit, etc.)
 */

// ============================================================================
// COMPONENTS
// ============================================================================

export { HealthIntegrationsManager } from './components/HealthIntegrationsManager';
export { default as WearablesDashboard } from './components/WearablesDashboard';

// ============================================================================
// HOOKS
// ============================================================================

// Re-exports from hooks for compatibility
export { useHRV } from '@/hooks/useHRV';
export { useHeartRate } from '@/hooks/useHeartRate';
export { usePedometer } from '@/hooks/usePedometer';
export { useHRStream } from '@/hooks/useHRStream';

// ============================================================================
// TYPES
// ============================================================================

export type HealthProvider = 'apple_health' | 'google_fit' | 'fitbit' | 'garmin' | 'whoop' | 'oura';

export interface HealthConnection {
  id: string;
  user_id: string;
  provider: HealthProvider;
  connected_at: string;
  last_sync_at: string;
  status: 'connected' | 'disconnected' | 'error';
  permissions: HealthPermission[];
  metadata?: Record<string, unknown>;
}

export type HealthPermission = 
  | 'heart_rate'
  | 'hrv'
  | 'steps'
  | 'sleep'
  | 'activity'
  | 'stress'
  | 'oxygen'
  | 'respiration';

export interface HealthDataPoint {
  id: string;
  user_id: string;
  provider: HealthProvider;
  metric_type: HealthMetricType;
  value: number;
  unit: string;
  recorded_at: string;
  synced_at: string;
}

export type HealthMetricType = 
  | 'heart_rate'
  | 'heart_rate_variability'
  | 'steps'
  | 'sleep_duration'
  | 'sleep_quality'
  | 'active_minutes'
  | 'calories'
  | 'stress_level'
  | 'oxygen_saturation'
  | 'respiration_rate';

export interface HealthSummary {
  user_id: string;
  date: string;
  metrics: {
    avg_heart_rate?: number;
    resting_heart_rate?: number;
    hrv_rmssd?: number;
    total_steps?: number;
    sleep_duration_minutes?: number;
    sleep_score?: number;
    active_minutes?: number;
    stress_score?: number;
  };
  provider_data: Record<HealthProvider, Partial<HealthSummary['metrics']>>;
}

export interface WearableDevice {
  id: string;
  user_id: string;
  provider: HealthProvider;
  device_name: string;
  device_model?: string;
  firmware_version?: string;
  battery_level?: number;
  last_seen_at: string;
}

// ============================================================================
// SERVICE
// ============================================================================

import { supabase } from '@/integrations/supabase/client';

export const healthIntegrationsService = {
  /**
   * Récupérer les connexions santé d'un utilisateur
   */
  async getConnections(userId: string): Promise<HealthConnection[]> {
    const { data, error } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching health connections:', error);
      return [];
    }

    return (data || []).map(conn => ({
      id: conn.id,
      user_id: conn.user_id,
      provider: conn.provider as HealthProvider,
      connected_at: conn.connected_at,
      last_sync_at: conn.last_sync_at || conn.connected_at,
      status: conn.status as 'connected' | 'disconnected' | 'error',
      permissions: conn.permissions as HealthPermission[] || [],
      metadata: conn.metadata as Record<string, unknown> || {},
    }));
  },

  /**
   * Connecter un provider santé via Edge Function
   */
  async connectProvider(userId: string, provider: HealthProvider): Promise<HealthConnection> {
    const { data, error } = await supabase.functions.invoke('wearables-sync', {
      body: { action: 'connect', provider }
    });

    if (error) {
      throw new Error(`Connexion impossible: ${error.message}`);
    }

    return {
      id: data.connectionId || crypto.randomUUID(),
      user_id: userId,
      provider,
      connected_at: new Date().toISOString(),
      last_sync_at: new Date().toISOString(),
      status: 'connected',
      permissions: data.permissions || [],
    };
  },

  /**
   * Déconnecter un provider
   */
  async disconnectProvider(connectionId: string): Promise<void> {
    const { error } = await supabase
      .from('wearable_connections')
      .update({ status: 'disconnected' })
      .eq('id', connectionId);
    
    if (error) {
      throw new Error(`Déconnexion impossible: ${error.message}`);
    }
  },

  /**
   * Synchroniser les données via Edge Function
   */
  async syncData(connectionId: string): Promise<HealthDataPoint[]> {
    const { data, error } = await supabase.functions.invoke('wearables-sync', {
      body: { action: 'sync', connectionId }
    });

    if (error) {
      throw new Error(`Synchronisation impossible: ${error.message}`);
    }

    return data?.dataPoints || [];
  },

  /**
   * Récupérer le résumé quotidien
   */
  async getDailySummary(userId: string, date: string): Promise<HealthSummary | null> {
    const { data, error } = await supabase.functions.invoke('wearables-dashboard', {
      body: { userId, date }
    });

    if (error || !data) {
      return null;
    }

    return {
      user_id: userId,
      date,
      metrics: data.metrics || {},
      provider_data: data.providerData || {},
    };
  },

  /**
   * Récupérer les appareils connectés
   */
  async getDevices(userId: string): Promise<WearableDevice[]> {
    const { data, error } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'connected');

    if (error) {
      console.error('Error fetching devices:', error);
      return [];
    }

    return (data || []).map(conn => ({
      id: conn.id,
      user_id: conn.user_id,
      provider: conn.provider as HealthProvider,
      device_name: conn.device_name || HEALTH_PROVIDERS[conn.provider as HealthProvider]?.name || 'Appareil inconnu',
      device_model: conn.device_model,
      firmware_version: conn.firmware_version,
      battery_level: conn.battery_level,
      last_seen_at: conn.last_sync_at || conn.connected_at,
    }));
  },

  /**
   * Récupérer l'historique des données de santé
   */
  async getHealthHistory(userId: string, days: number = 7): Promise<HealthDataPoint[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('health_data_points')
      .select('*')
      .eq('user_id', userId)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching health history:', error);
      return [];
    }

    return (data || []).map(point => ({
      id: point.id,
      user_id: point.user_id,
      provider: point.provider as HealthProvider,
      metric_type: point.metric_type as HealthMetricType,
      value: point.value,
      unit: point.unit,
      recorded_at: point.recorded_at,
      synced_at: point.synced_at,
    }));
  },

  /**
   * Calculer les corrélations humeur/santé
   */
  async calculateCorrelations(userId: string): Promise<{
    sleepMood: number;
    activityMood: number;
    hrvStress: number;
  }> {
    // Call AI router for correlation analysis
    const { data, error } = await supabase.functions.invoke('ai-router', {
      body: {
        action: 'correlate_health_mood',
        userId,
      }
    });

    if (error || !data) {
      return { sleepMood: 0, activityMood: 0, hrvStress: 0 };
    }

    return {
      sleepMood: data.sleepMood || 0,
      activityMood: data.activityMood || 0,
      hrvStress: data.hrvStress || 0,
    };
  },
};

// ============================================================================
// PROVIDER CONFIGS
// ============================================================================

export const HEALTH_PROVIDERS: Record<HealthProvider, {
  name: string;
  icon: string;
  color: string;
  supportedMetrics: HealthMetricType[];
  oauthUrl?: string;
}> = {
  apple_health: {
    name: 'Apple Health',
    icon: '❤️',
    color: '#FF3B30',
    supportedMetrics: ['heart_rate', 'heart_rate_variability', 'steps', 'sleep_duration', 'active_minutes', 'oxygen_saturation'],
  },
  google_fit: {
    name: 'Google Fit',
    icon: '💚',
    color: '#4285F4',
    supportedMetrics: ['heart_rate', 'steps', 'sleep_duration', 'active_minutes', 'calories'],
  },
  fitbit: {
    name: 'Fitbit',
    icon: '🏃',
    color: '#00B0B9',
    supportedMetrics: ['heart_rate', 'heart_rate_variability', 'steps', 'sleep_duration', 'sleep_quality', 'active_minutes', 'stress_level'],
  },
  garmin: {
    name: 'Garmin',
    icon: '⌚',
    color: '#007CC3',
    supportedMetrics: ['heart_rate', 'heart_rate_variability', 'steps', 'sleep_duration', 'active_minutes', 'stress_level', 'respiration_rate'],
  },
  whoop: {
    name: 'WHOOP',
    icon: '💪',
    color: '#00A9FF',
    supportedMetrics: ['heart_rate', 'heart_rate_variability', 'sleep_duration', 'sleep_quality', 'stress_level'],
  },
  oura: {
    name: 'Oura Ring',
    icon: '💍',
    color: '#232323',
    supportedMetrics: ['heart_rate', 'heart_rate_variability', 'sleep_duration', 'sleep_quality', 'respiration_rate'],
  },
};
