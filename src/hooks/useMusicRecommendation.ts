import { useEffect, useState } from 'react';
import { useMusic, Track, MusicPlaylist } from '@/contexts/MusicContext';
import { useToast } from '@/hooks/use-toast';

export const EMOTION_TO_MUSIC: Record<string, string> = {
  joy: 'upbeat',
  calm: 'ambient',
  anxious: 'calming',
  sad: 'gentle',
};

interface Options {
  autoActivate?: boolean;
  defaultEmotion?: string;
}

export function useMusicRecommendation(options: Options = {}) {
  const { autoActivate = false, defaultEmotion } = options;
  const music = useMusic();
  const { toast } = useToast();

  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadRecommendations = async (emotion: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const mapped = EMOTION_TO_MUSIC[emotion] || emotion;
      const pl = await music.loadPlaylistForEmotion({ emotion: mapped, intensity: 0.5 });
      if (pl) {
        setPlaylist(pl);
        music.setPlaylist(pl.tracks);
        setRecommendedTracks(pl.tracks);
      } else {
        setRecommendedTracks([]);
      }
    } catch (err) {
      setError(err as Error);
      setRecommendedTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const playRecommendedTrack = (track: Track) => {
    music.play(track);
    toast({
      title: 'Lecture en cours',
      description: `${track.title} - ${track.artist}`,
      duration: 2000,
    });
  };

  const playFirstRecommendation = () => {
    if (!playlist || playlist.tracks.length === 0) return false;
    playRecommendedTrack(playlist.tracks[0]);
    return true;
  };

  useEffect(() => {
    if (autoActivate && defaultEmotion) {
      loadRecommendations(defaultEmotion);
    }
  }, []);

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
