import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { relaxingNatureSounds, focusBeats, energyBoost, calmMeditation } from '@/data/music';
import { getPlaylistByEmotion } from '@/data/emotionPlaylists';
import { getTrackUrl, ensurePlaylist, normalizeTrack } from '@/utils/musicCompatibility';

// Create the context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  playlist: null,
  queue: [],
  isPlaying: false,
  volume: 1,
  muted: false,
  currentTime: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  openDrawer: false,
  isInitialized: false,
  error: null,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  previousTrack: () => {},
  nextTrack: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.addEventListener('ended', handleTrackEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      audio.removeEventListener('ended', handleTrackEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.pause();
    };
  }, []);

  // Handle track ended event
  const handleTrackEnded = useCallback(() => {
    if (repeat === 'track' && currentTrack) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(err => console.error('Error replaying track:', err));
      }
    } else {
      nextTrack();
    }
  }, [repeat, currentTrack]);

  // Handle time update from audio element
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  }, []);

  // Handle loaded metadata from audio element
  const handleLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  }, []);

  // Load and play a track
  const playTrack = useCallback((track: MusicTrack) => {
    const audio = audioRef.current;
    if (audio) {
      const trackUrl = getTrackUrl(track);
      audio.src = trackUrl;
      audio.volume = volume;
      audio.muted = muted;
      
      audio.play()
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Error playing track:', err);
          setError(new Error(`Unable to play track: ${err.message}`));
        });
    }
  }, [volume, muted]);

  // Pause the current track
  const pauseTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  // Resume the current track
  const resumeTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error resuming track:', err);
          setError(new Error(`Unable to resume track: ${err.message}`));
        });
    }
  }, [currentTrack]);

  // Play the previous track in the queue
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.tracks.length === 0) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    } else {
      // Loop back to the last track if we're at the beginning
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Play the next track in the queue
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist || currentPlaylist.tracks.length === 0) {
      if (queue.length > 0) {
        const nextQueueTrack = queue[0];
        const newQueue = [...queue];
        newQueue.shift();
        setQueue(newQueue);
        playTrack(nextQueueTrack);
      }
      return;
    }
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    } else if (repeat === 'playlist') {
      // Loop back to the first track if we're at the end and repeat playlist is enabled
      playTrack(currentPlaylist.tracks[0]);
    } else if (queue.length > 0) {
      // Play from queue if available
      const nextQueueTrack = queue[0];
      const newQueue = [...queue];
      newQueue.shift();
      setQueue(newQueue);
      playTrack(nextQueueTrack);
    }
  }, [currentTrack, currentPlaylist, queue, repeat, playTrack]);

  // Set the volume
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  // Set the muted state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = muted;
    }
  }, [muted]);

  // Seek to a specific time in the track
  const seekTo = useCallback((time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  // Toggle mute/unmute
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setRepeat(current => {
      switch (current) {
        case 'off': return 'track';
        case 'track': return 'playlist';
        case 'playlist': return 'off';
        default: return 'off';
      }
    });
  }, []);

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  // Load a playlist
  const loadPlaylist = useCallback((playlist: MusicPlaylist) => {
    const normalizedPlaylist = ensurePlaylist(playlist);
    setCurrentPlaylist(normalizedPlaylist);
    if (normalizedPlaylist.tracks.length > 0 && (!currentTrack || shuffle)) {
      playTrack(shuffle 
        ? normalizedPlaylist.tracks[Math.floor(Math.random() * normalizedPlaylist.tracks.length)]
        : normalizedPlaylist.tracks[0]
      );
    }
  }, [currentTrack, shuffle, playTrack]);

  // Shuffle the playlist
  const shufflePlaylist = useCallback(() => {
    if (!currentPlaylist || currentPlaylist.tracks.length <= 1) return;
    
    const shuffled = [...currentPlaylist.tracks];
    let currentIndex = shuffled.length;
    
    // Fisher-Yates shuffle algorithm
    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }
    
    // Keep the current track at the first position if it exists
    if (currentTrack) {
      const currentTrackIndex = shuffled.findIndex(track => track.id === currentTrack.id);
      if (currentTrackIndex !== -1) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[currentTrackIndex];
        shuffled[currentTrackIndex] = temp;
      }
    }
    
    setCurrentPlaylist({
      ...currentPlaylist,
      tracks: shuffled
    });
  }, [currentPlaylist, currentTrack]);

  // Add a track to the queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);

  // Clear the queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Remove a track from the queue
  const removeFromQueue = useCallback((trackId: string) => {
    setQueue(prev => prev.filter(track => track.id !== trackId));
  }, []);

  // Load a playlist for a specific emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      let emotionString: string;
      let intensity: number | undefined;
      
      // Handle different parameter formats
      if (typeof emotion === 'string') {
        emotionString = emotion;
      } else {
        emotionString = emotion.emotion;
        intensity = emotion.intensity;
      }
      
      // Get matching playlist based on emotion
      let matchedPlaylist = getPlaylistByEmotion(emotionString);
      
      // If no matching playlist is found, fall back to calm playlist
      if (!matchedPlaylist) {
        console.log('No playlist found for emotion:', emotionString);
        matchedPlaylist = calmMeditation; // Default fallback
      }
      
      // Load the matched playlist
      if (matchedPlaylist) {
        loadPlaylist(matchedPlaylist);
        return matchedPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError(err instanceof Error ? err : new Error('Failed to load emotion playlist'));
      return null;
    }
  }, [loadPlaylist]);

  // Get recommendation by emotion
  const getRecommendationByEmotion = loadPlaylistForEmotion;

  // Find tracks by mood
  const findTracksByMood = useCallback((mood: string): MusicTrack[] => {
    const normalizedMood = mood.toLowerCase();
    
    // Combine tracks from all available playlists
    const allTracks: MusicTrack[] = [
      ...relaxingNatureSounds.tracks,
      ...focusBeats.tracks,
      ...energyBoost.tracks,
      ...calmMeditation.tracks
    ];
    
    // Filter tracks by mood
    return allTracks.filter(track => {
      if (track.mood) {
        if (Array.isArray(track.mood)) {
          return track.mood.some(m => m.toLowerCase() === normalizedMood);
        }
        return track.mood.toLowerCase() === normalizedMood;
      }
      if (track.emotion) {
        return track.emotion.toLowerCase() === normalizedMood;
      }
      return false;
    });
  }, []);

  // Set emotion (placeholder for future functionality)
  const setEmotion = useCallback((emotion: string) => {
    console.log('Setting emotion:', emotion);
    // In a real implementation, this might update user preferences or analytics
  }, []);

  // Simulate music generation (placeholder for API integration)
  const generateMusic = useCallback(async (prompt: string): Promise<MusicTrack> => {
    try {
      console.log('Generating music from prompt:', prompt);
      
      // In a real implementation, this would call an AI music generation API
      // For now, we'll return a mock track
      return {
        id: `generated-${Date.now()}`,
        title: `Generated: ${prompt.substring(0, 20)}${prompt.length > 20 ? '...' : ''}`,
        artist: 'AI Music Creator',
        url: '/audio/sample-generated.mp3',
        duration: 240,
        cover: '/images/covers/ai-generated.jpg',
        category: 'ambient',
        tags: ['generated', 'ai']
      };
    } catch (err) {
      console.error('Error generating music:', err);
      throw err;
    }
  }, []);

  // Get playlist by ID
  const getPlaylistById = useCallback((id: string): MusicPlaylist | null => {
    // Check in default playlists
    const allPlaylists = [
      relaxingNatureSounds,
      focusBeats,
      energyBoost,
      calmMeditation
    ];
    
    return allPlaylists.find(p => p.id === id) || null;
  }, []);

  // Context value
  const value: MusicContextType = {
    // State
    currentTrack,
    currentPlaylist,
    playlist: currentPlaylist,
    queue,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    repeat,
    shuffle,
    isShuffled: shuffle,
    isRepeating: repeat !== 'off',
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
    setPlaylist: setCurrentPlaylist,
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
    removeFromQueue,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setIsInitialized,
    setCurrentTrack,
    shufflePlaylist,
    generateMusic,
    findTracksByMood,
    setEmotion
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
