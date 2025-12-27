/**
 * useMusicGenerationEnriched - Pipeline Suno enrichi avec fallback robuste, historique, favoris
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  audioUrl: string;
  duration: number;
  emotion?: string;
  mood?: string;
  coverUrl?: string;
  tags?: string;
  generatedAt?: string;
  isFavorite?: boolean;
}

export interface GenerationHistoryItem {
  id: string;
  track: GeneratedTrack;
  emotion: string;
  mood?: string;
  intensity: number;
  generatedAt: string;
  status: 'success' | 'fallback' | 'error';
  source: 'suno' | 'fallback';
}

interface GenerationStats {
  totalGenerated: number;
  totalFavorites: number;
  successRate: number;
  averageIntensity: number;
  topEmotions: { emotion: string; count: number }[];
  weeklyTrend: number[];
}

const HISTORY_KEY = 'music-generation-history';
const FAVORITES_KEY = 'music-generation-favorites';
const STATS_KEY = 'music-generation-stats';

// Fallback tracks avec audio libre de droits (Pixabay)
const FALLBACK_TRACKS: GeneratedTrack[] = [
  {
    id: 'fallback-calm-1',
    title: 'Océan Tranquille',
    artist: 'EmotionsCare Music',
    url: 'https://cdn.pixabay.com/audio/2024/11/04/audio_87cdc7ccfe.mp3',
    audioUrl: 'https://cdn.pixabay.com/audio/2024/11/04/audio_87cdc7ccfe.mp3',
    duration: 180,
    emotion: 'calm',
    mood: 'relaxed',
    coverUrl: '/placeholder.svg',
    tags: 'calm,peaceful,ambient'
  },
  {
    id: 'fallback-happy-1',
    title: 'Sunrise Energy',
    artist: 'EmotionsCare Music',
    url: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946499bb90.mp3',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/10/25/audio_946499bb90.mp3',
    duration: 200,
    emotion: 'happy',
    mood: 'energetic',
    coverUrl: '/placeholder.svg',
    tags: 'happy,uplifting,energetic'
  },
  {
    id: 'fallback-focus-1',
    title: 'Deep Focus Flow',
    artist: 'EmotionsCare Music',
    url: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3',
    duration: 240,
    emotion: 'focused',
    mood: 'concentrated',
    coverUrl: '/placeholder.svg',
    tags: 'focus,concentration,ambient'
  },
  {
    id: 'fallback-sad-1',
    title: 'Healing Rain',
    artist: 'EmotionsCare Music',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    duration: 220,
    emotion: 'melancholic',
    mood: 'reflective',
    coverUrl: '/placeholder.svg',
    tags: 'healing,gentle,melancholic'
  }
];

export const useMusicGenerationEnriched = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  // Sauvegarder l'historique
  const saveToHistory = useCallback((item: GenerationHistoryItem) => {
    setHistory(prev => {
      const updated = [item, ...prev].slice(0, 50); // Garder les 50 derniers
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Obtenir un fallback approprié basé sur l'émotion
  const getFallbackTrack = useCallback((emotion: string): GeneratedTrack => {
    const emotionMap: Record<string, string> = {
      'calm': 'calm',
      'peaceful': 'calm',
      'relaxed': 'calm',
      'happy': 'happy',
      'joy': 'happy',
      'excited': 'happy',
      'focused': 'focused',
      'concentrated': 'focused',
      'sad': 'sad',
      'melancholic': 'sad',
      'anxious': 'calm',
      'stressed': 'calm'
    };

    const mappedEmotion = emotionMap[emotion.toLowerCase()] || 'calm';
    const fallback = FALLBACK_TRACKS.find(t => t.emotion === mappedEmotion) || FALLBACK_TRACKS[0];

    return {
      ...fallback,
      id: `${fallback.id}-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
  }, []);

  // Génération avec retry et fallback
  const generateMusic = useCallback(async (
    emotion: string,
    customPrompt?: string,
    mood?: string,
    intensity: number = 0.5,
    userContext?: string
  ): Promise<GeneratedTrack | null> => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentStep('Initialisation...');

    try {
      logger.info('🎵 Démarrage génération musicale enrichie', { emotion, mood, intensity }, 'MUSIC');

      // Étape 1: Générer le prompt IA (20%)
      setProgress(10);
      setCurrentStep('Génération du prompt IA...');

      let aiPrompt: any = null;
      try {
        const { data: promptData, error: promptError } = await supabase.functions.invoke('generate-suno-prompt', {
          body: { emotion, intensity: intensity * 100, userContext, mood }
        });

        if (!promptError && promptData?.success) {
          aiPrompt = promptData.prompt;
          logger.info('✅ Prompt IA généré:', aiPrompt, 'MUSIC');
        }
      } catch (promptErr) {
        logger.warn('⚠️ Échec génération prompt, utilisation fallback', {}, 'MUSIC');
      }

      setProgress(30);
      setCurrentStep('Connexion au service musical...');

      // Étape 2: Tentative Suno (60%)
      let track: GeneratedTrack | null = null;
      let usedFallback = false;

      try {
        const sunoBody = aiPrompt ? {
          emotion,
          mood,
          intensity,
          style: aiPrompt.style,
          lyrics: aiPrompt.prompt_lyrics,
          customMode: true,
          instrumental: false,
          bpm: aiPrompt.bpm,
          tags: aiPrompt.mood_tags
        } : {
          emotion,
          mood,
          intensity,
          customMode: false,
          instrumental: true
        };

        setProgress(50);
        setCurrentStep('Génération musicale en cours...');

        const { data, error: functionError } = await supabase.functions.invoke('suno-music-generation', {
          body: sunoBody
        });

        if (functionError) {
          throw new Error(functionError.message || 'Erreur Suno');
        }

        if (data && data.audioUrl) {
          track = {
            ...data,
            generatedAt: new Date().toISOString()
          } as GeneratedTrack;
          logger.info('✅ Track Suno générée', { id: track.id }, 'MUSIC');
        } else {
          throw new Error('Aucune donnée audio reçue');
        }
      } catch (sunoError) {
        logger.warn('⚠️ Suno indisponible, utilisation fallback', { error: sunoError }, 'MUSIC');
        usedFallback = true;
        track = getFallbackTrack(emotion);
        toast.info('Musique de bibliothèque utilisée (service premium temporairement indisponible)');
      }

      setProgress(80);
      setCurrentStep('Finalisation...');

      if (track) {
        // Sauvegarder dans l'historique
        const historyItem: GenerationHistoryItem = {
          id: `gen-${Date.now()}`,
          track,
          emotion,
          mood,
          intensity,
          generatedAt: new Date().toISOString(),
          status: usedFallback ? 'fallback' : 'success',
          source: usedFallback ? 'fallback' : 'suno'
        };
        saveToHistory(historyItem);

        // Mettre à jour les stats
        updateStats(historyItem);
      }

      setProgress(100);
      setCurrentStep('Terminé !');

      return track;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      logger.error('❌ Erreur génération musique', { errorMessage }, 'MUSIC');
      setError(errorMessage);

      // En dernier recours, retourner un fallback
      const fallbackTrack = getFallbackTrack(emotion);
      saveToHistory({
        id: `gen-error-${Date.now()}`,
        track: fallbackTrack,
        emotion,
        mood,
        intensity,
        generatedAt: new Date().toISOString(),
        status: 'error',
        source: 'fallback'
      });

      toast.warning('Musique de remplacement fournie suite à une erreur');
      return fallbackTrack;
    } finally {
      setIsGenerating(false);
      setTimeout(() => {
        setProgress(0);
        setCurrentStep('');
      }, 2000);
    }
  }, [getFallbackTrack, saveToHistory]);

  // Gestion des favoris
  const toggleFavorite = useCallback((trackId: string): boolean => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    const favorites: string[] = stored ? JSON.parse(stored) : [];

    const index = favorites.indexOf(trackId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(trackId);
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    return index === -1;
  }, []);

  const getFavorites = useCallback((): string[] => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  }, []);

  const getFavoritesTracks = useCallback((): GeneratedTrack[] => {
    const favoriteIds = getFavorites();
    return history
      .filter(h => favoriteIds.includes(h.track.id))
      .map(h => ({ ...h.track, isFavorite: true }));
  }, [history, getFavorites]);

  // Mise à jour des statistiques
  const updateStats = useCallback((item: GenerationHistoryItem) => {
    const stored = localStorage.getItem(STATS_KEY);
    const stats: GenerationStats = stored ? JSON.parse(stored) : {
      totalGenerated: 0,
      totalFavorites: 0,
      successRate: 100,
      averageIntensity: 0.5,
      topEmotions: [],
      weeklyTrend: [0, 0, 0, 0, 0, 0, 0]
    };

    stats.totalGenerated++;
    stats.averageIntensity = (stats.averageIntensity * (stats.totalGenerated - 1) + item.intensity) / stats.totalGenerated;
    
    // Mettre à jour success rate
    const successCount = item.status === 'success' ? 1 : 0;
    stats.successRate = ((stats.successRate * (stats.totalGenerated - 1) + successCount * 100) / stats.totalGenerated);

    // Mettre à jour top emotions
    const emotionEntry = stats.topEmotions.find(e => e.emotion === item.emotion);
    if (emotionEntry) {
      emotionEntry.count++;
    } else {
      stats.topEmotions.push({ emotion: item.emotion, count: 1 });
    }
    stats.topEmotions.sort((a, b) => b.count - a.count);
    stats.topEmotions = stats.topEmotions.slice(0, 5);

    // Mettre à jour weekly trend
    const dayOfWeek = new Date().getDay();
    stats.weeklyTrend[dayOfWeek]++;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, []);

  const getStats = useCallback((): GenerationStats => {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) return JSON.parse(stored);
    return {
      totalGenerated: 0,
      totalFavorites: getFavorites().length,
      successRate: 100,
      averageIntensity: 0.5,
      topEmotions: [],
      weeklyTrend: [0, 0, 0, 0, 0, 0, 0]
    };
  }, [getFavorites]);

  // Export de l'historique
  const exportHistory = useCallback((format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const headers = 'ID,Track Title,Emotion,Mood,Intensity,Status,Source,Generated At\n';
      const rows = history.map(h =>
        `${h.id},${h.track.title},${h.emotion},${h.mood || ''},${h.intensity},${h.status},${h.source},${h.generatedAt}`
      ).join('\n');
      return headers + rows;
    }
    return JSON.stringify(history, null, 2);
  }, [history]);

  // Effacer l'historique
  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
    toast.success('Historique effacé');
  }, []);

  // Régénérer depuis l'historique
  const regenerateFromHistory = useCallback(async (historyItem: GenerationHistoryItem): Promise<GeneratedTrack | null> => {
    return generateMusic(
      historyItem.emotion,
      undefined,
      historyItem.mood,
      historyItem.intensity
    );
  }, [generateMusic]);

  return {
    // Core
    generateMusic,
    isGenerating,
    error,
    progress,
    currentStep,
    
    // History
    history,
    clearHistory,
    regenerateFromHistory,
    exportHistory,
    
    // Favorites
    toggleFavorite,
    getFavorites,
    getFavoritesTracks,
    
    // Stats
    getStats,
    
    // Fallback info
    fallbackTracks: FALLBACK_TRACKS
  };
};

export default useMusicGenerationEnriched;
