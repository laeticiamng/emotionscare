/**
 * HOOK MUSICAL UNIFIÉ - Thérapie Musicale Premium
 * Interface React optimisée pour le service musical intelligent
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { unifiedMusicService } from '@/services/UnifiedMusicService';
import { 
  UnifiedMusicTrack, 
  MusicPlaylist, 
  MusicTherapySession 
} from '@/services/UnifiedMusicService';
import { UnifiedEmotionAnalysis, EmotionLabel } from '@/types/unified-emotions';

interface UseUnifiedMusicOptions {
  autoPlay?: boolean;
  adaptiveMode?: boolean;
  saveSession?: boolean;
  enableCrossfade?: boolean;
  maxRetries?: number;
}

interface UseUnifiedMusicReturn {
  // État de génération/chargement
  isGenerating: boolean;
  isCreatingPlaylist: boolean;
  isLoading: boolean;
  error: string | null;
  
  // État de lecture
  isPlaying: boolean;
  currentTrack: UnifiedMusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  currentPosition: number; // en secondes
  volume: number;
  
  // Session thérapeutique
  therapySession: MusicTherapySession | null;
  isTherapyActive: boolean;
  
  // Actions principales
  generateMusic: (params: GenerateMusicParams) => Promise<UnifiedMusicTrack | null>;
  createTherapeuticPlaylist: (params: CreatePlaylistParams) => Promise<MusicPlaylist | null>;
  startTherapySession: (params: StartTherapyParams) => Promise<MusicTherapySession | null>;
  endTherapySession: (feedback?: number) => Promise<MusicTherapySession | null>;
  
  // Contrôles de lecture
  play: () => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  
  // Actions thérapeutiques
  updateSessionWithEmotion: (analysis: UnifiedEmotionAnalysis) => Promise<void>;
  
  // Utilitaires
  clearError: () => void;
  reset: () => void;
}

interface GenerateMusicParams {
  emotion: EmotionLabel;
  mood?: string;
  style?: string;
  duration?: number;
  lyrics?: string;
  intensity?: number;
  context?: string;
}

interface CreatePlaylistParams {
  currentEmotion: EmotionLabel;
  targetEmotion: EmotionLabel;
  duration: number; // minutes
  style?: string;
  adaptiveMode?: boolean;
}

interface StartTherapyParams {
  userId: string;
  goal: MusicTherapySession['goal'];
  currentEmotion: EmotionLabel;
  targetEmotion?: EmotionLabel;
  duration: number; // minutes
  style?: string;
}

export const useUnifiedMusic = (options: UseUnifiedMusicOptions = {}): UseUnifiedMusicReturn => {
  const {
    autoPlay = false,
    adaptiveMode = true,
    saveSession = true,
    enableCrossfade = true,
    maxRetries = 3
  } = options;

  // État de génération/chargement
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // État de lecture
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<UnifiedMusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  
  // Session thérapeutique
  const [therapySession, setTherapySession] = useState<MusicTherapySession | null>(null);
  const [isTherapyActive, setIsTherapyActive] = useState(false);
  
  // Refs pour l'audio
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const retryCountRef = useRef(0);

  /**
   * Génération de musique avec Suno AI
   */
  const generateMusic = useCallback(async (params: GenerateMusicParams): Promise<UnifiedMusicTrack | null> => {
    if (isGenerating) {
      console.warn('⚠️ Génération déjà en cours');
      return null;
    }

    setIsGenerating(true);
    setError(null);
    retryCountRef.current = 0;

    const performGeneration = async (attempt: number = 1): Promise<UnifiedMusicTrack | null> => {
      try {
        console.log(`🎵 Tentative génération ${attempt}/${maxRetries}:`, params);
        
        const track = await unifiedMusicService.generateMusic(params);
        
        setCurrentTrack(track);
        
        // Auto-play si activé
        if (autoPlay && track.audioUrl) {
          await playTrack(track);
        }

        toast.success('Musique générée!', {
          description: `"${track.title}" par ${track.artist}`
        });

        console.log('✅ Génération réussie:', track.title);
        return track;

      } catch (generateError: any) {
        console.error(`❌ Erreur génération (tentative ${attempt}):`, generateError);
        
        if (attempt < maxRetries) {
          console.log(`🔄 Nouvelle tentative dans 3s...`);
          await new Promise(resolve => setTimeout(resolve, 3000));
          return performGeneration(attempt + 1);
        }
        
        throw generateError;
      }
    };

    try {
      return await performGeneration();
    } catch (finalError: any) {
      const errorMessage = finalError.message || 'Erreur de génération musicale';
      setError(errorMessage);
      
      toast.error('Génération échouée', {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, maxRetries, autoPlay]);

  /**
   * Création de playlist thérapeutique
   */
  const createTherapeuticPlaylist = useCallback(async (params: CreatePlaylistParams): Promise<MusicPlaylist | null> => {
    if (isCreatingPlaylist) {
      console.warn('⚠️ Création de playlist déjà en cours');
      return null;
    }

    setIsCreatingPlaylist(true);
    setError(null);

    try {
      console.log('🎼 Création playlist thérapeutique:', params);
      
      const playlist = await unifiedMusicService.createTherapeuticPlaylist({
        currentEmotion: params.currentEmotion,
        targetEmotion: params.targetEmotion,
        duration: params.duration,
        style: params.style,
        adaptiveMode: params.adaptiveMode || adaptiveMode
      });

      setCurrentPlaylist(playlist);
      
      if (playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
      }

      toast.success('Playlist créée!', {
        description: `${playlist.tracks.length} morceaux, ${Math.round(playlist.totalDuration / 60)}min`
      });

      return playlist;

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de création de playlist';
      setError(errorMessage);
      
      toast.error('Création échouée', {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsCreatingPlaylist(false);
    }
  }, [isCreatingPlaylist, adaptiveMode]);

  /**
   * Démarrage session de thérapie musicale
   */
  const startTherapySession = useCallback(async (params: StartTherapyParams): Promise<MusicTherapySession | null> => {
    if (isTherapyActive) {
      console.warn('⚠️ Session thérapeutique déjà active');
      return therapySession;
    }

    setError(null);
    setIsLoading(true);

    try {
      console.log('🎭 Démarrage session thérapie:', params);
      
      const session = await unifiedMusicService.startTherapySession(params);
      
      setTherapySession(session);
      setIsTherapyActive(true);
      setCurrentPlaylist(session.playlist);
      
      if (session.playlist.tracks.length > 0) {
        setCurrentTrack(session.playlist.tracks[0]);
        
        if (autoPlay) {
          await playTrack(session.playlist.tracks[0]);
        }
      }

      toast.success('Thérapie démarrée!', {
        description: `Objectif: ${params.currentEmotion} → ${params.targetEmotion || 'bien-être'}`
      });

      return session;

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur de démarrage de thérapie';
      setError(errorMessage);
      
      toast.error('Démarrage échoué', {
        description: errorMessage
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isTherapyActive, therapySession, autoPlay]);

  /**
   * Arrêt session de thérapie
   */
  const endTherapySession = useCallback(async (feedback?: number): Promise<MusicTherapySession | null> => {
    if (!isTherapyActive || !therapySession) {
      console.warn('⚠️ Aucune session thérapeutique active');
      return null;
    }

    try {
      console.log('🏁 Arrêt session thérapie:', therapySession.id);
      
      const finalSession = await unifiedMusicService.endTherapySession(therapySession.id, feedback);
      
      setIsTherapyActive(false);
      pause(); // Arrêter la lecture
      
      toast.success('Thérapie terminée!', {
        description: `Objectif ${finalSession.outcome?.goalAchieved ? 'atteint' : 'partiellement atteint'}`
      });

      return finalSession;

    } catch (error: any) {
      const errorMessage = error.message || 'Erreur d\'arrêt de thérapie';
      setError(errorMessage);
      
      toast.error('Arrêt échoué', {
        description: errorMessage
      });
      
      // Forcer l'arrêt en cas d'erreur
      setIsTherapyActive(false);
      
      return null;
    }
  }, [isTherapyActive, therapySession]);

  /**
   * Mise à jour session avec feedback émotionnel
   */
  const updateSessionWithEmotion = useCallback(async (analysis: UnifiedEmotionAnalysis): Promise<void> => {
    if (!isTherapyActive || !therapySession) {
      console.warn('⚠️ Aucune session active pour mise à jour émotionnelle');
      return;
    }

    try {
      console.log('📊 Mise à jour session avec émotion:', analysis.primaryEmotion);
      
      const updatedSession = await unifiedMusicService.updateSessionWithEmotion(
        therapySession.id,
        analysis
      );
      
      setTherapySession(updatedSession);
      
      // Mise à jour playlist si elle a été adaptée
      if (updatedSession.playlist.tracks.length !== currentPlaylist?.tracks.length) {
        setCurrentPlaylist(updatedSession.playlist);
        console.log('🔄 Playlist adaptée dynamiquement');
      }

    } catch (error: any) {
      console.error('❌ Erreur mise à jour session:', error);
      setError(`Erreur mise à jour: ${error.message}`);
    }
  }, [isTherapyActive, therapySession, currentPlaylist?.tracks.length]);

  // === CONTRÔLES DE LECTURE ===

  const playTrack = useCallback(async (track: UnifiedMusicTrack): Promise<void> => {
    try {
      console.log('▶️ Lecture track:', track.title);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = track.audioUrl;
        audioRef.current.volume = volume;
        
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        
        setIsPlaying(true);
        setCurrentTrack(track);
        
        // Démarrer le suivi de progression
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        
        progressIntervalRef.current = setInterval(() => {
          if (audioRef.current) {
            setCurrentPosition(audioRef.current.currentTime);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('❌ Erreur lecture:', error);
      toast.error('Erreur de lecture', {
        description: 'Impossible de lire ce morceau'
      });
    }
  }, [volume]);

  const play = useCallback(() => {
    if (currentTrack && !isPlaying) {
      playTrack(currentTrack);
    }
  }, [currentTrack, isPlaying, playTrack]);

  const pause = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = undefined;
      }
    }
  }, [isPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentPosition(0);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = undefined;
      }
    }
  }, []);

  const next = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
      playTrack(currentPlaylist.tracks[nextIndex]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  const previous = useCallback(() => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
      playTrack(currentPlaylist.tracks[prevIndex]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  const seekTo = useCallback((seconds: number) => {
    if (audioRef.current && currentTrack) {
      audioRef.current.currentTime = Math.max(0, Math.min(seconds, currentTrack.duration));
      setCurrentPosition(audioRef.current.currentTime);
    }
  }, [currentTrack]);

  const setVolume = useCallback((newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolumeState(vol);
    
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  // === UTILITAIRES ===

  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
  }, []);

  const reset = useCallback(() => {
    stop();
    setIsGenerating(false);
    setIsCreatingPlaylist(false);
    setIsLoading(false);
    setError(null);
    setCurrentTrack(null);
    setCurrentPlaylist(null);
    setTherapySession(null);
    setIsTherapyActive(false);
    
    retryCountRef.current = 0;
    
    console.log('🔄 Hook musique reset');
  }, [stop]);

  // === EFFETS ===

  // Initialisation de l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleEnded = () => {
      console.log('🎵 Track terminée, passage au suivant');
      if (currentPlaylist && currentPlaylist.tracks.length > 1) {
        next();
      } else {
        setIsPlaying(false);
        setCurrentPosition(0);
      }
    };
    
    const handleError = (e: any) => {
      console.error('❌ Erreur audio:', e);
      setError('Erreur de lecture audio');
      setIsPlaying(false);
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('error', handleError);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentPlaylist, next]);

  // Log des changements d'état pour debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎵 État hook musique mis à jour:', {
        isGenerating,
        isCreatingPlaylist,
        isPlaying,
        hasTrack: !!currentTrack,
        hasPlaylist: !!currentPlaylist,
        isTherapyActive,
        error
      });
    }
  }, [isGenerating, isCreatingPlaylist, isPlaying, currentTrack, currentPlaylist, isTherapyActive, error]);

  return {
    // État
    isGenerating,
    isCreatingPlaylist,
    isLoading,
    error,
    isPlaying,
    currentTrack,
    currentPlaylist,
    currentPosition,
    volume,
    therapySession,
    isTherapyActive,
    
    // Actions
    generateMusic,
    createTherapeuticPlaylist,
    startTherapySession,
    endTherapySession,
    play,
    pause,
    stop,
    next,
    previous,
    seekTo,
    setVolume,
    updateSessionWithEmotion,
    clearError,
    reset
  };
};