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

export const healthIntegrationsService = {
  /**
   * Récupérer les connexions santé d'un utilisateur
   */
  async getConnections(userId: string): Promise<HealthConnection[]> {
    // Simulation - à implémenter avec vraie API
    return [];
  },

  /**
   * Connecter un provider santé
   */
  async connectProvider(userId: string, provider: HealthProvider): Promise<HealthConnection> {
    // Simulation - à implémenter avec OAuth flow
    throw new Error('Non implémenté - OAuth flow requis');
  },

  /**
   * Déconnecter un provider
   */
  async disconnectProvider(connectionId: string): Promise<void> {
    // À implémenter
  },

  /**
   * Synchroniser les données
   */
  async syncData(connectionId: string): Promise<HealthDataPoint[]> {
    // À implémenter avec vraie API
    return [];
  },

  /**
   * Récupérer le résumé quotidien
   */
  async getDailySummary(userId: string, date: string): Promise<HealthSummary | null> {
    // À implémenter
    return null;
  },

  /**
   * Récupérer les appareils connectés
   */
  async getDevices(userId: string): Promise<WearableDevice[]> {
    // À implémenter
    return [];
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
