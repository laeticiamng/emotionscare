
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { mockPlaylists, mockTracks } from './mockData';

const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  playlist: null as unknown as MusicPlaylist,
  emotion: null,
  openDrawer: false,
  isInitialized: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  toggleMute: () => {}
};

export const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      setIsInitialized(true);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);

  // Handle track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioSrc = currentTrack.src || currentTrack.audioUrl || currentTrack.track_url;
      
      if (audioSrc) {
        audioRef.current.src = audioSrc;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error("Error playing audio:", err);
            setIsPlaying(false);
          });
        }
      } else {
        console.error("No audio source found for track:", currentTrack);
      }
    }
  }, [currentTrack]);

  // Handle play/pause changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration || 0);
      const handleEnded = () => nextTrack();
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Pause current track
  const pauseTrack = () => {
    setIsPlaying(false);
  };

  // Resume current track
  const resumeTrack = () => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const tracks = Array.isArray(playlist) ? playlist : playlist.tracks;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex > -1 && currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    } else if (tracks.length > 0) {
      // Loop back to first track
      playTrack(tracks[0]);
    }
  };

  // Play previous track
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const tracks = Array.isArray(playlist) ? playlist : playlist.tracks;
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    
    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1]);
    } else if (tracks.length > 0) {
      // Loop to last track
      playTrack(tracks[tracks.length - 1]);
    }
  };

  // Set volume
  const setVolume = (newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  // Seek to position
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Set playlist
  const setPlaylist = (newPlaylist: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(newPlaylist)) {
      // Convert array to playlist object
      const playlistObj: MusicPlaylist = {
        id: `playlist-${Date.now()}`,
        name: 'Custom Playlist',
        tracks: newPlaylist
      };
      setPlaylistState(playlistObj);
    } else {
      setPlaylistState(newPlaylist);
    }
  };

  // Set emotion
  const setEmotion = (newEmotion: string) => {
    setEmotionState(newEmotion);
    loadPlaylistForEmotion({ emotion: newEmotion });
  };

  // Load playlist for emotion
  const loadPlaylistForEmotion = async ({ emotion, intensity }: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find or create a playlist for this emotion
      const emotionPlaylist = mockPlaylists.find(p => p.emotion?.toLowerCase() === emotion.toLowerCase());
      
      if (emotionPlaylist) {
        setPlaylistState(emotionPlaylist);
        return emotionPlaylist;
      } else {
        // Create a new playlist with tracks that match the emotion
        const matchingTracks = mockTracks.filter(t => 
          t.emotion?.toLowerCase() === emotion.toLowerCase()
        );
        
        if (matchingTracks.length > 0) {
          const newPlaylist: MusicPlaylist = {
            id: `emotion-playlist-${Date.now()}`,
            name: `${emotion} Playlist`,
            emotion: emotion,
            tracks: matchingTracks
          };
          
          setPlaylistState(newPlaylist);
          return newPlaylist;
        }
      }
      
      return null;
    } catch (err: any) {
      const error = new Error(err?.message || 'Failed to load playlist');
      setError(error);
      console.error("Error loading emotion playlist:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Alias previous for backwards compatibility
  const previousTrack = prevTrack;

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    playlist,
    emotion,
    openDrawer,
    isInitialized,
    isLoading,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    previousTrack,
    setVolume,
    seekTo,
    setEmotion,
    loadPlaylistForEmotion,
    setOpenDrawer,
    toggleMute
  };

  return (
    <MusicContext.Provider value={value}>
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
