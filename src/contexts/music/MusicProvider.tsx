
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  playlist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  emotion: string | null;
  openDrawer: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setEmotion: (emotion: string) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<MusicPlaylist | null>;
  setOpenDrawer: (open: boolean) => void;
}

// Valeurs par défaut du contexte
const defaultContext: MusicContextType = {
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  emotion: null,
  openDrawer: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  setProgress: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
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
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialisation de l'élément audio
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

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
      audioElement.src = currentTrack.url;
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
        setProgress(audioElement.currentTime);
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
  const setProgressTime = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
    }
    setProgress(time);
  };

  // Charger une playlist pour une émotion spécifique
  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // Ici, on simulerait un appel API pour obtenir une playlist basée sur l'émotion
      console.log(`Loading playlist for emotion: ${params.emotion} with intensity ${params.intensity}`);
      
      // Pour l'exemple, on crée une playlist factice
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${params.emotion}`,
        name: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Playlist`,
        description: `Music to match your ${params.emotion} mood`,
        coverImage: `/images/playlists/${params.emotion}.jpg`,
        tracks: [
          {
            id: `track-${params.emotion}-1`,
            title: `${params.emotion} Track 1`,
            artist: 'Emotion Artist',
            album: 'Mood Album',
            duration: 180,
            url: '/sounds/ambient-calm.mp3',
            coverImage: '/images/covers/track1.jpg'
          },
          {
            id: `track-${params.emotion}-2`,
            title: `${params.emotion} Track 2`,
            artist: 'Mood Musician',
            album: 'Feeling Album',
            duration: 210,
            url: '/sounds/welcome.mp3',
            coverImage: '/images/covers/track2.jpg'
          }
        ]
      };
      
      setPlaylist(mockPlaylist);
      setEmotion(params.emotion);
      
      // Jouer automatiquement la première piste
      if (mockPlaylist.tracks.length > 0) {
        playTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      return null;
    }
  };

  // Valeur du contexte
  const value: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    progress,
    duration,
    emotion,
    openDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    setVolume,
    setProgress: setProgressTime,
    setEmotion,
    loadPlaylistForEmotion,
    setOpenDrawer
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export default MusicProvider;
