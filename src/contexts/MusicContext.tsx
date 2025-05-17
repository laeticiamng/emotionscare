
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  isInitialized: boolean;
  openDrawer: boolean;
  emotion: string | null;
  togglePlay: () => void;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  setOpenDrawer: (isOpen: boolean) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
}

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

  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
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
      if (mockPlaylist.tracks.length > 0) {
        setCurrentTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      return null;
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
        nextTrack,
        previousTrack,
        setVolume,
        toggleMute,
        seekTo,
        setOpenDrawer,
        setEmotion,
        loadPlaylistForEmotion
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
