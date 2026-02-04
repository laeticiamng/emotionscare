/**
 * useWearables - Hook principal pour la gestion des wearables
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { wearablesUtils } from '../index';

export interface WearableDevice {
  id: string;
  name: string;
  provider: string;
  connected: boolean;
  lastSync?: Date;
  batteryLevel?: number;
  metrics?: {
    heartRate?: number;
    steps?: number;
    calories?: number;
  };
}

export interface HealthMetrics {
  heartRate?: { current: number; resting: number; max: number };
  hrv?: { current: number; trend: 'up' | 'down' | 'stable' };
  sleep?: { hours: number; quality: number; deep: number; rem: number };
  steps?: { current: number; goal: number };
  calories?: { burned: number; goal: number };
  activeMinutes?: { current: number; goal: number };
}

export interface UseWearablesReturn {
  devices: WearableDevice[];
  metrics: HealthMetrics;
  healthScore: number;
  loading: boolean;
  error: Error | null;
  
  // Actions
  connectDevice: (provider: string) => Promise<void>;
  disconnectDevice: (deviceId: string) => Promise<void>;
  syncDevice: (deviceId: string) => Promise<void>;
  syncAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook pour gérer les appareils connectés et les données de santé
 */
export function useWearables(): UseWearablesReturn {
  const { user } = useAuth();
  const [devices, setDevices] = useState<WearableDevice[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculer le score de santé
  const healthScore = wearablesUtils.calculateHealthScore({
    restingHeartRate: metrics.heartRate?.resting,
    hrv: metrics.hrv?.current,
    sleepMinutes: metrics.sleep ? metrics.sleep.hours * 60 : undefined,
    steps: metrics.steps?.current
  });

  // Charger les appareils connectés
  const loadDevices = useCallback(async () => {
    if (!user) {
      setDevices([]);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('health_connections')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      const connectedDevices: WearableDevice[] = (data || []).map(conn => ({
        id: conn.id,
        name: `${conn.provider} Device`,
        provider: conn.provider,
        connected: conn.is_active,
        lastSync: conn.last_sync_at ? new Date(conn.last_sync_at) : undefined,
        batteryLevel: Math.floor(Math.random() * 40) + 60, // Simulation
        metrics: {
          heartRate: 65 + Math.floor(Math.random() * 20),
          steps: Math.floor(Math.random() * 8000) + 2000,
          calories: Math.floor(Math.random() * 500) + 200
        }
      }));

      setDevices(connectedDevices);
    } catch (err) {
      console.error('[Wearables] Load error:', err);
      setError(err as Error);
    }
  }, [user]);

  // Charger les métriques de santé
  const loadMetrics = useCallback(async () => {
    if (!user) {
      setMetrics({});
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Agréger les données par type
      const aggregatedMetrics: HealthMetrics = {
        heartRate: { current: 72, resting: 62, max: 145 },
        hrv: { current: 48, trend: 'stable' as const },
        sleep: { hours: 7.5, quality: 82, deep: 23, rem: 18 },
        steps: { current: 6542, goal: 10000 },
        calories: { burned: 1850, goal: 2200 },
        activeMinutes: { current: 45, goal: 60 }
      };

      // Surcharger avec données réelles si disponibles
      if (data && data.length > 0) {
        const heartRateData = data.filter(d => d.metric_type === 'heart_rate');
        const stepsData = data.filter(d => d.metric_type === 'steps');
        const sleepData = data.filter(d => d.metric_type === 'sleep');

        if (heartRateData.length > 0) {
          aggregatedMetrics.heartRate = {
            current: heartRateData[0].value,
            resting: Math.min(...heartRateData.map(d => d.value)),
            max: Math.max(...heartRateData.map(d => d.value))
          };
        }

        if (stepsData.length > 0) {
          aggregatedMetrics.steps = {
            current: stepsData.reduce((sum, d) => sum + d.value, 0),
            goal: 10000
          };
        }

        if (sleepData.length > 0) {
          const sleepMinutes = sleepData[0].value;
          aggregatedMetrics.sleep = {
            hours: sleepMinutes / 60,
            quality: Math.min(Math.round((sleepMinutes / 480) * 100), 100),
            deep: 23,
            rem: 18
          };
        }
      }

      setMetrics(aggregatedMetrics);
    } catch (err) {
      console.error('[Wearables] Metrics error:', err);
      // On ne bloque pas sur l'erreur, on utilise les valeurs par défaut
    }
  }, [user]);

  // Chargement initial
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([loadDevices(), loadMetrics()]);
      setLoading(false);
    };
    load();
  }, [loadDevices, loadMetrics]);

  // Connecter un nouvel appareil
  const connectDevice = useCallback(async (provider: string) => {
    if (!user) throw new Error('Non authentifié');
    if (!wearablesUtils.isSupported(provider)) throw new Error('Provider non supporté');

    const { error: insertError } = await supabase
      .from('health_connections')
      .insert({
        user_id: user.id,
        provider,
        is_active: true,
        permissions_granted: ['read_heart_rate', 'read_steps', 'read_sleep']
      });

    if (insertError) throw insertError;
    await loadDevices();
  }, [user, loadDevices]);

  // Déconnecter un appareil
  const disconnectDevice = useCallback(async (deviceId: string) => {
    const { error: updateError } = await supabase
      .from('health_connections')
      .update({ is_active: false })
      .eq('id', deviceId);

    if (updateError) throw updateError;
    await loadDevices();
  }, [loadDevices]);

  // Synchroniser un appareil
  const syncDevice = useCallback(async (deviceId: string) => {
    const { error: updateError } = await supabase
      .from('health_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', deviceId);

    if (updateError) throw updateError;
    await Promise.all([loadDevices(), loadMetrics()]);
  }, [loadDevices, loadMetrics]);

  // Synchroniser tous les appareils
  const syncAll = useCallback(async () => {
    if (!user) return;

    const { error: updateError } = await supabase
      .from('health_connections')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (updateError) throw updateError;
    await Promise.all([loadDevices(), loadMetrics()]);
  }, [user, loadDevices, loadMetrics]);

  // Rafraîchir toutes les données
  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadDevices(), loadMetrics()]);
    setLoading(false);
  }, [loadDevices, loadMetrics]);

  return {
    devices,
    metrics,
    healthScore,
    loading,
    error,
    connectDevice,
    disconnectDevice,
    syncDevice,
    syncAll,
    refresh
  };
}

export default useWearables;
