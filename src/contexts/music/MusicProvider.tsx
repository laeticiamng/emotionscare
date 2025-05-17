
import React, { createContext, useState, useEffect, useContext } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockMusic';

// Create context
export const MusicContext = createContext<MusicContextType | null>(null);

// Hook for using music context
export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [history, setHistory] = useState<MusicTrack[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [shuffleMode, setShuffleMode] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        next();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Set current track's audio source
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.url;
      audioElement.load();
      if (isPlaying) {
        audioElement.play().catch(err => console.error('Error playing audio:', err));
      }
    }
  }, [currentTrack, audioElement]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(err => console.error('Error playing audio:', err));
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);
  
  // Update volume when changed
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);
  
  // Function to handle track selection
  const handleSetCurrentTrack = (track: MusicTrack) => {
    if (currentTrack) {
      setHistory(prev => [...prev, currentTrack]);
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Play/pause controls
  const play = () => {
    if (currentTrack) {
      setIsPlaying(true);
    } else if (queue.length > 0) {
      handleSetCurrentTrack(queue[0]);
      setQueue(prev => prev.slice(1));
    }
  };
  
  const pause = () => setIsPlaying(false);
  
  const togglePlay = () => setIsPlaying(prev => !prev);
  
  // Navigation controls
  const next = () => {
    if (queue.length > 0) {
      handleSetCurrentTrack(queue[0]);
      setQueue(prev => prev.slice(1));
    } else if (repeatMode === 'all') {
      // Start playing from history when repeat all is enabled
      const tracksToQueue = [...history];
      if (tracksToQueue.length > 0) {
        handleSetCurrentTrack(tracksToQueue[0]);
        setQueue(tracksToQueue.slice(1));
        setHistory([]);
      } else {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  };
  
  const previous = () => {
    if (history.length > 0) {
      const prevTrack = history[history.length - 1];
      if (currentTrack) {
        setQueue(prev => [currentTrack, ...prev]);
      }
      setHistory(prev => prev.slice(0, -1));
      handleSetCurrentTrack(prevTrack);
    }
  };
  
  // Queue management
  const addToQueue = (track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };
  
  const removeFromQueue = (trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  };
  
  // Mode toggles
  const toggleShuffle = () => {
    setShuffleMode(prev => !prev);
    if (!shuffleMode && queue.length > 0) {
      const shuffled = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffled);
    }
  };
  
  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one';
      if (prev === 'one') return 'all';
      return 'none';
    });
  };
  
  // Seek in track
  const seek = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setProgress(time);
    }
  };
  
  // Play functions
  const playPlaylist = (playlist: MusicPlaylist) => {
    if (playlist.tracks.length === 0) return;
    
    const tracksToPlay = shuffleMode 
      ? [...playlist.tracks].sort(() => Math.random() - 0.5)
      : playlist.tracks;
      
    const [firstTrack, ...restTracks] = tracksToPlay;
    
    setQueue(restTracks);
    handleSetCurrentTrack(firstTrack);
  };
  
  const playTrack = (track: MusicTrack) => {
    handleSetCurrentTrack(track);
  };
  
  const playTracks = (tracks: MusicTrack[]) => {
    if (tracks.length === 0) return;
    
    const tracksToPlay = shuffleMode 
      ? [...tracks].sort(() => Math.random() - 0.5)
      : tracks;
      
    const [firstTrack, ...restTracks] = tracksToPlay;
    
    setQueue(restTracks);
    handleSetCurrentTrack(firstTrack);
  };
  
  const getEmotionPlaylist = (emotion: string) => {
    return mockPlaylists.find(p => p.emotion === emotion) || null;
  };
  
  const getRecommendedTracks = (limit = 5) => {
    // This would typically involve some algorithm to provide recommendations
    // For now, just return random tracks
    return mockTracks
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
  };
  
  // Play similar tracks
  const playSimilar = (track: MusicTrack) => {
    // Find tracks with similar emotion or genre
    const similarTracks = mockTracks.filter(t => 
      t.id !== track.id && (
        t.emotion === track.emotion || 
        t.genre === track.genre
      )
    ).sort(() => Math.random() - 0.5);
    
    if (similarTracks.length === 0) return;
    
    setQueue(similarTracks);
    if (!currentTrack || !isPlaying) {
      const firstTrack = similarTracks.shift() as MusicTrack;
      handleSetCurrentTrack(firstTrack);
      setQueue(similarTracks);
    }
  };

  const value = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    queue,
    playlists: mockPlaylists,
    history,
    repeatMode,
    shuffleMode,
    setCurrentTrack: handleSetCurrentTrack,
    play,
    pause,
    togglePlay,
    next,
    previous,
    setVolume,
    seek,
    addToQueue,
    clearQueue,
    removeFromQueue,
    toggleShuffle,
    toggleRepeat,
    playPlaylist,
    playTrack,
    playTracks,
    getEmotionPlaylist,
    getRecommendedTracks,
    playSimilar
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export default MusicProvider;
