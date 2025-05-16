
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Track, Playlist } from './types';

export interface MusicContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playlist: Track[];
  currentPlaylist: Playlist | null;
  recentPlaylists: Playlist[];
  isMuted: boolean;
  openDrawer: boolean;
  error: string | null;
  isInitialized: boolean;
  currentEmotion: string | null;
  loadPlaylistForEmotion: (emotion: string) => Promise<Playlist | null>;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlay: () => void;
  toggleMute: () => void;
  loadPlaylist: (playlist: Playlist) => void;
  setOpenDrawer: (open: boolean) => void;
  initializeMusicSystem: () => Promise<void>;
  seekTo: (time: number) => void;
  isShuffled: boolean;
  isRepeating: boolean;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  currentTime: number;
  queue: Track[];
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  setEmotionMode: (enabled: boolean) => void;
  setEmotionSync?: (enabled: boolean) => void;
  setCurrentEmotion: (emotion: string | null) => void;
  setEmotion: (emotion: string) => void;
  findRecommendedTracksForEmotion: (emotion: string, intensity?: number) => Track[];
  emotionMode: boolean;
}

// Sample tracks for demo
const SAMPLE_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Peaceful Morning',
    artist: 'Nature Sounds',
    url: '/audio/peaceful-morning.mp3',
    cover: '/images/covers/peaceful.jpg',
    duration: 180,
    emotion: 'calm',
    intensity: 2
  },
  {
    id: '2',
    title: 'Energy Boost',
    artist: 'Workout Mix',
    url: '/audio/energy-boost.mp3',
    cover: '/images/covers/energy.jpg',
    duration: 240,
    emotion: 'happy',
    intensity: 4
  },
  {
    id: '3',
    title: 'Melancholy Evening',
    artist: 'Piano Solo',
    url: '/audio/melancholy.mp3',
    cover: '/images/covers/melancholy.jpg',
    duration: 210,
    emotion: 'sad',
    intensity: 3
  }
];

// Default context value
const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  progress: 0,
  duration: 0,
  playlist: [],
  currentPlaylist: null,
  recentPlaylists: [],
  isMuted: false,
  openDrawer: false,
  error: null,
  isInitialized: false,
  currentEmotion: null,
  emotionMode: false,
  loadPlaylistForEmotion: async () => null,
  setVolume: () => {},
  setProgress: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  togglePlay: () => {},
  toggleMute: () => {},
  loadPlaylist: () => {},
  setOpenDrawer: () => {},
  initializeMusicSystem: async () => {},
  seekTo: () => {},
  isShuffled: false,
  isRepeating: false,
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  currentTime: 0,
  queue: [],
  addToQueue: () => {},
  clearQueue: () => {},
  setEmotionMode: () => {},
  setCurrentEmotion: () => {},
  setEmotion: () => {},
  findRecommendedTracksForEmotion: () => []
};

// Create context
export const MusicContext = createContext<MusicContextType>(defaultContext);

// Custom hook for using the music context
export const useMusicContext = () => useContext(MusicContext);

