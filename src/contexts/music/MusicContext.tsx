
import React, { createContext, useContext, useState } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

// Créer un contexte par défaut
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  muted: false,
  duration: 0,
  playTrack: () => {},
  togglePlay: () => {},
  setVolume: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {}
});

// Créer un provider pour le contexte
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialisation du système de musique
  const initializeMusicSystem = async () => {
    setIsInitialized(true);
    return true;
  };

  // Simulation de chargement d'une playlist basée sur l'émotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    // Déterminer l'émotion à partir des paramètres
    const emotion = typeof params === 'string' ? params : params.emotion;
    
    // Simulation d'une requête API
    console.log(`Loading playlist for emotion: ${emotion}`);
    
    // Attendre pour simuler une requête réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Créer une playlist factice
    const mockPlaylist: MusicPlaylist = {
      id: `playlist-${emotion}`,
      name: `${emotion} Tracks`,
      title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`,
      tracks: [
        {
          id: `track-${emotion}-1`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Melody`,
          artist: "EmotionsCare Audio",
          duration: 180,
          url: "/sounds/ambient-calm.mp3"
        },
        {
          id: `track-${emotion}-2`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Harmony`,
          artist: "EmotionsCare Audio",
          duration: 210,
          url: "/sounds/ambient-calm.mp3"
        }
      ]
    };
    
    setCurrentEmotion(emotion);
    setCurrentPlaylist(mockPlaylist);
    
    return mockPlaylist;
  };
  
  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setCurrentTime(0);
    setDuration(track.duration || 0);
  };
  
  // Pause the current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Resume playing
  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };
  
  // Stop playing
  const stopTrack = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Set volume
  const setVolume = (level: number) => {
    setVolumeState(level);
  };
  
  // Go to next track
  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // If last track or not found, play first track
      playTrack(currentPlaylist.tracks[0]);
    } else {
      // Play next track
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  };
  
  // Go to previous track
  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // If first track or not found, play last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      // Play previous track
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  };
  
  // Seek to a specific position
  const seekTo = (position: number) => {
    setCurrentTime(position);
    setProgress((position / duration) * 100);
  };
  
  // Set a playlist
  const setPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks.length > 0 && !currentTrack) {
      playTrack(playlist.tracks[0]);
    }
  };
  
  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    isMuted: muted,
    progress,
    currentTime,
    duration,
    currentPlaylist,
    currentEmotion,
    play: playTrack,
    playTrack,
    pause: pauseTrack,
    pauseTrack,
    resume: resumeTrack,
    stop: stopTrack,
    next: nextTrack,
    nextTrack,
    previous: previousTrack,
    previousTrack,
    prevTrack: previousTrack,
    setVolume,
    togglePlay,
    toggleMute,
    mute: () => setMuted(true),
    unmute: () => setMuted(false),
    seekTo,
    setPlaylist,
    loadPlaylistForEmotion,
    setEmotion: setCurrentEmotion,
    openDrawer,
    setOpenDrawer,
    playlists,
    isInitialized,
    initializeMusicSystem,
    error
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook pour utiliser le contexte de musique
export const useMusic = () => {
  const context = useContext(MusicContext);
  return context;
};

export default MusicContext;
