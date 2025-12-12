/**
 * useVRGalaxyEnriched - Hook enrichi pour l'expérience VR Galaxy
 * Intègre: persistance Supabase, biométriques, favoris, statistiques, export
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';
import type { 
  VRGalaxySession, 
  Discovery, 
  CosmicProgressionStats,
  BiometricMetrics,
  SessionReport 
} from '../types';

interface GalaxyFavorite {
  id: string;
  galaxyType: string;
  name: string;
  addedAt: string;
  visitCount: number;
}

interface VRGalaxyState {
  isImmersed: boolean;
  galaxyType: string;
  currentSession: VRGalaxySession | null;
  discoveries: Discovery[];
  biometrics: BiometricMetrics;
  favorites: GalaxyFavorite[];
  stats: CosmicProgressionStats;
  isLoading: boolean;
  error: string | null;
}

interface UseVRGalaxyEnrichedReturn extends VRGalaxyState {
  enterGalaxy: (galaxyType?: string) => Promise<void>;
  exitGalaxy: () => Promise<SessionReport | null>;
  recordDiscovery: (discovery: Omit<Discovery, 'timestamp'>) => void;
  updateBiometrics: (metrics: Partial<BiometricMetrics>) => void;
  addToFavorites: (galaxyType: string, name: string) => void;
  removeFromFavorites: (id: string) => void;
  getSessionHistory: (limit?: number) => Promise<VRGalaxySession[]>;
  exportData: () => Promise<Blob>;
  refreshStats: () => Promise<void>;
}

const STORAGE_KEY = 'vr_galaxy_data';
const GALAXY_TYPES = ['Nebula', 'Spiral', 'Elliptical', 'Irregular', 'Cosmic Void', 'Star Cluster'];

export const useVRGalaxyEnriched = (): UseVRGalaxyEnrichedReturn => {
  const [state, setState] = useState<VRGalaxyState>({
    isImmersed: false,
    galaxyType: 'Nebula',
    currentSession: null,
    discoveries: [],
    biometrics: {},
    favorites: [],
    stats: {
      totalExplorations: 0,
      galaxiesVisited: new Set(),
      totalDiscoveries: 0,
      averageCoherenceScore: 0,
      hrvImprovement: 0,
      unlockedAchievements: [],
    },
    isLoading: false,
    error: null,
  });

  const sessionStartTime = useRef<number | null>(null);
  const userId = useRef<string | null>(null);

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));

      try {
        // Récupérer l'utilisateur
        const { data: { user } } = await supabase.auth.getUser();
        userId.current = user?.id || null;

        // Charger depuis localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setState(prev => ({
            ...prev,
            favorites: parsed.favorites || [],
            stats: {
              ...prev.stats,
              ...parsed.stats,
              galaxiesVisited: new Set(parsed.stats?.galaxiesVisited || []),
            },
          }));
        }

        // Charger les stats depuis Supabase
        if (user?.id) {
          await refreshStatsFromDB(user.id);
        }
      } catch (error) {
        logger.error('VRGalaxy: Failed to load data', error as Error, 'VR');
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadData();
  }, []);

  // Sauvegarder les données locales
  const persistLocal = useCallback((data: Partial<VRGalaxyState>) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const updated = {
        ...current,
        favorites: data.favorites || current.favorites,
        stats: {
          ...current.stats,
          ...data.stats,
          galaxiesVisited: Array.from(data.stats?.galaxiesVisited || current.stats?.galaxiesVisited || []),
        },
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      logger.warn('VRGalaxy: Failed to persist local data', undefined, 'VR');
    }
  }, []);

  // Rafraîchir les stats depuis la DB
  const refreshStatsFromDB = async (uid: string) => {
    try {
      // Récupérer les sessions
      const { data: sessions } = await supabase
        .from('vr_nebula_sessions')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (sessions && sessions.length > 0) {
        const galaxiesVisited = new Set<string>();
        let totalCoherence = 0;
        let coherenceCount = 0;
        let totalHrvDelta = 0;

        sessions.forEach((s: Record<string, unknown>) => {
          if (s.galaxy_explored) galaxiesVisited.add(s.galaxy_explored as string);
          if (s.coherence_score) {
            totalCoherence += s.coherence_score as number;
            coherenceCount++;
          }
          if (s.rmssd_delta) totalHrvDelta += s.rmssd_delta as number;
        });

        setState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            totalExplorations: sessions.length,
            galaxiesVisited,
            totalDiscoveries: sessions.reduce((acc: number, s: Record<string, unknown>) => 
              acc + ((s.discoveries as unknown[])?.length || 0), 0),
            averageCoherenceScore: coherenceCount > 0 ? totalCoherence / coherenceCount : 0,
            hrvImprovement: totalHrvDelta / sessions.length,
          },
        }));
      }
    } catch (error) {
      logger.error('VRGalaxy: Failed to refresh stats', error as Error, 'VR');
    }
  };

  // Entrer dans une galaxie
  const enterGalaxy = useCallback(async (galaxyType?: string) => {
    const selectedGalaxy = galaxyType || GALAXY_TYPES[Math.floor(Math.random() * GALAXY_TYPES.length)];
    sessionStartTime.current = Date.now();

    const sessionId = `vr-galaxy-${Date.now()}`;
    const newSession: VRGalaxySession = {
      id: sessionId,
      user_id: userId.current || 'anonymous',
      session_id: sessionId,
      galaxy_explored: selectedGalaxy,
      planets_visited: [],
      discoveries: [],
      duration_seconds: 0,
      created_at: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      isImmersed: true,
      galaxyType: selectedGalaxy,
      currentSession: newSession,
      discoveries: [],
      biometrics: {},
      error: null,
    }));

    // Incrémenter le compteur de visites des favoris
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.map(f => 
        f.galaxyType === selectedGalaxy 
          ? { ...f, visitCount: f.visitCount + 1 }
          : f
      ),
    }));

    logger.info('VRGalaxy: Session started', { galaxyType: selectedGalaxy }, 'VR');
  }, []);

  // Sortir de la galaxie et sauvegarder la session
  const exitGalaxy = useCallback(async (): Promise<SessionReport | null> => {
    if (!state.currentSession || !sessionStartTime.current) {
      setState(prev => ({ ...prev, isImmersed: false }));
      return null;
    }

    const durationSeconds = Math.round((Date.now() - sessionStartTime.current) / 1000);
    
    // Calculer le rapport
    const report: SessionReport = {
      sessionId: state.currentSession.id,
      duration: durationSeconds,
      discoveries: state.discoveries,
      biometricProgress: {
        hrvImprovement: (state.biometrics.hrv_post || 0) - (state.biometrics.hrv_pre || 0),
        coherenceScore: state.currentSession.coherence_score || 0,
        stressReduction: ((state.biometrics.current_stress_level || 5) - 3) / 5 * 100,
      },
      explorationStats: {
        planetsVisited: state.currentSession.planets_visited?.length || 0,
        totalDiscoveries: state.discoveries.length,
        explorationDepth: Math.min(state.discoveries.length * 10, 100),
      },
      therapeuticImpact: {
        overallScore: Math.round((state.currentSession.coherence_score || 50) + state.discoveries.length * 5),
        emotionalBenefit: state.discoveries.length > 3 ? 'Excellent' : state.discoveries.length > 1 ? 'Bon' : 'Modéré',
        physicalBenefit: durationSeconds > 600 ? 'Relaxation profonde' : 'Détente légère',
      },
    };

    // Sauvegarder dans Supabase
    if (userId.current) {
      try {
        await supabase.from('vr_nebula_sessions').insert({
          user_id: userId.current,
          session_id: state.currentSession.id,
          galaxy_explored: state.galaxyType,
          planets_visited: state.currentSession.planets_visited,
          discoveries: state.discoveries,
          hrv_pre: state.biometrics.hrv_pre,
          hrv_post: state.biometrics.hrv_post,
          resp_rate_avg: state.biometrics.resp_rate_avg,
          coherence_score: state.currentSession.coherence_score,
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        });

        // Aussi sauvegarder dans user_activity_sessions pour la cohérence
        await supabase.from('user_activity_sessions').insert({
          user_id: userId.current,
          activity_type: 'vr_galaxy',
          duration_minutes: Math.round(durationSeconds / 60),
          notes: JSON.stringify({
            galaxy: state.galaxyType,
            discoveries: state.discoveries.length,
            coherence: state.currentSession.coherence_score,
          }),
        });
      } catch (error) {
        logger.error('VRGalaxy: Failed to save session', error as Error, 'VR');
      }
    }

    // Mettre à jour les stats locales
    setState(prev => {
      const newStats = {
        ...prev.stats,
        totalExplorations: prev.stats.totalExplorations + 1,
        galaxiesVisited: new Set([...prev.stats.galaxiesVisited, state.galaxyType]),
        totalDiscoveries: prev.stats.totalDiscoveries + state.discoveries.length,
      };

      persistLocal({ stats: newStats });

      return {
        ...prev,
        isImmersed: false,
        currentSession: null,
        discoveries: [],
        stats: newStats,
      };
    });

    sessionStartTime.current = null;
    logger.info('VRGalaxy: Session ended', { duration: durationSeconds, discoveries: state.discoveries.length }, 'VR');

    return report;
  }, [state.currentSession, state.discoveries, state.biometrics, state.galaxyType, persistLocal]);

  // Enregistrer une découverte
  const recordDiscovery = useCallback((discovery: Omit<Discovery, 'timestamp'>) => {
    const fullDiscovery: Discovery = {
      ...discovery,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      discoveries: [...prev.discoveries, fullDiscovery],
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        discoveries: [...(prev.currentSession.discoveries || []), fullDiscovery],
      } : null,
    }));

    logger.info('VRGalaxy: Discovery recorded', { type: discovery.type, name: discovery.name }, 'VR');
  }, []);

  // Mettre à jour les biométriques
  const updateBiometrics = useCallback((metrics: Partial<BiometricMetrics>) => {
    setState(prev => ({
      ...prev,
      biometrics: { ...prev.biometrics, ...metrics },
      currentSession: prev.currentSession ? {
        ...prev.currentSession,
        hrv_pre: metrics.hrv_pre ?? prev.currentSession.hrv_pre,
        hrv_post: metrics.hrv_post ?? prev.currentSession.hrv_post,
        resp_rate_avg: metrics.resp_rate_avg ?? prev.currentSession.resp_rate_avg,
      } : null,
    }));
  }, []);

  // Ajouter aux favoris
  const addToFavorites = useCallback((galaxyType: string, name: string) => {
    const newFavorite: GalaxyFavorite = {
      id: `fav-${Date.now()}`,
      galaxyType,
      name,
      addedAt: new Date().toISOString(),
      visitCount: 0,
    };

    setState(prev => {
      const updated = [...prev.favorites, newFavorite];
      persistLocal({ favorites: updated });
      return { ...prev, favorites: updated };
    });
  }, [persistLocal]);

  // Retirer des favoris
  const removeFromFavorites = useCallback((id: string) => {
    setState(prev => {
      const updated = prev.favorites.filter(f => f.id !== id);
      persistLocal({ favorites: updated });
      return { ...prev, favorites: updated };
    });
  }, [persistLocal]);

  // Récupérer l'historique des sessions
  const getSessionHistory = useCallback(async (limit = 50): Promise<VRGalaxySession[]> => {
    if (!userId.current) return [];

    try {
      const { data } = await supabase
        .from('vr_nebula_sessions')
        .select('*')
        .eq('user_id', userId.current)
        .order('created_at', { ascending: false })
        .limit(limit);

      return (data || []) as VRGalaxySession[];
    } catch (error) {
      logger.error('VRGalaxy: Failed to get history', error as Error, 'VR');
      return [];
    }
  }, []);

  // Exporter les données
  const exportData = useCallback(async (): Promise<Blob> => {
    const sessions = await getSessionHistory(1000);
    
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      userId: userId.current,
      statistics: {
        ...state.stats,
        galaxiesVisited: Array.from(state.stats.galaxiesVisited),
      },
      favorites: state.favorites,
      sessions,
    };

    return new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  }, [state.stats, state.favorites, getSessionHistory]);

  // Rafraîchir les stats
  const refreshStats = useCallback(async () => {
    if (userId.current) {
      await refreshStatsFromDB(userId.current);
    }
  }, []);

  return {
    ...state,
    enterGalaxy,
    exitGalaxy,
    recordDiscovery,
    updateBiometrics,
    addToFavorites,
    removeFromFavorites,
    getSessionHistory,
    exportData,
    refreshStats,
  };
};
