
import React, { createContext, useState, useContext, useCallback } from 'react';
import { Track, Playlist, EmotionMusicParams } from './types';

// Mock data for playlists
const MOCK_PLAYLISTS: Record<string, Playlist> = {
  calm: {
    id: 'playlist-calm',
    name: 'Calme et détente',
    emotion: 'calm',
    tracks: [
      { id: 'track-1', title: 'Peaceful Morning', artist: 'Nature Sounds', url: '/assets/audio/peaceful-morning.mp3', duration: 180, emotion: 'calm' },
      { id: 'track-2', title: 'Ocean Waves', artist: 'Relaxation', url: '/assets/audio/ocean-waves.mp3', duration: 240, emotion: 'calm' },
      { id: 'track-3', title: 'Meditation', artist: 'Zen Garden', url: '/assets/audio/meditation.mp3', duration: 300, emotion: 'calm' }
    ]
  },
  happy: {
    id: 'playlist-happy',
    name: 'Bonne humeur',
    emotion: 'happy',
    tracks: [
      { id: 'track-4', title: 'Sunny Day', artist: 'Happy Tunes', url: '/assets/audio/sunny-day.mp3', duration: 180, emotion: 'happy' },
      { id: 'track-5', title: 'Dancing Joy', artist: 'Feel Good', url: '/assets/audio/dancing-joy.mp3', duration: 210, emotion: 'happy' },
      { id: 'track-6', title: 'Celebration', artist: 'Party Time', url: '/assets/audio/celebration.mp3', duration: 240, emotion: 'happy' }
    ]
  },
  focus: {
    id: 'playlist-focus',
    name: 'Concentration',
    emotion: 'focus',
    tracks: [
      { id: 'track-7', title: 'Deep Work', artist: 'Productivity', url: '/assets/audio/deep-work.mp3', duration: 300, emotion: 'focus' },
      { id: 'track-8', title: 'Flow State', artist: 'Mind Masters', url: '/assets/audio/flow-state.mp3', duration: 360, emotion: 'focus' },
      { id: 'track-9', title: 'Clarity', artist: 'Brain Waves', url: '/assets/audio/clarity.mp3', duration: 270, emotion: 'focus' }
    ]
  },
  sad: {
    id: 'playlist-sad',
    name: 'Mélancolie',
    emotion: 'sad',
    tracks: [
      { id: 'track-10', title: 'Rainy Day', artist: 'Melancholy', url: '/assets/audio/rainy-day.mp3', duration: 240, emotion: 'sad' },
      { id: 'track-11', title: 'Blue Mood', artist: 'Soul Touch', url: '/assets/audio/blue-mood.mp3', duration: 300, emotion: 'sad' },
      { id: 'track-12', title: 'Reflections', artist: 'Deep Thoughts', url: '/assets/audio/reflections.mp3', duration: 270, emotion: 'sad' }
    ]
  },
  anxious: {
    id: 'playlist-anxious',
    name: 'Apaisement',
    emotion: 'anxious',
    tracks: [
      { id: 'track-13', title: 'Calming Breeze', artist: 'Anxiety Relief', url: '/assets/audio/calming-breeze.mp3', duration: 300, emotion: 'anxious' },
      { id: 'track-14', title: 'Safe Haven', artist: 'Comfort Zone', url: '/assets/audio/safe-haven.mp3', duration: 330, emotion: 'anxious' },
      { id: 'track-15', title: 'Letting Go', artist: 'Peace Within', url: '/assets/audio/letting-go.mp3', duration: 270, emotion: 'anxious' }
    ]
  },
  neutral: {
    id: 'playlist-neutral',
    name: 'Équilibre',
    emotion: 'neutral',
    tracks: [
      { id: 'track-16', title: 'Balanced Mind', artist: 'Harmony', url: '/assets/audio/balanced-mind.mp3', duration: 240, emotion: 'neutral' },
      { id: 'track-17', title: 'Middle Path', artist: 'Zen Flow', url: '/assets/audio/middle-path.mp3', duration: 270, emotion: 'neutral' },
      { id: 'track-18', title: 'Centered', artist: 'Equilibrium', url: '/assets/audio/centered.mp3', duration: 300, emotion: 'neutral' }
    ]
  }
};

export interface MusicContextType {
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  openDrawer: boolean;
  currentEmotion: string | null;
  loadPlaylistForEmotion: (emotion: string | EmotionMusicParams) => Promise<Playlist | null>;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string) => void;
  adjustVolume: (amount: number) => void;
}

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  volume: 0.5,
  isMuted: false,
  openDrawer: false,
  currentEmotion: null,
  loadPlaylistForEmotion: async () => null,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  setOpenDrawer: () => {},
  setEmotion: () => {},
  adjustVolume: () => {}
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);

  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = useCallback(async (emotionParam: string | EmotionMusicParams): Promise<Playlist | null> => {
    // Extraction de l'émotion à partir du paramètre
    const emotion = typeof emotionParam === 'string' ? emotionParam : emotionParam.emotion;
    
    // Recherche de la playlist correspondante
    const playlist = MOCK_PLAYLISTS[emotion.toLowerCase()] || MOCK_PLAYLISTS.neutral;
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      setCurrentEmotion(emotion);
      
      // Si aucune piste n'est en cours de lecture, on charge la première piste
      if (!currentTrack && playlist.tracks.length > 0) {
        setCurrentTrack(playlist.tracks[0]);
      }
      
      return playlist;
    }
    
    return null;
  }, [currentTrack]);

  // Jouer une piste
  const playTrack = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  // Mettre en pause
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Basculer lecture/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Piste suivante
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
  }, [currentPlaylist, currentTrack]);

  // Piste précédente
  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentPlaylist, currentTrack]);

  // Activer/désactiver le son
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Définir l'émotion
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);
  
  // Ajuster le volume
  const adjustVolume = useCallback((amount: number) => {
    setVolume(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + amount));
      return newVolume;
    });
  }, []);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      currentPlaylist,
      isPlaying,
      volume,
      isMuted,
      openDrawer,
      currentEmotion,
      loadPlaylistForEmotion,
      playTrack,
      pauseTrack,
      togglePlay,
      nextTrack,
      previousTrack,
      setVolume,
      toggleMute,
      setOpenDrawer,
      setEmotion,
      adjustVolume
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};
