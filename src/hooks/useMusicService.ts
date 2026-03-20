import { useState } from 'react';
import { MusicTrack } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';

export const useMusicService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);

  const searchTracks = async (query: string): Promise<MusicTrack[]> => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
        .limit(20);

      if (error) throw error;

      const results: MusicTrack[] = (data ?? []).map((row: any) => ({
        id: row.id,
        title: row.title,
        artist: row.artist,
        url: row.audio_url || row.url || '',
        audioUrl: row.audio_url || row.url || '',
        coverUrl: row.cover_url || '',
        duration: row.duration || 0,
        emotion: row.emotion || '',
        mood: row.mood,
        intensity: row.intensity,
        tags: row.tags || [],
        category: row.category || [],
      }));

      setTracks(results);
      return results;
    } catch {
      setTracks([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tracks,
    isLoading,
    searchTracks
  };
};
