import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicPreferences } from '@/types';

export interface MusicContextType {
  currentTrack: MusicTrack | null;
  currentPlaylist: MusicPlaylist | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  loadPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  addToQueue: (track: MusicTrack) => void;
  clearQueue: () => void;
  currentQueue: MusicTrack[];
  error: Error | string | null;
  isLoading: boolean;
  shuffleActive: boolean;
  repeatMode: 'none' | 'one' | 'all';
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => void;
}

const initialMusicContext: MusicContextType = {
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  loadPlaylist: () => {},
  loadPlaylistForEmotion: () => null,
  addToQueue: () => {},
  clearQueue: () => {},
  currentQueue: [],
  error: null,
  isLoading: false,
  shuffleActive: false,
  repeatMode: 'none',
  openDrawer: false,
  setOpenDrawer: () => {},
  initializeMusicSystem: () => {},
};

const MusicContext = createContext<MusicContextType>(initialMusicContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [currentQueue, setCurrentQueue] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<Error | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shuffleActive, setShuffleActive] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [openDrawer, setOpenDrawer] = useState(false);
  
  // Initialize audio system
  const initializeMusicSystem = useCallback(() => {
    if (!audioElement) {
      const audio = new Audio();
      audio.volume = volume;
      
      audio.addEventListener('timeupdate', () => {
        setProgress(audio.currentTime);
      });
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        setIsLoading(false);
      });
      
      audio.addEventListener('ended', () => {
        if (repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play();
        } else {
          nextTrack();
        }
      });
      
      audio.addEventListener('error', (e) => {
        setError('Error loading audio file');
        setIsPlaying(false);
      });
      
      setAudioElement(audio);
    }
  }, [volume, audioElement]);
  
  useEffect(() => {
    initializeMusicSystem();
    
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, []);
  
  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    if (!audioElement) return;
    
    try {
      setIsLoading(true);
      setCurrentTrack(track);
      
      // Use url or audioUrl property
      const audioUrl = track.url || track.audioUrl;
      if (!audioUrl) {
        setError('No audio URL provided for track');
        return;
      }
      
      audioElement.src = audioUrl;
      audioElement.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          setError(`Failed to play track: ${err.message}`);
          setIsPlaying(false);
        });
    } catch (err) {
      setError(`Error playing track: ${err instanceof Error ? err.message : String(err)}`);
    }
  }, [audioElement]);
  
  // Pause current track
  const pauseTrack = useCallback(() => {
    if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    }
  }, [audioElement, isPlaying]);
  
  // Resume current track
  const resumeTrack = useCallback(() => {
    if (audioElement && !isPlaying && currentTrack) {
      audioElement.play()
        .then(() => setIsPlaying(true))
        .catch(err => setError(`Failed to resume: ${err.message}`));
    }
  }, [audioElement, isPlaying, currentTrack]);
  
  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    if (audioElement) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      audioElement.volume = clampedVolume;
      setVolumeState(clampedVolume);
    }
  }, [audioElement]);
  
  // Seek to position
  const seekTo = useCallback((time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setProgress(time);
    }
  }, [audioElement]);
  
  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setShuffleActive(prev => !prev);
  }, []);
  
  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeatMode(current => {
      if (current === 'none') return 'one';
      if (current === 'one') return 'all';
      return 'none';
    });
  }, []);
  
  // Load a playlist
  const loadPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    setCurrentQueue(playlist.tracks);
    
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  }, [playTrack]);
  
  // Load playlist based on emotion
  const loadPlaylistForEmotion = useCallback((emotion: string): MusicPlaylist | null => {
    // This is a simplified implementation - in a real app, you would fetch playlists from an API
    const emotionPlaylists: Record<string, MusicPlaylist> = {
      happy: {
        id: 'happy-playlist',
        name: 'Happy Vibes',
        tracks: [
          { id: 'happy-1', title: 'Happy Song', artist: 'Happy Artist', duration: 180, url: '/music/happy-1.mp3' },
          { id: 'happy-2', title: 'Joyful Tune', artist: 'Happy Artist', duration: 210, url: '/music/happy-2.mp3' },
        ],
        emotion: 'happy'
      },
      sad: {
        id: 'sad-playlist',
        name: 'Melancholy Moments',
        tracks: [
          { id: 'sad-1', title: 'Sad Song', artist: 'Sad Artist', duration: 240, url: '/music/sad-1.mp3' },
          { id: 'sad-2', title: 'Melancholy Tune', artist: 'Sad Artist', duration: 195, url: '/music/sad-2.mp3' },
        ],
        emotion: 'sad'
      },
      calm: {
        id: 'calm-playlist',
        name: 'Peaceful Moments',
        tracks: [
          { id: 'calm-1', title: 'Calm Waters', artist: 'Nature Sounds', duration: 300, url: '/music/calm-1.mp3' },
          { id: 'calm-2', title: 'Gentle Breeze', artist: 'Nature Sounds', duration: 320, url: '/music/calm-2.mp3' },
        ],
        emotion: 'calm'
      },
      neutral: {
        id: 'neutral-playlist',
        name: 'Balanced Mood',
        tracks: [
          { id: 'neutral-1', title: 'Ambient Flow', artist: 'Ambient Artist', duration: 280, url: '/music/neutral-1.mp3' },
          { id: 'neutral-2', title: 'Steady Rhythm', artist: 'Ambient Artist', duration: 260, url: '/music/neutral-2.mp3' },
        ],
        emotion: 'neutral'
      },
      energetic: {
        id: 'energetic-playlist',
        name: 'Energy Boost',
        tracks: [
          { id: 'energetic-1', title: 'Power Up', artist: 'Energy Artist', duration: 200, url: '/music/energetic-1.mp3' },
          { id: 'energetic-2', title: 'Full Force', artist: 'Energy Artist', duration: 190, url: '/music/energetic-2.mp3' },
        ],
        emotion: 'energetic'
      }
    };
    
    const normalizedEmotion = emotion.toLowerCase();
    const playlist = emotionPlaylists[normalizedEmotion] || emotionPlaylists.neutral;
    
    if (playlist) {
      loadPlaylist(playlist);
      return playlist;
    }
    
    return null;
  }, [loadPlaylist]);
  
  // Next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentQueue.length) return;
    
    const currentIndex = currentQueue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (shuffleActive) {
      // Random track excluding current
      const availableIndices = Array.from(
        { length: currentQueue.length },
        (_, i) => i
      ).filter(i => i !== currentIndex);
      
      if (!availableIndices.length) return;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Next track in sequence or loop to beginning
      nextIndex = (currentIndex + 1) % currentQueue.length;
    }
    
    playTrack(currentQueue[nextIndex]);
  }, [currentTrack, currentQueue, shuffleActive, playTrack]);
  
  // Previous track
  const prevTrack = useCallback(() => {
    if (!currentTrack || !currentQueue.length) return;
    
    const currentIndex = currentQueue.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let prevIndex;
    if (shuffleActive) {
      // Random track excluding current
      const availableIndices = Array.from(
        { length: currentQueue.length },
        (_, i) => i
      ).filter(i => i !== currentIndex);
      
      if (!availableIndices.length) return;
      prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Previous track or loop to end
      prevIndex = (currentIndex - 1 + currentQueue.length) % currentQueue.length;
    }
    
    playTrack(currentQueue[prevIndex]);
  }, [currentTrack, currentQueue, shuffleActive, playTrack]);
  
  // Add track to queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setCurrentQueue(prev => [...prev, track]);
  }, []);
  
  // Clear queue
  const clearQueue = useCallback(() => {
    setCurrentQueue([]);
    pauseTrack();
    setCurrentTrack(null);
  }, [pauseTrack]);
  
  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist,
    isPlaying,
    volume,
    progress,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    loadPlaylist,
    loadPlaylistForEmotion,
    addToQueue,
    clearQueue,
    currentQueue,
    error,
    isLoading,
    shuffleActive,
    repeatMode,
    openDrawer,
    setOpenDrawer,
    initializeMusicSystem,
  };
  
  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
