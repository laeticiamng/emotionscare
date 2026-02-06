/**
 * useEmotionalMusicAI - Hook pour musique émotionnelle IA
 * Génération intelligente de musique basée sur l'état émotionnel
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface EmotionAnalysis {
  dominantEmotion: string;
  avgIntensity: number;
  emotionFrequency: Record<string, number>;
  recentScans: number;
  musicProfile: {
    prompt: string;
    tempo: number;
    tags: string[];
    description: string;
  };
}

export interface GeneratedTrack {
  success: boolean;
  taskId: string;
  trackId: string;
  sessionId: string;
  emotion: string;
  profile: any;
  status: string;
}

export interface TrackStatus {
  success: boolean;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  audio_url?: string;
  image_url?: string;
  duration?: number;
  metadata?: any;
}

export interface MusicRecommendations {
  preferences: any;
  recentTracks: any[];
  sessions: any[];
  totalGenerated: number;
}

export const useEmotionalMusicAI = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [emotionAnalysis, setEmotionAnalysis] = useState<EmotionAnalysis | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentGeneration, setCurrentGeneration] = useState<GeneratedTrack | null>(null);
  const [recommendations, setRecommendations] = useState<MusicRecommendations | null>(null);

  /**
   * Analyser les émotions récentes de l'utilisateur
   */
  const analyzeEmotions = useCallback(async (): Promise<EmotionAnalysis | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setIsAnalyzing(true);
    try {
      logger.info('🔍 Analysing user emotions', { userId: user.id }, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: { action: 'analyze-emotions' }
      });

      if (error) throw error;

      logger.info('✅ Emotion analysis complete', data, 'MUSIC');
      setEmotionAnalysis(data);
      return data;

    } catch (error: unknown) {
      logger.error('❌ Emotion analysis failed', error instanceof Error ? error : new Error(String(error)), 'MUSIC');
      
      // Gestion des erreurs spécifiques
      const errorMessage = error instanceof Error ? error.message : (error as any)?.error || 'Erreur lors de l\'analyse émotionnelle';
      
      if (errorMessage.includes('temporairement indisponible') || errorMessage.includes('503')) {
        toast.error('Service temporairement indisponible', {
          description: 'Le service d\'analyse est en cours de maintenance. Réessayez dans quelques instants.'
        });
      } else {
        toast.error('Erreur lors de l\'analyse émotionnelle', {
          description: 'Une erreur s\'est produite lors de l\'analyse de vos émotions.'
        });
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  /**
   * Générer de la musique personnalisée pour une émotion
   */
  const generateMusicForEmotion = useCallback(async (
    emotion: string,
    customPrompt?: string,
    scanId?: string
  ): Promise<GeneratedTrack | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      logger.info('🎵 Generating music for emotion', { emotion, customPrompt }, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'generate-music',
          emotion,
          customPrompt,
          scanId
        }
      });

      if (error) {
        // Gérer spécifiquement l'erreur 503 avec fallback
        const errorMessage = error?.message || '';
        
        if (errorMessage.includes('503') || errorMessage.includes('temporairement indisponible')) {
          logger.warn('⚠️ Service unavailable, using fallback tracks', { emotion }, 'MUSIC');
          
          toast.info('Service temporairement indisponible', {
            description: 'Nous proposons des morceaux déjà générés en attendant.',
            duration: 5000,
          });
          
          // Fallback: récupérer des tracks existantes pour cette émotion
          const { data: existingTracks } = await supabase
            .from('generated_music_tracks')
            .select('*')
            .eq('emotion', emotion)
            .eq('generation_status', 'completed')
            .not('audio_url', 'is', null)
            .order('created_at', { ascending: false })
            .limit(1);
          
          if (existingTracks && existingTracks.length > 0) {
            const track = existingTracks[0];
            const fallbackData = {
              success: true,
              taskId: track.original_task_id,
              trackId: track.id,
              sessionId: '',
              emotion: track.emotion,
              profile: { description: `Musique ${emotion} (morceaux déjà générés)` },
              status: 'complete',
              isFallback: true
            };
            
            setCurrentGeneration(fallbackData);
            setGenerationProgress(100);
            setIsGenerating(false);
            
            toast.success('Morceau proposé', {
              description: `Un morceau ${emotion} existant est disponible en attendant le retour du service.`
            });
            
            return fallbackData;
          }
        }
        
        throw error;
      }

      if (!data) {
        throw new Error('Aucune donnée reçue');
      }

      // Vérifier si la demande a été mise en queue
      if (data.queued) {
        toast.info('Service surchargé', {
          description: `Votre demande est en file d'attente. Temps d'attente estimé: ${data.estimatedWaitMinutes} min`,
          duration: 5000,
        });
        logger.info('🕐 Demande mise en queue', { queueId: data.queueId }, 'MUSIC_AI');
        setIsGenerating(false);
        return null;
      }

      logger.info('✅ Music generation started', data, 'MUSIC');
      setCurrentGeneration(data);
      setGenerationProgress(30);

      toast.success('Génération de musique démarrée', {
        description: data.profile?.description || 'Création en cours...'
      });

      return data;

    } catch (error: unknown) {
      logger.error('❌ Music generation failed', error instanceof Error ? error : new Error(String(error)), 'MUSIC');
      
      // Gestion des erreurs spécifiques
      const errorMessage = error instanceof Error ? error.message : (error as any)?.error || '';
      
      if (errorMessage.includes('temporairement indisponible') || errorMessage.includes('503')) {
        toast.error('Service temporairement indisponible', {
          description: 'Le service de génération musicale est en maintenance. Aucun morceau de secours disponible.',
          duration: 5000
        });
      } else if (errorMessage.includes('authentification') || errorMessage.includes('401')) {
        toast.error('Erreur d\'authentification', {
          description: 'Veuillez vous reconnecter pour générer de la musique.'
        });
      } else {
        toast.error('Erreur lors de la génération', {
          description: 'Une erreur s\'est produite. Veuillez réessayer.'
        });
      }
      
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user]);

  /**
   * Vérifier le statut de génération d'un track
   */
  const checkGenerationStatus = useCallback(async (
    taskId: string,
    trackId: string
  ): Promise<TrackStatus | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: {
          action: 'check-status',
          sunoTaskId: taskId,
          trackId
        }
      });

      if (error) throw error;

      if (data.status === 'complete') {
        setGenerationProgress(100);
        toast.success('Musique générée avec succès !', {
          description: 'Votre composition personnalisée est prête'
        });
      } else if (data.status === 'processing') {
        setGenerationProgress(60);
      }

      return data;

    } catch (error: unknown) {
      logger.error('❌ Status check failed', error instanceof Error ? error : new Error(String(error)), 'MUSIC');
      
      const errorMessage = error instanceof Error ? error.message : (error as any)?.error || '';
      
      // Ne pas afficher de toast pour les erreurs de status check (polling silencieux)
      // mais logger pour le debug
      if (errorMessage.includes('temporairement indisponible') || errorMessage.includes('503')) {
        logger.warn('Service temporairement indisponible lors du check status', {}, 'MUSIC');
      }
      
      return null;
    }
  }, []);

  /**
   * Récupérer les recommandations personnalisées
   */
  const getRecommendations = useCallback(async (): Promise<MusicRecommendations | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.functions.invoke('emotion-music-ai', {
        body: { action: 'get-recommendations' }
      });

      if (error) throw error;

      setRecommendations(data);
      return data;

    } catch (error) {
      logger.error('❌ Recommendations fetch failed', error as Error, 'MUSIC');
      return null;
    }
  }, [user]);

  /**
   * Générer automatiquement de la musique basée sur l'analyse émotionnelle
   */
  const generateFromCurrentEmotion = useCallback(async (): Promise<GeneratedTrack | null> => {
    const analysis = emotionAnalysis || await analyzeEmotions();
    if (!analysis) return null;

    return generateMusicForEmotion(analysis.dominantEmotion);
  }, [emotionAnalysis, analyzeEmotions, generateMusicForEmotion]);

  /**
   * Polling automatique du statut de génération
   */
  const pollGenerationStatus = useCallback(async (
    taskId: string,
    trackId: string,
    onComplete?: (track: TrackStatus) => void
  ) => {
    const maxAttempts = 30; // 30 tentatives = 5 minutes max
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('Timeout de génération', {
          description: 'La génération prend plus de temps que prévu'
        });
        return;
      }

      const status = await checkGenerationStatus(taskId, trackId);
      attempts++;

      if (status?.status === 'complete') {
        onComplete?.(status);
        return;
      }

      if (status?.status === 'failed') {
        toast.error('Génération échouée');
        return;
      }

      // Continuer le polling toutes les 10 secondes
      setTimeout(poll, 10000);
    };

    poll();
  }, [checkGenerationStatus]);

  /**
   * Charger les recommandations au montage du hook
   */
  useEffect(() => {
    if (user) {
      getRecommendations();
    }
  }, [user, getRecommendations]);

  return {
    // État
    isAnalyzing,
    isGenerating,
    emotionAnalysis,
    generationProgress,
    currentGeneration,
    recommendations,

    // Actions
    analyzeEmotions,
    generateMusicForEmotion,
    checkGenerationStatus,
    getRecommendations,
    generateFromCurrentEmotion,
    pollGenerationStatus,
  };
};
