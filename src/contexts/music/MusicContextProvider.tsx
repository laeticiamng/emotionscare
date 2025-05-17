
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockMusic';

export const MusicContext = createContext<MusicContextType | null>(null);

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicContextProvider');
  }
  return context;
};

export const MusicContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [history, setHistory] = useState<MusicTrack[]>([]);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
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
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode]);
  
  // Set current track's audio source
  useEffect(() => {
    if (audioElement && currentTrack) {
      audioElement.src = currentTrack.url;
      audioElement.currentTime = 0;
      if (isPlaying) {
        audioElement.play()
          .catch(error => console.error('Error playing audio:', error));
      }
    }
  }, [currentTrack, audioElement]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioElement) {
      if (isPlaying && currentTrack) {
        audioElement.play()
          .catch(error => console.error('Error playing audio:', error));
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement, currentTrack]);
  
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
      const nextTrack = queue[0];
      setQueue(queue.slice(1));
      handleSetCurrentTrack(nextTrack);
    }
  };
  
  const pause = () => setIsPlaying(false);
  const togglePlay = () => setIsPlaying(prev => !prev);
  
  // Navigation controls
  const next = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setQueue(queue.slice(1));
      handleSetCurrentTrack(nextTrack);
    } else if (repeatMode === 'all' && history.length > 0) {
      // If repeat all, move history to queue and play the first track
      setQueue([...history]);
      setHistory([]);
      if (history.length > 0) {
        handleSetCurrentTrack(history[0]);
      }
    } else {
      // Stop playback if nothing more to play
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
      // Shuffle the queue
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
  
  // Emotion-based functions
  const getEmotionPlaylist = (emotion: string): MusicPlaylist | null => {
    const playlist = mockPlaylists.find(p => 
      p.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    return playlist || null;
  };
  
  // Recommendations
  const getRecommendedTracks = (limit: number = 5): MusicTrack[] => {
    // Here we would normally implement a complex recommendation algorithm
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

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
