
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MusicContextType, MusicTrack } from '@/types/music';

// Exemple de données musicales
const musicSamples: Record<string, MusicTrack[]> = {
  joy: [
    {
      id: 'joy-1',
      title: 'Happy Day',
      artist: 'Sunshine',
      album: 'Good Vibes',
      duration: 180,
      mood: 'joy',
      coverImage: 'https://via.placeholder.com/150?text=Happy',
      url: 'https://assets.mixkit.co/music/preview/mixkit-games-worldbeat-466.mp3'
    },
    {
      id: 'joy-2',
      title: 'Celebration',
      artist: 'Party People',
      album: 'Festivities',
      duration: 210,
      mood: 'joy',
      coverImage: 'https://via.placeholder.com/150?text=Party',
      url: 'https://assets.mixkit.co/music/preview/mixkit-hip-hop-02-738.mp3'
    }
  ],
  anxiety: [
    {
      id: 'anx-1',
      title: 'Calm Waters',
      artist: 'Peace',
      album: 'Tranquility',
      duration: 240,
      mood: 'anxiety',
      coverImage: 'https://via.placeholder.com/150?text=Calm',
      url: 'https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3'
    },
    {
      id: 'anx-2',
      title: 'Deep Breath',
      artist: 'Mindful',
      album: 'Relaxation',
      duration: 260,
      mood: 'anxiety',
      coverImage: 'https://via.placeholder.com/150?text=Breath',
      url: 'https://assets.mixkit.co/music/preview/mixkit-comforting-ambience-444.mp3'
    }
  ],
  sadness: [
    {
      id: 'sad-1',
      title: 'Reflection',
      artist: 'Blue Sky',
      album: 'Memories',
      duration: 230,
      mood: 'sadness',
      coverImage: 'https://via.placeholder.com/150?text=Reflect',
      url: 'https://assets.mixkit.co/music/preview/mixkit-lo-fi-03-739.mp3'
    },
    {
      id: 'sad-2',
      title: 'Gentle Rain',
      artist: 'Nature',
      album: 'Elements',
      duration: 200,
      mood: 'sadness',
      coverImage: 'https://via.placeholder.com/150?text=Rain',
      url: 'https://assets.mixkit.co/music/preview/mixkit-rainy-night-chill-145.mp3'
    }
  ],
  neutral: [
    {
      id: 'neu-1',
      title: 'Background Music',
      artist: 'Ambient Sounds',
      album: 'Focus',
      duration: 190,
      mood: 'neutral',
      coverImage: 'https://via.placeholder.com/150?text=Focus',
      url: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3'
    },
    {
      id: 'neu-2',
      title: 'Productivity',
      artist: 'Work Mode',
      album: 'Efficiency',
      duration: 220,
      mood: 'neutral',
      coverImage: 'https://via.placeholder.com/150?text=Work',
      url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
    }
  ]
};

const defaultTracks = [
  {
    id: 'default-1',
    title: 'Peaceful Melody',
    artist: 'Relaxation',
    album: 'Calm Collection',
    duration: 180,
    mood: 'neutral',
    coverImage: 'https://via.placeholder.com/150?text=Default',
    url: 'https://assets.mixkit.co/music/preview/mixkit-raising-me-higher-34.mp3'
  },
  {
    id: 'default-2',
    title: 'Gentle Flow',
    artist: 'Harmony',
    album: 'Balance',
    duration: 200,
    mood: 'neutral',
    coverImage: 'https://via.placeholder.com/150?text=Flow',
    url: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3'
  }
];

// Contexte pour la musique
export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  volume: 0.5,
  muted: false,
  progress: 0,
  duration: 0,
  emotion: null,
  setEmotion: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  togglePlayback: () => {},
  setProgress: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  loadPlaylist: () => {},
  loadPlaylistForEmotion: () => {},
  isInitialized: false,
  initializeMusicSystem: () => {},
  error: null
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeMusicSystem = () => {
    if (audio) {
      // Configurer les gestionnaires d'événements audio
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleMetadataLoaded);
      audio.addEventListener('ended', handleTrackEnded);
      
      // Commencer avec une playlist par défaut
      loadPlaylist(defaultTracks);
      setIsInitialized(true);
    } else {
      setError("Le navigateur ne prend pas en charge l'audio HTML5");
    }
  };

  useEffect(() => {
    if (audio && !isInitialized) {
      initializeMusicSystem();
    }
    
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleMetadataLoaded);
        audio.removeEventListener('ended', handleTrackEnded);
      }
    };
  }, []);

  // Mettre à jour le volume quand il change
  useEffect(() => {
    if (audio) {
      audio.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audio]);

  const handleTimeUpdate = () => {
    if (audio) {
      setProgressState(audio.currentTime);
    }
  };

  const handleMetadataLoaded = () => {
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  const playTrack = (track: MusicTrack) => {
    if (audio) {
      if (track.url) {
        audio.src = track.url;
        audio.play()
          .then(() => {
            setCurrentTrack(track);
            setIsPlaying(true);
          })
          .catch(err => {
            console.error("Erreur lors de la lecture de la piste:", err);
            setError("Impossible de lire la piste audio");
          });
      } else {
        setError("URL de la piste audio manquante");
      }
    }
  };

  const pauseTrack = () => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audio && !isPlaying && currentTrack) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Erreur lors de la reprise de la lecture:", err);
        });
    }
  };

  const nextTrack = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > -1 && currentIndex < playlist.length - 1) {
        playTrack(playlist[currentIndex + 1]);
      } else {
        playTrack(playlist[0]); // Revenir au début de la playlist
      }
    }
  };

  const prevTrack = () => {
    if (currentTrack && playlist.length > 0) {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(playlist[currentIndex - 1]);
      } else {
        playTrack(playlist[playlist.length - 1]); // Aller à la dernière piste
      }
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const setProgress = (newProgress: number) => {
    if (audio) {
      audio.currentTime = newProgress;
      setProgressState(newProgress);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    if (audio) {
      audio.volume = clampedVolume;
    }
    setVolumeState(clampedVolume);
  };

  const toggleMute = () => {
    if (audio) {
      const newMuted = !muted;
      audio.muted = newMuted;
      setMuted(newMuted);
    }
  };

  const loadPlaylist = (newPlaylist: MusicTrack[]) => {
    if (newPlaylist && newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
      // Jouer automatiquement la première piste si aucune n'est en cours
      if (!currentTrack) {
        playTrack(newPlaylist[0]);
      }
    }
  };

  const loadPlaylistForEmotion = (emotion: string) => {
    const emotionPlaylist = musicSamples[emotion];
    if (emotionPlaylist && emotionPlaylist.length > 0) {
      setPlaylist(emotionPlaylist);
      playTrack(emotionPlaylist[0]);
    } else {
      // Utiliser une playlist par défaut si aucune n'est trouvée pour l'émotion
      setPlaylist(defaultTracks);
      playTrack(defaultTracks[0]);
    }
  };

  return (
    <MusicContext.Provider value={{
      currentTrack,
      playlist,
      isPlaying,
      volume,
      muted,
      progress,
      duration,
      emotion,
      setEmotion,
      playTrack,
      pauseTrack,
      resumeTrack,
      nextTrack,
      prevTrack,
      togglePlayback,
      setProgress,
      setVolume,
      toggleMute,
      loadPlaylist,
      loadPlaylistForEmotion,
      isInitialized,
      initializeMusicSystem,
      error
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext doit être utilisé dans un MusicProvider');
  }
  return context;
};
