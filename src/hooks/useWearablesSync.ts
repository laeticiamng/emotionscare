/**
 * useWearablesSync - Synchronisation enrichie avec Wearables (Garmin, Apple Health, Fitbit, Google Fit)
 * Agrège les données santé multi-source avec insights IA
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

export type WearableProvider = 'garmin' | 'apple_health' | 'fitbit' | 'google_fit' | 'withings';

export interface WearableConnection {
  provider: WearableProvider;
  connected: boolean;
  lastSync: string | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  errorMessage?: string;
}

export interface HealthMetrics {
  heartRate: {
    current: number | null;
    resting: number | null;
    max: number | null;
    min: number | null;
    avg24h: number | null;
  };
  hrv: {
    current: number | null;
    avg7d: number | null;
    trend: 'improving' | 'stable' | 'declining';
  };
  sleep: {
    duration: number | null; // minutes
    quality: number | null; // 0-100
    deepSleep: number | null; // minutes
    remSleep: number | null;
    lightSleep: number | null;
    awakeTime: number | null;
  };
  activity: {
    steps: number;
    distance: number; // meters
    calories: number;
    activeMinutes: number;
    floors: number;
  };
  stress: {
    level: number | null; // 0-100
    trend: 'decreasing' | 'stable' | 'increasing';
  };
  respiration: {
    rate: number | null; // breaths/min
    avg: number | null;
  };
  bodyBattery: number | null; // 0-100 (Garmin specific)
  spo2: number | null; // blood oxygen
}

export interface HealthInsight {
  id: string;
  type: 'alert' | 'recommendation' | 'achievement' | 'trend';
  title: string;
  description: string;
  metric: string;
  severity: 'info' | 'warning' | 'success' | 'critical';
  createdAt: string;
  actionable: boolean;
  suggestedAction?: string;
}

const SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = 'wearables_metrics_cache';

export function useWearablesSync() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<WearableConnection[]>([]);
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger les connexions existantes
  useEffect(() => {
    if (!user) return;

    const loadConnections = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', user.id)
          .eq('key', 'wearable_connections')
          .maybeSingle();

        if (!fetchError && data?.value) {
          setConnections(JSON.parse(data.value));
        }

        // Charger le cache des métriques
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { metrics: cachedMetrics, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < SYNC_INTERVAL) {
            setMetrics(cachedMetrics);
            setLastSyncTime(new Date(timestamp).toISOString());
          }
        }
      } catch (err) {
        logger.error('Failed to load wearable connections', err as Error, 'WEARABLES');
      }
    };

    loadConnections();
  }, [user]);

  // Connecter un appareil
  const connectDevice = useCallback(async (provider: WearableProvider): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);
      
      // Appeler l'edge function pour initier OAuth
      const { data, error: funcError } = await supabase.functions.invoke('wearables-sync', {
        body: {
          action: 'connect',
          provider,
          userId: user.id,
          redirectUrl: `${window.location.origin}/settings/wearables/callback`,
        },
      });

      if (funcError) throw funcError;

      if (data?.authUrl) {
        // Ouvrir le popup d'authentification
        const popup = window.open(data.authUrl, 'wearable_auth', 'width=600,height=700');
        
        // Attendre la fin de l'auth
        return new Promise((resolve) => {
          const checkClosed = setInterval(() => {
            if (popup?.closed) {
              clearInterval(checkClosed);
              // Recharger les connexions
              loadConnectionsAfterAuth();
              resolve(true);
            }
          }, 500);

          // Timeout après 5 minutes
          setTimeout(() => {
            clearInterval(checkClosed);
            popup?.close();
            resolve(false);
          }, 5 * 60 * 1000);
        });
      }

      // Connexion directe (pour certains providers)
      const newConnection: WearableConnection = {
        provider,
        connected: true,
        lastSync: null,
        status: 'connected',
      };

      setConnections(prev => [...prev.filter(c => c.provider !== provider), newConnection]);
      await saveConnections([...connections.filter(c => c.provider !== provider), newConnection]);

      logger.info('Wearable connected', { provider }, 'WEARABLES');
      return true;
    } catch (err) {
      setError((err as Error).message);
      logger.error('Failed to connect wearable', err as Error, 'WEARABLES');
      return false;
    }
  }, [user, connections]);

  // Sauvegarder les connexions
  const saveConnections = async (conns: WearableConnection[]) => {
    if (!user) return;

    await supabase.from('user_settings').upsert({
      user_id: user.id,
      key: 'wearable_connections',
      value: JSON.stringify(conns),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,key' });
  };

  // Recharger les connexions après auth OAuth
  const loadConnectionsAfterAuth = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', user.id)
      .eq('key', 'wearable_connections')
      .maybeSingle();

    if (data?.value) {
      setConnections(JSON.parse(data.value));
    }
  };

  // Déconnecter un appareil
  const disconnectDevice = useCallback(async (provider: WearableProvider): Promise<boolean> => {
    if (!user) return false;

    try {
      await supabase.functions.invoke('wearables-sync', {
        body: { action: 'disconnect', provider, userId: user.id },
      });

      const updated = connections.filter(c => c.provider !== provider);
      setConnections(updated);
      await saveConnections(updated);

      logger.info('Wearable disconnected', { provider }, 'WEARABLES');
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  }, [user, connections]);

  // Synchroniser les données
  const syncData = useCallback(async (provider?: WearableProvider): Promise<void> => {
    if (!user) return;

    const toSync = provider
      ? connections.filter(c => c.provider === provider && c.connected)
      : connections.filter(c => c.connected);

    if (toSync.length === 0) return;

    setIsSyncing(true);
    setError(null);

    try {
      // Mettre à jour le statut des connexions
      setConnections(prev =>
        prev.map(c =>
          toSync.find(s => s.provider === c.provider)
            ? { ...c, status: 'syncing' as const }
            : c
        )
      );

      const { data, error: syncError } = await supabase.functions.invoke('wearables-sync', {
        body: {
          action: 'sync',
          providers: toSync.map(c => c.provider),
          userId: user.id,
        },
      });

      if (syncError) throw syncError;

      // Agréger les données de tous les providers
      const aggregatedMetrics = aggregateMetrics(data.metrics || {});
      setMetrics(aggregatedMetrics);

      // Générer les insights
      const newInsights = generateInsights(aggregatedMetrics);
      setInsights(newInsights);

      // Mettre en cache
      const now = new Date().toISOString();
      setLastSyncTime(now);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        metrics: aggregatedMetrics,
        timestamp: Date.now(),
      }));

      // Mettre à jour les connexions
      setConnections(prev =>
        prev.map(c => ({
          ...c,
          status: 'connected' as const,
          lastSync: now,
        }))
      );

      // Sauvegarder dans Supabase pour historique (table optionnelle)
      try {
        await supabase.from('health_metrics_history').insert({
          user_id: user.id,
          metrics: aggregatedMetrics,
          sources: toSync.map(c => c.provider),
          synced_at: now,
        });
      } catch {}

      logger.info('Wearables sync complete', { providers: toSync.length }, 'WEARABLES');
    } catch (err) {
      setError((err as Error).message);
      setConnections(prev =>
        prev.map(c => ({
          ...c,
          status: toSync.find(s => s.provider === c.provider) ? 'error' as const : c.status,
          errorMessage: (err as Error).message,
        }))
      );
      logger.error('Wearables sync failed', err as Error, 'WEARABLES');
    } finally {
      setIsSyncing(false);
    }
  }, [user, connections]);

  // Agréger les métriques de plusieurs sources
  const aggregateMetrics = (rawData: Record<string, any>): HealthMetrics => {
    // Prioriser les données selon les sources (Garmin > Apple > Fitbit > Google)
    const priority: WearableProvider[] = ['garmin', 'apple_health', 'fitbit', 'google_fit', 'withings'];

    const getFirstAvailable = <T,>(key: string, path: string[]): T | null => {
      for (const provider of priority) {
        const data = rawData[provider];
        if (data) {
          let value = data;
          for (const p of path) {
            value = value?.[p];
          }
          if (value !== undefined && value !== null) {
            return value as T;
          }
        }
      }
      return null;
    };

    return {
      heartRate: {
        current: getFirstAvailable('heartRate', ['current']),
        resting: getFirstAvailable('heartRate', ['resting']),
        max: getFirstAvailable('heartRate', ['max']),
        min: getFirstAvailable('heartRate', ['min']),
        avg24h: getFirstAvailable('heartRate', ['avg24h']),
      },
      hrv: {
        current: getFirstAvailable('hrv', ['current']),
        avg7d: getFirstAvailable('hrv', ['avg7d']),
        trend: getFirstAvailable('hrv', ['trend']) || 'stable',
      },
      sleep: {
        duration: getFirstAvailable('sleep', ['duration']),
        quality: getFirstAvailable('sleep', ['quality']),
        deepSleep: getFirstAvailable('sleep', ['deepSleep']),
        remSleep: getFirstAvailable('sleep', ['remSleep']),
        lightSleep: getFirstAvailable('sleep', ['lightSleep']),
        awakeTime: getFirstAvailable('sleep', ['awakeTime']),
      },
      activity: {
        steps: getFirstAvailable('activity', ['steps']) || 0,
        distance: getFirstAvailable('activity', ['distance']) || 0,
        calories: getFirstAvailable('activity', ['calories']) || 0,
        activeMinutes: getFirstAvailable('activity', ['activeMinutes']) || 0,
        floors: getFirstAvailable('activity', ['floors']) || 0,
      },
      stress: {
        level: getFirstAvailable('stress', ['level']),
        trend: getFirstAvailable('stress', ['trend']) || 'stable',
      },
      respiration: {
        rate: getFirstAvailable('respiration', ['rate']),
        avg: getFirstAvailable('respiration', ['avg']),
      },
      bodyBattery: getFirstAvailable('bodyBattery', []),
      spo2: getFirstAvailable('spo2', []),
    };
  };

  // Générer des insights basés sur les métriques
  const generateInsights = (m: HealthMetrics): HealthInsight[] => {
    const newInsights: HealthInsight[] = [];
    const now = new Date().toISOString();

    // Insight HRV
    if (m.hrv.current && m.hrv.avg7d) {
      const diff = ((m.hrv.current - m.hrv.avg7d) / m.hrv.avg7d) * 100;
      if (diff < -15) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: 'alert',
          title: 'HRV en baisse',
          description: `Votre variabilité cardiaque est ${Math.abs(diff).toFixed(0)}% en dessous de votre moyenne. Cela peut indiquer du stress ou de la fatigue.`,
          metric: 'hrv',
          severity: 'warning',
          createdAt: now,
          actionable: true,
          suggestedAction: 'Une session de respiration cohérente pourrait aider',
        });
      } else if (diff > 15) {
        newInsights.push({
          id: crypto.randomUUID(),
          type: 'achievement',
          title: 'Excellente récupération',
          description: `Votre HRV est ${diff.toFixed(0)}% au-dessus de votre moyenne. Votre corps récupère bien !`,
          metric: 'hrv',
          severity: 'success',
          createdAt: now,
          actionable: false,
        });
      }
    }

    // Insight sommeil
    if (m.sleep.duration && m.sleep.duration < 360) { // < 6h
      newInsights.push({
        id: crypto.randomUUID(),
        type: 'alert',
        title: 'Sommeil insuffisant',
        description: `Vous n'avez dormi que ${Math.round(m.sleep.duration / 60)}h. L'idéal est entre 7-9h pour adultes.`,
        metric: 'sleep',
        severity: 'warning',
        createdAt: now,
        actionable: true,
        suggestedAction: 'Essayez de vous coucher 30min plus tôt ce soir',
      });
    }

    // Insight activité
    if (m.activity.steps >= 10000) {
      newInsights.push({
        id: crypto.randomUUID(),
        type: 'achievement',
        title: 'Objectif de pas atteint !',
        description: `Félicitations ! Vous avez fait ${m.activity.steps.toLocaleString()} pas aujourd'hui.`,
        metric: 'activity',
        severity: 'success',
        createdAt: now,
        actionable: false,
      });
    }

    // Insight stress
    if (m.stress.level && m.stress.level > 70) {
      newInsights.push({
        id: crypto.randomUUID(),
        type: 'recommendation',
        title: 'Niveau de stress élevé',
        description: `Votre niveau de stress est à ${m.stress.level}%. Prenez un moment pour vous.`,
        metric: 'stress',
        severity: 'critical',
        createdAt: now,
        actionable: true,
        suggestedAction: 'Essayez une session de respiration 4-7-8',
      });
    }

    // Insight body battery
    if (m.bodyBattery !== null && m.bodyBattery < 25) {
      newInsights.push({
        id: crypto.randomUUID(),
        type: 'alert',
        title: 'Énergie basse',
        description: `Votre Body Battery est à ${m.bodyBattery}%. Votre corps a besoin de repos.`,
        metric: 'bodyBattery',
        severity: 'warning',
        createdAt: now,
        actionable: true,
        suggestedAction: 'Privilégiez des activités calmes et reposantes',
      });
    }

    return newInsights;
  };

  // Sync automatique périodique
  useEffect(() => {
    if (!user || connections.filter(c => c.connected).length === 0) return;

    const interval = setInterval(() => {
      syncData();
    }, SYNC_INTERVAL);

    return () => clearInterval(interval);
  }, [user, connections, syncData]);

  // Score de bien-être global
  const wellnessScore = useCallback((): number | null => {
    if (!metrics) return null;

    let score = 50;
    let factors = 0;

    // Sommeil (30% du score)
    if (metrics.sleep.quality) {
      score += (metrics.sleep.quality - 50) * 0.3;
      factors++;
    }

    // Stress (25% inversé)
    if (metrics.stress.level !== null) {
      score += (100 - metrics.stress.level - 50) * 0.25;
      factors++;
    }

    // Activité (25%)
    if (metrics.activity.steps > 0) {
      const stepScore = Math.min(100, (metrics.activity.steps / 10000) * 100);
      score += (stepScore - 50) * 0.25;
      factors++;
    }

    // HRV tendance (20%)
    if (metrics.hrv.trend === 'improving') {
      score += 10;
    } else if (metrics.hrv.trend === 'declining') {
      score -= 10;
    }

    return factors > 0 ? Math.max(0, Math.min(100, Math.round(score))) : null;
  }, [metrics]);

  return {
    // État
    connections,
    metrics,
    insights,
    isSyncing,
    lastSyncTime,
    error,

    // Actions
    connectDevice,
    disconnectDevice,
    syncData,

    // Computed
    wellnessScore: wellnessScore(),
    connectedCount: connections.filter(c => c.connected).length,
    hasConnections: connections.some(c => c.connected),
  };
}

export default useWearablesSync;
