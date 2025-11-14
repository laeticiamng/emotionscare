/**
 * Types pour les intégrations santé (Phase 3 - Excellence)
 * Google Fit, Apple Health, Withings
 */

export type HealthProvider = 'google_fit' | 'apple_health' | 'withings';

export type HealthDataType =
  | 'heart_rate'
  | 'steps'
  | 'sleep'
  | 'activity'
  | 'weight'
  | 'blood_pressure'
  | 'oxygen_saturation'
  | 'stress_level';

export interface HealthMetric {
  id: string;
  user_id: string;
  provider: HealthProvider;
  data_type: HealthDataType;
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  synced_at: string;
  created_at: string;
}

export interface HealthConnection {
  id: string;
  user_id: string;
  provider: HealthProvider;
  is_connected: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expires_at?: string;
  last_sync_at?: string;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  enabled_data_types: HealthDataType[];
  created_at: string;
  updated_at: string;
}

export interface HealthSyncResult {
  provider: HealthProvider;
  success: boolean;
  metrics_synced: number;
  data_types: HealthDataType[];
  sync_started_at: string;
  sync_completed_at: string;
  error?: string;
}

export interface HealthInsight {
  id: string;
  user_id: string;
  type: 'trend' | 'anomaly' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  data_type: HealthDataType;
  severity: 'info' | 'warning' | 'success' | 'error';
  action_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  read_at?: string;
}

// Configuration OAuth pour chaque provider
export interface HealthProviderConfig {
  provider: HealthProvider;
  client_id: string;
  client_secret?: string;
  redirect_uri: string;
  scopes: string[];
  auth_url: string;
  token_url: string;
  api_base_url: string;
}

// Données agrégées multi-providers
export interface AggregatedHealthData {
  data_type: HealthDataType;
  date: string;
  average_value: number;
  min_value: number;
  max_value: number;
  unit: string;
  data_points: number;
  providers: HealthProvider[];
}

// Préférences utilisateur pour les intégrations
export interface HealthIntegrationPreferences {
  user_id: string;
  auto_sync_enabled: boolean;
  sync_frequency: 'realtime' | 'hourly' | 'daily';
  notification_on_sync: boolean;
  notification_on_insights: boolean;
  preferred_providers: HealthProvider[];
  data_retention_days: number;
  share_with_coach: boolean;
  share_with_therapist: boolean;
}
