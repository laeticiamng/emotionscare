
import React, { useState, useEffect, useRef } from 'react';
import MusicContext from './MusicContext';
import { MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { toast } from '@/hooks/use-toast';

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawerState] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Set up audio event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', handleTrackEnd);
      audioRef.current.addEventListener('error', handleError);
    }
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const handleError = (e: Event) => {
    console.error('Audio error:', e);
    setError(new Error('Failed to play audio'));
    toast({
      title: "Audio Error",
      description: "There was a problem playing the track.",
      variant: "destructive"
    });
  };
  
  // Music playback controls
  const playTrack = (track: MusicTrack) => {
    if (!track.audioUrl && !track.url && !track.track_url) {
      setError(new Error('No audio URL provided for this track'));
      return;
    }
    
    setCurrentTrack(track);
    
    if (audioRef.current) {
      // Use the appropriate URL property
      const trackUrl = track.audioUrl || track.url || track.track_url;
      audioRef.current.src = trackUrl || '';
      audioRef.current.volume = volume;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error playing track:', err);
          setError(err);
          setIsPlaying(false);
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
        .catch(err => {
          console.error('Error resuming track:', err);
          setError(err);
        });
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    }
  };
  
  const nextTrack = () => {
    if (!playlist || !playlist.tracks || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => 
      track.id === currentTrack.id
    );
    
    if (currentIndex !== -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };
  
  const previousTrack = () => {
    if (!playlist || !playlist.tracks || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => 
      track.id === currentTrack.id
    );
    
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };
  
  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolumeState(newVolume);
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };
  
  const seekTo = (position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setCurrentTime(position);
    }
  };
  
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For now, just a mock implementation - in a real app, this would call an API
      const emotionName = typeof params === 'string' ? params : params.emotion;
      setEmotionState(emotionName);
      setCurrentEmotion(emotionName); // Mettre à jour currentEmotion
      
      // Mock data for demonstration
      const mockPlaylist: MusicPlaylist = {
        id: `playlist-${emotionName}`,
        name: `${emotionName} Music`,
        description: `Music tailored for ${emotionName} mood`,
        tracks: [
          {
            id: `track-1-${emotionName}`,
            title: `${emotionName} Track 1`,
            artist: 'Artist 1',
            audioUrl: '/sounds/ambient-calm.mp3', // Using the included sound file
            duration: 180
          },
          {
            id: `track-2-${emotionName}`,
            title: `${emotionName} Track 2`,
            artist: 'Artist 2',
            audioUrl: '/sounds/welcome.mp3', // Using the included sound file
            duration: 210
          }
        ],
        emotion: emotionName
      };
      
      setPlaylist(mockPlaylist);
      
      // Auto-play the first track if available
      if (mockPlaylist.tracks && mockPlaylist.tracks.length > 0) {
        playTrack(mockPlaylist.tracks[0]);
      }
      
      return mockPlaylist;
    } catch (err) {
      console.error('Error loading playlist:', err);
      setError(err instanceof Error ? err : new Error('Failed to load playlist'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const setEmotion = (newEmotion: string) => {
    setEmotionState(newEmotion);
    setCurrentEmotion(newEmotion);
  };
  
  const setOpenDrawer = (open: boolean) => {
    setOpenDrawerState(open);
  };
  
  const value = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    progress: duration ? (currentTime / duration) * 100 : 0,
    isLoading,
    error,
    emotion,
    currentEmotion,
    openDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    seekTo,
    loadPlaylistForEmotion,
    setEmotion,
    setOpenDrawer,
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};
