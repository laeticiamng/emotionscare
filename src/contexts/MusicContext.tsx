
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { getPlaylistByEmotion } from '@/data/emotionPlaylists';
import { 
  getTrackUrl, 
  getTrackTitle, 
  getTrackArtist, 
  getTrackCover, 
  normalizeTrack,
  ensurePlaylist
} from '@/utils/musicCompatibility';

// Create the Music Context with default values
const MusicContext = createContext<MusicContextType>({
  // State
  currentTrack: null,
  currentPlaylist: null,
  playlist: null,
  queue: [],
  isPlaying: false,
  volume: 0.7,
  muted: false,
  currentTime: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  openDrawer: false,
  isInitialized: false,
  error: null,
  
  // Actions
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  previousTrack: () => {},
  nextTrack: () => {},
});

// Custom hook to use the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for the music player
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [emotion, setEmotion] = useState<string>('calm');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize the audio player
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Set up event listeners
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', handleTrackEnd);
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      setIsInitialized(true);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', () => {});
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('loadedmetadata', () => {});
        audioRef.current = null;
      }
    };
  }, []);

  // Handle track end
  const handleTrackEnd = useCallback(() => {
    if (repeat === 'track' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      nextTrack();
    }
  }, [repeat]);

  // Update audio source when current track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const trackUrl = getTrackUrl(currentTrack);
      audioRef.current.src = trackUrl;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing track:', err);
          setError(new Error('Failed to play track'));
        });
      }
    }
  }, [currentTrack]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = getTrackUrl(track);
      audioRef.current.play().catch(err => {
        console.error('Error playing track:', err);
        setError(new Error('Failed to play track'));
      });
    }
  }, []);

  // Pause the current track
  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  // Resume the current track
  const resumeTrack = useCallback(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(err => {
        console.error('Error resuming track:', err);
        setError(new Error('Failed to resume track'));
      });
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Play the next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !playlist) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex !== -1) {
      let nextIndex;
      
      if (shuffle) {
        // Get a random index that's not the current one
        const availableIndices = playlist.tracks
          .map((_, index) => index)
          .filter(index => index !== currentIndex);
        
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        nextIndex = availableIndices[randomIndex];
      } else {
        // Just get the next sequential track
        nextIndex = (currentIndex + 1) % playlist.tracks.length;
      }
      
      playTrack(playlist.tracks[nextIndex]);
    }
  }, [currentTrack, playlist, shuffle, playTrack]);

  // Play the previous track
  const previousTrack = useCallback(() => {
    if (!currentTrack || !playlist) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex !== -1) {
      let prevIndex;
      
      if (shuffle) {
        // Get a random index that's not the current one
        const availableIndices = playlist.tracks
          .map((_, index) => index)
          .filter(index => index !== currentIndex);
        
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        prevIndex = availableIndices[randomIndex];
      } else {
        // Get the previous sequential track
        prevIndex = currentIndex === 0 ? playlist.tracks.length - 1 : currentIndex - 1;
      }
      
      playTrack(playlist.tracks[prevIndex]);
    }
  }, [currentTrack, playlist, shuffle, playTrack]);

  // Seek to a specific time
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(!shuffle);
  }, [shuffle]);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    const modes: Array<'off' | 'track' | 'playlist'> = ['off', 'track', 'playlist'];
    const currentIndex = modes.indexOf(repeat);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeat(modes[nextIndex]);
  }, [repeat]);

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  // Load a playlist
  const loadPlaylist = useCallback((newPlaylist: MusicPlaylist) => {
    const formattedPlaylist = ensurePlaylist(newPlaylist);
    setPlaylist(formattedPlaylist);
    setCurrentPlaylist(formattedPlaylist);
    
    if (formattedPlaylist.tracks.length > 0 && (!currentTrack || !isPlaying)) {
      playTrack(formattedPlaylist.tracks[0]);
    }
  }, [currentTrack, isPlaying, playTrack]);

  // Shuffle the current playlist
  const shufflePlaylist = useCallback(() => {
    if (!playlist || playlist.tracks.length <= 1) return;
    
    const shuffledTracks = [...playlist.tracks];
    for (let i = shuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
    }
    
    setPlaylist({
      ...playlist,
      tracks: shuffledTracks
    });
  }, [playlist]);

  // Load a playlist for a specific emotion
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionKey = typeof params === 'string' ? params : params.emotion;
      const playlist = getPlaylistByEmotion(emotionKey);
      
      if (playlist) {
        loadPlaylist(playlist);
        return playlist;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError(err instanceof Error ? err : new Error('Failed to load playlist for emotion'));
      return null;
    }
  }, [loadPlaylist]);

  // Get a recommendation based on emotion
  const getRecommendationByEmotion = useCallback(async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      const emotionKey = typeof params === 'string' ? params : params.emotion;
      return getPlaylistByEmotion(emotionKey);
    } catch (err) {
      console.error('Error getting recommendation for emotion:', err);
      setError(err instanceof Error ? err : new Error('Failed to get recommendation for emotion'));
      return null;
    }
  }, []);

  // Generate music based on a prompt (mock implementation)
  const generateMusic = useCallback(async (prompt: string): Promise<MusicTrack> => {
    try {
      // Mock implementation - would connect to an API in production
      console.log('Generating music based on prompt:', prompt);
      
      // Create a mock track as if it was generated
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated: ${prompt.slice(0, 20)}${prompt.length > 20 ? '...' : ''}`,
        artist: 'AI Composer',
        url: '/audio/generated-track.mp3',
        duration: 180,
        genre: 'Generated',
        tags: ['generated', 'ai'],
        mood: prompt.includes('calm') ? ['calm'] : prompt.includes('energy') ? ['energy'] : ['ambient'],
      };
      
      // In a real implementation, this would call an API and return the actual track
      return generatedTrack;
    } catch (err) {
      console.error('Error generating music:', err);
      setError(err instanceof Error ? err : new Error('Failed to generate music'));
      throw err;
    }
  }, []);

  // Find tracks by mood
  const findTracksByMood = useCallback((mood: string): MusicTrack[] => {
    if (!playlist) return [];
    
    return playlist.tracks.filter(track => {
      if (Array.isArray(track.mood)) {
        return track.mood.some(m => m.toLowerCase() === mood.toLowerCase());
      }
      if (typeof track.mood === 'string') {
        return track.mood.toLowerCase() === mood.toLowerCase();
      }
      return false;
    });
  }, [playlist]);

  // Add a track to the queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Clear the queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Get a playlist by ID (mock implementation)
  const getPlaylistById = useCallback((id: string): MusicPlaylist | null => {
    // Mock implementation - would connect to an API in production
    console.log('Getting playlist by ID:', id);
    return null;
  }, []);

  // Context value
  const contextValue: MusicContextType = {
    // State
    currentTrack,
    currentPlaylist,
    playlist,
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
    error,
    
    // Actions
    playTrack,
    pauseTrack,
    resumeTrack,
    previousTrack,
    nextTrack,
    setTrack: setCurrentTrack,
    setPlaylist,
    setVolume,
    setMuted,
    seekTo,
    setRepeat,
    toggleShuffle,
    toggleRepeat,
    togglePlay,
    toggleMute,
    toggleDrawer,
    setOpenDrawer,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    getPlaylistById,
    loadPlaylist,
    clearQueue,
    addToQueue,
    removeFromQueue: (trackId: string) => setQueue(prev => prev.filter(t => t.id !== trackId)),
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setIsInitialized,
    setCurrentTrack,
    shufflePlaylist,
    generateMusic,
    findTracksByMood,
    setEmotion,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
