import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { getMockMusicData } from './mockMusicData';

// Create context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  muted: false,
  currentTime: 0,
  duration: 0,
  playlist: null,
  emotion: null,
  openDrawer: false,
  isInitialized: false,
  isLoading: false,
  error: null,
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
  toggleMute: () => {},
});

// Hook to use the music context
export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

// Music provider component
export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize music data and audio element
  useEffect(() => {
    try {
      const { mockPlaylists } = getMockMusicData();
      setPlaylists(mockPlaylists);

      const audio = new Audio();
      audio.volume = volume;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration || 0);
      const handleEnded = () => nextTrack();
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      setAudioElement(audio);
      setIsInitialized(true);
      
      return () => {
        audio.pause();
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error initializing music context'));
      return () => {};
    }
  }, []);

  // Update audio URL when track changes
  useEffect(() => {
    if (audioElement && currentTrack) {
      const trackUrl = currentTrack.url || currentTrack.audioUrl;
      if (trackUrl) {
        audioElement.src = trackUrl;
        audioElement.load();
        if (isPlaying) {
          audioElement.play().catch(err => {
            console.error("Error playing track:", err);
            setError(err instanceof Error ? err : new Error('Error playing track'));
          });
        }
      }
    }
  }, [currentTrack, audioElement]);

  // Update playing state
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
          setError(err instanceof Error ? err : new Error('Error playing audio'));
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  // Update volume
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioElement]);

  // Play track function
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Pause track function
  const pauseTrack = () => {
    setIsPlaying(false);
  };

  // Resume track function
  const resumeTrack = () => {
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Set volume function
  const setVolume = (value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
  };

  // Seek to position
  const seekTo = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  // Next track function
  const nextTrack = () => {
    if (playlist?.tracks && currentTrack) {
      const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex >= 0 && currentIndex < playlist.tracks.length - 1) {
        playTrack(playlist.tracks[currentIndex + 1]);
      } else if (currentIndex === playlist.tracks.length - 1) {
        // Loop back to first track
        playTrack(playlist.tracks[0]);
      }
    }
  };

  // Previous track function
  const prevTrack = () => {
    if (playlist?.tracks && currentTrack) {
      const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        playTrack(playlist.tracks[currentIndex - 1]);
      } else if (currentIndex === 0) {
        // Loop to last track
        playTrack(playlist.tracks[playlist.tracks.length - 1]);
      }
    }
  };

  // Alias for prevTrack
  const previousTrack = prevTrack;

  // Load playlist for emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      const { emotion, intensity = 0.5 } = params;
      
      // Find playlist that matches the emotion
      let matchedPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotion.toLowerCase()
      );
      
      // If no direct match, use a default playlist
      if (!matchedPlaylist && playlists.length > 0) {
        matchedPlaylist = playlists[0];
      }
      
      if (matchedPlaylist) {
        setPlaylist(matchedPlaylist);
        
        // Auto-play first track if there are tracks
        if (matchedPlaylist.tracks && matchedPlaylist.tracks.length > 0) {
          setCurrentTrack(matchedPlaylist.tracks[0]);
          setIsPlaying(true);
        }
        
        setIsLoading(false);
        return matchedPlaylist;
      } 
      
      setIsLoading(false);
      return null;
    } catch (err) {
      console.error("Error loading playlist for emotion:", err);
      setError(err instanceof Error ? err : new Error('Error loading playlist'));
      setIsLoading(false);
      return null;
    }
  };

  return (
    <MusicContext.Provider value={{
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
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
