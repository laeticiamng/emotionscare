/**
 * Feature: AR Filters
 * Filtres de réalité augmentée pour l'expression émotionnelle
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================================
// TYPES
// ============================================================================

export type FilterType = 
  | 'mood-aura'      // Aura émotionnelle autour du visage
  | 'emotion-mask'   // Masque expressif
  | 'zen-particles'  // Particules de méditation
  | 'nature-overlay' // Superposition d'éléments naturels
  | 'dream-filter'   // Effet onirique
  | 'energy-flow';   // Flux d'énergie

export type MoodImpact = 'positive' | 'neutral' | 'negative';

export interface ARFilter {
  id: string;
  type: FilterType;
  name: string;
  description: string;
  thumbnailUrl: string;
  isPremium: boolean;
  moodTags: string[];
  intensity: number; // 0-100
}

export interface ARFilterSession {
  id: string;
  userId: string;
  filterType: FilterType;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds: number;
  photosTaken: number;
  moodImpact?: MoodImpact;
}

export interface ARFilterStats {
  totalSessions: number;
  totalMinutes: number;
  photosTaken: number;
  favoriteFilter: FilterType | null;
  moodImprovementRate: number; // %
}

// ============================================================================
// AVAILABLE FILTERS
// ============================================================================

export const AVAILABLE_FILTERS: ARFilter[] = [
  {
    id: 'aura-calm',
    type: 'mood-aura',
    name: 'Aura Sérénité',
    description: 'Un halo bleu apaisant qui reflète votre calme intérieur',
    thumbnailUrl: '/filters/aura-calm.png',
    isPremium: false,
    moodTags: ['calme', 'relaxation', 'paix'],
    intensity: 70,
  },
  {
    id: 'aura-joy',
    type: 'mood-aura',
    name: 'Aura Joie',
    description: 'Un rayonnement doré qui célèbre votre bonheur',
    thumbnailUrl: '/filters/aura-joy.png',
    isPremium: false,
    moodTags: ['joie', 'bonheur', 'énergie'],
    intensity: 80,
  },
  {
    id: 'zen-lotus',
    type: 'zen-particles',
    name: 'Lotus Zen',
    description: 'Pétales de lotus flottant autour de vous',
    thumbnailUrl: '/filters/zen-lotus.png',
    isPremium: false,
    moodTags: ['méditation', 'mindfulness', 'zen'],
    intensity: 60,
  },
  {
    id: 'nature-forest',
    type: 'nature-overlay',
    name: 'Forêt Enchantée',
    description: 'Éléments de nature et lumière forestière',
    thumbnailUrl: '/filters/nature-forest.png',
    isPremium: true,
    moodTags: ['nature', 'ressourcement', 'ancrage'],
    intensity: 75,
  },
  {
    id: 'dream-clouds',
    type: 'dream-filter',
    name: 'Nuages de Rêve',
    description: 'Un effet onirique doux et apaisant',
    thumbnailUrl: '/filters/dream-clouds.png',
    isPremium: true,
    moodTags: ['rêve', 'douceur', 'imagination'],
    intensity: 65,
  },
  {
    id: 'energy-chakra',
    type: 'energy-flow',
    name: 'Flux Chakra',
    description: 'Visualisez votre énergie vitale',
    thumbnailUrl: '/filters/energy-chakra.png',
    isPremium: true,
    moodTags: ['énergie', 'vitalité', 'équilibre'],
    intensity: 85,
  },
];

// ============================================================================
// SERVICE
// ============================================================================

export const arFiltersService = {
  /**
   * Récupérer les filtres disponibles
   */
  getAvailableFilters(incluePremium = false): ARFilter[] {
    return AVAILABLE_FILTERS.filter(f => incluePremium || !f.isPremium);
  },

  /**
   * Démarrer une session AR
   */
  async startSession(userId: string, filterType: FilterType): Promise<ARFilterSession> {
    const session: ARFilterSession = {
      id: crypto.randomUUID(),
      userId,
      filterType,
      startedAt: new Date(),
      durationSeconds: 0,
      photosTaken: 0,
    };

    // Enregistrer en base
    const { error } = await supabase.from('ar_filter_sessions').insert({
      id: session.id,
      user_id: userId,
      filter_type: filterType,
      created_at: session.startedAt.toISOString(),
    });

    if (error) {
      console.error('[AR Filters] Failed to start session:', error);
    }

    return session;
  },

  /**
   * Terminer une session AR
   */
  async endSession(
    sessionId: string,
    durationSeconds: number,
    photosTaken: number,
    moodImpact?: MoodImpact
  ): Promise<void> {
    const { error } = await supabase
      .from('ar_filter_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_seconds: durationSeconds,
        photos_taken: photosTaken,
        mood_impact: moodImpact,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('[AR Filters] Failed to end session:', error);
    }
  },

  /**
   * Récupérer les stats utilisateur
   */
  async getUserStats(userId: string): Promise<ARFilterStats> {
    const { data, error } = await supabase
      .from('ar_filter_sessions')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) {
      return {
        totalSessions: 0,
        totalMinutes: 0,
        photosTaken: 0,
        favoriteFilter: null,
        moodImprovementRate: 0,
      };
    }

    const totalMinutes = Math.round(
      data.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60
    );

    const photosTaken = data.reduce((acc, s) => acc + (s.photos_taken || 0), 0);

    // Trouver le filtre préféré
    const filterCounts: Record<string, number> = {};
    data.forEach(s => {
      filterCounts[s.filter_type] = (filterCounts[s.filter_type] || 0) + 1;
    });
    const favoriteFilter = Object.entries(filterCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as FilterType | undefined;

    // Calculer le taux d'amélioration
    const positiveImpacts = data.filter(s => s.mood_impact === 'positive').length;
    const withImpact = data.filter(s => s.mood_impact).length;
    const moodImprovementRate = withImpact > 0 ? Math.round((positiveImpacts / withImpact) * 100) : 0;

    return {
      totalSessions: data.length,
      totalMinutes,
      photosTaken,
      favoriteFilter: favoriteFilter || null,
      moodImprovementRate,
    };
  },
};

