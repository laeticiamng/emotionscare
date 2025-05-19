
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';
import { relaxingNatureSounds, focusBeats, energyBoost, calmMeditation } from '@/data/music';
import { getPlaylistByEmotion } from '@/data/emotionPlaylists';
import { getTrackArtist, getTrackTitle, getTrackCover, getTrackUrl } from '@/utils/musicCompatibility';

// Valeur par défaut du contexte
const defaultContext: MusicContextType = {
  currentTrack: null,
  currentPlaylist: null,
  queue: [],
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  openDrawer: false,
  isInitialized: false,
  
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  previousTrack: () => {},
  nextTrack: () => {},
  setTrack: () => {},
  setPlaylist: () => {},
  setVolume: () => {},
  setMuted: () => {},
  seekTo: () => {},
  setRepeat: () => {},
  toggleShuffle: () => {},
  setOpenDrawer: () => {},
  loadPlaylistForEmotion: async () => false,
  getPlaylistById: () => null,
  loadPlaylist: () => {},
  clearQueue: () => {},
  addToQueue: () => {},
  removeFromQueue: () => {},
  setCurrentTime: () => {},
  setDuration: () => {},
  setIsPlaying: () => {},
  setIsInitialized: () => {},
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Créer l'élément audio si on est côté navigateur
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio();
      audio.volume = volume;
      audioRef.current = audio;
      setIsInitialized(true);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Gestion de la mémoire audio
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => handleTrackEnd();
      const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
      const onLoadedMetadata = () => setDuration(audio.duration || 0);
      
      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      
      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      };
    }
  }, []);

  // Gestion du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Fonctions principales
  const playTrack = (track: MusicTrack) => {
    if (audioRef.current) {
      const trackUrl = getTrackUrl(track);
      
      // Seulement changer la source si elle a changé
      if (audioRef.current.src !== trackUrl) {
        audioRef.current.src = trackUrl;
      }
      
      setCurrentTrack(track);
      
      // Promise pour gérer le cas où le fichier audio n'est pas disponible
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Erreur de lecture audio:", error);
            setIsPlaying(false);
          });
      }
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Erreur de reprise audio:", error);
          });
      }
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTrackEnd = () => {
    if (repeat === 'track' && currentTrack) {
      // Rejouer la piste actuelle
      seekTo(0);
      audioRef.current?.play();
    } else {
      nextTrack();
    }
  };

  const previousTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(currentPlaylist.tracks[currentIndex - 1]);
      } else if (repeat === 'playlist') {
        // Revenir à la dernière piste si on est au début et que repeat est activé
        playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
      }
    } else if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(queue[currentIndex - 1]);
      }
    }
  };

  const nextTrack = () => {
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < currentPlaylist.tracks.length - 1) {
        playTrack(currentPlaylist.tracks[currentIndex + 1]);
      } else if (repeat === 'playlist') {
        // Revenir à la première piste si on est à la fin et que repeat est activé
        playTrack(currentPlaylist.tracks[0]);
      } else {
        setIsPlaying(false);
      }
    } else if (queue.length > 0 && currentTrack) {
      const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
      if (currentIndex < queue.length - 1) {
        playTrack(queue[currentIndex + 1]);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    
    // Mélanger la queue actuelle si on active le shuffle
    if (!shuffle && currentPlaylist) {
      const currentTracks = [...currentPlaylist.tracks];
      const currentIndex = currentTrack 
        ? currentTracks.findIndex(t => t.id === currentTrack.id) 
        : -1;
        
      // Retirer la piste en cours de lecture
      if (currentIndex !== -1) {
        currentTracks.splice(currentIndex, 1);
      }
      
      // Mélanger les pistes restantes
      for (let i = currentTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [currentTracks[i], currentTracks[j]] = [currentTracks[j], currentTracks[i]];
      }
      
      // Remettre la piste en cours au début
      if (currentTrack) {
        currentTracks.unshift(currentTrack);
      }
      
      // Mettre à jour la playlist
      if (currentPlaylist) {
        setCurrentPlaylist({
          ...currentPlaylist,
          tracks: currentTracks
        });
      }
    }
  };

  const setTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    playTrack(track);
  };

  const loadPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    setQueue(playlist.tracks);
    
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const getPlaylistById = (playlistId: string): MusicPlaylist | null => {
    // Recherche dans les playlists prédéfinies
    const allPlaylists = [relaxingNatureSounds, focusBeats, energyBoost, calmMeditation];
    const foundPlaylist = allPlaylists.find(p => p.id === playlistId);
    return foundPlaylist || null;
  };

  const loadPlaylistForEmotion = async (emotion: string): Promise<boolean> => {
    const playlist = getPlaylistByEmotion(emotion);
    if (playlist) {
      loadPlaylist(playlist);
      return true;
    }
    return false;
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentPlaylist(null);
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  };

  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(t => t.id !== trackId));
  };

  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist,
    queue,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    repeat,
    shuffle,
    openDrawer,
    isInitialized,
    
    playTrack,
    pauseTrack,
    resumeTrack,
    previousTrack,
    nextTrack,
    setTrack,
    setPlaylist: loadPlaylist,
    setVolume,
    setMuted,
    seekTo,
    setRepeat,
    toggleShuffle,
    setOpenDrawer,
    loadPlaylistForEmotion,
    getPlaylistById,
    loadPlaylist,
    clearQueue,
    addToQueue,
    removeFromQueue,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setIsInitialized,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
