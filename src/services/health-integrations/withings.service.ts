/**
 * Service d'intégration Withings
 * Phase 3 - Excellence
 * API v2: https://developer.withings.com/api-reference
 */

import { supabase } from '@/lib/supabase';
import type {
  HealthConnection,
  HealthMetric,
  HealthSyncResult,
  HealthDataType,
} from '@/types/health-integrations';

const WITHINGS_CONFIG = {
  client_id: import.meta.env.VITE_WITHINGS_CLIENT_ID || '',
  client_secret: import.meta.env.VITE_WITHINGS_CLIENT_SECRET || '',
  redirect_uri: `${window.location.origin}/app/health/callback/withings`,
  auth_url: 'https://account.withings.com/oauth2_user/authorize2',
  token_url: 'https://wbsapi.withings.net/v2/oauth2',
  api_base_url: 'https://wbsapi.withings.net',
};

// Mapping des types de mesures Withings
const WITHINGS_MEASURE_TYPES = {
  weight: 1,
  height: 4,
  fat_free_mass: 5,
  fat_ratio: 6,
  fat_mass_weight: 8,
  diastolic_blood_pressure: 9,
  systolic_blood_pressure: 10,
  heart_rate: 11,
  temperature: 12,
  oxygen_saturation: 54,
  body_temperature: 71,
  muscle_mass: 76,
  bone_mass: 88,
};

/**
 * Initier la connexion Withings (OAuth 2.0)
 */
export async function initiateWithingsConnection(userId: string): Promise<string> {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: WITHINGS_CONFIG.client_id,
    redirect_uri: WITHINGS_CONFIG.redirect_uri,
    state: userId,
    scope: 'user.metrics,user.activity',
  });

  return `${WITHINGS_CONFIG.auth_url}?${params.toString()}`;
}

/**
 * Échanger le code OAuth contre des tokens
 */
