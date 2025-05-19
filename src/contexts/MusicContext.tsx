
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { convertToMusicTrack, convertToMusicPlaylist, convertToTrack, convertToPlaylist } from '@/utils/musicCompatibility';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
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
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // Si c'est le dernier morceau, on revient au premier
      playTrack(playlist.tracks[0]);
    } else {
      // Sinon on passe au suivant
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // Si c'est le premier morceau, on va au dernier
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      // Sinon on revient au précédent
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const setPlaylist = (newPlaylist: MusicPlaylist) => {
    setPlaylistState(newPlaylist);
    if (newPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(newPlaylist.tracks[0]);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue([...queue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const loadPlaylist = (playlist: MusicPlaylist) => {
    setPlaylistState(playlist);
    if (playlist.tracks.length > 0) {
      setCurrentTrack(playlist.tracks[0]);
    }
  };

  const shufflePlaylist = () => {
    if (!playlist) return;
    
    const shuffled = [...playlist.tracks].sort(() => Math.random() - 0.5);
    const shuffledPlaylist = {
      ...playlist,
      tracks: shuffled
    };
    
    setPlaylistState(shuffledPlaylist);
  };

  // Fonction simulée pour charger une playlist basée sur l'émotion
  const loadPlaylistForEmotion = async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // Ici, on simule un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Pour l'instant, on retourne un mock
      const mockPlaylist: MusicPlaylist = {
        id: 'emotion-playlist',
        name: typeof emotion === 'string' ? `${emotion} Music` : `${emotion.emotion} Music`,
        title: typeof emotion === 'string' ? `${emotion} Music` : `${emotion.emotion} Music`,
        description: 'Generated playlist based on your emotion',
        tracks: [
          {
            id: 'track1',
            title: 'Relaxing Song',
            name: 'Relaxing Song',
            artist: 'Ambient Artist',
            duration: 180,
            url: 'https://example.com/audio1.mp3',
            audioUrl: 'https://example.com/audio1.mp3',
            cover: 'https://example.com/cover1.jpg',
            coverUrl: 'https://example.com/cover1.jpg',
          },
          {
            id: 'track2',
            title: 'Calming Tune',
            name: 'Calming Tune',
            artist: 'Relaxation Master',
            duration: 240,
            url: 'https://example.com/audio2.mp3',
            audioUrl: 'https://example.com/audio2.mp3',
            cover: 'https://example.com/cover2.jpg',
            coverUrl: 'https://example.com/cover2.jpg',
          }
        ],
      };
      
      setPlaylistState(mockPlaylist);
      if (mockPlaylist.tracks.length > 0) {
        setCurrentTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    }
  };

  // Alias pour la compatibilité
  const getRecommendationByEmotion = loadPlaylistForEmotion;
  
  // Simuler la génération de musique
  const generateMusic = async (params: any): Promise<MusicTrack | null> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: 'Generated Song',
        name: 'Generated Song',
        artist: 'AI Composer',
        duration: 200,
        url: 'https://example.com/generated.mp3',
        audioUrl: 'https://example.com/generated.mp3',
        cover: 'https://example.com/cover-gen.jpg',
        coverUrl: 'https://example.com/cover-gen.jpg',
      };
      
      setCurrentTrack(mockTrack);
      return mockTrack;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return null;
    }
  };
  
  // Fonction pour trouver des pistes par humeur
  const findTracksByMood = (mood: string): MusicTrack[] => {
    // Simuler la recherche par humeur
    return [
      {
        id: 'mood-track1',
        title: `${mood} Melody`,
        name: `${mood} Melody`,
        artist: 'Mood Master',
        duration: 210,
        url: 'https://example.com/mood1.mp3',
        audioUrl: 'https://example.com/mood1.mp3',
        cover: 'https://example.com/mood-cover1.jpg',
        coverUrl: 'https://example.com/mood-cover1.jpg',
      }
    ];
  };
  
  // Fonction pour définir l'émotion actuelle
  const setEmotion = (emotion: string) => {
    console.log(`Setting emotion to: ${emotion}`);
    // Cette fonction pourrait mettre à jour l'état ou déclencher d'autres actions
  };

  const value: MusicContextType = {
    isPlaying,
    currentTrack,
    isInitialized,
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    playlists,
    currentPlaylist: playlist,
    loadPlaylistForEmotion,
    queue,
    addToQueue,
    clearQueue,
    loadPlaylist,
    shufflePlaylist,
    setOpenDrawer,
    openDrawer,
    error,
    seekTo,
    isShuffled,
    isRepeating,
    toggleShuffle,
    toggleRepeat,
    duration,
    currentTime,
    // Alias et fonctions supplémentaires pour compatibilité
    getRecommendationByEmotion,
    setPlaylist,
    setCurrentTrack,
    findTracksByMood,
    toggleDrawer,
    toggleMute,
    muted,
    generateMusic,
    setEmotion,
    playlist
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
