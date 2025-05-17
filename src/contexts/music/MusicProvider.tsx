
import React, { useState, useEffect, useRef } from 'react';
import MusicContext from '@/contexts/MusicContext';
import { MusicTrack, MusicPlaylist } from '@/types/music';

// Placeholder mock data if needed
const mockPlaylists: MusicPlaylist[] = [];

const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [recommendations, setRecommendations] = useState<MusicPlaylist[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const initializeMusicSystem = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    setIsInitialized(true);
  };
  
  useEffect(() => {
    initializeMusicSystem();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) {
      initializeMusicSystem();
    }
    
    if (audioRef.current) {
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.play().then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing track:', error);
        setError(error as Error);
      });
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error resuming track:', error);
          setError(error as Error);
        });
    }
  };
  
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop back to the first track
      playTrack(playlist.tracks[0]);
    }
  };
  
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  
  const loadPlaylistForEmotion = async (emotion: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentEmotion(emotion);
    
    try {
      // In a real application, this would be an API call
      // For now we'll use a placeholder
      const emotionPlaylist = mockPlaylists.find(p => p.emotion === emotion || p.mood === emotion);
      
      if (emotionPlaylist) {
        setPlaylist(emotionPlaylist);
        if (emotionPlaylist.tracks.length > 0 && !isPlaying) {
          playTrack(emotionPlaylist.tracks[0]);
        }
        return emotionPlaylist;
      } else {
        // Create a placeholder playlist
        const newPlaylist: MusicPlaylist = {
          id: `playlist-${emotion}-${Date.now()}`,
          name: `${emotion} Music`,
          emotion: emotion,
          tracks: [],
          description: `Music to match your ${emotion} mood`
        };
        setPlaylist(newPlaylist);
        return newPlaylist;
      }
    } catch (err) {
      setError(err as Error);
      console.error('Error loading playlist for emotion:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
    loadPlaylistForEmotion(emotion);
  };
  
  // Provide the context value
  const musicContextValue = {
    isInitialized,
    currentTrack,
    isPlaying,
    volume,
    muted,
    isMuted: muted,
    currentTime,
    duration,
    playlist,
    recommendations,
    isLoading,
    error,
    currentEmotion,
    emotion: currentEmotion,
    openDrawer,
    setOpenDrawer,
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleMute,
    loadPlaylistForEmotion,
    setEmotion,
    initializeMusicSystem
  };
  
  return (
    <MusicContext.Provider value={musicContextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
