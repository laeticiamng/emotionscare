/**
 * Service d'intégration Apple Health
 * Phase 3 - Excellence
 *
 * Note: Apple Health nécessite une app iOS native avec HealthKit.
 * Cette implémentation suppose l'utilisation d'une API bridge native.
 */

import { supabase } from '@/lib/supabase';
import type {
  HealthConnection,
  HealthMetric,
  HealthSyncResult,
  HealthDataType,
} from '@/types/health-integrations';

// Mapping des types de données Apple Health
const APPLE_HEALTH_DATA_TYPES = {
  heart_rate: 'HKQuantityTypeIdentifierHeartRate',
  steps: 'HKQuantityTypeIdentifierStepCount',
  sleep: 'HKCategoryTypeIdentifierSleepAnalysis',
  activity: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  weight: 'HKQuantityTypeIdentifierBodyMass',
  blood_pressure: 'HKQuantityTypeIdentifierBloodPressure',
  oxygen_saturation: 'HKQuantityTypeIdentifierOxygenSaturation',
};

/**
 * Vérifier si Apple Health est disponible (iOS uniquement)
 */
export async function isAppleHealthAvailable(): Promise<boolean> {
  // Vérifier si on est sur iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (!isIOS) return false;

  // Vérifier si l'API bridge native est disponible
  return typeof (window as any).webkit?.messageHandlers?.appleHealth !== 'undefined';
}

/**
 * Demander les autorisations Apple Health
 */
export async function requestAppleHealthAuthorization(
  userId: string,
  dataTypes: HealthDataType[]
): Promise<HealthConnection> {
  const available = await isAppleHealthAvailable();
  if (!available) {
    throw new Error('Apple Health is not available on this device');
  }

  // Convertir les types de données
  const healthKitTypes = dataTypes.map(
    (type) => APPLE_HEALTH_DATA_TYPES[type as keyof typeof APPLE_HEALTH_DATA_TYPES]
  );

  // Appeler le bridge natif
  const result = await callNativeBridge('requestAuthorization', {
    types: healthKitTypes,
  });

  if (!result.authorized) {
    throw new Error('User denied Apple Health authorization');
  }

  // Créer la connexion dans Supabase
  const { data, error } = await supabase.from('health_connections').insert({
    user_id: userId,
    provider: 'apple_health',
    is_connected: true,
    enabled_data_types: dataTypes,
    sync_frequency: 'hourly',
  }).select().single();

  if (error) throw new Error(`Failed to create Apple Health connection: ${error.message}`);
  return data;
}

/**
 * Synchroniser les données Apple Health
 */
export async function syncAppleHealthData(
  userId: string,
  dataTypes?: HealthDataType[]
): Promise<HealthSyncResult> {
  const available = await isAppleHealthAvailable();
  if (!available) {
    throw new Error('Apple Health is not available on this device');
  }

  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 7); // 7 derniers jours

  const metrics: HealthMetric[] = [];
  const typesToSync = dataTypes || Object.keys(APPLE_HEALTH_DATA_TYPES) as HealthDataType[];

  // Récupérer les données pour chaque type
  for (const dataType of typesToSync) {
    try {
      const typeMetrics = await getAppleHealthData(dataType, startTime, new Date());
      metrics.push(...typeMetrics.map(m => ({ ...m, user_id: userId })));
    } catch (error) {
      console.error(`Failed to sync ${dataType} from Apple Health:`, error);
    }
  }

  // Sauvegarder dans Supabase
  if (metrics.length > 0) {
    const { error } = await supabase.from('health_metrics').insert(metrics);
    if (error) {
      console.error('Failed to save Apple Health metrics:', error);
    }
  }

  // Mettre à jour la dernière sync
  await supabase
    .from('health_connections')
    .update({ last_sync_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('provider', 'apple_health');

  return {
    provider: 'apple_health',
    success: true,
    metrics_synced: metrics.length,
    data_types: typesToSync,
    sync_started_at: startTime.toISOString(),
    sync_completed_at: new Date().toISOString(),
  };
}

/**
 * Récupérer les données Apple Health via le bridge natif
 */
async function getAppleHealthData(
  dataType: HealthDataType,
  startTime: Date,
  endTime: Date
): Promise<HealthMetric[]> {
  const healthKitType = APPLE_HEALTH_DATA_TYPES[dataType as keyof typeof APPLE_HEALTH_DATA_TYPES];
  if (!healthKitType) {
    throw new Error(`Unsupported data type: ${dataType}`);
  }

  const result = await callNativeBridge('queryData', {
    type: healthKitType,
    startDate: startTime.toISOString(),
    endDate: endTime.toISOString(),
  });

  // Transformer les données HealthKit en HealthMetric
  return result.samples.map((sample: any) => ({
    id: crypto.randomUUID(),
    user_id: '',
    provider: 'apple_health' as const,
    data_type: dataType,
    value: sample.value,
    unit: sample.unit,
    timestamp: sample.startDate,
    metadata: {
      endDate: sample.endDate,
      source: sample.source,
      device: sample.device,
    },
    synced_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  }));
}

/**
 * Appeler le bridge natif iOS
 */
function callNativeBridge(method: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const messageId = crypto.randomUUID();

    // Créer un listener pour la réponse
    const responseListener = (event: MessageEvent) => {
      if (event.data.messageId === messageId) {
        window.removeEventListener('message', responseListener);
        if (event.data.error) {
          reject(new Error(event.data.error));
        } else {
          resolve(event.data.result);
        }
      }
    };

    window.addEventListener('message', responseListener);

    // Envoyer le message au bridge natif
    (window as any).webkit.messageHandlers.appleHealth.postMessage({
      messageId,
      method,
      params,
    });

    // Timeout après 30 secondes
    setTimeout(() => {
      window.removeEventListener('message', responseListener);
      reject(new Error('Apple Health bridge timeout'));
    }, 30000);
  });
}

/**
 * Déconnecter Apple Health
 */
export async function disconnectAppleHealth(userId: string): Promise<void> {
  const { error } = await supabase
    .from('health_connections')
    .update({ is_connected: false })
    .eq('user_id', userId)
    .eq('provider', 'apple_health');

  if (error) throw new Error(`Failed to disconnect Apple Health: ${error.message}`);
}

/**
 * Obtenir les autorisations accordées
 */
export async function getAppleHealthPermissions(): Promise<{
  authorized: HealthDataType[];
  denied: HealthDataType[];
}> {
  const available = await isAppleHealthAvailable();
  if (!available) {
    return { authorized: [], denied: [] };
  }

  const result = await callNativeBridge('getAuthorizedTypes', {});

  const authorized: HealthDataType[] = [];
  const denied: HealthDataType[] = [];

  for (const [dataType, healthKitType] of Object.entries(APPLE_HEALTH_DATA_TYPES)) {
    if (result.authorizedTypes.includes(healthKitType)) {
      authorized.push(dataType as HealthDataType);
    } else {
      denied.push(dataType as HealthDataType);
    }
  }

  return { authorized, denied };
}
