/**
 * Hook for music therapy sessions
 * Types imported from @/services/types for full type safety
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { musicTherapyService } from '@/services';
import type { ApiResponse, EmotionData, MusicRecommendation } from '@/services/types';
import { logger } from '@/lib/logger';

interface MusicTherapyHook {
  // État de session
  activeSessionId: string | null;
  sessionProgress: any;
  isSessionActive: boolean;
  
  // État de lecture
  currentTrack: MusicRecommendation | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  
  // Playlists et recommandations
  playlist: MusicRecommendation[];
  recommendations: any[];
  
  // États généraux
  isLoading: boolean;
  error: string | null;
  
  // Gestion des sessions
  startTherapySession: (
    userId: string,
    options: any
  ) => Promise<ApiResponse>;
  updateSessionWithEmotions: (emotions: EmotionData[]) => Promise<ApiResponse>;
  endTherapySession: (feedback?: any) => Promise<ApiResponse>;
  
  // Contrôles de lecture
  play: () => Promise<void>;
  pause: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  
  // Playlists
  getPersonalizedPlaylist: (userId: string, context: any) => Promise<ApiResponse>;
  
  // Utilitaires
  reset: () => void;
}

export const useMusicTherapy = (): MusicTherapyHook => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sessionProgress, setSessionProgress] = useState<any>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicRecommendation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlist, setPlaylist] = useState<MusicRecommendation[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null);

  // Initialiser l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      nextTrack();
    };

    const handleError = (e: any) => {
      logger.error('Audio error', e, 'useMusicTherapy.handleError');
      setError('Erreur lors de la lecture audio');
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
      }
    };
  }, []);

  // Démarrer une session de thérapie musicale
  const startTherapySession = useCallback(async (
    userId: string,
    options: {
      targetMood: string;
      currentEmotions: EmotionData[];
      sessionDuration: number;
      preferences?: any;
      therapyType?: 'relaxation' | 'motivation' | 'focus' | 'sleep' | 'mood-lifting';
    }
  ): Promise<ApiResponse> => {
    if (!options.currentEmotions.length) {
      const error = 'Émotions actuelles requises pour démarrer la session';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await musicTherapyService.startTherapySession(userId, options);

      if (response.success && response.data) {
        const { sessionId, initialTrack, sessionPlan } = response.data;
        
        setActiveSessionId(sessionId);
        setCurrentTrack(initialTrack);
        
        // Ajouter la piste initiale à la playlist
        setPlaylist([initialTrack]);
        setCurrentTrackIndex(0);
        
        // Charger la piste dans l'élément audio
        if (audioRef.current && initialTrack.url) {
          audioRef.current.src = initialTrack.url;
          audioRef.current.load();
        }

        setSessionProgress({
          sessionId,
          plan: sessionPlan,
          startTime: new Date(),
          targetMood: options.targetMood,
          duration: options.sessionDuration
        });

      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors du démarrage de la session';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mettre à jour la session avec de nouvelles émotions
  const updateSessionWithEmotions = useCallback(async (
    emotions: EmotionData[]
  ): Promise<ApiResponse> => {
    if (!activeSessionId) {
      const error = 'Aucune session active pour mise à jour';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    if (!emotions.length) {
      const error = 'Données émotionnelles requises pour la mise à jour';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      setError(null);
      const response = await musicTherapyService.updateSessionWithEmotions(
        activeSessionId,
        emotions
      );

      if (response.success && response.data) {
        const { adaptationNeeded, newTrack, adaptationReason } = response.data;

        if (adaptationNeeded && newTrack) {
          // Changer de piste
          setCurrentTrack(newTrack);
          
          // Mettre à jour la playlist
          setPlaylist(prev => [...prev, newTrack]);
          setCurrentTrackIndex(prev => prev + 1);
          
          // Charger la nouvelle piste
          if (audioRef.current) {
            const wasPlaying = isPlaying;
            audioRef.current.src = newTrack.url || '';
            audioRef.current.load();
            
            if (wasPlaying) {
              audioRef.current.play().catch((err) => logger.error('Play error', err, 'useMusicTherapy.updateSession'));
            }
          }

          // Mettre à jour les recommandations
          setRecommendations(prev => [
            ...prev,
            {
              type: 'adaptation',
              message: adaptationReason,
              timestamp: new Date()
            }
          ]);
        }
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la mise à jour de session';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, [activeSessionId, isPlaying]);

  // Terminer la session thérapeutique
  const endTherapySession = useCallback(async (feedback?: {
    effectiveness: number;
    enjoyment: number;
    wouldRecommend: boolean;
    comments?: string;
  }): Promise<ApiResponse> => {
    if (!activeSessionId) {
      const error = 'Aucune session active à terminer';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    try {
      setError(null);
      const response = await musicTherapyService.endTherapySession(activeSessionId, feedback);

      if (response.success) {
        // Nettoyer l'état de session
        setActiveSessionId(null);
        setSessionProgress(null);
        
        // Arrêter la lecture
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la fin de session';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, [activeSessionId]);

  // Contrôles de lecture
  const play = useCallback(async (): Promise<void> => {
    if (!audioRef.current || !currentTrack) {
      setError('Aucune piste chargée');
      return;
    }

    try {
      await audioRef.current.play();
      setIsPlaying(true);
      setError(null);
    } catch (err: any) {
      logger.error('Erreur de lecture', err, 'useMusicTherapy.play');
      setError('Impossible de lire la piste');
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    const nextTrack = playlist[nextIndex];
    
    setCurrentTrackIndex(nextIndex);
    setCurrentTrack(nextTrack);
    
    if (audioRef.current && nextTrack.url) {
      const wasPlaying = isPlaying;
      audioRef.current.src = nextTrack.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch((err) => logger.error('Play error', err, 'useMusicTherapy.nextTrack'));
      }
    }
  }, [playlist, currentTrackIndex, isPlaying]);

  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentTrackIndex === 0 ? playlist.length - 1 : currentTrackIndex - 1;
    const prevTrack = playlist[prevIndex];
    
    setCurrentTrackIndex(prevIndex);
    setCurrentTrack(prevTrack);
    
    if (audioRef.current && prevTrack.url) {
      const wasPlaying = isPlaying;
      audioRef.current.src = prevTrack.url;
      audioRef.current.load();
      
      if (wasPlaying) {
        audioRef.current.play().catch((err) => logger.error('Play error', err, 'useMusicTherapy.previousTrack'));
      }
    }
  }, [playlist, currentTrackIndex, isPlaying]);

  // Obtenir une playlist personnalisée
  const getPersonalizedPlaylist = useCallback(async (
    userId: string,
    context: {
      timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      activity: 'work' | 'exercise' | 'relaxation' | 'study' | 'sleep';
      recentEmotions?: EmotionData[];
      duration?: number;
    }
  ): Promise<ApiResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await musicTherapyService.getPersonalizedPlaylist(userId, context);

      if (response.success && response.data?.playlist) {
        setPlaylist(response.data.playlist);
        
        // Si aucune piste n'est actuellement sélectionnée, prendre la première
        if (!currentTrack && response.data.playlist.length > 0) {
          setCurrentTrack(response.data.playlist[0]);
          setCurrentTrackIndex(0);
          
          if (audioRef.current) {
            audioRef.current.src = response.data.playlist[0].url || '';
            audioRef.current.load();
          }
        }
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'obtention de la playlist';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsLoading(false);
    }
  }, [currentTrack]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    // Arrêter la lecture
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    // Réinitialiser tous les états
    setActiveSessionId(null);
    setSessionProgress(null);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaylist([]);
    setCurrentTrackIndex(0);
    setRecommendations([]);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    // État de session
    activeSessionId,
    sessionProgress,
    isSessionActive: activeSessionId !== null,
    
    // État de lecture
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    
    // Playlists et recommandations
    playlist,
    recommendations,
    
    // États généraux
    isLoading,
    error,
    
    // Méthodes de session
    startTherapySession,
    updateSessionWithEmotions,
    endTherapySession,
    
    // Contrôles de lecture
    play,
    pause,
    seekTo,
    setVolume: handleSetVolume,
    nextTrack,
    previousTrack,
    
    // Playlists
    getPersonalizedPlaylist,
    
    // Utilitaires
    reset
  };
};