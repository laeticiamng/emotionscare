import { useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import type { EmotionMusicParams, MusicPlaylist, MusicTrack } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const useMusicEmotionIntegration = () => {
  const { state, generateMusicForEmotion, setPlaylist, play: _play, getEmotionMusicDescription: _getEmotionMusicDescription } = useMusic();
  const { updateSoundscapeForEmotion } = useSoundscape();

  // Activation de la musique basée sur l'émotion
  const activateMusicForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const { emotion, intensity = 0.5, duration = 120, instrumental = true, style } = params;

      // Rechercher d'abord dans la bibliothèque existante
      const existingTracks = await searchExistingTracks(emotion);
      
      if (existingTracks.length > 0) {
        const playlist: MusicPlaylist = {
          id: `emotion-${emotion}-${Date.now()}`,
          name: `Playlist ${emotion}`,
          tracks: existingTracks,
          description: `Musique adaptée à votre état émotionnel: ${emotion}`,
          tags: [emotion, 'therapeutic'],
          isTherapeutic: true,
          targetEmotion: emotion,
          duration: existingTracks.reduce((total, track) => total + track.duration, 0)
        };

        setPlaylist(existingTracks);
        
        // Mettre à jour le paysage sonore
        if (updateSoundscapeForEmotion) {
          updateSoundscapeForEmotion(emotion);
        }
        
        toast.success(`Playlist ${emotion} activée`);
        return playlist;
      }

      // Si pas de tracks existants, générer avec Suno
      const generatedTrack = await generateMusicForEmotion(emotion, style);
      
      if (generatedTrack) {
        const playlist: MusicPlaylist = {
          id: `generated-${emotion}-${Date.now()}`,
          name: `Musique générée - ${emotion}`,
          tracks: [generatedTrack],
          description: `Musique thérapeutique générée pour votre état: ${emotion}`,
          tags: [emotion, 'generated', 'therapeutic'],
          isTherapeutic: true,
          targetEmotion: emotion,
          duration: generatedTrack.duration
        };

        setPlaylist([generatedTrack]);
        
        // Mettre à jour le paysage sonore
        if (updateSoundscapeForEmotion) {
          updateSoundscapeForEmotion(emotion);
        }
        
        return playlist;
      }

      return null;
    } catch (error) {
      logger.error('Erreur activation musique émotion', error as Error, 'MUSIC');
      toast.error('Impossible d\'activer la musique pour cette émotion');
      return null;
    }
  }, [generateMusicForEmotion, setPlaylist, updateSoundscapeForEmotion]);

  // Recherche de tracks existants par émotion (utilise generated_music_tracks)
  const searchExistingTracks = useCallback(async (emotion: string): Promise<MusicTrack[]> => {
    try {
      const { data, error } = await supabase
        .from('generated_music_tracks')
        .select('*')
        .or(`emotion.ilike.%${emotion}%,prompt.ilike.%${emotion}%`)
        .eq('generation_status', 'completed')
        .limit(10);

      if (error) throw error;

      return (data || []).map(track => ({
        id: track.id,
        title: track.title || 'Morceau généré',
        artist: 'Suno AI',
        url: track.audio_url,
        audioUrl: track.audio_url,
        duration: track.duration ? Number(track.duration) : 120,
        emotion: track.emotion,
        mood: track.emotion,
        coverUrl: track.image_url,
        tags: track.emotion || ''
      }));
    } catch (error) {
      logger.error('Erreur recherche tracks', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  // Suggestions de musique basées sur l'émotion
  const getMusicRecommendations = useCallback(async (emotion: string): Promise<MusicTrack[]> => {
    try {
      // Mapping émotions vers styles musicaux
      const emotionStyleMap: Record<string, string[]> = {
        'calm': ['calm', 'peaceful', 'serene', 'relaxing'],
        'energetic': ['energetic', 'upbeat', 'dynamic', 'energy'],
        'sad': ['sad', 'melancholic', 'healing', 'emotional'],
        'happy': ['happy', 'joyful', 'uplifting', 'positive'],
        'focused': ['focus', 'concentration', 'flow', 'productive'],
        'stressed': ['relaxing', 'calming', 'peaceful', 'zen'],
        'creative': ['creative', 'inspiring', 'artistic', 'flow'],
        'tired': ['gentle', 'soft', 'recovery', 'calm']
      };

      const emotions = emotionStyleMap[emotion.toLowerCase()] || [emotion];
      
      // Utiliser generated_music_tracks au lieu de music_tracks
      const { data, error } = await supabase
        .from('generated_music_tracks')
        .select('*')
        .or(emotions.map(e => `emotion.ilike.%${e}%`).join(','))
        .eq('generation_status', 'completed')
        .limit(15)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(track => ({
        id: track.id,
        title: track.title || 'Morceau généré',
        artist: 'Suno AI',
        url: track.audio_url,
        audioUrl: track.audio_url,
        duration: track.duration ? Number(track.duration) : 120,
        emotion: track.emotion,
        mood: track.emotion,
        coverUrl: track.image_url,
        tags: track.emotion || ''
      }));
    } catch (error) {
      logger.error('Erreur recommandations musique', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  // Analyse de l'impact émotionnel de la musique (version simplifiée)
  const analyzeMusicImpact = useCallback(async (trackId: string, userFeedback: 'positive' | 'negative' | 'neutral') => {
    try {
      // Log le feedback dans music_track_feedback
      const { error } = await supabase
        .from('music_track_feedback')
        .insert({
          track_id: trackId,
          feedback_type: userFeedback,
          created_at: new Date().toISOString()
        });

      if (error) {
        logger.warn('Could not save music feedback', 'MUSIC');
      }
    } catch (error) {
      logger.error('Erreur analyse impact', error as Error, 'ANALYTICS');
    }
  }, []);

  // Alias for compatibility with MusicRecommendation component
  const playEmotion = useCallback(async (emotion: string) => {
    return activateMusicForEmotion({ emotion, intensity: 0.5, duration: 120 });
  }, [activateMusicForEmotion]);

  // Get description for emotion music
  const getEmotionDescription = useCallback((emotion: string): string => {
    const descriptions: Record<string, string> = {
      joie: 'Musique joyeuse et entraînante pour célébrer votre bonne humeur',
      calme: 'Sons apaisants et mélodies douces pour maintenir votre sérénité',
      tristesse: 'Musique réconfortante pour accompagner et transformer votre émotion',
      colère: 'Rythmes libérateurs pour canaliser votre énergie',
      anxiété: 'Compositions relaxantes pour apaiser votre esprit',
      sérénité: 'Ambiances zen et harmonieuses pour prolonger votre bien-être',
      stress: 'Musique déstressante avec fréquences apaisantes',
      fatigue: 'Mélodies énergisantes douces pour vous revitaliser',
      focus: 'Sons de concentration pour améliorer votre productivité',
      créatif: 'Musique inspirante pour stimuler votre créativité'
    };
    return descriptions[emotion.toLowerCase()] || `Musique adaptée à votre état : ${emotion}`;
  }, []);

  return {
    activateMusicForEmotion,
    searchExistingTracks,
    getMusicRecommendations,
    analyzeMusicImpact,
    getEmotionMusicDescription: getEmotionDescription,
    // Aliases for component compatibility
    playEmotion,
    isLoading: state.isGenerating,
    isGenerating: state.isGenerating,
    generationProgress: state.generationProgress,
    currentEmotion: state.emotionTarget,
    therapeuticMode: state.therapeuticMode
  };
};