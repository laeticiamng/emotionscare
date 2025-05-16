
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams, MusicContextType } from '@/types/music';

// Créer le context
export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  isMuted: false,
  muted: false,
  currentTime: 0,
  duration: 0,
  recommendations: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  openDrawer: false,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  loadPlaylistForEmotion: async () => null,
});

// Hook pour utiliser le context
export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

// Provider component
export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Initialize music system
    setIsInitialized(true);
  }, []);

  const initializeMusicSystem = async (): Promise<void> => {
    setIsInitialized(true);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else {
      // Loop to the first track
      playTrack(playlist.tracks[0]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const emotion = typeof params === 'string' ? params : params.emotion;
      const intensity = typeof params === 'object' ? params.intensity : 0.5;
      
      console.log(`Loading playlist for emotion: ${emotion} with intensity: ${intensity}`);
      
      // Simuler le chargement d'une playlist
      const mockTracks: MusicTrack[] = [
        {
          id: '1',
          title: 'Calm Waters',
          artist: 'Ambient Sounds',
          duration: 180,
          url: '/sounds/ambient-calm.mp3',
          coverUrl: '/images/calm-cover.jpg',
          emotion: 'calm'
        },
        {
          id: '2',
          title: 'Morning Energy',
          artist: 'Positive Vibes',
          duration: 210,
          url: '/sounds/morning-energy.mp3',
          coverUrl: '/images/energy-cover.jpg',
          emotion: 'happy'
        }
      ];
      
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotion}`,
        name: `${emotion} Playlist`,
        title: `${emotion} Music`,
        emotion: emotion,
        tracks: mockTracks.filter(track => 
          track.emotion === emotion || !track.emotion
        )
      };
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRecommendations(mockTracks);
      setPlaylist(mockPlaylist);
      if (mockPlaylist.tracks.length > 0) {
        setCurrentTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error loading playlist');
      setError(error);
      console.error('Error loading playlist:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        playlist,
        isPlaying,
        volume,
        isMuted,
        muted: isMuted,
        currentTime,
        duration,
        recommendations,
        isLoading,
        error,
        isInitialized,
        openDrawer,
        emotion,
        initializeMusicSystem,
        playTrack,
        pauseTrack,
        resumeTrack,
        togglePlay,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        seekTo,
        loadPlaylistForEmotion,
        setEmotion,
        setOpenDrawer
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
