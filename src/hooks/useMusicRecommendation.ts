import { useState, useEffect, useCallback, useContext } from 'react';
import { MusicPlaylist, MusicTrack } from '@/types';
import { MusicContext } from '@/contexts/MusicContext';

interface UseMusicRecommendationProps {
  emotion?: string;
}

const useMusicRecommendation = ({ emotion }: UseMusicRecommendationProps = {}) => {
  const { 
    currentPlaylist, 
    setCurrentPlaylist,
    currentTrack,
    setCurrentTrack,
    isPlaying,
    setIsPlaying,
    setOpenDrawer
  } = useContext(MusicContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaylist = useCallback(async (musicType: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mocked response for demonstration
      const mockedPlaylists: Record<string, MusicPlaylist> = {
        happy: {
          id: 'happy-1',
          name: 'Happy Hits',
          emotion: 'happy',
          tracks: [
            { id: 'h1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', duration: 180, url: '/music/sunshine.mp3' },
            { id: 'h2', title: 'Happy', artist: 'Pharrell Williams', duration: 240, url: '/music/happy.mp3' },
          ],
        },
        calm: {
          id: 'calm-1',
          name: 'Calm Vibes',
          emotion: 'calm',
          tracks: [
            { id: 'c1', title: 'Weightless', artist: 'Marconi Union', duration: 300, url: '/music/weightless.mp3' },
            { id: 'c2', title: 'Watermark', artist: 'Enya', duration: 270, url: '/music/watermark.mp3' },
          ],
        },
        focused: {
          id: 'focused-1',
          name: 'Focus Flow',
          emotion: 'focused',
          tracks: [
            { id: 'f1', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', duration: 210, url: '/music/nuvole.mp3' },
            { id: 'f2', title: 'Gymnopédie No.1', artist: 'Erik Satie', duration: 200, url: '/music/gymnopédie.mp3' },
          ],
        },
        energetic: {
          id: 'energetic-1',
          name: 'Energy Boost',
          emotion: 'energetic',
          tracks: [
            { id: 'e1', title: 'September', artist: 'Earth, Wind & Fire', duration: 220, url: '/music/september.mp3' },
            { id: 'e2', title: 'Don\'t Stop Me Now', artist: 'Queen', duration: 250, url: '/music/dontstop.mp3' },
          ],
        },
        neutral: {
          id: 'neutral-1',
          name: 'Mellow Mix',
          emotion: 'neutral',
          tracks: [
            { id: 'n1', title: 'Kiss the Rain', artist: 'Yiruma', duration: 230, url: '/music/kisstherain.mp3' },
            { id: 'n2', title: 'Clair de Lune', artist: 'Claude Debussy', duration: 260, url: '/music/clairdelune.mp3' },
          ],
        },
      };

      const playlist = mockedPlaylists[musicType];

      if (playlist) {
        setCurrentPlaylist(playlist);
        setCurrentTrack(playlist.tracks[0]);
      } else {
        setError(`No playlist found for emotion: ${musicType}`);
      }
    } catch (err) {
      setError(`Failed to fetch playlist for emotion: ${musicType}`);
    } finally {
      setLoading(false);
    }
  }, [setCurrentPlaylist, setCurrentTrack]);

  const playTrack = (track: MusicTrack) => {
    if (currentPlaylist && currentPlaylist.tracks.find(t => t.id === track.id)) {
      setCurrentTrack(track);
      setIsPlaying(true);
    } else {
      console.warn("Track not in current playlist");
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const goToNextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
  };

  const goToPreviousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[previousIndex]);
  };

  useEffect(() => {
    if (emotion) {
      fetchPlaylist(emotion);
    }
  }, [emotion, fetchPlaylist]);

  return {
    currentPlaylist,
    currentTrack,
    isPlaying,
    loading,
    error,
    fetchPlaylist,
    playTrack,
    togglePlay,
    goToNextTrack,
    goToPreviousTrack,
  };
};

export default useMusicRecommendation;
