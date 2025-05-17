
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  recommendations: MusicTrack[];
  isLoading: boolean;
  error: Error | null;
  isInitialized: boolean;
  openDrawer: boolean;
  emotion: string | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams | string) => Promise<MusicPlaylist | null>;
  setEmotion: (emotion: string) => void;
  setOpenDrawer: (open: boolean) => void;
}

// Valeurs par défaut du contexte
const defaultContext: MusicContextType = {
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  isMuted: false,
  currentTime: 0,
  duration: 0,
  recommendations: [],
  isLoading: false,
  error: null,
  isInitialized: false,
  openDrawer: false,
  emotion: null,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  loadPlaylistForEmotion: async () => null,
  setEmotion: () => {},
  setOpenDrawer: () => {}
};

// Création du contexte
export const MusicContext = createContext<MusicContextType>(defaultContext);

// Hook personnalisé pour utiliser le contexte de musique
export const useMusic = () => useContext(MusicContext);

export interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  // État pour le lecteur de musique
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);

  // Initialisation de l'élément audio
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);
    setIsInitialized(true);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Mise à jour du volume de l'audio lorsqu'il change
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  // Mise à jour de la source audio lorsque la piste courante change
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.url || '';
      audioElement.load();
      if (isPlaying) {
        audioElement.play();
      }

      // Mettre à jour la durée une fois que les métadonnées sont chargées
      audioElement.onloadedmetadata = () => {
        setDuration(audioElement.duration);
      };

      // Mettre à jour la progression pendant la lecture
      audioElement.ontimeupdate = () => {
        setCurrentTime(audioElement.currentTime);
      };

      // Passer à la piste suivante lorsque la piste est terminée
      audioElement.onended = () => {
        nextTrack();
      };
    }
    
    return () => {
      if (audioElement) {
        audioElement.onloadedmetadata = null;
        audioElement.ontimeupdate = null;
        audioElement.onended = null;
      }
    };
  }, [currentTrack, audioElement]);

  // Jouer une piste spécifique
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Mettre en pause la piste courante
  const pauseTrack = () => {
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
  };

  // Reprendre la lecture de la piste courante
  const resumeTrack = () => {
    if (audioElement) {
      audioElement.play();
    }
    setIsPlaying(true);
  };

  // Changer l'état de lecture
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  // Passer à la piste suivante dans la playlist
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else if (playlist.tracks.length > 0) {
      // Revenir à la première piste si on est à la fin
      playTrack(playlist.tracks[0]);
    }
  };

  // Revenir à la piste précédente dans la playlist
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else if (playlist.tracks.length > 0) {
      // Aller à la dernière piste si on est au début
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };

  // Définir la position dans la piste
  const seekTo = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
    }
    setCurrentTime(time);
  };
  
  // Changer le volume
  const changeVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };
  
  // Activer/désactiver le mode muet
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioElement) {
      audioElement.muted = !isMuted;
    }
  };

  // Charger une playlist pour une émotion spécifique
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const emotionParam = typeof params === 'string' ? params : params.emotion;
      const intensityParam = typeof params === 'object' ? params.intensity || 0.5 : 0.5;
      
      console.log(`Loading playlist for emotion: ${emotionParam} with intensity ${intensityParam}`);
      
      // Pour l'exemple, on crée une playlist factice
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotionParam}`,
        name: `${emotionParam.charAt(0).toUpperCase() + emotionParam.slice(1)} Playlist`,
        description: `Music to match your ${emotionParam} mood`,
        tracks: [
          {
            id: `track-${emotionParam}-1`,
            title: `${emotionParam} Track 1`,
            artist: 'Emotion Artist',
            album: 'Mood Album',
            duration: 180,
            url: '/sounds/ambient-calm.mp3',
            coverImage: '/images/covers/track1.jpg'
          },
          {
            id: `track-${emotionParam}-2`,
            title: `${emotionParam} Track 2`,
            artist: 'Mood Musician',
            album: 'Feeling Album',
            duration: 210,
            url: '/sounds/welcome.mp3',
            coverImage: '/images/covers/track2.jpg'
          }
        ]
      };
      
      setPlaylist(mockPlaylist);
      setEmotion(emotionParam);
      setRecommendations(mockPlaylist.tracks);
      
      // Jouer automatiquement la première piste
      if (mockPlaylist.tracks.length > 0) {
        playTrack(mockPlaylist.tracks[0]);
      }
      
      setIsLoading(false);
      return mockPlaylist;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error loading playlist');
      console.error('Error loading playlist for emotion:', err);
      setError(err);
      setIsLoading(false);
      return null;
    }
  };

  // Valeur du contexte
  const contextValue: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    muted: isMuted,
    isMuted,
    currentTime,
    duration,
    recommendations,
    isLoading,
    error,
    isInitialized,
    openDrawer,
    emotion,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume: changeVolume,
    toggleMute,
    seekTo,
    loadPlaylistForEmotion,
    setEmotion,
    setOpenDrawer
  };

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
};

export default MusicProvider;
