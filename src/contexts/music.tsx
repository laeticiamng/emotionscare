
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicPreset, MusicContextType, EmotionMusicParams } from '@/types/music';
import { musicPresets, allTracks } from '@/data/musicData';

// Create the context with a default value
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  currentTime: 0,
  muted: false,
  isInitialized: false,
  emotion: null,
  openDrawer: false,
  isRepeating: false,
  isShuffled: false,
  
  // Dummy methods
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlayPause: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  prevTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  setMute: () => {},
  toggleMute: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  setPlaylist: () => {},
  setCurrentTrack: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrackState] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawerState] = useState(false);
  const [muted, setMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Set initialized when component mounts
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  // Handle track end
  const handleTrackEnd = () => {
    if (isRepeating) {
      // Replay the same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextTrack();
    }
  };

  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrackState(track);
    setIsPlaying(true);
    // Audio element will autoplay when src changes due to effect
  };

  // Pause current track
  const pauseTrack = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  // Resume current track
  const resumeTrack = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      if (currentTrack) {
        resumeTrack();
      } else if (allTracks.length > 0) {
        playTrack(allTracks[0]);
      }
    }
  };

  // Alias for togglePlayPause
  const togglePlay = togglePlayPause;

  // Set volume
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  // Seek to position
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Play next track in playlist
  const nextTrack = () => {
    if (!currentTrack || !playlist || !playlist.tracks.length) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % playlist.tracks.length;
    playTrack(playlist.tracks[nextIndex]);
  };

  // Play previous track in playlist
  const prevTrack = () => {
    if (!currentTrack || !playlist || !playlist.tracks.length) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    playTrack(playlist.tracks[prevIndex]);
  };

  // Alias for prevTrack
  const previousTrack = prevTrack;

  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  // Add to queue
  const addToQueue = (track: MusicTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  // Clear queue
  const clearQueue = () => {
    setQueue([]);
  };

  // Set playlist
  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      // Convert array of tracks to a playlist object
      const newPlaylist: MusicPlaylist = {
        id: `dynamic-${Date.now()}`,
        name: 'Dynamic Playlist',
        tracks: input
      };
      setPlaylistState(newPlaylist);
    } else {
      setPlaylistState(input);
    }
  };

  // Set current track
  const setCurrentTrack = (track: MusicTrack) => {
    setCurrentTrackState(track);
  };

  // Set emotion
  const setEmotion = (newEmotion: string) => {
    setEmotionState(newEmotion);
  };

  // Set open drawer state
  const setOpenDrawer = (open: boolean) => {
    setOpenDrawerState(open);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setOpenDrawerState(!openDrawer);
  };

  // Close drawer
  const closeDrawer = () => {
    setOpenDrawerState(false);
  };

  // Load playlist for emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Find tracks with matching emotion/mood
      const matchingTracks = allTracks.filter(
        track => 
          track.emotion?.toLowerCase() === emotionName.toLowerCase() || 
          track.mood?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotionName}-${Date.now()}`,
          name: `${emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} Playlist`,
          tracks: matchingTracks,
          emotion: emotionName,
          description: `Generated playlist for ${emotionName} emotion`
        };
        
        setPlaylistState(newPlaylist);
        
        // Set first track as current if we don't have one
        if (!currentTrack) {
          setCurrentTrackState(matchingTracks[0]);
        }
        
        return newPlaylist;
      }
      
      // Fallback to first preset if no matching tracks
      if (allTracks.length > 0) {
        const fallbackPlaylist: MusicPlaylist = {
          id: `fallback-${Date.now()}`,
          name: `Recommended Playlist`,
          tracks: allTracks.slice(0, 5),
          description: `Fallback playlist when no ${emotionName} tracks found`
        };
        
        setPlaylistState(fallbackPlaylist);
        
        // Set first track as current if we don't have one
        if (!currentTrack) {
          setCurrentTrackState(allTracks[0]);
        }
        
        return fallbackPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      setError(error instanceof Error ? error : new Error('Failed to load playlist'));
      return null;
    }
  };

  // Get recommendations by emotion
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | MusicTrack[]> => {
    const emotionName = typeof params === 'string' ? params : params.emotion;
    
    // Find tracks with matching emotion/mood
    const matchingTracks = allTracks.filter(
      track => 
        track.emotion?.toLowerCase() === emotionName.toLowerCase() || 
        track.mood?.toLowerCase() === emotionName.toLowerCase()
    );
    
    if (matchingTracks.length > 0) {
      return matchingTracks;
    }
    
    // Fallback to first few tracks if no matching tracks
    return allTracks.slice(0, 3);
  };

  // Find tracks by mood
  const findTracksByMood = (mood: string): MusicTrack[] => {
    return allTracks.filter(
      track => track.mood?.toLowerCase() === mood.toLowerCase() || track.emotion?.toLowerCase() === mood.toLowerCase()
    );
  };

  // Mock implementation of AI music generation
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // Mock delay for API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock track based on the prompt
      const newTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `AI Generation: ${prompt.substring(0, 20)}...`,
        artist: 'AI Composer',
        duration: 180, // 3 minutes
        audioUrl: '/audio/sample.mp3', // Default sample
        coverUrl: '/images/covers/generated.jpg',
        emotion: 'calm', // Default emotion
        genre: 'Electronic',
        year: new Date().getFullYear()
      };
      
      return newTrack;
    } catch (error) {
      console.error("Error generating music:", error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  // Effect to handle play/pause state
  useEffect(() => {
    if (isPlaying && audioRef.current && currentTrack) {
      const audioSrc = currentTrack.audioUrl || currentTrack.url || currentTrack.src || currentTrack.track_url || '';
      if (audioRef.current.src !== audioSrc && audioSrc) {
        audioRef.current.src = audioSrc;
      }
      
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
        setError(err instanceof Error ? err : new Error('Failed to play audio'));
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Effect to set initial volume and muted state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, []);

  // Provide the context value
  const value: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    duration,
    currentTime,
    muted,
    isInitialized,
    emotion,
    openDrawer,
    error,
    isRepeating,
    isShuffled,
    queue,
    progress,
    
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlayPause,
    togglePlay,
    nextTrack,
    previousTrack,
    prevTrack,
    seekTo,
    setVolume,
    setMute,
    toggleMute,
    setEmotion,
    loadPlaylistForEmotion,
    setOpenDrawer,
    toggleDrawer,
    closeDrawer,
    setPlaylist,
    setCurrentTrack,
    getRecommendationByEmotion,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue,
    findTracksByMood,
    generateMusic,
    setProgress,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        onError={() => setError(new Error('Audio playback error'))}
        style={{ display: 'none' }}
      />
    </MusicContext.Provider>
  );
};

// Export the hook for easy context usage
export const useMusic = () => useContext(MusicContext);

export default MusicContext;
