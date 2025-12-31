/**
 * useMusicTherapy Hook
 * Interface React pour le service MusicTherapy
 */

import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MusicTherapyService } from '@/modules/music-therapy';
import type { 
  MusicSession, 
  TherapeuticPlaylist, 
  MusicTherapyRecommendation,
  EmotionalPoint
} from '@/modules/music-therapy';
import { logger } from '@/lib/logger';

interface UseMusicTherapyState {
  isLoading: boolean;
  isGenerating: boolean;
  currentSession: MusicSession | null;
  currentPlaylist: TherapeuticPlaylist | null;
  recommendations: MusicTherapyRecommendation[];
  error: string | null;
}

export function useMusicTherapy() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<UseMusicTherapyState>({
    isLoading: false,
    isGenerating: false,
    currentSession: null,
    currentPlaylist: null,
    recommendations: [],
    error: null,
  });

  // Générer une playlist thérapeutique
  const generateTherapeuticPlaylist = useCallback(async (
    therapeuticGoal: {
      currentMood: number;
      targetMood: number;
      emotionalState: string;
      preferences?: string[];
      sessionDuration?: number;
    }
  ) => {
    if (!user?.id) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté', variant: 'destructive' });
      return null;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const playlist = await MusicTherapyService.generateTherapeuticPlaylist(user.id, therapeuticGoal);
      
      setState(prev => ({ ...prev, currentPlaylist: playlist, isGenerating: false }));
      
      toast({
        title: '🎵 Playlist générée',
        description: `${playlist.tracks.length} morceaux adaptés à votre état`,
      });
      
      return playlist;
    } catch (error) {
      logger.error('Failed to generate therapeutic playlist', error as Error, 'MUSIC');
      setState(prev => ({ ...prev, error: 'Erreur de génération', isGenerating: false }));
      toast({
        title: 'Erreur',
        description: 'Impossible de générer la playlist',
        variant: 'destructive',
      });
      return null;
    }
  }, [user?.id, toast]);

  // Démarrer une session avec suivi émotionnel
  const startSession = useCallback(async (playlistId: string, initialMood: number) => {
    if (!user?.id) return null;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const session = await MusicTherapyService.createSessionWithEmotionalTracking(
        user.id,
        playlistId,
        initialMood
      );
      
      setState(prev => ({ ...prev, currentSession: session, isLoading: false }));
      
      return session;
    } catch (error) {
      logger.error('Failed to start session', error as Error, 'MUSIC');
      setState(prev => ({ ...prev, error: 'Erreur de session', isLoading: false }));
      return null;
    }
  }, [user?.id]);

  // Enregistrer un point émotionnel
  const recordEmotionalPoint = useCallback(async (point: EmotionalPoint) => {
    if (!state.currentSession?.id) return null;

    try {
      const result = await MusicTherapyService.recordEmotionalPoint(
        state.currentSession.id,
        point
      );
      
      if (result.shouldAdapt && result.recommendation) {
        toast({
          title: '🎶 Adaptation musicale',
          description: 'La musique s\'adapte à votre état émotionnel',
        });
      }
      
      return result;
    } catch (error) {
      logger.error('Failed to record emotional point', error as Error, 'MUSIC');
      return null;
    }
  }, [state.currentSession?.id, toast]);

  // Terminer une session avec analyse
  const completeSession = useCallback(async (
    durationSeconds: number,
    tracksPlayed: string[],
    finalMood?: number,
    userFeedback?: string
  ) => {
    if (!state.currentSession?.id) return null;

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const result = await MusicTherapyService.completeSessionWithAnalysis(
        state.currentSession.id,
        { durationSeconds, tracksPlayed, finalMood, userFeedback }
      );
      
      setState(prev => ({ ...prev, currentSession: null, isLoading: false }));
      
      toast({
        title: '✅ Session terminée',
        description: `Efficacité: ${Math.round(result.effectiveness * 100)}%`,
      });
      
      return result;
    } catch (error) {
      logger.error('Failed to complete session', error as Error, 'MUSIC');
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, [state.currentSession?.id, toast]);

  // Obtenir des recommandations intelligentes
  const getRecommendations = useCallback(async (context: {
    timeOfDay: string;
    currentActivity?: string;
    recentMood?: number;
    energyLevel?: number;
  }) => {
    if (!user?.id) return [];

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      const recommendations = await MusicTherapyService.getIntelligentRecommendations(
        user.id,
        context
      );
      
      setState(prev => ({ ...prev, recommendations, isLoading: false }));
      
      return recommendations;
    } catch (error) {
      logger.error('Failed to get recommendations', error as Error, 'MUSIC');
      setState(prev => ({ ...prev, isLoading: false }));
      return [];
    }
  }, [user?.id]);

  // Générer playlist simple (legacy)
  const generatePlaylist = useCallback(async (mood: string, preferences?: any) => {
    if (!user?.id) return null;

    setState(prev => ({ ...prev, isGenerating: true }));

    try {
      const result = await MusicTherapyService.generatePlaylist(user.id, mood, preferences);
      setState(prev => ({ ...prev, isGenerating: false }));
      return result;
    } catch (error) {
      logger.error('Failed to generate playlist', error as Error, 'MUSIC');
      setState(prev => ({ ...prev, isGenerating: false }));
      return null;
    }
  }, [user?.id]);

  // Valeurs mémorisées
  const hasActiveSession = useMemo(() => !!state.currentSession, [state.currentSession]);
  const sessionProgress = useMemo(() => {
    if (!state.currentSession) return 0;
    // Calcul basique du progrès
    return Math.min(100, (state.currentSession.duration_seconds / 1800) * 100);
  }, [state.currentSession]);

  return {
    // État
    isLoading: state.isLoading,
    isGenerating: state.isGenerating,
    currentSession: state.currentSession,
    currentPlaylist: state.currentPlaylist,
    recommendations: state.recommendations,
    error: state.error,
    
    // Valeurs calculées
    hasActiveSession,
    sessionProgress,
    
    // Actions
    generateTherapeuticPlaylist,
    generatePlaylist,
    startSession,
    recordEmotionalPoint,
    completeSession,
    getRecommendations,
  };
}

export default useMusicTherapy;