// Music provider component
export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [emotionMode, setEmotionMode] = useState(false);

  // Initialize the music system
  const initializeMusicSystem = async () => {
    try {
      // In a real app, this would load music configurations, user preferences, etc.
      // For demo purposes, we'll simulate loading with a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsInitialized(true);
      return;
    } catch (err) {
      setError('Failed to initialize music system');
      throw err;
    }
  };

  // Emotion to playlist mapping (for demo)
  const emotionPlaylists: Record<string, Playlist> = {
    happy: {
      id: 'happy-playlist',
      name: 'Happy Vibes',
      emotion: 'happy',
      tracks: SAMPLE_TRACKS.filter(track => track.emotion === 'happy' || track.emotion === 'joy')
    },
    sad: {
      id: 'sad-playlist',
      name: 'Reflective Moments',
      emotion: 'sad',
      tracks: SAMPLE_TRACKS.filter(track => track.emotion === 'sad' || track.emotion === 'melancholy')
    },
    calm: {
      id: 'calm-playlist',
      name: 'Peaceful Sounds',
      emotion: 'calm',
      tracks: SAMPLE_TRACKS.filter(track => track.emotion === 'calm' || track.emotion === 'relaxed')
    },
    focus: {
      id: 'focus-playlist',
      name: 'Deep Focus',
      emotion: 'focus',
      tracks: SAMPLE_TRACKS
    },
    energetic: {
      id: 'energetic-playlist',
      name: 'Energy Boost',
      emotion: 'energetic',
      tracks: SAMPLE_TRACKS.filter(track => track.emotion === 'happy' || track.emotion === 'energetic')
    },
    neutral: {
      id: 'neutral-playlist',
      name: 'Balanced Mix',
      emotion: 'neutral',
      tracks: SAMPLE_TRACKS
    }
  };

  // Load a playlist based on an emotion
  const loadPlaylistForEmotion = async (emotion: string): Promise<Playlist | null> => {
    try {
      // Get emotion in lowercase for consistent matching
      const normalizedEmotion = emotion.toLowerCase();
      
      // Find playlist for emotion, or use neutral as fallback
      let matchedPlaylist: Playlist | null = null;
      
      if (normalizedEmotion in emotionPlaylists) {
        matchedPlaylist = emotionPlaylists[normalizedEmotion];
      } else {
        // Handle similar emotions
        if (['joy', 'happy', 'excited'].includes(normalizedEmotion)) {
          matchedPlaylist = emotionPlaylists.happy;
        } else if (['sad', 'melancholy', 'depressed'].includes(normalizedEmotion)) {
          matchedPlaylist = emotionPlaylists.sad;
        } else if (['calm', 'relaxed', 'peaceful'].includes(normalizedEmotion)) {
          matchedPlaylist = emotionPlaylists.calm;
        } else if (['focus', 'concentrated'].includes(normalizedEmotion)) {
          matchedPlaylist = emotionPlaylists.focus;
        } else if (['energetic', 'dynamic'].includes(normalizedEmotion)) {
          matchedPlaylist = emotionPlaylists.energetic;
        } else {
          matchedPlaylist = emotionPlaylists.neutral;
        }
      }
      
      if (!matchedPlaylist) {
        return null;
      }
      
      // Load the playlist
      loadPlaylist(matchedPlaylist);
      setCurrentEmotion(normalizedEmotion);
      
      return matchedPlaylist;
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError('Failed to load playlist for emotion');
      return null;
    }
  };

  // Set the current emotion
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  // Play a track
  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
    setDuration(track.duration || 0);
  };

  // Pause the current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Skip to the next track
  const nextTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    // Check queue first
    if (queue.length > 0) {
      const nextItem = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextItem);
      return;
    }
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    playTrack(playlist[nextIndex]);
  };

  // Go to the previous track
  const previousTrack = () => {
    if (!currentTrack || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    playTrack(playlist[prevIndex]);
  };

  // Load a playlist and start playing the first track
  const loadPlaylist = (newPlaylist: Playlist) => {
    setPlaylist(newPlaylist.tracks);
    setCurrentPlaylist(newPlaylist);
    
    // Add to recent playlists
    setRecentPlaylists(prev => {
      const filtered = prev.filter(p => p.id !== newPlaylist.id);
      return [newPlaylist, ...filtered].slice(0, 5);
    });
    
    // Start playing the first track if available
    if (newPlaylist.tracks.length > 0) {
      playTrack(newPlaylist.tracks[0]);
    }
  };

  // Seek to a specific time in the track
  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  // Toggle shuffle mode
  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  // Toggle repeat mode
  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  // Add a track to the queue
  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  // Clear the queue
  const clearQueue = () => {
    setQueue([]);
  };

  // Find tracks based on emotion and intensity
  const findRecommendedTracksForEmotion = (emotion: string, intensity?: number): Track[] => {
    const matchingTracks = SAMPLE_TRACKS.filter(track => 
      track.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    if (intensity !== undefined && matchingTracks.length > 0) {
      return matchingTracks.sort((a, b) => {
        const aIntensity = a.intensity || 0;
        const bIntensity = b.intensity || 0;
        return Math.abs(aIntensity - intensity) - Math.abs(bIntensity - intensity);
      });
    }
    
    return matchingTracks.length > 0 ? matchingTracks : SAMPLE_TRACKS;
  };

  // Context value
  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    playlist,
    currentPlaylist,
    recentPlaylists,
    isMuted,
    openDrawer,
    error,
    isInitialized,
    currentEmotion,
    emotionMode,
    loadPlaylistForEmotion,
    setVolume,
    setProgress,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    togglePlay,
    toggleMute,
    loadPlaylist,
    setOpenDrawer,
    initializeMusicSystem,
    seekTo,
    isShuffled,
    isRepeating,
    toggleShuffle,
    toggleRepeat,
    currentTime,
    queue,
    addToQueue,
    clearQueue,
    setEmotionMode,
    setCurrentEmotion,
    setEmotion,
    findRecommendedTracksForEmotion
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;
