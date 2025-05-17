
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { getMockMusicData } from './mockMusicData';

// Création du contexte avec une valeur par défaut
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  duration: 0,
  currentTime: 0,
  playlist: null,
  openDrawer: false,
  emotion: null,
  playTrack: () => {},
  togglePlay: () => {},
  setVolume: () => {},
  seekTo: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useMusic = () => useContext(MusicContext);

// Création du provider
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);

  // Initialiser les données musicales
  useEffect(() => {
    const { mockTracks, mockPlaylists } = getMockMusicData();
    setPlaylists(mockPlaylists);
  }, []);

  // Créer l'élément audio
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => nextTrack();
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Mettre à jour l'URL de la piste actuelle
  useEffect(() => {
    if (audioElement && currentTrack) {
      const trackUrl = currentTrack.url || currentTrack.audioUrl;
      if (trackUrl) {
        audioElement.src = trackUrl;
        audioElement.load();
        if (isPlaying) {
          audioElement.play();
        }
      }
    }
  }, [currentTrack, audioElement]);

  // Gérer l'état de lecture
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  // Gérer le volume
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioElement]);

  // Jouer une piste
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  // Mettre en pause
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Reprendre la lecture
  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Basculer lecture/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Piste suivante
  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  }, [playlist, currentTrack, playTrack]);

  // Piste précédente
  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  }, [playlist, currentTrack, playTrack]);

  // Régler le volume
  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  // Basculer muet/sonore
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  // Déplacer la position de lecture
  const seekTo = useCallback((time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setCurrentTime(time);
    }
  }, [audioElement]);

  // Charger une playlist pour une émotion
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string) => {
    const emotionName = typeof params === 'string' ? params : params.emotion;
    const intensity = typeof params === 'object' ? params.intensity : undefined;
    
    // Logique simplifiée pour trouver une playlist correspondante
    const { mockPlaylists } = getMockMusicData();
    const matchingPlaylist = mockPlaylists.find(
      p => p.emotion?.toLowerCase() === emotionName.toLowerCase() || 
           p.mood?.toLowerCase() === emotionName.toLowerCase()
    );
    
    if (matchingPlaylist) {
      setPlaylist(matchingPlaylist);
      if (matchingPlaylist.tracks && matchingPlaylist.tracks.length > 0) {
        setCurrentTrack(matchingPlaylist.tracks[0]);
      }
      return matchingPlaylist;
    }
    
    return null;
  }, []);

  // Jouer une playlist
  const playPlaylist = useCallback((newPlaylist: MusicPlaylist) => {
    setPlaylist(newPlaylist);
    if (newPlaylist.tracks && newPlaylist.tracks.length > 0) {
      playTrack(newPlaylist.tracks[0]);
    }
  }, [playTrack]);

  // Recommandation par émotion
  const recommendByEmotion = useCallback((emotion: string, intensity?: number) => {
    const { mockPlaylists } = getMockMusicData();
    const matchingPlaylist = mockPlaylists.find(
      p => p.emotion?.toLowerCase() === emotion.toLowerCase() || 
           p.mood?.toLowerCase() === emotion.toLowerCase()
    ) || mockPlaylists[0]; // Fallback to first playlist if no match
    
    return matchingPlaylist;
  }, []);

  // Valeur du contexte
  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    duration,
    currentTime,
    playlist,
    playlists,
    openDrawer,
    emotion,
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
    setOpenDrawer,
    loadPlaylist: playPlaylist,
    recommendByEmotion
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
