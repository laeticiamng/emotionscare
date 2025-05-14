
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/types';
import { MusicContextType } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

// Initialize with default values that match the MusicContextType interface
const defaultContext: MusicContextType = {
  // Playback control
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  previousTrack: () => {},

  // Drawer control
  setOpenDrawer: () => {},

  // Track & playlist state
  tracks: [],
  currentTrack: null,
  playlists: [],
  loadPlaylistById: () => {},

  // Emotion-based recommendation
  currentEmotion: 'neutral',
  setEmotion: () => {},

  // Volume & mute control
  isMuted: false,
  toggleMute: () => {},
  adjustVolume: () => {},

  // System state
  isInitialized: false,
  initializeMusicSystem: () => {},
  error: null,

  // Need to maintain backward compatibility with the existing implementation
  loadPlaylistForEmotion: async () => null,
  isPlaying: false,
  volume: 0.7,
  play: () => {},
  pause: () => {},
  setVolume: () => {},
  openDrawer: false,
  currentPlaylist: null,
  resumeTrack: () => {},
  progress: 0,
  duration: 0,
  seekTo: () => {},
  formatTime: () => '',
  isShuffled: false,
  isRepeating: false,
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  isMuted: false,
  toggleMute: () => {},
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const getMockPlaylistForEmotion = useCallback((emotion: string): MusicPlaylist => {
    // Mock playlists based on emotion
    const playlists: Record<string, MusicPlaylist> = {
      joy: {
        id: 'joy-playlist',
        name: 'Happy Vibes',
        title: 'Happy Vibes',
        tracks: [
          { id: 'joy-1', title: 'Walking on Sunshine', artist: 'Katrina & The Waves', audioUrl: '/audio/happy-1.mp3', url: '/audio/happy-1.mp3', duration: 180, coverUrl: '' },
          { id: 'joy-2', title: 'Happy', artist: 'Pharrell Williams', audioUrl: '/audio/happy-2.mp3', url: '/audio/happy-2.mp3', duration: 240, coverUrl: '' },
        ]
      },
      sadness: {
        id: 'sadness-playlist',
        name: 'Comfort Zone',
        title: 'Comfort Zone',
        tracks: [
          { id: 'sad-1', title: 'Someone Like You', artist: 'Adele', audioUrl: '/audio/sad-1.mp3', url: '/audio/sad-1.mp3', duration: 240, coverUrl: '' },
          { id: 'sad-2', title: 'Fix You', artist: 'Coldplay', audioUrl: '/audio/sad-2.mp3', url: '/audio/sad-2.mp3', duration: 270, coverUrl: '' },
        ]
      },
      neutral: {
        id: 'neutral-playlist',
        name: 'Balanced Mood',
        title: 'Balanced Mood',
        tracks: [
          { id: 'neutral-1', title: 'Weightless', artist: 'Marconi Union', audioUrl: '/audio/neutral-1.mp3', url: '/audio/neutral-1.mp3', duration: 320, coverUrl: '' },
          { id: 'neutral-2', title: 'Gymnopédie No.1', artist: 'Erik Satie', audioUrl: '/audio/neutral-2.mp3', url: '/audio/neutral-2.mp3', duration: 180, coverUrl: '' },
        ]
      },
      calm: {
        id: 'calm-playlist',
        name: 'Peaceful Moments',
        title: 'Peaceful Moments',
        tracks: [
          { id: 'calm-1', title: 'Meditation Ambience', artist: 'Zen Sounds', audioUrl: '/audio/calm-1.mp3', url: '/audio/calm-1.mp3', duration: 360, coverUrl: '' },
          { id: 'calm-2', title: 'Ocean Waves', artist: 'Nature Sounds', audioUrl: '/audio/calm-2.mp3', url: '/audio/calm-2.mp3', duration: 300, coverUrl: '' },
        ]
      },
    };
    
    // Default to neutral if the emotion isn't recognized
    return playlists[emotion.toLowerCase()] || playlists.neutral;
  }, []);

  // Initialize the music system
  const initializeMusicSystem = useCallback(async () => {
    try {
      console.log('Initializing music system...');
      // Simulate an API call to load playlists
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create mock playlists
      const mockPlaylists = [
        getMockPlaylistForEmotion('neutral'),
        getMockPlaylistForEmotion('joy'),
        getMockPlaylistForEmotion('calm'),
        getMockPlaylistForEmotion('sadness')
      ];
      
      setPlaylists(mockPlaylists);
      setIsInitialized(true);
      setError(null);
      
      toast({
        title: "Système musical initialisé",
        description: "Les playlists ont été chargées avec succès",
      });
    } catch (err) {
      console.error('Error initializing music system:', err);
      setError('Failed to initialize music system');
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible de charger les playlists",
        variant: "destructive",
      });
    }
  }, [getMockPlaylistForEmotion, toast]);

  useEffect(() => {
    // Auto-initialize on mount if not already initialized
    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized, initializeMusicSystem]);

  // Load a playlist by ID
  const loadPlaylistById = useCallback((id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist) {
      setCurrentPlaylist(playlist);
      setTracks(playlist.tracks);
      return playlist;
    }
    return null;
  }, [playlists]);

  // Load a playlist based on emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    try {
      console.log(`Loading playlist for emotion: ${emotion}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const playlist = getMockPlaylistForEmotion(emotion);
      setCurrentPlaylist(playlist);
      setTracks(playlist.tracks);
      setCurrentEmotion(emotion);
      
      return playlist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      setError('Failed to load playlist');
      return null;
    }
  }, [getMockPlaylistForEmotion]);

  // Set the emotion
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);

  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    console.log('Playing track:', track);
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  // Pause the current track
  const pauseTrack = useCallback(() => {
    console.log('Pausing playback');
    setIsPlaying(false);
  }, []);

  // Resume the current track
  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      console.log('Resuming playback:', currentTrack);
      setIsPlaying(true);
    }
  }, [currentTrack]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Play next track
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      const nextTrack = currentPlaylist.tracks[currentIndex + 1];
      playTrack(nextTrack);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  // Play previous track
  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = currentPlaylist.tracks[currentIndex - 1];
      playTrack(prevTrack);
    }
  }, [currentPlaylist, currentTrack, playTrack]);

  // Set volume
  const setVolumeValue = useCallback((value: number) => {
    const clampedValue = Math.max(0, Math.min(1, value));
    setVolume(clampedValue);
    if (clampedValue > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  // Adjust volume
  const adjustVolume = useCallback((change: number) => {
    setVolume(prev => {
      const newVolume = Math.max(0, Math.min(1, prev + change));
      if (newVolume > 0 && isMuted) {
        setIsMuted(false);
      }
      return newVolume;
    });
  }, [isMuted]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Seek to position
  const seekTo = useCallback((time: number) => {
    console.log('Seeking to:', time);
    setProgress(time);
  }, []);

  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);

  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);

  // For backward compatibility
  const play = useCallback(() => {
    if (currentTrack) {
      resumeTrack();
    } else if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  }, [currentTrack, tracks, resumeTrack, playTrack]);

  const pause = pauseTrack;

  const value: MusicContextType = {
    // Playback control
    playTrack,
    pauseTrack,
    togglePlay,
    nextTrack,
    previousTrack,

    // Drawer control
    setOpenDrawer,

    // Track & playlist state
    tracks,
    currentTrack,
    playlists,
    loadPlaylistById,

    // Emotion-based recommendation
    currentEmotion,
    setEmotion,

    // Volume & mute control
    isMuted,
    toggleMute,
    adjustVolume,

    // System state
    isInitialized,
    initializeMusicSystem,
    error,

    // For backward compatibility
    loadPlaylistForEmotion,
    isPlaying,
    volume,
    play,
    pause,
    setVolume: setVolumeValue,
    openDrawer,
    currentPlaylist,
    resumeTrack,
    progress,
    duration,
    seekTo,
    formatTime,
    isShuffled,
    isRepeating,
    toggleShuffle,
    toggleRepeat,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  
  return context;
};
