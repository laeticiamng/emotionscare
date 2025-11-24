import { useCallback } from 'react';
import { useMusicCompat } from '@/hooks/useMusicCompat';
import { useSoundscape } from '@/providers/SoundscapeProvider';
import { EmotionMusicParams, MusicPlaylist, MusicTrack } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export const useMusicEmotionIntegration = () => {
  const music = useMusicCompat();
  const { generateMusicForEmotion, setPlaylist, play, getEmotionMusicDescription } = music;
  const { isGenerating, generationProgress, emotionTarget, therapeuticMode } = music.state;
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

  // Recherche de tracks existants par émotion
  const searchExistingTracks = useCallback(async (emotion: string): Promise<MusicTrack[]> => {
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .or(`emotion.eq.${emotion},tags.ilike.%${emotion}%`)
        .limit(10);

      if (error) throw error;

      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.audio_url,
        audioUrl: track.audio_url,
        duration: track.duration || 120,
        emotion: track.emotion,
        mood: track.mood,
        coverUrl: track.cover_url,
        tags: track.tags,
        bpm: track.bpm,
        key: track.key,
        energy: track.energy
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
        'calm': ['ambient', 'classical', 'meditation'],
        'energetic': ['upbeat', 'electronic', 'pop'],
        'sad': ['melancholic', 'acoustic', 'slow'],
        'happy': ['uplifting', 'major key', 'bright'],
        'focused': ['instrumental', 'minimal', 'concentration'],
        'stressed': ['relaxing', 'nature sounds', 'breathing'],
        'creative': ['inspiring', 'artistic', 'experimental'],
        'tired': ['gentle', 'soft', 'recovery']
      };

      const styles = emotionStyleMap[emotion.toLowerCase()] || ['ambient'];
      
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .or(styles.map(style => `tags.ilike.%${style}%`).join(','))
        .limit(15)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        url: track.audio_url,
        audioUrl: track.audio_url,
        duration: track.duration || 120,
        emotion: track.emotion,
        mood: track.mood,
        coverUrl: track.cover_url,
        tags: track.tags,
        bpm: track.bpm,
        key: track.key,
        energy: track.energy
      }));
    } catch (error) {
      logger.error('Erreur recommandations musique', error as Error, 'MUSIC');
      return [];
    }
  }, []);

  // Analyse de l'impact émotionnel de la musique
  const analyzeMusicImpact = useCallback(async (trackId: string, userFeedback: 'positive' | 'negative' | 'neutral') => {
    try {
      const { error } = await supabase
        .from('music_feedback')
        .insert({
          track_id: trackId,
          user_feedback: userFeedback,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      // Mettre à jour les statistiques du track
      await supabase.rpc('update_track_stats', {
        track_id: trackId,
        feedback: userFeedback
      });

    } catch (error) {
      logger.error('Erreur analyse impact', error as Error, 'ANALYTICS');
    }
  }, []);

  return {
    activateMusicForEmotion,
    searchExistingTracks,
    getMusicRecommendations,
    analyzeMusicImpact,
    getEmotionMusicDescription,
    isGenerating,
    generationProgress,
    currentEmotion: emotionTarget,
    therapeuticMode
  };
};