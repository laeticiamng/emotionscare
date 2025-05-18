
import { useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface UseMusicServiceReturn {
  tracks: MusicTrack[];
  playlists: MusicPlaylist[];
  loading: boolean;
  error: Error | null;
}

export function useMusicService(): UseMusicServiceReturn {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMusicData = async () => {
      try {
        setLoading(true);
        // Simuler un appel API - dans une vraie application, ceci serait un fetch()
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Données fictives
        const mockTracks: MusicTrack[] = [
          {
            id: '1',
            title: 'Calm Water',
            artist: 'Nature Sounds',
            duration: 184,
            audioUrl: '/audio/calm-water.mp3',
            url: '/audio/calm-water.mp3',
            coverUrl: '/images/covers/calm-water.jpg',
            category: 'relaxation',
            emotion: 'calm'
          },
          {
            id: '2',
            title: 'Deep Focus',
            artist: 'Brain Waves',
            duration: 240,
            audioUrl: '/audio/deep-focus.mp3',
            url: '/audio/deep-focus.mp3',
            coverUrl: '/images/covers/deep-focus.jpg',
            category: 'concentration',
            emotion: 'focus'
          },
          {
            id: '3',
            title: 'Morning Energy',
            artist: 'Positive Vibes',
            duration: 198,
            audioUrl: '/audio/morning-energy.mp3',
            url: '/audio/morning-energy.mp3',
            coverUrl: '/images/covers/morning-energy.jpg',
            category: 'energizing',
            emotion: 'energetic'
          }
        ];

        const mockPlaylists: MusicPlaylist[] = [
          {
            id: 'pl-1',
            name: 'Relaxation',
            tracks: [mockTracks[0]],
            emotion: 'calm',
            description: 'Playlist pour se détendre'
          },
          {
            id: 'pl-2',
            name: 'Concentration',
            tracks: [mockTracks[1]],
            emotion: 'focus',
            description: 'Pour rester concentré'
          },
          {
            id: 'pl-3',
            name: 'Énergie',
            tracks: [mockTracks[2]],
            emotion: 'energetic',
            description: 'Pour démarrer la journée'
          }
        ];

        setTracks(mockTracks);
        setPlaylists(mockPlaylists);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching music data'));
        setLoading(false);
      }
    };

    fetchMusicData();
  }, []);

  return { tracks, playlists, loading, error };
}

export default useMusicService;
