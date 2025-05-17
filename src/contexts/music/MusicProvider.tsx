
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicPlaylist, MusicTrack } from '@/types/music';

// Création du contexte avec les valeurs par défaut
export const MusicContext = createContext<MusicContextType>({
  isInitialized: false,
  isPlaying: false,
  volume: 0.7,
  setVolume: () => {},
  playlists: [],
  setPlaylists: () => {},
  currentPlaylist: null,
  setCurrentPlaylist: () => {},
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  muted: false,
  isLoading: false,
  openDrawer: false,
  setOpenDrawer: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  togglePlay: () => {},
  seekTo: () => {},
  loadPlaylistForEmotion: () => {},
  toggleMute: () => {},
});

// Hook personnalisé pour utiliser le contexte
export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: React.ReactNode;
}

// Provider du contexte
export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  // Création d'un élément audio pour la lecture de la musique
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialiser l'élément audio
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Event listeners
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setIsLoading(false);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        nextTrack();
      });
      
      // Initial volume
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
    
    // Charger des playlists fictives pour la démo
    const mockPlaylists: MusicPlaylist[] = [
      {
        id: '1',
        name: 'Concentration',
        description: 'Musique idéale pour se concentrer',
        tracks: [
          { id: '101', title: 'Deep Focus', artist: 'Ambient Works', duration: 180, url: '/audio/focus1.mp3' },
          { id: '102', title: 'Productive Flow', artist: 'Study Beats', duration: 195, url: '/audio/focus2.mp3' },
          { id: '103', title: 'Mind Clarity', artist: 'Zen Music', duration: 210, url: '/audio/focus3.mp3' },
        ]
      },
      {
        id: '2',
        name: 'Relaxation',
        description: 'Musique apaisante pour se détendre',
        tracks: [
          { id: '201', title: 'Ocean Waves', artist: 'Nature Sounds', duration: 240, url: '/audio/relax1.mp3' },
          { id: '202', title: 'Forest Ambiance', artist: 'Natural Therapy', duration: 255, url: '/audio/relax2.mp3' },
          { id: '203', title: 'Gentle Rain', artist: 'Sleep Music', duration: 270, url: '/audio/relax3.mp3' },
        ]
      },
      {
        id: '3',
        name: 'Motivation',
        description: 'Musique énergisante',
        tracks: [
          { id: '301', title: 'Morning Boost', artist: 'Energy Beats', duration: 165, url: '/audio/energy1.mp3' },
          { id: '302', title: 'Workout Rhythm', artist: 'Fitness Mix', duration: 180, url: '/audio/energy2.mp3' },
          { id: '303', title: 'Power Hour', artist: 'Motivation Masters', duration: 195, url: '/audio/energy3.mp3' },
        ]
      }
    ];
    
    setPlaylists(mockPlaylists);
    setIsInitialized(true);
  }, []);

  // Contrôle de la lecture
  const playTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      setIsLoading(true);
      setCurrentTrack(track);
      audioRef.current.src = track.url;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Erreur de lecture audio:', error);
          setIsPlaying(false);
        });
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    } else if (currentPlaylist && currentPlaylist.tracks.length > 0) {
      playTrack(currentPlaylist.tracks[0]);
    }
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    } else if (currentPlaylist.tracks.length > 0) {
      // Revenir au début si on est à la fin
      playTrack(currentPlaylist.tracks[0]);
    }
  };

  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    } else if (currentPlaylist.tracks.length > 0) {
      // Aller à la dernière piste si on est au début
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  // Effet pour mettre à jour le volume quand il change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fonction pour charger une playlist en fonction d'une émotion
  const loadPlaylistForEmotion = (emotion: string) => {
    setIsLoading(true);
    
    // Logique simplifiée pour la démo
    let playlistToLoad: MusicPlaylist | undefined;
    
    // Carte des émotions vers les playlists
    const emotionPlaylistMap: Record<string, string> = {
      'happy': '3', // Motivation
      'sad': '2',   // Relaxation
      'anxious': '2', // Relaxation
      'focused': '1', // Concentration
      'angry': '3',  // Motivation
      'calm': '2',   // Relaxation
      'stressed': '2', // Relaxation
      'energetic': '3' // Motivation
    };
    
    const normalizedEmotion = emotion.toLowerCase();
    const playlistId = emotionPlaylistMap[normalizedEmotion] || '1'; // Par défaut, concentration
    
    playlistToLoad = playlists.find(p => p.id === playlistId);
    
    if (playlistToLoad) {
      setCurrentPlaylist(playlistToLoad);
      if (playlistToLoad.tracks.length > 0) {
        playTrack(playlistToLoad.tracks[0]);
      }
    }
    
    setIsLoading(false);
    setOpenDrawer(true);
  };

  return (
    <MusicContext.Provider
      value={{
        isInitialized,
        isPlaying,
        volume,
        setVolume,
        playlists,
        setPlaylists,
        currentPlaylist,
        setCurrentPlaylist,
        currentTrack,
        currentTime,
        duration,
        muted,
        isLoading,
        openDrawer,
        setOpenDrawer,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        togglePlay,
        seekTo,
        loadPlaylistForEmotion,
        toggleMute,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};
