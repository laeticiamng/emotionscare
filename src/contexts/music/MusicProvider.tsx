
import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import defaultPlaylists from '@/data/musicPlaylists';

const defaultContextValue: MusicContextType = {
  isPlaying: false,
  currentTrack: null,
  volume: 0.5,
  playlist: [],
  allTracks: [],
  playlists: [],
  play: () => {},
  pause: () => {},
  stop: () => {},
  next: () => {},
  previous: () => {},
  setTrack: () => {},
  setVolume: () => {},
  setPlaylist: () => {},
  togglePlay: () => {},
  addToPlaylist: () => {},
  createPlaylist: () => ({ id: '', name: '', tracks: [] }),
  removeFromPlaylist: () => {},
  getTracksByEmotion: () => [],
  progress: 0,
};

const MusicContext = createContext<MusicContextType>(defaultContextValue);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [playlist, setPlaylist] = useState<MusicTrack[]>([]);
  const [allTracks, setAllTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    // Initialize tracks from default playlists
    const tracks = defaultPlaylists.flatMap(playlist => playlist.tracks);
    setAllTracks(tracks);
    setPlaylists(defaultPlaylists);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      if (currentTrack.src) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play()
            .catch(error => console.error('Error playing audio:', error));
        }
      }
    }
  }, [currentTrack]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };
    
    const handleEnded = () => {
      next();
    };
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  const play = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error playing audio:', error));
    } else if (playlist.length > 0 && !currentTrack) {
      setCurrentTrack(playlist[0]);
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(error => console.error('Error playing audio:', error));
      }
    }
  };
  
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };
  
  const next = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.length - 1) {
      setCurrentTrack(playlist[currentIndex + 1]);
    } else {
      // Loop back to the first track
      setCurrentTrack(playlist[0]);
    }
  };
  
  const previous = () => {
    if (playlist.length === 0 || !currentTrack) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      setCurrentTrack(playlist[currentIndex - 1]);
    } else {
      // Loop to the last track
      setCurrentTrack(playlist[playlist.length - 1]);
    }
  };
  
  const addToPlaylist = (track: MusicTrack) => {
    setPlaylist(prev => [...prev, track]);
  };
  
  const removeFromPlaylist = (trackId: string) => {
    setPlaylist(prev => prev.filter(track => track.id !== trackId));
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };
  
  const getTracksByEmotion = (emotion: string): MusicTrack[] => {
    return allTracks.filter(track => track.emotion && track.emotion.toLowerCase() === emotion.toLowerCase());
  };
  
  const createPlaylist = (name: string, tracks: MusicTrack[] = []): MusicPlaylist => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks,
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };
  
  const loadPlaylist = (playlistId: string) => {
    const playlistToLoad = playlists.find(p => p.id === playlistId);
    if (playlistToLoad) {
      setPlaylist(playlistToLoad.tracks);
      if (playlistToLoad.tracks.length > 0) {
        setCurrentTrack(playlistToLoad.tracks[0]);
      }
    }
  };
  
  return (
    <MusicContext.Provider value={{
      isPlaying,
      currentTrack,
      volume,
      playlist,
      allTracks,
      playlists,
      play,
      pause,
      stop,
      next,
      previous,
      setTrack: (track: MusicTrack) => setCurrentTrack(track),
      setVolume,
      setPlaylist,
      togglePlay,
      addToPlaylist,
      createPlaylist,
      removeFromPlaylist,
      getTracksByEmotion,
      progress,
      loadPlaylist,
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
