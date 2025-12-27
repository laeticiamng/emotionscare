// @ts-nocheck
/**
 * useMusicJourney - Gestion des parcours musicaux guidés
 * Transitions progressives d'émotions négatives vers positives
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEmotionalMusicAI } from './useEmotionalMusicAI';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface MusicJourney {
  id: string;
  title: string;
  description: string;
  emotion_start: string;
  emotion_target: string;
  status: 'active' | 'completed' | 'abandoned';
  current_step: number;
  total_steps: number;
  progress_percentage: number;
  started_at: string;
  completed_at?: string;
  tracks?: JourneyTrack[];
}

export interface JourneyTrack {
  id: string;
  step_number: number;
  emotion_level: string;
  track_id?: string;
  is_completed: boolean;
  played_at?: string;
  emotion_after?: string;
  user_rating?: number;
  audio_url?: string;
  title?: string;
}

const EMOTION_PROGRESSION = {
  'anxious-calm': ['anxious', 'worried', 'neutral', 'peaceful', 'calm'],
  'sad-joy': ['sad', 'melancholic', 'neutral', 'hopeful', 'joy'],
  'anger-calm': ['anger', 'frustrated', 'neutral', 'relaxed', 'calm'],
  'stressed-energetic': ['stressed', 'tense', 'balanced', 'motivated', 'energetic']
};

export const useMusicJourney = () => {
  const { user } = useAuth();
  const { generateMusicForEmotion, pollGenerationStatus } = useEmotionalMusicAI();
  const [activeJourney, setActiveJourney] = useState<MusicJourney | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isGeneratingTrack, setIsGeneratingTrack] = useState(false);

  /**
   * Créer un nouveau parcours musical guidé
   */
  const createJourney = useCallback(async (
    emotionStart: string,
    emotionTarget: string
  ): Promise<MusicJourney | null> => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setIsCreating(true);
    try {
      const progressionKey = `${emotionStart}-${emotionTarget}` as keyof typeof EMOTION_PROGRESSION;
      const emotionSteps = EMOTION_PROGRESSION[progressionKey] || [
        emotionStart, 'neutral', emotionTarget
      ];

      const { data: journey, error } = await supabase
        .from('music_journeys')
        .insert({
          user_id: user.id,
          title: `Parcours ${emotionStart} → ${emotionTarget}`,
          description: `Transition progressive de ${emotionStart} vers ${emotionTarget}`,
          emotion_start: emotionStart,
          emotion_target: emotionTarget,
          total_steps: emotionSteps.length,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Créer les tracks pour chaque étape
      const trackInserts = emotionSteps.map((emotion, index) => ({
        journey_id: journey.id,
        step_number: index + 1,
        emotion_level: emotion,
        is_completed: false
      }));

      const { error: tracksError } = await supabase
        .from('music_journey_tracks')
        .insert(trackInserts);

      if (tracksError) throw tracksError;

      logger.info('🎵 Journey created', { journeyId: journey.id }, 'MUSIC');
      toast.success('Parcours créé', { description: `${emotionSteps.length} étapes vers le bien-être` });
      
      return journey as MusicJourney;

    } catch (error) {
      logger.error('❌ Journey creation failed', error as Error, 'MUSIC');
      toast.error('Erreur lors de la création du parcours');
      return null;
    } finally {
      setIsCreating(false);
    }
  }, [user]);

  /**
   * Charger un parcours actif
   */
  const loadJourney = useCallback(async (journeyId: string) => {
    try {
      const { data: journey, error } = await supabase
        .from('music_journeys')
        .select(`
          *,
          tracks:music_journey_tracks(
            *,
            track:generated_music_tracks(id, audio_url, title)
          )
        `)
        .eq('id', journeyId)
        .single();

      if (error) throw error;

      setActiveJourney(journey as MusicJourney);
      return journey as MusicJourney;

    } catch (error) {
      logger.error('❌ Journey load failed', error as Error, 'MUSIC');
      return null;
    }
  }, []);

  /**
   * Générer et jouer le prochain track du parcours
   */
  const playNextStep = useCallback(async (journeyId: string) => {
    setIsGeneratingTrack(true);
    try {
      const journey = activeJourney || await loadJourney(journeyId);
      if (!journey) throw new Error('Journey not found');

      const nextStep = journey.current_step + 1;
      const { data: trackData, error } = await supabase
        .from('music_journey_tracks')
        .select('*')
        .eq('journey_id', journeyId)
        .eq('step_number', nextStep)
        .single();

      if (error) throw error;

      // Générer la musique pour cette étape
      const generated = await generateMusicForEmotion(trackData.emotion_level);
      if (!generated) throw new Error('Generation failed');

      // Mettre à jour le track avec l'ID généré
      await supabase
        .from('music_journey_tracks')
        .update({ track_id: generated.trackId, played_at: new Date().toISOString() })
        .eq('id', trackData.id);

      // Mettre à jour la progression du journey
      const progress = (nextStep / journey.total_steps) * 100;
      await supabase
        .from('music_journeys')
        .update({ 
          current_step: nextStep, 
          progress_percentage: progress 
        })
        .eq('id', journeyId);

      toast.success(`Étape ${nextStep}/${journey.total_steps}`, {
        description: `Émotion: ${trackData.emotion_level}`
      });

      // Poll pour attendre la génération
      await pollGenerationStatus(generated.taskId, generated.trackId);

      return generated;

    } catch (error) {
      logger.error('❌ Next step failed', error as Error, 'MUSIC');
      toast.error('Erreur lors du passage à l\'étape suivante');
      return null;
    } finally {
      setIsGeneratingTrack(false);
    }
  }, [activeJourney, loadJourney, generateMusicForEmotion, pollGenerationStatus]);

  /**
   * Marquer une étape comme complétée avec feedback
   */
  const completeStep = useCallback(async (
    trackId: string,
    emotionAfter: string,
    rating: number
  ) => {
    try {
      await supabase
        .from('music_journey_tracks')
        .update({
          is_completed: true,
          emotion_after: emotionAfter,
          user_rating: rating
        })
        .eq('id', trackId);

      logger.info('✅ Step completed', { trackId, rating }, 'MUSIC');
      toast.success('Étape validée');

    } catch (error) {
      logger.error('❌ Step completion failed', error as Error, 'MUSIC');
    }
  }, []);

  /**
   * Terminer le parcours complet
   */
  const completeJourney = useCallback(async (journeyId: string) => {
    try {
      await supabase
        .from('music_journeys')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          progress_percentage: 100
        })
        .eq('id', journeyId);

      toast.success('🎉 Parcours terminé !', {
        description: 'Bravo pour votre progression émotionnelle'
      });

      logger.info('🎉 Journey completed', { journeyId }, 'MUSIC');

    } catch (error) {
      logger.error('❌ Journey completion failed', error as Error, 'MUSIC');
    }
  }, []);

  /**
   * Récupérer tous les parcours de l'utilisateur
   */
  const getUserJourneys = useCallback(async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('music_journeys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MusicJourney[];

    } catch (error) {
      logger.error('❌ Failed to fetch journeys', error as Error, 'MUSIC');
      return [];
    }
  }, [user]);

  return {
    activeJourney,
    isCreating,
    isGeneratingTrack,
    createJourney,
    loadJourney,
    playNextStep,
    completeStep,
    completeJourney,
    getUserJourneys
  };
};
