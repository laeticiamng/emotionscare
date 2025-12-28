/**
 * useMusicRecommendation - Hook avec types corrects
 * Accès aux recommandations basées sur les émotions
 */

import { useEffect, useState, useCallback } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { useToast } from '@/hooks/use-toast';
import type { MusicTrack, MusicPlaylist } from '@/types/music';

export const EMOTION_TO_MUSIC: Record<string, string> = {
  joy: 'upbeat',
  calm: 'ambient',
  anxious: 'calming',
  sad: 'gentle',
  happy: 'energetic',
  focused: 'concentration',
  relaxed: 'chill',
  energetic: 'upbeat',
  melancholic: 'soothing',
};

export interface MusicHookOptions {
  autoActivate?: boolean;
  defaultEmotion?: string;
}

export function useMusicRecommendation(options: MusicHookOptions = {}) {
  const { autoActivate = false, defaultEmotion } = options;
  const { play, state } = useMusic();
  const { toast } = useToast();

  const [recommendedTracks, setRecommendedTracks] = useState<MusicTrack[]>([]);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRecommendations = useCallback(async (emotion: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const mapped = EMOTION_TO_MUSIC[emotion] || emotion;
      // Use demo tracks based on emotion (archive.org - CORS OK)
      const archiveUrls = [
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Waltz_of_the_Flowers_-_Tchaikovsky.mp3',
        'https://ia800905.us.archive.org/19/items/FREE_background_music_dridge/Kevin_MacLeod_-_Gymnopedie_No_1.mp3',
      ];
      const demoTracks: MusicTrack[] = [
        {
          id: `rec-${emotion}-1`,
          title: `${mapped} Track 1`,
          artist: 'Emotion Music',
          url: archiveUrls[0],
          audioUrl: archiveUrls[0],
          duration: 180,
          emotion: mapped,
          mood: emotion
        },
        {
          id: `rec-${emotion}-2`,
          title: `${mapped} Track 2`,
          artist: 'Mood Sounds',
          url: archiveUrls[1],
          audioUrl: archiveUrls[1],
          duration: 200,
          emotion: mapped,
          mood: emotion
        }
      ];
      
      const pl: MusicPlaylist = {
        id: `playlist-${emotion}`,
        name: `${emotion} Playlist`,
        tracks: demoTracks
      };
      
      setPlaylist(pl);
      setRecommendedTracks(demoTracks);
    } catch (err) {
      setError(err as Error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playRecommendedTrack = useCallback((track: MusicTrack) => {
    play(track);
    toast({
      title: 'Lecture en cours',
      description: `${track.title} - ${track.artist}`,
      duration: 2000,
    });
  }, [play, toast]);

  const playFirstRecommendation = useCallback(() => {
    if (!playlist || playlist.tracks.length === 0) return false;
    playRecommendedTrack(playlist.tracks[0]);
    return true;
  }, [playlist, playRecommendedTrack]);

  useEffect(() => {
    if (autoActivate && defaultEmotion) {
      loadRecommendations(defaultEmotion);
    }
  }, [autoActivate, defaultEmotion, loadRecommendations]);

  return {
    recommendedTracks,
    playlist,
    isLoading,
    error,
    loadRecommendations,
    playRecommendedTrack,
    playFirstRecommendation,
    EMOTION_TO_MUSIC,
  };
}

export default useMusicRecommendation;
