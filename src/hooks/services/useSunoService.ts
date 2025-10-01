// @ts-nocheck
import { useState, useCallback } from 'react';
import { sunoService } from '@/services';
import type { ApiResponse, MusicRecommendation, EmotionData } from '@/services/types';

interface SunoServiceHook {
  // État
  isGenerating: boolean;
  generatedTrack: MusicRecommendation | null;
  playlist: MusicRecommendation[];
  error: string | null;
  generationProgress: number;
  
  // Génération de musique
  generateMusic: (options: any) => Promise<ApiResponse>;
  generateTherapeuticMusic: (emotionalProfile: any) => Promise<ApiResponse>;
  generateAdaptiveMusic: (emotions: EmotionData[], goals: any) => Promise<ApiResponse>;
  
  // Playlists
  getMoodBasedPlaylist: (mood: string, options?: any) => Promise<ApiResponse>;
  getPersonalizedPlaylist: (userId: string, context: any) => Promise<ApiResponse>;
  
  // Amélioration
  enhanceExistingTrack: (audioFile: File, enhancements: any) => Promise<ApiResponse>;
  
  // Statut
  getGenerationStatus: (generationId: string) => Promise<ApiResponse>;
  
  // Utilitaires
  reset: () => void;
}

export const useSunoService = (): SunoServiceHook => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<MusicRecommendation | null>(null);
  const [playlist, setPlaylist] = useState<MusicRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  // Générer de la musique personnalisée
  const generateMusic = useCallback(async (options: {
    emotion?: string;
    mood?: string;
    genre?: string;
    duration?: number;
    lyrics?: string;
    instrumental?: boolean;
    energy?: number;
    valence?: number;
    tempo?: 'slow' | 'medium' | 'fast';
    customPrompt?: string;
  }): Promise<ApiResponse> => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // Simuler le progrès de génération
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const response = await sunoService.generateMusic(options);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (response.success && response.data) {
        setGeneratedTrack(response.data);
        
        // Si c'est un statut de génération, vérifier périodiquement
        if (response.data.status === 'generating') {
          await pollGenerationStatus(response.data.id);
        }
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la génération musicale';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 2000);
    }
  }, []);

  // Générer de la musique thérapeutique
  const generateTherapeuticMusic = useCallback(async (emotionalProfile: {
    currentEmotions: EmotionData[];
    targetMood: string;
    preferences?: any;
    sessionType?: 'relaxation' | 'motivation' | 'focus' | 'sleep';
  }): Promise<ApiResponse> => {
    if (!emotionalProfile.currentEmotions.length) {
      const error = 'Profil émotionnel requis pour la génération thérapeutique';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await sunoService.generateTherapeuticMusic(emotionalProfile);
      
      if (response.success && response.data) {
        setGeneratedTrack(response.data);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la génération thérapeutique';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Générer de la musique adaptative
  const generateAdaptiveMusic = useCallback(async (
    emotions: EmotionData[],
    goals: {
      targetMood: string;
      duration: number;
      progressionType: 'gradual' | 'immediate' | 'wave';
    }
  ): Promise<ApiResponse> => {
    if (!emotions.length) {
      const error = 'Données émotionnelles requises pour l\'adaptation';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await sunoService.generateAdaptiveMusic(emotions, goals);
      
      if (response.success && response.data) {
        setGeneratedTrack(response.data.currentTrack);
        
        // Mettre à jour la playlist avec les prochaines pistes
        if (response.data.nextTracks) {
          setPlaylist(prev => [...prev, ...response.data.nextTracks]);
        }
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'adaptation musicale';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Obtenir une playlist basée sur l'humeur
  const getMoodBasedPlaylist = useCallback(async (
    mood: string,
    options: {
      duration?: number;
      count?: number;
      includeGenerated?: boolean;
      includeExisting?: boolean;
      personalizeFor?: string;
    } = {}
  ): Promise<ApiResponse> => {
    if (!mood.trim()) {
      const error = 'Humeur requise pour générer la playlist';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await sunoService.getMoodBasedPlaylist(mood, options);
      
      if (response.success && response.data?.playlist) {
        setPlaylist(response.data.playlist);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la création de playlist';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
    if (!userId) {
      const error = 'ID utilisateur requis';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await sunoService.getPersonalizedPlaylist(userId, context);
      
      if (response.success && response.data?.playlist) {
        setPlaylist(response.data.playlist);
      } else if (response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la personnalisation';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Améliorer une piste existante
  const enhanceExistingTrack = useCallback(async (
    audioFile: File,
    enhancements: {
      targetMood: string;
      addLayers?: string[];
      adjustTempo?: number;
      addEffects?: string[];
    }
  ): Promise<ApiResponse> => {
    if (!audioFile) {
      const error = 'Fichier audio requis';
      setError(error);
      return {
        success: false,
        error,
        timestamp: new Date()
      };
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await sunoService.enhanceExistingTrack(audioFile, enhancements);
      
      if (!response.success && response.error) {
        setError(response.error);
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de l\'amélioration';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Vérifier le statut de génération
  const getGenerationStatus = useCallback(async (generationId: string): Promise<ApiResponse> => {
    try {
      const response = await sunoService.getGenerationStatus(generationId);
      
      if (response.success && response.data) {
        if (response.data.status === 'completed' && response.data.audioUrl) {
          // Mettre à jour la piste générée avec l'URL finale
          setGeneratedTrack(prev => prev ? {
            ...prev,
            audioUrl: response.data.audioUrl
          } : null);
        }
      }

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Erreur lors de la vérification du statut';
      return {
        success: false,
        error: errorMessage,
        timestamp: new Date()
      };
    }
  }, []);

  // Polling pour le statut de génération
  const pollGenerationStatus = useCallback(async (generationId: string) => {
    const maxAttempts = 30; // 30 tentatives max
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        setError('Délai de génération dépassé');
        return;
      }

      const statusResponse = await getGenerationStatus(generationId);
      
      if (statusResponse.success && statusResponse.data) {
        const { status } = statusResponse.data;
        
        if (status === 'completed') {
          return; // Génération terminée
        } else if (status === 'failed') {
          setError('Échec de la génération musicale');
          return;
        }
      }

      attempts++;
      setTimeout(poll, 2000); // Vérifier toutes les 2 secondes
    };

    poll();
  }, [getGenerationStatus]);

  // Réinitialiser l'état
  const reset = useCallback(() => {
    setGeneratedTrack(null);
    setPlaylist([]);
    setError(null);
    setGenerationProgress(0);
    setIsGenerating(false);
  }, []);

  return {
    // État
    isGenerating,
    generatedTrack,
    playlist,
    error,
    generationProgress,
    
    // Méthodes
    generateMusic,
    generateTherapeuticMusic,
    generateAdaptiveMusic,
    getMoodBasedPlaylist,
    getPersonalizedPlaylist,
    enhanceExistingTrack,
    getGenerationStatus,
    reset
  };
};