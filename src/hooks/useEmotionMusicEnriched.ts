// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sunoRateLimiter } from '@/services/rate-limit';
import { sanitizeEmotionData } from '@/services/privacy';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface EmotionState {
  valence: number;
  arousal: number;
  dominantEmotion?: string;
  labels?: string[];
}

interface GenerationResult {
  taskId: string;
  emotionBadge: string;
  estimatedDuration: number;
}

interface GeneratedTrack {
  id: string;
  taskId: string;
  emotionBadge: string;
  emotionState: EmotionState;
  createdAt: string;
  duration?: number;
  url?: string;
  title?: string;
  isFavorite: boolean;
  playCount: number;
  rating?: number;
}

interface ListeningStats {
  totalGenerations: number;
  totalListeningTime: number;
  favoriteEmotions: string[];
  averageRating: number;
  generationsByWeek: Record<string, number>;
}

const STORAGE_KEY = 'emotionscare_emotion_music';
const FAVORITES_KEY = 'emotionscare_emotion_music_favorites';

export const useEmotionMusicEnriched = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [emotionBadge, setEmotionBadge] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedTrack[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stats, setStats] = useState<ListeningStats | null>(null);

  // Charger l'historique et les favoris
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (err) {
      logger.error('Erreur chargement historique musique', err as Error, 'MUSIC');
    }
  }, []);

  // Calculer les statistiques
  const calculateStats = useCallback((): ListeningStats => {
    const totalGenerations = history.length;
    const totalListeningTime = history.reduce((sum, t) => sum + (t.duration || 0) * t.playCount, 0);

    const emotionCount = new Map<string, number>();
    history.forEach(t => {
      if (t.emotionBadge) {
        emotionCount.set(t.emotionBadge, (emotionCount.get(t.emotionBadge) || 0) + 1);
      }
    });

    const favoriteEmotions = Array.from(emotionCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([emotion]) => emotion);

    const ratings = history.filter(t => t.rating).map(t => t.rating!);
    const averageRating = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;

    const generationsByWeek: Record<string, number> = {};
    history.forEach(t => {
      const week = new Date(t.createdAt).toISOString().split('T')[0].slice(0, 7);
      generationsByWeek[week] = (generationsByWeek[week] || 0) + 1;
    });

    return {
      totalGenerations,
      totalListeningTime: Math.round(totalListeningTime / 60),
      favoriteEmotions,
      averageRating: Math.round(averageRating * 10) / 10,
      generationsByWeek
    };
  }, [history]);

  useEffect(() => {
    setStats(calculateStats());
  }, [history, calculateStats]);

  // Sauvegarder l'historique
  const saveHistory = useCallback((newHistory: GeneratedTrack[]) => {
    const trimmed = newHistory.slice(-200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setHistory(trimmed);
  }, []);

  const generateFromEmotion = useCallback(async (
    emotionState: EmotionState,
    userContext?: any
  ): Promise<GenerationResult | null> => {
    setIsGenerating(true);
    setError(null);

    try {
      const rateLimitStatus = sunoRateLimiter.getStatus();
      if (rateLimitStatus.remaining === 0) {
        toast.warning('Limite de génération atteinte. Veuillez patienter quelques secondes...');
        await sunoRateLimiter.acquire();
      }

      logger.info('Génération musicale émotionnelle', { emotionState }, 'MUSIC');

      const cleanedEmotion = sanitizeEmotionData(emotionState);
      await sunoRateLimiter.acquire();

      toast.info('Analyse de votre état émotionnel...');

      const { data, error: functionError } = await supabase.functions.invoke(
        'emotion-music-generate',
        {
          body: {
            emotionState: cleanedEmotion,
            userContext: userContext || {}
          }
        }
      );

      if (functionError) {
        logger.error('Edge Function error', functionError as Error, 'MUSIC');
        throw new Error(functionError.message || 'Erreur lors de la génération');
      }

      if (!data?.taskId) {
        throw new Error('Aucun taskId reçu');
      }

      const { taskId, emotionBadge: badge, estimatedDuration } = data;
      setCurrentTask(taskId);
      setEmotionBadge(badge);

      // Ajouter à l'historique
      const newTrack: GeneratedTrack = {
        id: Date.now().toString(),
        taskId,
        emotionBadge: badge,
        emotionState,
        createdAt: new Date().toISOString(),
        duration: estimatedDuration || 120,
        isFavorite: false,
        playCount: 0
      };

      saveHistory([...history, newTrack]);

      logger.info('Génération lancée', { taskId, emotionBadge: badge }, 'MUSIC');
      toast.success('Votre musique est en cours de création !');

      return {
        taskId,
        emotionBadge: badge,
        estimatedDuration: estimatedDuration || 120
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération';
      logger.error('Erreur génération musique émotionnelle', err as Error, 'MUSIC');
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [history, saveHistory]);

  // Ajouter/retirer des favoris
  const toggleFavorite = useCallback((trackId: string) => {
    const isFav = favorites.includes(trackId);
    const newFavorites = isFav
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];

    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    // Mettre à jour l'historique
    const updatedHistory = history.map(t =>
      t.id === trackId ? { ...t, isFavorite: !isFav } : t
    );
    saveHistory(updatedHistory);

    toast.success(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris');
  }, [favorites, history, saveHistory]);

  // Incrémenter le compteur de lecture
  const incrementPlayCount = useCallback((trackId: string) => {
    const updatedHistory = history.map(t =>
      t.id === trackId ? { ...t, playCount: t.playCount + 1 } : t
    );
    saveHistory(updatedHistory);
  }, [history, saveHistory]);

  // Noter une piste
  const rateTrack = useCallback((trackId: string, rating: number) => {
    const updatedHistory = history.map(t =>
      t.id === trackId ? { ...t, rating } : t
    );
    saveHistory(updatedHistory);
    toast.success(`Note: ${rating}/5`);
  }, [history, saveHistory]);

  // Obtenir les pistes favorites
  const getFavoriteTracks = useCallback(() => {
    return history.filter(t => favorites.includes(t.id));
  }, [history, favorites]);

  // Obtenir les pistes par émotion
  const getTracksByEmotion = useCallback((emotion: string) => {
    return history.filter(t => t.emotionBadge === emotion);
  }, [history]);

  // Exporter l'historique
  const exportHistory = useCallback((format: 'json' | 'csv' = 'json'): string => {
    if (format === 'csv') {
      const headers = 'ID,TaskID,EmotionBadge,CreatedAt,Duration,PlayCount,Rating,IsFavorite\n';
      const rows = history.map(t =>
        `${t.id},${t.taskId},"${t.emotionBadge}",${t.createdAt},${t.duration || ''},${t.playCount},${t.rating || ''},${t.isFavorite}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify({
      history,
      favorites,
      stats: calculateStats(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  }, [history, favorites, calculateStats]);

  // Télécharger l'historique
  const downloadHistory = useCallback((format: 'json' | 'csv' = 'json') => {
    const content = exportHistory(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-music-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportHistory]);

  // Partager une piste
  const shareTrack = useCallback(async (trackId: string) => {
    const track = history.find(t => t.id === trackId);
    if (!track) return null;

    const shareData = {
      title: `Musique ${track.emotionBadge} - EmotionsCare`,
      text: `Découvrez cette musique générée pour l'émotion "${track.emotionBadge}"`,
      url: `${window.location.origin}/app/music/share/${track.taskId}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Partagé avec succès');
        return true;
      } catch {
        // L'utilisateur a annulé
      }
    }

    // Fallback: copier le lien
    await navigator.clipboard.writeText(shareData.url);
    toast.success('Lien copié dans le presse-papiers');
    return true;
  }, [history]);

  // Créer une playlist émotionnelle
  const createEmotionalPlaylist = useCallback((emotions: string[]) => {
    return history.filter(t => emotions.includes(t.emotionBadge));
  }, [history]);

  const reset = useCallback(() => {
    setCurrentTask(null);
    setEmotionBadge('');
    setError(null);
  }, []);

  return {
    generateFromEmotion,
    isGenerating,
    currentTask,
    emotionBadge,
    error,
    reset,
    rateLimitStatus: sunoRateLimiter.getStatus(),
    // Enriched features
    history,
    favorites,
    stats,
    toggleFavorite,
    incrementPlayCount,
    rateTrack,
    getFavoriteTracks,
    getTracksByEmotion,
    exportHistory,
    downloadHistory,
    shareTrack,
    createEmotionalPlaylist
  };
};

export default useEmotionMusicEnriched;