export async function exchangeWithingsCode(
  code: string,
  userId: string
): Promise<HealthConnection> {
  const { data, error } = await supabase.functions.invoke('health-withings-exchange', {
    body: { code, userId, redirectUri: WITHINGS_CONFIG.redirect_uri },
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
 * Récupérer les mesures corporelles (poids, graisse, etc.)
 */
export async function getWithingsMeasures(
  accessToken: string,
  startTime: Date,
  endTime: Date,
  measureTypes?: number[]
): Promise<HealthMetric[]> {
  const params = new URLSearchParams({
    action: 'getmeas',
    startdate: Math.floor(startTime.getTime() / 1000).toString(),
    enddate: Math.floor(endTime.getTime() / 1000).toString(),
  });

  if (measureTypes) {
    params.append('meastypes', measureTypes.join(','));
  }

  const response = await fetch(`${WITHINGS_CONFIG.api_base_url}/measure?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withings API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 0) {
    throw new Error(`Withings API returned status ${data.status}`);
  }

  // Transformer les mesures en HealthMetric
  const metrics: HealthMetric[] = [];

  for (const measureGroup of data.body?.measuregrps || []) {
    const timestamp = new Date(measureGroup.date * 1000).toISOString();

    for (const measure of measureGroup.measures) {
      const dataType = getHealthDataType(measure.type);
      if (dataType) {
        // Appliquer le facteur d'échelle (Withings utilise des valeurs avec exposant)
        const value = measure.value * Math.pow(10, measure.unit);

        metrics.push({
          id: crypto.randomUUID(),
          user_id: '',
          provider: 'withings',
          data_type: dataType,
          value,
          unit: getUnit(measure.type),
          timestamp,
          metadata: {
            category: measureGroup.category,
            attrib: measureGroup.attrib,
            deviceid: measureGroup.deviceid,
          },
          synced_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        });
      }
    }
  }

  return metrics;
}

/**
 * Récupérer les données d'activité (pas, calories, etc.)
 */
export async function getWithingsActivity(
  accessToken: string,
  startDate: Date,
  endDate: Date
): Promise<HealthMetric[]> {
  const params = new URLSearchParams({
    action: 'getactivity',
    startdateymd: formatDateYMD(startDate),
    enddateymd: formatDateYMD(endDate),
  });

  const response = await fetch(`${WITHINGS_CONFIG.api_base_url}/v2/measure?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withings API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 0) {
    throw new Error(`Withings API returned status ${data.status}`);
  }

  const metrics: HealthMetric[] = [];

  for (const activity of data.body?.activities || []) {
    const date = activity.date; // Format: YYYY-MM-DD

    // Pas
    if (activity.steps) {
      metrics.push({
        id: crypto.randomUUID(),
        user_id: '',
        provider: 'withings',
        data_type: 'steps',
        value: activity.steps,
        unit: 'steps',
        timestamp: `${date}T12:00:00Z`,
        metadata: {
          distance: activity.distance,
          elevation: activity.elevation,
          calories: activity.calories,
        },
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }

    // Fréquence cardiaque moyenne
    if (activity.hr_average) {
      metrics.push({
        id: crypto.randomUUID(),
        user_id: '',
        provider: 'withings',
        data_type: 'heart_rate',
        value: activity.hr_average,
        unit: 'bpm',
        timestamp: `${date}T12:00:00Z`,
        metadata: {
          hr_min: activity.hr_min,
          hr_max: activity.hr_max,
          hr_zone_0: activity.hr_zone_0,
          hr_zone_1: activity.hr_zone_1,
          hr_zone_2: activity.hr_zone_2,
          hr_zone_3: activity.hr_zone_3,
        },
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  }

  return metrics;
}

/**
 * Récupérer les données de sommeil
 */
export async function getWithingsSleep(
  accessToken: string,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const params = new URLSearchParams({
    action: 'getsummary',
    startdateymd: formatDateYMD(startTime),
    enddateymd: formatDateYMD(endTime),
  });

  const response = await fetch(`${WITHINGS_CONFIG.api_base_url}/v2/sleep?${params}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withings API error: ${error.message || response.statusText}`);
  }

  const data = await response.json();

  if (data.status !== 0) {
    throw new Error(`Withings API returned status ${data.status}`);
  }

  const metrics: HealthMetric[] = [];

  for (const sleep of data.body?.series || []) {
    if (sleep.data?.total_sleep_time) {
      metrics.push({
        id: crypto.randomUUID(),
        user_id: '',
        provider: 'withings',
        data_type: 'sleep',
        value: sleep.data.total_sleep_time / 3600, // Convertir secondes en heures
        unit: 'hours',
        timestamp: new Date(sleep.startdate * 1000).toISOString(),
        metadata: {
          deep_sleep_duration: sleep.data.deepsleepduration,
          light_sleep_duration: sleep.data.lightsleepduration,
          rem_sleep_duration: sleep.data.remsleepduration,
          wake_up_count: sleep.data.wakeupcount,
          sleep_score: sleep.data.sleep_score,
        },
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  }

  return metrics;
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

function getHealthDataType(withingsType: number): HealthDataType | null {
  switch (withingsType) {
    case WITHINGS_MEASURE_TYPES.weight:
      return 'weight';
    case WITHINGS_MEASURE_TYPES.heart_rate:
      return 'heart_rate';
    case WITHINGS_MEASURE_TYPES.diastolic_blood_pressure:
    case WITHINGS_MEASURE_TYPES.systolic_blood_pressure:
      return 'blood_pressure';
    case WITHINGS_MEASURE_TYPES.oxygen_saturation:
      return 'oxygen_saturation';
    default:
      return null;
  }
}

function getUnit(withingsType: number): string {
  switch (withingsType) {
    case WITHINGS_MEASURE_TYPES.weight:
    case WITHINGS_MEASURE_TYPES.fat_mass_weight:
    case WITHINGS_MEASURE_TYPES.fat_free_mass:
    case WITHINGS_MEASURE_TYPES.muscle_mass:
    case WITHINGS_MEASURE_TYPES.bone_mass:
      return 'kg';
    case WITHINGS_MEASURE_TYPES.height:
      return 'm';
    case WITHINGS_MEASURE_TYPES.fat_ratio:
      return '%';
    case WITHINGS_MEASURE_TYPES.diastolic_blood_pressure:
    case WITHINGS_MEASURE_TYPES.systolic_blood_pressure:
      return 'mmHg';
    case WITHINGS_MEASURE_TYPES.heart_rate:
      return 'bpm';
    case WITHINGS_MEASURE_TYPES.temperature:
    case WITHINGS_MEASURE_TYPES.body_temperature:
      return '°C';
    case WITHINGS_MEASURE_TYPES.oxygen_saturation:
      return '%';
    default:
      return '';
  }
}

function formatDateYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
