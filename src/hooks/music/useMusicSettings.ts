/**
 * useMusicSettings - Hook centralisé pour la persistance des paramètres music
 * Sync automatique avec Supabase user_settings, fallback localStorage offline
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';

type SettingKey =
  | 'music:player-data'
  | 'music:volume-settings'
  | 'music:volume-presets'
  | 'music:playback-stats'
  | 'music:player-favorites'
  | 'music:quota-data'
  | 'music:generation-history'
  | 'music:generation-favorites'
  | 'music:generation-stats'
  | 'music:accessibility-prefs'
  | 'music:shortcuts-seen'
  | 'music:history'
  | 'music:lastPlayed'
  | 'music:cachedTracks'
  | 'music:queue'
  | 'music:favorites'
  | 'music:player-stats'
  | 'music:track-ratings'
  | 'music:track-play-counts'
  | 'music:saved-positions'
  | 'music:emotion-generator'
  | 'music:progressbar-markers'
  | 'music:adaptive-playback'
  | 'music:integrations'
  | 'music:email';

interface UseMusicSettingsOptions<T> {
  key: SettingKey;
  defaultValue: T;
  debounceMs?: number;
}

export function useMusicSettings<T>({ 
  key, 
  defaultValue, 
  debounceMs = 500 
}: UseMusicSettingsOptions<T>) {
  const { user } = useAuth();
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  // Charger depuis Supabase ou localStorage
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // Charger depuis Supabase
          const { data, error } = await supabase
            .from('user_settings')
            .select('value')
            .eq('user_id', user.id)
            .eq('key', key)
            .maybeSingle();

          if (!error && data?.value) {
            try {
              const parsed = typeof data.value === 'string' 
                ? JSON.parse(data.value) 
                : data.value;
              setValue(parsed as T);
              lastSavedRef.current = JSON.stringify(parsed);
              setIsSynced(true);
              
              // Supprimer du localStorage après migration
              localStorage.removeItem(key);
            } catch (parseError) {
              logger.warn(`[useMusicSettings] JSON parse failed for ${key}, using default`, { value: data.value }, 'MUSIC');
              // Use default value if parse fails
              setValue(defaultValue);
            }
          } else {
            // Migration: charger depuis localStorage si existe
            const localData = localStorage.getItem(key);
            if (localData) {
              try {
                const parsed = JSON.parse(localData);
                setValue(parsed as T);
                // Sauvegarder immédiatement dans Supabase
                await saveToSupabase(parsed);
                localStorage.removeItem(key);
              } catch {
                // Invalid JSON in localStorage, remove it
                localStorage.removeItem(key);
              }
            }
          }
        } else {
          // Mode non-connecté: utiliser localStorage
          const localData = localStorage.getItem(key);
          if (localData) {
            setValue(JSON.parse(localData) as T);
          }
        }
      } catch (error) {
        logger.warn(`[useMusicSettings] Failed to load ${key}`, {}, 'MUSIC');
        // Fallback localStorage
        const localData = localStorage.getItem(key);
        if (localData) {
          try {
            setValue(JSON.parse(localData) as T);
          } catch {
            localStorage.removeItem(key);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [user, key]);

  // Sauvegarder dans Supabase
  const saveToSupabase = useCallback(async (data: T) => {
    if (!user) return false;

    const jsonValue = JSON.stringify(data);
    if (jsonValue === lastSavedRef.current) return true;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          key,
          value: jsonValue,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,key'
        });

      if (!error) {
        lastSavedRef.current = jsonValue;
        setIsSynced(true);
        return true;
      }
      throw error;
    } catch (error) {
      logger.error(`[useMusicSettings] Save failed for ${key}`, error as Error, 'MUSIC');
      // Fallback: sauvegarder en localStorage
      localStorage.setItem(key, jsonValue);
      setIsSynced(false);
      return false;
    }
  }, [user, key]);

  // Mettre à jour la valeur avec debounce
  const updateValue = useCallback((newValue: T | ((prev: T) => T)) => {
    setValue(prev => {
      const updated = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(prev) 
        : newValue;

      // Clear timeout précédent
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Sauvegarder avec debounce
      saveTimeoutRef.current = setTimeout(() => {
        if (user) {
          saveToSupabase(updated);
        } else {
          localStorage.setItem(key, JSON.stringify(updated));
        }
      }, debounceMs);

      return updated;
    });
  }, [user, key, debounceMs, saveToSupabase]);

  // Forcer la sauvegarde immédiate
  const saveNow = useCallback(async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    if (user) {
      return await saveToSupabase(value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
  }, [user, key, value, saveToSupabase]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    value,
    setValue: updateValue,
    isLoading,
    isSynced,
    saveNow
  };
}

// Hook spécialisé pour le player Suno
export function useSunoPlayerSettings() {
  return useMusicSettings({
    key: 'music:player-data',
    defaultValue: {
      queue: [] as any[],
      history: [] as any[],
      favorites: [] as any[],
      volume: 0.7,
      isRepeat: false,
      isShuffle: false
    }
  });
}

// Hook spécialisé pour les presets de volume
export function useVolumeSettings() {
  return useMusicSettings({
    key: 'music:volume-settings',
    defaultValue: { previousVolume: 0.7 }
  });
}

export function useVolumePresets() {
  return useMusicSettings({
    key: 'music:volume-presets',
    defaultValue: [
      { name: 'Silence', value: 0, icon: '🔇' },
      { name: 'Murmure', value: 0.2, icon: '🤫' },
      { name: 'Ambiance', value: 0.4, icon: '🎵' },
      { name: 'Normal', value: 0.6, icon: '🔊' },
      { name: 'Fort', value: 0.8, icon: '📢' },
      { name: 'Maximum', value: 1, icon: '🔥' }
    ] as { name: string; value: number; icon?: string }[]
  });
}

// Hook pour les stats de lecture
export function usePlaybackStats() {
  return useMusicSettings({
    key: 'music:playback-stats',
    defaultValue: { totalPlays: 0, totalTime: 0, favoriteGenre: '' }
  });
}

// Hook pour l'historique de génération
export function useGenerationHistory() {
  return useMusicSettings({
    key: 'music:generation-history',
    defaultValue: [] as any[],
    debounceMs: 1000
  });
}

// Hook pour les stats de génération
export function useGenerationStats() {
  return useMusicSettings({
    key: 'music:generation-stats',
    defaultValue: {
      totalGenerated: 0,
      totalFavorites: 0,
      successRate: 100,
      averageIntensity: 0.5,
      topEmotions: [] as { emotion: string; count: number }[],
      weeklyTrend: [0, 0, 0, 0, 0, 0, 0]
    }
  });
}

// Hook pour les préférences d'accessibilité music
export function useMusicAccessibilitySettings() {
  return useMusicSettings({
    key: 'music:accessibility-prefs',
    defaultValue: {
      reduceMotion: false,
      highContrast: false,
      largeControls: false,
      screenReaderOptimized: false,
      hapticFeedback: true,
      autoplayPrevention: false,
      volumeLimit: 1,
      keyboardShortcuts: true
    }
  });
}

// Hook pour quota indicator
export function useQuotaIndicatorData() {
  return useMusicSettings({
    key: 'music:quota-data',
    defaultValue: {
      history: [] as any[],
      notifications: { enabled: true, threshold: 20 }
    }
  });
}

// Hook pour l'historique de lecture
export function useMusicHistory() {
  return useMusicSettings<string[]>({
    key: 'music:history',
    defaultValue: []
  });
}

// Hook pour le dernier morceau joué
export function useLastPlayedTrack() {
  return useMusicSettings<string | null>({
    key: 'music:lastPlayed',
    defaultValue: null,
    debounceMs: 100
  });
}

// Hook pour les tracks en cache offline
export function useCachedTracks() {
  return useMusicSettings<any[]>({
    key: 'music:cachedTracks',
    defaultValue: [],
    debounceMs: 1000
  });
}

// Hook pour la queue du player
export function useMusicQueue() {
  return useMusicSettings<any[]>({
    key: 'music:queue',
    defaultValue: []
  });
}

// Hook pour les favoris du player
export function useMusicPlayerFavorites() {
  return useMusicSettings<any[]>({
    key: 'music:favorites',
    defaultValue: []
  });
}

// Hook pour les stats du player
export function useMusicPlayerStats() {
  return useMusicSettings({
    key: 'music:player-stats',
    defaultValue: {
      totalPlayTime: 0,
      tracksPlayed: 0,
      favoriteGenre: 'Ambient',
      lastSession: new Date().toISOString()
    }
  });
}

// Hook pour les notes des tracks
export function useTrackRatings() {
  return useMusicSettings<Record<string, number>>({
    key: 'music:track-ratings',
    defaultValue: {}
  });
}

// Hook pour les compteurs de lecture
export function useTrackPlayCounts() {
  return useMusicSettings<Record<string, number>>({
    key: 'music:track-play-counts',
    defaultValue: {}
  });
}

// Hook pour savoir si les raccourcis ont été vus
export function useShortcutsSeen() {
  return useMusicSettings<boolean>({
    key: 'music:shortcuts-seen',
    defaultValue: false
  });
}

// Interface pour les statistiques d'écoute
export interface MusicListeningStats {
  totalListeningTime: number; // minutes
  tracksPlayed: number;
  favoriteGenre: string;
  currentStreak: number;
  longestStreak: number;
  topMoods: string[];
  weeklyGoalProgress: number;
  averageSessionDuration: number;
}

// Hook pour les statistiques d'écoute détaillées
export function useMusicListeningStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<MusicListeningStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats(null);
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        // Try to fetch from music_listening_sessions table
        const { data: sessions, error } = await supabase
          .from('music_listening_sessions')
          .select('duration_seconds, mood, genre, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && sessions && sessions.length > 0) {
          const totalSeconds = sessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0);
          
          // Calculate mood frequency
          const moodCounts: Record<string, number> = {};
          sessions.forEach((s: any) => {
            if (s.mood) {
              moodCounts[s.mood] = (moodCounts[s.mood] || 0) + 1;
            }
          });
          const topMoods = Object.entries(moodCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([mood]) => mood);

          // Calculate genre frequency
          const genreCounts: Record<string, number> = {};
          sessions.forEach((s: any) => {
            if (s.genre) {
              genreCounts[s.genre] = (genreCounts[s.genre] || 0) + 1;
            }
          });
          const favoriteGenre = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Ambient';

          // Calculate streak
          const today = new Date().toDateString();
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const sessionDates = sessions.map((s: any) => new Date(s.created_at).toDateString());
          const hasToday = sessionDates.includes(today);
          const hasYesterday = sessionDates.includes(yesterday);
          
          let currentStreak = hasToday ? 1 : 0;
          if (hasToday && hasYesterday) {
            currentStreak = 2;
          }

          setStats({
            totalListeningTime: Math.floor(totalSeconds / 60),
            tracksPlayed: sessions.length,
            favoriteGenre,
            currentStreak,
            longestStreak: Math.max(currentStreak, 7),
            topMoods: topMoods.length > 0 ? topMoods : ['Calme', 'Focus'],
            weeklyGoalProgress: Math.min(100, Math.floor((sessions.length / 21) * 100)),
            averageSessionDuration: sessions.length > 0 ? Math.floor(totalSeconds / sessions.length / 60) : 0,
          });
        } else {
          // Default stats for new users
          setStats({
            totalListeningTime: 0,
            tracksPlayed: 0,
            favoriteGenre: 'Ambient',
            currentStreak: 0,
            longestStreak: 0,
            topMoods: [],
            weeklyGoalProgress: 0,
            averageSessionDuration: 0,
          });
        }
      } catch (error) {
        logger.warn('[useMusicListeningStats] Failed to fetch stats', {}, 'MUSIC');
        setStats(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, isLoading };
}

export default useMusicSettings;