// ============================================================================
// HOOKS
// ============================================================================

export function useARFilters() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<ARFilter | null>(null);
  const [session, setSession] = useState<ARFilterSession | null>(null);
  const [stats, setStats] = useState<ARFilterStats | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [photoCount, setPhotoCount] = useState(0);
  const startTimeRef = useRef<number>(0);

  const loadStats = useCallback(async () => {
    if (!user) return;
    const userStats = await arFiltersService.getUserStats(user.id);
    setStats(userStats);
  }, [user]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const startSession = useCallback(async (filter: ARFilter) => {
    if (!user) return;

    const newSession = await arFiltersService.startSession(user.id, filter.type);
    setSession(newSession);
    setActiveFilter(filter);
    setIsActive(true);
    setPhotoCount(0);
    startTimeRef.current = Date.now();
  }, [user]);

  const takePhoto = useCallback(() => {
    setPhotoCount(prev => prev + 1);
    // Ici on pourrait déclencher la capture via l'API caméra
  }, []);

  const endSession = useCallback(async (moodImpact?: MoodImpact) => {
    if (!session) return;

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    await arFiltersService.endSession(session.id, durationSeconds, photoCount, moodImpact);

    setSession(null);
    setActiveFilter(null);
    setIsActive(false);
    setPhotoCount(0);

    // Recharger les stats
    await loadStats();
  }, [session, photoCount, loadStats]);

  return {
    // State
    activeFilter,
    session,
    stats,
    isActive,
    photoCount,

    // Données
    availableFilters: arFiltersService.getAvailableFilters(),
    allFilters: AVAILABLE_FILTERS,

    // Actions
    startSession,
    endSession,
    takePhoto,
    loadStats,
  };
}

// ============================================================================
// COMPONENTS EXPORTS
// ============================================================================

export { ARFiltersView } from './components/ARFiltersView';
export { FilterCard } from './components/FilterCard';
export { FilterPreview } from './components/FilterPreview';
export { ARFilterCard } from './components/ARFilterCard';
export { ARCameraPreview } from './components/ARCameraPreview';
