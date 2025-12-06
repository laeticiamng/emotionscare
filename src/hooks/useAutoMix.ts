// @ts-nocheck
/**
 * useAutoMix - Génération intelligente de playlists contextuelles
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEmotionalMusicAI } from './useEmotionalMusicAI';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

interface AutoMixContext {
  timeContext: string;
  weatherContext: string;
  temperature: number;
  recommendedMood: string;
  recommendedTempo: number;
  contextDescription: string;
}

export const useAutoMix = () => {
  const { user } = useAuth();
  const { generateMusicForEmotion } = useEmotionalMusicAI();
  const [isGenerating, setIsGenerating] = useState(false);
  const [context, setContext] = useState<AutoMixContext | null>(null);
  const [activePlaylist, setActivePlaylist] = useState<any>(null);

  /**
   * Récupérer le contexte utilisateur (météo, heure, etc.)
   */
  const fetchContext = useCallback(async () => {
    if (!user) return null;

    try {
      // Récupérer la position géographique si disponible
      let latitude, longitude;
      if ('geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const { data, error } = await supabase.functions.invoke('automix-context', {
        body: { latitude, longitude }
      });

      if (error) throw error;

      setContext(data);
      return data;

    } catch (error) {
      logger.error('❌ Context fetch failed', error as Error, 'AUTOMIX');
      return null;
    }
  }, [user]);

  /**
   * Générer une playlist auto-mix intelligente
   */
  const generateAutoMix = useCallback(async (
    trackCount: number = 7,
    customContext?: Partial<AutoMixContext>
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté');
      return null;
    }

    setIsGenerating(true);
    try {
      // Récupérer le contexte actuel
      const currentContext = customContext || await fetchContext();
      if (!currentContext) throw new Error('Context unavailable');

      logger.info('🎵 Generating AutoMix', { context: currentContext }, 'AUTOMIX');

      // Créer la playlist
      const { data: playlist, error: playlistError } = await supabase
        .from('automix_playlists')
        .insert({
          user_id: user.id,
          name: `AutoMix ${currentContext.timeContext} - ${new Date().toLocaleDateString()}`,
          is_active: true,
          context_rules: currentContext,
          tempo_range: {
            min: Math.max(60, currentContext.recommendedTempo - 20),
            max: Math.min(140, currentContext.recommendedTempo + 20)
          }
        })
        .select()
        .single();

      if (playlistError) throw playlistError;

      // Générer les tracks progressivement
      const tracks = [];
      const emotions = generateEmotionProgression(
        currentContext.recommendedMood,
        trackCount
      );

      for (let i = 0; i < emotions.length; i++) {
        const track = await generateMusicForEmotion(emotions[i]);
        if (track) {
          tracks.push({
            ...track,
            order: i,
            tempo: calculateTempo(currentContext.recommendedTempo, i, trackCount)
          });
        }
        
        // Notifier la progression
        toast.loading(`Génération track ${i + 1}/${trackCount}`, {
          id: 'automix-generation'
        });
      }

      // Mettre à jour la playlist avec les tracks
      await supabase
        .from('automix_playlists')
        .update({
          generated_tracks: tracks,
          last_generated_at: new Date().toISOString()
        })
        .eq('id', playlist.id);

      toast.success('🎉 AutoMix généré !', {
        id: 'automix-generation',
        description: `${tracks.length} tracks adaptés à votre contexte`
      });

      setActivePlaylist({ ...playlist, tracks });
      return { ...playlist, tracks };

    } catch (error) {
      logger.error('❌ AutoMix generation failed', error as Error, 'AUTOMIX');
      toast.error('Erreur lors de la génération AutoMix');
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, fetchContext, generateMusicForEmotion]);

  /**
   * Sauvegarder les préférences de contexte
   */
  const saveContextPreferences = useCallback(async (prefs: any) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_context_preferences')
        .upsert({
          user_id: user.id,
          ...prefs,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Préférences sauvegardées');
      logger.info('✅ Preferences saved', prefs, 'AUTOMIX');

    } catch (error) {
      logger.error('❌ Preferences save failed', error as Error, 'AUTOMIX');
      toast.error('Erreur lors de la sauvegarde');
    }
  }, [user]);

  /**
   * Charger la playlist active
   */
  const loadActivePlaylist = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('automix_playlists')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setActivePlaylist(data);
      return data;

    } catch (error) {
      logger.error('❌ Failed to load playlist', error as Error, 'AUTOMIX');
      return null;
    }
  }, [user]);

  /**
   * Soumettre un feedback like/dislike sur une session Auto-mix
   */
  const submitFeedback = useCallback(async (
    playlistId: string,
    rating: -1 | 1,
    feedbackNotes?: string
  ) => {
    if (!user) return;

    try {
      const contextSnapshot = context || await fetchContext();

      const { error } = await supabase
        .from('automix_feedback')
        .insert({
          user_id: user.id,
          playlist_id: playlistId,
          rating,
          context_snapshot: contextSnapshot,
          feedback_notes: feedbackNotes
        });

      if (error) throw error;

      // Mettre à jour le résumé de feedback
      await updateFeedbackSummary(rating, contextSnapshot);

      toast.success(rating === 1 ? '👍 Merci ! Les futures recommandations seront adaptées.' : '👎 Merci ! Nous allons améliorer les suggestions.');
      logger.info('✅ Feedback submitted', { playlistId, rating }, 'AUTOMIX');

    } catch (error) {
      logger.error('❌ Feedback submission failed', error as Error, 'AUTOMIX');
      toast.error('Erreur lors de l\'envoi du feedback');
    }
  }, [user, context, fetchContext]);

  /**
   * Mettre à jour le résumé de feedback dans les préférences utilisateur
   */
  const updateFeedbackSummary = async (rating: -1 | 1, contextSnapshot: any) => {
    if (!user) return;

    try {
      const { data: prefs } = await supabase
        .from('user_context_preferences')
        .select('feedback_summary')
        .eq('user_id', user.id)
        .single();

      const summary = prefs?.feedback_summary || {
        total_likes: 0,
        total_dislikes: 0,
        preferred_moods: [],
        avoided_moods: [],
        preferred_tempos: [],
        weather_correlations: {}
      };

      // Mise à jour progressive
      if (rating === 1) {
        summary.total_likes += 1;
        if (!summary.preferred_moods.includes(contextSnapshot.recommendedMood)) {
          summary.preferred_moods.push(contextSnapshot.recommendedMood);
        }
        if (!summary.preferred_tempos.includes(contextSnapshot.recommendedTempo)) {
          summary.preferred_tempos.push(contextSnapshot.recommendedTempo);
        }
      } else {
        summary.total_dislikes += 1;
        if (!summary.avoided_moods.includes(contextSnapshot.recommendedMood)) {
          summary.avoided_moods.push(contextSnapshot.recommendedMood);
        }
      }

      // Corrélation météo
      const weatherKey = contextSnapshot.weatherContext;
      if (!summary.weather_correlations[weatherKey]) {
        summary.weather_correlations[weatherKey] = { likes: 0, dislikes: 0 };
      }
      rating === 1 
        ? summary.weather_correlations[weatherKey].likes += 1
        : summary.weather_correlations[weatherKey].dislikes += 1;

      await supabase
        .from('user_context_preferences')
        .upsert({
          user_id: user.id,
          feedback_summary: summary,
          updated_at: new Date().toISOString()
        });

    } catch (error) {
      logger.error('❌ Feedback summary update failed', error as Error, 'AUTOMIX');
    }
  };

  useEffect(() => {
    if (user) {
      fetchContext();
      loadActivePlaylist();
    }
  }, [user, fetchContext, loadActivePlaylist]);

  return {
    context,
    activePlaylist,
    isGenerating,
    generateAutoMix,
    fetchContext,
    saveContextPreferences,
    loadActivePlaylist,
    submitFeedback
  };
};

/**
 * Générer une progression d'émotions pour la playlist
 */
function generateEmotionProgression(baseMood: string, count: number): string[] {
  const progressions: Record<string, string[]> = {
    energetic: ['energetic', 'motivated', 'upbeat', 'energetic', 'powerful', 'motivated', 'energetic'],
    calm: ['calm', 'peaceful', 'serene', 'calm', 'tranquil', 'peaceful', 'calm'],
    melancholic: ['melancholic', 'reflective', 'hopeful', 'calm', 'peaceful', 'serene', 'calm'],
    relaxing: ['calm', 'soothing', 'peaceful', 'tranquil', 'serene', 'calm', 'peaceful']
  };

  const progression = progressions[baseMood] || progressions.calm;
  return progression.slice(0, count);
}

/**
 * Calculer le tempo adapté pour chaque track
 */
function calculateTempo(baseTempo: number, index: number, total: number): number {
  // Variation progressive du tempo
  const variation = Math.sin((index / total) * Math.PI) * 10;
  return Math.round(baseTempo + variation);
}
