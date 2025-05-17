
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams, MusicContextType } from '@/types/music';

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  isInitialized: false,
  openDrawer: false,
  emotion: null,
  togglePlay: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  setOpenDrawer: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  playlist: null,
  recommendations: [],
  isLoading: false,
  error: null,
});

export const useMusicContext = () => useContext(MusicContext);
export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  useEffect(() => {
    // Initialize music system
    setIsInitialized(true);
  }, []);

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
    console.log('Next track');
    // Implement track navigation logic here
  };

  const previousTrack = () => {
    console.log('Previous track');
    // Implement track navigation logic here
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const loadPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks && playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0]);
    }
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      console.log(`Loading playlist for emotion: ${typeof params === 'string' ? params : params.emotion}`);
      
      // Simulate loading a playlist
      const emotion = typeof params === 'string' ? params : params.emotion;
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotion}`,
        title: `${emotion} Playlist`,
        name: `${emotion} Playlist`,
        emotion: emotion,
        tracks: [
          {
            id: '1',
            title: 'Calm Waters',
            artist: 'Ambient Sounds',
            duration: 180,
            url: '/sounds/ambient-calm.mp3',
            emotion: 'calm'
          },
          {
            id: '2',
            title: 'Morning Energy',
            artist: 'Positive Vibes',
            duration: 210,
            url: '/sounds/welcome.mp3',
            emotion: 'happy'
          }
        ]
      };
      
      setCurrentPlaylist(mockPlaylist);
      setRecommendations(mockPlaylist.tracks);
      
      if (mockPlaylist.tracks.length > 0) {
        setCurrentTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      setError(error instanceof Error ? error : new Error('Failed to load playlist'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const recommendByEmotion = (emotion: string, intensity?: number): MusicPlaylist => {
    const mockPlaylist: MusicPlaylist = {
      id: `rec-${emotion}`,
      name: `${emotion} Recommendations`,
      emotion: emotion,
      tracks: [
        {
          id: `${emotion}-1`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Track 1`,
          artist: 'AI Music',
          duration: 180,
          url: '/sounds/sample.mp3'
        },
        {
          id: `${emotion}-2`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Track 2`,
          artist: 'AI Music',
          duration: 210,
          url: '/sounds/sample2.mp3'
        }
      ]
    };
    
    return mockPlaylist;
  };

  const playSimilar = (mood?: string) => {
    const targetMood = mood || (currentTrack?.emotion || 'calm');
    const playlist = recommendByEmotion(targetMood);
    loadPlaylist(playlist);
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        currentPlaylist,
        isPlaying,
        volume,
        muted,
        currentTime,
        duration,
        isInitialized,
        openDrawer,
        emotion,
        togglePlay,
        playTrack,
        pauseTrack,
        resumeTrack,
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        seekTo,
        setOpenDrawer,
        setEmotion,
        loadPlaylistForEmotion,
        playlist: currentPlaylist,
        recommendations,
        isLoading,
        error,
        queue,
        isShuffled,
        isRepeating,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        clearQueue,
        loadPlaylist,
        recommendByEmotion,
        playSimilar
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
